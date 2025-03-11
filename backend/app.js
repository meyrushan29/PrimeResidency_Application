
var express = require('express');
var cors = require('cors')
var connectDB = require('./config/db')


var app = express();
require('dotenv').config();

connectDB()

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

