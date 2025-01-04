import axios from 'axios';
// import { getAuth } from 'firebase/auth';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const api = axios.create({
  baseURL: SERVER_URL
});

let getIdToken = async ()=> null
let getRefreshToken = async ()=> null;

export const setAuthGetters = (tokenGetter, refreshTokenGetter) => {
    getIdToken = tokenGetter;
    getRefreshToken = refreshTokenGetter;
  };

  
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getIdToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Token fetch error:', error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,  // Success handler
  async (error) => {       // Error handler
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;  
      try {
        const newToken = await getRefreshToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh error:', refreshError);
        // Optional: Add additional logic like redirecting to login
      }
    }
    return Promise.reject(error);
  }
);