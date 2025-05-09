const express = require('express');
const router = express.Router();
const ownerController = require('../controller/HomeOwnerController');

// Get all owners
router.get('/owners', ownerController.getAllOwners);

// Get owner by ID
router.get('/owners/:id', ownerController.getOwnerById);

// Create new owner
router.post('/owners', ownerController.createOwner);

// Update owner
router.put('/owners/:id', ownerController.updateOwner);

// Delete owner
router.delete('/owners/:id', ownerController.deleteOwner);

// Search owners
router.get('/owners/search', ownerController.searchOwners);

module.exports = router;