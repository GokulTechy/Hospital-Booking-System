const User = require("../models/User");
const Slot = require("../models/Slot");
const Booking = require("../models/Booking");

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Booking.find()
      .populate("user", "name email")
      .populate({
        path: "slot",
        populate: {
          path: "doctor",
          select: "name specialization"
        }
      });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.toggleDoctorStatus = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await User.findById(doctorId);
    
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.isActive = !doctor.isActive;
    await doctor.save();

    res.json({ message: `Doctor is now ${doctor.isActive ? 'Active' : 'Inactive'}`, doctor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await User.findById(doctorId);

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Clean up all slots created by this doctor so they don't appear as orphaned slots
    await Slot.deleteMany({ doctor: doctorId });

    await User.findByIdAndDelete(doctorId);
    
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
