import React, { useEffect, useRef, useState } from 'react';
import Buy from '../assets/Buy.png';
import axios from '../api/axios';

function Buygold() {
  const [amount, setAmount] = useState(100);
  const [grams, setGrams] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [latestRequestId, setLatestRequestId] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const notifiedRef = useRef(false);

  const razorpayKey = "DttsFGqzYGKlhsQKPslyTRSH";
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
      const res = await axios.post('request-buy/', {
        amount_in_rupees: Number(amount),
        gold_in_grams: Number(grams),
      });

      setLatestRequestId(res.data.request_id);
      notifiedRef.current = false;
      alert('✅ Buy request sent successfully. Awaiting admin approval.');
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

  const initialRazorpayPayment = async () => {
    const rupees = Number(amount);
    if (!latestRequestId) {
      alert("❌ No pending request found. Please confirm the order first.");
      return;
    }
    if (!Number.isFinite(rupees) || rupees < 1) {
      alert("❌ Enter a valid amount (₹1 or more) before paying.");
      return;
    }

    try {
      const res = await axios.post(
        'create-razorpay-order/',
        { request_id: latestRequestId, type: 'buy' },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const { order_id, amount: orderAmount, currency, key } = res.data;

      const options = {
        key: key || razorpayKey,
        amount: orderAmount,
        currency,
        name: "MetaGold",
        description: "Gold Purchase",
        order_id,
        handler: async function (response) {
          try {
            await axios.post('verify-payment/', {
              request_id: latestRequestId,
              type: 'buy',
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }, { withCredentials: true });

            alert('🎉 Payment successful and transaction completed!');
            setMessage('🎉 Payment successful and transaction completed!');
            setLatestRequestId(null);
            fetchWallet();
            fetchTransactions();
          } catch (err) {
            console.error("Payment verification failed:", err.response?.data || err);
            const msg = err.response?.data?.error
              || (typeof err.response?.data === 'string' ? err.response.data : '')
              || err.message
              || 'Please contact support.';
            alert(`❌ Payment verification failed: ${msg}`);
          }
        },
        theme: { color: "#ffd700" }
      };

      const openCheckout = () => new window.Razorpay(options).open();

      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = openCheckout;
        script.onerror = () => alert("❌ Could not load Razorpay SDK.");
        document.body.appendChild(script);
      } else {
        openCheckout();
      }
    } catch (error) {
      console.error("Payment initiation failed:", error.response?.status, error.response?.data || error);
      alert(`❌ Could not initiate payment: ${error.response?.data?.detail || error.message}`);
    }
  };

  useEffect(() => {
    const g = amount / goldPrice;
    setGrams(Number.isFinite(g) ? Number(g.toFixed(4)) : 0);
  }, [amount]);

  useEffect(() => {
    if (!latestRequestId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`buy-status/${latestRequestId}/`, {
          withCredentials: true,
        });

        const data = res.data;
        if (data.is_approved === true && !notifiedRef.current) {
          notifiedRef.current = true;
          alert('✅ Admin approved. Proceeding to payment...');
          clearInterval(interval);
          initialRazorpayPayment();
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
    <div className="gold-saver-container">
      <div className="left">
        <img src={Buy} alt="vault" className="vault-image" />
        <h1>Start Trading in <br /><span>Gold with <span className="highlight">₹ 10</span></span></h1>
        <p>We've been told it is possible to revolutionize the <br />payment industry.</p>
        <div className="badges">
          <div>100% Secure</div>
          <div>24 Karat</div>
          <div>99.95% Pure Gold</div>
        </div>
      </div>

      <div className="right">
        <div className="step-box">
          <div className="step-num">1</div>
          <div className="step-content">
            <h4>Enter Amount (in ₹)</h4>
            <div className="tabs">
              <button className="active">In Rupees</button>
            </div>
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
            <p style={{ marginTop: '10px' }}>📏 Gold: <b>{grams} grams</b></p>
            <div className="live-box">
              <span className="live-dot">🔴 LIVE</span>
              Buy Price: <b>₹{goldPrice}/g</b>
              <span className="validity">Valid for: 04:49</span>
            </div>
            <button
              className="confirm-btn"
              onClick={handleConfirm}
              disabled={loading || !!latestRequestId}
            >
              {loading ? "Submitting..." : "Confirm Order"}
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

export default Buygold;
