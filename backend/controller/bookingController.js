// controllers/bookingController.js
const Booking = require('../models/Booking');
const Apartment = require('../models/Apartment');
const mongoose = require('mongoose');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { apartmentId, date, timeSlot, userId } = req.body;

    // Check if the userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Check if the apartment exists
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }

    // Check if the selected time slot is already booked for the given date
    const existingBooking = await Booking.findOne({ apartmentId, date, timeSlot });
    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create and save the new booking
    const newBooking = new Booking({
      apartmentId,
      date,
      timeSlot,
      userId,
    });

    await newBooking.save();
    return res.status(201).json({ message: 'Booking confirmed', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available time slots for a specific date and apartment
const getAvailableSlots = async (req, res) => {
  const { apartmentId, date } = req.query;

  try {
    const bookings = await Booking.find({ apartmentId, date });

    // Create a list of all possible time slots
    const allSlots = [
      "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
    ];

    // Get the booked time slots
    const bookedSlots = bookings.map((booking) => booking.timeSlot);

    // Filter out the booked slots
    const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

    return res.json({ availableSlots });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createBooking, getAvailableSlots };
