import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; 

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Leave Management System</h1>
      <p>Manage your leave applications and balance efficiently.</p>

      <div className="button-group">
        <Link to="/apply-leave" className="link">Apply for Leave</Link>
        <Link to="/check-balance" className="link">Check Leave Balance</Link>
      </div>
    </div>
  );
};

export default Home;
