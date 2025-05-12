import axios from 'axios';
import NProgress from "nprogress";
import "./nprogress-custom.css";

const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : process.env.REACT_APP_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Configure NProgress
NProgress.configure({ showSpinner: false });

axiosInstance.interceptors.request.use(
  (config) => {
    NProgress.start();
    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

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
