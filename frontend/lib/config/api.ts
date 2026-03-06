/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

// Base URLs
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_SERVICE_URL || 'http://localhost:8000';

// API Versions
export const API_V1_BASE = `${API_BASE_URL}/api/v1`;
export const API_LEGACY_BASE = `${API_BASE_URL}/api`;

/**
 * API Endpoints Configuration
 * Organized by feature modules
 */
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    REGISTER: `${API_V1_BASE}/auth/register`,
    VERIFY_EMAIL: `${API_V1_BASE}/auth/verify-email`,
    LOGIN: `${API_V1_BASE}/auth/login`,
    FORGOT_PASSWORD: `${API_V1_BASE}/auth/forgot-password`,
    RESET_PASSWORD: `${API_V1_BASE}/auth/reset-password`,
    REFRESH_TOKEN: `${API_V1_BASE}/auth/refresh`,
  },

  // AI Services endpoints
  AI: {
    CROP_RECOMMENDATIONS: `${API_V1_BASE}/ai/crop-recommendations`,
    YIELD_PREDICTIONS: `${API_V1_BASE}/ai/yield-predictions`,
    DISEASE_DETECTION: `${API_V1_BASE}/ai/disease-detection`,
    CROP_GUIDE: `${API_V1_BASE}/ai/crop-guide`,
    CROP_GUIDE_QUICK: (cropName: string) => `${API_V1_BASE}/ai/crop-guide/quick/${encodeURIComponent(cropName)}`,
    POPULAR_CROPS: `${API_V1_BASE}/ai/crop-guide/popular-crops`,
    STATS: `${API_V1_BASE}/ai/stats/summary`,
  },

  // Farm Management endpoints
  FARM: {
    BASE: `${API_V1_BASE}/farm`,
    BY_ID: (id: string) => `${API_V1_BASE}/farm/${id}`,
  },

  // Community endpoints
  COMMUNITY: {
    FORUM_POSTS: `${API_V1_BASE}/community/forum/posts`,
    POST_COMMENTS: (postId: string) => `${API_V1_BASE}/community/forum/posts/${postId}/comments`,
    CHAT: `${API_V1_BASE}/community/chat`,
  },

  // Market Data endpoints
  MARKET: {
    PRICES: `${API_V1_BASE}/market/prices`,
    WEATHER: `${API_V1_BASE}/market/weather`,
    LABOUR_ALERTS: `${API_V1_BASE}/market/labour-alerts`,
  },

  // Planning endpoints
  PLANNING: {
    CALENDAR_TASKS: `${API_V1_BASE}/planning/calendar/tasks`,
    CALENDAR_TASK_BY_ID: (id: string) => `${API_V1_BASE}/planning/calendar/tasks/${id}`,
    LABOUR_SCHEDULING: `${API_V1_BASE}/planning/labour-scheduling`,
  },

  // Legacy endpoints (for backward compatibility)
  LEGACY: {
    AUTH: `${API_LEGACY_BASE}/auth`,
    RECOMMEND: `${API_LEGACY_BASE}/recommend`,
    PREDICT: `${API_LEGACY_BASE}/predict`,
    YIELD_PREDICTIONS: `${API_LEGACY_BASE}/yield-predictions`,
    DETECT: `${API_LEGACY_BASE}/detect`,
    PRICES: `${API_LEGACY_BASE}/prices`,
    WEATHER: `${API_LEGACY_BASE}/weather`,
    CALENDAR: `${API_LEGACY_BASE}/calendar`,
    FORUM: `${API_LEGACY_BASE}/forum`,
    LABOUR: `${API_LEGACY_BASE}/labour`,
    LABOUR_SCHEDULING: `${API_LEGACY_BASE}/labour-scheduling`,
    CHAT: `${API_LEGACY_BASE}/chat`,
    MARKETPLACE: `${API_LEGACY_BASE}/marketplace`,
    CHATBOT: `${API_LEGACY_BASE}/chatbot`,
    CROP_GUIDE: `${API_LEGACY_BASE}/crop-guide`,
  },

  // ML Service endpoints
  ML_SERVICE: {
    PREDICT_YIELD: `${ML_SERVICE_URL}/predict/yield`,
    PREDICT_CROP: `${ML_SERVICE_URL}/predict/crop`,
    DETECT_DISEASE: `${ML_SERVICE_URL}/detect/disease`,
  },
};

/**
 * HTTP Methods
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

/**
 * Request Headers
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getDefaultHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  ...getAuthHeaders(),
});

/**
 * API Response Types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
  timestamp?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Error Handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public errors?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Utility function to handle API responses
 */
export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  const data: ApiResponse<T> = await response.json();
  
  if (!response.ok || !data.success) {
    throw new ApiError(
      data.message || 'API request failed',
      response.status,
      data.errors
    );
  }
  
  return data.data as T;
};

/**
 * Migration helper - determines which API version to use
 */
export const shouldUseLegacyAPI = (endpoint: string): boolean => {
  // For now, use legacy API for existing functionality
  // Gradually migrate to v1 API
  const legacyEndpoints = [
    'recommend',
    'predict',
    'detect',
    'prices',
    'weather',
    'calendar',
    'forum',
    'labour',
    'chat',
    'marketplace',
    'chatbot',
    'crop-guide'
  ];
  
  return legacyEndpoints.some(legacy => endpoint.includes(legacy));
};

export default API_ENDPOINTS;