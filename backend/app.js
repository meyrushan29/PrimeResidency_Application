const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const voterRoutes = require('./routes/voterRoutes');
const pollRoutes = require('./routes/pollRoutes');
const apartmentRoutes = require('./routes/apartmentRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/AccountRoutes');
const cleaningRoutes = require('./routes/CleaningRoutes')
const { errorHandler } = require('./middleware/auth');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Serve images from homeimg directory
app.use('/homeimg', express.static('homeimg'));


// Connect to the database
connectDB();

// Mount routes
app.use('/api/voters', voterRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/authaccount', accountRoutes);
app.use('/api/cleaningservice', cleaningRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});