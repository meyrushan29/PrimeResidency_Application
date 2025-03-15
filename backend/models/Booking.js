// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  apartmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apartment', // Referencing the Apartment model
    required: true,
  },
  date: {
    type: String, // Date as string (e.g., '2025-03-15')
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
