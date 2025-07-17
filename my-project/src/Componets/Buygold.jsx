import React from 'react'
import Buy from '../assets/Buy.png'

function Buygold() {
  return (
    <div>
      <>
      <div className="gold-saver-container">
      <div className="left">
        <img src={Buy} alt="vault" className="vault-image" />
        <h1>
          Start Trading in <br />
          <span>Gold with <span className="highlight">₹ 10</span></span>
        </h1>
        <p>
          We've been told it is possible to revolutionize the <br />
          payment industry.
        </p>
        <div className="badges">
          <div>100% Secure</div>
          <div>24 Karat</div>
          <div> 99.95% Pure Gold</div>
        </div>
      </div>

      <div className="right">
        <div className="step-box">
          <div className="step-num">1</div>
          <div className="step-content">
            <h4>Enter Gold Amount</h4>
            <div className="tabs">
              <button className="active">In Rupees</button>
              <button>In Grams</button>
            </div>
            <div className="input-box">
              <span>₹ 121</span>
              <span className="gray">0.0116g</span>
            </div>
            <div className="live-box">
              <span className="live-dot">🔴 LIVE</span>
              Buy Price: <b>₹10086.03/g</b>
              <span className="validity">Valid for: 04:49</span>
            </div>
            <button className="confirm-btn">Confirm Order</button>
          </div>
        </div>

        <div className="step-box">
          <div className="step-num">2</div>
          <div className="step-content">
            <h4>Order preview</h4>
          </div>
        </div>
      </div>
    </div>
    </>
    </div>
  )
}

export default Buygold
