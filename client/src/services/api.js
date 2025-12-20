import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', // <- ensure '/api' if backend routes are prefixed
  withCredentials: true, // optional, if you use cookies
});

export default API;
