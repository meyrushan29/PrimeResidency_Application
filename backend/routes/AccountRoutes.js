const express = require('express');
const router = express.Router();
const { loginAccount, registerUser } = require('../controller/AccountController');

// User login route
router.post('/login', loginAccount);

// User registration route
router.post('/register', registerUser);

module.exports = router;
