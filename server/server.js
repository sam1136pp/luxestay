// ============================================
// Express Server - Main Entry Point
// ============================================
// This file bootstraps the Express application,
// connects to MongoDB, configures middleware,
// and mounts all API route handlers.

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// ---- Middleware ----

// Enable CORS for frontend requests
// In production, allow the deployed frontend URL
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // If the frontend URL is not explicitly set, we can be lenient in development
      if (!process.env.FRONTEND_URL && process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// ---- API Routes ----

// Authentication routes (login, register, profile)
app.use('/api/auth', require('./routes/auth'));

// Room routes (CRUD operations, public listing)
app.use('/api/rooms', require('./routes/rooms'));

// Booking routes (create, list, cancel bookings)
app.use('/api/bookings', require('./routes/bookings'));

// Admin routes (dashboard stats, manage bookings/customers)
app.use('/api/admin', require('./routes/admin'));

// ---- Health Check ----
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Hotel Booking API is running' });
});

// ---- Error Handling Middleware ----
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ---- Start Server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
