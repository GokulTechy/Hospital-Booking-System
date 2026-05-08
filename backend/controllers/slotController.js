const Slot = require("../models/Slot");

// Create Slot
exports.createSlot = async (req, res) => {
  try {
    const { doctor, specialization, startTime, endTime } = req.body;

    if (!doctor || !specialization || !startTime || !endTime) {
      return res.status(400).json({
        message: "Doctor, specialization, start time and end time are required"
      });
    }

    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start < now) {
      return res.status(400).json({
        message: "Cannot create slot in the past"
      });
    }

    if (end <= start) {
      return res.status(400).json({
        message: "End time must be after start time"
      });
    }

    const overlap = await Slot.findOne({
      doctor,
      startTime: { $lt: end },
      endTime: { $gt: start }
    });

    if (overlap) {
      return res.status(400).json({
        message: "Slot overlaps with existing slot"
      });
    }

    const slot = await Slot.create({
      doctor,
      specialization,
      startTime,
      endTime
    });

    res.json(slot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Slots
exports.getSlots = async (req, res) => {
  try {
    const slots = await Slot.find()
      .populate("doctor", "name email specialization")
      .sort({ startTime: 1 });

    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Slot
exports.deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await Slot.findByIdAndDelete(id);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.json({ message: "Slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};