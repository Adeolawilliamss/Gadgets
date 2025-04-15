/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import {
  FaHeart,
  FaShoppingCart,
  FaEquals,
  FaTimes,
  FaCaretDown,
  FaCaretUp,
} from 'react-icons/fa';
import axios from 'axios';
import { useAlert } from './../../page/context/AlertContext';
import { useAuth } from './../../page/context/AuthContext';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import pages from '../../utils/pages';
import './Navbar.css';

function Navbar() {
  const [toggleProfile, setToggleProfile] = useState(false);
  const [menu, setMenu] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [search, setSearch] = useState('');
  const { showAlert } = useAlert();
  const { isAuthenticated, setIsAuthenticated, user, photo } = useAuth();
  const navigate = useNavigate();
  const { totalQuantity, wishListQuantity } = useSelector(
    (state) => state.cart,
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search/${search}`);
    }
  };

  const handleProfileToggle = () => {
    setToggleProfile((prev) => !prev);
  };

  const handleMenuToggle = () => {
    setMenu((prev) => !prev);
  };

  // Variants for the red background drop-down animation
  const backgroundVariants = {
    hidden: { height: 0 },
    visible: {
      height: '100vh',
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
  };

  // Variants for the menu items to animate sequentially
  const listVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3, ease: 'easeOut' },
    }),
  };

  useEffect(() => {
    if (menu) {
      // Wait until the background animation is complete before showing items
      const timer = setTimeout(() => setShowItems(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowItems(false);
    }
  }, [menu]);

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        '/users/logout',
        {},
        { withCredentials: true },
      );

      if (res.data.status === 'success') {
        setIsAuthenticated(false);
        setTimeout(() => location.assign('/login'), 1500);
      }
    } catch (error) {
      showAlert('error', error.response?.data?.message || 'LogOut failed');
      console.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <nav id="nav" className="bg-black py-4 border-b-4 border-red-600">
      <div className="container mx-auto px-4">
        <div className="nav_container flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center justify-center relative w-full md:w-auto">
            <Link to={pages.get('home').path}>
              <h1 className="lg:text-4xl md:text-3xl flex items-center text-white gap-2">
                GADGETS
                <div className="circle mt-3 md:mt-5"></div>
              </h1>
            </Link>
            <button
              className={`menu-btn ${menu ? 'active' : ''} absolute md:static right-5 top-1/3 -translate-y-1/2 md:translate-y-0`}
              onClick={handleMenuToggle}
            >
              {menu ? (
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.5,
                    ease: 'easeInOut',
                  }}
                >
                  <FaTimes className="close" />
                </motion.div>
              ) : (
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.5,
                    ease: 'easeInOut',
                  }}
                >
                  <FaEquals />
                </motion.div>
              )}
            </button>
          </div>

          <div className="header-search mt-4 md:mt-0 md:ml-8 mb-3">
            <form
              className="flex items-center text-black"
              onSubmit={handleSearch}
            >
              <input
                className="input pl-4"
                type="search"
                placeholder="Search here..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="search-btn bg-red-600 rounded-r" type="submit">
                Search
              </button>
            </form>
          </div>

          <div className="header-icons flex items-center mr-52">
            <div className="flex position-relative">
              <Link to={pages.get('favourite').path}>
                <span className="iconss">
                  <FaHeart />
                </span>
              </Link>
              <p className="qty z-10">{wishListQuantity}</p>
            </div>
            <div className="flex position-relative">
              <Link to={pages.get('cart').path}>
                <span className="iconss">
                  <FaShoppingCart />
                </span>
              </Link>
              <p className="qty z-10">{totalQuantity}</p>
            </div>
            <div
              className="flex position-relative"
              onClick={handleProfileToggle}
            >
              {isAuthenticated && user?.photo ? (
                <img
                  src={`/img/users/${user.photo}`}
                  alt="avatar"
                  className="avatar mr-5 ml-5 rounded-full w-10 h-10 object-cover"
                />
              ) : (
                <img
                  src={'/default.jpg'}
                  alt="default avatar"
                  className="avatar mr-5 ml-5 rounded-full w-10 h-10 object-cover"
                />
              )}
              <span className="avatar-button text-white absolute ml-14">
                {toggleProfile ? <FaCaretUp /> : <FaCaretDown />}
              </span>
            </div>
            {toggleProfile && (
              <div className="profile-card">
                {isAuthenticated ? (
                  <button type="submit" onClick={() => navigate('/account')}>
                    {user.name.split(' ')[0]}
                  </button>
                ) : (
                  <button>User</button>
                )}
                <div className="divider" />
                {isAuthenticated ? (
                  <button type="submit" onClick={handleLogout}>
                    Log Out
                  </button>
                ) : (
                  <button type="button" onClick={() => navigate('/login')}>
                    Login
                  </button>
                )}
              </div>
            )}

            {/* The menu with animated background */}
            <motion.div
              initial="hidden"
              animate={menu ? 'visible' : 'hidden'}
              variants={backgroundVariants}
              className="menu-bg absolute top-0 left-0 w-full bg-red-600 z-50"
            >
              {showItems && (
                <motion.ul className="menu-list text-white text-center text-2xl space-y-6 mt-20">
                  {[
                    'Home',
                    'Collection',
                    'New Products',
                    'Trending',
                    'Top Products',
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      custom={index}
                      variants={listVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <a
                        href={`#${item.toLowerCase().replace(' ', '')}`}
                        onClick={handleMenuToggle}
                      >
                        {item}
                      </a>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
