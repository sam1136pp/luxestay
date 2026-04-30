// ============================================
// Booking Model - MongoDB Schema
// ============================================
// Defines the Booking schema linking Users to Rooms
// with check-in/check-out dates, total price calculation,
// and booking status tracking.

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Reference to the User who made the booking
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  // Reference to the Room being booked
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room ID is required']
  },
  // Check-in date (start of stay)
  checkIn: {
    type: Date,
    required: [true, 'Check-in date is required']
  },
  // Check-out date (end of stay)
  checkOut: {
    type: Date,
    required: [true, 'Check-out date is required']
  },
  // Total cost = number of nights × price per night
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  },
  // Current status of the booking
  status: {
    type: String,
    enum: {
      values: ['confirmed', 'cancelled', 'completed'],
      message: 'Status must be confirmed, cancelled, or completed'
    },
    default: 'confirmed'
  },
  // Number of guests for this booking
  guests: {
    type: Number,
    default: 1,
    min: [1, 'At least 1 guest required']
  }
}, {
  timestamps: true
});

/**
 * Pre-save validation: ensure check-out is after check-in
 */
bookingSchema.pre('save', function(next) {
  if (this.checkOut <= this.checkIn) {
    return next(new Error('Check-out date must be after check-in date'));
  }
  next();
});

/**
 * Static method to check if a room is available for the given dates
 * Prevents double-booking by checking for overlapping reservations
 * @param {ObjectId} roomId - The room to check
 * @param {Date} checkIn - Desired check-in date
 * @param {Date} checkOut - Desired check-out date
 * @param {ObjectId} excludeBookingId - Booking ID to exclude (for updates)
 * @returns {boolean} - True if room is available
 */
bookingSchema.statics.isRoomAvailable = async function(roomId, checkIn, checkOut, excludeBookingId = null) {
  const query = {
    room: roomId,
    status: 'confirmed',
    // Check for date overlap: existing booking overlaps if
    // its check-in is before our check-out AND its check-out is after our check-in
    $and: [
      { checkIn: { $lt: new Date(checkOut) } },
      { checkOut: { $gt: new Date(checkIn) } }
    ]
  };

  // Exclude a specific booking (useful when updating)
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const overlapping = await this.findOne(query);
  return !overlapping; // Available if no overlapping booking found
};

module.exports = mongoose.model('Booking', bookingSchema);
