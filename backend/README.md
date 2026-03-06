# AgriSense Backend API

A comprehensive agricultural technology platform backend built with Node.js, Express, TypeScript, and Prisma.

## 🏗️ Architecture Overview

The backend follows a clean, modular architecture with clear separation of concerns:

```
backend/src/
├── api/v1/                 # API version 1 (new organized structure)
│   ├── auth/              # Authentication endpoints
│   ├── ai/                # AI services (predictions, recommendations)
│   ├── farm/              # Farm management
│   ├── community/         # Forum, chat, social features
│   ├── market/            # Market data, prices, weather
│   └── planning/          # Calendar, scheduling, tasks
├── core/                  # Business logic layer
│   ├── services/          # Core business services
│   ├── repositories/      # Data access layer
│   └── models/            # Domain models
├── shared/                # Shared utilities and types
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── constants/         # Application constants
├── middleware/            # Express middleware
├── routes/                # Legacy routes (backward compatibility)
├── services/              # Infrastructure services
├── utils/                 # Helper utilities
└── config/                # Configuration files
```

## 🚀 API Endpoints

### API v1 (Recommended)
Base URL: `/api/v1`

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/verify-email` - Verify email with OTP
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/refresh` - Refresh access token

#### AI Services
- `POST /api/v1/ai/crop-recommendations` - Get crop recommendations
- `POST /api/v1/ai/yield-predictions` - Predict crop yield
- `GET /api/v1/ai/yield-predictions` - Get prediction history
- `GET /api/v1/ai/yield-predictions/:id` - Get specific prediction
- `DELETE /api/v1/ai/yield-predictions/:id` - Delete prediction
- `POST /api/v1/ai/disease-detection` - Detect plant diseases
- `POST /api/v1/ai/crop-guide` - Generate crop guide
- `GET /api/v1/ai/crop-guide/quick/:cropName` - Quick crop guide
- `GET /api/v1/ai/crop-guide/popular-crops` - Get popular crops
- `GET /api/v1/ai/stats/summary` - AI usage statistics

#### Farm Management
- `GET /api/v1/farm` - Get user's farms
- `POST /api/v1/farm` - Create new farm
- `GET /api/v1/farm/:id` - Get specific farm
- `PUT /api/v1/farm/:id` - Update farm
- `DELETE /api/v1/farm/:id` - Delete farm

#### Community
- `GET /api/v1/community/forum/posts` - Get forum posts
- `POST /api/v1/community/forum/posts` - Create forum post
- `GET /api/v1/community/forum/posts/:id/comments` - Get post comments
- `POST /api/v1/community/forum/posts/:id/comments` - Add comment
- `POST /api/v1/community/chat` - Send chat message

#### Market Data
- `GET /api/v1/market/prices` - Get crop prices
- `GET /api/v1/market/weather` - Get weather data
- `GET /api/v1/market/labour-alerts` - Get labour alerts
- `POST /api/v1/market/labour-alerts` - Create labour alert

#### Planning
- `GET /api/v1/planning/calendar/tasks` - Get calendar tasks
- `POST /api/v1/planning/calendar/tasks` - Create calendar task
- `PUT /api/v1/planning/calendar/tasks/:id` - Update task
- `DELETE /api/v1/planning/calendar/tasks/:id` - Delete task
- `GET /api/v1/planning/labour-scheduling` - Get labour scheduling

### Legacy API (Backward Compatibility)
Base URL: `/api`

All existing endpoints remain available for backward compatibility.

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis (optional, for caching)

### Installation

1. **Clone and install dependencies:**
```bash
cd backend
npm install
```

2. **Environment setup:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database setup:**
```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed database (optional)
npm run seed
```

4. **Start development server:**
```bash
npm run dev
```

## 🏃‍♂️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## 🔐 Authentication

The API uses JWT-based authentication with access and refresh tokens:

- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

### Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

## 📊 Database Schema

The application uses PostgreSQL with Prisma ORM. Key entities:

- **Users**: User accounts with role-based access
- **Farms**: User-owned farm properties
- **YieldPredictions**: ML-generated yield forecasts
- **CropRecommendations**: AI crop suggestions
- **DiseaseDetections**: Plant disease analysis
- **ForumPosts/Comments**: Community features
- **CalendarTasks**: Agricultural planning
- **LabourAlerts**: Worker management

## 🤖 AI/ML Integration

The backend integrates with external ML services:

- **Yield Prediction**: Crop yield forecasting
- **Crop Recommendations**: Soil-based crop suggestions
- **Disease Detection**: Image-based plant disease identification
- **Crop Guides**: AI-generated cultivation guides

## 📝 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔍 API Documentation

- **Swagger UI**: Available at `/api-docs` when server is running
- **Health Check**: Available at `/health`
- **API Status**: Available at `/api/v1` and `/api`

## 🚀 Deployment

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/agrisense"

# JWT Secrets
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

# External Services
ML_SERVICE_URL="http://localhost:8000"
FRONTEND_URL="http://localhost:3000"

# Email Service
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Optional: Redis for caching
REDIS_URL="redis://localhost:6379"
```

### Production Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Run database migrations: `npx prisma migrate deploy`
4. Start the server: `npm start`

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.ts
```

## 📈 Monitoring & Logging

- **Health Checks**: `/health` endpoint provides system status
- **Logging**: Structured logging with different levels
- **Error Tracking**: Comprehensive error handling and reporting
- **Performance**: Request timing and performance metrics

## 🔄 Migration Guide

### From Legacy API to v1

1. **Update base URLs**: Change from `/api/endpoint` to `/api/v1/module/endpoint`
2. **Update response handling**: New consistent response format
3. **Update authentication**: Same JWT tokens, improved refresh flow
4. **Update error handling**: Enhanced error responses with structured data

### Backward Compatibility

Legacy endpoints remain available during the transition period. Plan to migrate to v1 API for:
- Better organization and maintainability
- Enhanced error handling
- Improved documentation
- Future feature support

## 🤝 Contributing

1. Follow the established architecture patterns
2. Add tests for new features
3. Update documentation
4. Follow TypeScript and ESLint guidelines
5. Use conventional commit messages

## 📞 Support

For issues and questions:
- Check the API documentation at `/api-docs`
- Review the health check at `/health`
- Check logs for detailed error information
- Refer to the database schema in Prisma Studio