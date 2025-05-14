import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const checkAuthStatus = async () => {
    try {
      const res = await axiosInstance.get('/me');
      console.log(res);

      if (res.data.status === 'success') {
        const { id, name, email, photo } = res.data.data.user;
        setIsAuthenticated(true);
        setUser({ id, name, email, photo });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      if (!err.skipLog && err.response?.status !== 401) {
        console.error('⚠️ Unexpected auth error:', err);
      }
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // ✅ only run this on app mount (or refresh)
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
