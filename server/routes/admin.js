// ============================================
// Admin Routes - /api/admin
// ============================================
// Handles admin-only endpoints:
// GET /stats     - Dashboard statistics
// GET /bookings  - All bookings
// GET /customers - All customers

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// All admin routes require authentication + admin role
router.use(auth, adminAuth);

router.get('/stats', adminController.getDashboardStats);
router.get('/bookings', adminController.getAllBookings);
router.get('/customers', adminController.getAllCustomers);

module.exports = router;
