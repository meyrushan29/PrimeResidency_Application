const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const voterRoutes = require('./routes/voterRoutes');
const pollRoutes = require('./routes/pollRoutes');
const appartmentRoutes = require('./routes/apartmentRoutes');

const app = express();
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files (this should serve any files in the 'uploads' directory)
app.use('/uploads', express.static('uploads')); 

// Serve images from homeimg directory
app.use('/homeimg', express.static('homeimg')); // Serve images under '/homeimg'

// Connect to the database
connectDB();

// Routes
app.use('/api/voters', voterRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/apartments', appartmentRoutes);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
