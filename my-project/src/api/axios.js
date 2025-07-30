// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api/v1/',
  withCredentials: true,  // ✅ important for cookie-based auth
});

export default instance;
