import React, { useEffect, useState } from 'react';
import axios from '../api/axios'; // Your configured Axios instance
import './Wallet.css';
import { useNavigate } from 'react-router-dom';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await axios.get('wallet/');
      setWallet(res.data);
    } catch (err) {
      setError('Could not fetch wallet info');
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('wallet/');
      setTransactions(res.data);
    } catch (err) {
      setError('Could not fetch transactions');
    }
  };

  return (
    <div>
      <h2>Wallet Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {wallet ? (
        <div>
          <p><strong>Name:</strong> {wallet.full_name}</p>
          <p><strong>Gold Balance:</strong> {wallet.gold_balance} gm</p>
          <p><strong>Rupee Balance:</strong> ₹{wallet.rupee_balance}</p>
        </div>
      ) : (
        <p>Loading wallet...</p>
      )}

      <h3>Transaction History</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Type</th>
            <th>Gold (gm)</th>
            <th>₹ Amount</th>
            <th>Gold Price (₹/gm)</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? transactions.map((txn, idx) => (
            <tr key={idx}>
              <td>{txn.transaction_type}</td>
              <td>{txn.gold_amount}</td>
              <td>{txn.rupee_amount}</td>
              <td>{txn.gold_price_per_gram}</td>
              <td>{new Date(txn.created_at).toLocaleString()}</td>
            </tr>
          )) : (
            <tr><td colSpan="5">No transactions</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Wallet;
