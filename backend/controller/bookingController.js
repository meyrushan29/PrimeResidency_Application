const Booking = require('../models/Booking');
const Apartment = require('../models/Apartment');
const mongoose = require('mongoose');

// Create a new booking
const createBooking = async (req, res) => {
  const { apartmentId, date, timeSlot, userId } = req.body;

  // Validate the request data
  if (!mongoose.Types.ObjectId.isValid(apartmentId)) {
    return res.status(400).json({ message: 'Invalid apartment ID' });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  if (!date || isNaN(Date.parse(date))) {
    return res.status(400).json({ message: 'Invalid date format' });
  }

  try {
    // Check if the apartment exists
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }

    // Check if the selected time slot is already booked for the given date
    const existingBooking = await Booking.findOne({ 
      apartmentId, 
      date: new Date(date), 
      timeSlot 
    });
    
    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create and save the new booking
    const newBooking = new Booking({
      apartmentId,
      date: new Date(date),
      timeSlot,
      userId,
      status: 'confirmed'
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

  if (!mongoose.Types.ObjectId.isValid(apartmentId)) {
    return res.status(400).json({ message: 'Invalid apartment ID' });
  }

  if (!date || isNaN(Date.parse(date))) {
    return res.status(400).json({ message: 'Invalid date format' });
  }

  try {
    const formattedDate = new Date(date);
    
    // Set time to 00:00:00 to match all bookings for that day
    formattedDate.setHours(0, 0, 0, 0);
    
    // Set end of day time
    const endOfDay = new Date(formattedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({ 
      apartmentId, 
      date: { 
        $gte: formattedDate,
        $lte: endOfDay
      } 
    });

    // List of all possible time slots
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

// Get all bookings for a specific user
const getUserBookings = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const bookings = await Booking.find({ userId })
      .populate('apartmentId')
      .sort({ date: 1 });

    return res.json({ bookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).json({ message: 'Invalid booking ID' });
  }

  try {
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'cancelled';
    await booking.save();

    return res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = { 
  createBooking, 
  getAvailableSlots, 
  getUserBookings, 
  cancelBooking 
};