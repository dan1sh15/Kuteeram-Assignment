module.exports = {
  addBooking: {
    bookingDate: { isTrim: true, isRequired: true },
    notes: { isTrim: true },
  },
  updateBookingStatus: {
    status: { enumValues: ["pending", "confirmed", "cancelled", "completed"] },
  },
};
