// ============================================
// Booking Controller - Booking Management Logic
// ============================================
// Handles booking creation (with double-booking prevention),
// listing user's bookings, and cancellation.

const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Room = require('../models/Room');

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking for a room
 * @access  Private (Customer)
 * 
 * Validates:
 * 1. Room exists and is available
 * 2. Dates are valid (check-out after check-in)
 * 3. No overlapping bookings for the same room
 * 4. Calculates total price automatically
 */
exports.createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { roomId, checkIn, checkOut, guests } = req.body;

    // 1. Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // 2. Check if room is generally available
    if (!room.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'This room is currently not available'
      });
    }

    // 3. Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past'
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    // 4. Check for overlapping bookings (prevent double booking)
    const isAvailable = await Booking.isRoomAvailable(roomId, checkIn, checkOut);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Room is already booked for the selected dates. Please choose different dates.'
      });
    }

    // 5. Calculate total price
    // Get number of nights between check-in and check-out
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = nights * room.pricePerNight;

    // 6. Create the booking
    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
      guests: guests || 1,
      status: 'confirmed'
    });

    // Populate room and user details in the response
    await booking.populate('room');
    await booking.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: `Booking confirmed! ${nights} night(s) for ₹${totalPrice}`,
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking'
    });
  }
};

/**
 * @route   GET /api/bookings/my
 * @desc    Get all bookings for the logged-in user
 * @access  Private (Customer)
 */
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room')
      .sort({ createdAt: -1 }); // Most recent first

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
};

/**
 * @route   PUT /api/bookings/:id/cancel
 * @desc    Cancel a booking
 * @access  Private (Customer - own bookings only)
 * 
 * Only allows cancellation of 'confirmed' bookings.
 * Cannot cancel already completed or previously cancelled bookings.
 */
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Ensure the booking belongs to the logged-in user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own bookings'
      });
    }

    // Check if booking can be cancelled
    if (booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a booking that is already ${booking.status}`
      });
    }

    // Update status to cancelled
    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking'
    });
  }
};
