const Health = require('../models/Health');

// Create a new health service request
const createHealthRequest = async (req, res) => {
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
  } = req.body;

  // Validation
  if (!ownerId || !/^Ow\d{4}$/.test(ownerId)) {
    return res.status(400).json({
      message: 'Invalid owner ID format (must start with "Ow" followed by 4 digits)',
    });
  }

  if (!name || !email || !phoneNumber || !serviceType || !numberOfStaff || !date || !time) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (!/^\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({ message: 'Phone number must be 10 digits' });
  }

  try {
    const formattedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (formattedDate < today) {
      return res.status(400).json({ message: 'Cannot schedule appointments in the past' });
    }

    const existingRequest = await Health.findOne({
      date: formattedDate,
      time,
      status: { $ne: 'cancelled' },
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'This time slot is already booked. Please select a different time.' });
    }

    const newHealthRequest = new Health({
      ownerId,
      name,
      email,
      phoneNumber,
      serviceType,
      numberOfStaff,
      date: formattedDate,
      time,
      additionalNotes: additionalNotes || '',
      status: 'confirmed',
    });

    await newHealthRequest.save();

    return res.status(201).json({
      message: 'Health service requested successfully',
      healthRequest: newHealthRequest,
    });
  } catch (error) {
    console.error('Error creating health request:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available time slots for a date
const getAvailableSlots = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  try {
    const formattedDate = new Date(date);
    formattedDate.setHours(0, 0, 0, 0);

    const bookings = await Health.find({
      date: {
        $gte: formattedDate,
        $lt: new Date(formattedDate.getTime() + 24 * 60 * 60 * 1000),
      },
      status: { $ne: 'cancelled' },
    });

    const allTimeSlots = [
      '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    const bookedTimes = bookings.map((b) => b.time);
    let availableSlots = allTimeSlots.filter((slot) => !bookedTimes.includes(slot));

    const today = new Date();
    if (formattedDate.toDateString() === today.toDateString()) {
      const currentHour = today.getHours();
      availableSlots = availableSlots.filter((slot) => parseInt(slot.split(':')[0]) > currentHour);
    }

    return res.status(200).json(availableSlots);
  } catch (error) {
    console.error('Error getting available slots:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all health requests for a specific owner
const getOwnerRequests = async (req, res) => {
  const { ownerId } = req.params;
  if (!ownerId) return res.status(400).json({ message: 'Owner ID is required' });

  try {
    const requests = await Health.find({ ownerId }).sort({ date: 1, time: 1 });
    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel a health request
const cancelHealthRequest = async (req, res) => {
  const { requestId } = req.params;
  if (!requestId) return res.status(400).json({ message: 'Request ID is required' });

  try {
    const request = await Health.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const appointmentDate = new Date(request.date);
    appointmentDate.setHours(parseInt(request.time.split(':')[0]), 0, 0, 0);
    const now = new Date();
    if (appointmentDate < now) {
      return res.status(400).json({ message: 'Cannot cancel past appointments' });
    }

    request.status = 'cancelled';
    await request.save();

    return res.status(200).json({ message: 'Request cancelled successfully', request });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a health request
const updateHealthRequest = async (req, res) => {
  const { requestId } = req.params;
  const { serviceType, numberOfStaff, date, time, additionalNotes } = req.body;

  if (!requestId) return res.status(400).json({ message: 'Request ID is required' });

  try {
    const request = await Health.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const now = new Date();
    const appointmentDate = new Date(request.date);
    appointmentDate.setHours(parseInt(request.time.split(':')[0]), 0, 0, 0);
    if (appointmentDate < now) {
      return res.status(400).json({ message: 'Cannot update past appointments' });
    }

    if ((date && date !== request.date.toISOString().split('T')[0]) || (time && time !== request.time)) {
      const newDate = date ? new Date(date) : request.date;
      const newTime = time || request.time;

      const existingBooking = await Health.findOne({
        _id: { $ne: requestId },
        date: {
          $gte: new Date(newDate.setHours(0, 0, 0, 0)),
          $lt: new Date(newDate.getTime() + 24 * 60 * 60 * 1000),
        },
        time: newTime,
        status: { $ne: 'cancelled' },
      });

      if (existingBooking) {
        return res.status(400).json({ message: 'This time slot is already booked. Please select a different time.' });
      }
    }

    if (serviceType) request.serviceType = serviceType;
    if (numberOfStaff) request.numberOfStaff = numberOfStaff;
    if (date) request.date = new Date(date);
    if (time) request.time = time;
    if (additionalNotes !== undefined) request.additionalNotes = additionalNotes;

    await request.save();
    return res.status(200).json({ message: 'Request updated successfully', request });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Get all health requests
const getAllHealthRequests = async (req, res) => {
  try {
    const requests = await Health.find().sort({ date: 1, time: 1 });
    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createHealthRequest,
  getAvailableSlots,
  getOwnerRequests,
  cancelHealthRequest,
  updateHealthRequest,
  getAllHealthRequests,
};
