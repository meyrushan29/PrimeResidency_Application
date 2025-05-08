const express = require('express');
const router = express.Router();
const { 
    createHealthRequest, 
    getAvailableSlots, 
    getOwnerRequests, 
    cancelHealthRequest,
    updateHealthRequest
} = require('../controller/HealthController');

// Create a new cleaning service request
router.post('/health', createHealthRequest);

// Get available time slots for a specific date
router.get('/available-slots', getAvailableSlots);

// Get all cleaning service requests for a specific owner
router.get('/owner-requests/:ownerId', getOwnerRequests);

// Cancel a cleaning service request
router.put('/cancel-health/:requestId', cancelHealthRequest);

// Update a cleaning service request
router.put('/update-health/:requestId', updateHealthRequest);

module.exports = router;