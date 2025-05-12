/*eslint-disable*/
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import { useAlert } from './../context/AlertContext';
import Slider from 'react-slick';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Login.css';

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
        showAlert('success', 'Login successful!');
        setTimeout(() => location.assign('/'), 1500);
      }
    } catch (error) {
      showAlert('error', error.response?.data?.message || 'Login failed');
      console.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col bg-gray-100 md:flex-row items-center gap-10 md:gap-20 overflow-hidden pb-8">
        <div className="slider__container w-full md:w-1/2 h-full text-center">
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

        <div className="w-full md:w-1/2 mt-8 md:mt-10">
          <h1 className="text-2xl md:text-4xl">Hi, Welcome Back</h1>
          <form className="login__form" onSubmit={handleLogin}>
            <div className="main__input">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                className="block w-full h-12 mt-8 p-2.5 pr-10"
              />
              <p className="text-slate-900 text-sm mt-2">
                For Testing: Adeolaoladeinde6@gmail.com
              </p>

              <div className="form__input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  minLength={8}
                  className="input__field"
                />
                <span
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <p className="text-slate-900 text-sm mt-2">test1234</p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <label htmlFor="checkbox">
                <input type="checkbox" id="checkbox" className="mr-2" />
                Remember Me?
              </label>
              <span className="cursor-pointer text-blue-500">
                Forgot Password
              </span>
            </div>
            <button
              className="rounded-md mb-8 w-full md:w-80 h-12 mt-4 bg-[#2B2D42] text-white text-lg md:text-xl"
              type="submit"
            >
              Sign In
            </button>
            <div className="relative w-full h-12 mt-4">
              <button
                className="rounded-md w-full h-full flex items-center justify-center"
                type="button"
              >
                <img
                  src="./photos/google.png"
                  alt="google logo"
                  className="google-logo"
                />
              </button>
              <span className="flex absolute top-0 left-20 md:left-20 items-center h-full w-full text-slate-100 text-xl text-bold">
                Sign In with Google
              </span>
            </div>
          </form>

          <h5 className="mt-9 text-center text-lg md:text-xl">
            Don't have an account?{' '}
            <span
              className="text-blue-500 cursor-pointer"
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
