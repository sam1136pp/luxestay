// ============================================
// Room Routes - /api/rooms
// ============================================
// Handles room-related endpoints:
// GET    /         - List all rooms (public, with filters)
// GET    /:id      - Get room details (public)
// POST   /         - Create room (admin only)
// PUT    /:id      - Update room (admin only)
// DELETE /:id      - Delete room (admin only)

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const roomController = require('../controllers/roomController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Validation rules for creating/updating rooms
const roomValidation = [
  body('name').trim().notEmpty().withMessage('Room name is required'),
  body('roomNumber').isNumeric().withMessage('Room number must be a number'),
  body('type').isIn(['Single', 'Double', 'Deluxe']).withMessage('Type must be Single, Double, or Deluxe'),
  body('pricePerNight').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description').trim().notEmpty().withMessage('Description is required')
];

// Public routes - anyone can browse rooms
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);

// Admin-only routes - require authentication + admin role
router.post('/', [auth, adminAuth], roomValidation, roomController.createRoom);
router.put('/:id', [auth, adminAuth], roomController.updateRoom);
router.delete('/:id', [auth, adminAuth], roomController.deleteRoom);

module.exports = router;
