const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getAvailableSlots, 
  getUserBookings, 
  cancelBooking,
  updateBooking
} = require('../controller/bookingController');

// Create a new booking
router.post('/booking', createBooking);

// Get available slots for a specific date and apartment
router.get('/available-slots', getAvailableSlots);

// Get all bookings for a specific user
router.get('/user-bookings/:userId', getUserBookings);

// Cancel a booking
router.put('/cancel-booking/:bookingId', cancelBooking);

// Update a booking
router.put('/update-booking/:bookingId', updateBooking);

module.exports = router;