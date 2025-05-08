const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const voterRoutes = require('./routes/voterRoutes');
const pollRoutes = require('./routes/pollRoutes');
const apartmentRoutes = require('./routes/apartmentRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/AccountRoutes');
const HealthRoutes = require('./routes/HealthRoutes')
const CleaningRoutes = require('./routes/CleaningRoutes')
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
/*
const allowedOrigins = ['http://localhost:5173','http://localhost:8001']; // Frontend dev origin

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // <- This is important for cookie support
}));
*/
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

/*
app.use((req, res, next) => {
  console.log('Request origin:', req.headers.origin);
  next();
});
*/

// Connect to the database
connectDB();

// Mount routes
app.use('/api/voters', voterRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/authaccount', accountRoutes);
app.use('/api/healthservice', HealthRoutes);
app.use('/api/cleaningservice', CleaningRoutes);


// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});