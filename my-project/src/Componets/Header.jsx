import React from 'react'
import logo from '../assets/logo.png'

const Header = () => {
  return (
    <>
        <header>
  <nav className="navbar">
    <ul className="nav-menu">
      <li><a href="#"><img src={logo} alt="" /></a></li>
      <li className="dropdown">
        <a href="#">About Us</a>
        <ul className="dropdown-menu">
          <li><a href="#">What's MetaGold</a></li>
          <li><a href="#">Team</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">MetaGold Diaries</a></li>
        </ul>
      </li>
      <li className="dropdown">
        <a href="#">Features</a>
        <ul className="dropdown-menu">
          <li><a href="#">Buy Gold</a></li>
          <li><a href="#">Sell Gold</a></li>
        </ul>
      </li>
      <li className="dropdown">
        <a href="#">Resources</a>
        <ul className="dropdown-menu">
          <li><a href="#">Blog</a></li>
          <li><a href="#">Insights</a></li>
          <li><a href="#">Customer Stories</a></li>
          <li><a href="#">Downloadable</a></li>
        </ul>
      </li>
      <li className="dropdown">
        <a href="#">Help</a>
        <ul className="dropdown-menu">
          <li><a href="#">Contact</a></li>
          <li><a href="#">MetaGold How To's</a></li>
          <li><a href="#">FAQs</a></li>
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