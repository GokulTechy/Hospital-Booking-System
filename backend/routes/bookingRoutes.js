const express = require("express");
const router = express.Router();

const {
  bookSlot,
  getBookings,
  cancelBooking
} = require("../controllers/bookingController");

router.post("/", bookSlot);
router.get("/", getBookings);
router.delete("/:id", cancelBooking);

module.exports = router;