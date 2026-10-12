const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * SECURE PROTECTED ROUTE INTERCEPTOR MIDDLEWARE
 * Verifies the validity of the inbound JSON Web Token inside the Bearer Header profile.
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check if the request contains an Authorization header formatted as a Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the signature hash out of the raw string header array payload
      // "Bearer eyJhbGciOi..." -> "eyJhbGciOi..."
      token = req.headers.authorization.split(' ')[1];

      // 2. Decode and verify the JWT signature against the system secret key parameter constants
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pulse_secret_key_matrix_123');

      // 3. Query the user details from MongoDB, stripping out the security passwords hash payload
      req.user = await User.findById(decoded.id).select('-__v');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authorization failed. User profile no longer exists inside the registry.'
        });
      }

      // Route parameter constraints validation pass -> execute target controller logic pipeline
      return next();

    } catch (error) {
      console.error('❌ Security Token verification error caught:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Authorization signature invalid or session expired. Access denied.'
      });
    }
  }

  // 4. Fallback execution: If no token structure string path was captured at all
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to target this endpoint. Missing authorization security token.'
    });
  }
};

/**
 * OPTIONAL OPTIMIZATION LAYER: ROLE ROLE VERIFICATION INTERCEPTORS
 * Prevents non-admin users from accessing server actions (such as managing room properties).
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden. Administrative privileges required to run this operation.'
    });
  }
};

module.exports = { 
  protect,
  admin 
};
