// View available leave days (HTML Response)

const express = require("express");
const Leave = require("../models/Leave");
const User = require("../models/User");

const router = express.Router();

// Apply for leave
router.post("/apply", async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).send("User not found");
    if (user.leaveBalance <= 0) return res.status(400).send("No leave balance available");

    const leave = new Leave({ userId, leaveType, startDate, endDate });
    await leave.save();

    user.leaveBalance -= 1;
    await user.save();

    res.send("Leave applied successfully.");
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// View available leave days
// router.get("/balance/:userId", async (req, res) => {
//   const user = await User.findById(req.params.userId);
//   if (!user) return res.status(404).send("User not found");
//   res.send(`Available leave days: ${user.leaveBalance}`);
// });



// ✅ Fetch available leave days (JSON response)
router.get("/balance/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      name: user.name,
      leaveBalance: user.leaveBalance
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});
