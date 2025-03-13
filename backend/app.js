const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const voterRoutes = require('./routes/voterRoutes');

const app = express();
require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

connectDB();

app.use('/api/voters', voterRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
