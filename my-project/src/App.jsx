import { useState, useEffect, useContext } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';
import './Componets/About2.css'
import About1 from './Componets/About1'
import {AuthContext} from './Componets/Authcontext'
import Contact from './Componets/Contact';
import Downloadable from './Componets/Downloadable';
import Header from './Componets/Header';
import Footer from './Componets/Footer'
import './Componets/Footer.css'
import Buygold from './Componets/Buygold'
import './Componets/Buygold.css'

import About2 from './Componets/About2'
import ImageSlider from './Componets/ImageSlidebar';
import SellGold from './Componets/SellGold'

import Blog from './Componets/Blog';
import Help from './Componets/Help';

import Login from './Componets/Login';
import AdminDashboard from './Componets/AdminDashboard';
// import './Componets/AdminDashboard.css';

import Wallet from './Componets/Wallet';
import TransactionHistory from './Componets/TransactionHistory';

import {ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [amount, setAmount] = useState(100);
  const goldPrice = 10117.77;
  const [timer, setTimer] = useState(62);
  

  const {isLogIn, isAdmin, logout} = useContext(AuthContext)

  const handleLogout = () =>{
    logout();
    const navigate = useNavigate();
    navigate('/login') 
  }

  useEffect(() => {
    // Clear tokens on app reload
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const goldInGrams = (amount && goldPrice) ? (amount / goldPrice).toFixed(4) : '0.0000';
  const formattedTime = `01:${timer.toString().padStart(2, '0')}`;
  useEffect(() => {
    setShowLogin(true);
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(null); // 🔒 Login state

  // 🔐 Protected Route logic
  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/Login" />;
  };

  return (
    <>
      <Header />
     
      <Routes>
        <Route
          path="/"
          element={
            <About1
              amount={amount}
              goldInGrams={goldInGrams}
              goldPrice={goldPrice}
              formattedTime={formattedTime}
            />
          }
        />
        <Route path="/about2" element={
          <>
            <About2 />
            <ImageSlider />
          </>
        } />
        <Route
          path="/sellgold"
          element={<SellGold show={true} onClose={() => { }} />}
        />
        <Route
          path="/buygold"
          element={<Buygold />}
        />
        <Route
          path="/help"
          element={<Help />}
        />

        <Route
          path="/blog"
          element={<Blog />}
        />


        <Route
          path="/downloadable"
          element={<Downloadable />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/wallet"
          element={<Wallet />}
        />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/login" element={<Login />} />
        <Route path="/About1" element={<About1 />} />
        <Route path="/transactions" element={<TransactionHistory />} />
        <Route path="/ImageSlider" element={<ImageSlider />} />
        
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />

      <Footer />
    </>
  );
}
export default App;