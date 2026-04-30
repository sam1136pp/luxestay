// ============================================
// JWT Authentication Middleware
// ============================================
// Verifies the JWT token from the Authorization header.
// If valid, attaches the user data to req.user.
// Used to protect routes that require login.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to verify JWT token and authenticate the user
 * Expects header: Authorization: Bearer <token>
 */
const auth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database (exclude password)
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user not found.'
      });
    }

    // Attach user data to the request object
    req.user = user;
    next();
  } catch (error) {
    // Token expired or invalid
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.'
      });
    }
    
    res.status(401).json({
      success: false,
      message: 'Invalid token. Authentication failed.'
    });
  }
};

module.exports = auth;
