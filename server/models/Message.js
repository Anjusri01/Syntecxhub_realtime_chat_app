const mongoose = require('mongoose');

/**
 * CORE MESSAGE SCHEMATIC BLUEPRINT
 * Enforces strict document data shapes mapping into your MongoDB collections.
 */
const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Establishes a direct relational bond back to your User document registry
      required: [true, 'A message must be bound to a valid sender identity profile.']
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Establishes a direct relational bond back to the target receiver profile
      required: [true, 'A message must target a specific destination recipient profile.']
    },
    text: {
      type: String,
      required: [true, 'Message text body content cannot be empty.'],
      trim: true // Automatically strips accidental surrounding padding spacing layouts
    },
    isRead: {
      type: Boolean,
      default: false // Initializes to unread until intercepted by the recipient viewport focus state
    }
  },
  {
    // Automatically creates 'createdAt' and 'updatedAt' ISO date parameters [1]
    timestamps: true 
  }
);

// Performance Optimization: Indexes speed up direct messaging chronological sorting queries
MessageSchema.index({ sender: 1, receiver: 1, createdAt: 1 });
MessageSchema.index({ receiver: 1, isRead: 1 });

module.exports = mongoose.model('Message', MessageSchema);
