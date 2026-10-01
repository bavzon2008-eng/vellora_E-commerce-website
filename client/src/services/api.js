import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // An invalid/expired token on a request that carried one: tell AuthContext to log out
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(error);
  }
);

export const errorMessage = (err) => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
    return 'Cannot reach the server. Check that the backend is running on port 5000.';
  }
  return 'Something went wrong. Please try again.';
};

export default api;
