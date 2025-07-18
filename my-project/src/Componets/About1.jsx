import React from 'react'
import upi from '../assets/upi22.png'
import cashgold from '../assets/cash-gold.png'
import doorgold from '../assets/door-gold.png'
import './About1.css';
const About1 = ({ amount, goldInGrams, goldPrice, formattedTime }) => {
  return (
    <>
      <main className="hero">
        <section className="left">
          <h1>
            "Buy and Sell <span className="highlight">24K gold!</span> Instantly. Securely. Smartly."
          </h1>

          <button className="start-saving">Get Started</button>

          <div className="powered-rating">
            <p className="powered">


              Powered by <img src={upi} alt="upi" />
            </p>
            <div className="rating">
              <p>Rated <strong>4.7</strong></p>
              <span>⭐️⭐️⭐️⭐️⭐️½</span>
              <span>by <strong>3.5 Crore</strong> users</span>
            </div>
          </div>
        </section>
        <section>
                    <div className="powered-rating">
                        <p className="powered">Powered by <img src={upi} alt="UPI" />
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
              <span className="price">Price: ₹{goldPrice?goldPrice.toFixed(2):'0.00'}/g</span>
              <span className="validity">Valid for: {formattedTime}</span>
            </div>

            <button className="buy-now">Buy Now</button>
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
            <h2>Buy & Sell Gold</h2>
            <p>Trade 24K gold instantly. Buy when the price is right, sell when you need — all in one tap.</p>
            <div className="button-group">
              <button className="learn-btn">Learn More</button>
              <button className="watch-btn">▶ Watch Video</button>
            </div>
          </div>

          <div className="option-card">Get Started</div>
          <div className="option-card">Manual savings</div>
        </div>
      </div>
      <div className="main-container">
        <h1 className="title">
          Trading on MetaGold: <span className="highlight">It’s delightful.</span>
        </h1>

        <div className="cards">
          {/* Card 1 */}
          <div className="card">
            <div className="card-icon sun" />
            <div className="card-inner">
              <p className="card-header">Select payment method</p>
              <div className="payment-methods">
                <div className="method">
                  <div className="circle purple">पे</div>
                  <p>PhonePe</p>
                </div>
                <div className="method">
                  <div className="circle white">paytm</div>
                  <p>Paytm</p>
                </div>
              </div>
            </div>
            <h2>Automated system</h2>
            <p className="desc">
              Trade every day, consistently. Choose an amount & never miss Trading again.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card">
            <div className="card-icon arrows" />
            <div className="card-inner">
              <p className="card-header">Select frequency</p>
              <div className="buttons">
                <button className="active">Daily</button>
                <button>Weekly</button>
                <button>Monthly</button>
              </div>
              <div className="slider-section">
                <div className="slider-thumb">20</div>
                <p>Rs. 20 will be saved daily</p>
              </div>
            </div>
            <h2>More ways to Trading</h2>
            <p className="desc">Daily, weekly, or monthly. Trade the way you like!</p>
          </div>

          {/* Card 3 */}
          <div className="card">
            <div className="card-icon box" />
            <div className="card-inner">
              <div className="withdraw">
                <div className="withdraw-box">
                  <img src="https://img.icons8.com/fluency/24/money-withdrawal.png" alt="Withdraw" />
                  <p>Withdraw cash</p>
                </div>
                <div className="withdraw-box">
                  <img src="https://img.icons8.com/color/24/delivery.png" alt="Gold" />
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
      </div>
      <div className="gold-section">
        <p className="gold-text">
          Want to know how your gold savings will perform?
        </p>
        <button className="gold-button">Calculate now</button>
      </div>
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
        <button className="learn-more-btn">Learn More →</button>
      </div>
      <section className="blog-section">
        <p className="sub-heading">Blogs</p>
        <h2 className="main-heading">
          Our centre of <span className="highlight">knowledge.</span>
        </h2>

        <div className="blogs">
          <div className="blog-card">
            <h3>Own a Zepto Franchise: Cost, Documents, Process, and More</h3>
            <p className="meta">5 min read • Beginner</p>
          </div>

          <div className="blog-card">
            <h3>
              How to Start a Mother Dairy Franchise in India: Cost, Profit & More
            </h3>
            <p className="meta">5 min read • Beginner</p>
          </div>

          <div className="blog-card">
            <h3>
              Top 15 Richest YouTubers in India 2025 <br /> (Updated)
            </h3>
            <p className="meta">5 min read • Beginner</p>
          </div>
        </div>

        <button className="view-button">View all blogs</button>
      </section>
      <div className="faq-header">
        <h2 className="faq-title">
          All your <span className="highlight">questions,</span> answered.
        </h2>
        <div className="faq-tabs">
          <button className="faq-tab active">All FAQs</button>
          <button className="faq-tab">Jar app</button>
          <button className="faq-tab">Digital gold</button>
          <button className="faq-tab">Withdrawal issues</button>
        </div>
      </div>
      <div className="faq-section">
        <div className="accordion">
          <div className="faq-item expanded">
            <div className="faq-question">
              <strong>Is Jar App safe to use?</strong>
              <span className="arrow">&#9660;</span>
            </div>
            <div className="faq-answer">
              Jar app is 100% safe and secure to use for your Daily Savings & Investments in Gold.
              The gold is stored in world class vaults by BRINKS. BRINKS is a global market leader
              in secure logistics and vault services that stores and safeguards all the gold that
              you have purchased via Jar platform. Furthermore, to safeguard your interest, Jar has
              appointed an independent Administrator, VISTRA.
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <strong>What does the Jar App do?</strong>
              <span className="arrow">&#9660;</span>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <strong>How do I download the Jar App?</strong>
              <span className="arrow">&#9660;</span>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <strong>Is digital gold Real gold?</strong>
              <span className="arrow">&#9660;</span>
            </div>
          </div>
        </div>

        <div className="load-more-wrapper">
          <button className="load-more-btn">Load more</button>
        </div>
      </div>

    </>
  )
}
export default About1