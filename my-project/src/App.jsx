import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Componets/Header';
import Footer from './Componets/Footer';
import About1 from './Componets/About1';
import About2 from './Componets/About2';
import ImageSlider from './Componets/ImageSlidebar';
import SellGold from './Componets/SellGold';
import Buygold from './Componets/Buygold';
import Bloghelp from './Componets/Bloghelp';
import Register from './Componets/Register';
import Login from './Componets/Login';
import Wallet from './Componets/Wallet';

import './Componets/About2.css';
import './Componets/Bloghelp.css';
import './Componets/Footer.css';
import './Componets/Buygold.css';
import './Componets/Register.css';
import './Componets/Login.css';
import './Componets/Wallet.css';  

function App() {
  const [amount, setAmount] = useState(100);
  const [timer, setTimer] = useState(62);
  const goldPrice = 10117.77;

  const goldInGrams = (amount && goldPrice) ? (amount / goldPrice).toFixed(4) : '0.0000';
  const formattedTime = `01:${timer.toString().padStart(2, '0')}`;

  // Clear tokens on reload
  useEffect(() => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }, []);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
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
        <Route
          path="/about2"
          element={
            <>
              <About2 />
              <ImageSlider />
            </>
          }
        />
        <Route path="/sellgold" element={<SellGold show={true} onClose={() => { }} />} />
        <Route path="/buygold" element={<Buygold />} />
        <Route path="/blog" element={<Bloghelp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route
          path="/About1"
          element={
            <About1
              amount={amount}
              goldInGrams={goldInGrams}
              goldPrice={goldPrice}
              formattedTime={formattedTime}
            />
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
