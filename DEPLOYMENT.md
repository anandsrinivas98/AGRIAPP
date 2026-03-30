# AgriSense Deployment Guide

This project has 3 services to deploy:

| Service | Tech | Platform |
|---------|------|----------|
| Frontend | Next.js 14 | Vercel |
| Backend | Node.js / Express | Render |
| ML Service | Python / FastAPI | Render |

Database is hosted on **Neon** (PostgreSQL) — no setup needed.

---

## 1. Frontend → Vercel

### Steps
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **New Project** → import `AGRIAPP` repo
3. Set **Root Directory** to `frontend`
4. Add the following environment variables:

```env
NEXT_PUBLIC_API_URL=https://agriapp-k3jd.onrender.com
NEXT_PUBLIC_ML_SERVICE_URL=https://your-ml-service.onrender.com
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here

NEXT_PUBLIC_AGMARKNET_ENABLED=true
NEXT_PUBLIC_AGMARKNET_API_URL=https://api.data.gov.in/resource
NEXT_PUBLIC_AGMARKNET_RESOURCE_ID=9ef84268-d588-465a-a308-a864a43d0070
NEXT_PUBLIC_AGMARKNET_API_KEY=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b
NEXT_PUBLIC_AGMARKNET_RATE_LIMIT=100

NEXT_PUBLIC_OGD_ENABLED=true
NEXT_PUBLIC_OGD_API_URL=https://api.data.gov.in/resource
NEXT_PUBLIC_OGD_API_KEY=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b
NEXT_PUBLIC_OGD_RATE_LIMIT=100

NEXT_PUBLIC_MARKET_CACHE_ENABLED=true
NEXT_PUBLIC_MARKET_CACHE_TTL_PRICES=300
NEXT_PUBLIC_MARKET_CACHE_TTL_OVERVIEW=600
NEXT_PUBLIC_MARKET_CACHE_TTL_HISTORICAL=3600
NEXT_PUBLIC_MARKET_CACHE_TTL_LISTINGS=900

NEXT_PUBLIC_MARKET_FALLBACK_ENABLED=true
NEXT_PUBLIC_MARKET_USE_MOCK_DATA=false
```

5. Click **Deploy**

### Notes
- `frontend/.npmrc` is already configured with `legacy-peer-deps=true` to handle peer dependency conflicts
- Locale files (`public/locales/en/common.json`, `public/locales/hi/common.json`) are committed and required for i18n

---

## 2. Backend → Render

### Steps
1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: 18+

4. Add the following environment variables:

```env
DATABASE_URL=postgresql://neondb_owner:...@ep-dawn-bush-afhbjth3-pooler.c-2.us-west-2.aws.neon.tech/AGRIAPP?sslmode=require
JWT_SECRET=your-strong-secret-here
NODE_ENV=production
PORT=5000
ML_SERVICE_URL=https://your-ml-service.onrender.com
GEMINI_API_KEY=your_gemini_api_key
CHROMA_API_KEY=your_chroma_api_key
CHROMA_TENANT=your_chroma_tenant
CHROMA_DATABASE=AGRIAPP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=AgriSense <your_email@gmail.com>
FRONTEND_URL=https://agriapp-mo4n3iycv-srinivass-projects-a5100735.vercel.app
DISABLE_REDIS=true
```

5. Click **Create Web Service**

---

## 3. ML Service → Render

### Steps
1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Root Directory**: `ml-service`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 8000`
   - **Python Version**: 3.10+

4. No environment variables required unless your ML service uses external APIs

5. Click **Create Web Service**

---

## 4. Post-Deployment Checklist

- [ ] Update `NEXT_PUBLIC_API_URL` in Vercel with the Render backend URL
- [ ] Update `NEXT_PUBLIC_ML_SERVICE_URL` in Vercel with the Render ML service URL
- [ ] Update `ML_SERVICE_URL` in Render backend with the ML service URL
- [ ] Update `FRONTEND_URL` in Render backend with the Vercel frontend URL
- [ ] Test registration and login flow
- [ ] Test crop recommendation and yield prediction
- [ ] Verify email sending works

---

## Local Development

```bash
# Install all dependencies
npm install

# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev

# Start ML service
cd ml-service && uvicorn main:app --reload
```

Frontend runs on `http://localhost:3000`  
Backend runs on `http://localhost:5000`  
ML Service runs on `http://localhost:8000`
