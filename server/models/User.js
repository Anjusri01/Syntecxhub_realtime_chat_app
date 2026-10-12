const mongoose = require('mongoose');

/**
 * CORE USER PROFILE SCHEMATIC BLUEPRINT
 * Enforces strict account metadata shapes mapping into your MongoDB cluster collections.
 */
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'A nickname or display username parameter is required.'],
      unique: true, // Prevents duplicate account name profile records
      trim: true,
      maxlength: [20, 'Display username names cannot exceed a 20 character limit constraint boundary.']
    },
    avatar: {
      type: String,
      // Injects a clean web-safe default layout graphic placeholder if no custom image is sent
      default: 'https://unsplash.com'
    },
    status: {
      type: String,
      default: 'Hey there! I am using Pulse.',
      maxlength: [100, 'Custom about description statuses cannot exceed 100 characters.']
    },
    isOnline: {
      type: Boolean,
      default: false // Toggled dynamically by Socket.io connectivity intercept pipelines
    }
  },
  {
    // Automatically generates parameters fields tracking document 'createdAt' and 'updatedAt' dates
    timestamps: true
  }
);

// Performance Optimization: Indexes speed up profile nickname lookups during authentication
UserSchema.index({ username: 1 });

module.exports = mongoose.model('User', UserSchema);
