// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const { createBooking, getAvailableSlots } = require('../controller/bookingController');

// Create a new booking
router.post('/booking', createBooking);

// Get available slots for a specific date and apartment
router.get('/available-slots', getAvailableSlots);

module.exports = router;
