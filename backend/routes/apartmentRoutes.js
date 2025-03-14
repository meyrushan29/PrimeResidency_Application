const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const apartmentController = require('../controller/apartmentController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'homeimg', 'apartments'); // Use path.join to resolve paths

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    cb(null, fileName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Handle multiple image uploads - 'image0', 'image1', etc.
const multipleUpload = (req, res, next) => {
  const uploadMiddleware = upload.array('images', 10); // Max 10 images
  
  uploadMiddleware(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred (e.g., file too large)
      return res.status(400).json({
        success: false,
        error: `Upload error: ${err.message}`
      });
    } else if (err) {
      // An unknown error occurred
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    // Everything went fine
    next();
  });
};

// Routes
router.route('/')
  .get(apartmentController.getAllApartments)
  .post(multipleUpload, apartmentController.createApartment);

router.route('/:id')
  .get(apartmentController.getApartment)
  .put(multipleUpload, apartmentController.updateApartment)
  .delete(apartmentController.deleteApartment);

module.exports = router;
