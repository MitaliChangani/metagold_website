// src/Components/Register.jsx
import React, { useState } from "react";
import axios from "../api/axios";  // ⬅️ Better: import from your axiosInstance
import './Register.css';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("❌ Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("register/", {
        username: form.username,
        email: form.email,
        password: form.password
      });

      setSuccess(res.data.message || "✅ Registration successful");
      setTimeout(() => {
        navigate('/login'); // Redirect to login after success
      }, 1500);
    } catch (err) {
      const data = err.response?.data;
      let errorMsg = "❌ Registration failed";
      if (typeof data === 'string') errorMsg = data;
      else if (data?.error) errorMsg = data.error;
      else if (data?.username) errorMsg = data.username[0];
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        {success && <p className="success-msg">{success}</p>}
        {error && <p className="error-msg">{error}</p>}
        
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <p className="login-link">
          Already have an account? <a href="/login">Login here</a></p>
      </form>
    </div>
  );
}
