const express = require('express');
const router = express.Router();
const { 
  createBooking,
  getBookingById,
  getAvailableSlots, 
  getUserBookings, 
  cancelBooking,
  updateBooking,
  getAllBookings
} = require('../controller/bookingController');
const Booking = require('../models/Booking'); // Make sure to import the Booking model

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

// Special route to get all bookings (temporary)
router.get('/user-bookings/all', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('apartmentId').sort({ date: -1 });
    return res.json({ bookings });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;