const mongoose = require('mongoose');

/**
 * ASYNCHRONOUS MONGODB CONNECTION LIFE-CYCLE BOOTSTRAPPER
 * Orchestrates strict data handshakes with your local or cloud MongoDB instances.
 */
const connectDB = async () => {
  try {
    // 1. Establish data link options using the secret environment connection URI string
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options ensure maximum stability across modern cluster networks
      autoIndex: true, 
      connectTimeoutMS: 10000, // Terminates hanging hooks after 10 seconds
      socketTimeoutMS: 45000,  // Standard keep-alive response boundary
    });

    console.log(`\x1b[32m✔ MongoDB Connected Successfully: ${conn.connection.host}\x1b[0m`);
    
  } catch (error) {
    console.error(`\x1b[31m❌ Database Handshake Failure: ${error.message}\x1b[0m`);
    
    // 2. Critical Fallback Execution Protocol: 
    // Force terminates the active Node.js server system process instantly (1 indicates an unhandled crash exit code status)
    process.exit(1);
  }
};

// 3. Monitor ongoing runtime connection failures after initial successful boot
mongoose.connection.on('disconnected', () => {
  console.log('\x1b[33m⚠️ MongoDB connection lost. Attempting cluster auto-reconnect...\x1b[0m');
});

mongoose.connection.on('error', (err) => {
  console.error(`\x1b[31m❌ Ongoing Mongoose Error detected: ${err}\x1b[0m`);
});

module.exports = connectDB;
