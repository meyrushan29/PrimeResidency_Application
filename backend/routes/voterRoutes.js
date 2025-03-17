const express = require('express');
const multer = require('multer');
const path = require('path');
const Voter = require('../models/Voters');
const { v4: uuidv4 } = require('uuid'); // Importing UUID to generate unique voter IDs
const router = express.Router();

// Storage setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // This will save files to the 'uploads/' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Register voter (with optional photo upload)
router.post('/register', upload.single('photo'), async (req, res) => {
  try {
    const { name, email, houseId } = req.body;
    const photo = req.file ? req.file.path : null;

    // Generate unique voter ID using UUID
    const voterId = uuidv4();

    // Create new voter document
    const newVoter = new Voter({
      voterId,
      name,
      email,
      houseId,
      photo,
      verified: false, // Default to false, indicating pending verification
    });

    // Save to the database
    await newVoter.save();

    return res.status(200).json({
      message: 'Voter registration successful!',
      voter: newVoter,
    });
  } catch (error) {
    console.error('Error registering voter:', error);
    res.status(500).json({
      message: 'An error occurred during voter registration.',
      error,
    });
  }
});

// Route for getting all voters with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const voters = await Voter.find()
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalVoters = await Voter.countDocuments();
    const totalPages = Math.ceil(totalVoters / limitNumber);

    res.status(200).json({ voters, totalPages });
  } catch (error) {
    console.error('Error fetching voters:', error);
    res.status(500).json({ message: 'Failed to fetch voters.', error });
  }
});

// Route for updating voter verification status
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { verified, verificationDate } = req.body;

    // Update the verification status and set the verification date
    const updatedVoter = await Voter.findByIdAndUpdate(
      id,
      { verified, verificationDate },
      { new: true }
    );

    if (!updatedVoter) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    res.status(200).json({ message: 'Voter status updated', voter: updatedVoter });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update voter status', error });
  }
});

// Route for deleting a voter
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVoter = await Voter.findByIdAndDelete(id);

    if (!deletedVoter) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    res.status(200).json({ message: 'Voter deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete voter', error });
  }
});

module.exports = router;
