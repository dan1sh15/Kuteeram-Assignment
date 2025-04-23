const express = require("express");
const {
  getBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
  cancelBooking,
} = require("../../controllers/bookingController");
const { protect } = require("../../middlewares/auth");
const { validateRequestParams } = require("../../utils/validationUtils");
const validations = require("./params");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, getBookings)
  .post(validateRequestParams(validations.addBooking), protect, createBooking);

router.route("/:id").get(protect, getBooking);

router.route("/:id/status").put(protect, updateBookingStatus);

router.route("/:id/cancel").put(protect, cancelBooking);

module.exports = router;
