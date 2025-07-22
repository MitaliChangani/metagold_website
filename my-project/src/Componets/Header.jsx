import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

const handleGetStarted = () => {
  navigate('/Buygold');
};

const handleGetStartede = () => {
  navigate('/Login');
};
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header>
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="logo-link">
            <img src={logo} alt="MetaGold Logo" className="logo" />
          </Link>
          <button
            className="hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="dropdown">
            <span>About Us</span>
            <ul className="dropdown-menu">
              <li><Link to="/about2">What's MetaGold</Link></li>
              <li><Link to="#">Team</Link></li>
              <li><Link to="#">Careers</Link></li>
              <li><Link to="#">MetaGold Diaries</Link></li>
            </ul>
          </li>

          <li className="dropdown">
            <span>Features</span>
            <ul className="dropdown-menu">
               <li><Link to="#">Transaction History</Link></li>
              <li><Link to="/Wallet">Wallet</Link></li>
              <li><Link to="/buygold">Buy Gold</Link></li>
              <li><Link to="/sellgold">Sell Gold</Link></li>
            </ul>
          </li>

          <li className="dropdown">
            <span>Resources</span>
            <ul className="dropdown-menu">
              <li><Link to="/help">Help</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/downloadable">Downloadable</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </li>

          <li><button className="btn" onClick={handleGetStarted}>Buy 24k Gold</button></li>
          <li><button className="btn" onClick={handleGetStartede}>Login</button></li>
          
        </ul>
      </nav>
    </header>
  );
};

export default Header;
