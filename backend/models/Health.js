const mongoose = require('mongoose');

const healthSchema = new mongoose.Schema({
  ownerId: {
    type: String,
    required: true,
    match: /^Ow\d{4}$/,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
  },
  serviceType: {
    type: String,
    enum: ['emergency', 'regular checkup', 'vaccination', 'consultation'],
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
    validate: {
      validator: function(value) {
        return value >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Service date cannot be in the past'
    }
  },
  time: {
    type: String,
    required: true,
    enum: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Update the updatedAt field on save
healthSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create a compound index to ensure uniqueness of date and time for active appointments
healthSchema.index(
  { date: 1, time: 1, status: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { status: { $ne: 'cancelled' } }
  }
);

const Health = mongoose.model('Health', healthSchema);

module.exports = Health;