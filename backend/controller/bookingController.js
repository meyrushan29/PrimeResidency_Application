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
      timeSlot,
      status: { $ne: 'cancelled' } // Ignore cancelled bookings
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
      },
      status: { $ne: 'cancelled' } // Ignore cancelled bookings
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

// Update a booking
const updateBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { date, timeSlot } = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).json({ message: 'Invalid booking ID' });
  }
  
  if (!date || isNaN(Date.parse(date))) {
    return res.status(400).json({ message: 'Invalid date format' });
  }
  
  if (!timeSlot) {
    return res.status(400).json({ message: 'Time slot is required' });
  }
  
  try {
    // Find the current booking
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.status !== 'confirmed') {
      return res.status(400).json({ message: 'Only confirmed bookings can be updated' });
    }
    
    // Simply use the date string directly without timezone manipulation
    // Adding T12:00:00 to set the time to noon to avoid date shifting due to timezone conversions
    const formattedDate = new Date(date + 'T12:00:00');
    
    // Check if the new date/time slot is already booked (excluding the current booking)
    const existingBooking = await Booking.findOne({
      apartmentId: booking.apartmentId,
      date: formattedDate,
      timeSlot,
      _id: { $ne: bookingId },
      status: { $ne: 'cancelled' }
    });
    
    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }
    
    // Update the booking
    booking.date = formattedDate;
    booking.timeSlot = timeSlot;
    
    await booking.save();
    
    return res.json({ 
      message: 'Booking updated successfully',
      booking: {
        ...booking._doc,
        date: formattedDate
      }
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { 
  createBooking, 
  getAvailableSlots, 
  getUserBookings, 
  cancelBooking,
  updateBooking
};