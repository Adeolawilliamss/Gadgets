import React from "react";
import { FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaPinterest, } from 'react-icons/fa';
import './Newsletter.css';

function Newsletter() {
    return (
        <div className="bg-slate-100 py-4 border-b-4 border-red-600">
            <div className="container mx-auto px-4">
                <div className="newsletter relative items-center justify-center pb-40 h-60">
                    <div className='envelope'><FaEnvelope/></div>
                    <p className="text-center">Sign Up for the <strong>NEWSLETTER</strong></p>
                    <div className="header-search mt-8 mb-3">
                        <form className="flex items-center justify-center text-black">
                            <input 
                                className="input z-10" 
                                type="search" 
                                placeholder="Search here..."
                            />
                            <button className="search-btn bg-red-600 rounded-r" type="submit">Search</button>
                        </form>
                        <div className="socials flex items-center justify-center mt-4 z-10">
                            <a href="#"><FaFacebook /></a>
                            <a href="#"><FaTwitter /></a>
                            <a href="#"><FaInstagram /></a>
                            <a href="#"><FaPinterest /></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Newsletter;





