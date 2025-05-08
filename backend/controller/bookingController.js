const Booking = require('../models/Booking');
const Apartment = require('../models/Apartment');
const mongoose = require('mongoose');

// Create a new booking
const createBooking = async (req, res) => {
  const { apartmentId, date, timeSlot, userId, name, phoneNumber } = req.body;

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

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
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
      status: { $nin: ['cancelled'] } // Ignore cancelled bookings
    });
    
    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked or pending approval' });
    }

    // Create and save the new booking with 'pending' status
    const newBooking = new Booking({
      apartmentId,
      date: new Date(date),
      timeSlot,
      userId,
      name,
      phoneNumber,
      status: 'pending' // Set default status to pending
    });

    await newBooking.save();
    return res.status(201).json({ message: 'Booking request submitted and pending approval', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single booking by ID
const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Validate booking ID format
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID format' });
    }

    // Find booking by ID and populate apartment details
    const booking = await Booking.findById(bookingId)
      .populate('apartmentId')
      .lean(); // Using lean() for better performance
    
    // Check if booking exists
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Format the date and time for frontend consumption
    booking.formattedDate = new Date(booking.date).toISOString().split('T')[0];

    // Return successful response with booking data
    return res.status(200).json({ 
      success: true, 
      booking 
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve booking details', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
      status: { $nin: ['cancelled'] } // Ignore cancelled bookings but consider both pending and confirmed
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
  const { date, timeSlot, name, phoneNumber } = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).json({ message: 'Invalid booking ID' });
  }
  
  if (!date || isNaN(Date.parse(date))) {
    return res.status(400).json({ message: 'Invalid date format' });
  }
  
  if (!timeSlot) {
    return res.status(400).json({ message: 'Time slot is required' });
  }

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }
  
  try {
    // Find the current booking
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Cancelled bookings cannot be updated' });
    }
    
    // Format the date properly
    const formattedDate = new Date(date);
    formattedDate.setHours(12, 0, 0, 0); // Set time to noon to avoid timezone issues
    
    // Check if the new date/time slot is already booked (excluding the current booking)
    const existingBooking = await Booking.findOne({
      apartmentId: booking.apartmentId,
      date: {
        $gte: new Date(formattedDate.setHours(0, 0, 0, 0)),
        $lte: new Date(formattedDate.setHours(23, 59, 59, 999))
      },
      timeSlot,
      _id: { $ne: bookingId },
      status: { $nin: ['cancelled'] }
    });
    
    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked or pending approval' });
    }
    
    // Update the booking - status resets to pending if it was previously confirmed
    // User edits should always go back to pending for re-approval
    booking.date = formattedDate;
    booking.timeSlot = timeSlot;
    booking.name = name;
    booking.phoneNumber = phoneNumber;
    booking.status = 'pending'; // Reset to pending after user edits
    booking.updatedAt = new Date();
    
    await booking.save();
    
    return res.json({ 
      message: 'Booking updated successfully and pending approval',
      booking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin - Confirm a pending booking 
const confirmBooking = async (req, res) => {
  const { bookingId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).json({ message: 'Invalid booking ID' });
  }

  try {
    // Find the booking by ID (findByIdAndUpdate can be less safe in some cases)
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: `Cannot confirm booking with status: ${booking.status}` });
    }

    // Update the status to confirmed
    booking.status = 'confirmed';
    booking.updatedAt = new Date();
    
    // Save the updated booking
    await booking.save();

    // Return the updated booking
    return res.status(200).json({ 
      success: true,
      message: 'Booking confirmed successfully', 
      booking 
    });
  } catch (error) {
    console.error('Error confirming booking:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// Get all bookings (admin only)
const getAllBookings = async (req, res) => {
  try {
    // You may want to add pagination here for better performance with large datasets
    const bookings = await Booking.find()
      .populate('apartmentId')
      .populate('userId', 'email -_id') // Only include email from user, exclude _id
      .sort({ date: -1 }); // Most recent bookings first
    
    return res.status(200).json({ 
      success: true, 
      bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { 
  createBooking,
  getBookingById, 
  getAvailableSlots, 
  getUserBookings, 
  cancelBooking,
  updateBooking,
  confirmBooking, // Admin function to confirm bookings
  getAllBookings
};