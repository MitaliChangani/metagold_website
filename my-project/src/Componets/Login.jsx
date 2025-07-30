// src/Components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../api/axios"; // Your configured Axios instance
import './Login.css';
import { useAuth } from './Authcontext'

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/about1'); // or wherever you want to redirect
  };
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submit

    try {
      await axios.post(
        'http://localhost:8000/api/v1/login/',
        { username, password},
        { withCredentials: true } // Include credentials for cookie-based auth
      );

      // ✅ On success, redirect user
      login();
      navigate('/About1'); // Change route as needed
    } catch (err) {
      const res = err.response?.data;
      let msg = 'Login failed. Please try again.';
      if (typeof res === 'string') msg = res;
      else if (res?.error) msg = res.error;
      setError(msg);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 style={{ marginTop: '5px' }}>Login</h2>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" onClick={handleLogin}>Login</button>
        </form>
        <p className="register-link">
          Don’t have an account? <a href="/Contact">Contact Agent</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
