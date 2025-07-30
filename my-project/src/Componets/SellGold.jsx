import React, { useEffect, useState, useRef } from 'react';
import Sell from '../assets/Sell.png';
// import { toast } from 'react-toastify';
import axios from '../api/axios'

function Sellgold() {
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
      const res = await axios.post('request-sell/', {
        amount_in_rupees: amount,
        gold_in_grams: grams,
      });

      setLatestRequestId(res.data.request_id);
      notifiedRef.current = false;  // reset notification flag
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


  const handleRazorpay = async () => {
    try {
      const orderResponse = await axios.post('/create-razorpay-sell-order/', {
        request_id: latestRequestId,
      });

      const options = {
        key: razorpayKey,
        amount: orderResponse.data.amount,
        currency: 'INR',
        name: 'MetaGold',
        description: 'Sell Gold Payment',
        order_id: orderResponse.data.id,
        handler: async (response) => {
          try {
            await axios.post('/verify-sell-payment/', {
              request_id: latestRequestId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            alert('✅ Payment successful & verified!');
            fetchWallet();
            fetchTransactions();
          } catch (err) {
            console.error("Verification failed", err);
            alert("❌ Payment verification failed. Contact support.");
          }
        },
        theme: {
          color: '#f0b90b',
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error('Razorpay error:', error);
      alert('❌ Razorpay failed to load');
    }
  };


  useEffect(() => {
    setGrams((amount / goldPrice).toFixed(4));
  }, [amount]);

 useEffect(() => {
  if (!latestRequestId) return; // Don't start interval if no request ID

  const interval = setInterval(async () => {
    try {
      const res = await axios.get(`/sell-status/${latestRequestId}/`, {
        withCredentials: true,
      });

      const data = res.data;
      console.log("Polling approval status:", data);

      if (data.is_approved === true) {
        // notifiedRef.current = true;
        // clearInterval(interval);

        alert('🎉 Admin approved your sell request. Proceeding to payment...');

  // Slight delay to allow alert to complete before Razorpay opens
       
        handleRazorpay();
       
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
    <div className="gold-saver-container" style={{display: 'flex'}}>
      <div className="left" style={{marginRight: '-1px'}}>
        <img src={Sell} alt="vault" className="vault-image" />
        <h1>Sell your <br /><span>Gold Easily</span></h1>
        <p>Withdraw money by selling your stored gold anytime.</p>
        <div className="badges">
          <div>Instant Sell</div>
          <div>24 Karat</div>
          <div>Secure Transaction</div>
        </div>
      </div>

      <div className="right" style={{marginLeft: 'px'}}>
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
                onChange={(e) => {
                  const newAmount = parseFloat(e.target.value) || 0;
                  setAmount(newAmount);
                }}
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
