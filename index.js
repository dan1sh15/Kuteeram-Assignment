const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();

// Route files
const authRoutes = require("./routes/authRoutes/index");
const serviceRoutes = require("./routes/serviceRoutes/index");
const bookingRoutes = require("./routes/bookingRoutes/index");

const app = express();

// Body parser
app.use(express.json());

// Mount routers
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/bookings", bookingRoutes);

// Connect to database
connectDB();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  return res.send({
    success: true,
    message: "Welcome to Booking service provider Application!!!",
  });
});

app.listen(PORT, console.log(`Server running on port ${PORT}`));
