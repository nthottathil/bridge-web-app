/**
 * API Service for Bridge Backend
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
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
  isAuthenticated: () => !!localStorage.getItem('auth_token'),
  getProfile: async () => {
    const response = await api.get('/api/user/profile');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/api/user/profile', profileData);
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
    const response = await api.post('/api/matches/request', { to_user_id: toUserId });
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
    const response = await api.post(`/api/groups/${groupId}/messages`, { message_text: messageText });
    return response.data;
  },
  getMessages: async (groupId, since = null) => {
    const params = since ? { since } : {};
    const response = await api.get(`/api/groups/${groupId}/messages`, { params });
    return response.data;
  },
};

// Events API
export const eventsAPI = {
  getEvents: async (groupId) => {
    const response = await api.get(`/api/events/${groupId}`);
    return response.data;
  },
  createEvent: async (eventData) => {
    const response = await api.post('/api/events/', eventData);
    return response.data;
  },
  deleteEvent: async (eventId) => {
    const response = await api.delete(`/api/events/${eventId}`);
    return response.data;
  },
};

// Tasks API
export const tasksAPI = {
  getTasks: async (groupId) => {
    const response = await api.get(`/api/tasks/${groupId}`);
    return response.data;
  },
  completeTask: async (taskId) => {
    const response = await api.post(`/api/tasks/${taskId}/complete`);
    return response.data;
  },
};

// Collections API (Goals, Polls, Notes, Ask the Group)
export const collectionsAPI = {
  createGoal: async (groupId, title) => {
    const response = await api.post('/api/collections/goals', { group_id: groupId, title });
    return response.data;
  },
  getGoals: async (groupId) => {
    const response = await api.get(`/api/collections/goals/${groupId}`);
    return response.data;
  },
  addPersonalGoal: async (goalId, title) => {
    const response = await api.post(`/api/collections/goals/${goalId}/personal`, { title });
    return response.data;
  },
  reviewGoal: async (goalId, reviewData) => {
    const response = await api.post(`/api/collections/goals/${goalId}/review`, reviewData);
    return response.data;
  },
  createPoll: async (groupId, question, options) => {
    const response = await api.post('/api/collections/polls', { group_id: groupId, question, options });
    return response.data;
  },
  getPolls: async (groupId) => {
    const response = await api.get(`/api/collections/polls/${groupId}`);
    return response.data;
  },
  votePoll: async (pollId, optionId) => {
    const response = await api.post(`/api/collections/polls/${pollId}/vote`, { poll_option_id: optionId });
    return response.data;
  },
  endPoll: async (pollId) => {
    const response = await api.post(`/api/collections/polls/${pollId}/end`);
    return response.data;
  },
  createNote: async (noteData) => {
    const response = await api.post('/api/collections/notes', noteData);
    return response.data;
  },
  getNotes: async (groupId) => {
    const response = await api.get(`/api/collections/notes/${groupId}`);
    return response.data;
  },
  createAsk: async (groupId, question) => {
    const response = await api.post('/api/collections/asks', { group_id: groupId, question });
    return response.data;
  },
  getAsks: async (groupId) => {
    const response = await api.get(`/api/collections/asks/${groupId}`);
    return response.data;
  },
  replyToAsk: async (askId, replyText) => {
    const response = await api.post(`/api/collections/asks/${askId}/reply`, { reply_text: replyText });
    return response.data;
  },
};

// Meetups API
export const meetupsAPI = {
  createMeetup: async (meetupData) => {
    const response = await api.post('/api/meetups', meetupData);
    return response.data;
  },
  getMeetups: async (groupId) => {
    const response = await api.get(`/api/meetups/${groupId}`);
    return response.data;
  },
  attend: async (meetupId) => {
    const response = await api.post(`/api/meetups/${meetupId}/attend`);
    return response.data;
  },
  unattend: async (meetupId) => {
    const response = await api.post(`/api/meetups/${meetupId}/unattend`);
    return response.data;
  },
};

// Friends API
export const friendsAPI = {
  addFriend: async (friendUserId) => {
    const response = await api.post('/api/friends', { friend_user_id: friendUserId });
    return response.data;
  },
  getFriends: async () => {
    const response = await api.get('/api/friends');
    return response.data;
  },
  removeFriend: async (friendId) => {
    const response = await api.delete(`/api/friends/${friendId}`);
    return response.data;
  },
};

// Group Settings API
export const groupSettingsAPI = {
  getSettings: async (groupId) => {
    const response = await api.get(`/api/group-settings/${groupId}`);
    return response.data;
  },
  updateSettings: async (groupId, settingsData) => {
    const response = await api.put(`/api/group-settings/${groupId}`, settingsData);
    return response.data;
  },
  updateGroupName: async (groupId, name) => {
    const response = await api.put(`/api/group-settings/${groupId}/name`, { name });
    return response.data;
  },
  getTimeline: async (groupId) => {
    const response = await api.get(`/api/group-settings/${groupId}/timeline`);
    return response.data;
  },
  addTimelineFocus: async (groupId, focusData) => {
    const response = await api.post(`/api/group-settings/${groupId}/timeline`, focusData);
    return response.data;
  },
};

export default api;
