import axios from 'axios';

export const api = axios.create({
  baseURL: `${process.env.BASE_URL}/api/deluge`,
  timeout: 10_000,
});

// Optional: request/response interceptors for error handling, login, logging, etc.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // normalize error
    return Promise.reject(error.response?.data?.error || error.message);
  },
);
