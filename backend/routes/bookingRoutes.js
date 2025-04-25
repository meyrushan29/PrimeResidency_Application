const express = require('express');
const router = express.Router();
const { 
  createBooking,
  getBookingById,
  getAvailableSlots, 
  getUserBookings, 
  cancelBooking,
  updateBooking,
  confirmBooking,
  getAllBookings
} = require('../controller/bookingController');
const Booking = require('../models/Booking');

// Create a new booking
router.post('/booking', createBooking);

// Get a single booking by ID
router.get('/booking/:bookingId', getBookingById);

// Get available slots for a specific date and apartment
router.get('/available-slots', getAvailableSlots);

// Get all bookings for a specific user
router.get('/user-bookings/:userId', getUserBookings);

// Cancel a booking
router.put('/cancel-booking/:bookingId', cancelBooking);

// Update a booking
router.put('/update-booking/:bookingId', updateBooking);

// Admin route to get all bookings
router.get('/admin/bookings', getAllBookings);

// Add this test route for debugging
router.get('/test', (req, res) => {
  res.json({ message: 'Booking routes are working' });
});

// Admin route to confirm a booking - IMPORTANT for fixing the confirm issue
router.put('/admin/bookings/confirm/:bookingId', confirmBooking);

// Admin route to cancel a booking
router.put('/admin/bookings/:bookingId/cancel', cancelBooking);

module.exports = router;