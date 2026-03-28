# 🌾 AgriSense - AI-Powered Smart Farming Platform

AgriSense is a full-stack agricultural technology platform that helps farmers make data-driven decisions using AI/ML. It provides crop recommendations, yield predictions, disease detection, market prices, labour scheduling, and a farmer community forum.

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://agriapp-one.vercel.app |
| Backend API | https://agriapp-k3jd.onrender.com |
| ML Service | https://anandsrinivas-agrisense-ml.hf.space |
| API Docs | https://agriapp-k3jd.onrender.com/api-docs |

---

## 🏗️ Project Structure

```
AgriSense/
├── frontend/          # Next.js 14 frontend (Vercel)
├── backend/           # Node.js + Express + TypeScript API (Render)
├── ml-service/        # Python FastAPI ML service (Hugging Face Spaces)
└── DEPLOYMENT.md      # Deployment guide
```

---

## ✨ Features

- 🌱 **Crop Recommendation** — AI-powered suggestions based on soil & weather
- 📈 **Yield Prediction** — ML-based crop yield forecasting
- 🔬 **Disease Detection** — Image-based plant disease identification
- 📚 **Crop Guide** — AI-generated cultivation guides via Gemini
- 🌤️ **Weather Integration** — Real-time weather data
- 💰 **Market Prices** — Live crop price tracking (AgMarkNet API)
- 👷 **Labour Scheduling** — Worker management and shift planning
- 🏘️ **Farmer Forum** — Community threads, marketplace, knowledge base
- 💬 **AI Chatbot** — Farming assistant powered by Gemini
- 🌍 **Multi-language** — English and Hindi support (i18n)
- 📱 **PWA** — Installable progressive web app

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| Next.js 14 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Recharts | Data visualization |
| Socket.io Client | Real-time features |
| i18next | Internationalization |
| next-pwa | Progressive Web App |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express | API server |
| TypeScript | Type safety |
| Prisma ORM | Database access |
| PostgreSQL (Neon) | Cloud database |
| JWT | Authentication |
| Socket.io | Real-time communication |
| Brevo API | Email delivery |
| Gemini AI | AI crop guides & chatbot |
| ChromaDB | Vector database for AI |
| Redis (optional) | Caching |

### ML Service
| Tech | Purpose |
|------|---------|
| Python + FastAPI | ML API server |
| scikit-learn | ML models |
| NumPy + Pandas | Data processing |
| Uvicorn | ASGI server |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL (or use Neon cloud)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/anandsrinivas98/AGRIAPP.git
cd AGRIAPP
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy env file
cp .env.example .env
# Edit .env with your values (see Environment Variables section)

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
# Runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps

# Copy env file
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
npm run dev
# Runs on http://localhost:3000
```

### 4. ML Service Setup
```bash
cd ml-service
pip install -r requirements.txt

# Start ML service
uvicorn main:app --reload --port 8000
# Runs on http://localhost:8000
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# JWT
JWT_SECRET=your-strong-secret-key

# Server
NODE_ENV=development
PORT=5000

# ML Service
ML_SERVICE_URL=http://localhost:8000

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# ChromaDB (Vector DB)
CHROMA_API_KEY=your_chroma_api_key
CHROMA_TENANT=your_tenant_id
CHROMA_DATABASE=AGRIAPP

# Email (Brevo HTTP API)
BREVO_API_KEY=your_brevo_api_key
BREVO_FROM_EMAIL=your_sender_email

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:3000

# Redis (optional)
REDIS_URL=redis://localhost:6379
DISABLE_REDIS=true
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# Market Data APIs
NEXT_PUBLIC_AGMARKNET_ENABLED=true
NEXT_PUBLIC_AGMARKNET_API_URL=https://api.data.gov.in/resource
NEXT_PUBLIC_AGMARKNET_API_KEY=your_api_key
```

---

## 📡 API Reference

### Base URLs
- **v1 API**: `https://agriapp-k3jd.onrender.com/api/v1`
- **Legacy API**: `https://agriapp-k3jd.onrender.com/api`
- **Swagger Docs**: `https://agriapp-k3jd.onrender.com/api-docs`

### Authentication
```
POST /api/auth/register       # Register new user
POST /api/auth/verify-email   # Verify email with OTP
POST /api/auth/login          # Login
POST /api/auth/forgot-password # Request password reset
POST /api/auth/reset-password  # Reset password with token
POST /api/auth/refresh         # Refresh JWT token
GET  /api/auth/me              # Get current user profile
PUT  /api/auth/me              # Update profile
POST /api/auth/logout          # Logout
```

### AI Services
```
POST /api/v1/ai/crop-recommendations  # Get crop recommendations
POST /api/v1/ai/yield-predictions     # Predict crop yield
GET  /api/v1/ai/yield-predictions     # Get prediction history
POST /api/v1/ai/disease-detection     # Detect plant disease (image upload)
POST /api/v1/ai/crop-guide            # Generate crop guide
GET  /api/v1/ai/crop-guide/quick/:crop # Quick crop info
GET  /api/v1/ai/stats/summary         # AI usage stats
```

### Farm Management
```
GET    /api/v1/farm        # List farms
POST   /api/v1/farm        # Create farm
GET    /api/v1/farm/:id    # Get farm
PUT    /api/v1/farm/:id    # Update farm
DELETE /api/v1/farm/:id    # Delete farm
```

### Market & Weather
```
GET /api/v1/market/prices         # Crop prices
GET /api/v1/market/weather        # Weather data
GET /api/v1/market/labour-alerts  # Labour alerts
POST /api/v1/market/labour-alerts # Create alert
```

### Planning
```
GET    /api/v1/planning/calendar/tasks      # Calendar tasks
POST   /api/v1/planning/calendar/tasks      # Create task
PUT    /api/v1/planning/calendar/tasks/:id  # Update task
DELETE /api/v1/planning/calendar/tasks/:id  # Delete task
GET    /api/v1/planning/labour-scheduling   # Labour schedule
```

### Forum
```
GET  /api/forum/threads          # Get threads
POST /api/forum/threads          # Create thread
GET  /api/forum/categories       # Get categories
GET  /api/forum/marketplace      # Marketplace listings
GET  /api/forum/knowledge        # Knowledge articles
GET  /api/forum/expert-sessions  # Expert sessions
```

### ML Service Endpoints
```
GET  /                    # Health check
POST /recommend/crop      # Crop recommendation
POST /predict/yield       # Yield prediction
POST /detect/disease      # Disease detection (image)
GET  /health              # Detailed health status
```

---

## 🗄️ Database Schema

Key models in PostgreSQL (via Prisma):

```
User              - User accounts with roles (FARMER/AGRONOMIST/ADMIN)
PendingUser       - Unverified registrations (deleted after verification)
Farm              - User-owned farm properties
CropRecommendation - AI crop suggestions with confidence scores
YieldPrediction   - ML yield forecasts with confidence intervals
DiseaseDetection  - Plant disease analysis results
CalendarTask      - Agricultural planning tasks
LabourAlert       - Worker availability alerts
Worker            - Labour workforce management
Shift             - Worker shift scheduling
LabourTask        - Farm tasks requiring workers
ForumThread       - Community discussion threads
ForumReply        - Thread replies (supports nesting)
ForumMarketplace  - Buy/sell listings
KnowledgeArticle  - Expert farming articles
ExpertSession     - Live expert Q&A sessions
ChatMessage       - AI chatbot conversation history
CropPrice         - Market price data
WeatherData       - Historical weather records
```

---

## 🔐 Authentication Flow

```
1. Register → POST /api/auth/register
   └── Creates PendingUser, sends OTP via Brevo email

2. Verify Email → POST /api/auth/verify-email
   └── Validates OTP, creates User, deletes PendingUser
   └── Returns JWT token

3. Login → POST /api/auth/login
   └── Validates credentials
   └── Returns JWT token + sets HTTP-only cookie

4. Protected Routes → Add header:
   Authorization: Bearer <token>

5. Token Refresh → POST /api/auth/refresh
   └── Uses HTTP-only cookie to issue new token
```

---

## 🚢 Deployment

### Frontend → Vercel
```bash
# Auto-deploys on push to master
# Root directory: frontend
# Build: npm run build
```

### Backend → Render
```bash
# Root directory: backend
# Build: npm install && npm run build
# Start: npm start
# Auto-runs: npx prisma migrate deploy
```

### ML Service → Hugging Face Spaces
```bash
# Space: anandsrinivas/agrisense-ml
# SDK: Docker
# Port: 7860
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

---

## 📁 Key Files

```
backend/
├── src/index.ts              # Express app entry point
├── src/controllers/          # Route handlers
├── src/middleware/auth.ts    # JWT authentication middleware
├── src/utils/emailService.ts # Brevo email integration
├── src/services/geminiService.ts # Google Gemini AI
├── prisma/schema.prisma      # Database schema
└── tests/                    # Test scripts

frontend/
├── app/                      # Next.js App Router pages
├── components/               # Reusable UI components
├── contexts/AuthContext.tsx  # Authentication state
├── lib/config/api.ts         # API endpoint configuration
├── public/locales/           # i18n translation files
└── .npmrc                    # legacy-peer-deps=true

ml-service/
├── main.py                   # FastAPI app
├── models/                   # ML model classes
├── schemas/                  # Request/response schemas
├── utils/                    # Helper utilities
└── Dockerfile                # Docker config for HF Spaces
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test -- --run

# Manual API testing
# Visit: https://agriapp-k3jd.onrender.com/api-docs
```

---

## 🐛 Known Issues & Notes

- **Render free tier** spins down after 15 min inactivity — first request may take 50s
- **ML Service** on HF Spaces may have cold start delays
- **Email OTP** uses Brevo HTTP API (SMTP is blocked on Render free tier)
- **Redis** is disabled on production (DISABLE_REDIS=true) — caching falls back to in-memory

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "feat: add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use this project for learning and development.

---

## 👨‍💻 Author

**Srinivas A** — [GitHub](https://github.com/anandsrinivas98)
