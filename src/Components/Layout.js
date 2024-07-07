import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const showHeaderFooter = location.pathname !== '/login';

  return (
    <>
      {showHeaderFooter && <Navbar />}
      <main>{children}</main>
      {showHeaderFooter && <Footer />}
    </>
  );
};

export default Layout;
