import axios from 'axios';
import NProgress from 'nprogress';
import './nprogress-custom.css';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

// Configure NProgress
NProgress.configure({ showSpinner: false });

// Request interceptor: attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    NProgress.start();

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

export default axiosInstance;
