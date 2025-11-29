# AgriSense - AI Crop Recommendation System

A complete, production-ready web application for intelligent crop recommendations, yield predictions, and farm management.

## 🚀 Quick Start

### Using Docker (Recommended)
```bash
# Clone and navigate to project
cd agrisense

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Database: localhost:5432
```

### Manual Setup
```bash
# Install dependencies
npm run install:all

# Setup environment
cp .env.example .env
# Edit .env with your API keys

# Start development servers
npm run dev
```

## 🏗️ Architecture

```
AgriSense/
├── frontend/          # Next.js React app with TailwindCSS
├── backend/           # Node.js Express API
├── ml-service/        # Python ML inference service
├── database/          # PostgreSQL migrations & seeds
├── docker/            # Docker configurations
└── docs/              # Documentation & API specs
```

## 🎯 Features

- **Crop Recommendation**: AI-powered suggestions based on soil, weather, and market data
- **Yield Prediction**: ML models for harvest forecasting
- **Disease Detection**: Computer vision for plant disease identification
- **Price Tracking**: Real-time market price analysis
- **Weather Monitoring**: Localized forecasts and alerts
- **Crop Planning**: Interactive calendar and timeline management
- **Farmer Network**: Community forum with real-time updates
- **AI Assistant**: Multilingual chatbot with voice support

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with React 18
- **Styling**: TailwindCSS + Headless UI
- **Animations**: Framer Motion + Lottie
- **Maps**: Mapbox GL JS
- **Charts**: Recharts
- **i18n**: react-i18next (English + Hindi)
- **PWA**: Workbox service workers

### Backend
- **Runtime**: Node.js + Express
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT with secure cookies
- **Validation**: Zod schemas
- **Rate Limiting**: express-rate-limit
- **Real-time**: Socket.io

### ML Service
- **Framework**: FastAPI + Python
- **ML**: TensorFlow/PyTorch stubs
- **Image Processing**: OpenCV + PIL
- **Models**: Crop recommendation, yield prediction, disease detection

## 📱 Demo Flows

### 1. Crop Recommendation
1. Navigate to Recommendation page
2. Enter soil data (N=120, P=30, K=80, pH=6.4)
3. Select monsoon season, 2 acres
4. View animated recommendations with yield estimates

### 2. Disease Detection
1. Go to Disease Detection page
2. Upload leaf photo or use camera
3. View AI diagnosis with confidence score
4. Save treatment plan to calendar

### 3. Price Analysis
1. Open Price Tracker
2. Select crop and market
3. View 6-month trend charts
4. Get sell/wait recommendations

## 🔧 Development

### Scripts
```bash
npm run dev          # Start all development servers
npm run build        # Build for production
npm run test         # Run all tests
npm run lint         # Lint and format code
npm run docker:up    # Start with Docker
npm run docker:down  # Stop Docker services
```

### Environment Variables
Copy `.env.example` to `.env` and configure:
- Database credentials
- JWT secrets
- API keys (OpenWeatherMap, Mapbox)
- ML service endpoints

## 🧪 Testing

```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test

# ML service tests
cd ml-service && pytest

# E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Production Build
```bash
npm run build:prod
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Setup
- Configure production database
- Set up Redis for caching
- Configure CDN for static assets
- Set up monitoring and logging

## 🔐 Security

- JWT authentication with HttpOnly cookies
- Input validation and sanitization
- Rate limiting on public endpoints
- CORS configuration
- SQL injection prevention with Prisma

## 🌍 Internationalization

Supported languages:
- English (default)
- Hindi (हिंदी)

Add new languages by creating translation files in `frontend/public/locales/`

## 📊 API Documentation

Interactive API docs available at:
- Development: http://localhost:5000/api-docs
- Swagger JSON: http://localhost:5000/swagger.json

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the [documentation](docs/)
- Join our community forum

---

Built with ❤️ for farmers worldwide 🌾