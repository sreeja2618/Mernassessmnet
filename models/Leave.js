const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  leaveType: { type: String, enum: ["Casual", "Medical"] },
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
});

module.exports = mongoose.model("Leave", LeaveSchema);
