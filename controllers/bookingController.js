const Booking = require("../models/Booking");
const Service = require("../models/Service");

/**
 * @desc    Get all bookings or bookings for a specific service
 * @route   GET /api/v1/bookings
 * @route   GET /api/v1/services/:serviceId/bookings
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 * @returns {Object} JSON response with list of bookings
 */
exports.getBookings = async (req, res, next) => {
  try {
    let query;

    if (req.params.serviceId) {
      query = Booking.find({ service: req.params.serviceId });
    } else if (req.user.role === "provider") {
      const services = await Service.find({ provider: req.user.id });
      const serviceIds = services.map((service) => service._id);
      query = Booking.find({ service: { $in: serviceIds } });
    } else {
      query = Booking.find({ user: req.user.id });
    }

    const bookings = await query
      .populate({ path: "service", select: "title price duration" })
      .populate({ path: "user", select: "name email" });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get a single booking by ID
 * @route   GET /api/v1/bookings/:id
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 * @returns {Object} JSON response with booking data
 */
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({ path: "service", select: "title price duration provider" })
      .populate({ path: "user", select: "name email" });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      booking.user._id.toString() !== req.user.id &&
      booking.service.provider.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this booking",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a booking for a specific service
 * @route   POST /api/v1/services/:serviceId/bookings
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 * @returns {Object} JSON response with created booking
 */
exports.createBooking = async (req, res, next) => {
  try {
    req.body.service = req.query.serviceId;
    req.body.user = req.user.id;

    const service = await Service.findById(req.query.serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const bookingDate = new Date(req.body.bookingDate);
    if (bookingDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Booking date must be in the future",
      });
    }

    const booking = await Booking.create(req.body);

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update the status of a booking
 * @route   PUT /api/v1/bookings/:id/status
 * @access  Private (provider/admin)
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 * @returns {Object} JSON response with updated booking
 */
exports.updateBookingStatus = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id).populate({
      path: "service",
      select: "provider",
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      booking.service.provider.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this booking",
      });
    }

    if (
      !["pending", "confirmed", "cancelled", "completed"].includes(
        req.body.status
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Cancel a booking
 * @route   PUT /api/v1/bookings/:id/cancel
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 * @returns {Object} JSON response with cancelled booking
 */
exports.cancelBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to cancel this booking",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be cancelled",
      });
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};
