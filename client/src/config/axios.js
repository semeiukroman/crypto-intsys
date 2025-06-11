import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:4000';

// Add a request interceptor to handle errors
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default axios; 