const { verifyToken } = require("../config/jwt");
const User = require("../models/User");

/**
 * @desc    Middleware to protect routes (authenticate user)
 * @access  Private
 * @param   {import("express").Request} req
 * @param   {import("express").Response} res
 * @param   {Function} next
 */
exports.protect = async (req, res, next) => {
  let token;

  // Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // No token found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    // Verify token and attach user to request
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

/**
 * @desc    Middleware to grant access to specific roles
 * @access  Private
 * @param   {...string} roles - Roles allowed to access the route (e.g. 'admin', 'provider')
 * @returns {Function} Express middleware function
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
