import axios from "axios";

const API_URL = "http://localhost:5000";

export const registerUser = (userData) => axios.post(`${API_URL}/users/register`, userData);
export const loginUser = (userData) => axios.post(`${API_URL}/users/login`, userData);
export const applyLeave = (leaveData) => axios.post(`${API_URL}/leaves/apply`, leaveData);
export const checkLeaveBalance = (personId) => axios.get(`${API_URL}/leaves/balance/${personId}`);
