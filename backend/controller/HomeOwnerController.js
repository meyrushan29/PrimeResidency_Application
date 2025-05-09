const Owner = require('../models/HomeOwnerModel');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads/';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp and random string
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Set up file filter for multer
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer upload
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to handle file upload fields
const uploadFields = upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'nicFront', maxCount: 1 },
  { name: 'nicBack', maxCount: 1 }
]);

// Helper function to remove file if it exists
const removeFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Get all owners
exports.getAllOwners = async (req, res) => {
  try {
    const owners = await Owner.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      owners
    });
  } catch (error) {
    console.error('Error fetching owners:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch owners'
    });
  }
};

// Get owner by ID
exports.getOwnerById = async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    
    if (!owner) {
      return res.status(404).json({
        success: false,
        error: 'Owner not found'
      });
    }
    
    res.status(200).json({
      success: true,
      owner
    });
  } catch (error) {
    console.error('Error fetching owner:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch owner'
    });
  }
};

// Create new owner
exports.createOwner = async (req, res) => {
  try {
    // Handle file uploads first
    uploadFields(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err.message
        });
      }
      
      try {
        const {
          firstName,
          lastName,
          age,
          residenceNum,
          memberCount,
          startDate,
          endDate,
          termsAccepted,
          signature, // Base64 data URL from signature canvas
          email,
          phone,
          address,
          apartmentNumber,
          notes
        } = req.body;
        
        // Validate required fields
        if (!firstName || !lastName || !age || !residenceNum || !startDate || !endDate) {
          return res.status(400).json({
            success: false,
            error: 'Please provide all required fields'
          });
        }
        
        // Create object with form data
        const ownerData = {
          firstName,
          lastName,
          age: parseInt(age),
          residenceNum,
          memberCount: parseInt(memberCount || 0),
          startDate,
          endDate,
          termsAccepted: termsAccepted === 'true' || termsAccepted === true,
          email,
          phone,
          address,
          apartmentNumber,
          notes
        };
        
        // Add file URLs if files were uploaded
        if (req.files) {
          if (req.files.profilePhoto && req.files.profilePhoto[0]) {
            ownerData.profilePhotoUrl = `/uploads/${req.files.profilePhoto[0].filename}`;
          }
          
          if (req.files.nicFront && req.files.nicFront[0]) {
            ownerData.nicFrontUrl = `/uploads/${req.files.nicFront[0].filename}`;
          }
          
          if (req.files.nicBack && req.files.nicBack[0]) {
            ownerData.nicBackUrl = `/uploads/${req.files.nicBack[0].filename}`;
          }
        }
        
        // Handle signature (base64 data URL)
        if (signature) {
          // Strip header from data URL
          const base64Data = signature.replace(/^data:image\/png;base64,/, '');
          
          // Create unique filename for signature
          const signatureFilename = `signature-${Date.now()}-${Math.round(Math.random() * 1E9)}.png`;
          const signaturePath = path.join('./uploads/', signatureFilename);
          
          // Save signature as file
          fs.writeFileSync(signaturePath, base64Data, 'base64');
          
          // Add signature URL to owner data
          ownerData.signatureUrl = `/uploads/${signatureFilename}`;
        }
        
        // Create new owner in database
        const owner = await Owner.create(ownerData);
        
        res.status(201).json({
          success: true,
          message: 'Owner created successfully',
          owner
        });
      } catch (error) {
        console.error('Error creating owner:', error);
        res.status(500).json({
          success: false,
          error: error.message || 'Failed to create owner'
        });
      }
    });
  } catch (error) {
    console.error('Error in owner creation middleware:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create owner'
    });
  }
};

// Update owner by ID
exports.updateOwner = async (req, res) => {
  try {
    // Handle file uploads first
    uploadFields(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err.message
        });
      }
      
      try {
        // Get existing owner to retrieve current file paths
        const existingOwner = await Owner.findById(req.params.id);
        
        if (!existingOwner) {
          return res.status(404).json({
            success: false,
            error: 'Owner not found'
          });
        }
        
        const {
          firstName,
          lastName,
          age,
          residenceNum,
          memberCount,
          startDate,
          endDate,
          termsAccepted,
          signature, // Base64 data URL from signature canvas
          email,
          phone,
          address,
          apartmentNumber,
          notes
        } = req.body;
        
        // Create object with form data
        const updateData = {
          firstName: firstName || existingOwner.firstName,
          lastName: lastName || existingOwner.lastName,
          age: parseInt(age) || existingOwner.age,
          residenceNum: residenceNum || existingOwner.residenceNum,
          memberCount: parseInt(memberCount || 0),
          termsAccepted: termsAccepted === 'true' || termsAccepted === true,
        };
        
        // Only update date fields if provided
        if (startDate) updateData.startDate = startDate;
        if (endDate) updateData.endDate = endDate;
        
        // Update optional fields if provided
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (address !== undefined) updateData.address = address;
        if (apartmentNumber !== undefined) updateData.apartmentNumber = apartmentNumber;
        if (notes !== undefined) updateData.notes = notes;
        
        // Handle file uploads
        if (req.files) {
          // Update profile photo if uploaded
          if (req.files.profilePhoto && req.files.profilePhoto[0]) {
            // Remove old file if exists
            if (existingOwner.profilePhotoUrl) {
              const oldPath = path.join('./public', existingOwner.profilePhotoUrl);
              removeFile(oldPath);
            }
            
            // Update with new file
            updateData.profilePhotoUrl = `/uploads/${req.files.profilePhoto[0].filename}`;
          }
          
          // Update NIC front if uploaded
          if (req.files.nicFront && req.files.nicFront[0]) {
            // Remove old file if exists
            if (existingOwner.nicFrontUrl) {
              const oldPath = path.join('./public', existingOwner.nicFrontUrl);
              removeFile(oldPath);
            }
            
            // Update with new file
            updateData.nicFrontUrl = `/uploads/${req.files.nicFront[0].filename}`;
          }
          
          // Update NIC back if uploaded
          if (req.files.nicBack && req.files.nicBack[0]) {
            // Remove old file if exists
            if (existingOwner.nicBackUrl) {
              const oldPath = path.join('./public', existingOwner.nicBackUrl);
              removeFile(oldPath);
            }
            
            // Update with new file
            updateData.nicBackUrl = `/uploads/${req.files.nicBack[0].filename}`;
          }
        }
        
        // Handle signature (base64 data URL)
        if (signature && signature !== existingOwner.signatureUrl) {
          // Remove old signature file if exists
          if (existingOwner.signatureUrl) {
            const oldPath = path.join('./public', existingOwner.signatureUrl);
            removeFile(oldPath);
          }
          
          // Strip header from data URL
          const base64Data = signature.replace(/^data:image\/png;base64,/, '');
          
          // Create unique filename for signature
          const signatureFilename = `signature-${Date.now()}-${Math.round(Math.random() * 1E9)}.png`;
          const signaturePath = path.join('./uploads/', signatureFilename);
          
          // Save signature as file
          fs.writeFileSync(signaturePath, base64Data, 'base64');
          
          // Add signature URL to update data
          updateData.signatureUrl = `/uploads/${signatureFilename}`;
        }
        
        // Update owner in database
        const updatedOwner = await Owner.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true, runValidators: true }
        );
        
        res.status(200).json({
          success: true,
          message: 'Owner updated successfully',
          owner: updatedOwner
        });
      } catch (error) {
        console.error('Error updating owner:', error);
        res.status(500).json({
          success: false,
          error: error.message || 'Failed to update owner'
        });
      }
    });
  } catch (error) {
    console.error('Error in owner update middleware:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update owner'
    });
  }
};

// Delete owner by ID
exports.deleteOwner = async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    
    if (!owner) {
      return res.status(404).json({
        success: false,
        error: 'Owner not found'
      });
    }
    
    // Remove associated files
    if (owner.profilePhotoUrl) {
      const profilePhotoPath = path.join('./public', owner.profilePhotoUrl);
      removeFile(profilePhotoPath);
    }
    
    if (owner.nicFrontUrl) {
      const nicFrontPath = path.join('./public', owner.nicFrontUrl);
      removeFile(nicFrontPath);
    }
    
    if (owner.nicBackUrl) {
      const nicBackPath = path.join('./public', owner.nicBackUrl);
      removeFile(nicBackPath);
    }
    
    if (owner.signatureUrl) {
      const signaturePath = path.join('./public', owner.signatureUrl);
      removeFile(signaturePath);
    }
    
    // Delete owner from database
    await Owner.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Owner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting owner:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete owner'
    });
  }
};

// Search owners
exports.searchOwners = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    // Create search pattern
    const searchPattern = new RegExp(query, 'i');
    
    // Search in relevant fields
    const owners = await Owner.find({
      $or: [
        { firstName: searchPattern },
        { lastName: searchPattern },
        { residenceNum: searchPattern },
        { email: searchPattern },
        { phone: searchPattern },
        { address: searchPattern },
        { apartmentNumber: searchPattern }
      ]
    });
    
    res.status(200).json({
      success: true,
      owners
    });
  } catch (error) {
    console.error('Error searching owners:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to search owners'
    });
  }
};