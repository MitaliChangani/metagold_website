import React from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom';
const Header = () => {
  return (
    <>
      <header>
        <nav className="navbar">
          <ul className="nav-menu">

            <li><a href="/"><img src={logo} alt="" /></a></li>


            <li><Link to="/">MetaGold</Link></li>

            <li className="dropdown">
              <span >About Us</span>
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
                <li><Link to="buygold">Buy Gold</Link></li>
                <li><Link to="/sellgold">Sell Gold</Link></li>
              </ul>
            </li>
            <li className="dropdown">
              <span>Resources</span>
              <ul className="dropdown-menu">
                <li><Link to="#">Help Blog</Link></li>
                <li><Link to="#">Downloadable</Link></li>
                <li><Link to="#">Contact</Link></li>
              </ul>
            </li>
            
          </ul>

          <button className="btn">Buy 24k Gold</button>

        </nav>
      </header>
    </>
  )
}



export default Header;