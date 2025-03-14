// models/Apartment.js
const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the apartment listing'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  area: {
    type: Number,
    required: [true, 'Please provide the area in square feet'],
    min: [0, 'Area cannot be negative']
  },
  bedrooms: {
    type: String,
    required: [true, 'Please specify the number of bedrooms'],
    enum: ['1', '2', '3', '4', '5+']
  },
  bathrooms: {
    type: String,
    required: [true, 'Please specify the number of bathrooms'],
    enum: ['1', '2', '3', '4', '5+']
  },
  furnished: {
    type: Boolean,
    default: false
  },
  view: {
    type: String,
    trim: true,
    maxlength: [50, 'View description cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  images: {
    type: [String],
    required: [true, 'Please upload at least one image'],
    validate: {
      validator: function(v) {
        return v.length >= 3;
      },
      message: 'Please upload at least 3 images'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field before saving
apartmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Apartment', apartmentSchema);