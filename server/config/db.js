// ============================================
// Database Configuration - MongoDB Connection
// ============================================
// This file handles connecting to MongoDB using Mongoose.
// The connection URI is loaded from environment variables.

const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Uses the MONGODB_URI from .env file
 * Exits the process if connection fails
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
