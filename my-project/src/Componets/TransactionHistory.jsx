import React, { useEffect, useRef, useState } from 'react';
import axios from "../api/axios";
import {useAuth} from './Authcontext'
import { toast } from 'react-toastify'


const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const { isLoggedIn, loading } = useAuth();

  const prevTransactionIdsRef = useRef([]);

 useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("/transactions/", { withCredentials: true });
        const newTransactions = res.data;

        // Show toast for newly approved transactions
        const newOnes = newTransactions.filter(txn => 
          !prevTransactionIdsRef.current.includes(txn.id)
        );

        if (prevTransactionIdsRef.current.length > 0 && newOnes.length > 0) {
          newOnes.forEach(txn => {
            toast.success(`✅ ${txn.transaction_type} Approved: ₹${txn.rupee_amount} for ${txn.gold_amount}g`);
          });
        }

        setTransactions(newTransactions);
        prevTransactionIdsRef.current = newTransactions.map(txn => txn.id);
        setError('');
      } catch (err) {
        console.error(err);
        setError("❌ Failed to fetch transactions");
        toast.error("❌ Failed to fetch transactions");
      }
    };

    fetchTransactions();

    const interval = setInterval(fetchTransactions, 5000); // Poll every 5 sec
    return () => clearInterval(interval);
  }, []);

  
  const containerStyle = {
    padding: '20px',
    maxWidth: '1280px',
    margin: '50px auto 40px auto',
    fontFamily: 'Poppins, sans-serif',
    width: '90%',
  };

  const headingStyle = {
    color: 'white',
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '20px',
  };

  const tableWrapper = {
    overflowX: 'auto',
    marginBottom: '20px',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
    minWidth: '600px',
  };

  const thStyle = {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '12px 8px',
    border: '1px solid #ddd',
    textAlign: 'left',
  };

  const tdStyle = {
    padding: '10px 8px',
    border: '1px solid #ddd',
    textAlign: 'left',
    color: '#fff',
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
    <div style={containerStyle}>
      <h2 style={headingStyle}>Transaction History</h2>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div style={tableWrapper}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Gold (gm)</th>
              <th style={thStyle}>₹ Amount</th>
              <th style={thStyle}>Gold Price (₹/gm)</th>
              <th style={thStyle}>Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? transactions.map((txn, idx) => (
              <tr key={idx}>
                <td style={tdStyle}>{txn.transaction_type}</td>
                <td style={tdStyle}>{txn.gold_amount}</td>
                <td style={tdStyle}>{txn.rupee_amount}</td>
                <td style={tdStyle}>{txn.gold_price_per_gram}</td>
                <td style={tdStyle}>{new Date(txn.created_at).toLocaleString()}</td>
              </tr>
            )) : (
              <tr>
                <td style={tdStyle} colSpan="5">No transactions</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
    </div>
  );
};

export default TransactionHistory;