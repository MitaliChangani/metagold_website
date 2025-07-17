import React, { useState, useEffect, useRef } from 'react';
import './ImageSlidebar.css';
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import img4 from '../assets/img4.png';
import img5 from '../assets/img5.png';

const images = [img1, img2, img3, img4, img5];

const ImageSlidebar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  // Detect when slider is visible on screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 } // Adjust as needed
    );

    if (sliderRef.current) {
      observer.observe(sliderRef.current);
    }

    return () => {
      if (sliderRef.current) observer.unobserve(sliderRef.current);
    };
  }, []);

  // Start animation when visible, stop at last image
  useEffect(() => {
    if (!isVisible) return;

    setCurrentIndex(0); // Reset to first image
    clearInterval(intervalRef.current); // Clear previous if any

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev === images.length - 1) {
          clearInterval(intervalRef.current); // stop after last
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isVisible]);

  return (
    <div className="slider-container" ref={sliderRef}>
      <div
        className="slider-wrapper"
        style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: 'transform 0.5s ease-in-out' }}
      >
        {images.map((img, index) => (
          <img src={img} alt={`slide-${index}`} className="slide" key={index} />
        ))}
      </div>
    </div>
  );
};

export default ImageSlidebar;
