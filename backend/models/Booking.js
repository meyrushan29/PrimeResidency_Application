const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  apartmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apartment', // Referencing the Apartment model
    required: true,
  },
  date: {
    type: Date,  // Changed to Date type for better handling of dates
    required: true,
  },
  timeSlot: {
    type: String, // e.g., '15:00'
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model for booking users
    required: true,
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;