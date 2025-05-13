/* eslint-disable */
import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser]               = useState(null);
  const [photo, setPhoto]             = useState(null);

  const checkAuthStatus = async () => {
    try {
      const res = await axiosInstance.get('/users/isLoggedIn', {
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (res.data.status === 'success') {
        const { id, name, email, photo } = res.data.data.user;
        setIsAuthenticated(true);
        setUser({ id, name, email });
        setPhoto(photo);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setPhoto(null);
      }
    } catch (err) {
      // silence expected 401
      if (!err.skipLog && err.response?.status !== 401) {
        console.error('⚠️ Unexpected auth error:', err);
      }
      setIsAuthenticated(false);
      setUser(null);
      setPhoto(null);
    }
  };

  useEffect(() => {
    // Delay the single check by 100ms to let the cookie kick in
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        checkAuthStatus,
        user,
        setUser,
        photo,
        setPhoto,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
