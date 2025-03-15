const Account = require('../models/AccountModel');
const jwt = require('jsonwebtoken');

// Login Account Controller
const loginAccount = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find account by username
    const account = await Account.findOne({ username });
    if (!account) {
      return res.status(400).json({ message: 'Username not found' });
    }

    // Check if password matches
    const isMatch = await account.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT token (Expiration time could come from env variable)
    const token = jwt.sign(
      { userId: account._id, role: account.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '1h' } // Default to 1 hour if not specified
    );

    // Return success response with token
    res.status(200).json({
      message: 'Login successful',
      token,
      role: account.role,
    });
  } catch (error) {
    console.error(error); // Log the error to the server logs
    res.status(500).json({ message: 'Internal server error' });
  }
};

// User Registration
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingAccount = await Account.findOne({ username });
    if (existingAccount) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create a new account for the user with password hashing
    const newAccount = new Account({
      username,
      password,
      role: 'user', // Set the role to 'user' for registration
    });

    // Save the new account to the database
    await newAccount.save();

    res.status(201).json({
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error(error); // Log the error to the server logs
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { loginAccount, registerUser };
