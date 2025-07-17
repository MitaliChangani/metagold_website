import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './Componets/Header'
import './Componets/Header.css'

import { useState, useEffect } from 'react';
import './App.css';


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

    <Header/>

      <header>
        <nav className="navbar">
          <ul className="nav-menu">
            <li><a href="#">MetaGold</a></li>
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

      <main className="hero">
        <section className="left">
          <h1>
            Save Money in <span className="highlight">digital gold</span> from ₹ 10.
          </h1>
          <p>It’s automatic. Like magic.</p>
          <button className="start-saving">Start Saving</button>

          <div className="powered-rating">
            <p className="powered">
              Powered by <img src="" alt="UPI" />
            </p>
            <div className="rating">
              <p>Rated <strong>4.7</strong></p>
              <span>⭐️⭐️⭐️⭐️⭐️½</span>
              <span>by <strong>3.5 Crore</strong> users</span>
            </div>
          </div>
        </section>

        <section className="right">
          <div className="card">
            <div className="tabs">
              <button className="active">Buy</button>
              <button>Sell</button>
            </div>

            <label className="label">Enter gold amount</label>
            <div className="input-toggle">
              <button className="active">In Rupees</button>
              <button>In Grams</button>
            </div>

            <div className="amount">
              ₹ {amount}
              <span>{goldInGrams} g</span>
            </div>

            <div className="price-box">
              <span className="live">🔴 LIVE</span>
              <span className="price">Price: ₹{goldPrice.toFixed(2)}/g</span>
              <span className="validity">Valid for: {formattedTime}</span>
            </div>

            <button className="buy-now">Buy Now</button>
          </div>
        </section>
      </main>

    <header>
  <nav class="navbar">
    <ul class="nav-menu">
      <li><a href="#">MetaGold</a></li>
      <li class="dropdown">
        <a href="#">About Us</a>
        <ul class="dropdown-menu">
          <li><a href="#">What's MetaGold</a></li>
          <li><a href="#">Team</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">MetaGold Diaries</a></li>
        </ul>
      </li>
      <li class="dropdown">
        <a href="#">Features</a>
        <ul class="dropdown-menu">
          <li><a href="#">Buy Gold</a></li>
          <li><a href="#">Sell Gold</a></li>
        </ul>
      </li>
      <li class="dropdown">
        <a href="#">Resources</a>
        <ul class="dropdown-menu">
          <li><a href="#">Blog</a></li>
          <li><a href="#">Insights</a></li>
          <li><a href="#">Customer Stories</a></li>
          <li><a href="#">Downloadable</a></li>
        </ul>
      </li>
      <li class="dropdown">
        <a href="#">Help</a>
        <ul class="dropdown-menu">
          <li><a href="#">Contact</a></li>
          <li><a href="#">MetaGold How To's</a></li>
          <li><a href="#">FAQs</a></li>
        </ul>
      </li>
    </ul>
  </nav>
</header>

    </>
  );
}
export default App;