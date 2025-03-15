// routes/authRoutes.js
const express = require('express');
const { signup, login, getMe, logout } = require('../controller/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', logout);

module.exports = router;