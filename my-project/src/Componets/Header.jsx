import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import './Header.css';
import { useAuth } from './Authcontext'

const Header = () => {
  const navigate = useNavigate();
   const { isLoggedIn, loading } = useAuth();
  

  const handleGetStarted = () => {
    navigate('/buygold');
  };

  const handleGetStartede = () => {
    navigate('/Login');
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const closeMenu = () => setIsMenuOpen(false);
  return (
    <header>
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="logo-link">
            <img src={logo} alt="MetaGold Logo" className="logo" style={{ height: 120 }} />
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

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`} style={{}}>
          <li className="dropdown">
            <span style={{ color: 'white' }}>About Us</span>
            <ul className="dropdown-menu">
              <li><Link to="/about2"onClick={() => setIsMenuOpen(false)}>What's MetaGold</Link></li>
              <li><Link to="#"onClick={() => setIsMenuOpen(false)}>Team</Link></li>
              <li><Link to="#"onClick={() => setIsMenuOpen(false)}>Careers</Link></li>
              <li><Link to="#"onClick={() => setIsMenuOpen(false)}>MetaGold Diaries</Link></li>
            </ul>
          </li>

          <li className="dropdown">
            <span style={{ color: 'white' }}>Features</span>
            <ul className="dropdown-menu">
              <li><Link to="/transactions" onClick={() => setIsMenuOpen(false)}>Transaction History</Link></li>
              <li><Link to="/wallet" onClick={() => setIsMenuOpen(false)}>Wallet</Link></li>
            </ul>
          </li>

          <li className="dropdown">
            <span style={{ color: 'white' }}>Resources</span>
            <ul className="dropdown-menu">
              <li><Link to="/help" onClick={() => setIsMenuOpen(false)}>Help</Link></li>
              <li><Link to="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link></li>
              <li><Link to="/downloadable" onClick={() => setIsMenuOpen(false)}>Downloadable</Link></li>
              <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
            </ul>
          </li>
          <li>  {!isLoggedIn && (
        <button className="btn" onClick={()=>{
          handleGetStartede();

         setIsMenuOpen(false);} }>Login</button>
      )}</li>

        </ul>
      </nav>
    </header>
  );
};
export default Header;