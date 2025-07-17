import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Componets/Header'
import './Componets/Header.css'
import './Componets/About1.css'
import './Componets/About2.css'
import About1 from './Componets/About1'
import About2 from './Componets/About2'
import ImageSlider from './Componets/ImageSlidebar';
import SellGold from './Componets/SellGold';



function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [amount, setAmount] = useState(100);
  const goldPrice = 10117.77;
  const [timer, setTimer] = useState(62);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const goldInGrams = (amount / goldPrice).toFixed(4);
  const formattedTime = `01:${timer.toString().padStart(2, '0')}`;
    useEffect(() => {
    setShowLogin(true);
  }, []);

  return (
    <>
        <Router>
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
         {/* <Route path="/sellgold" element={
          <>
            <SellGold/>
          </>
        } /> */}
        <Route
  path="/sellgold"
  element={<SellGold show={true} onClose={() => {}} />}
/>
     
      </Routes>
    </Router>
    </>
  );
}



export default App




