const mongoose = require('mongoose');

const cleaningSchema = new mongoose.Schema({
  ownerId: {
    type: String,
    required: true,
    match: /^Ow\d{4}$/,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
  },
  serviceType: {
    type: String,
    enum: ['daily', 'weekly', 'bi-weekly', 'monthly'],
    required: true,
  },
  numberOfStaff: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  additionalNotes: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    enum: ['Pending', 'Confirmed', 'cancelled'],
    default: 'Pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const Cleaning = mongoose.model('Cleaning', cleaningSchema);

module.exports = Cleaning;