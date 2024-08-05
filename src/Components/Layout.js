import React from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const showHeaderFooter = location.pathname !== '/login';

  // Define default metadata
  const defaultTitle = 'Adeola Gadgets';
  const defaultDescription = 'The official dashboard for Gadgets built with React.';

  // Function to determine the page title based on the pathname
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/login':
        return 'Login';
      case '/cart':
        return 'Cart';
      case '/checkout':
        return 'Checkout';
      case '/favourite':
        return 'Favourite';
      case '/finalorder':
        return 'Final Order';
      default:
        return 'Page';
    }
  };

  return (
    <>
      {/* Helmet for metadata management */}
      <Helmet>
        <title>{`${getPageTitle()} | ${defaultTitle}`}</title>
        <meta name="description" content={defaultDescription} />
        <meta property="og:title" content={`${getPageTitle()} | ${defaultTitle}`} />
        <meta property="og:description" content={defaultDescription} />
        <meta property="og:url" content={`https://your-website.com${location.pathname}`} />
        <meta property="og:type" content="website" />
        {/* You can add more metadata here */}
      </Helmet>

      {showHeaderFooter && <Navbar />}
      <main>{children}</main>
      {showHeaderFooter && <Footer />}
    </>
  );
};

export default Layout;


// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import Navbar from './Navbar/Navbar';
// import Footer from './Footer/Footer';

// const Layout = ({ children }) => {
//   const location = useLocation();
//   const showHeaderFooter = location.pathname !== '/login';

//   return (
//     <>
//       {showHeaderFooter && <Navbar />}
//       <main>{children}</main>
//       {showHeaderFooter && <Footer />}
//     </>
//   );
// };

// export default Layout;
