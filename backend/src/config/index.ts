import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const jwtSecret = process.env.JWT_SECRET || (env === 'production' ? '' : 'dev-only-insecure-secret-key-change-me');

if (env === 'production' && (!jwtSecret || jwtSecret === 'your-super-secret-jwt-key' || jwtSecret === 'dev-only-insecure-secret-key-change-me')) {
  throw new Error('FATAL SECURITY ERROR: JWT_SECRET must be set to a strong secret in production environment.');
}

export const config = {
  env,
  port: parseInt(process.env.PORT || '5000', 10),
  
  database: {
    url: process.env.DATABASE_URL || 'postgresql://agrisense:password@localhost:5432/agrisense',
  },
  
  jwt: {
    secret: jwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
  },
  
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  
  ml: {
    serviceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  },
  
  external: {
    openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
    mapboxToken: process.env.MAPBOX_ACCESS_TOKEN,
    soilGridsApiKey: process.env.SOILGRIDS_API_KEY,
  },
  
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
    uploadDir: process.env.UPLOAD_DIR || './uploads',
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};