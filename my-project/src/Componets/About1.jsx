import React from 'react';
import { useNavigate } from 'react-router-dom';
import upi from '../assets/upi22.png';
import cashgold from '../assets/cash-gold.png';
import doorgold from '../assets/door-gold.png';
import withs from '../assets/with.svg';
import settings from '../assets/settings.svg';
import aero from '../assets/aero.svg';
import './About1.css';
import {useAuth} from './Authcontext'

const About1 = ({ amount = 1000, goldInGrams = 0.5, goldPrice = 6000, formattedTime = "5 min" }) => {
  const navigate = useNavigate();
    const { isLoggedIn, loading } = useAuth();

  const handleGetStarted = () => {
    navigate('/login');
  };
  const handleGetStartedee = () => {
    navigate('/help');
  };
  const handelHelp = () => {
    navigate('/about2');
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '20px',
  };

  const buttonStyle = {
    backgroundColor: '#805ef9',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    color: 'white',
    textDecoration: 'none',
  };
  return (

    <div>
      <main className="hero">
        <section className="left">
          <h1>
            "Buy and Sell <span className="highlight">24K gold!</span> Instantly. Securely. Smartly."
          </h1>

          {/* <button className="start-saving" onClick={handleGetStarted}>Login</button> */}
          {!isLoggedIn && (
        <button className="start-saving" onClick={handleGetStarted}>Login</button>
      )}

               {loading ? (
  <p style={{ textAlign: 'center', color: '#aaa' }}>Checking authentication...</p>
) : isLoggedIn ? (
  <div style={buttonContainerStyle}>
    <a href="/buygold" style={buttonStyle}>Buy Gold</a>
    <a href="/sellgold" style={buttonStyle}>Sell Gold</a>
  </div>
) : (
  <p style={{ textAlign: 'center', color: '#aaa' }}>Please log in to buy or sell gold</p>
)}

          <div className="powered-rating">
            <p className='powered' style={{ marginTop: '40px' }}> Powered by <img src={upi} alt="upi" /> </p>
            <div className="rating">
              <p>Rated <strong>5 ⭐️⭐️⭐️⭐️⭐️ by 3.5 Crore  users</strong></p>
            </div>
          </div>
        </section>

        
      </main>
      <div className="gold-banner-container">
        <div className="gold-banner-box">
          <p className="gold-banner-title">Trade 24K Gold with the MetaGold App</p>
          <p className="gold-banner-text">
            Turn everyday moments into long-term value by selling and buying in pure
            <span className="highlight-purple"> 24 carat gold</span>. With gold growing at
            <span className="highlight-green"> 11%</span>, every transaction is more than a trade—it's a step toward a stronger financial future.
          </p>
        </div>

        <div className="gold-banner-subtitle">
          <p>How it works?</p>
          <h2>
            Choose the way <span className="highlight-bold">you Buy and Sell.</span>
          </h2>
        </div>
      </div>
      <div className="savings-section">
        <div className="left-panel">
          <div className="daily-savings-card">
            <h2 className='h222'>Daily Savings</h2>
            <p className='pp'>Set a daily amount. Turn autosave on. Before you know, your savings will grow</p>
          </div>
        </div>
      </div>
      <div className="main-container">
        

        <div className="main-container">
          <h1 className="title">Trading on MetaGold: <span className="highlight">It's delightful.</span></h1>
          <div className="cards">

            {/* Card 1 */}
            <div className="card1">
              <div className="card">
                <div className="card-icon sun"><img src={settings} alt="" /></div>
                <div className="card-inner">
                  <p style={{ textAlign: 'center' }}>Select payment method</p>

                  <div className="payment-methods" style={{textAlign: 'center'}}>
                    <div className="method" >
                      {/* <div className="circle purple">पे</div> */}
                      <p>PhonePe</p>
                    </div>
                    <div className="method" >
                      <div className="circle white">paytm</div>
                      {/* <p>Paytm</p> */}
                    </div>
                  </div>
                </div>
                <h2 style={{ textAlign: 'center' }}>Automated system</h2>

                <p className="desc">
                  Trade every day, consistently. Choose an amount & never miss Trading again.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card2">
              <div className="card">
                <div className="card-icon arrows"><img src={aero} alt="" /></div>
                <div className="card-inner">
                  <p style={{ textAlign: 'center' }}>Select payment method</p>

                  <div className="buttons">
                    <button className="active">Daily</button>
                    <button>Weekly</button>
                    <button>Monthly</button>
                  </div>
                  <div className="slider-section">
                    <div className="slider-thumb"></div>
                    <p>Rs. 20 will be saved daily</p>
                  </div>
                </div>
                <h2>More ways to Trading</h2>
                <p className="desc">Daily, weekly, or monthly. Trade the way you like!</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card3">
              <div className="card">
                <div className="card-icon box"><img src={withs} alt="" /></div>
                <div className="card-inner">
                  <div className="withdraw">
                    <div className="withdraw-box">
                    </div>
                    <div className="withdraw-box">
                      <img src="https://img.icons8.com/color/24/delivery.png" alt="Gold"  style={{marginBottom: 0}}/>
                      <p>Gold delivery</p>
                    </div>
                  </div>
                  <p className="pause">
                    Pause Daily Savings <span className="pause-link">Pause</span>
                  </p>
                </div>
                <h2>Trading anytime</h2>
                <p className="desc">
                  Pause or cancel Trading anytime. Get your money back, no questions asked.
                </p>
              </div>
            </div>
          </div><br />

          

         

        <div className="gold-options-section">
          <h2 className="gold-title">Trade every day, withdraw any day</h2>
          <div className="options-container">
            <div className="option-card">
              <img src={cashgold} alt="Door with gold" />
              <p>Gold delivered<br />at doorstep</p>
            </div>
            <div className="or-divider">OR</div>
            <div className="option-card">
              <img src={doorgold} alt="Sell for cash" />
              <p>Sell your gold<br />for cash</p>
            </div>
          </div>
          <button className="learn-more-btn" onClick={handelHelp}>Learn More →</button>
        </div>

       </div>

        <div className="faq-header">
          <h2 className="faq-title">
            All your <span className="highlight">questions,</span> answered.
          </h2>
          <div className="faq-tabs">
            <button className="faq-tab active" style={{backgroundColor: 'darkgoldenrod'}}>All FAQs</button>
            <button className="faq-tab">MetaGold app</button>
            <button className="faq-tab">Digital gold</button>
            <button className="faq-tab">Withdrawal issues</button>
          </div>
        </div>

        <div className="faq-section">
          <div className="accordion">
            <div className="faq-item expanded">
              <div className="faq-question"  style={{color: 'white'}}>
                <strong>Is MetaGold App safe to use?</strong>
                <span className="arrow">&#9660;</span>
              </div>
              <div className="faq-answer"  style={{color: 'white'}}>
                MetaGold app is 100% safe and secure to use for your Daily Savings & Investments in Gold...
              </div>
            </div>
            {/* Add more questions if needed */}
          </div>
          <div className="load-more-wrapper">
            <button className="load-more-btn" onClick={handleGetStartedee}>Load more</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About1;