const Cleaning = require('../models/Cleaning');

// Create a new cleaning service request
const createCleaningRequest = async (req, res) => {
  const { ownerId, name, email, phoneNumber, serviceType, numberOfStaff, date, time, additionalNotes } = req.body;

  if (!ownerId || !/^Ow\d{4}$/.test(ownerId)) {
    return res.status(400).json({ message: 'Invalid owner ID format (must start with "Ow" followed by 4 digits)' });
  }

  if (!name || !email || !phoneNumber || !serviceType || !numberOfStaff || !date || !time) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const formattedDate = new Date(date);

    const existingRequest = await Cleaning.findOne({
      ownerId,
      date: formattedDate,
      time,
      state: { $ne: 'cancelled' }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'A cleaning service is already scheduled for this time' });
    }

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
      state: 'Pending'
    });

    await newCleaningRequest.save();
    return res.status(201).json({ message: 'Cleaning service requested successfully', cleaningRequest: newCleaningRequest });
  } catch (error) {
    console.error('Error creating cleaning request:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a cleaning service request
const updateCleaningRequest = async (req, res) => {
  const { requestId } = req.params;
  const {
    ownerId,
    name,
    email,
    phoneNumber,
    serviceType,
    numberOfStaff,
    date,
    time,
    additionalNotes,
    state
  } = req.body;

  if (!requestId) {
    return res.status(400).json({ message: 'Request ID is required' });
  }

  try {
    const request = await Cleaning.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Cleaning request not found' });
    }

    // Update all editable fields
    if (ownerId) request.ownerId = ownerId;
    if (name) request.name = name;
    if (email) request.email = email;
    if (phoneNumber) request.phoneNumber = phoneNumber;
    if (serviceType) request.serviceType = serviceType;
    if (numberOfStaff) request.numberOfStaff = numberOfStaff;
    if (date) request.date = new Date(date);
    if (time) request.time = time;
    if (additionalNotes !== undefined) request.additionalNotes = additionalNotes;
    if (state) request.state = state;

    await request.save();

    return res.status(200).json({ message: 'Cleaning request updated successfully', updatedService: request });
  } catch (error) {
    console.error('Error updating cleaning request:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all cleaning services
const getAllServices = async (req, res) => {
  try {
    const allServices = await Cleaning.find();
    return res.status(200).json({
      success: true,
      message: 'Cleaning services retrieved successfully',
      allServices
    });
  } catch (error) {
    console.error('Error fetching cleaning services:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve cleaning services',
      error: error.message
    });
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

    request.state = 'cancelled';
    await request.save();

    return res.status(200).json({ message: 'Cleaning request cancelled successfully', request });
  } catch (error) {
    console.error('Error cancelling cleaning request:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get owner-specific requests
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

// Get available slots for a date
const getAvailableSlots = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  try {
    const formattedDate = new Date(date);
    const bookings = await Cleaning.find({
      date: formattedDate,
      state: { $ne: 'cancelled' }
    });

    const allTimeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    const bookedTimes = bookings.map(booking => booking.time);
    const availableSlots = allTimeSlots.filter(slot => !bookedTimes.includes(slot));

    return res.status(200).json(availableSlots);
  } catch (error) {
    console.error('Error getting available slots:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete service
const handleDeleteService = async (req, res) => {
  try {
    const service = await Cleaning.findById(req.params.requestId);

    if (!service) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    await Cleaning.findByIdAndDelete(req.params.requestId);
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting service' });
  }
};

module.exports = {
  createCleaningRequest,
  updateCleaningRequest,
  getAllServices,
  getAvailableSlots,
  getOwnerRequests,
  cancelCleaningRequest,
  handleDeleteService
};