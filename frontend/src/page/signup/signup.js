/* eslint-disable */
import React, { useState } from 'react';
import axios from 'axios';
import { useAlert } from './../context/AlertContext';
import Slider from 'react-slick';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './signup.css';

function Signup() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const images = [
    {
      id: 1,
      img: './photos/login-img1.svg',
      text: 'Join the Family',
      sub: 'Sign up and enjoy exclusive deals 🎁',
    },
    {
      id: 2,
      img: './photos/login-img3.svg',
      text: 'Get Your Goodies',
      sub: 'Hassle-free delivery right to your doorstep 🚚',
    },
    {
      id: 3,
      img: './photos/login-img4.svg',
      text: 'Why Wait?',
      sub: 'Create your account and start shopping! 🛍️',
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(value) ? '' : 'Please enter a valid email.');
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return showAlert('error', "Passwords don't match");
    }
    try {
      const res = await axios.post(
        '/users/signup',
        {
          name,
          email,
          password,
          passwordConfirm: confirmPassword,
        },
        { withCredentials: true },
      );

      if (res.data.status === 'success') {
        showAlert('success', 'Signup successful!');
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (error) {
      showAlert('error', error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col bg-gray-100 md:flex-row items-center gap-10 md:gap-20 overflow-hidden pb-8">
        <div className="slider__container w-full md:w-1/2 text-center">
          <Slider {...settings}>
            {images.map((item) => (
              <div key={item.id}>
                <figure className="animated">
                  <img
                    src={item.img}
                    alt={item.text}
                    className="w-9/10 h-full"
                  />
                </figure>
                <h3 className="text-center font-extrabold mb-5">{item.text}</h3>
                <p>{item.sub}</p>
              </div>
            ))}
          </Slider>
        </div>

        <div className="w-full md:w-1/2 mt-12 mb-8 md:mt-8">
          <h1 className="text-2xl md:text-4xl">Create Your Account</h1>
          <form className="login__form" onSubmit={handleSignup}>
            <div className="main__input flex flex-col gap-2 mt-4">
              <span>Full Name:</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="block w-full h-12 p-2.5"
                required
              />

              <span className="mt-4">Your Email:</span>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                className="block w-full h-12 p-2.5"
                required
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-2">{emailError}</p>
              )}

              <span className="mt-4">Create a Password</span>
              <div className="form__input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  minLength={8}
                  className="block w-full h-12 p-2.5"
                  required
                />
                <span className="eye-icon" onClick={toggleShowPassword}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <span className="mt-4">Confirm Password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                minLength={8}
                className="block w-full h-12 p-2.5"
                required
              />
            </div>

            <button
              className="rounded-md mb-8 w-full md:w-80 h-12 mt-4 bg-[#2B2D42] text-white text-lg md:text-xl
                            transform transition-all duration-300 ease-in-out
                            hover:scale-105 hover:bg-[#1d1e2e]
                            active:scale-95"
              type="submit"
            >
              Create Your Account
            </button>
          </form>

          <h5 className="mt-9 text-center text-lg md:text-xl">
            Already have an account?{' '}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate('/login')}
            >
              Log In
            </span>
          </h5>
        </div>
      </div>
    </div>
  );
}

export default Signup;
