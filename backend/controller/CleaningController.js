const Cleaning = require('../models/Cleaning');  // Adjust to your model path

// Create a new cleaning service request
const createCleaningRequest = async (req, res) => {
  const { ownerId, name, email, phoneNumber, serviceType, numberOfStaff, date, time, additionalNotes } = req.body;

  // Validate the request data
  if (!ownerId || !/^Ow\d{4}$/.test(ownerId)) {
    return res.status(400).json({ message: 'Invalid owner ID format (must start with "Ow" followed by 4 digits)' });
  }

  if (!name || !email || !phoneNumber || !serviceType || !numberOfStaff || !date || !time) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Format the date properly
    const formattedDate = new Date(date);
    
    // Check if the requested service is already scheduled for the same date and time
    const existingRequest = await Cleaning.findOne({ 
      ownerId, 
      date: formattedDate, 
      time, 
      status: { $ne: 'cancelled' } // Ignore cancelled requests
    });
    
    if (existingRequest) {
      return res.status(400).json({ message: 'A cleaning service is already scheduled for this time' });
    }

    // Create and save the new cleaning service request
    const newCleaningRequest = new Cleaning({
      ownerId,
      name,
      email,
      phoneNumber,
      serviceType,
      numberOfStaff,
      date: formattedDate,
      time,
      additionalNotes,
      status: 'confirmed'
    });

    await newCleaningRequest.save();
    return res.status(201).json({ message: 'Cleaning service requested successfully', cleaningRequest: newCleaningRequest });
  } catch (error) {
    console.error('Error creating cleaning request:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available time slots for a specific date
const getAvailableSlots = async (req, res) => {
  const { date } = req.query;
  
  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }
  
  try {
    const formattedDate = new Date(date);
    
    // Find all bookings for the specified date
    const bookings = await Cleaning.find({ 
      date: formattedDate,
      status: { $ne: 'cancelled' }
    });
    
    // Create array of all possible time slots (9AM to 5PM, hourly)
    const allTimeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    
    // Filter out booked slots
    const bookedTimes = bookings.map(booking => booking.time);
    const availableSlots = allTimeSlots.filter(slot => !bookedTimes.includes(slot));
    
    return res.status(200).json(availableSlots);
  } catch (error) {
    console.error('Error getting available slots:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all cleaning service requests for a specific owner
const getOwnerRequests = async (req, res) => {
  const { ownerId } = req.params;
  
  if (!ownerId) {
    return res.status(400).json({ message: 'Owner ID is required' });
  }
  
  try {
    const requests = await Cleaning.find({ ownerId }).sort({ date: 1, time: 1 });
    return res.status(200).json(requests);
  } catch (error) {
    console.error('Error getting owner requests:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel a cleaning service request
const cancelCleaningRequest = async (req, res) => {
  const { requestId } = req.params;
  
  if (!requestId) {
    return res.status(400).json({ message: 'Request ID is required' });
  }
  
  try {
    const request = await Cleaning.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Cleaning request not found' });
    }
    
    request.status = 'cancelled';
    await request.save();
    
    return res.status(200).json({ message: 'Cleaning request cancelled successfully', request });
  } catch (error) {
    console.error('Error cancelling cleaning request:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a cleaning service request
const updateCleaningRequest = async (req, res) => {
  const { requestId } = req.params;
  const { serviceType, numberOfStaff, date, time, additionalNotes } = req.body;
  
  if (!requestId) {
    return res.status(400).json({ message: 'Request ID is required' });
  }
  
  try {
    const request = await Cleaning.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Cleaning request not found' });
    }
    
    // Update fields if provided
    if (serviceType) request.serviceType = serviceType;
    if (numberOfStaff) request.numberOfStaff = numberOfStaff;
    if (date) request.date = new Date(date);
    if (time) request.time = time;
    if (additionalNotes !== undefined) request.additionalNotes = additionalNotes;
    
    await request.save();
    
    return res.status(200).json({ message: 'Cleaning request updated successfully', request });
  } catch (error) {
    console.error('Error updating cleaning request:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createCleaningRequest,
  getAvailableSlots,
  getOwnerRequests,
  cancelCleaningRequest,
  updateCleaningRequest
};