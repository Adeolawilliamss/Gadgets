/*eslint-disable*/
import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null)
  const location = useLocation();

  const checkAuthStatus = async () => {
    try {
      const res = await axiosInstance.get(
        `/users/isLoggedIn?timestamp=${Date.now()}`,
        {
          withCredentials: true,
          headers: { 'Cache-Control': 'no-cache' },
        },
      );
      console.log('Auth status response:', res.data); 
      if (res.data?.status === 'success') {
        setIsAuthenticated(true);
        setUser(res.data.data.user);
        setPhoto(res.data.data.user)
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setPhoto(null)
      }
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
      setPhoto(null);
    }
  };
  

  // Re-run checkAuthStatus whenever the route changes
  useEffect(() => {
    checkAuthStatus();
  }, [location]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, checkAuthStatus, user, setUser, photo, setPhoto}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
