import React from 'react';
import { FaEnvelope, FaMapMarker, FaPhone } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer id="footer" className="bg-black text-white py-8 border-t-2 border-red-600 min-h-full">
      <div className="container mx-auto px-4 ">
        <div className="footer_container grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 h-80">
          <div>
            <h1 className="footer-header">ABOUT US</h1>
            <p className="mb-4 hover:text-red-600">Lorem ipsum dolor sit<br /> amet, consectetur adipisicing<br />
              elit, sed do eiusmod tempor incididunt ut.</p>

            <ul className="flex flex-col">
              <li className="flex items-center mb-4 hover:text-red-600">
                <a href="#" className="flex items-center">
                  <FaMapMarker className="mr-2" />1734 Stonecoal Road
                </a>
              </li>
              <li className="flex items-center mb-4 hover:text-red-600">
                <a href="#" className="flex items-center">
                  <FaPhone className="mr-2" />+021-95-51-84
                </a>
              </li>
              <li className="flex items-center">
                <a href="#" className="flex items-center hover:text-red-600">
                  <FaEnvelope className="mr-2" />email@email.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h1 className="footer-header">CATEGORIES</h1>
            <ul className="footer-links">
              <li><a href="#">Hot deals</a></li>
              <li><a href="#">Laptops</a></li>
              <li><a href="#">Smartphones</a></li>
              <li><a href="#">Cameras</a></li>
              <li><a href="#">Accessories</a></li>
            </ul>
          </div>

          <div>
            <h1 className="footer-header">INFORMATION</h1>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Orders and Returns</a></li>
              <li><a href="#">Terms & Conditions</a></li>
            </ul>
          </div>

          <div>
            <h1 className="footer-header">SERVICE</h1>
            <ul className="footer-links">
              <li><a href="#">My Account</a></li>
              <li><a href="#">View Cart</a></li>
              <li><a href="#">Wishlist</a></li>
              <li><a href="#">Track My Order</a></li>
              <li><a href="#">Help</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
