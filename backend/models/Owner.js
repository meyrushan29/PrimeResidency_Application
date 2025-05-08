const mongoose = require('mongoose');

const OwnerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  residenceNum: {
    type: String,
    required: [true, 'Residence number is required'],
    trim: true
  },
  memberCount: {
    type: Number,
    required: true,
    default: 1,
    min: [1, 'Member count must be at least 1']
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Owner', OwnerSchema);
