import React, { useState } from "react";
import { applyLeave } from "../services/api";
import { Link } from "react-router-dom";
import "./ApplyLeave.css"

const ApplyLeave = () => {
  const [leave, setLeave] = useState({ personId: "", leaveType: "Casual Leave", days: 1 });

  const handleChange = (e) => setLeave({ ...leave, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await applyLeave(leave);
      alert("Leave applied successfully!");
    } catch (err) {
      alert("Error applying leave"+err);
    }
  };

  return (
    <div className="container">
      <h2>Apply for Leave</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="personId" placeholder="User ID" onChange={handleChange} required />
        <select name="leaveType" onChange={handleChange}>
          <option value="Casual Leave">Casual Leave</option>
          <option value="Medical Leave">Medical Leave</option>
        </select>
        <input type="number" name="days" placeholder="Number of Days" onChange={handleChange} required />
        <button type="submit">Apply Leave</button>
        <Link className="link" to="/check-balance">Check Leave Balance</Link>
        <Link className="link" to="/">Go to Home</Link>
      </form>
    </div>
  );
};

export default ApplyLeave;
