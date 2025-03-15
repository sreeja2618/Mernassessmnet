import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ApplyLeave from "./components/ApplyLeave";
import CheckBalance from "./components/CheckBalance";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-leave" element={<ApplyLeave />} />
        <Route path="/check-balance" element={<CheckBalance />} />
      </Routes>
    </Router>
  );
}

export default App;
