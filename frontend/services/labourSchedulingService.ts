import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to ALL requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage - use the correct key 'agrisense_token'
    const token = localStorage.getItem('agrisense_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token attached to request:', token.substring(0, 20) + '...');
    } else {
      console.error('❌ No token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ Authentication error in labour scheduling service');
      // Token might be expired or invalid
      const token = localStorage.getItem('agrisense_token');
      if (!token) {
        console.error('❌ No token found in localStorage - redirecting to login');
        window.location.href = '/auth/login';
      } else {
        console.error('❌ Token exists but is invalid or expired');
      }
    }
    return Promise.reject(error);
  }
);

export const labourSchedulingService = {
  // Workers
  createWorker: async (data: any) => {
    const response = await api.post('/labour-scheduling/workers', data);
    return response.data;
  },

  getWorkers: async (filters?: any) => {
    const response = await api.get('/labour-scheduling/workers', { params: filters });
    return response.data;
  },

  // Tasks
  createTask: async (data: any) => {
    const response = await api.post('/labour-scheduling/tasks', data);
    return response.data;
  },

  getTasks: async (filters?: any) => {
    const response = await api.get('/labour-scheduling/tasks', { params: filters });
    return response.data;
  },

  // Shifts
  createShift: async (data: any) => {
    const response = await api.post('/labour-scheduling/shifts', data);
    return response.data;
  },

  updateShiftStatus: async (shiftId: string, status: string, actualTimes?: any) => {
    const response = await api.patch(`/labour-scheduling/shifts/${shiftId}/status`, {
      status,
      actualTimes,
    });
    return response.data;
  },

  // Alerts
  getAlerts: async (filters?: any) => {
    const response = await api.get('/labour-scheduling/alerts', { params: filters });
    return response.data;
  },

  markAlertRead: async (alertId: string) => {
    const response = await api.patch(`/labour-scheduling/alerts/${alertId}/read`);
    return response.data;
  },

  // Analytics
  getDashboardAnalytics: async (dateRange?: { start: string; end: string }) => {
    const response = await api.get('/labour-scheduling/analytics/dashboard', {
      params: dateRange,
    });
    return response.data;
  },

  getRecommendations: async () => {
    const response = await api.get('/labour-scheduling/analytics/recommendations');
    return response.data;
  },
};
