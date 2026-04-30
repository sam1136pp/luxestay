// ============================================
// Admin Controller - Admin Dashboard Logic
// ============================================
// Provides dashboard statistics, all bookings list,
// and customer management for admin users.

const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard statistics
 * @access  Admin only
 * 
 * Returns:
 * - Total bookings, active bookings, cancelled bookings
 * - Total rooms, available rooms, occupied rooms
 * - Total customers
 * - Total revenue from confirmed bookings
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Count bookings by status
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    // Count rooms by availability
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ isAvailable: true });
    const occupiedRooms = totalRooms - availableRooms;

    // Count customers (users with role 'customer')
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Calculate total revenue from confirmed and completed bookings
    const revenueResult = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get recent bookings for the dashboard
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('room', 'name roomNumber type')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      stats: {
        totalBookings,
        activeBookings,
        cancelledBookings,
        completedBookings,
        totalRooms,
        availableRooms,
        occupiedRooms,
        totalCustomers,
        totalRevenue
      },
      recentBookings
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    });
  }
};

/**
 * @route   GET /api/admin/bookings
 * @desc    Get all bookings (admin view)
 * @access  Admin only
 */
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('room', 'name roomNumber type pricePerNight')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
};

/**
 * @route   GET /api/admin/customers
 * @desc    Get all customer users
 * @access  Admin only
 */
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Get booking count for each customer
    const customersWithBookings = await Promise.all(
      customers.map(async (customer) => {
        const bookingCount = await Booking.countDocuments({ user: customer._id });
        return {
          ...customer.toObject(),
          bookingCount
        };
      })
    );

    res.json({
      success: true,
      count: customersWithBookings.length,
      customers: customersWithBookings
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customers'
    });
  }
};
