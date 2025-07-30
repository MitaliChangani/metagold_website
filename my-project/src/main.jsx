import './index.css'
import App from './App.jsx'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { AuthProvider } from './Componets/Authcontext.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
 
  <React.StrictMode>
   <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>

);