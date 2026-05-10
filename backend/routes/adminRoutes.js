const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/doctors", adminController.getAllDoctors);
router.get("/patients", adminController.getAllPatients);
router.get("/appointments", adminController.getAllAppointments);
router.put("/doctors/:id/toggle", adminController.toggleDoctorStatus);
router.delete("/doctors/:id", adminController.deleteDoctor);

module.exports = router;
