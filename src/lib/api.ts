'use client';

import 'client-only';

import axios from 'axios';

import { useCountStore } from '@/lib/store';

const delugeNextBaseUrl = useCountStore.getState().delugeNextBaseUrl;

export const api = axios.create({
  baseURL: `${delugeNextBaseUrl}/api/deluge`,
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
