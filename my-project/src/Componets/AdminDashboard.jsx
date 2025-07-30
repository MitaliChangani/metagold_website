// src/pages/AdminDashboard.jsx

import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [buyRequests, setBuyRequests] = useState([]);
  const [sellRequests, setSellRequests] = useState([]);

  useEffect(() => {
    fetchBuyRequests();
    fetchSellRequests();
  }, []);

  const fetchBuyRequests = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin-buy-requests/', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setBuyRequests(data.filter((req) => !req.is_approved));
      } else {
        console.error("Unexpected data format:", data);
        setBuyRequests([]);
      }
    } catch (err) {
      console.error("Error fetching buy requests:", err);
    }
  };

  const fetchSellRequests = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin-sell-requests/', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setSellRequests(data.filter((req) => !req.is_approved));
      } else {
        console.error("Unexpected data format:", data);
        setSellRequests([]);
      }
    } catch (err) {
      console.error("Error fetching sell requests:", err);
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
      alert(data.message || "✅ Buy request approved!");
      console.log("✅ Buy Approved:", data.message);
      fetchBuyRequests(); // Refresh list
    } catch (error) {
      console.error("❌ Error approving buy:", error);
      alert("❌ Failed to approve buy request.");
    }
  };

  const approveSell = async (requestId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/approve-sell/${requestId}/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-type':'application/json'
        }
      });
      const data = await res.json();
      alert(data.message || "✅ Sell request approved!");
      console.log("✅ Sell Approved:", data.message);
      fetchSellRequests(); // Refresh list
    } catch (error) {
      console.error("❌ Error approving sell:", error);
      alert("❌ Failed to approve sell request.");
    }
  };

  return (
    <div className='request'>
      <h2>Pending Buy Requests</h2>
      <ul>
        {buyRequests.map((req) => (
          <li key={req.id} style={{color: 'white', marginBottom: '10px'}}>
            {req.user}-{req.id} wants to buy {req.gold_in_grams}g for ₹{req.amount_in_rupees}
            <button onClick={() => approveBuy(req.id)} style={{marginLeft: '10px', backgroundColor: 'orange'}}>Approve</button>
          </li>
        ))}
      </ul>

      <h2>Pending Sell Requests</h2>
      <ul>
        {sellRequests.map((req) => (
          <li key={req.id} style={{color: 'white', marginBottom: '10px'}}>
            {req.user}-{req.id} wants to sell {req.gold_in_grams}g for ₹{req.amount_in_rupees}
            <button onClick={() => approveSell(req.id)}  style={{marginLeft: '10px', backgroundColor: 'orange'}}>Approve</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
