import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agrisense_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const forumService = {
  // Categories
  getCategories: async () => {
    const response = await api.get('/forum/categories');
    return response.data;
  },

  // Threads
  getThreads: async (filters?: any) => {
    const response = await api.get('/forum/threads', { params: filters });
    return response.data;
  },

  getThreadBySlug: async (slug: string) => {
    const response = await api.get(`/forum/threads/${slug}`);
    return response.data;
  },

  createThread: async (data: any) => {
    const response = await api.post('/forum/threads', data);
    return response.data;
  },

  updateThread: async (id: string, data: any) => {
    const response = await api.patch(`/forum/threads/${id}`, data);
    return response.data;
  },

  deleteThread: async (id: string) => {
    const response = await api.delete(`/forum/threads/${id}`);
    return response.data;
  },

  // Replies
  createReply: async (data: any) => {
    const response = await api.post('/forum/replies', data);
    return response.data;
  },

  markBestAnswer: async (replyId: string) => {
    const response = await api.patch(`/forum/replies/${replyId}/best-answer`);
    return response.data;
  },

  // Likes
  toggleLike: async (data: { threadId?: string; replyId?: string }) => {
    const response = await api.post('/forum/likes', data);
    return response.data;
  },

  // Marketplace
  getMarketplaceListings: async (filters?: any) => {
    const response = await api.get('/forum/marketplace', { params: filters });
    return response.data;
  },

  createMarketplaceListing: async (data: any) => {
    const response = await api.post('/forum/marketplace', data);
    return response.data;
  },

  updateMarketplaceListing: async (id: string, data: any) => {
    const response = await api.patch(`/forum/marketplace/${id}`, data);
    return response.data;
  },

  // Knowledge Articles
  getKnowledgeArticles: async (filters?: any) => {
    const response = await api.get('/forum/knowledge', { params: filters });
    return response.data;
  },

  getArticleBySlug: async (slug: string) => {
    const response = await api.get(`/forum/knowledge/${slug}`);
    return response.data;
  },

  // Expert Sessions
  getExpertSessions: async (filters?: any) => {
    const response = await api.get('/forum/expert-sessions', { params: filters });
    return response.data;
  },

  registerForSession: async (sessionId: string) => {
    const response = await api.post(`/forum/expert-sessions/${sessionId}/register`);
    return response.data;
  },

  // Reputation
  getUserReputation: async (userId: string) => {
    const response = await api.get(`/forum/reputation/${userId}`);
    return response.data;
  },

  // Stats
  getForumStats: async () => {
    const response = await api.get('/forum/stats');
    return response.data;
  },
};
