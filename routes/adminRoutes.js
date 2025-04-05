const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Food = require("../models/Food");
const bcrypt = require("bcryptjs");

// Admin Register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashed });
    await admin.save();
    res.json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    res.json({ message: "Login successful", adminId: admin._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard placeholder
router.get("/dashboard", (req, res) => {
  res.send("Admin Dashboard");
});

// Add Food
router.post("/add-food", async (req, res) => {
  const { name, price, category, restaurant } = req.body;
  try {
    const newFood = new Food({ name, price, category, restaurant });
    await newFood.save();
    res.json({ message: "Food added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Foods
router.get("/foods", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Food
router.delete("/delete-food/:id", async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: "Food deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
