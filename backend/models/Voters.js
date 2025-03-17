const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
  voterId: {
    type: String,
    required: true,
    unique: true,
    // Remove any default value that might be generating UUIDs
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  houseId: {
    type: String,
    required: true,
  },
  photo: {
    type: String, // Path to photo
    required: false,
  },
  verified: {
    type: Boolean,
    default: false, // Default status is "pending" or unverified
  },
  registrationDate: {
    type: Date,
    default: Date.now, // Automatically sets the registration date
  },
  verificationDate: {
    type: Date,
    required: false,
  }
}, { timestamps: true });

// Disable any automatic ID generation for this field
voterSchema.pre('save', function(next) {
  // Ensure voterId is in our custom format before saving
  if (!this.voterId || !this.voterId.startsWith('VID-2029-')) {
    // If no voterId is set or it's not in our format, generate a new one
    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.voterId = `VID-2029-${timestamp}${randomSuffix}`;
  }
  next();
});

const Voter = mongoose.model('Voters', voterSchema);

module.exports = Voter;