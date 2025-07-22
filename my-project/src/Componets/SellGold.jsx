import React, { useState } from 'react';
import './SellGold.css';
import { useNavigate } from 'react-router-dom';
import sell from '../assets/sell.png';
import sell2 from '../assets/sell2.png';
import logo from '../assets/logo.png'

function Sellgold() 
{
  const navigate = useNavigate();

const handleGetStarted = () => {
  navigate('/register');
};
  const [showPopup, setShowPopup] = useState(true);
  const [mobile, setMobile] = useState('');

  const handlePopupToggle = () => {
    setShowPopup(!showPopup);
  };

  return (
    <>
      <div>
        <section className="sell-gold-section">
          <div className="sell-left">
            <img src={sell} alt="sell" className="money-image" />
            <h1>Sell Gold Instantly</h1>
            <p>We've been told it is possible to revolutionize the payment industry.</p>

            <div className="features">
              <div className="feature-item"><span>100% Secure</span></div>
              <div className="feature-item"><span>24 Karat</span></div>
              <div className="feature-item"><span>99.95% Pure Gold</span></div>
            </div>
          </div>

          <div className="sell-right">
            <div className="login-card" onClick={handlePopupToggle}>
              <img src={sell2} alt="sell2" className="login-icon" />
              <h3>Login to Trade in Gold</h3>
              <p>Keep Trading with MetaGold</p>
            </div>
          </div>
        </section>
      </div>

      {/* POPUP Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-modal">
            <button className="popup-close" onClick={handlePopupToggle}>×</button>
            <div className="popup-content">
              <img src={logo} alt="popup-icon" className="popup-icon" />
              <h2>Welcome to MetaGold</h2>
              <input
                type="email"
                placeholder="Enter your E-mail address"
                className="mobile-input"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              <div className="checkbox-container">
                <input type="checkbox" id="creditAccess" />
                <label htmlFor="creditAccess" required >
                  Allow MetaGold to access your credit report from RBI approved companies to give you the best loan offers.
                </label>
              </div>
              <button className="next-btn" onClick={handleGetStarted}>Next</button>
              <p className="popup-footer">
                We'll text you to confirm your number. Standard message and data rates apply. Terms & conditions apply.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sellgold;