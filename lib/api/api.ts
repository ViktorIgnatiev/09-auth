// lib/api/api.ts
import axios from 'axios';

// ВАЖЛИВО: йдемо у ВЛАСНІ Next API-роути (app/api/*)
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Мінімальні й безпечні інтерцептори, без редиректів на 400
api.interceptors.request.use((config) => {
  // корисний лог під час дебагу
  console.log('Client API ->', config.method?.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('Client API Error:', err.response?.status, err.config?.url);
    return Promise.reject(err);
  }
);
