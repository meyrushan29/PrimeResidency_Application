// controllers/apartmentController.js
const Apartment = require('../models/Apartment');
const fs = require('fs');
const path = require('path');

// Helper function to handle error responses
const handleError = (res, error) => {
  console.error('Error:', error);
  return res.status(500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

// Create new apartment listing
exports.createApartment = async (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files || !Array.isArray(req.files) || req.files.length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Please upload at least 3 images'
      });
    }

    // Process uploaded files
    const imageFiles = req.files;
    const imagePaths = imageFiles.map(file => `/uploads/apartments/${file.filename}`);

    // Create apartment with image paths
    const apartmentData = {
      ...req.body,
      images: imagePaths,
      // Convert string "true"/"false" to boolean
      furnished: req.body.furnished === 'true'
    };

    const apartment = await Apartment.create(apartmentData);

    res.status(201).json({
      success: true,
      data: apartment
    });
  } catch (error) {
    // If error occurs, delete any uploaded images
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    
    handleError(res, error);
  }
};

// Get all apartment listings
exports.getAllApartments = async (req, res) => {
  try {
    const apartments = await Apartment.find().sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: apartments.length,
      data: apartments
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get single apartment listing
exports.getApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    
    if (!apartment) {
      return res.status(404).json({
        success: false,
        error: 'Apartment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: apartment
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Update apartment listing
exports.updateApartment = async (req, res) => {
  try {
    let apartment = await Apartment.findById(req.params.id);
    
    if (!apartment) {
      return res.status(404).json({
        success: false,
        error: 'Apartment not found'
      });
    }
    
    // Process new image uploads if any
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map(file => `/uploads/apartments/${file.filename}`);
      
      // Combine existing and new images
      const updatedImages = [...apartment.images, ...newImagePaths];
      req.body.images = updatedImages;
    }
    
    // Convert string "true"/"false" to boolean for furnished field
    if (req.body.furnished !== undefined) {
      req.body.furnished = req.body.furnished === 'true';
    }
    
    apartment = await Apartment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: apartment
    });
  } catch (error) {
    // If error occurs, delete any newly uploaded images
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    
    handleError(res, error);
  }
};

// Delete apartment listing
exports.deleteApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    
    if (!apartment) {
      return res.status(404).json({
        success: false,
        error: 'Apartment not found'
      });
    }
    
    // Delete associated images
    apartment.images.forEach(imagePath => {
      const fullPath = path.join(__dirname, '..', 'public', imagePath);
      fs.unlink(fullPath, err => {
        if (err) console.error('Error deleting image:', err);
      });
    });
    
    await apartment.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    handleError(res, error);
  }
};