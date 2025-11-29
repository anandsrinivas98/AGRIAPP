# AgriSense Demo Plan

This document outlines the interactive demo steps to showcase AgriSense's capabilities to reviewers and stakeholders.

## Demo Environment Setup

### Prerequisites
- Docker and Docker Compose installed
- At least 4GB RAM available
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd agrisense

# Start all services
docker-compose up -d

# Wait for services to initialize (2-3 minutes)
# Access the application at http://localhost:3000
```

## Demo Flow (15-20 minutes)

### 1. Landing Page & Registration (2 minutes)

**Objective**: Showcase modern UI, animations, and multilingual support

**Steps**:
1. Open http://localhost:3000
2. **Highlight**: Animated hero section with Lottie animations
3. **Highlight**: Parallax scrolling and smooth transitions
4. **Demonstrate**: Language switcher (English ↔ Hindi)
5. Click "Get Started Free" → Registration page
6. **Highlight**: Form validation and micro-animations
7. Register with demo credentials:
   - Email: `demo@farmer.com`
   - Name: `Demo Farmer`
   - Password: `demo123`

### 2. Dashboard Overview (3 minutes)

**Objective**: Show personalized dashboard with animated KPIs

**Steps**:
1. **Highlight**: Welcome animation and personalized greeting
2. **Demonstrate**: Animated KPI cards counting up:
   - Total Yield: 125 quintals
   - Profit Margin: 28%
   - Crop Health: Excellent
   - Weather Alert: Clear
3. **Show**: Interactive map with crop suitability layers
4. **Highlight**: Quick action buttons with hover animations

### 3. Crop Recommendation Flow (4 minutes)

**Objective**: Demonstrate AI-powered crop recommendations

**Steps**:
1. Click "Get Crop Recommendation"
2. **Highlight**: Multi-step form with animated transitions
3. Fill in sample data:
   - **Soil Nutrients**: N=120, P=30, K=80, pH=6.4
   - **Environment**: Temp=28°C, Humidity=65%, Rainfall=150mm
   - **Farm Details**: 2 acres, Monsoon season, Drip irrigation
4. **Demonstrate**: Form validation and progress indicators
5. Submit and **highlight**: Loading animation
6. **Showcase**: Results with animated crop cards:
   - Staggered entrance animations
   - Progress bars for sustainability scores
   - Expandable details with pros/cons
7. **Highlight**: Top recommendation: Rice (92% confidence)

### 4. Disease Detection Demo (3 minutes)

**Objective**: Show computer vision capabilities

**Steps**:
1. Navigate to Disease Detection page
2. **Highlight**: Animated camera interface
3. **Demonstrate**: Drag-and-drop upload with progress ring
4. Upload sample diseased leaf image (provided in `/sample-data/`)
5. **Show**: Processing animation with AI analysis
6. **Highlight**: Results display:
   - Disease: Early Blight (82% confidence)
   - Severity meter with animated fill
   - Treatment recommendations
   - Annotated image overlay
7. **Demonstrate**: Save to calendar functionality

### 5. Price Tracker & Analytics (2 minutes)

**Objective**: Display market intelligence features

**Steps**:
1. Navigate to Price Tracker
2. **Highlight**: Animated chart loading
3. Select crop: Maize, Market: Local Mandi
4. **Demonstrate**: Interactive charts with:
   - Smooth transitions between timeframes (1M, 3M, 6M)
   - Hover tooltips with price details
   - Trend analysis indicators
5. **Show**: AI recommendation: "Sell Now - Price Peak Expected"

### 6. Crop Planning Calendar (2 minutes)

**Objective**: Show planning and scheduling capabilities

**Steps**:
1. Navigate to Crop Planning
2. **Highlight**: Interactive Gantt-style timeline
3. **Demonstrate**: 
   - Drag-to-reschedule tasks with snap animations
   - Add new task with animated form
   - Color-coded task types (sowing, irrigation, harvest)
4. **Show**: Automated reminders and notifications

### 7. AI Assistant Chat (2 minutes)

**Objective**: Demonstrate conversational AI and voice support

**Steps**:
1. Open AI Assistant (chat bubble)
2. **Highlight**: Animated message bubbles and typing indicators
3. **Demonstrate**: Text queries:
   - "What's the best fertilizer for tomatoes?"
   - "When should I harvest my wheat crop?"
4. **Show**: Voice input capability (Web Speech API)
5. **Demonstrate**: Multilingual support (ask question in Hindi)
6. **Highlight**: Quick-reply buttons with pulse animations

### 8. Community Forum (1 minute)

**Objective**: Show social features and real-time updates

**Steps**:
1. Navigate to Community Forum
2. **Highlight**: Real-time post updates
3. **Demonstrate**: Create new post with rich text editor
4. **Show**: Live comments and reactions
5. **Highlight**: Category filtering and search

### 9. Mobile Responsiveness (1 minute)

**Objective**: Showcase PWA capabilities

**Steps**:
1. Open browser developer tools
2. Switch to mobile view (iPhone/Android)
3. **Demonstrate**: 
   - Responsive design adaptation
   - Touch-friendly interactions
   - Mobile-optimized animations
4. **Show**: PWA install prompt
5. **Highlight**: Offline functionality (disconnect network)

## Demo Data & Scenarios

### Sample User Profiles
```json
{
  "demo_farmer": {
    "email": "demo@farmer.com",
    "name": "Demo Farmer",
    "location": "Punjab, India",
    "farm_size": "5 acres",
    "crops": ["wheat", "rice", "maize"]
  },
  "demo_agronomist": {
    "email": "expert@agri.com",
    "name": "Dr. Agricultural Expert",
    "role": "AGRONOMIST"
  }
}
```

### Sample Crop Recommendation Input
```json
{
  "soil": {
    "nitrogen": 120,
    "phosphorus": 30,
    "potassium": 80,
    "ph": 6.4
  },
  "environment": {
    "temperature": 28,
    "humidity": 65,
    "rainfall": 150
  },
  "farm": {
    "area": 2,
    "season": "monsoon",
    "irrigation": "drip"
  }
}
```

### Expected AI Responses
- **Crop Recommendation**: Rice (92%), Maize (87%), Soybean (78%)
- **Disease Detection**: Early Blight (82% confidence)
- **Yield Prediction**: 45 quintals (±5 quintals confidence interval)
- **Price Recommendation**: "Sell now - price at seasonal high"

## Technical Highlights to Mention

### Frontend Innovations
- **Animations**: Framer Motion + Lottie for smooth, meaningful animations
- **Performance**: React 18 with Suspense, lazy loading, and code splitting
- **Accessibility**: WCAG AA compliant with keyboard navigation
- **PWA**: Service workers for offline functionality
- **i18n**: Real-time language switching without page reload

### Backend Architecture
- **API Design**: RESTful with OpenAPI documentation
- **Real-time**: WebSocket integration for live updates
- **Security**: JWT with HTTP-only cookies, rate limiting, input validation
- **Scalability**: Docker containerization, Redis caching

### ML Integration
- **Models**: TensorFlow/PyTorch stubs ready for production models
- **APIs**: FastAPI for high-performance ML inference
- **Computer Vision**: OpenCV for image processing
- **Scalability**: Async processing for concurrent requests

### DevOps & Deployment
- **Containerization**: Multi-service Docker Compose setup
- **Database**: PostgreSQL with Prisma ORM and migrations
- **Monitoring**: Health checks and logging
- **CI/CD Ready**: GitHub Actions configuration included

## Troubleshooting Common Demo Issues

### Services Not Starting
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Restart specific service
docker-compose restart [service-name]
```

### Database Connection Issues
```bash
# Reset database
docker-compose down -v
docker-compose up -d postgres
# Wait 30 seconds
docker-compose up -d
```

### Frontend Build Issues
```bash
# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

## Demo Variations

### Quick Demo (5 minutes)
1. Landing page animations (1 min)
2. Crop recommendation flow (2 min)
3. Disease detection (1 min)
4. Mobile responsiveness (1 min)

### Technical Deep Dive (30 minutes)
- Include API documentation walkthrough
- Show database schema and relationships
- Demonstrate ML model endpoints
- Code architecture explanation
- Deployment and scaling discussion

### Business Demo (10 minutes)
- Focus on ROI and business value
- User testimonials and case studies
- Market opportunity and competitive advantages
- Pricing and business model discussion

## Post-Demo Resources

### For Developers
- API Documentation: http://localhost:5000/api-docs
- GitHub Repository: [Link to repo]
- Technical Architecture Document
- Setup and Development Guide

### For Business Stakeholders
- Business Case Presentation
- Market Analysis Report
- User Feedback and Testimonials
- Roadmap and Future Features

### For Investors
- Financial Projections
- Market Size and Opportunity
- Competitive Analysis
- Team and Technology Overview

---

**Note**: This demo showcases a production-ready MVP with mock ML models. Real agricultural data and trained models can be integrated by replacing the stub endpoints with actual model weights and API connections.