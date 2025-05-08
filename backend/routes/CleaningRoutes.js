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

//Get all service 
router.get('/all-services',getAllServices);

//Delete service
router.delete('/delete-service/:requestId',handleDeleteService);

//Update server
// router.put('/update-service/:requestId',handleUpdateService);

module.exports = router;




/*const express = require('express');
const router = express.Router();
const { 
    createCleaningRequest, 
    getAvailableSlots, 
    getOwnerRequests, 
    cancelCleaningRequest,
    updateCleaningRequest
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
router.put('/update-cleaning/:requestId', updateCleaningRequest);

module.exports = router;*/