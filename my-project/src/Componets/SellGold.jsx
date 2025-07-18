import React from 'react';
import './SEllGold.css';

const SellGold = ({ show, onClose }) => {
  return (
    <div className={`login-sidebar ${show ? 'show' : ''}`}>
      <button className="close-btn" onClick={onClose}>×</button>
      <div className="login-content">
        <img src="/logo.png" alt="Jar Icon" className="jar-icon" />
        <h2>Welcome to Jar</h2>
        
        <input
          type="text"
          placeholder="Enter mobile number"
          className="input-field"
        />
        
        <div className="checkbox-section">
          <input type="checkbox" id="consent" />
          <label htmlFor="consent">
            Allow Jar to access your credit report from RBI approved companies to give you the best loan offers.
          </label>
        </div>

        <button className="next-btn">Next</button>

        <p className="terms-text">
          We'll text you to confirm your number. Standard message and data rates apply. <br />
          <span className="link">Terms & conditions apply</span>
        </p>
      </div>
    </div>
  );
};

export default SellGold;