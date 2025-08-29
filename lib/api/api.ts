import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Додайте interceptor для логування запитів
api.interceptors.request.use((config) => {
  console.log('Making request to:', config.url, 'with credentials:', config.withCredentials);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401 || error.response?.status === 400) {
      // Автоматичний logout при помилках авторизації
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-storage');
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  }
);