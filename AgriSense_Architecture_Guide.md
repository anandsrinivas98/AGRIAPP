# 🌾 AgriSense: End-to-End Application & Architecture Guide

AgriSense is a premium, AI-powered smart farming platform designed to empower farmers and agricultural experts with data-driven decision-making tools. This document provides an exhaustive, end-to-end explanation of the platform's architecture, processes, data flows, folder structures, database models, and security design.

---

## 📂 1. Workspace Directory Architecture

The AgriSense codebase is organized as a monorepo consisting of a web application frontend, a logical backend API server, and a machine learning service. Below is a map of the folder structures:

```
cropfinally/
├── backend/                   # Node.js + Express + TypeScript API Server
│   ├── prisma/                # Prisma ORM Schema and migrations
│   │   └── schema.prisma      # PostgreSQL Database Schema definition
│   ├── src/
│   │   ├── api/v1/            # API Route handlers organized by category
│   │   │   ├── ai/            # AI features (Crop Recommendation, Yield, Disease, Crop Guide)
│   │   │   ├── auth/          # Authentication & user sessions
│   │   │   ├── community/     # Forums, categories, threads, likes, and replies
│   │   │   ├── farm/          # Farm management routes
│   │   │   ├── market/        # Marketplace listings, reviews, and categories
│   │   │   └── planning/      # Labour scheduling, tasks, and shifts
│   │   ├── config/            # Environment variable configurations
│   │   ├── controllers/       # Legacy controllers
│   │   ├── middleware/        # Express Middlewares (Auth, Error Handler, Validator)
│   │   ├── routes/            # Legacy Express routes
│   │   ├── services/          # Core Business Logic Services
│   │   │   ├── cacheService.ts           # Redis Cache-aside manager
│   │   │   ├── chatHistoryService.ts     # Chat history persistence
│   │   │   ├── cronService.ts            # Scheduled analytics compilation
│   │   │   ├── cropGuideService.ts       # Crop cultivation knowledge generator
│   │   │   ├── documentService.ts        # Chatbot document parser & extractor
│   │   │   ├── forumService.ts           # Forum content management
│   │   │   ├── geminiService.ts          # Google Gemini-2.0-Flash integration
│   │   │   ├── labourSchedulingService.ts# Labour allocation & scheduling
│   │   │   ├── pdfOcrService.ts          # Scanned PDF Tesseract OCR service
│   │   │   ├── socketService.ts          # Socket.io real-time alerts
│   │   │   └── vectorService.ts          # ChromaDB knowledge base sync
│   │   └── index.ts           # Main Express server entry point
│   ├── Dockerfile             # Production container definition
│   └── tsconfig.json          # TypeScript compiler configurations
│
├── frontend/                  # Next.js 14 + Tailwind CSS Presentation Layer
│   ├── app/                   # Next.js App Router folders
│   │   ├── about/             # Info page
│   │   ├── auth/              # Registration, Login, OTP verification pages
│   │   ├── dashboard/         # Main workspace/portal for farmers
│   │   ├── marketplace/       # Peer-to-peer equipment and produce store
│   │   ├── profile/           # User configuration & reputation overview
│   │   ├── weather/           # Forecast & historical climate insights
│   │   ├── globals.css        # Core design system configuration
│   │   └── layout.tsx         # Root layout structure
│   ├── components/            # Reusable UI component modules
│   │   ├── auth/              # Verification panels
│   │   ├── chatbot/           # Chat assistant interface with file-upload widgets
│   │   ├── crop planning/     # Calendar and progress trackers
│   │   ├── labour/            # Shift management, workers list, cost graphs
│   │   ├── marketplace/       # Listing cards, reviews, post listing form
│   │   └── weather/           # Interactive climate widget charts
│   ├── contexts/              # React Context Providers (Auth, Socket)
│   └── package.json           # Node configuration and dependencies
│
└── ml-service/                # Python + FastAPI Machine Learning Service
    ├── models/                # Machine Learning Inference classes
    │   ├── crop_recommender.py# Soil classification (Random Forest)
    │   ├── disease_detector.py# Leaf image classifier
    │   └── yield_predictor.py # Crop production forecasting
    ├── schemas/               # Pydantic Request/Response validation models
    ├── utils/                 # Auxiliary tools (Image processor, loggers)
    ├── main.py                # FastAPI server endpoints
    ├── Dockerfile             # FastAPI deployment container
    └── requirements.txt       # Python dependencies
```

---

## 🏗️ 2. High-Level System Architecture

AgriSense utilizes a decoupled, three-tier service-oriented architecture designed for scalability, security, and low latency.

```mermaid
graph TD
    subgraph Frontend [Presentation Layer - Next.js 14]
        WebClient["Next.js Web App (Vercel)"]
        PWA["Progressive Web App"]
    end

    subgraph Backend [Logic Layer - Node.js & Express]
        API["Express API Server (Render)"]
        PrismaClient["Prisma ORM"]
        RedisCache[("Redis Caching (Upstash)")]
        Gemini["Gemini-2.0-Flash SDK"]
        OpenRouter["OpenRouter (Fallback Chain)"]
    end

    subgraph MLService [Machine Learning Layer - FastAPI]
        FastAPIApp["FastAPI Service (Hugging Face)"]
        CropRec["Crop Recommender (Random Forest)"]
        YieldPred["Yield Predictor"]
        DiseaseDet["Disease Detector"]
    end

    subgraph Data [Data Layer - Supabase & Vector DB]
        PostgreSQL[("PostgreSQL Database (RLS Enforced)")]
        ChromaDB[("ChromaDB Vector Store")]
    end

    WebClient -->|HTTPS / Socket.io| API
    API -->|Direct TCP Port 6543| PostgreSQL
    API -->|HTTP REST + Redis Cache| RedisCache
    API -->|HTTP REST| FastAPIApp
    API -->|HTTP REST| Gemini
    API -->|HTTP REST| OpenRouter
    API -->|HTTP REST| ChromaDB
    FastAPIApp -->|scikit-learn Inference| CropRec
    FastAPIApp -->|Python ML| YieldPred
    FastAPIApp -->|CV / Image Processing| DiseaseDet
```

### Key Service Boundaries
* **Frontend**: A Next.js 14 web application deployed on Vercel. It leverages the App Router, Tailwind CSS, Framer Motion (for premium animations), and Socket.io client (for real-time chat and scheduling alerts).
* **Backend API**: A TypeScript-based Node.js + Express server running on Render. It processes business logic, handles user sessions, manages database operations via Prisma ORM, caches high-frequency queries in Redis, and integrates with generative AI tools (Google Gemini and OpenRouter).
* **ML Service**: A Python-based FastAPI service deployed on Hugging Face Spaces. It handles scikit-learn model inference for recommendations and yield forecasting, and handles computer vision image pre-processing.
* **Database**: PostgreSQL database hosted on Supabase (configured with Row-Level Security) and ChromaDB vector store for AI knowledge indexing.

---

## 💾 3. Database Schema Architecture

The database is built on PostgreSQL via Supabase, managed using Prisma ORM. Below is the relational structure:

### 3.1 User & Farm Management
* **PendingUser (`pending_users` table)**: Temporarily stores user records during the email confirmation phase.
  * Fields: `id`, `email`, `password` (hashed), `firstName`, `lastName`, `phone`, `role` (FARMER, AGRONOMIST, ADMIN), `verificationOtp`, `verificationOtpExpiry`.
* **User (`users` table)**: Verified users who have successfully validated their email OTP.
  * Fields: `id`, `email`, `password`, `firstName`, `lastName`, `phone`, `avatar`, `role`, `verified`, `resetToken`, `resetTokenExpiry`.
  * Relations: Has many `farms`, `recommendations`, `yieldPredictions`, `diseaseDetections`, `calendarTasks`, `forumThreads`, `forumReplies`, `forumLikes`, `marketplaceListings`, `marketplaceReviews`.
* **Farm (`farms` table)**: Agricultural plots associated with a user.
  * Fields: `id`, `name`, `location`, `latitude`, `longitude`, `area` (acres), `soilType`, `irrigationType`, `userId`.

### 3.2 AI & Machine Learning Logs
* **CropRecommendation (`crop_recommendations` table)**: Persists parameters and rankings generated by the Random Forest recommender.
  * Fields: `id`, `userId`, `farmId`, `nitrogen`, `phosphorus`, `potassium`, `ph`, `temperature`, `humidity`, `rainfall`, `season`, `marketDemand`, `recommendations` (JSON array of crops and confidence scores), `confidence`.
* **YieldPrediction (`yield_predictions` table)**: Forecasts estimated crop yield values.
  * Fields: `id`, `userId`, `farmId`, `crop`, `area`, `avgRainfall`, `pesticideUsage`, `temperature`, `pastYields` (JSON), `predictedYield`, `confidenceInterval` (JSON: `{lower: number, upper: number}`), `confidence`.
* **DiseaseDetection (`disease_detections` table)**: Keeps diagnostic histories of plant foliage.
  * Fields: `id`, `userId`, `imagePath`, `cropType`, `diseaseName`, `severity` (LOW, MEDIUM, HIGH), `confidence`, `treatment` (JSON), `annotations` (JSON bounding boxes).

### 3.3 Labour Scheduling & Analytics
* **Worker (`workers` table)**: Farm hands hired by users.
  * Fields: `id`, `userId`, `firstName`, `lastName`, `phone`, `email`, `skills` (string array), `hourlyRate`, `availability` (JSON weekly schedule), `status` (ACTIVE, INACTIVE, ON_LEAVE), `rating`, `totalHours`.
* **LabourTask (`labour_tasks` table)**: Job allocations.
  * Fields: `id`, `userId`, `title`, `description`, `taskType`, `crop`, `location`, `priority` (LOW, MEDIUM, HIGH, CRITICAL), `requiredWorkers`, `requiredSkills` (string array), `estimatedHours`, `startDate`, `endDate`, `status` (PENDING, SCHEDULED, IN_PROGRESS, COMPLETED, DELAYED, CANCELLED), `progress` (0-100).
* **Shift (`shifts` table)**: Scheduled time slots mapping workers to specific tasks.
  * Fields: `id`, `workerId`, `taskId`, `date`, `startTime`, `endTime`, `breakMinutes`, `actualStart`, `actualEnd`, `status` (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW), `overtimeHours`, `notes`.
* **ScheduleAlert (`schedule_alerts` table)**: Automated scheduling alerts.
  * Fields: `id`, `userId`, `taskId`, `alertType` (UPCOMING_TASK, SHIFT_CHANGE, OVERTIME_WARNING, LABOR_SHORTAGE, WORKER_ABSENCE, TASK_DELAYED, WEATHER_IMPACT), `title`, `message`, `severity` (INFO, WARNING, CRITICAL), `isRead`, `actionRequired`, `metadata` (JSON), `expiresAt`.
* **WorkerAbsence (`worker_absences` table)**: Approved leaves of absence.
  * Fields: `id`, `workerId`, `startDate`, `endDate`, `reason`, `approved`.
* **LabourAnalytics (`labour_analytics` table)**: Compiled daily performance insights.
  * Fields: `id`, `userId`, `date`, `totalWorkers`, `activeWorkers`, `totalHours`, `overtimeHours`, `efficiency` (estimated / actual hours), `costPerHour`, `tasksCompleted`, `tasksDelayed`, `metadata` (JSON).

### 3.4 Community Forums & Marketplace
* **ForumCategory (`forum_categories` table)**: Categorization folders for discussion threads.
  * Fields: `id`, `name`, `slug`, `description`, `icon`, `color`, `order`, `isActive`.
* **ForumThread (`forum_threads` table)**: Primary discussion posts.
  * Fields: `id`, `categoryId`, `authorId`, `title`, `content` (Markdown text), `slug`, `isPinned`, `isLocked`, `viewCount`, `likeCount`, `tags`, `images`, `location`.
* **ForumReply (`forum_replies` table)**: Thread messages, supporting nested responses.
  * Fields: `id`, `threadId`, `authorId`, `content`, `parentId`, `images`, `likeCount`, `isExpert` (marked true for agronomy answers), `isBestAnswer`.
* **ForumLike (`forum_likes` table)**: Ensures users can only like a thread/reply once.
  * Fields: `id`, `userId`, `threadId`, `replyId`.
* **ForumMarketplace (`forum_marketplace` table)**: Peer-to-peer equipment and crop listings.
  * Fields: `id`, `sellerId`, `title`, `description`, `category` (SEEDS, FERTILIZERS, PESTICIDES, MACHINERY, TOOLS, LIVESTOCK, PRODUCE, IRRIGATION, OTHER), `price`, `unit`, `quantity`, `location`, `district`, `state`, `images`, `condition` (NEW, LIKE_NEW, GOOD, FAIR, USED), `status` (AVAILABLE, SOLD, RESERVED, EXPIRED), `contactPhone`, `contactEmail`, `viewCount`, `expiresAt`.
* **UserReputation (`user_reputation` table)**: Dynamic scores mapped to user participation.
  * Fields: `id`, `userId`, `points`, `level`, `badges` (array), `threadsCreated`, `repliesPosted`, `bestAnswers`, `helpfulVotes`.

---

## 🔄 4. End-to-End Core Data Flows

### 4.1 Authentication & Email Verification Process

```mermaid
sequenceDiagram
    autonumber
    actor Farmer
    participant Frontend as Next.js Web Client
    participant Backend as Express API Server
    participant Supabase as Supabase PostgreSQL
    participant Brevo as Brevo Email API

    Farmer->>Frontend: Fill Registration Form
    Frontend->>Backend: POST /api/v1/auth/register
    Backend->>Backend: Hash Password (bcryptjs) & Generate 6-Digit OTP
    Backend->>Supabase: Insert credentials into "pending_users" table
    Backend->>Brevo: Call SMTP API to Send OTP Email
    Backend-->>Frontend: OTP Sent Success
    Frontend-->>Farmer: Show OTP Verification Panel
    Farmer->>Frontend: Input 6-digit OTP
    Frontend->>Backend: POST /api/v1/auth/verify-email
    Backend->>Supabase: Query "pending_users" to Validate OTP and Expiry
    alt OTP is Valid & Active
        Backend->>Supabase: Insert new User into "users" table
        Backend->>Supabase: Delete User from "pending_users" table
        Backend->>Backend: Generate JWT Access & Refresh Tokens
        Backend-->>Frontend: Send tokens in HTTP-Only Cookies
        Frontend-->>Farmer: Redirect to Dashboard
    else OTP is Invalid or Expired
        Backend-->>Frontend: HTTP 400 - Verification Failed
        Frontend-->>Farmer: Display error (e.g., "Invalid OTP, please try again")
    end
```

---

### 4.2 AI Crop Recommendation Flow

```mermaid
sequenceDiagram
    autonumber
    actor Farmer
    participant Frontend as Next.js Dashboard
    participant Backend as Express API Server
    participant Cache as Redis Cache
    participant FastAPI as FastAPI ML Service
    participant Supabase as Supabase DB

    Farmer->>Frontend: Input soil & environmental data (N, P, K, pH, rainfall, temp)
    Frontend->>Backend: POST /api/v1/ai/crop-recommendations (with JWT)
    Backend->>Cache: Check for cached recommendation (Hash of N, P, K, pH, rainfall, temp)
    alt Cache Hit
        Cache-->>Backend: Return pre-computed JSON
        Backend-->>Frontend: Send recommendation list (fast path)
    else Cache Miss
        Backend->>FastAPI: POST /recommend/crop (soil parameters payload)
        FastAPI->>FastAPI: Load crop_recommender.pkl (Random Forest Classifier)
        FastAPI->>FastAPI: Predict top 5 crops with probability scores
        FastAPI-->>Backend: Return JSON list of recommended crops + confidence scores
        Backend->>Cache: Save results in Redis (TTL: 24 Hours)
        Backend->>Supabase: Log transaction in "crop_recommendations" table
        Backend-->>Frontend: Send recommendations payload
    end
    Frontend-->>Farmer: Display interactive cards, yield estimates, & market potential
```

---

### 4.3 AI Plant Disease Detection Flow (Dual-Engine Execution)

AgriSense uses a dual-engine diagnostics handler. If the localized Computer Vision engine fails or outputs a low confidence threshold, it triggers a fallback to Gemini Vision.

```mermaid
sequenceDiagram
    autonumber
    actor Farmer
    participant Frontend as Next.js Dashboard
    participant Backend as Express API Server
    participant FastAPI as FastAPI ML Service
    participant Gemini as Gemini-2.0-Flash API
    participant Supabase as Supabase DB

    Farmer->>Frontend: Upload image of infected leaf crop
    Frontend->>Backend: POST /api/v1/ai/disease-detection (Multipart Form)
    Backend->>Backend: Save image to local uploads directory
    Backend->>FastAPI: POST /detect/disease (Image Binary)
    FastAPI->>FastAPI: OpenCV image normalization
    FastAPI->>FastAPI: Run local CNN inference
    alt Local Inference Confidence >= 80%
        FastAPI-->>Backend: Returns diagnostic label & treatment plan
    else Local Inference Fails or Confidence < 80%
        FastAPI-->>Backend: Returns Low Confidence / Error code
        Backend->>Backend: Convert saved image to Base64
        Backend->>Gemini: Request gemini-2.0-flash vision (System-prompted JSON format)
        Gemini->>Gemini: Analyze crop structure & symptoms
        Gemini-->>Backend: Returns JSON containing diagnosis, organic/chemical treatments, & prevention tips
    end
    Backend->>Supabase: Insert details into "disease_detections" table
    Backend-->>Frontend: Return formatted diagnostic results
    Frontend-->>Farmer: Display health card & step-by-step action plan
```

---

### 4.4 Farming Chatbot & Document Parser Chain

The AI Chatbot allows users to ask questions and upload files (e.g., PDFs, Word docs, CSVs) for contextual processing.

```mermaid
sequenceDiagram
    autonumber
    actor Farmer
    participant Frontend as Next.js Chat Client
    participant Backend as Express API Server
    participant DocService as documentService.ts
    participant OCR as pdfOcrService (Tesseract.js)
    participant VectorDB as ChromaDB Vector Store
    participant Gemini as Gemini-2.0-Flash API
    participant OpenRouter as OpenRouter API (Fallback)

    Farmer->>Frontend: Input question + Upload context file
    Frontend->>Backend: POST /api/chatbot (Form data)
    Backend->>DocService: Send file path for parsing
    alt File is digital PDF
        DocService->>DocService: Extract text using pdf-parse
    else File is scanned PDF (Image-based)
        DocService->>OCR: Execute Tesseract.js character recognition
        OCR-->>DocService: Return recognized text
    else File is Word (.docx)
        DocService->>DocService: Parse XML formatting using Mammoth
    else File is CSV / Plaintext
        DocService->>DocService: Read file contents directly
    end
    DocService-->>Backend: Return extracted string (Cap at 8000 characters)
    Backend->>VectorDB: Query semantic matches to retrieve farming guidelines
    VectorDB-->>Backend: Return top matched guidelines
    Backend->>Backend: Concatenate context: User prompt + File text + Guidelines
    alt Primary Model (Gemini API) is available
        Backend->>Gemini: Request Chat Completion (gemini-2.0-flash)
        Gemini-->>Backend: Return response answer
    else Quota limit reached or Timeout
        Backend->>OpenRouter: Fallback Request to OpenRouter (openrouter/free)
        OpenRouter-->>Backend: Return response answer
    end
    Backend->>Supabase: Save logs in "chat_messages" table
    Backend-->>Frontend: Stream answer to client
    Frontend-->>Farmer: Render formatted chatbot bubble
```

---

### 4.5 Labor Scheduling & Analytics Engine

The scheduling platform manages labor allocations, calculates performance statistics, and triggers warnings via WebSockets (Socket.io) or cron updates.

```mermaid
graph TD
    subgraph DataInputs [Dynamic Inputs]
        Shifts["Shifts Table<br/>(Worker Check-Ins / Clock-Outs)"]
        Tasks["LabourTask Table<br/>(Due dates, Worker counts, Skills)"]
        Absences["WorkerAbsence Table<br/>(Approved Leaves)"]
    end

    subgraph LogicEngine [Processing Core]
        CronJob["cronService.ts<br/>(Runs daily at midnight)"]
        ServiceCore["labourSchedulingService.ts<br/>(Business Logic Engine)"]
    end

    subgraph Outputs [Result Operations]
        AnalyticsDB[("labour_analytics table")]
        AlertsDB[("schedule_alerts table")]
        SocketServer["Socket.io Broadcaster"]
    end

    Shifts & Tasks & Absences --> ServiceCore
    CronJob -->|Triggers Compilation| ServiceCore

    ServiceCore -->|Calculate efficiency rating & labor cost| AnalyticsDB
    ServiceCore -->|Identify overtime / understaffed tasks| AlertsDB
    AlertsDB -->|Push event: 'new_alert'| SocketServer
    SocketServer -->|Real-time dispatch| ClientUI["Next.js Web Client Toast Alert"]
```

#### Analytical Formulas
1. **Labor Efficiency ($E$)**:
   $$E = \left( \frac{\text{Estimated Hours required for task}}{\text{Actual Hours logged by workers}} \right) \times 100$$
2. **Reputation Engine Score ($R$)**:
   $$R = (T \times 10) + (C \times 5) + (B \times 50) + (L \times 2)$$
   Where:
   * $T$: Discussion threads created
   * $C$: Reply comments posted
   * $B$: Best/Expert answers selected
   * $L$: Likes received from other farmers

---

## 🔐 5. Security Architecture

AgriSense enforces security controls across both application layers and data connections.

### 5.1 Supabase Row-Level Security (RLS)
The database structure relies on Supabase, hardened against unauthorized external queries:
* **Default Deny Policy**: Row-Level Security (RLS) is enabled on all tables in the `public` schema. By default, no public `permissive` select/insert/update/delete policies are declared.
* **Superuser Connection Bypass**: The Express API server connects directly to the PostgreSQL engine via TCP (port 6543) using the `postgres` user credentials. Since `postgres` is the owner of these tables, it automatically bypasses RLS filters, giving the backend backend full read/write rights.
* **Client Lockdown**: Any attempt by external clients to read or manipulate tables directly via Supabase's auto-generated REST endpoint (`PostgREST` client API using the anonymous key) is denied by default.

### 5.2 Express Server Security Suite
* **Helmet.js**: Injects secure HTTP response headers (e.g., Content Security Policy, X-Frame-Options to block clickjacking, and X-Content-Type-Options).
* **CORS Settings**: Restricts origins to trusted domains, allowing requests only from local hosts (for development) and Vercel domains:
  ```typescript
  const allowedOrigins = [
    config.frontend.url,
    'https://agriapp-one.vercel.app',
    /https:\/\/agriapp-.*\.vercel\.app$/
  ];
  ```
* **JWT Token Rotation**:
  * **Access Token**: Short-lived cookie-based token (expires in 15 minutes).
  * **Refresh Token**: Long-lived HTTP-Only cookie-based token (expires in 7 days). It is stored with `Secure`, `SameSite=Strict`, and `HttpOnly` flags to protect against XSS and CSRF attacks.
* **Bcryptjs Hashing**: Passwords are saved as one-way salted hashes using a cost factor of 12.
* **Express Rate Limiter**: Limits requests to 100 calls per 15 minutes per IP address in production to protect against DDoS attacks.

---

## 🚀 6. Deployment Topology & Environments

AgriSense uses a production-ready cloud deployment setup:

```
                          [ DNS: Cloudflare ]
                                  │
         ┌────────────────────────┼────────────────────────┐
         │ (HTTP REST)            │ (HTTP REST)            │ (Socket.io)
         ▼                        ▼                        ▼
 ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
 │   Frontend   │         │   Backend    │         │ Real-time/WS │
 │ Next.js PWA  │         │ Express API  │         │  Socket.io   │
 │   (Vercel)   │         │   (Render)   │         │   (Render)   │
 └──────────────┘         └──────┬───────┘         └──────┬───────┘
                                 │                        │
                 ┌───────────────┴───────────────┐        │
                 ▼                               ▼        │
         ┌──────────────┐                ┌──────────────┐ │
         │  ML Service  │                │ Cache Layer  │ │
         │ FastAPI App  │                │ Redis Server │◄┘
         │ (HuggingFace)│                │  (Upstash)   │
         └──────────────┘                └──────────────┘
                                                 │
                                                 ▼
                                         ┌──────────────┐
                                         │ Database Tier│
                                         │ Supabase Post│
                                         │  -greSQL DB  │
                                         └──────────────┘
```

* **Frontend Hosting (Vercel)**: Next.js frontend builds are processed and served globally via Vercel's Edge CDN network.
* **API Server Hosting (Render)**: The Node.js application is packaged inside a Docker container and deployed on Render. Inactive backend instances are kept active via cron health checks to prevent cold-starts.
* **Inference Tier (Hugging Face Spaces)**: The Python FastAPI application is run in a secure space with CPU/GPU hardware, serving scikit-learn models and plant pathology classification.
* **Cache & DB Tiers**: Redis instances on Upstash handle quick-response data caches, while Supabase provides structured data storage.
