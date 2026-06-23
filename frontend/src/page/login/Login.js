/*eslint-disable*/
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import { useAlert } from './../context/AlertContext';
import Slider from 'react-slick';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Login() {
  const { showAlert } = useAlert();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const images = [
    {
      id: 1,
      img: './photos/login-img1.svg',
      text: 'Love Shopping?',
      sub: 'We have amazing products just for you 😉',
    },
    {
      id: 2,
      img: './photos/login-img4.svg',
      text: 'Easy Delivery',
      sub: 'Get your packages without any hassle 📦',
    },
    {
      id: 3,
      img: './photos/login-img3.svg',
      text: 'Love Shopping?',
      sub: 'Order your favourite items with just a click!',
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
    setShowPassword((prevState) => !prevState);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post('/users/login', {
        email,
        password,
      });

      if (res.data.status === 'success') {
        // Save access token to localStorage
        localStorage.setItem('accessToken', res.data.accessToken);
        showAlert('success', 'Login successful!');
        setTimeout(() => {
          navigate('/home');
        }, 500);
      }
    } catch (error) {
      showAlert('error', error.response?.data?.message || 'Login failed');
      console.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
  <div className="bg-gray-100 min-h-screen mx-auto px-4">
    <div className="flex flex-col md:flex-row items-center gap-10 md:gap-10 overflow-hidden pb-8">
      <div className="w-full md:w-1/2 h-full text-center">
        <Slider {...settings}>
          {images.map((item) => (
            <div key={item.id}>
              <figure>
                <img
                  src={item.img}
                  alt={item.text}
                  className="w-[90%] h-full mx-auto"
                />
              </figure>

              <h3 className="text-center font-extrabold mb-5 text-xl">
                {item.text}
              </h3>

              <p className="text-gray-600">{item.sub}</p>
            </div>
          ))}
        </Slider>
      </div>

      <div className="w-full md:w-1/2 mt-8 md:mt-10 md:mr-10">
        <h1 className="text-2xl md:text-4xl font-bold">
          Hi, Welcome Back
        </h1>

        <form
          className="flex flex-col"
          onSubmit={handleLogin}
        >
          <div>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className="
                block
                w-full
                h-12
                mt-8
                px-4
                bg-white
                rounded-md
                border
                border-gray-300
                outline-none
                focus:ring-2
                focus:ring-[#2B2D42]
                focus:border-transparent
              "
            />

            <p className="text-slate-900 text-sm mt-2">
              For Testing: Adeolaoladeinde6@gmail.com
            </p>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                minLength={8}
                className="
                  block
                  w-full
                  h-12
                  mt-8
                  px-4
                  pr-12
                  bg-white
                  rounded-md
                  border
                  border-gray-300
                  outline-none
                  focus:ring-2
                  focus:ring-[#2B2D42]
                  focus:border-transparent
                "
              />

              <button
                type="button"
                onClick={toggleShowPassword}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-gray-700
                "
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <p className="text-slate-900 text-sm mt-2">
              test1234
            </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <label
              htmlFor="checkbox"
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                id="checkbox"
              />
              Remember Me?
            </label>

            <span className="cursor-pointer text-blue-500 hover:underline">
              Forgot Password
            </span>
          </div>

          <button
            className="
              rounded-md
              mb-3
              w-full
              md:w-100
              h-12
              mt-4
              bg-[#2B2D42]
              text-white
              text-lg
              md:text-xl
              font-medium
              hover:opacity-90
              transition
            "
            type="submit"
          >
            Sign In
          </button>

          <button
            type="button"
            className="
              w-full
              h-12
              flex
              items-center
              justify-center
              gap-3
              rounded-md
              border
              border-gray-300
              bg-white
              text-[#2B2D42]
              font-semibold
              hover:bg-gray-50
              transition
            "
          >
            <span>Sign In with Google</span>
          </button>
        </form>

        <h5 className="mt-9 text-center text-lg md:text-xl">
          Don't have an account?{' '}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate('/signup')}
          >
            Sign up for free
          </span>
        </h5>
      </div>
    </div>
  </div>
);
}

export default Login;
