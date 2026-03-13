import axios from 'axios';
import { showErrorToast } from '../utils/toastUtils'; // We'll create this

// const baseURL = import.meta.env.VITE_API_BASE_URL_DEV; // Change as needed for different environments
const baseURL = import.meta.env.VITE_API_BASE_URL_PROD; // Change as needed for different environments

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
  //  Post requests are disabled temporarily
    // if (config && config.method && config.method.toLowerCase() === 'post') {
    //   // Notify user in UI
    //   try {
    //     showErrorToast('Server error');
    //   } catch (e) {
    //     // swallow errors from toast so request handling is not impacted
    //   }

    //   const err = new Error('Server error.');
    //   err.code = 'POST_DISABLED';
    //   return Promise.reject(err);
    // }

    // How to enable uploads again:
    // 1. Remove the above block that rejects POST requests.
    // 2. Test thoroughly to confirm uploads work as expected.

    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    showErrorToast('Network error. Please check your connection.');
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;
    let errorMessage = 'An unexpected error occurred';

    if (response) {
      switch (response.status) {
        case 400:
          errorMessage = response.data.message || 'Invalid request';
          break;
        case 401:
          errorMessage = 'Session expired. Please login again.';
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
        case 403:
          errorMessage = 'You are not authorized to perform this action';
          break;
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = response.data.message || error.message;
      }
    } else if (error.message === 'Network Error') {
      errorMessage = 'Network error. Please check your internet connection.';
    }

    showErrorToast(errorMessage);
    return Promise.reject(errorMessage);
  }
);

export default apiClient;