import React, { useState } from "react";
import { checkLeaveBalance } from "../services/api";
import { Link } from "react-router-dom";
import "./CheckBalance.css";  

const CheckBalance = () => {
  const [personId, setPersonId] = useState("");
  const [balanceData, setBalanceData] = useState(null);
  const [error, setError] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    try {
      const response = await checkLeaveBalance(personId);
      setBalanceData(response.data);
    } catch (err) {
      setError("User not found or server error"+err);
      setBalanceData(null);
    }
  };

  return (
    <div className="container">
      <h2>Check Leave Balance</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User ID"
          value={personId}
          onChange={(e) => setPersonId(e.target.value)}
          required
        />
        <button type="submit">Check Balance</button>
        
        <Link to="/apply-leave" className="link">Apply for Leave</Link>
        <Link to="/" className="link">Go to Home</Link>
      </form>

      {error && <p className="error">{error}</p>}
      {balanceData && (
        <div>
          <p><strong>User:</strong> {balanceData.name}</p>
          <p><strong>Available Leave Days:</strong> {balanceData.leaveBalance}</p>
        </div>
      )}
    </div>
  );
};

export default CheckBalance;
