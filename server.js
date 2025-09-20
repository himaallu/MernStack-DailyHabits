// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors()); // allow all origins
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Habit model
const Habit = mongoose.model("Habit", new mongoose.Schema({
  name: String,
  doneToday: { type: Boolean, default: false },
}));

// Routes
app.get("/habits", async (req, res) => {
  const habits = await Habit.find();
  res.json(habits);
});

app.post("/habits", async (req, res) => {
  const habit = new Habit(req.body);
  await habit.save();
  res.json(habit);
});

app.patch("/habits/:id", async (req, res) => {
  const habit = await Habit.findById(req.params.id);
  habit.doneToday = !habit.doneToday;
  await habit.save();
  res.json(habit);
});

app.delete("/habits/:id", async (req, res) => {
  await Habit.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Start server
app.listen(5000, () => console.log("🔥 Server running on http://localhost:5000"));
