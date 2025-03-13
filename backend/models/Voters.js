const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
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
}, { timestamps: true });

const Voter = mongoose.model('Voters', voterSchema);

module.exports = Voter;
