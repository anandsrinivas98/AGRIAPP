# AgriSense Backend API

A comprehensive agricultural technology platform backend built with Node.js, Express, TypeScript, and Prisma.

## 🏗️ Architecture Overview

```
backend/src/
├── api/v1/                 # API version 1
│   ├── auth/              # Authentication endpoints
│   ├── ai/                # AI services
│   ├── farm/              # Farm management
│   ├── community/         # Forum, chat, social
│   ├── market/            # Market data, prices, weather
│   └── planning/          # Calendar, scheduling, tasks
├── core/                  # Business logic layer
├── shared/                # Shared utilities and types
├── middleware/            # Express middleware
├── routes/                # Legacy routes
├── services/              # Infrastructure services
└── config/                # Configuration files
```

---

## 🤖 AI Chatbot — LLM Architecture

The chatbot uses a multi-provider fallback chain to ensure maximum uptime:

```
User Query
    ↓
Redis Cache (check first — instant response if hit)
    ↓ (cache miss)
1. Gemini 1.5 Flash (primary)
    ↓ (quota exceeded / fail)
2. OpenRouter → meta-llama/llama-3.3-70b-instruct:free
    ↓ (fail)
3. OpenRouter → mistralai/mistral-7b-instruct:free
    ↓ (fail)
4. OpenRouter → google/gemma-3-12b-it:free
    ↓ (all fail)
Fallback static response
```

### Why this setup
- Gemini free tier = 1,500 req/day — exhausts quickly
- OpenRouter free models have no daily cap (rate limited per minute only)
- Redis caches identical questions for 1 hour — repeated queries cost zero LLM calls
- Image analysis always uses Gemini Vision (others don't support it on free tier)

### Required environment variables
```env
GEMINI_API_KEY=your_gemini_key          # Google AI Studio
OPENROUTER_API_KEY=your_openrouter_key  # openrouter.ai/keys
REDIS_URL=rediss://default:xxx@xxx.upstash.io:6379  # Upstash TCP URL
DISABLE_REDIS=false
```

### Redis setup (Upstash — free)
1. Sign up at https://upstash.com
2. Create database → region US-East-1 → Free tier
3. Enable Eviction → policy: `allkeys-lru`
4. Copy TCP URL (rediss://) → paste into REDIS_URL on Render

---

## 🚀 API Endpoints

### API v1
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
- `POST /api/v1/ai/disease-detection` - Detect plant diseases
- `POST /api/v1/ai/crop-guide` - Generate crop guide
- `GET /api/v1/ai/stats/summary` - AI usage statistics

#### Chatbot
- `POST /api/chatbot` - Send message (rate limited: 20 req/10min per IP)
- `GET /api/chatbot/history/:sessionId` - Get session history
- `GET /api/chatbot/sessions` - Get all sessions for user
- `DELETE /api/chatbot/history/:sessionId` - Clear session

#### Farm Management
- `GET /api/v1/farm` - Get user's farms
- `POST /api/v1/farm` - Create new farm
- `PUT /api/v1/farm/:id` - Update farm
- `DELETE /api/v1/farm/:id` - Delete farm

#### Market Data
- `GET /api/v1/market/prices` - Get crop prices
- `GET /api/v1/market/weather` - Get weather data
- `GET /api/v1/market/labour-alerts` - Get labour alerts

#### Planning
- `GET /api/v1/planning/calendar/tasks` - Get calendar tasks
- `POST /api/v1/planning/calendar/tasks` - Create task
- `PUT /api/v1/planning/calendar/tasks/:id` - Update task
- `DELETE /api/v1/planning/calendar/tasks/:id` - Delete task

---

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL (Neon cloud recommended)
- Redis (Upstash cloud recommended)

### Installation

```bash
npm install
cp .env.example .env
# Fill in .env values

npx prisma migrate dev
npx prisma generate
npm run dev
```

---

## 🌐 Production Deployment (Render)

### Environment Variables (set in Render dashboard)
```env
DATABASE_URL=postgresql://...neon.tech/AGRIAPP?sslmode=require
JWT_SECRET=your-secret
NODE_ENV=production
PORT=5000

# AI
GEMINI_API_KEY=your_gemini_key
OPENROUTER_API_KEY=your_openrouter_key

# Redis (Upstash)
REDIS_URL=rediss://default:xxx@xxx.upstash.io:6379
DISABLE_REDIS=false

# ChromaDB
CHROMA_API_KEY=your_chroma_key
CHROMA_TENANT=your_tenant
CHROMA_DATABASE=AGRIAPP

# Email
BREVO_API_KEY=your_brevo_key
BREVO_FROM_EMAIL=your@email.com

# Frontend
FRONTEND_URL=https://your-app.vercel.app
```

### Deploy steps
```bash
npm run build
npx prisma migrate deploy
npm start
```

---

## 🔐 Authentication

JWT-based with access + refresh tokens:
- Access token: 15 minutes
- Refresh token: 7 days

```
Authorization: Bearer <access_token>
```

---

## 📝 API Response Format

```json
// Success
{ "success": true, "message": "...", "data": {}, "timestamp": "..." }

// Error
{ "success": false, "message": "...", "errors": {}, "timestamp": "..." }
```

---

## 🔍 Monitoring

- Health check: `GET /health`
- API status: `GET /api/v1`
- Swagger docs: `/api-docs`
