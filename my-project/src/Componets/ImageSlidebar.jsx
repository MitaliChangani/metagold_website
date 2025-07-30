import React, { useState, useEffect, useRef } from 'react';
import './ImageSlidebar.css';
import img1 from '../assets/imagesliderimage.png';
import './Login';
import { useAuth } from './Authcontext'
import { Navigate, useNavigate } from 'react-router-dom';
const ImageSlidebar = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate('/Login');
  };
   const [isMenuOpen, setIsMenuOpen] = useState(false);
      const { isLoggedIn, loading } = useAuth();
  return (
    <div className="hero-section">
      <div className="hero-image">
        <img src={img1} alt="controller emoji" />
      </div>
      {!isLoggedIn && (
        <button className='start' onClick={()=>{
          handleGetStarted();

         setIsMenuOpen(false);} }>Login</button>
      )}
    </div>
  );
};
export default ImageSlidebar;