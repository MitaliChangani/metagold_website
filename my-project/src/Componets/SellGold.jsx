import React, { useEffect, useState, useRef } from 'react';
import Sell from '../assets/Sell.png';
import axios from '../api/axios';

function Sellgold() {
  const [amount, setAmount] = useState(100);
  const [grams, setGrams] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [latestRequestId, setLatestRequestId] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const notifiedRef = useRef(false);

  const goldPrice = 10086.03;

  const fetchWallet = async () => {
    try {
      const res = await axios.get('wallet/');
      setWallet(res.data);
    } catch (error) {
      console.error('Wallet fetch error:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('transactions/');
      setTransactions(res.data);
    } catch (error) {
      console.error('Transaction fetch error:', error);
    }
  };

  const handleConfirm = async () => {
    if (amount < 10) {
      alert('Minimum amount is ₹10.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('request-sell/', {
        amount_in_rupees: amount,
        gold_in_grams: grams,
      });

      setLatestRequestId(res.data.request_id);
      notifiedRef.current = false;
      alert('✅ Sell request sent successfully. Awaiting admin approval.');
    } catch (err) {
      console.error(err);
      if (err.response?.data?.detail) {
        alert(`❌ ${err.response.data.detail}`);
      } else {
        alert('❌ Failed to send request.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setGrams((amount / goldPrice).toFixed(4));
  }, [amount]);

  useEffect(() => {
    if (!latestRequestId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/sell-status/${latestRequestId}/`, {
          withCredentials: true,
        });

        if (res.data.is_approved === true && !notifiedRef.current) {
          notifiedRef.current = true;
          alert('🎉 Admin approved your sell request. Funds will be credited soon.');
          fetchWallet();
          fetchTransactions();
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error checking approval status:', error);

        if (error.response?.status === 401) {
          alert('Session expired. Please log in again.');
          clearInterval(interval);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [latestRequestId]);

  return (
    <div className="gold-saver-container" style={{ display: 'flex' }}>
      <div className="left" style={{ marginRight: '-1px' }}>
        <img src={Sell} alt="vault" className="vault-image" />
        <h1>Sell your <br /><span>Gold Easily</span></h1>
        <p>Withdraw money by selling your stored gold anytime.</p>
        <div className="badges">
          <div>Instant Sell</div>
          <div>24 Karat</div>
          <div>Secure Transaction</div>
        </div>
      </div>

      <div className="right">
        <div className="step-box">
          <div className="step-num">1</div>
          <div className="step-content">
            <h4>Enter Amount (in ₹)</h4>
            <div className="input-box">
              <input
                type="number"
                min="10"
                step="1"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                placeholder="Enter amount in INR"
                className="grams-input"
              />
              <span style={{ marginTop: '10px' }}>INR</span>
            </div>
            <p style={{ marginTop: '10px' }}>📏 Gold to sell: <b>{grams} grams</b></p>
            <div className="live-box">
              <span className="live-dot">🔴 LIVE</span>
              Sell Price: <b>₹{goldPrice}/g</b>
              <span className="validity">Valid for: 04:49</span>
            </div>
            <button className="confirm-btn" onClick={handleConfirm} disabled={loading}>
              {loading ? "Submitting..." : "Confirm Sell"}
            </button>
            {message && <p style={{ marginTop: '12px', color: 'green' }}>{message}</p>}
          </div>
        </div>

        <div className="step-box">
          <div className="step-num">2</div>
          <div className="step-content">
            <h4>Order Preview</h4>
            <p>Amount: ₹ {amount}</p>
            <p>Gold: {grams} grams</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sellgold;
