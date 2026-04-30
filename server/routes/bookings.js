// ============================================
// Booking Routes - /api/bookings
// ============================================
// Handles booking endpoints (all require authentication):
// POST /         - Create a new booking
// GET  /my       - Get logged-in user's bookings
// PUT  /:id/cancel - Cancel a booking

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// Validation rules for creating a booking
const bookingValidation = [
  body('roomId')
    .notEmpty().withMessage('Room ID is required')
    .isMongoId().withMessage('Invalid room ID'),
  body('checkIn')
    .notEmpty().withMessage('Check-in date is required')
    .isISO8601().withMessage('Invalid check-in date format'),
  body('checkOut')
    .notEmpty().withMessage('Check-out date is required')
    .isISO8601().withMessage('Invalid check-out date format')
];

// All booking routes require authentication
router.post('/', auth, bookingValidation, bookingController.createBooking);
router.get('/my', auth, bookingController.getMyBookings);
router.put('/:id/cancel', auth, bookingController.cancelBooking);

module.exports = router;
