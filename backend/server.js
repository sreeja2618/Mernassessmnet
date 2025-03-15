const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors({ 
  origin: "http://localhost:5173",  // Allow requests from frontend
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type"
}));

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/leaveManagementDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Define Mongoose Schema
const userSchema = new mongoose.Schema({
  personId: { type: String, unique: true, required: true }, // Unique ID instead of _id
  name: String,
  email: String,
  leaveBalance: Number, // Total available leave days
});

const leaveSchema = new mongoose.Schema({
  personId: String, // Reference to personId instead of _id
  leaveType: String, // Casual Leave, Medical Leave, etc.
  days: Number, // Number of leave days applied
  status: { type: String, default: "Pending" }, // Leave approval status
});

const User = mongoose.model("User", userSchema);
const Leave = mongoose.model("Leave", leaveSchema);
app.get("/", (req, res) => {
    res.redirect("/leaves/apply");
  });

// ✅ HTML Page to Check Leave Balance
app.get("/leaves", (req, res) => {
  res.send(`
    <html>
      <head><title>Check Your Available Leaves</title></head>
      <body>
        <h1>Check Your Available Leaves</h1>
        <form onsubmit="redirectToBalance(event)">
          Enter User ID: <input type="text" name="personId" required>
          <button type="submit">Check Balance</button>
        </form>

        <script>
          function redirectToBalance(event) {
            event.preventDefault();
            const personId = document.querySelector('input[name="personId"]').value.trim();
            if (!personId) {
              alert("Please enter a valid User ID.");
              return;
            }
            window.location.href = "/leaves/balance/" + encodeURIComponent(personId);
          }
        </script>
      </body>
    </html>
  `);
});

// ✅ API: Get Available Leave Balance
// ✅ API: Get Available Leave Balance (Returns JSON for frontend)
app.get("/leaves/balance/:personId", async (req, res) => {
  try {
    const personId = req.params.personId;
    console.log("Fetching leave balance for:", personId);

    const user = await User.findOne({ personId });
    if (!user) {
      console.error("User not found in database.");
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Return JSON Response
    res.json({
      name: user.name,
      leaveBalance: user.leaveBalance,
    });

  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ HTML Page to Apply for Leave
app.get("/leaves/apply", (req, res) => {
  res.send(`
    <html>
      <head><title>Apply for Leave</title></head>
      <body>
        <h1>Apply for Leave</h1>
        <form action="/leaves/apply" method="POST">
          Enter Person ID: <input type="text" name="personId" required><br>
          Leave Type: 
          <select name="leaveType">
            <option value="Casual Leave">Casual Leave</option>
            <option value="Medical Leave">Medical Leave</option>
          </select><br>
          Number of Days: <input type="number" name="days" required><br>
          <button type="submit">Apply Leave</button>
        </form>
      </body>
    </html>
  `);
});

// ✅ API: Apply for Leave
app.post("/leaves/apply", async (req, res) => {
  try {
    const { personId, leaveType, days } = req.body;
    const user = await User.findOne({ personId });

    if (!user) {
      console.error("User not found:", personId);
      return res.status(404).send("User not found");
    }

    if (user.leaveBalance < days) {
      return res.send(`
        <html>
        <head><title>Leave Application</title></head>
        <body>
          <h1>Leave Application Failed</h1>
          <p><strong>User:</strong> ${user.name}</p>
          <p><strong>Available Leave Days:</strong> ${user.leaveBalance}</p>
          <p><strong>Requested Leave Days:</strong> ${days}</p>
          <p style="color:red;"><strong>Insufficient Leave Balance!</strong></p>
          <a href="/leaves/apply">Apply Again</a>
        </body>
        </html>
      `);
    }

    // Deduct Leave Balance
    user.leaveBalance -= days;
    await user.save();

    // Save Leave Request
    const leave = new Leave({ personId, leaveType, days, status: "Approved" });
    await leave.save();

    res.send(`
      <html>
      <head><title>Leave Applied</title></head>
      <body>
        <h1>Leave Application Successful</h1>
        <p><strong>User:</strong> ${user.name}</p>
        <p><strong>Leave Type:</strong> ${leaveType}</p>
        <p><strong>Requested Leave Days:</strong> ${days}</p>
        <p><strong>New Available Leave Days:</strong> ${user.leaveBalance}</p>
        <a href="/leaves">Check Leave Balance</a>
      </body>
      </html>
    `);
  } catch (err) {
    console.error("Error applying leave:", err);
    res.status(500).send("Internal Server Error");
  }
});

// ✅ Start the Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
