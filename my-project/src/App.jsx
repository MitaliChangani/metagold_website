
import { useState, useEffect } from 'react'
import Header from './Componets/Header'
import './Componets/Header.css'
import './Componets/About1.css'
import About1 from './Componets/About1'
import Footer from './Componets/Footer'
import './Componets/Footer.css'
import Buygold from './Componets/Buygold'
import './Componets/Buygold.css'

function App() {
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

  return (
    <>

      <Header />
      <About1 amount={amount} goldInGrams={goldInGrams} goldPrice={goldPrice} formattedTime={formattedTime} />
      <Footer />
      <Buygold/>
    </>
  );
}

export default App;








