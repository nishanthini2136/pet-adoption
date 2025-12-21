import axios from "axios";

const API = axios.create({
  // Support both env names in case the deployment used REACT_APP_API_URL
  baseURL:
    process.env.REACT_APP_API_BASE_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
