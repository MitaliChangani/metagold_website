import React, { useEffect, useRef, useState } from 'react';
import Buy from '../assets/Buy.png';
// import { toast } from 'react-toastify';
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

  const razorpayKey = "YOUR_PUBLIC_RAZORPAY_KEY";

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
        amount_in_rupees: amount,
        gold_in_grams: grams,
      });

      setLatestRequestId(res.data.request_id);
      notifiedRef.current = false;  // reset notification flag
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
    try{
     const res = await axios.post(`/create-razorpay-order/`, {
      amount: amount,  // Amount in ₹
    }, { withCredentials: true });

      const { order_id, amount, currency } = res.data;

      const options = {
        key: razorpayKey,
        amount,
        currency,
        name: "MetaGold",
        description: "Gold Purchase",
        order_id,
        handler: async function (response) {
          // You can send payment success to backend here
          
          try{
          await axios.post('/verify-payment/', {
            request_id: latestRequestId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
          alert('🎉 Payment successful and transaction completed!');
          fetchWallet();
          fetchTransactions();
        } catch (err){
          console.error("Payment verification failed:", err);
          alert("❌ Payment verified failed. Please contact support.");
        }
        },
        theme: { color: "#ffd700" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("❌ Could not initiate Razorpay payment.");
    }
  };

  useEffect(() => {
    setGrams((amount / goldPrice).toFixed(4));
  }, [amount]);

 useEffect(() => {
  if (!latestRequestId) return; // Don't start interval if no request ID

  const interval = setInterval(async () => {
    try {
      const res = await axios.get(`/buy-status/${latestRequestId}/`, {
        withCredentials: true,
      });

      const data = res.data;
      // console.log("Polling approval status:", data);

      if (data.is_approved === true) {
        alert('✅ Admin approved. Proceeding to payment...');
        // setLatestRequestId(null);
        // fetchWallet();         // refresh wallet info
        // fetchTransactions();   // refresh transaction history
        // clearInterval(interval); // stop polling

        initialRazorpayPayment();


      }
    } catch (error) {
      console.error('Error checking approval status:', error);

      if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
        clearInterval(interval);
      }
    }
  }, 5000); // poll every 5 seconds

  return () => clearInterval(interval); // cleanup on unmount or change
}, [latestRequestId]); // runs only when latestRequestId changes

  

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
            <button className="confirm-btn" onClick={handleConfirm} disabled={loading}>
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
