const Booking = require("../models/Booking");
const Slot = require("../models/Slot");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Book a Slot
exports.bookSlot = async (req, res) => {
  try {
    const { userId, slotId } = req.body;

    const slot = await Slot.findById(slotId).populate("doctor", "name email");
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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const booking = await Booking.create({
      user: userId,
      slot: slotId
    });

    slot.isBlocked = true;
    await slot.save();

    // Send confirmation email
    const emailHtml = `
      <h3>Appointment Confirmation</h3>
      <p>Dear ${user.name},</p>
      <p>Your appointment has been successfully booked!</p>
      <div style="background: #f4f7fc; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h4 style="margin-top: 0;">Appointment Details:</h4>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 8px;"><strong>Doctor:</strong> ${slot.doctor.name}</li>
          <li style="margin-bottom: 8px;"><strong>Specialization:</strong> ${slot.specialization}</li>
          <li style="margin-bottom: 8px;"><strong>Time:</strong> ${new Date(slot.startTime).toLocaleString()} - ${new Date(slot.endTime).toLocaleTimeString()}</li>
        </ul>
      </div>
      <p>If you need to cancel or reschedule, please login to your MediCare Dashboard.</p>
      <p>Thank you for choosing MediCare!</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Appointment Booking Confirmation - MediCare",
        html: emailHtml
      });
    } catch (emailError) {
      console.log("Email could not be sent:", emailError.message);
    }

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