/**
 * API Service for Bridge Backend
 * Base URL configured for local development
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication API
export const authAPI = {
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  verify: async (email, code) => {
    const response = await api.post('/auth/verify', { email, code });
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  resendCode: async (email) => {
    const response = await api.post('/auth/resend-code', { email });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  getProfile: async () => {
    const response = await api.get('/api/user/profile');
    return response.data;
  },
};

// Matching API
export const matchingAPI = {
  getMatches: async () => {
    const response = await api.get('/api/matches');
    return response.data;
  },

  sendMatchRequest: async (toUserId) => {
    const response = await api.post('/api/matches/request', {
      to_user_id: toUserId,
    });
    return response.data;
  },

  getMatchRequests: async () => {
    const response = await api.get('/api/matches/requests');
    return response.data;
  },

  acceptMatchRequest: async (requestId) => {
    const response = await api.post(`/api/matches/${requestId}/accept`);
    return response.data;
  },

  rejectMatchRequest: async (requestId) => {
    const response = await api.post(`/api/matches/${requestId}/reject`);
    return response.data;
  },
};

// Groups API
export const groupsAPI = {
  getMyGroup: async () => {
    const response = await api.get('/api/user/group');
    return response.data;
  },

  getGroup: async (groupId) => {
    const response = await api.get(`/api/groups/${groupId}`);
    return response.data;
  },

  getGroupMembers: async (groupId) => {
    const response = await api.get(`/api/groups/${groupId}/members`);
    return response.data;
  },

  leaveGroup: async (groupId) => {
    const response = await api.post(`/api/groups/${groupId}/leave`);
    return response.data;
  },

  sendMessage: async (groupId, messageText) => {
    const response = await api.post(`/api/groups/${groupId}/messages`, {
      message_text: messageText,
    });
    return response.data;
  },

  getMessages: async (groupId, since = null) => {
    const params = since ? { since } : {};
    const response = await api.get(`/api/groups/${groupId}/messages`, { params });
    return response.data;
  },
};

export default api;
