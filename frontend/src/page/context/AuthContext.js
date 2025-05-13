/* eslint-disable */
import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null);
  const location = useLocation();

  const checkAuthStatus = async () => {
    // Skip call if no JWT cookie exists
    if (!document.cookie.includes('jwt')) {
      console.log('🔑 No JWT cookie found. Skipping auth check.');
      setIsAuthenticated(false);
      setUser(null);
      setPhoto(null);
      return;
    }

    try {
      const res = await axiosInstance.get('/users/isLoggedIn', {
        headers: { 'Cache-Control': 'no-cache' },
      });

      console.log('✅ Auth status response:', res.data);

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
      // Skip logging expected 401s
      if (err?.skipLog) return;

      if (err.response?.status !== 401) {
        console.error('⚠️ Unexpected auth error:', err);
      }

      setIsAuthenticated(false);
      setUser(null);
      setPhoto(null);
    }
  };

  // Only run on first mount (not on every route change anymore)
  useEffect(() => {
    checkAuthStatus();
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
