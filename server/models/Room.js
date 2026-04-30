// ============================================
// Room Model - MongoDB Schema
// ============================================
// Defines the Room schema with fields for room details,
// pricing, availability, and amenities.
// Each room has a unique room number and belongs to a type.

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  // Name of the hotel/property the room belongs to
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true
  },
  // Unique room identifier number
  roomNumber: {
    type: Number,
    required: [true, 'Room number is required'],
    unique: true
  },
  // Room category type
  type: {
    type: String,
    required: [true, 'Room type is required'],
    enum: {
      values: ['Single', 'Double', 'Deluxe'],
      message: 'Room type must be Single, Double, or Deluxe'
    }
  },
  // Cost per night in INR (₹)
  pricePerNight: {
    type: Number,
    required: [true, 'Price per night is required'],
    min: [0, 'Price cannot be negative']
  },
  // Whether the room is currently available for booking
  isAvailable: {
    type: Boolean,
    default: true
  },
  // Detailed description of the room
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  // List of room amenities
  amenities: {
    type: [String],
    default: ['WiFi', 'AC', 'TV', 'Room Service']
  },
  // URL to the room image (Unsplash or similar)
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1566073771259-6a8506099945'
  },
  // Maximum number of guests the room can accommodate
  capacity: {
    type: Number,
    default: 2,
    min: [1, 'Capacity must be at least 1'],
    max: [6, 'Capacity cannot exceed 6']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);
