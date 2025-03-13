const Voter = require('../models/Voters');
const path = require('path');

// Handle Voter Registration
const registerVoter = async (req, res) => {
  try {
    const { name, email, houseId } = req.body;
    const photo = req.file ? req.file.path : null; // Save photo if provided

    // Create new voter document
    const newVoter = new Voter({
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
    console.error(error);
    res.status(500).json({
      message: 'An error occurred during voter registration.',
      error,
    });
  }
};

module.exports = { registerVoter };
