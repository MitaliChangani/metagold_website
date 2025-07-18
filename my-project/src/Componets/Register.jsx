import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8000/api/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);

      setMessage("Registration successful!");
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      // Optional: Redirect to login after 1.5s
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

    } catch (err) {
      console.error("Registration error:", err);
      const errorData = err.response?.data;
      let errorMsg = "Registration failed.";

      if (errorData) {
        if (errorData.username) errorMsg = errorData.username;
        else if (errorData.email) errorMsg = errorData.email;
        else if (errorData.password) errorMsg = errorData.password;
        else if (errorData.message) errorMsg = errorData.message;
      }

      setError(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <p className="login-link">
          Already have an account? <a href="/login">Login</a></p>
      </form>
    </div>
  );
};

export default Register;
