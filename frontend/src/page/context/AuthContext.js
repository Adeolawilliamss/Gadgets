/* eslint-disable */
import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const checkAuthStatus = async () => {
    try {
      const res = await axiosInstance.get('/users/me');
      if (res.data.status === 'success') {
        setIsAuthenticated(true);
        setUser(res.data.data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error('⚠️ Unexpected auth error:', err);
      }
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
