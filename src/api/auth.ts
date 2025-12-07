import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://v2991160.hosted-by-vdsina.ru/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  return config;
}, (error) => {
  return Promise.reject(error);
});

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  username: string;
  role: string;
  token: string;
}

export interface User {
  username: string;
  role: string;
}

export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  getCurrentUser: async (token: string): Promise<User> => {
    const response = await api.get<User>('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  logout: async (token: string): Promise<void> => {
    await api.post('/auth/logout', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};