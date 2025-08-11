// src/pages/AdminDashboard.jsx

import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';
// Put your Razorpay Key ID in an env var if possible
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'DttsFGqzYGKlhsQKPslyTRSH';

const AdminDashboard = () => {
  const [buyRequests, setBuyRequests] = useState([]);
  const [sellRequests, setSellRequests] = useState([]);
  const [rzpReady, setRzpReady] = useState(false);

  useEffect(() => {
    // Load Razorpay script once
    const s = document.createElement('script');
    s.src = RAZORPAY_SCRIPT;
    s.onload = () => setRzpReady(true);
    s.onerror = () => console.error('Failed to load Razorpay script');
    document.body.appendChild(s);

    fetchBuyRequests();
    fetchSellRequests();
  }, []);

  const fetchBuyRequests = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin-buy-requests/', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const t = await res.text();
        console.error('Error fetching buy requests:', res.status, t);
        setBuyRequests([]);
        return;
      }
      const data = await res.json();
      setBuyRequests(Array.isArray(data) ? data.filter((req) => !req.is_approved) : []);
    } catch (err) {
      console.error('Error fetching buy requests:', err);
    }
  };

  const fetchSellRequests = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin-sell-requests/', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const t = await res.text();
        console.error('Error fetching sell requests:', res.status, t);
        setSellRequests([]);
        return;
      }
      const data = await res.json();
      setSellRequests(Array.isArray(data) ? data.filter((req) => !req.is_approved) : []);
    } catch (err) {
      console.error('Error fetching sell requests:', err);
    }
  };

  const approveBuy = async (requestId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/approve-buy/${requestId}/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || '❌ Failed to approve buy request.');
        console.error('❌ Error approving buy:', data.error);
        return;
      }

      alert(data.message || '✅ Buy request approved!');
      fetchBuyRequests();
    } catch (error) {
      console.error('❌ Network or server error:', error);
      alert('❌ Failed to approve buy request.');
    }
  };

  // Helper to open Razorpay checkout for the admin
  const openRazorpay = ({ key, order_id, amount, prefill }) => {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        reject(new Error('Razorpay not loaded yet'));
        return;
      }
      const rzp = new window.Razorpay({
        key,
        order_id,
        amount, // in paise
        currency: 'INR',
        name: 'Gold Sell Settlement',
        description: 'Admin paying the user’s sell amount',
        prefill: prefill || {},
        theme: { color: '#F37254' },
        handler: function (response) {
          resolve(response); // { razorpay_payment_id, razorpay_order_id, razorpay_signature }
        },
        modal: {
          ondismiss: function () {
            reject(new Error('Payment cancelled'));
          }
        }
      });
      rzp.open();
    });
  };

  const approveSell = async (requestId) => {
    if (!rzpReady) {
      alert('Payment UI is still loading. Please try again in a moment.');
      return;
    }

    try {
      // 1) Approve the sell request first (locks state on server)
      const approveRes = await fetch(`http://localhost:8000/api/v1/approve-sell/${requestId}/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!approveRes.ok) {
        const errText = await approveRes.text();
        console.error('Approve-sell failed:', approveRes.status, errText);
        alert('❌ Failed to approve sell request.');
        return;
      }

      // 2) Create a Razorpay order for this sell request
      const orderRes = await fetch('http://localhost:8000/api/v1/create-razorpay-sell-order/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId }) // backend expects "request_id"
      });

      if (!orderRes.ok) {
        const errText = await orderRes.text();
        console.error('Create sell order failed:', orderRes.status, errText);
        alert('❌ Could not create Razorpay order.');
        return;
      }

      const orderData = await orderRes.json();
      const { order_id, amount, currency, key_id } = orderData;

      if (!order_id || !amount) {
        console.error('Order response missing fields:', orderData);
        alert('❌ Invalid order response.');
        return;
      }

      // 3) Open Razorpay popup for the admin to pay
      const paymentResp = await openRazorpay({
        key: key_id,
        order_id,
        amount,
        prefill: {
          name: 'Admin',
          email: 'admin@example.com',
          contact: '9999999999'
        }
      });

      // 4) Verify payment + finalize on the server
      const verifyRes = await fetch('http://localhost:8000/api/v1/verify-sell-payment/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: requestId,
          razorpay_payment_id: paymentResp.razorpay_payment_id,
          razorpay_order_id: paymentResp.razorpay_order_id,
          razorpay_signature: paymentResp.razorpay_signature
        })
      });

      if (!verifyRes.ok) {
        const errText = await verifyRes.text();
        console.error('Verify sell payment failed:', verifyRes.status, errText);
        alert('❌ Payment verification failed.');
        return;
      }

      const verifyData = await verifyRes.json();
      alert(verifyData.detail || '✅ Sell payment successful and wallet updated.');
      // Refresh list
      fetchSellRequests();
    } catch (error) {
      console.error('❌ Error approving sell:', error);
      alert(error.message || '❌ Failed to approve sell request.');
    }
  };

  return (
    <div className='request'>
      <h2>Pending Buy Requests</h2>
      <ul>
        {buyRequests.map((req) => (
          <li key={req.id} style={{ color: 'white', marginBottom: '10px' }}>
            {req.user}-{req.id} wants to buy {req.gold_in_grams}g for ₹{req.amount_in_rupees}
            <button onClick={() => approveBuy(req.id)} style={{ marginLeft: '10px', backgroundColor: 'orange' }}>
              Approve
            </button>
          </li>
        ))}
      </ul>

      <h2>Pending Sell Requests</h2>
      <ul>
        {sellRequests.map((req) => (
          <li key={req.id} style={{ color: 'white', marginBottom: '10px' }}>
            {req.user}-{req.id} wants to sell {req.gold_in_grams}g for ₹{req.amount_in_rupees}
            <button onClick={() => approveSell(req.id)} style={{ marginLeft: '10px', backgroundColor: 'orange' }}>
              Approve & Pay
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
