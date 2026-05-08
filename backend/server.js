const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔷 Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const slotRoutes = require("./routes/slotRoutes");   // ✅ ADD THIS
app.use("/api/slots", slotRoutes);                   // ✅ ADD THIS

const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/bookings", bookingRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});