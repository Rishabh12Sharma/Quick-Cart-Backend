const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for frontend communication

// ✅ MongoDB Connection (No Deprecated Options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit process if DB connection fails
  });

// ✅ Route Imports
const productRoutes = require("./routes/ProductRoutes");
const authRoutes = require("./routes/authRoutes");

// ✅ Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("🚀 Quick Cart Backend is Running!");
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
