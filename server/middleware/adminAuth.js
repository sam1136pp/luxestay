// ============================================
// Admin Authorization Middleware
// ============================================
// Checks if the authenticated user has admin role.
// Must be used AFTER the auth middleware.
// Blocks access for non-admin users with 403 Forbidden.

/**
 * Middleware to check admin role
 * Must be chained after auth middleware: [auth, adminAuth]
 */
const adminAuth = (req, res, next) => {
  // Check if user exists (auth middleware should have set this)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  // Check if user has admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }

  // User is admin, proceed to next middleware/handler
  next();
};

module.exports = adminAuth;
