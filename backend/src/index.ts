import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { config } from './config';
import { errorHandler, notFound } from './middleware/errorHandler';
import { setupSocketIO } from './services/socketService';
import { cacheService } from './services/cacheService';
import routes from './routes';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.frontend.url,
    credentials: true,
  },
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AgriSense API',
      version: '1.0.0',
      description: 'AI Crop Recommendation System API',
    },
    servers: [
      {
        url: config.api.baseUrl,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.frontend.url,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
if (config.env !== 'test') {
  app.use(morgan('combined'));
}

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Health check
app.get('/health', async (req, res) => {
  const cacheHealthy = await cacheService.healthCheck();
  
  res.json({
    status: cacheHealthy ? 'OK' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
    services: {
      cache: cacheHealthy ? 'healthy' : 'unhealthy',
    },
  });
});

// Routes
app.use('/api', routes);

// Static files (uploads)
app.use('/uploads', express.static('uploads'));

// Socket.IO setup
setupSocketIO(io);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Initialize cache service
const initializeServices = async () => {
  try {
    await cacheService.connect();
    console.log('✅ Cache service initialized');
  } catch (error) {
    console.error('⚠️  Cache service initialization failed:', error);
    console.log('⚠️  Server will continue without caching');
  }
};

// Start server
const PORT = config.port;
server.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  
  // Initialize services after server starts
  await initializeServices();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  
  // Disconnect cache service
  await cacheService.disconnect();
  
  server.close(() => {
    console.log('Process terminated');
  });
});

export { app, io };