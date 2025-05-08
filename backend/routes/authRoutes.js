// routes/authRoutes.js
const express = require('express');
const { 
  signup, 
  login, 
  getMe, 
  logout,
  updateProfile
} = require('../controllers/authController'); // FIXED: Changed from '../controller/authController'
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', logout);
router.put('/update-profile', protect, updateProfile); // Added update-profile route


module.exports = router;