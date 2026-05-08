const Booking = require("../models/Booking");
const Slot = require("../models/Slot");

// Book a Slot
exports.bookSlot = async (req, res) => {
  try {
    const { userId, slotId } = req.body;

    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.isBlocked) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const existingBooking = await Booking.findOne({ slot: slotId });
    if (existingBooking) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const booking = await Booking.create({
      user: userId,
      slot: slotId
    });

    slot.isBlocked = true;
    await slot.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all bookings
// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate({
        path: "slot",
        populate: {
          path: "doctor",
          select: "name email specialization"
        }
      });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await Slot.findByIdAndUpdate(
      booking.slot,
      { isBlocked: false },
      { new: true }
    );

    await Booking.findByIdAndDelete(id);

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};