// ============================================
// User Model - MongoDB Schema
// ============================================
// Defines the User schema with fields for authentication
// and role-based access control (Admin/Customer).
// Passwords are hashed using bcrypt before saving.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // User's full name
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  // Email address (used for login)
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  // Hashed password (never stored in plain text)
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  // User role determines access level
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  // Optional phone number
  phone: {
    type: String,
    trim: true
  }
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true
});

/**
 * Pre-save middleware to hash password
 * Only hashes the password if it has been modified (or is new)
 * Uses bcrypt with 10 salt rounds for security
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Instance method to compare entered password with hashed password
 * @param {string} enteredPassword - Plain text password to compare
 * @returns {boolean} - True if passwords match
 */
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Transform the document when converting to JSON
 * Removes the password field from the output for security
 */
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
