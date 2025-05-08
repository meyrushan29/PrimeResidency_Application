const express = require('express');
const router = express.Router();
const { 
    createCleaningRequest, 
    getAvailableSlots, 
    getOwnerRequests, 
    cancelCleaningRequest,
    updateCleaningRequest,
    getAllServices,
    handleDeleteService
} = require('../controller/CleaningController');

// Create a new cleaning service request
router.post('/cleaning', createCleaningRequest);

// Get available time slots for a specific date
router.get('/available-slots', getAvailableSlots);

// Get all cleaning service requests for a specific owner
router.get('/owner-requests/:ownerId', getOwnerRequests);

// Cancel a cleaning service request
router.put('/cancel-cleaning/:requestId', cancelCleaningRequest);

// Update a cleaning service request
router.put('/update-service/:requestId', updateCleaningRequest);

// Get all services
router.get('/all-services', getAllServices);

// Delete service
router.delete('/delete-service/:requestId', handleDeleteService);

module.exports = router;