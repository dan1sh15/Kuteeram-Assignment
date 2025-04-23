/**
 * @desc    Global error handler middleware
 * @param   {Object} err - Error object
 * @param   {import('express').Request} req - Express request object
 * @param   {import('express').Response} res - Express response object
 * @param   {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let error = { ...err };
  error.message = err.message || "Server Error";

  // Handle invalid ObjectId error from Mongoose
  if (err.name === "CastError") {
    error.message = `Resource not found with id of ${err.value}`;
    error.statusCode = 404;
  }

  // Handle duplicate key error from Mongoose
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    error.message = `Duplicate value entered for field(s): ${field}`;
    error.statusCode = 400;
  }

  // Handle validation errors from Mongoose
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error.message = messages;
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
