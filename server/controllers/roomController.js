// ============================================
// Room Controller - Room Management Logic
// ============================================
// Handles CRUD operations for hotel rooms.
// Public users can list/view rooms.
// Admin users can create, update, and delete rooms.

const { validationResult } = require('express-validator');
const Room = require('../models/Room');

/**
 * @route   GET /api/rooms
 * @desc    Get all rooms with optional filters
 * @access  Public
 * 
 * Query Parameters:
 * - type: Filter by room type (Single, Double, Deluxe)
 * - minPrice: Minimum price per night
 * - maxPrice: Maximum price per night
 * - available: Filter by availability (true/false)
 * - search: Search by room name or description
 */
exports.getAllRooms = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, available, search } = req.query;
    
    // Build dynamic filter object based on query parameters
    const filter = {};
    
    if (type) filter.type = type;
    if (available !== undefined) filter.isAvailable = available === 'true';
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }
    
    // Text search on name and description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const rooms = await Room.find(filter).sort({ roomNumber: 1 });

    res.json({
      success: true,
      count: rooms.length,
      rooms
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rooms'
    });
  }
};

/**
 * @route   GET /api/rooms/:id
 * @desc    Get a single room by ID
 * @access  Public
 */
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      room
    });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching room details'
    });
  }
};

/**
 * @route   POST /api/rooms
 * @desc    Create a new room
 * @access  Admin only
 */
exports.createRoom = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if room number already exists
    const existingRoom = await Room.findOne({ roomNumber: req.body.roomNumber });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: `Room number ${req.body.roomNumber} already exists`
      });
    }

    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating room'
    });
  }
};

/**
 * @route   PUT /api/rooms/:id
 * @desc    Update an existing room
 * @access  Admin only
 */
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return updated doc, run validators
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      message: 'Room updated successfully',
      room
    });
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating room'
    });
  }
};

/**
 * @route   DELETE /api/rooms/:id
 * @desc    Delete a room
 * @access  Admin only
 */
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting room'
    });
  }
};
