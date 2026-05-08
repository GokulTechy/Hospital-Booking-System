const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Slot"
  },
  status: {
    type: String,
    default: "BOOKED"
  }
});

module.exports = mongoose.model("Booking", bookingSchema);