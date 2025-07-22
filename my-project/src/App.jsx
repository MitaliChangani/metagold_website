import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import Header from './Componets/Header'
import './Componets/About2.css'
import About1 from './Componets/About1'

import Contact from './Componets/Contact';
import Downloadable from './Componets/Downloadable';
import Footer from './Componets/Footer'
import './Componets/Footer.css'
import Buygold from './Componets/Buygold'
import './Componets/Buygold.css'

import About2 from './Componets/About2'
import ImageSlider from './Componets/ImageSlidebar';
import SellGold from './Componets/SellGold'

import Blog from './Componets/Blog';
import Help from './Componets/Help';
import Register from './Componets/Register';
import Login from './Componets/Login';

import Wallet from './Componets/Wallet';
function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [amount, setAmount] = useState(100);
  const goldPrice = 10117.77;
  const [timer, setTimer] = useState(62);



  useEffect(() => {
    // Clear tokens on app reload
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const goldInGrams = (amount && goldPrice) ? (amount / goldPrice).toFixed(4) : '0.0000';
  const formattedTime = `01:${timer.toString().padStart(2, '0')}`;
  useEffect(() => {
    setShowLogin(true);
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <About1
              amount={amount}
              goldInGrams={goldInGrams}
              goldPrice={goldPrice}
              formattedTime={formattedTime}
            />
          }
        />
        <Route path="/about2" element={
          <>
            <About2 />
            <ImageSlider />
          </>
        } />
        <Route
          path="/sellgold"
          element={<SellGold show={true} onClose={() => { }} />}
        />
        <Route
          path="/buygold"
          element={<Buygold />}
        />
        <Route
          path="/help"
          element={<Help />}
        />

        <Route
          path="/blog"
          element={<Blog />}
        />


        <Route
          path="/downloadable"
          element={<Downloadable />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />
        
        <Route
          path="/wallet"
          element={<Wallet />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/About1" element={<About1 />} />

      </Routes>
      <Footer />
    </>
  );
}
export default App;
