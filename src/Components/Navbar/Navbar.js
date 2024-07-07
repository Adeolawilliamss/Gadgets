import React, { useState } from "react";
import { FaHeart, FaShoppingCart, FaEquals, FaTimes, FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import pages from '../../utils/pages';
import './Navbar.css';

function Navbar() {
    const [toggleProfile, setToggleProfile] = useState(false);
    const [menu, setMenu] = useState(false);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const current = null;
    const { totalQuantity, wishListQuantity } = useSelector((state) => state.cart);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/search/${search}`);
        }
    };

    const handleProfileToggle = () => {
        setToggleProfile(prev => !prev);
    };

    const handleMenuToggle = () => {
        setMenu(prev => !prev);
    };

    return (
        <nav id="nav" className="bg-black py-4 border-b-4 border-red-600">
            <div className="container mx-auto px-4">
                <div className="nav_container flex flex-col md:flex-row items-center justify-between">
                    <Link to={'/'}>
                        <div className="flex items-center">
                            <h1 className="lg:text-4xl md:text-3xl flex items-center text-white gap-2">GADGETS
                                <div className="circle mt-3 md:mt-5"></div>
                            </h1>
                        </div>
                    </Link>
                    <div className="header-search mt-4 md:mt-0 md:ml-8 mb-3">
                        <form className="flex items-center text-black" onSubmit={handleSearch}>
                            <input 
                                className="input pl-4" 
                                type="search" 
                                placeholder="Search here..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button className="search-btn bg-red-600 rounded-r" type="submit">Search</button>
                        </form>
                    </div>
                    <div className="header-icons flex items-center mr-52">
                        <div className='flex position-relative'>
                            <Link to={pages.get('favourite').path}><span className='iconss'><FaHeart /></span>
                            </Link>
                            <p className='qty z-10'>{wishListQuantity}</p>
                        </div>
                        <div className='flex position-relative'>
                            <Link to={pages.get('cart').path}><span className='iconss'><FaShoppingCart />
                            </span>
                            </Link>
                            <p className='qty z-10'>{totalQuantity}</p>
                        </div>
                        <div className='flex position-relative' onClick={handleProfileToggle}>
                            <img src={current ? current.photoURL : './avatar1.png'} alt='avatar' className="avatar mr-5 ml-5" />
                            <span className='avatar-button text-white absolute'>
                                {toggleProfile ? <FaCaretUp /> : <FaCaretDown />}
                            </span>
                        </div>
                        {toggleProfile && 
                            <div className='profile-card'>
                                <Link to={pages.get('login').path}>Sign Out</Link>
                            </div>
                        }
                        <div className={menu ? 'menu active' : 'menu'}>
                            <div className="flex position-relative">
                                <ul>
                                    <li><a href='/' onClick={handleMenuToggle}>Home</a></li>
                                    <li><a href='#collection' onClick={handleMenuToggle}>Collection</a></li>
                                    <li><a href='#newProduct' onClick={handleMenuToggle}>New Products</a></li>
                                    <li><a href='#topSelling' onClick={handleMenuToggle}>Trending</a></li>
                                    <li><a href='#newsletter' onClick={handleMenuToggle}>Top Products</a></li>
                                </ul>
                            </div>
                            <button className={menu ? 'menu-btn active' : 'menu-btn'} onClick={handleMenuToggle}>
                                {menu ? <FaTimes className='close' /> : <FaEquals />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;



