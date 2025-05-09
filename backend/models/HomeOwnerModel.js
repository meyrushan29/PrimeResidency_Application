const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ownerSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [1, 'Age must be a positive number']
  },
  residenceNum: {
    type: String,
    required: [true, 'Residence number is required'],
    unique: true
  },
  memberCount: {
    type: Number,
    required: [true, 'Member count is required'],
    min: 0
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  profilePhotoUrl: {
    type: String
  },
  nicFrontUrl: {
    type: String
  },
  nicBackUrl: {
    type: String
  },
  signatureUrl: {
    type: String
  },
  termsAccepted: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String
  },
  email: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  apartmentNumber: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Owner = mongoose.model('Owner', ownerSchema);

module.exports = Owner;