const User = require("../models/User");
const { generateToken } = require("../config/jwt");

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 * @returns {Object} JSON response with success status, message, and token
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Login an existing user
 * @route   POST /api/v1/auth/login
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 * @returns {Object} JSON response with success status, message, and token
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Loggedin successfully!",
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get the currently logged-in user's data
 * @route   GET /api/v1/auth/me
 * @access  Private
 * @param   {Object} req - Express request object with user info in req.user
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 * @returns {Object} JSON response with user data
 */
exports.getUserData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
