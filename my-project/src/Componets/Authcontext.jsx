// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios'; // assuming your axios config uses { withCredentials: true }

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [loading, setLoading] = useState(true);

  // Check if user is already logged in using token in cookie
  useEffect(() => {
    axios.get('/check-auth/', { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setIsLoggedIn(true);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
      })
      .finally(() => {
        setLoading(false); // ✅ Auth check complete
      });
  }, []);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { AuthContext };
