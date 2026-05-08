const express = require("express");
const router = express.Router();

const {
  createSlot,
  getSlots,
  deleteSlot
} = require("../controllers/slotController");

// Create slot
router.post("/create", createSlot);

// Get all slots
router.get("/", getSlots);

// 🔴 Delete slot (NEW)
router.delete("/:id", deleteSlot);

module.exports = router;