import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import {useAuth} from './Authcontext'

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [ setLoading] = useState(false);
  const [action, setAction] = useState('');
  const [message, setMessage] = useState('');
    const { isLoggedIn, loading } = useAuth();

  const handleBuyRequest = async () => {
    setLoading(true);
    setAction('buy');
    try {
      const res = await axios.post('http://localhost:8000/api/v1/request-buy/', {
        gold_amount: 100,
        gold_in_grams: 0.01,
      }, { withCredentials: true });

      setMessage(res.data.message || "Buy request sent successfully.");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to send buy request.");
    } finally {
      setLoading(false);
      setAction('');
    }
  };

  const handleSellRequest = async () => {
    setLoading(true);
    setAction('sell');
    try {
      const res = await axios.post('http://localhost:8000/api/v1/sell-gold-request/', {
        gold_amount: 50,
        gold_in_grams: 0.005,
      }, { withCredentials: true });

      setMessage(res.data.message || "Sell request sent successfully.");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to send sell request.");
    } finally {
      setLoading(false);
      setAction('');
    }
  };

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/wallet/', { withCredentials: true })
      .then(response => {
        setWallet(response.data);
      })
      .catch(() => {
        setError("Failed to load wallet.");
      });

    axios.get('http://localhost:8000/api/v1/transactions/', { withCredentials: true })
      .then(response => {
        setTransactions(response.data);
        setError('');
      })
      .catch(() => {
        setError("❌ Failed to fetch transactions");
      });
  }, []);

  const containerStyle = {
    maxWidth: '1280px',
    margin: '120px auto 40px auto',
    padding: '0 20px',
    fontFamily: 'Poppins, sans-serif',
    width: '100%',
  };

  const headingStyle = {
    color: 'white',
    textAlign: 'center',
    fontSize: '26px',
    marginBottom: '20px',
  };

  const subheadingStyle = {
    color: 'white',
    textAlign: 'left',
    fontSize: '18px',
    marginTop: '40px',
    marginBottom: '10px',
  };

  const walletInfoStyle = {
    color: 'white',
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '16px',
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
    color: '#eee',
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '30px',
  };

  const buttonStyle = {
    backgroundColor: '#805ef9',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    color: 'white',
    textDecoration: 'none',
    cursor: 'pointer',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Wallet Dashboard</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {message && <p style={{ color: 'limegreen', textAlign: 'center' }}>{message}</p>}

      {wallet ? (
        <div style={walletInfoStyle}>
          <p><strong>Name:</strong> {wallet.username || 'N/A'}</p>
          <p><strong>Gold Balance:</strong> {wallet.gold_balance} gm</p>
          <p><strong>Rupee Balance:</strong> ₹{wallet.rupee_balance}</p>
        </div>
      ) : (
        !error && <p style={{ color: 'white', textAlign: 'center' }}>Loading wallet...</p>
      )}

      <h3 style={subheadingStyle}>Transaction History</h3>

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
              <tr><td colSpan="5" style={tdStyle}>No transactions found</td></tr>
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

export default Wallet;