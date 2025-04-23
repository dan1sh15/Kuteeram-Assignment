const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative'],
  },
  duration: {
    type: Number,
    required: [true, 'Please provide duration in minutes'],
    min: [15, 'Duration must be at least 15 minutes'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'cleaning',
      'repair',
      'beauty',
      'health',
      'education',
      'other',
    ],
  },
  provider: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('Service', serviceSchema);