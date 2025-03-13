const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  leaveBalance: { type: Number, default: 10 },  // Default 10 leave days
});

module.exports = mongoose.model("User", UserSchema);
