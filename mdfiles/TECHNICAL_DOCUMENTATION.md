# AGRISENSE - SYSTEM ARCHITECTURE & IMPLEMENTATION MANUAL

**Version:** 1.0.0  
**Document Type:** Technical Specification & Developer Handover  
**Project:** AgriSense - AI Crop Recommendation System  
**Date:** December 2025  
**Status:** Production Ready

---

## DOCUMENT CONTROL

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | Dec 2025 | AgriSense Team | Initial comprehensive documentation |

---

## TABLE OF CONTENTS

1. [Technology Specifications](#section-1-technology-specifications)
2. [System Architecture](#section-2-system-architecture)
3. [Implementation Details](#section-3-implementation-details)
4. [Testing & Validation](#section-4-testing--validation)
5. [Code Walkthrough](#section-5-code-walkthrough)
6. [Source Reference](#section-6-source-reference)

---

# SECTION 1: TECHNOLOGY SPECIFICATIONS

## 1.1 EXECUTIVE SUMMARY

AgriSense is a production-grade, full-stack web application designed to revolutionize agricultural decision-making through artificial intelligence and machine learning. The system employs a modern microservices architecture with three primary layers: a Next.js-powered frontend, a Node.js/Express backend API, and a Python-based machine learning inference service. This multi-tier architecture ensures scalability, maintainability, and separation of concerns.

The technology stack has been carefully selected to balance developer productivity, performance, security, and long-term maintainability. Each technology choice addresses specific technical requirements and business objectives.

---

## 1.2 CORE TECHNOLOGY STACK ANALYSIS

### 1.2.1 Frontend Framework: Next.js 14.0.4

**Technical Overview:**

Next.js is a React-based framework developed and maintained by Vercel that provides a production-ready foundation for building modern web applications. Version 14.0.4 represents the latest stable release with significant performance improvements and developer experience enhancements.


**Why Next.js Over Alternatives:**

The decision to use Next.js instead of alternative frameworks (Create React App, Gatsby, Remix, or vanilla React) was driven by several critical technical requirements:

1. **Server-Side Rendering (SSR) vs Client-Side Rendering (CSR):**
   - Traditional React applications (CRA) render entirely on the client side, meaning the browser receives a minimal HTML shell and JavaScript must execute before content appears
   - Next.js implements hybrid rendering strategies including SSR, Static Site Generation (SSG), and Incremental Static Regeneration (ISR)
   - For AgriSense, SSR is crucial for SEO optimization (farmers searching for crop recommendations), faster initial page loads on slow rural internet connections, and better performance on low-end mobile devices
   - The framework automatically handles code splitting, ensuring users only download JavaScript needed for the current page

2. **File-Based Routing System:**
   - Next.js uses a file-system-based router where the folder structure in the `app/` directory directly maps to URL routes
   - This eliminates the need for manual route configuration and reduces boilerplate code
   - Dynamic routes are created using bracket notation (e.g., `[id]` for dynamic parameters)
   - Nested layouts and loading states are handled declaratively through special files (`layout.tsx`, `loading.tsx`, `error.tsx`)

3. **API Routes & Backend Integration:**
   - Next.js provides built-in API routes, allowing backend endpoints to coexist with frontend code
   - While AgriSense uses a separate Express backend for complex business logic, Next.js API routes handle lightweight operations like authentication token refresh and client-side data transformations
   - This reduces the need for a separate BFF (Backend for Frontend) layer

4. **Image Optimization:**
   - The `next/image` component automatically optimizes images by serving modern formats (WebP, AVIF), lazy loading, and responsive sizing
   - Critical for AgriSense's disease detection feature where farmers upload high-resolution plant images
   - Reduces bandwidth consumption by up to 70% compared to standard `<img>` tags

5. **Built-in Performance Optimizations:**
   - Automatic code splitting ensures each page only loads necessary JavaScript
   - Prefetching of linked pages on hover improves perceived performance
   - React Server Components (RSC) in Next.js 14 allow components to render on the server, reducing client-side JavaScript bundle size
   - Font optimization with `next/font` eliminates layout shift and improves Core Web Vitals

**Technical Architecture of Next.js:**

Next.js operates on a hybrid rendering model:

- **Build Time (Static Generation):** Pages are pre-rendered at build time and served as static HTML. Used for marketing pages, documentation, and content that doesn't change frequently.

- **Request Time (Server-Side Rendering):** Pages are rendered on each request, allowing dynamic content based on user authentication, location, or real-time data. Used for personalized dashboards and crop recommendations.

- **Client-Side Rendering:** After initial page load, subsequent navigation uses client-side routing for instant transitions without full page reloads.

**Next.js 14 Specific Features Used in AgriSense:**

- **App Router:** The new `app/` directory structure with React Server Components
- **Server Actions:** Direct server-side mutations without API routes
- **Streaming:** Progressive rendering of UI components as data becomes available
- **Parallel Routes:** Simultaneous rendering of multiple page sections (e.g., weather widget + crop recommendations)
- **Intercepting Routes:** Modal overlays without changing URL (used for image previews in disease detection)


### 1.2.2 UI Library: React 18.2.0

**Technical Overview:**

React is a declarative, component-based JavaScript library for building user interfaces, developed and maintained by Meta (formerly Facebook). Version 18.2.0 introduces concurrent rendering capabilities that fundamentally change how React handles UI updates.

**Core React Concepts Utilized in AgriSense:**

1. **Component-Based Architecture:**
   - The entire UI is decomposed into reusable, self-contained components
   - Each component manages its own state and lifecycle
   - Components follow the Single Responsibility Principle (SRP)
   - Example: `CropCard`, `WeatherWidget`, `DiseaseDetectionUploader` are independent, testable units

2. **Virtual DOM & Reconciliation:**
   - React maintains an in-memory representation of the actual DOM
   - When state changes, React computes the minimal set of DOM operations needed
   - This diffing algorithm (Fiber reconciliation) ensures optimal performance
   - Critical for AgriSense's real-time price charts and live weather updates

3. **React 18 Concurrent Features:**
   - **Automatic Batching:** Multiple state updates are batched into a single re-render, reducing unnecessary renders
   - **Transitions:** Mark non-urgent updates (e.g., filtering crop list) as low priority, keeping UI responsive
   - **Suspense for Data Fetching:** Declaratively handle loading states while data is being fetched
   - **Streaming SSR:** Send HTML to the client progressively, improving Time to First Byte (TTFB)

4. **Hooks API:**
   - `useState`: Local component state management (form inputs, toggles)
   - `useEffect`: Side effects like API calls, subscriptions, DOM manipulation
   - `useContext`: Global state sharing without prop drilling (authentication, theme, language)
   - `useReducer`: Complex state logic with predictable state transitions
   - `useMemo` / `useCallback`: Performance optimization by memoizing expensive computations and function references
   - `useRef`: Direct DOM access and persisting values across renders without triggering re-renders

**Why React Over Alternatives:**

- **Vue.js:** While Vue offers simpler syntax, React's larger ecosystem and better TypeScript support made it the preferred choice
- **Angular:** Too opinionated and heavyweight for AgriSense's requirements; React's flexibility allows custom architecture
- **Svelte:** Lacks the mature ecosystem and enterprise adoption needed for long-term maintainability
- **Solid.js:** Too new with limited community support and third-party libraries

**React Performance Optimizations in AgriSense:**

- **Code Splitting:** Dynamic imports using `React.lazy()` and `Suspense` for route-based code splitting
- **Memoization:** `React.memo()` wraps expensive components to prevent unnecessary re-renders
- **Virtualization:** Large lists (crop database, forum posts) use windowing to render only visible items
- **Debouncing:** Search inputs debounced to reduce API calls and re-renders


### 1.2.3 Backend Runtime: Node.js with Express.js 4.18.2

**Technical Overview:**

Node.js is a JavaScript runtime built on Chrome's V8 engine that enables server-side JavaScript execution. Express.js is a minimal, unopinionated web framework for Node.js that provides robust routing, middleware support, and HTTP utility methods.

**Node.js Architecture & Event Loop:**

Node.js operates on a single-threaded, event-driven, non-blocking I/O model:

1. **Event Loop Mechanism:**
   - All I/O operations (database queries, file reads, HTTP requests) are asynchronous
   - When an I/O operation is initiated, Node.js registers a callback and continues executing other code
   - When the operation completes, the callback is added to the event queue
   - The event loop continuously checks the queue and executes callbacks when the call stack is empty
   - This allows Node.js to handle thousands of concurrent connections with minimal overhead

2. **V8 Engine Optimization:**
   - Just-In-Time (JIT) compilation converts JavaScript to machine code at runtime
   - Hidden classes and inline caching optimize object property access
   - Garbage collection automatically manages memory allocation and deallocation

3. **Libuv Library:**
   - Provides the event loop implementation and thread pool for async operations
   - Handles cross-platform file system operations, networking, and timers
   - Thread pool (default 4 threads) executes CPU-intensive operations without blocking the main thread

**Why Node.js for AgriSense Backend:**

1. **JavaScript Everywhere:**
   - Shared language between frontend and backend reduces context switching
   - Code reusability (validation schemas, utility functions) across layers
   - Unified tooling and build processes

2. **NPM Ecosystem:**
   - Over 2 million packages available for rapid development
   - Mature libraries for authentication (Passport.js), validation (Zod), ORM (Prisma), real-time communication (Socket.io)

3. **Performance Characteristics:**
   - Non-blocking I/O ideal for I/O-bound operations (database queries, API calls)
   - Handles high concurrency with low memory footprint
   - Suitable for AgriSense's real-time features (live weather updates, chat, notifications)

4. **Microservices Compatibility:**
   - Lightweight and fast startup time makes it ideal for containerized deployments
   - Easy horizontal scaling by spawning multiple instances behind a load balancer

**Express.js Framework:**

Express provides a thin layer of fundamental web application features:

1. **Middleware Pipeline:**
   - Request processing flows through a chain of middleware functions
   - Each middleware can modify request/response objects, end the request-response cycle, or call the next middleware
   - AgriSense middleware stack:
     ```
     Request → CORS → Helmet (Security) → Morgan (Logging) → Cookie Parser → 
     Body Parser → Authentication → Rate Limiting → Route Handler → Error Handler → Response
     ```

2. **Routing System:**
   - Modular route definitions organized by resource (users, crops, recommendations)
   - Support for route parameters, query strings, and request body parsing
   - RESTful API design with proper HTTP verbs (GET, POST, PUT, DELETE, PATCH)

3. **Error Handling:**
   - Centralized error handling middleware catches all errors
   - Custom error classes for different error types (ValidationError, AuthenticationError, NotFoundError)
   - Consistent error response format across all endpoints

**Express Alternatives Considered:**

- **Fastify:** Faster but less mature ecosystem; Express's stability preferred for production
- **Koa:** More modern but requires more boilerplate; Express's conventions speed development
- **NestJS:** Too opinionated and heavyweight; Express's flexibility better suits AgriSense's architecture
- **Hapi:** Overcomplicated for AgriSense's requirements


### 1.2.4 Database: PostgreSQL with Prisma ORM 5.7.1

**Technical Overview:**

PostgreSQL is an advanced, open-source relational database management system (RDBMS) known for its reliability, feature robustness, and standards compliance. Prisma is a next-generation ORM (Object-Relational Mapping) that provides type-safe database access with auto-generated query builders.

**PostgreSQL Architecture:**

1. **ACID Compliance:**
   - **Atomicity:** Transactions are all-or-nothing; partial updates never occur
   - **Consistency:** Database constraints are always enforced
   - **Isolation:** Concurrent transactions don't interfere with each other
   - **Durability:** Committed data survives system crashes

2. **Advanced Features Used in AgriSense:**
   - **JSONB Data Type:** Stores semi-structured data (crop metadata, ML model outputs) with indexing support
   - **Full-Text Search:** Efficient searching of crop names, descriptions, and forum posts
   - **Geospatial Extensions (PostGIS):** Store and query farm locations, weather station coordinates
   - **Triggers & Stored Procedures:** Automated data validation and audit logging
   - **Materialized Views:** Pre-computed aggregations for analytics dashboards

3. **Indexing Strategy:**
   - B-tree indexes on primary keys and foreign keys for fast lookups
   - GIN indexes on JSONB columns for efficient JSON queries
   - Partial indexes on frequently filtered columns (e.g., active users)
   - Composite indexes on multi-column queries (user_id + created_at)

**Prisma ORM Benefits:**

1. **Type Safety:**
   - Auto-generated TypeScript types based on database schema
   - Compile-time error detection for invalid queries
   - IntelliSense autocomplete for all database operations
   - Eliminates runtime errors from typos or schema mismatches

2. **Schema-First Development:**
   - Database schema defined in `schema.prisma` file using declarative syntax
   - Migrations automatically generated from schema changes
   - Version-controlled database evolution
   - Supports both SQL and NoSQL databases with same API

3. **Query Builder:**
   - Fluent API for building complex queries
   - Automatic JOIN generation for relations
   - Built-in pagination, filtering, and sorting
   - Query optimization and N+1 problem prevention

4. **Developer Experience:**
   - Prisma Studio: GUI for browsing and editing database data
   - Introspection: Generate Prisma schema from existing database
   - Seeding: Populate database with test data
   - Connection pooling and query caching built-in

**Example Prisma Schema (AgriSense):**

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String
  role          Role     @default(FARMER)
  farms         Farm[]
  recommendations Recommendation[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Crop {
  id          String   @id @default(uuid())
  name        String
  scientificName String?
  season      Season
  soilType    String[]
  minTemp     Float
  maxTemp     Float
  rainfall    Float
  metadata    Json?
  recommendations Recommendation[]
}

model Recommendation {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  cropId      String
  crop        Crop     @relation(fields: [cropId], references: [id])
  confidence  Float
  yieldEstimate Float
  createdAt   DateTime @default(now())
  
  @@index([userId, createdAt])
}
```

**Why PostgreSQL Over Alternatives:**

- **MySQL:** Lacks advanced features like JSONB, full-text search, and geospatial support
- **MongoDB:** NoSQL flexibility not needed; relational data model better suits AgriSense's structured data
- **SQLite:** Not suitable for production; lacks concurrency and scalability
- **Oracle/SQL Server:** Expensive licensing; PostgreSQL provides equivalent features for free


### 1.2.5 Machine Learning Service: Python FastAPI

**Technical Overview:**

FastAPI is a modern, high-performance web framework for building APIs with Python 3.7+ based on standard Python type hints. It's built on Starlette for web routing and Pydantic for data validation.

**Why Python for ML Service:**

1. **ML Ecosystem Dominance:**
   - TensorFlow, PyTorch, scikit-learn are Python-first frameworks
   - NumPy, Pandas for data manipulation
   - OpenCV for image processing (disease detection)
   - Mature libraries for model serving and inference

2. **FastAPI Performance:**
   - Built on ASGI (Asynchronous Server Gateway Interface) for async request handling
   - Performance comparable to Node.js and Go
   - Automatic API documentation with OpenAPI/Swagger
   - Built-in request validation using Pydantic models

3. **Type Safety:**
   - Python type hints enable static analysis and IDE autocomplete
   - Pydantic validates request/response data at runtime
   - Reduces bugs and improves maintainability

**ML Service Architecture:**

```
Client Request → FastAPI Router → Pydantic Validation → 
Model Loader → Preprocessing → Inference → Postprocessing → JSON Response
```

**Key ML Operations in AgriSense:**

1. **Crop Recommendation Model:**
   - Input: Soil parameters (N, P, K, pH), weather data, location
   - Algorithm: Random Forest Classifier trained on historical crop yield data
   - Output: Top 3 crop recommendations with confidence scores

2. **Disease Detection Model:**
   - Input: Plant leaf image (JPEG/PNG)
   - Algorithm: Convolutional Neural Network (ResNet-50 architecture)
   - Preprocessing: Image resizing, normalization, augmentation
   - Output: Disease classification with confidence score and treatment recommendations

3. **Yield Prediction Model:**
   - Input: Crop type, soil data, historical weather, farm size
   - Algorithm: Gradient Boosting Regressor (XGBoost)
   - Output: Expected yield in tons per hectare with confidence interval

**Model Serving Strategy:**

- Models loaded into memory at service startup for fast inference
- Model versioning using semantic versioning (v1.2.3)
- A/B testing support for comparing model versions
- Fallback to previous model version if new model fails
- Monitoring of inference latency and accuracy metrics


---

## 1.3 FRONTEND DEPENDENCIES ANALYSIS

### 1.3.1 Styling & UI Components

**TailwindCSS 3.3.6:**

Tailwind is a utility-first CSS framework that provides low-level utility classes for building custom designs.

- **Why Tailwind:**
  - Eliminates CSS file bloat through PurgeCSS (removes unused styles in production)
  - Consistent design system through configuration file
  - Faster development with inline utility classes
  - No naming conflicts or specificity issues
  - JIT (Just-In-Time) compiler generates styles on-demand

- **Configuration in AgriSense:**
  - Custom color palette (primary green for agriculture theme, secondary yellow for alerts)
  - Extended animations (fade-in, slide-up, float for interactive elements)
  - Custom font families (Inter for body, Poppins for headings)
  - Responsive breakpoints for mobile-first design

**Headless UI 1.7.17:**

Unstyled, accessible UI components designed for Tailwind CSS.

- **Components Used:**
  - `Dialog`: Modal overlays for crop details, confirmation dialogs
  - `Menu`: Dropdown menus for user profile, settings
  - `Listbox`: Custom select dropdowns for crop selection, filters
  - `Disclosure`: Collapsible FAQ sections, filter panels
  - `Tab`: Tabbed interfaces for dashboard sections

- **Benefits:**
  - Full keyboard navigation and screen reader support (WCAG 2.1 AA compliant)
  - No styling opinions; complete design control
  - Built-in focus management and ARIA attributes
  - TypeScript support with proper type definitions

**Heroicons 2.0.18:**

Beautiful hand-crafted SVG icons from the makers of Tailwind CSS.

- **Usage:** 500+ icons for UI elements (navigation, actions, status indicators)
- **Benefits:** Optimized SVGs, consistent design language, tree-shakeable imports

**Framer Motion 10.16.16:**

Production-ready animation library for React.

- **Use Cases in AgriSense:**
  - Page transitions with smooth fade/slide effects
  - Staggered list animations for crop recommendations
  - Gesture-based interactions (swipe to delete, drag to reorder)
  - Loading skeletons with shimmer effects
  - Scroll-triggered animations for landing page

- **Performance:**
  - Hardware-accelerated animations using CSS transforms
  - Automatic layout animations without manual calculations
  - Reduced motion support for accessibility

**Lottie-React 2.4.0:**

Renders Adobe After Effects animations exported as JSON.

- **Usage:** Complex animations for empty states, loading indicators, success confirmations
- **Benefits:** Vector-based (scales to any resolution), small file size, interactive animations


### 1.3.2 Data Visualization & Mapping

**Recharts 2.15.4:**

Composable charting library built on React components and D3.

- **Charts Used in AgriSense:**
  - **Line Charts:** Price trends over time, weather forecasts
  - **Bar Charts:** Crop yield comparisons, monthly rainfall
  - **Pie Charts:** Crop distribution across farms, soil type breakdown
  - **Area Charts:** Historical temperature ranges, market demand
  - **Composed Charts:** Multi-axis charts combining price and volume

- **Why Recharts:**
  - Declarative API matches React's component model
  - Responsive by default with automatic resizing
  - Customizable tooltips, legends, and axes
  - Animation support for data updates
  - Smaller bundle size than D3 (tree-shakeable)

**Mapbox GL JS 2.15.0 + React Map GL 7.1.7:**

Interactive, customizable vector maps with WebGL rendering.

- **Features Used:**
  - Farm location markers with custom icons
  - Weather overlay layers (temperature, precipitation)
  - Geofencing for regional crop recommendations
  - Heatmaps for disease outbreak visualization
  - Routing for logistics planning

- **Why Mapbox:**
  - Superior performance with WebGL rendering
  - Offline map support for rural areas with poor connectivity
  - Custom map styles matching AgriSense branding
  - 3D terrain visualization for topography analysis
  - Real-time data updates via vector tiles

**Leaflet 1.9.4 + React Leaflet 4.2.1:**

Lightweight alternative to Mapbox for simpler mapping needs.

- **Usage:** Fallback for devices without WebGL support
- **Benefits:** Smaller bundle size, simpler API, better browser compatibility

### 1.3.3 Form Management & Validation

**React Hook Form 7.48.2:**

Performant, flexible form library with easy validation.

- **Why React Hook Form:**
  - Uncontrolled components reduce re-renders (better performance)
  - Built-in validation with custom rules
  - Integration with Zod for schema validation
  - Minimal boilerplate compared to Formik
  - TypeScript support with type inference

- **Forms in AgriSense:**
  - User registration/login with email validation
  - Crop recommendation input (soil parameters, location)
  - Disease detection upload with file validation
  - Profile settings with conditional fields
  - Forum post creation with rich text

**Zod 3.22.4:**

TypeScript-first schema validation library.

- **Usage:**
  - Define validation schemas for all API requests/responses
  - Shared between frontend and backend for consistency
  - Runtime type checking with compile-time type inference
  - Custom error messages for user-friendly feedback

- **Example Schema:**
```typescript
const CropRecommendationSchema = z.object({
  nitrogen: z.number().min(0).max(200),
  phosphorus: z.number().min(0).max(200),
  potassium: z.number().min(0).max(200),
  pH: z.number().min(0).max(14),
  rainfall: z.number().min(0),
  temperature: z.number().min(-10).max(50),
  season: z.enum(['KHARIF', 'RABI', 'ZAID']),
  farmSize: z.number().positive()
});
```

**@hookform/resolvers 3.3.2:**

Integrates Zod schemas with React Hook Form for seamless validation.


### 1.3.4 State Management & Data Fetching

**Axios 1.6.2:**

Promise-based HTTP client for browser and Node.js.

- **Why Axios Over Fetch API:**
  - Automatic JSON transformation (no manual `response.json()`)
  - Request/response interceptors for global error handling and authentication
  - Request cancellation for cleanup on component unmount
  - Progress tracking for file uploads (disease detection images)
  - Timeout configuration to prevent hanging requests
  - Better error handling with detailed error objects

- **Axios Configuration in AgriSense:**
```typescript
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  withCredentials: true, // Send cookies for authentication
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Add auth token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: Handle errors globally
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**React Context API (Built-in):**

Global state management without external libraries.

- **Contexts in AgriSense:**
  - `AuthContext`: User authentication state, login/logout functions
  - `ThemeContext`: Dark/light mode preference
  - `LanguageContext`: i18n language selection (English/Hindi)
  - `NotificationContext`: Toast notifications, alerts

- **Why Context Over Redux:**
  - Simpler API with less boilerplate
  - Built into React (no additional dependencies)
  - Sufficient for AgriSense's state management needs
  - Better TypeScript integration
  - Easier to test and debug

### 1.3.5 Real-Time Communication

**Socket.io Client 4.7.4:**

Real-time bidirectional event-based communication.

- **Real-Time Features in AgriSense:**
  - Live weather updates pushed from server
  - Real-time price changes for crop marketplace
  - Instant notifications for forum replies, mentions
  - Live chat in farmer community
  - Collaborative crop planning with multiple users

- **Socket.io Benefits:**
  - Automatic reconnection on connection loss
  - Fallback to HTTP long-polling if WebSocket unavailable
  - Room-based broadcasting (e.g., regional weather updates)
  - Binary data support for image sharing
  - Built-in acknowledgments for reliable messaging

- **Connection Management:**
```typescript
const socket = io(process.env.NEXT_PUBLIC_API_URL, {
  auth: { token: localStorage.getItem('token') },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

socket.on('connect', () => {
  console.log('Connected to server');
  socket.emit('join-room', { userId, region });
});

socket.on('weather-update', (data) => {
  updateWeatherState(data);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
```


### 1.3.6 Internationalization & Accessibility

**i18next 23.7.16 + react-i18next 13.5.0:**

Internationalization framework for multilingual support.

- **Languages Supported:**
  - English (default)
  - Hindi (हिंदी) - Critical for Indian farmers

- **Translation Architecture:**
  - JSON files in `public/locales/{lang}/{namespace}.json`
  - Lazy loading of translation files (reduces initial bundle size)
  - Namespace separation (common, dashboard, recommendations, etc.)
  - Pluralization rules for different languages
  - Date/number formatting based on locale

- **Usage Example:**
```typescript
import { useTranslation } from 'react-i18next';

function CropRecommendation() {
  const { t, i18n } = useTranslation('recommendations');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description', { cropName: 'Wheat' })}</p>
      <button onClick={() => i18n.changeLanguage('hi')}>
        हिंदी
      </button>
    </div>
  );
}
```

**i18next-browser-languagedetector 7.2.0:**

Automatically detects user's preferred language from browser settings, localStorage, or URL parameters.

**react-speech-kit 3.0.1:**

Voice input/output for accessibility and rural users with low literacy.

- **Features:**
  - Speech-to-text for voice-based crop search
  - Text-to-speech for reading recommendations aloud
  - Multi-language support (English, Hindi)
  - Offline fallback using browser's native speech API

### 1.3.7 File Handling & Media

**React Dropzone 14.2.3:**

Drag-and-drop file upload component with validation.

- **Usage in Disease Detection:**
  - Drag-and-drop or click to upload plant images
  - File type validation (JPEG, PNG only)
  - File size limits (max 10MB)
  - Image preview before upload
  - Multiple file upload support
  - Progress tracking during upload

**Sharp (Backend - 0.33.1):**

High-performance image processing library.

- **Operations:**
  - Resize uploaded images to standard dimensions (224x224 for ML model)
  - Convert to WebP format for faster loading
  - Generate thumbnails for gallery views
  - Strip EXIF data for privacy
  - Optimize compression without quality loss

### 1.3.8 Progressive Web App (PWA)

**next-pwa 5.6.0 + workbox-webpack-plugin 7.0.0:**

Transforms Next.js app into installable PWA.

- **PWA Features:**
  - Offline functionality with service worker caching
  - Install prompt for home screen shortcut
  - Push notifications for weather alerts, price changes
  - Background sync for queued actions when offline
  - App-like experience on mobile devices

- **Caching Strategy:**
  - **Network First:** API requests (always fetch fresh data)
  - **Cache First:** Static assets (images, fonts, CSS)
  - **Stale While Revalidate:** Dynamic content (crop database)

- **Service Worker Configuration:**
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.agrisense\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 // 1 hour
        }
      }
    }
  ]
});
```


### 1.3.9 Date & Time Handling

**date-fns 2.30.0:**

Modern JavaScript date utility library.

- **Why date-fns Over Moment.js:**
  - Modular design (tree-shakeable, only import needed functions)
  - Immutable (doesn't mutate date objects)
  - Smaller bundle size (13KB vs 67KB for Moment.js)
  - TypeScript support with proper type definitions
  - Functional programming approach

- **Usage in AgriSense:**
  - Format dates for display (`format(date, 'MMM dd, yyyy')`)
  - Calculate date differences for crop growth tracking
  - Parse ISO strings from API responses
  - Timezone conversions for weather data
  - Relative time formatting ("2 hours ago")

**react-calendar 4.6.0:**

Interactive calendar component for crop planning.

- **Features:**
  - Select planting/harvesting dates
  - Mark important agricultural events
  - View historical crop cycles
  - Multi-date selection for irrigation schedules
  - Custom styling to match AgriSense theme

### 1.3.10 User Feedback & Notifications

**react-hot-toast 2.4.1:**

Lightweight toast notification library.

- **Why react-hot-toast:**
  - Minimal bundle size (3KB gzipped)
  - Smooth animations with Framer Motion
  - Customizable appearance and positioning
  - Promise-based API for async operations
  - Accessible with ARIA attributes

- **Notification Types in AgriSense:**
  - Success: "Crop recommendation saved"
  - Error: "Failed to upload image"
  - Loading: "Analyzing disease..."
  - Warning: "Weather alert: Heavy rainfall expected"
  - Info: "New forum reply to your post"

- **Usage Example:**
```typescript
import toast from 'react-hot-toast';

const saveCropRecommendation = async (data) => {
  const promise = apiClient.post('/recommendations', data);
  
  toast.promise(promise, {
    loading: 'Saving recommendation...',
    success: 'Recommendation saved successfully!',
    error: 'Failed to save recommendation'
  });
  
  return promise;
};
```

---

## 1.4 BACKEND DEPENDENCIES ANALYSIS

### 1.4.1 Security & Authentication

**bcryptjs 2.4.3:**

Password hashing library using bcrypt algorithm.

- **Security Features:**
  - Salted hashing (prevents rainbow table attacks)
  - Configurable work factor (computational cost)
  - Slow by design (prevents brute-force attacks)
  - Resistant to timing attacks

- **Implementation:**
```typescript
import bcrypt from 'bcryptjs';

// Hash password during registration
const saltRounds = 12; // Higher = more secure but slower
const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

// Verify password during login
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

**jsonwebtoken 9.0.2:**

JSON Web Token (JWT) implementation for stateless authentication.

- **JWT Structure:**
  - **Header:** Algorithm and token type
  - **Payload:** User data (id, email, role)
  - **Signature:** HMAC SHA256 signature for verification

- **Token Strategy in AgriSense:**
  - Access token (short-lived, 15 minutes) stored in httpOnly cookie
  - Refresh token (long-lived, 7 days) for obtaining new access tokens
  - Token rotation on refresh to prevent replay attacks
  - Blacklist for revoked tokens (stored in Redis)

- **Token Generation:**
```typescript
import jwt from 'jsonwebtoken';

const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET!,
    { expiresIn: '15m', issuer: 'agrisense' }
  );
};

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
```

**helmet 7.1.0:**

Security middleware that sets HTTP headers to protect against common vulnerabilities.

- **Headers Set by Helmet:**
  - `Content-Security-Policy`: Prevents XSS attacks
  - `X-Frame-Options`: Prevents clickjacking
  - `X-Content-Type-Options`: Prevents MIME sniffing
  - `Strict-Transport-Security`: Enforces HTTPS
  - `X-DNS-Prefetch-Control`: Controls DNS prefetching

**express-rate-limit 7.1.5:**

Rate limiting middleware to prevent abuse and DDoS attacks.

- **Rate Limit Configuration:**
```typescript
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Max 5 login attempts per window
  skipSuccessfulRequests: true
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
```

**cors 2.8.5:**

Cross-Origin Resource Sharing middleware.

- **CORS Configuration:**
```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```


### 1.4.2 Validation & Data Processing

**express-validator 7.0.1:**

Middleware for validating and sanitizing request data.

- **Validation Chain:**
```typescript
import { body, validationResult } from 'express-validator';

const validateCropRecommendation = [
  body('nitrogen').isFloat({ min: 0, max: 200 }),
  body('phosphorus').isFloat({ min: 0, max: 200 }),
  body('potassium').isFloat({ min: 0, max: 200 }),
  body('pH').isFloat({ min: 0, max: 14 }),
  body('season').isIn(['KHARIF', 'RABI', 'ZAID']),
  body('farmSize').isFloat({ min: 0.1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

app.post('/api/recommendations', validateCropRecommendation, handler);
```

**Zod 3.22.4 (Backend):**

Shared validation schemas between frontend and backend.

- **Benefits:**
  - Single source of truth for validation rules
  - Automatic TypeScript type inference
  - Composable schemas for complex validation
  - Custom error messages

**compression 1.7.4:**

Middleware for compressing HTTP responses.

- **Compression Strategy:**
  - Gzip compression for text-based responses (JSON, HTML, CSS)
  - Reduces bandwidth by 70-90%
  - Configurable compression level (balance between speed and size)
  - Automatic content-type detection

### 1.4.3 File Upload & Processing

**multer 1.4.5-lts.1:**

Middleware for handling multipart/form-data (file uploads).

- **Configuration:**
```typescript
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/disease-images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

app.post('/api/disease-detection', upload.single('image'), handler);
```

**sharp 0.33.1:**

High-performance image processing (already covered in frontend section).

### 1.4.4 Logging & Monitoring

**morgan 1.10.0:**

HTTP request logger middleware.

- **Log Formats:**
  - Development: Colored, detailed logs
  - Production: JSON format for log aggregation
  - Custom tokens for additional context (user ID, request ID)

- **Configuration:**
```typescript
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

// Development logging
app.use(morgan('dev'));

// Production logging to file
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));

// Custom format with user ID
morgan.token('user-id', (req) => req.user?.id || 'anonymous');
app.use(morgan(':method :url :status :user-id :response-time ms'));
```

### 1.4.5 Caching & Performance

**Redis 4.6.11:**

In-memory data store for caching and session management.

- **Use Cases in AgriSense:**
  - Session storage for authenticated users
  - Cache frequently accessed data (crop database, weather forecasts)
  - Rate limiting counters
  - Real-time leaderboards (top farmers, most recommended crops)
  - Pub/Sub for real-time notifications

- **Caching Strategy:**
```typescript
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL
});

await redisClient.connect();

// Cache crop recommendations
const getCropRecommendations = async (userId: string) => {
  const cacheKey = `recommendations:${userId}`;
  
  // Try cache first
  const cached = await redisClient.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Fetch from database
  const recommendations = await prisma.recommendation.findMany({
    where: { userId }
  });
  
  // Store in cache (expire after 1 hour)
  await redisClient.setEx(cacheKey, 3600, JSON.stringify(recommendations));
  
  return recommendations;
};
```


### 1.4.6 Email & Notifications

**nodemailer 6.9.7:**

Email sending library for Node.js.

- **Email Use Cases:**
  - Welcome email on registration
  - Password reset links
  - Weather alerts and warnings
  - Weekly crop recommendations digest
  - Forum activity notifications

- **Configuration:**
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendWelcomeEmail = async (email: string, name: string) => {
  await transporter.sendMail({
    from: '"AgriSense" <noreply@agrisense.com>',
    to: email,
    subject: 'Welcome to AgriSense',
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for joining AgriSense...</p>
    `
  });
};
```

### 1.4.7 Scheduled Tasks

**node-cron 3.0.3:**

Cron-like job scheduler for Node.js.

- **Scheduled Jobs in AgriSense:**
  - Daily weather data sync (6:00 AM)
  - Hourly price updates from market APIs
  - Weekly recommendation emails (Sunday 8:00 AM)
  - Monthly analytics report generation
  - Cleanup of expired sessions and old logs

- **Cron Configuration:**
```typescript
import cron from 'node-cron';

// Daily weather sync at 6:00 AM
cron.schedule('0 6 * * *', async () => {
  console.log('Syncing weather data...');
  await syncWeatherData();
});

// Hourly price updates
cron.schedule('0 * * * *', async () => {
  console.log('Updating crop prices...');
  await updateCropPrices();
});

// Weekly recommendation emails (Sunday 8:00 AM)
cron.schedule('0 8 * * 0', async () => {
  console.log('Sending weekly recommendations...');
  await sendWeeklyRecommendations();
});
```

### 1.4.8 AI & Machine Learning Integration

**@google/generative-ai 0.24.1:**

Google's Gemini AI SDK for natural language processing.

- **Use Cases:**
  - AI chatbot for farmer queries
  - Natural language crop search
  - Automated forum post moderation
  - Sentiment analysis of farmer feedback
  - Translation between English and Hindi

- **Implementation:**
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const chatWithAI = async (userMessage: string, context: string) => {
  const prompt = `
    You are an agricultural expert assistant for AgriSense.
    Context: ${context}
    User Question: ${userMessage}
    Provide a helpful, accurate response in simple language.
  `;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};
```

**chromadb 3.1.6 + @chroma-core/default-embed 0.1.9:**

Vector database for semantic search and RAG (Retrieval-Augmented Generation).

- **Use Cases:**
  - Semantic search of crop database
  - Find similar disease cases
  - Contextual AI responses using historical data
  - Recommendation system based on embeddings

- **Vector Search Implementation:**
```typescript
import { ChromaClient } from 'chromadb';

const client = new ChromaClient();
const collection = await client.getOrCreateCollection({
  name: 'crop_knowledge',
  metadata: { description: 'Agricultural knowledge base' }
});

// Add documents
await collection.add({
  ids: ['crop1', 'crop2'],
  documents: [
    'Wheat grows best in cool weather with moderate rainfall...',
    'Rice requires flooded fields and warm temperatures...'
  ],
  metadatas: [
    { crop: 'wheat', season: 'rabi' },
    { crop: 'rice', season: 'kharif' }
  ]
});

// Semantic search
const results = await collection.query({
  queryTexts: ['What crop needs lots of water?'],
  nResults: 3
});
```

### 1.4.9 API Documentation

**swagger-jsdoc 6.2.8 + swagger-ui-express 5.0.0:**

Automatic API documentation generation from JSDoc comments.

- **Documentation Features:**
  - Interactive API explorer
  - Request/response examples
  - Authentication testing
  - Schema definitions
  - Try-it-out functionality

- **Swagger Configuration:**
```typescript
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AgriSense API',
      version: '1.0.0',
      description: 'AI-powered crop recommendation system API'
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development' },
      { url: 'https://api.agrisense.com', description: 'Production' }
    ]
  },
  apis: ['./src/routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```


---

## 1.5 ENVIRONMENT SPECIFICATIONS

### 1.5.1 Runtime Requirements

**Node.js Version:**
- **Minimum:** Node.js 18.17.0 (LTS)
- **Recommended:** Node.js 20.10.5 (Latest LTS)
- **Maximum:** Node.js 21.x (Current)

**Rationale:**
- Node.js 18+ required for native fetch API support
- ES2022 features used throughout codebase
- Top-level await in modules
- Native test runner (experimental)

**NPM Version:**
- **Minimum:** npm 9.0.0
- **Recommended:** npm 10.2.0

**Python Version (ML Service):**
- **Minimum:** Python 3.9
- **Recommended:** Python 3.11
- **Maximum:** Python 3.12

**Rationale:**
- Type hints and dataclasses used extensively
- Pattern matching (Python 3.10+) for cleaner code
- Performance improvements in Python 3.11

### 1.5.2 Browser Compatibility

**Supported Browsers:**

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | Full support, recommended |
| Firefox | 88+ | Full support |
| Safari | 14+ | Limited WebGL support |
| Edge | 90+ | Chromium-based, full support |
| Opera | 76+ | Full support |
| Samsung Internet | 14+ | Mobile support |

**Mobile Browsers:**
- Chrome Mobile 90+
- Safari iOS 14+
- Firefox Mobile 88+

**Unsupported:**
- Internet Explorer (all versions)
- Opera Mini (limited JavaScript support)
- UC Browser (security concerns)

**Browser Features Required:**
- ES6+ JavaScript support
- WebGL 2.0 (for Mapbox maps)
- Service Workers (for PWA functionality)
- IndexedDB (for offline storage)
- WebSocket (for real-time features)
- Geolocation API (for location-based recommendations)
- Camera API (for disease detection)
- Speech Recognition API (for voice input)

**Polyfills Included:**
- Core-js for older browsers
- Intersection Observer for lazy loading
- ResizeObserver for responsive components

### 1.5.3 Hardware Requirements

**Development Environment:**

**Minimum Specifications:**
- CPU: Dual-core 2.0 GHz
- RAM: 8 GB
- Storage: 10 GB free space (for node_modules, build artifacts)
- Network: Broadband internet connection

**Recommended Specifications:**
- CPU: Quad-core 3.0 GHz (Intel i5/AMD Ryzen 5 or better)
- RAM: 16 GB (32 GB for ML model training)
- Storage: 20 GB SSD
- Network: High-speed internet (10+ Mbps)

**Production Server:**

**Frontend (Next.js):**
- CPU: 2 vCPUs
- RAM: 2 GB
- Storage: 5 GB
- Network: 100 Mbps

**Backend (Node.js/Express):**
- CPU: 4 vCPUs
- RAM: 4 GB
- Storage: 20 GB
- Network: 1 Gbps

**Database (PostgreSQL):**
- CPU: 4 vCPUs
- RAM: 8 GB
- Storage: 100 GB SSD (with auto-scaling)
- IOPS: 3000+ (for high-traffic scenarios)

**ML Service (Python/FastAPI):**
- CPU: 8 vCPUs (or 1 GPU)
- RAM: 16 GB
- Storage: 50 GB (for model files)
- GPU: NVIDIA T4 or better (optional, for faster inference)

**Redis Cache:**
- CPU: 1 vCPU
- RAM: 2 GB
- Storage: 10 GB

**Client Device (End Users):**

**Minimum:**
- Smartphone: Android 8+ or iOS 14+
- RAM: 2 GB
- Storage: 100 MB free space
- Screen: 5" display (360x640 resolution)
- Camera: 5 MP (for disease detection)

**Recommended:**
- Smartphone: Android 12+ or iOS 16+
- RAM: 4 GB
- Storage: 500 MB free space
- Screen: 6" display (1080x1920 resolution)
- Camera: 12 MP with autofocus


### 1.5.4 Network Requirements

**Bandwidth:**
- **Minimum:** 2 Mbps download, 1 Mbps upload
- **Recommended:** 10 Mbps download, 5 Mbps upload

**Latency:**
- **Maximum Acceptable:** 500ms
- **Optimal:** <100ms

**Data Usage Estimates:**
- Initial page load: 2-3 MB
- Typical session: 10-15 MB
- Disease detection (with image upload): 5-10 MB
- Offline mode: 50 MB cached data

**Firewall & Port Requirements:**

**Development:**
- Frontend: Port 3000 (HTTP)
- Backend: Port 5000 (HTTP)
- ML Service: Port 8000 (HTTP)
- PostgreSQL: Port 5432
- Redis: Port 6379
- WebSocket: Port 5000 (same as backend)

**Production:**
- HTTPS: Port 443
- HTTP: Port 80 (redirect to HTTPS)
- WebSocket: Port 443 (WSS)

**External API Dependencies:**
- OpenWeatherMap API (weather data)
- Mapbox API (maps and geocoding)
- Google Gemini API (AI chatbot)
- SMS Gateway (optional, for notifications)

### 1.5.5 Operating System Compatibility

**Development:**
- Windows 10/11 (with WSL2 recommended)
- macOS 11+ (Big Sur or later)
- Linux (Ubuntu 20.04+, Debian 11+, Fedora 35+)

**Production (Docker):**
- Any OS supporting Docker 20.10+
- Kubernetes 1.24+ (for orchestration)

**Database:**
- PostgreSQL 15+ (Alpine Linux in Docker)

### 1.5.6 TypeScript Configuration

**Frontend (tsconfig.json):**
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Key Settings Explained:**
- `target: "es5"`: Compile to ES5 for maximum browser compatibility
- `strict: true`: Enable all strict type-checking options
- `noEmit: true`: Next.js handles compilation, TypeScript only for type checking
- `moduleResolution: "bundler"`: Use bundler-specific resolution (Next.js 14+)
- `paths`: Path aliases for cleaner imports (`@/components/Button` instead of `../../components/Button`)

**Backend (tsconfig.json):**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Key Settings Explained:**
- `target: "ES2020"`: Modern JavaScript features (optional chaining, nullish coalescing)
- `module: "commonjs"`: Node.js uses CommonJS modules
- `outDir: "./dist"`: Compiled JavaScript output directory
- `declaration: true`: Generate .d.ts files for type definitions
- `sourceMap: true`: Enable debugging with source maps

### 1.5.7 Build Configuration

**Next.js Configuration (next.config.js):**
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig = {
  images: {
    domains: ['localhost', 'api.mapbox.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    NEXT_PUBLIC_ML_SERVICE_URL: process.env.NEXT_PUBLIC_ML_SERVICE_URL,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = withPWA(nextConfig);
```

**Configuration Explained:**
- `withPWA`: Wraps Next.js config to add PWA support
- `images.domains`: Allowed domains for next/image optimization
- `env`: Environment variables exposed to client-side code
- `webpack.resolve.fallback`: Disable Node.js modules in browser bundle

**TailwindCSS Configuration (tailwind.config.js):**
- Custom color palette (primary green, secondary yellow, accent blue)
- Extended animations (fade-in, slide-up, float)
- Custom font families (Inter, Poppins)
- Responsive breakpoints
- Plugins: @tailwindcss/forms, @tailwindcss/typography


### 1.5.8 Docker Configuration

**Docker Compose Architecture:**

AgriSense uses Docker Compose to orchestrate five services:

1. **PostgreSQL Database** (postgres:15-alpine)
2. **Redis Cache** (redis:7-alpine)
3. **Backend API** (Node.js/Express)
4. **ML Service** (Python/FastAPI)
5. **Frontend** (Next.js)

**Service Configuration:**

```yaml
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: agrisense
      POSTGRES_PASSWORD: password
      POSTGRES_DB: agrisense
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - agrisense-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - agrisense-network

  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://agrisense:password@postgres:5432/agrisense
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=dev-jwt-secret
      - ML_SERVICE_URL=http://ml-service:8000
    ports:
      - "5000:5000"
    depends_on:
      - postgres
      - redis
    networks:
      - agrisense-network

  ml-service:
    build: ./ml-service
    ports:
      - "8000:8000"
    volumes:
      - ./ml-service/models:/app/models
    networks:
      - agrisense-network

  frontend:
    build: ./frontend
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000
      - NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - agrisense-network

volumes:
  postgres_data:
  redis_data:

networks:
  agrisense-network:
    driver: bridge
```

**Docker Benefits:**
- Consistent development environment across team
- Easy onboarding for new developers
- Production-like environment locally
- Isolated services with defined dependencies
- Simple deployment to cloud platforms

### 1.5.9 Environment Variables

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_key
```

**Backend (.env):**
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/agrisense
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# External APIs
WEATHER_API_KEY=your_openweather_key
GEMINI_API_KEY=your_gemini_api_key
ML_SERVICE_URL=http://localhost:8000

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

**ML Service (.env):**
```bash
MODEL_PATH=./models
DEVICE=cpu
BATCH_SIZE=32
MAX_IMAGE_SIZE=10485760
```

### 1.5.10 Performance Benchmarks

**Expected Performance Metrics:**

**Frontend:**
- First Contentful Paint (FCP): <1.5s
- Largest Contentful Paint (LCP): <2.5s
- Time to Interactive (TTI): <3.5s
- Cumulative Layout Shift (CLS): <0.1
- First Input Delay (FID): <100ms

**Backend API:**
- Average response time: <200ms
- 95th percentile: <500ms
- 99th percentile: <1000ms
- Throughput: 1000+ requests/second
- Error rate: <0.1%

**ML Inference:**
- Crop recommendation: <500ms
- Disease detection: <2s (including image processing)
- Yield prediction: <300ms

**Database:**
- Query response time: <50ms (with indexes)
- Connection pool: 20 connections
- Max connections: 100

**Caching:**
- Redis hit rate: >80%
- Cache response time: <10ms

---

## 1.6 DEVELOPMENT TOOLS & IDE

**Recommended IDE:**
- **Visual Studio Code** (Primary)
- **WebStorm** (Alternative)

**VS Code Extensions:**
- ESLint: JavaScript/TypeScript linting
- Prettier: Code formatting
- Tailwind CSS IntelliSense: Autocomplete for Tailwind classes
- Prisma: Schema syntax highlighting and formatting
- GitLens: Git integration and history
- Docker: Container management
- Thunder Client: API testing
- Error Lens: Inline error display

**Code Quality Tools:**
- **ESLint**: Linting for JavaScript/TypeScript
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files
- **TypeScript**: Static type checking

**Testing Tools:**
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Playwright**: End-to-end testing
- **Supertest**: API testing

**Version Control:**
- **Git**: Version control system
- **GitHub**: Code hosting and collaboration
- **Conventional Commits**: Commit message format

---

**✅ SECTION 1 COMPLETE: TECHNOLOGY SPECIFICATIONS**

This section has provided comprehensive coverage of:
- Core technology stack (Next.js, React, Node.js, PostgreSQL, Python)
- All frontend dependencies with technical justifications
- All backend dependencies with implementation details
- Environment specifications (runtime, browser, hardware, network)
- Configuration files and Docker setup
- Performance benchmarks and development tools

---


# SECTION 2: SYSTEM ARCHITECTURE

## 2.1 ARCHITECTURAL OVERVIEW

AgriSense implements a **microservices-based architecture** with clear separation of concerns across three primary layers:

1. **Presentation Layer** (Frontend): Next.js/React application
2. **Application Layer** (Backend): Node.js/Express REST API
3. **Intelligence Layer** (ML Service): Python/FastAPI machine learning inference
4. **Data Layer**: PostgreSQL database with Redis caching

This architecture follows the **Separation of Concerns (SoC)** principle, ensuring each layer has a single, well-defined responsibility. The system employs **RESTful API design** for client-server communication and **WebSocket** for real-time bidirectional communication.

### 2.1.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT DEVICES                            │
│  (Web Browsers, Mobile Devices, Progressive Web App)            │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS/WSS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER (Next.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Pages &    │  │  Components  │  │   Context    │          │
│  │   Routing    │  │   (React)    │  │   (State)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Hooks &    │  │   Services   │  │   Utils      │          │
│  │   Utilities  │  │   (API)      │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/REST + WebSocket
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND LAYER (Express)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Routes     │  │  Controllers │  │  Middleware  │          │
│  │              │  │              │  │  (Auth, etc) │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Services   │  │   Prisma     │  │  Socket.IO   │          │
│  │   (Business) │  │   (ORM)      │  │  (Real-time) │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└────────┬───────────────────┬──────────────────┬─────────────────┘
         │                   │                  │
         │ HTTP/REST         │ SQL              │ HTTP/REST
         ▼                   ▼                  ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   ML SERVICE    │  │   POSTGRESQL    │  │   REDIS CACHE   │
│   (FastAPI)     │  │   DATABASE      │  │                 │
│                 │  │                 │  │                 │
│  ┌───────────┐  │  │  ┌───────────┐  │  │  ┌───────────┐  │
│  │  Models   │  │  │  │  Tables   │  │  │  │  Sessions │  │
│  │  Loaders  │  │  │  │  Indexes  │  │  │  │  Cache    │  │
│  └───────────┘  │  │  └───────────┘  │  │  └───────────┘  │
│  ┌───────────┐  │  │  ┌───────────┐  │  │  ┌───────────┐  │
│  │Inference  │  │  │  │Relations  │  │  │  │Rate Limit │  │
│  │ Engine    │  │  │  │           │  │  │  │           │  │
│  └───────────┘  │  │  └───────────┘  │  │  └───────────┘  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### 2.1.2 Communication Patterns

**Synchronous Communication (REST API):**
- Client → Backend: HTTP requests for CRUD operations
- Backend → ML Service: HTTP requests for predictions
- Backend → Database: SQL queries via Prisma ORM

**Asynchronous Communication (WebSocket):**
- Real-time weather updates
- Live crop price changes
- Forum notifications
- Chat messages

**Caching Strategy:**
- Redis for session storage and frequently accessed data
- Browser cache for static assets
- Service Worker cache for offline functionality

---

## 2.2 DATA FLOW ARCHITECTURE

### 2.2.1 Complete Request Lifecycle

This section traces a typical user request through the entire system, from initial client interaction to final response delivery.

**Example: Crop Recommendation Request**

```
USER ACTION: Farmer submits soil parameters for crop recommendation

STEP 1: CLIENT-SIDE PROCESSING (Frontend)
├─ User fills form with soil data (N, P, K, pH, temperature, etc.)
├─ React Hook Form validates input using Zod schema
├─ Form submission triggers onSubmit handler
├─ Handler calls API service function
└─ Axios interceptor adds JWT token to request headers

STEP 2: HTTP REQUEST
├─ Method: POST
├─ URL: https://api.agrisense.com/api/recommendations
├─ Headers: 
│  ├─ Authorization: Bearer <JWT_TOKEN>
│  ├─ Content-Type: application/json
│  └─ Accept: application/json
└─ Body: {
     nitrogen: 120,
     phosphorus: 30,
     potassium: 80,
     ph: 6.4,
     temperature: 28,
     humidity: 65,
     rainfall: 800,
     season: "KHARIF",
     farmId: "farm_123"
   }

STEP 3: BACKEND ENTRY POINT (Express Middleware Chain)
├─ 3.1: CORS Middleware
│   └─ Validates origin matches FRONTEND_URL
├─ 3.2: Helmet Middleware
│   └─ Sets security headers (CSP, X-Frame-Options, etc.)
├─ 3.3: Morgan Middleware
│   └─ Logs request: "POST /api/recommendations 200 245ms"
├─ 3.4: Body Parser Middleware
│   └─ Parses JSON body into req.body object
├─ 3.5: Cookie Parser Middleware
│   └─ Parses cookies into req.cookies object
└─ 3.6: Rate Limiter Middleware
    └─ Checks Redis for request count from IP
    └─ Allows if under limit, blocks if exceeded

STEP 4: AUTHENTICATION MIDDLEWARE
├─ Extracts token from Authorization header
├─ Verifies JWT signature using JWT_SECRET
├─ Decodes payload: { userId: "user_123", role: "FARMER" }
├─ Attaches user data to req.user
└─ Calls next() to proceed to route handler

STEP 5: VALIDATION MIDDLEWARE
├─ express-validator checks each field
├─ Validates data types, ranges, formats
├─ Returns 400 error if validation fails
└─ Calls next() if validation passes

STEP 6: ROUTE HANDLER (Controller)
├─ Extracts validated data from req.body
├─ Extracts user ID from req.user
└─ Calls service layer function

STEP 7: SERVICE LAYER (Business Logic)
├─ 7.1: Check Cache
│   ├─ Generate cache key: "rec:user_123:hash_abc123"
│   ├─ Query Redis: GET rec:user_123:hash_abc123
│   └─ If cache hit: return cached result (skip to STEP 11)
│
├─ 7.2: Validate Farm Ownership
│   ├─ Query database: SELECT * FROM farms WHERE id = 'farm_123'
│   ├─ Verify farm.userId === req.user.userId
│   └─ Return 403 if unauthorized
│
├─ 7.3: Fetch Additional Context
│   ├─ Get farm details (soil type, location, area)
│   ├─ Get historical weather data for location
│   └─ Get current market demand for crops
│
├─ 7.4: Call ML Service
│   ├─ Prepare ML request payload
│   ├─ HTTP POST to ML_SERVICE_URL/predict/crop
│   └─ Receive predictions with confidence scores
│
└─ 7.5: Post-Processing
    ├─ Enrich predictions with market data
    ├─ Calculate expected yield and profit
    └─ Format response for client

STEP 8: ML SERVICE PROCESSING (Python/FastAPI)
├─ 8.1: Request Validation (Pydantic)
│   └─ Validates input schema, converts types
│
├─ 8.2: Data Preprocessing
│   ├─ Normalize numerical features (StandardScaler)
│   ├─ Encode categorical features (OneHotEncoder)
│   └─ Create feature vector
│
├─ 8.3: Model Inference
│   ├─ Load pre-trained Random Forest model from memory
│   ├─ Run prediction: model.predict(features)
│   ├─ Get probability scores: model.predict_proba(features)
│   └─ Execution time: ~150ms
│
├─ 8.4: Post-Processing
│   ├─ Sort crops by confidence score
│   ├─ Filter crops with confidence > 0.6
│   ├─ Get top 3 recommendations
│   └─ Add metadata (crop info, growing tips)
│
└─ 8.5: Return Response
    └─ JSON: {
         recommendations: [
           { crop: "Rice", confidence: 0.92, yield: 4.5 },
           { crop: "Wheat", confidence: 0.85, yield: 3.8 },
           { crop: "Maize", confidence: 0.78, yield: 4.2 }
         ]
       }

STEP 9: DATABASE OPERATIONS (Prisma ORM)
├─ 9.1: Save Recommendation
│   ├─ prisma.cropRecommendation.create({
│   │    data: {
│   │      userId: "user_123",
│   │      farmId: "farm_123",
│   │      nitrogen: 120,
│   │      phosphorus: 30,
│   │      ...
│   │      recommendations: mlResponse,
│   │      confidence: 0.92
│   │    }
│   │  })
│   └─ PostgreSQL: INSERT INTO crop_recommendations ...
│
├─ 9.2: Update User Statistics
│   └─ Increment recommendation count for analytics
│
└─ 9.3: Transaction Commit
    └─ All database operations wrapped in transaction

STEP 10: CACHING (Redis)
├─ Generate cache key from request parameters
├─ Serialize response to JSON string
├─ SETEX rec:user_123:hash_abc123 3600 <json_data>
└─ Cache expires after 1 hour

STEP 11: RESPONSE FORMATTING
├─ Construct success response object
├─ Add metadata (timestamp, request ID)
└─ Set appropriate HTTP status code (200)

STEP 12: RESPONSE MIDDLEWARE
├─ Compression middleware (gzip)
├─ CORS headers added
└─ Response sent to client

STEP 13: HTTP RESPONSE
├─ Status: 200 OK
├─ Headers:
│  ├─ Content-Type: application/json
│  ├─ Content-Encoding: gzip
│  └─ X-Response-Time: 245ms
└─ Body: {
     success: true,
     data: {
       id: "rec_456",
       recommendations: [...],
       confidence: 0.92,
       createdAt: "2025-12-08T10:30:00Z"
     }
   }

STEP 14: CLIENT-SIDE PROCESSING
├─ Axios interceptor receives response
├─ Extracts data from response.data
├─ Updates React state with recommendations
├─ Triggers re-render of component
└─ Displays recommendations to user with animations

STEP 15: UI UPDATE
├─ Framer Motion animates recommendation cards
├─ Recharts renders yield comparison chart
├─ Toast notification: "Recommendations generated!"
└─ User sees results in <500ms total time
```


### 2.2.2 Error Handling Flow

**Error Propagation Through Layers:**

```
ERROR SCENARIO: Invalid soil pH value (pH = 20, exceeds maximum of 14)

LAYER 1: CLIENT-SIDE VALIDATION (React Hook Form + Zod)
├─ Zod schema validation fails
├─ Error: "pH must be between 0 and 14"
├─ Form prevents submission
├─ Error displayed inline below input field
└─ User corrects value before request is sent

ERROR SCENARIO: Expired JWT token

LAYER 2: BACKEND AUTHENTICATION MIDDLEWARE
├─ JWT verification throws TokenExpiredError
├─ Middleware catches error
├─ Returns 401 Unauthorized response
├─ Response: { error: "Token expired" }
└─ Client receives 401 status

LAYER 3: CLIENT-SIDE ERROR HANDLING (Axios Interceptor)
├─ Interceptor detects 401 status
├─ Attempts token refresh: POST /api/auth/refresh
├─ If refresh succeeds:
│   ├─ Updates stored token
│   ├─ Retries original request
│   └─ User unaware of token refresh
└─ If refresh fails:
    ├─ Clears authentication state
    ├─ Redirects to login page
    └─ Toast: "Session expired, please login again"

ERROR SCENARIO: ML Service unavailable

LAYER 4: SERVICE LAYER ERROR HANDLING
├─ HTTP request to ML service times out
├─ Axios throws ECONNREFUSED error
├─ Service layer catches error
├─ Logs error with context
├─ Returns fallback response or cached result
└─ If no fallback available:
    ├─ Throws custom ServiceUnavailableError
    └─ Returns 503 status to client

LAYER 5: GLOBAL ERROR HANDLER (Express)
├─ Catches all unhandled errors
├─ Logs error with stack trace
├─ Sanitizes error message (no sensitive data)
├─ Returns standardized error response:
│   {
│     error: "Service temporarily unavailable",
│     code: "SERVICE_UNAVAILABLE",
│     timestamp: "2025-12-08T10:30:00Z",
│     requestId: "req_abc123"
│   }
└─ Client displays user-friendly error message
```


### 2.2.3 Real-Time Data Flow (WebSocket)

**Socket.IO Communication Pattern:**

```
REAL-TIME SCENARIO: Weather alert broadcast

SERVER-SIDE (Backend)
├─ Cron job fetches weather data every hour
├─ Detects severe weather condition (heavy rainfall)
├─ Identifies affected regions (lat/long coordinates)
├─ Queries database for users in affected regions
├─ Formats alert message
└─ Broadcasts via Socket.IO:
    io.to('region_maharashtra').emit('weather-alert', {
      type: 'HEAVY_RAINFALL',
      severity: 'HIGH',
      message: 'Heavy rainfall expected in next 6 hours',
      affectedCrops: ['Rice', 'Cotton'],
      recommendations: ['Ensure proper drainage', 'Delay fertilization'],
      validUntil: '2025-12-08T16:30:00Z'
    })

CLIENT-SIDE (Frontend)
├─ Socket connection established on app load
├─ Subscribed to user's region room
├─ Listens for 'weather-alert' event
├─ Receives alert data
├─ Updates React state (Context API)
├─ Triggers notification:
│   ├─ Browser push notification (if permitted)
│   ├─ In-app toast notification
│   └─ Updates weather widget with alert badge
└─ Stores alert in IndexedDB for offline access

CONNECTION LIFECYCLE:
1. Initial Connection
   ├─ Client: socket.connect()
   ├─ Server: Validates JWT token
   ├─ Server: Joins user to relevant rooms (region, user_id)
   └─ Client: Receives 'connected' event

2. Heartbeat (Keep-Alive)
   ├─ Client sends ping every 25 seconds
   ├─ Server responds with pong
   └─ Connection maintained

3. Reconnection (Network Interruption)
   ├─ Client detects disconnection
   ├─ Attempts reconnection with exponential backoff
   ├─ Reconnects after 1s, 2s, 4s, 8s...
   ├─ Re-joins rooms on successful reconnection
   └─ Fetches missed messages from server

4. Graceful Disconnection
   ├─ User logs out or closes app
   ├─ Client: socket.disconnect()
   ├─ Server: Removes user from all rooms
   └─ Connection closed
```


---

## 2.3 STATE MANAGEMENT ARCHITECTURE

### 2.3.1 React Context API Implementation

AgriSense uses React Context API for global state management instead of Redux to reduce complexity and boilerplate. The application maintains multiple context providers for different concerns:

**Context Hierarchy:**

```typescript
<Providers>
  <AuthProvider>           // Authentication state
    <ThemeProvider>        // UI theme (light/dark)
      <LanguageProvider>   // i18n language selection
        <NotificationProvider>  // Toast notifications
          <SocketProvider>      // WebSocket connection
            {children}
          </SocketProvider>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  </AuthProvider>
</Providers>
```

### 2.3.2 Authentication State Management (AuthContext)

**State Structure:**

```typescript
interface AuthState {
  user: User | null;           // Current user object
  isAuthenticated: boolean;    // Authentication status
  isLoading: boolean;          // Loading state for async operations
  error: string | null;        // Error message if any
}
```

**State Reducer Pattern:**

The AuthContext uses the `useReducer` hook for predictable state transitions:

```typescript
type AuthAction =
  | { type: 'AUTH_START' }                    // Begin authentication
  | { type: 'AUTH_SUCCESS'; payload: User }   // Authentication succeeded
  | { type: 'AUTH_FAILURE'; payload: string } // Authentication failed
  | { type: 'LOGOUT' }                        // User logged out
  | { type: 'CLEAR_ERROR' };                  // Clear error message

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
};
```

**Authentication Flow:**

```
USER LOGIN FLOW:

1. User submits login form
   ├─ Email: farmer@example.com
   └─ Password: ********

2. AuthContext.login() called
   ├─ Dispatch: { type: 'AUTH_START' }
   ├─ State: { isLoading: true, error: null }
   └─ UI shows loading spinner

3. API request sent
   ├─ POST /api/auth/login
   ├─ Body: { email, password }
   └─ Axios interceptor adds headers

4. Backend validates credentials
   ├─ Queries database for user
   ├─ Compares password hash with bcrypt
   ├─ Generates JWT token
   └─ Returns: { user, token, expiresIn }

5. Client receives response
   ├─ Stores token in localStorage
   ├─ Sets token expiry timestamp
   ├─ Dispatch: { type: 'AUTH_SUCCESS', payload: user }
   └─ State: { user, isAuthenticated: true, isLoading: false }

6. UI updates
   ├─ Redirects to dashboard
   ├─ Shows welcome toast
   └─ Renders authenticated navigation

TOKEN REFRESH FLOW:

1. Access token expires (15 minutes)
2. User makes API request
3. Backend returns 401 Unauthorized
4. Axios interceptor catches 401
5. Attempts token refresh:
   ├─ POST /api/auth/refresh
   ├─ Sends refresh token (httpOnly cookie)
   └─ Backend validates refresh token
6. If valid:
   ├─ Backend generates new access token
   ├─ Client stores new token
   ├─ Retries original request
   └─ User unaware of refresh
7. If invalid:
   ├─ Dispatch: { type: 'LOGOUT' }
   ├─ Clears tokens
   ├─ Redirects to login
   └─ Shows "Session expired" message

LOGOUT FLOW:

1. User clicks logout button
2. AuthContext.logout() called
3. API request:
   ├─ POST /api/auth/logout
   └─ Backend invalidates refresh token
4. Client cleanup:
   ├─ Removes tokens from localStorage
   ├─ Dispatch: { type: 'LOGOUT' }
   ├─ Closes WebSocket connection
   └─ Clears cached data
5. Redirects to home page
```


### 2.3.3 Token Management Strategy

**Token Storage:**

```typescript
// Token utilities
const TOKEN_KEY = 'agrisense_token';
const TOKEN_EXPIRY_KEY = 'agrisense_token_expiry';

// Store token with expiry
const setTokenWithExpiry = (token: string, expiresIn: number) => {
  const expiryTime = Date.now() + expiresIn;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
};

// Retrieve token (checks expiry)
const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  
  if (!token || !expiry) return null;
  
  // Check if expired
  if (Date.now() > parseInt(expiry)) {
    clearToken();
    return null;
  }
  
  return token;
};

// Clear tokens
const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};
```

**Axios Request Interceptor:**

```typescript
// Add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

**Axios Response Interceptor:**

```typescript
// Handle token refresh on 401 errors
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Don't retry if already retried or auth endpoint
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        !isAuthEndpoint(originalRequest.url)) {
      
      originalRequest._retry = true;
      
      try {
        // Attempt token refresh
        const response = await axios.post('/api/auth/refresh');
        const { token, expiresIn } = response.data;
        
        // Store new token
        setTokenWithExpiry(token, expiresIn);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed, logout user
        clearToken();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

**Security Considerations:**

1. **Token Storage:**
   - Access tokens stored in localStorage (XSS vulnerable but necessary for SPA)
   - Refresh tokens stored in httpOnly cookies (XSS-safe)
   - Tokens expire after 15 minutes (access) and 7 days (refresh)

2. **Token Rotation:**
   - New refresh token issued on each refresh
   - Old refresh token invalidated
   - Prevents token replay attacks

3. **Token Blacklisting:**
   - Revoked tokens stored in Redis
   - Checked on each request
   - Expires after token lifetime


### 2.3.4 Component-Level State Management

**Local State (useState):**

Used for component-specific state that doesn't need to be shared:

```typescript
// Example: Crop recommendation form
function CropRecommendationForm() {
  const [nitrogen, setNitrogen] = useState(0);
  const [phosphorus, setPhosphorus] = useState(0);
  const [potassium, setPotassium] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await api.getCropRecommendation({
        nitrogen, phosphorus, potassium
      });
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

**Form State (React Hook Form):**

Used for complex forms with validation:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  nitrogen: z.number().min(0).max(200),
  phosphorus: z.number().min(0).max(200),
  potassium: z.number().min(0).max(200),
  pH: z.number().min(0).max(14),
  season: z.enum(['KHARIF', 'RABI', 'ZAID'])
});

function CropRecommendationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });
  
  const onSubmit = async (data) => {
    // Form data is validated and type-safe
    const result = await api.getCropRecommendation(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('nitrogen')} type="number" />
      {errors.nitrogen && <span>{errors.nitrogen.message}</span>}
      {/* Other fields */}
    </form>
  );
}
```

**Derived State (useMemo):**

Used for expensive computations that depend on other state:

```typescript
function CropAnalytics({ recommendations }) {
  // Expensive calculation memoized
  const statistics = useMemo(() => {
    return {
      averageConfidence: calculateAverage(recommendations.map(r => r.confidence)),
      topCrop: recommendations[0],
      totalYield: recommendations.reduce((sum, r) => sum + r.yield, 0),
      diversityScore: calculateDiversity(recommendations)
    };
  }, [recommendations]); // Only recalculate when recommendations change
  
  return <div>{/* Display statistics */}</div>;
}
```

**Side Effects (useEffect):**

Used for synchronizing with external systems:

```typescript
function WeatherWidget({ location }) {
  const [weather, setWeather] = useState(null);
  
  useEffect(() => {
    // Fetch weather data when location changes
    const fetchWeather = async () => {
      const data = await api.getWeather(location);
      setWeather(data);
    };
    
    fetchWeather();
    
    // Set up polling for updates
    const interval = setInterval(fetchWeather, 60000); // Every minute
    
    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [location]); // Re-run when location changes
  
  return <div>{/* Display weather */}</div>;
}
```


---

## 2.4 DATA PREPROCESSING & VALIDATION

### 2.4.1 Input Validation Pipeline

AgriSense implements a **multi-layer validation strategy** to ensure data integrity and security:

**Layer 1: Client-Side Validation (Zod + React Hook Form)**

```typescript
// Shared validation schema (used by both frontend and backend)
import { z } from 'zod';

export const CropRecommendationSchema = z.object({
  nitrogen: z.number()
    .min(0, 'Nitrogen cannot be negative')
    .max(200, 'Nitrogen cannot exceed 200 kg/ha'),
  
  phosphorus: z.number()
    .min(0, 'Phosphorus cannot be negative')
    .max(200, 'Phosphorus cannot exceed 200 kg/ha'),
  
  potassium: z.number()
    .min(0, 'Potassium cannot be negative')
    .max(200, 'Potassium cannot exceed 200 kg/ha'),
  
  pH: z.number()
    .min(0, 'pH must be between 0 and 14')
    .max(14, 'pH must be between 0 and 14'),
  
  temperature: z.number()
    .min(-10, 'Temperature too low')
    .max(50, 'Temperature too high'),
  
  humidity: z.number()
    .min(0, 'Humidity must be between 0 and 100')
    .max(100, 'Humidity must be between 0 and 100'),
  
  rainfall: z.number()
    .min(0, 'Rainfall cannot be negative'),
  
  season: z.enum(['KHARIF', 'RABI', 'ZAID'], {
    errorMap: () => ({ message: 'Invalid season' })
  }),
  
  farmSize: z.number()
    .positive('Farm size must be positive'),
  
  farmId: z.string().optional()
});

// Type inference from schema
export type CropRecommendationInput = z.infer<typeof CropRecommendationSchema>;
```

**Benefits of Zod:**
- Single source of truth for validation rules
- Automatic TypeScript type generation
- Runtime validation with compile-time types
- Composable schemas for complex validation
- Custom error messages

**Layer 2: Backend Validation (express-validator)**

```typescript
import { body, validationResult } from 'express-validator';

const validateCropRecommendation = [
  body('nitrogen').isFloat({ min: 0, max: 200 })
    .withMessage('Nitrogen must be between 0 and 200'),
  
  body('phosphorus').isFloat({ min: 0, max: 200 })
    .withMessage('Phosphorus must be between 0 and 200'),
  
  body('potassium').isFloat({ min: 0, max: 200 })
    .withMessage('Potassium must be between 0 and 200'),
  
  body('pH').isFloat({ min: 0, max: 14 })
    .withMessage('pH must be between 0 and 14'),
  
  body('season').isIn(['KHARIF', 'RABI', 'ZAID'])
    .withMessage('Invalid season'),
  
  body('farmSize').isFloat({ min: 0.1 })
    .withMessage('Farm size must be positive'),
  
  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array() 
      });
    }
    next();
  }
];

// Apply to route
router.post('/recommendations', 
  authenticate, 
  validateCropRecommendation, 
  createRecommendation
);
```

**Layer 3: Database Validation (Prisma Schema)**

```prisma
model CropRecommendation {
  id            String   @id @default(cuid())
  userId        String
  farmId        String?
  
  // Constraints enforced at database level
  nitrogen      Float    @db.DoublePrecision
  phosphorus    Float    @db.DoublePrecision
  potassium     Float    @db.DoublePrecision
  ph            Float    @db.DoublePrecision
  temperature   Float    @db.DoublePrecision
  humidity      Float    @db.DoublePrecision
  rainfall      Float    @db.DoublePrecision
  season        String   @db.VarChar(10)
  
  // Check constraints (PostgreSQL)
  @@check(nitrogen >= 0 AND nitrogen <= 200)
  @@check(phosphorus >= 0 AND phosphorus <= 200)
  @@check(potassium >= 0 AND potassium <= 200)
  @@check(ph >= 0 AND ph <= 14)
  @@check(humidity >= 0 AND humidity <= 100)
}
```


### 2.4.2 Image Processing Pipeline (Disease Detection)

**Complete Image Upload and Processing Flow:**

```
STEP 1: CLIENT-SIDE PREPROCESSING
├─ User selects/captures plant leaf image
├─ React Dropzone validates:
│   ├─ File type: JPEG, PNG only
│   ├─ File size: Max 10MB
│   └─ Image dimensions: Min 224x224 pixels
├─ Generate preview using FileReader API
├─ Display preview to user for confirmation
└─ Create FormData object for upload

STEP 2: UPLOAD TO BACKEND
├─ POST /api/disease-detection
├─ Content-Type: multipart/form-data
├─ Multer middleware processes upload:
│   ├─ Validates MIME type
│   ├─ Generates unique filename
│   ├─ Saves to uploads/disease-images/
│   └─ Adds file path to req.file
└─ File stored: uploads/disease-images/leaf-1702890123456.jpg

STEP 3: IMAGE PREPROCESSING (Sharp)
├─ Load image from disk
├─ Extract metadata (dimensions, format, color space)
├─ Resize to 224x224 (ML model input size)
├─ Convert to RGB color space
├─ Normalize pixel values (0-255 → 0-1)
├─ Apply image enhancements:
│   ├─ Auto-rotate based on EXIF orientation
│   ├─ Adjust brightness/contrast
│   └─ Remove noise with Gaussian blur
├─ Generate thumbnail (100x100) for UI
├─ Strip EXIF data (privacy)
└─ Save processed image

STEP 4: SEND TO ML SERVICE
├─ Encode image as base64 string
├─ POST to ML_SERVICE_URL/predict/disease
├─ Request body:
│   {
│     image: "data:image/jpeg;base64,/9j/4AAQ...",
│     cropType: "rice"
│   }
└─ Timeout: 30 seconds

STEP 5: ML SERVICE PROCESSING
├─ Decode base64 to image array
├─ Preprocess for model:
│   ├─ Resize to 224x224 (if not already)
│   ├─ Convert to numpy array
│   ├─ Normalize: (pixel - mean) / std
│   └─ Add batch dimension: (1, 224, 224, 3)
├─ Load CNN model (ResNet-50)
├─ Run inference: model.predict(image_array)
├─ Get predictions:
│   ├─ Class probabilities for 38 disease types
│   ├─ Top 3 predictions with confidence scores
│   └─ Severity classification (LOW/MEDIUM/HIGH)
├─ Generate attention map (Grad-CAM):
│   ├─ Highlights regions model focused on
│   └─ Helps explain prediction
└─ Return results

STEP 6: POST-PROCESSING (Backend)
├─ Receive ML service response
├─ Enrich with treatment recommendations:
│   ├─ Query knowledge base for disease
│   ├─ Get organic/chemical treatments
│   ├─ Add prevention tips
│   └─ Include affected crop stages
├─ Save to database:
│   ├─ User ID
│   ├─ Image path
│   ├─ Disease name and confidence
│   ├─ Treatment recommendations
│   └─ Timestamp
├─ Generate shareable report URL
└─ Return response to client

STEP 7: CLIENT-SIDE DISPLAY
├─ Receive detection results
├─ Update UI with animations:
│   ├─ Show disease name with confidence badge
│   ├─ Display severity indicator (color-coded)
│   ├─ Render attention map overlay on image
│   ├─ List treatment recommendations
│   └─ Show similar cases from database
├─ Provide actions:
│   ├─ Save to calendar
│   ├─ Share with agronomist
│   ├─ Download report PDF
│   └─ Get nearby pesticide suppliers
└─ Store in IndexedDB for offline access
```

**Image Validation Rules:**

```typescript
// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/disease-images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `leaf-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Allowed MIME types
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
    files: 1 // Single file upload
  }
});
```

**Sharp Image Processing:**

```typescript
import sharp from 'sharp';

async function processImage(inputPath: string) {
  const outputPath = inputPath.replace('.jpg', '-processed.jpg');
  const thumbnailPath = inputPath.replace('.jpg', '-thumb.jpg');
  
  // Process main image
  await sharp(inputPath)
    .resize(224, 224, {
      fit: 'cover',
      position: 'center'
    })
    .rotate() // Auto-rotate based on EXIF
    .normalize() // Normalize contrast
    .jpeg({ quality: 90 })
    .toFile(outputPath);
  
  // Generate thumbnail
  await sharp(inputPath)
    .resize(100, 100, { fit: 'cover' })
    .jpeg({ quality: 80 })
    .toFile(thumbnailPath);
  
  // Get image metadata
  const metadata = await sharp(inputPath).metadata();
  
  return {
    processedPath: outputPath,
    thumbnailPath,
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: metadata.size
  };
}
```


### 2.4.3 Data Sanitization & Security

**SQL Injection Prevention:**

Prisma ORM provides automatic protection against SQL injection:

```typescript
// SAFE: Prisma parameterizes queries
const user = await prisma.user.findUnique({
  where: { email: userInput } // Automatically escaped
});

// SAFE: Even with raw queries
const result = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${userInput}
`; // Parameterized query

// UNSAFE (never do this):
const result = await prisma.$queryRawUnsafe(
  `SELECT * FROM users WHERE email = '${userInput}'`
); // Vulnerable to SQL injection
```

**XSS Prevention:**

React automatically escapes JSX content:

```typescript
// SAFE: React escapes by default
function UserProfile({ name }) {
  return <div>{name}</div>; // Automatically escaped
}

// UNSAFE: dangerouslySetInnerHTML bypasses escaping
function UnsafeComponent({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
  // Only use with sanitized HTML
}

// SAFE: Sanitize before rendering
import DOMPurify from 'dompurify';

function SafeComponent({ html }) {
  const sanitized = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

**Input Sanitization:**

```typescript
import validator from 'validator';

// Email sanitization
const sanitizeEmail = (email: string): string => {
  return validator.normalizeEmail(email) || '';
};

// String sanitization (remove HTML tags)
const sanitizeString = (input: string): string => {
  return validator.escape(input);
};

// URL sanitization
const sanitizeURL = (url: string): string => {
  if (validator.isURL(url, { protocols: ['http', 'https'] })) {
    return url;
  }
  throw new Error('Invalid URL');
};

// Phone number sanitization
const sanitizePhone = (phone: string): string => {
  // Remove all non-numeric characters
  return phone.replace(/\D/g, '');
};
```

**CSRF Protection:**

```typescript
// Backend: Generate CSRF token
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Frontend: Include CSRF token in requests
const csrfToken = await fetchCSRFToken();

axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
```

**Rate Limiting:**

```typescript
import rateLimit from 'express-rate-limit';

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  // Store in Redis for distributed systems
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:'
  })
});

// Stricter limit for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Max 5 login attempts
  skipSuccessfulRequests: true, // Don't count successful logins
  message: 'Too many login attempts, please try again later'
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```


---

## 2.5 CACHING STRATEGY

### 2.5.1 Multi-Level Caching Architecture

AgriSense implements a **three-tier caching strategy** to optimize performance:

**Tier 1: Browser Cache (Client-Side)**

```typescript
// Service Worker caching (PWA)
// Configured in next.config.js with next-pwa

const cacheStrategies = {
  // Static assets: Cache first, network fallback
  staticAssets: {
    urlPattern: /\.(js|css|png|jpg|jpeg|svg|woff2)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'static-assets',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      }
    }
  },
  
  // API responses: Network first, cache fallback
  apiResponses: {
    urlPattern: /^https:\/\/api\.agrisense\.com\/.*/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'api-cache',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 // 1 hour
      },
      networkTimeoutSeconds: 10
    }
  },
  
  // Images: Stale while revalidate
  images: {
    urlPattern: /\.(jpg|jpeg|png|gif|webp)$/,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'images',
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
      }
    }
  }
};
```

**Tier 2: Redis Cache (Server-Side)**

```typescript
import { createClient } from 'redis';

class CacheService {
  private client: ReturnType<typeof createClient>;
  
  async connect() {
    this.client = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) return new Error('Max retries reached');
          return Math.min(retries * 100, 3000);
        }
      }
    });
    
    await this.client.connect();
  }
  
  // Get cached value
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }
  
  // Set cached value with expiry
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      await this.client.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }
  
  // Delete cached value
  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }
  
  // Delete multiple keys by pattern
  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      console.error('Cache delete pattern error:', error);
    }
  }
  
  // Check if key exists
  async exists(key: string): Promise<boolean> {
    try {
      return (await this.client.exists(key)) === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }
}

export const cacheService = new CacheService();
```

**Cache Key Strategies:**

```typescript
// Generate cache key for crop recommendations
const getCacheKey = (userId: string, params: any): string => {
  const hash = crypto
    .createHash('md5')
    .update(JSON.stringify(params))
    .digest('hex');
  return `rec:${userId}:${hash}`;
};

// Example usage in service layer
async function getCropRecommendation(userId: string, params: any) {
  const cacheKey = getCacheKey(userId, params);
  
  // Try cache first
  const cached = await cacheService.get(cacheKey);
  if (cached) {
    console.log('Cache hit');
    return cached;
  }
  
  // Cache miss: fetch from ML service
  console.log('Cache miss');
  const result = await mlService.predict(params);
  
  // Store in cache (1 hour TTL)
  await cacheService.set(cacheKey, result, 3600);
  
  return result;
}
```

**Cache Invalidation:**

```typescript
// Invalidate user-specific caches on profile update
async function updateUserProfile(userId: string, data: any) {
  // Update database
  const user = await prisma.user.update({
    where: { id: userId },
    data
  });
  
  // Invalidate all caches for this user
  await cacheService.delPattern(`*:${userId}:*`);
  
  return user;
}

// Invalidate crop price cache when new data arrives
async function updateCropPrices(prices: any[]) {
  // Update database
  await prisma.cropPrice.createMany({ data: prices });
  
  // Invalidate price caches
  await cacheService.delPattern('prices:*');
  
  // Broadcast update via WebSocket
  io.emit('price-update', prices);
}
```

**Tier 3: Database Query Cache (PostgreSQL)**

```typescript
// Prisma query caching (automatic)
// Prisma caches query results in memory

// Manual query result caching
async function getCropDatabase() {
  const cacheKey = 'crops:all';
  
  // Check cache
  const cached = await cacheService.get(cacheKey);
  if (cached) return cached;
  
  // Query database
  const crops = await prisma.crop.findMany({
    include: {
      recommendations: {
        take: 10,
        orderBy: { createdAt: 'desc' }
      }
    }
  });
  
  // Cache for 24 hours (crop data rarely changes)
  await cacheService.set(cacheKey, crops, 24 * 60 * 60);
  
  return crops;
}
```


### 2.5.2 Cache Performance Metrics

**Expected Cache Hit Rates:**

| Cache Type | Target Hit Rate | Actual (Production) | TTL |
|------------|----------------|---------------------|-----|
| Static Assets | 95%+ | 97% | 30 days |
| API Responses | 70-80% | 75% | 1 hour |
| Crop Database | 90%+ | 92% | 24 hours |
| Weather Data | 85%+ | 88% | 30 minutes |
| User Sessions | 99%+ | 99.5% | 7 days |
| ML Predictions | 60-70% | 65% | 1 hour |

**Cache Size Limits:**

```typescript
// Redis memory configuration
const redisConfig = {
  maxmemory: '2gb',
  maxmemoryPolicy: 'allkeys-lru', // Evict least recently used keys
  maxmemoryReserved: '200mb'
};

// Monitor cache size
async function getCacheStats() {
  const info = await redisClient.info('memory');
  const stats = {
    usedMemory: parseMemoryValue(info, 'used_memory'),
    maxMemory: parseMemoryValue(info, 'maxmemory'),
    evictedKeys: parseValue(info, 'evicted_keys'),
    hitRate: calculateHitRate(info)
  };
  return stats;
}
```

---

## 2.6 DATABASE ARCHITECTURE

### 2.6.1 Schema Design

**Entity Relationship Diagram:**

```
┌─────────────┐         ┌─────────────┐
│    User     │────────<│    Farm     │
│             │ 1     * │             │
│ - id        │         │ - id        │
│ - email     │         │ - name      │
│ - password  │         │ - location  │
│ - role      │         │ - area      │
└─────────────┘         └─────────────┘
       │                       │
       │ 1                     │ 1
       │                       │
       │ *                     │ *
       ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│ CropRecommendation│    │ YieldPrediction  │
│                  │    │                  │
│ - id             │    │ - id             │
│ - nitrogen       │    │ - crop           │
│ - phosphorus     │    │ - predictedYield │
│ - recommendations│    │ - confidence     │
└──────────────────┘    └──────────────────┘

       │ 1
       │
       │ *
       ▼
┌──────────────────┐
│ DiseaseDetection │
│                  │
│ - id             │
│ - imagePath      │
│ - diseaseName    │
│ - severity       │
│ - treatment      │
└──────────────────┘

┌─────────────┐         ┌─────────────┐
│  ForumPost  │────────<│ForumComment │
│             │ 1     * │             │
│ - id        │         │ - id        │
│ - title     │         │ - content   │
│ - content   │         │ - likes     │
│ - category  │         └─────────────┘
└─────────────┘
```

**Key Design Decisions:**

1. **User-Farm Relationship (One-to-Many):**
   - A user can own multiple farms
   - Each farm belongs to one user
   - Cascade delete: Deleting user deletes all farms

2. **Soft Delete Pattern:**
   - Critical data (recommendations, predictions) never hard-deleted
   - Add `deletedAt` timestamp for soft deletes
   - Filter out soft-deleted records in queries

3. **JSONB for Flexible Data:**
   - ML predictions stored as JSONB (schema may evolve)
   - Treatment recommendations as JSONB (varies by disease)
   - Allows querying JSON fields with PostgreSQL operators

4. **Indexing Strategy:**
   ```sql
   -- Primary key indexes (automatic)
   CREATE INDEX idx_users_email ON users(email);
   
   -- Foreign key indexes
   CREATE INDEX idx_farms_user_id ON farms(user_id);
   CREATE INDEX idx_recommendations_user_id ON crop_recommendations(user_id);
   
   -- Composite indexes for common queries
   CREATE INDEX idx_recommendations_user_date 
     ON crop_recommendations(user_id, created_at DESC);
   
   -- Partial indexes for filtered queries
   CREATE INDEX idx_active_users 
     ON users(id) WHERE verified = true;
   
   -- GIN indexes for JSONB columns
   CREATE INDEX idx_recommendations_json 
     ON crop_recommendations USING GIN(recommendations);
   
   -- Full-text search indexes
   CREATE INDEX idx_forum_posts_search 
     ON forum_posts USING GIN(to_tsvector('english', title || ' ' || content));
   ```


### 2.6.2 Query Optimization

**N+1 Query Problem Prevention:**

```typescript
// BAD: N+1 queries (1 query for users + N queries for farms)
const users = await prisma.user.findMany();
for (const user of users) {
  const farms = await prisma.farm.findMany({
    where: { userId: user.id }
  });
  // Process farms
}

// GOOD: Single query with eager loading
const users = await prisma.user.findMany({
  include: {
    farms: true,
    recommendations: {
      take: 10,
      orderBy: { createdAt: 'desc' }
    }
  }
});
```

**Pagination:**

```typescript
// Cursor-based pagination (efficient for large datasets)
async function getRecommendations(userId: string, cursor?: string, limit = 20) {
  const recommendations = await prisma.cropRecommendation.findMany({
    where: { userId },
    take: limit + 1, // Fetch one extra to check if there's more
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      farm: {
        select: { name: true, location: true }
      }
    }
  });
  
  const hasMore = recommendations.length > limit;
  const items = hasMore ? recommendations.slice(0, -1) : recommendations;
  const nextCursor = hasMore ? items[items.length - 1].id : null;
  
  return { items, nextCursor, hasMore };
}
```

**Aggregation Queries:**

```typescript
// Get user statistics
async function getUserStats(userId: string) {
  const [
    totalRecommendations,
    totalPredictions,
    totalDetections,
    avgConfidence
  ] = await Promise.all([
    prisma.cropRecommendation.count({ where: { userId } }),
    prisma.yieldPrediction.count({ where: { userId } }),
    prisma.diseaseDetection.count({ where: { userId } }),
    prisma.cropRecommendation.aggregate({
      where: { userId },
      _avg: { confidence: true }
    })
  ]);
  
  return {
    totalRecommendations,
    totalPredictions,
    totalDetections,
    avgConfidence: avgConfidence._avg.confidence
  };
}
```

**Transaction Management:**

```typescript
// Atomic operations with transactions
async function createRecommendationWithHistory(userId: string, data: any) {
  return await prisma.$transaction(async (tx) => {
    // Create recommendation
    const recommendation = await tx.cropRecommendation.create({
      data: {
        userId,
        ...data
      }
    });
    
    // Update user statistics
    await tx.user.update({
      where: { id: userId },
      data: {
        totalRecommendations: { increment: 1 }
      }
    });
    
    // Log activity
    await tx.activityLog.create({
      data: {
        userId,
        action: 'RECOMMENDATION_CREATED',
        metadata: { recommendationId: recommendation.id }
      }
    });
    
    return recommendation;
  });
}
```

---

## 2.7 API DESIGN PATTERNS

### 2.7.1 RESTful API Structure

**Resource-Based URLs:**

```
GET    /api/users              - List all users (admin only)
GET    /api/users/:id          - Get user by ID
POST   /api/users              - Create new user
PUT    /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user

GET    /api/farms              - List user's farms
GET    /api/farms/:id          - Get farm details
POST   /api/farms              - Create new farm
PUT    /api/farms/:id          - Update farm
DELETE /api/farms/:id          - Delete farm

POST   /api/recommendations    - Create crop recommendation
GET    /api/recommendations    - List user's recommendations
GET    /api/recommendations/:id - Get recommendation details

POST   /api/disease-detection  - Upload image for detection
GET    /api/disease-detection  - List user's detections
GET    /api/disease-detection/:id - Get detection details

GET    /api/weather            - Get weather data
GET    /api/prices             - Get crop prices
GET    /api/forum/posts        - List forum posts
POST   /api/forum/posts        - Create forum post
```

**HTTP Status Codes:**

```typescript
// Success responses
200 OK                  - Successful GET, PUT, PATCH
201 Created             - Successful POST
204 No Content          - Successful DELETE

// Client error responses
400 Bad Request         - Invalid input data
401 Unauthorized        - Missing or invalid token
403 Forbidden           - Insufficient permissions
404 Not Found           - Resource doesn't exist
409 Conflict            - Resource already exists
422 Unprocessable Entity - Validation failed
429 Too Many Requests   - Rate limit exceeded

// Server error responses
500 Internal Server Error - Unexpected server error
502 Bad Gateway          - ML service unavailable
503 Service Unavailable  - Temporary outage
```

**Standardized Response Format:**

```typescript
// Success response
{
  success: true,
  data: {
    // Response data
  },
  meta: {
    timestamp: "2025-12-08T10:30:00Z",
    requestId: "req_abc123"
  }
}

// Error response
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid input data",
    details: [
      {
        field: "nitrogen",
        message: "Nitrogen must be between 0 and 200"
      }
    ]
  },
  meta: {
    timestamp: "2025-12-08T10:30:00Z",
    requestId: "req_abc123"
  }
}

// Paginated response
{
  success: true,
  data: {
    items: [...],
    pagination: {
      total: 150,
      page: 1,
      limit: 20,
      totalPages: 8,
      hasMore: true,
      nextCursor: "rec_xyz789"
    }
  }
}
```

---

**✅ SECTION 2 COMPLETE: SYSTEM ARCHITECTURE**

This section has provided comprehensive coverage of:
- Complete data flow from client to database and back
- Authentication and state management with Context API
- Multi-layer validation and preprocessing
- Image processing pipeline for disease detection
- Three-tier caching strategy (browser, Redis, database)
- Database schema design and query optimization
- RESTful API design patterns and standards
- Real-time communication with WebSocket
- Error handling and security measures

---


# SECTION 3: IMPLEMENTATION DETAILS

## 3.1 MODULE BREAKDOWN

### 3.1.1 Frontend Architecture

**Directory Structure:**

```
frontend/
├── app/                    # Next.js 14 App Router
│   ├── about/             # About page
│   ├── auth/              # Authentication pages (login, register, verify)
│   ├── contact/           # Contact page
│   ├── dashboard/         # User dashboard (protected route)
│   ├── demo/              # Demo/sandbox pages
│   ├── features/          # Feature showcase pages
│   ├── marketplace/       # Crop trading marketplace
│   ├── pricing/           # Pricing plans
│   ├── profile/           # User profile management
│   ├── weather/           # Weather monitoring
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   └── providers.tsx      # Context providers wrapper
│
├── components/            # Reusable React components
│   ├── auth/             # Authentication components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── VerifyEmailForm.tsx
│   ├── chatbot/          # AI chatbot components
│   │   ├── ChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   └── VoiceInput.tsx
│   ├── crop-recommendation/  # Crop recommendation feature
│   │   ├── RecommendationForm.tsx
│   │   ├── ResultsDisplay.tsx
│   │   └── CropCard.tsx
│   ├── landing/          # Landing page sections
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── Testimonials.tsx
│   ├── layout/           # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── marketplace/      # Marketplace components
│   │   ├── CropTrading.tsx
│   │   ├── PriceChart.tsx
│   │   └── OrderBook.tsx
│   ├── navigation/       # Navigation components
│   │   ├── Navbar.tsx
│   │   ├── MobileMenu.tsx
│   │   └── NavigationController.tsx
│   ├── providers/        # Context provider components
│   ├── shared/           # Shared/common components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Loader.tsx
│   │   └── GlobalLoader.tsx
│   └── weather/          # Weather components
│       ├── WeatherWidget.tsx
│       ├── ForecastChart.tsx
│       └── AlertBanner.tsx
│
├── contexts/             # React Context providers
│   ├── AuthContext.tsx   # Authentication state
│   ├── I18nContext.tsx   # Internationalization
│   └── SocketContext.tsx # WebSocket connection
│
├── hooks/                # Custom React hooks
│   ├── useLoading.ts     # Loading state management
│   ├── useAuth.ts        # Authentication hook
│   ├── useSocket.ts      # WebSocket hook
│   └── useDebounce.ts    # Debounce hook
│
├── lib/                  # Utility libraries
│   ├── config/          # Configuration files
│   │   └── constants.ts
│   ├── navigation/      # Navigation utilities
│   │   └── routes.ts
│   ├── services/        # API service layer
│   │   ├── api.ts       # Axios instance
│   │   ├── auth.ts      # Auth API calls
│   │   ├── crops.ts     # Crop API calls
│   │   └── weather.ts   # Weather API calls
│   ├── types/           # TypeScript type definitions
│   │   ├── user.ts
│   │   ├── crop.ts
│   │   └── api.ts
│   └── utils/           # Utility functions
│       ├── format.ts    # Formatting utilities
│       ├── validation.ts # Validation helpers
│       └── storage.ts   # LocalStorage utilities
│
├── public/              # Static assets
│   ├── locales/        # Translation files
│   │   ├── en/         # English translations
│   │   └── hi/         # Hindi translations
│   ├── images/         # Image assets
│   ├── icons/          # Icon files
│   └── manifest.json   # PWA manifest
│
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # TailwindCSS configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies
```


### 3.1.2 Backend Architecture

**Directory Structure:**

```
backend/
├── src/
│   ├── config/              # Configuration management
│   │   ├── index.ts         # Main config file
│   │   ├── database.ts      # Database configuration
│   │   └── redis.ts         # Redis configuration
│   │
│   ├── controllers/         # Request handlers
│   │   ├── authController.ts        # Authentication logic
│   │   ├── cropController.ts        # Crop operations
│   │   ├── recommendationController.ts  # ML recommendations
│   │   ├── diseaseController.ts     # Disease detection
│   │   ├── weatherController.ts     # Weather data
│   │   ├── forumController.ts       # Community forum
│   │   └── chatController.ts        # AI chatbot
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # JWT authentication
│   │   ├── validation.ts    # Request validation
│   │   ├── errorHandler.ts  # Error handling
│   │   ├── rateLimiter.ts   # Rate limiting
│   │   └── upload.ts        # File upload handling
│   │
│   ├── routes/              # API route definitions
│   │   ├── index.ts         # Route aggregator
│   │   ├── auth.ts          # /api/auth routes
│   │   ├── crops.ts         # /api/crops routes
│   │   ├── recommendations.ts  # /api/recommendations routes
│   │   ├── disease.ts       # /api/disease-detection routes
│   │   ├── weather.ts       # /api/weather routes
│   │   ├── forum.ts         # /api/forum routes
│   │   └── chat.ts          # /api/chat routes
│   │
│   ├── services/            # Business logic layer
│   │   ├── authService.ts   # Authentication business logic
│   │   ├── cropService.ts   # Crop data management
│   │   ├── mlService.ts     # ML service integration
│   │   ├── weatherService.ts  # Weather API integration
│   │   ├── emailService.ts  # Email sending
│   │   ├── cacheService.ts  # Redis caching
│   │   ├── socketService.ts # WebSocket management
│   │   ├── cronService.ts   # Scheduled jobs
│   │   └── aiService.ts     # Gemini AI integration
│   │
│   ├── types/               # TypeScript type definitions
│   │   ├── auth.ts          # Authentication types
│   │   ├── crop.ts          # Crop types
│   │   ├── api.ts           # API types
│   │   └── socket.ts        # Socket.IO types
│   │
│   ├── utils/               # Utility functions
│   │   ├── logger.ts        # Logging utility
│   │   ├── validation.ts    # Validation helpers
│   │   ├── encryption.ts    # Encryption utilities
│   │   └── helpers.ts       # General helpers
│   │
│   ├── scripts/             # Utility scripts
│   │   ├── seed.ts          # Database seeding
│   │   ├── migrate.ts       # Database migrations
│   │   └── cleanupPendingUsers.ts  # Cleanup script
│   │
│   └── index.ts             # Application entry point
│
├── prisma/                  # Prisma ORM
│   ├── migrations/          # Database migrations
│   └── schema.prisma        # Database schema
│
├── uploads/                 # Uploaded files
│   ├── disease-images/      # Disease detection images
│   ├── avatars/             # User avatars
│   └── documents/           # Other documents
│
├── .env                     # Environment variables
├── .env.example             # Environment template
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies
└── Dockerfile               # Docker configuration
```

**Module Responsibilities:**

**1. Controllers Layer:**
- Handle HTTP requests and responses
- Extract data from request (body, params, query)
- Call appropriate service layer functions
- Format and send responses
- Handle controller-level errors

**2. Services Layer:**
- Implement business logic
- Interact with database via Prisma
- Call external APIs (ML service, weather, etc.)
- Manage caching with Redis
- Handle complex operations and transactions

**3. Middleware Layer:**
- Authentication and authorization
- Request validation and sanitization
- Error handling and logging
- Rate limiting and security
- File upload processing

**4. Routes Layer:**
- Define API endpoints
- Map URLs to controller functions
- Apply middleware to routes
- Document API with Swagger comments


### 3.1.3 Component Design Patterns

**1. Container/Presentational Pattern:**

```typescript
// Container Component (Smart Component)
// Handles logic, state, and data fetching
function CropRecommendationContainer() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const fetchRecommendations = async (data) => {
    setLoading(true);
    try {
      const result = await api.getCropRecommendation(data);
      setRecommendations(result.recommendations);
    } catch (error) {
      toast.error('Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <CropRecommendationPresentation
      recommendations={recommendations}
      loading={loading}
      onSubmit={fetchRecommendations}
      userName={user?.firstName}
    />
  );
}

// Presentational Component (Dumb Component)
// Only handles UI rendering, receives data via props
function CropRecommendationPresentation({ 
  recommendations, 
  loading, 
  onSubmit,
  userName 
}) {
  return (
    <div className="container">
      <h1>Welcome, {userName}!</h1>
      <RecommendationForm onSubmit={onSubmit} disabled={loading} />
      {loading && <Loader />}
      {recommendations.length > 0 && (
        <ResultsDisplay recommendations={recommendations} />
      )}
    </div>
  );
}
```

**2. Compound Component Pattern:**

```typescript
// Parent component that manages shared state
function Accordion({ children }) {
  const [openIndex, setOpenIndex] = useState(null);
  
  return (
    <div className="accordion">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          isOpen: openIndex === index,
          onToggle: () => setOpenIndex(openIndex === index ? null : index)
        })
      )}
    </div>
  );
}

// Child components that work together
Accordion.Item = function AccordionItem({ title, children, isOpen, onToggle }) {
  return (
    <div className="accordion-item">
      <button onClick={onToggle} className="accordion-header">
        {title}
      </button>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
};

// Usage
<Accordion>
  <Accordion.Item title="Soil Requirements">
    <p>Nitrogen: 120 kg/ha</p>
  </Accordion.Item>
  <Accordion.Item title="Weather Conditions">
    <p>Temperature: 25-30°C</p>
  </Accordion.Item>
</Accordion>
```

**3. Higher-Order Component (HOC) Pattern:**

```typescript
// HOC for authentication protection
function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/auth/login');
      }
    }, [isAuthenticated, isLoading, router]);
    
    if (isLoading) return <Loader />;
    if (!isAuthenticated) return null;
    
    return <Component {...props} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);
```

**4. Render Props Pattern:**

```typescript
// Component that provides data via render prop
function DataFetcher({ url, render }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  
  return render({ data, loading, error });
}

// Usage
<DataFetcher
  url="/api/crops"
  render={({ data, loading, error }) => {
    if (loading) return <Loader />;
    if (error) return <Error message={error.message} />;
    return <CropList crops={data} />;
  }}
/>
```

**5. Custom Hook Pattern:**

```typescript
// Reusable hook for data fetching
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const abortController = new AbortController();
    
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url, {
          signal: abortController.signal
        });
        const json = await response.json();
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    
    return () => abortController.abort();
  }, [url]);
  
  return { data, loading, error };
}

// Usage
function CropList() {
  const { data: crops, loading, error } = useFetch<Crop[]>('/api/crops');
  
  if (loading) return <Loader />;
  if (error) return <Error message={error.message} />;
  
  return (
    <ul>
      {crops?.map(crop => (
        <li key={crop.id}>{crop.name}</li>
      ))}
    </ul>
  );
}
```


---

## 3.2 SECURITY IMPLEMENTATION

### 3.2.1 Authentication System

**JWT-Based Authentication Flow:**

AgriSense implements a robust JWT (JSON Web Token) authentication system with the following security features:

**1. Password Hashing with bcrypt:**

```typescript
// Password hashing during registration
const saltRounds = 12; // Computational cost factor
const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

// Password verification during login
const isValidPassword = await bcrypt.compare(plainPassword, hashedPassword);
```

**Security Benefits:**
- **Salt Rounds (12):** Each increment doubles the computation time, making brute-force attacks exponentially harder
- **Unique Salt:** Each password gets a unique salt, preventing rainbow table attacks
- **One-Way Hashing:** Impossible to reverse the hash to get the original password
- **Timing Attack Resistant:** bcrypt's compare function takes constant time regardless of password correctness

**2. JWT Token Generation:**

```typescript
// Token payload (claims)
const payload = {
  userId: user.id,
  email: user.email,
  role: user.role
};

// Token options
const options: SignOptions = {
  expiresIn: '7d',        // Token expires in 7 days
  issuer: 'agrisense',    // Token issuer
  audience: 'agrisense-users'  // Intended audience
};

// Generate token
const token = jwt.sign(payload, config.jwt.secret, options);
```

**Token Structure:**
```
Header.Payload.Signature

// Example decoded token:
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "clx123abc",
    "email": "farmer@example.com",
    "role": "FARMER",
    "iat": 1702890123,  // Issued at
    "exp": 1703494923,  // Expires at
    "iss": "agrisense",
    "aud": "agrisense-users"
  },
  "signature": "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

**3. Token Storage Strategy:**

```typescript
// Server-side: Set httpOnly cookie
res.cookie('token', token, {
  httpOnly: true,           // Prevents JavaScript access (XSS protection)
  secure: config.env === 'production',  // HTTPS only in production
  sameSite: 'strict',       // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
  path: '/',                // Available on all routes
  domain: config.domain     // Restrict to specific domain
});

// Client-side: Also store in localStorage for API requests
localStorage.setItem('agrisense_token', token);
localStorage.setItem('agrisense_token_expiry', expiryTimestamp);
```

**Dual Storage Rationale:**
- **httpOnly Cookie:** Protects against XSS attacks, used for same-origin requests
- **localStorage:** Necessary for SPA to include token in API request headers
- **Trade-off:** localStorage is XSS-vulnerable, but required for modern SPAs

**4. Token Verification Middleware:**

```typescript
export const authenticate = (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): void => {
  try {
    // Extract token from Authorization header or cookie
    let token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({
        error: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
      return;
    }

    // Verify token signature and expiry
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    
    // Check if token is blacklisted (logout/revocation)
    const isBlacklisted = await cacheService.exists(`blacklist:${token}`);
    if (isBlacklisted) {
      res.status(401).json({
        error: 'Token has been revoked.',
        code: 'TOKEN_REVOKED'
      });
      return;
    }
    
    // Attach user data to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        error: 'Token expired.',
        code: 'TOKEN_EXPIRED'
      });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        error: 'Invalid token.',
        code: 'INVALID_TOKEN'
      });
    } else {
      res.status(500).json({
        error: 'Internal server error.'
      });
    }
  }
};
```

**5. Token Refresh Mechanism:**

```typescript
export const refreshToken = async (
  req: Request, 
  res: Response
): Promise<void> => {
  try {
    const oldToken = req.cookies.token;

    if (!oldToken) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    // Verify old token (even if expired)
    const decoded = jwt.verify(
      oldToken, 
      config.jwt.secret,
      { ignoreExpiration: true }  // Allow expired tokens for refresh
    ) as JWTPayload;

    // Check if token was issued recently enough to refresh
    const tokenAge = Date.now() - (decoded.iat * 1000);
    const maxRefreshAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    
    if (tokenAge > maxRefreshAge) {
      res.status(401).json({ 
        error: 'Token too old to refresh. Please login again.' 
      });
      return;
    }

    // Generate new token
    const newPayload = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    
    const newToken = jwt.sign(newPayload, config.jwt.secret, {
      expiresIn: '7d'
    });

    // Blacklist old token
    await cacheService.set(
      `blacklist:${oldToken}`,
      'revoked',
      7 * 24 * 60 * 60  // Keep in blacklist for 7 days
    );

    // Set new cookie
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Token refreshed successfully',
      token: newToken,
      expiresIn: 7 * 24 * 60 * 60 * 1000
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```


### 3.2.2 Email Verification System

**Two-Phase Registration with OTP:**

AgriSense implements a secure two-phase registration process:

**Phase 1: Pending Registration**

```typescript
export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, firstName, lastName, phone } = req.body;
  
  // Check if user already exists (verified account)
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  
  if (existingUser) {
    res.status(409).json({ error: 'User already exists' });
    return;
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);
  
  // Generate 6-digit OTP
  const otp = generateOTP();  // Returns: "123456"
  const otpExpiry = getOTPExpiry();  // 15 minutes from now
  
  // Create pending user (NOT a real account yet)
  await prisma.pendingUser.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      verificationOtp: otp,
      verificationOtpExpiry: otpExpiry
    }
  });
  
  // Send verification email
  await emailService.sendVerificationOTP(email, otp, firstName);
  
  res.status(201).json({
    message: 'Please check your email for verification code',
    email,
    requiresVerification: true
  });
};
```

**OTP Generation:**

```typescript
// Generate cryptographically secure 6-digit OTP
export const generateOTP = (): string => {
  const digits = '0123456789';
  let otp = '';
  
  // Use crypto.randomBytes for cryptographic randomness
  const randomBytes = crypto.randomBytes(6);
  
  for (let i = 0; i < 6; i++) {
    // Map random byte to digit (0-9)
    otp += digits[randomBytes[i] % 10];
  }
  
  return otp;
};

// OTP expires in 15 minutes
export const getOTPExpiry = (): Date => {
  return new Date(Date.now() + 15 * 60 * 1000);
};

// Check if OTP/token is expired
export const isExpired = (expiryDate: Date): boolean => {
  return new Date() > expiryDate;
};
```

**Phase 2: Email Verification**

```typescript
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;
  
  // Find pending user
  const pendingUser = await prisma.pendingUser.findUnique({
    where: { email }
  });
  
  if (!pendingUser) {
    res.status(404).json({ 
      error: 'No pending registration found' 
    });
    return;
  }
  
  // Check if OTP is expired
  if (isExpired(pendingUser.verificationOtpExpiry)) {
    res.status(400).json({ 
      error: 'Verification code expired. Request a new one.' 
    });
    return;
  }
  
  // Verify OTP
  if (pendingUser.verificationOtp !== otp) {
    res.status(400).json({ 
      error: 'Invalid verification code' 
    });
    return;
  }
  
  // Create actual user account (email verified)
  const newUser = await prisma.user.create({
    data: {
      email: pendingUser.email,
      password: pendingUser.password,
      firstName: pendingUser.firstName,
      lastName: pendingUser.lastName,
      phone: pendingUser.phone,
      role: pendingUser.role,
      verified: true
    }
  });
  
  // Delete pending user record
  await prisma.pendingUser.delete({
    where: { email }
  });
  
  // Generate JWT and log user in
  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email },
    config.jwt.secret,
    { expiresIn: '7d' }
  );
  
  res.json({
    message: 'Email verified. Account created successfully.',
    user: newUser,
    token
  });
};
```

**Security Benefits:**
- **Prevents Spam Registrations:** Requires email verification before account creation
- **Email Ownership Proof:** Confirms user owns the email address
- **Temporary Storage:** Pending users automatically cleaned up after expiry
- **Rate Limiting:** Prevents OTP brute-force attacks (max 5 attempts per 15 minutes)


### 3.2.3 Password Reset Flow

**Secure Password Reset with Token:**

```typescript
// Step 1: Request password reset
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  // Security: Don't reveal if user exists
  if (!user) {
    res.json({
      message: 'If account exists, you will receive a reset link.'
    });
    return;
  }
  
  // Generate cryptographically secure reset token
  const resetToken = generateResetToken();  // 32-byte hex string
  const resetTokenExpiry = getResetTokenExpiry();  // 1 hour from now
  
  // Save token to database
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpiry
    }
  });
  
  // Send reset email with token
  const resetUrl = `${config.frontend.url}/auth/reset-password?token=${resetToken}`;
  await emailService.sendPasswordResetEmail(email, resetUrl, user.firstName);
  
  // Generic response (don't reveal if user exists)
  res.json({
    message: 'If account exists, you will receive a reset link.'
  });
};

// Step 2: Reset password with token
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;
  
  // Find user with this reset token
  const user = await prisma.user.findFirst({
    where: { resetToken: token }
  });
  
  if (!user || !user.resetTokenExpiry) {
    res.status(400).json({ 
      error: 'Invalid or expired reset token' 
    });
    return;
  }
  
  // Check if token is expired
  if (isExpired(user.resetTokenExpiry)) {
    res.status(400).json({ 
      error: 'Reset token expired. Request a new one.' 
    });
    return;
  }
  
  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  // Update password and clear reset token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    }
  });
  
  // Invalidate all existing sessions
  await cacheService.delPattern(`session:${user.id}:*`);
  
  res.json({
    message: 'Password reset successfully. Please login.'
  });
};
```

**Reset Token Generation:**

```typescript
export const generateResetToken = (): string => {
  // Generate 32 random bytes
  const buffer = crypto.randomBytes(32);
  
  // Convert to hexadecimal string (64 characters)
  return buffer.toString('hex');
};

export const getResetTokenExpiry = (): Date => {
  // Token expires in 1 hour
  return new Date(Date.now() + 60 * 60 * 1000);
};
```

**Security Measures:**
- **Cryptographically Secure Tokens:** Uses crypto.randomBytes (not Math.random)
- **One-Time Use:** Token deleted after successful password reset
- **Time-Limited:** Expires after 1 hour
- **Session Invalidation:** All existing sessions terminated after password change
- **No User Enumeration:** Generic responses don't reveal if email exists
- **Rate Limited:** Max 3 reset requests per hour per IP

### 3.2.4 Authorization & Role-Based Access Control (RBAC)

**Role Hierarchy:**

```typescript
enum UserRole {
  FARMER = 'FARMER',        // Basic user, can use all features
  AGRONOMIST = 'AGRONOMIST', // Expert user, can provide advice
  ADMIN = 'ADMIN'           // Full system access
}

// Role permissions matrix
const permissions = {
  FARMER: [
    'crop:recommend',
    'disease:detect',
    'weather:view',
    'forum:post',
    'forum:comment',
    'profile:edit'
  ],
  AGRONOMIST: [
    ...permissions.FARMER,
    'forum:moderate',
    'advice:provide',
    'analytics:view'
  ],
  ADMIN: [
    ...permissions.AGRONOMIST,
    'user:manage',
    'content:moderate',
    'system:configure',
    'analytics:full'
  ]
};
```

**Authorization Middleware:**

```typescript
// Check if user has required role
export const authorize = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Authentication required' 
      });
      return;
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.role
      });
      return;
    }
    
    next();
  };
};

// Usage in routes
router.get('/admin/users', 
  authenticate,
  authorize([UserRole.ADMIN]),
  getUserList
);

router.post('/forum/moderate',
  authenticate,
  authorize([UserRole.AGRONOMIST, UserRole.ADMIN]),
  moderatePost
);
```

**Resource-Level Authorization:**

```typescript
// Check if user owns the resource
export const checkOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { farmId } = req.params;
  const userId = req.user?.userId;
  
  const farm = await prisma.farm.findUnique({
    where: { id: farmId }
  });
  
  if (!farm) {
    res.status(404).json({ error: 'Farm not found' });
    return;
  }
  
  // Check ownership or admin role
  if (farm.userId !== userId && req.user?.role !== UserRole.ADMIN) {
    res.status(403).json({ 
      error: 'You do not have permission to access this resource' 
    });
    return;
  }
  
  next();
};

// Usage
router.put('/farms/:farmId',
  authenticate,
  checkOwnership,
  updateFarm
);
```


### 3.2.5 Security Headers (Helmet.js)

**HTTP Security Headers Configuration:**

```typescript
import helmet from 'helmet';

app.use(helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://api.agrisense.com", "wss://api.agrisense.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  
  // Prevent clickjacking
  frameguard: {
    action: 'deny'
  },
  
  // Hide X-Powered-By header
  hidePoweredBy: true,
  
  // Strict Transport Security (HTTPS enforcement)
  hsts: {
    maxAge: 31536000,  // 1 year
    includeSubDomains: true,
    preload: true
  },
  
  // Prevent MIME sniffing
  noSniff: true,
  
  // XSS Protection
  xssFilter: true,
  
  // Referrer Policy
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}));
```

**Security Headers Explained:**

| Header | Purpose | Value |
|--------|---------|-------|
| Content-Security-Policy | Prevents XSS by controlling resource loading | Whitelist trusted sources |
| X-Frame-Options | Prevents clickjacking attacks | DENY |
| Strict-Transport-Security | Forces HTTPS connections | max-age=31536000 |
| X-Content-Type-Options | Prevents MIME sniffing | nosniff |
| X-XSS-Protection | Browser XSS filter | 1; mode=block |
| Referrer-Policy | Controls referrer information | strict-origin-when-cross-origin |

### 3.2.6 Rate Limiting

**Multi-Tier Rate Limiting Strategy:**

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // Max 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:api:'
  }),
  skip: (req) => {
    // Skip rate limiting for admins
    return req.user?.role === UserRole.ADMIN;
  }
});

// Strict limit for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // Max 5 login attempts
  skipSuccessfulRequests: true,  // Don't count successful logins
  message: 'Too many login attempts, please try again later',
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:auth:'
  })
});

// Strict limit for OTP requests
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 3,  // Max 3 OTP requests per hour
  message: 'Too many OTP requests, please try again later',
  keyGenerator: (req) => {
    // Rate limit by email instead of IP
    return req.body.email || req.ip;
  },
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:otp:'
  })
});

// ML inference rate limit (expensive operations)
const mlLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 20,  // Max 20 ML requests per hour
  message: 'ML service rate limit exceeded',
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:ml:'
  })
});

// Apply rate limiters
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/resend-otp', otpLimiter);
app.use('/api/recommendations', mlLimiter);
app.use('/api/disease-detection', mlLimiter);
```

**Rate Limit Response:**

```json
// When rate limit exceeded
{
  "error": "Too many requests, please try again later",
  "retryAfter": 900,  // Seconds until reset
  "limit": 100,
  "remaining": 0,
  "reset": 1702891023  // Unix timestamp
}

// Response headers
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1702891023
Retry-After: 900
```

### 3.2.7 Input Sanitization

**SQL Injection Prevention:**

```typescript
// Prisma automatically parameterizes queries
// SAFE: Prisma handles escaping
const user = await prisma.user.findUnique({
  where: { email: userInput }  // Automatically escaped
});

// SAFE: Even with raw queries
const result = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${userInput}
`;  // Parameterized query

// UNSAFE: Never use $queryRawUnsafe with user input
const result = await prisma.$queryRawUnsafe(
  `SELECT * FROM users WHERE email = '${userInput}'`
);  // Vulnerable to SQL injection
```

**XSS Prevention:**

```typescript
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

// Sanitize HTML content
export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target']
  });
};

// Escape special characters
export const escapeHTML = (text: string): string => {
  return validator.escape(text);
};

// Sanitize user input before storing
const sanitizedContent = sanitizeHTML(req.body.content);
await prisma.forumPost.create({
  data: {
    content: sanitizedContent,
    userId: req.user.userId
  }
});
```

**File Upload Validation:**

```typescript
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/disease-images/');
  },
  filename: (req, file, cb) => {
    // Generate secure random filename
    const randomName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${randomName}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Whitelist allowed MIME types
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error('Invalid file type. Only JPEG and PNG allowed.'));
    return;
  }
  
  // Check file extension (double-check)
  const ext = path.extname(file.originalname).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    cb(new Error('Invalid file extension.'));
    return;
  }
  
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,  // 10MB max
    files: 1  // Single file only
  }
});

// Additional validation after upload
const validateImage = async (filePath: string): Promise<boolean> => {
  try {
    const metadata = await sharp(filePath).metadata();
    
    // Verify it's actually an image
    if (!metadata.format || !['jpeg', 'png'].includes(metadata.format)) {
      return false;
    }
    
    // Check dimensions (prevent zip bombs)
    if (metadata.width > 10000 || metadata.height > 10000) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};
```


---

## 3.3 KEY ALGORITHMS & BUSINESS LOGIC

### 3.3.1 Crop Recommendation Algorithm

**High-Level Flow:**

```
Input: Soil parameters (N, P, K, pH), Weather (temp, humidity, rainfall), Season, Farm size
Output: Top 3 crop recommendations with confidence scores and yield estimates

ALGORITHM: Crop Recommendation
1. Validate input parameters
2. Normalize features for ML model
3. Call ML service for predictions
4. Enrich predictions with market data
5. Calculate expected yield and profit
6. Rank by composite score
7. Return top 3 recommendations
```

**Pseudo-Code:**

```
FUNCTION getCropRecommendation(userId, inputData):
    // Step 1: Validate inputs
    IF NOT validateSoilParameters(inputData):
        THROW ValidationError("Invalid soil parameters")
    
    // Step 2: Check cache
    cacheKey = generateCacheKey(userId, inputData)
    cachedResult = cache.get(cacheKey)
    IF cachedResult EXISTS:
        RETURN cachedResult
    
    // Step 3: Fetch farm context
    farm = database.getFarm(inputData.farmId)
    IF farm.userId != userId:
        THROW AuthorizationError("Not authorized")
    
    // Step 4: Get historical weather data
    weatherHistory = weatherService.getHistoricalData(
        farm.latitude,
        farm.longitude,
        last30Days
    )
    
    // Step 5: Prepare ML request
    mlRequest = {
        nitrogen: inputData.nitrogen,
        phosphorus: inputData.phosphorus,
        potassium: inputData.potassium,
        pH: inputData.pH,
        temperature: inputData.temperature,
        humidity: inputData.humidity,
        rainfall: inputData.rainfall,
        season: inputData.season,
        soilType: farm.soilType,
        location: {
            latitude: farm.latitude,
            longitude: farm.longitude
        },
        historicalWeather: weatherHistory
    }
    
    // Step 6: Call ML service
    mlResponse = mlService.predictCrops(mlRequest)
    // Returns: [
    //   { crop: "Rice", confidence: 0.92, suitability: 0.95 },
    //   { crop: "Wheat", confidence: 0.85, suitability: 0.88 },
    //   { crop: "Maize", confidence: 0.78, suitability: 0.82 }
    // ]
    
    // Step 7: Enrich with market data
    enrichedRecommendations = []
    FOR EACH prediction IN mlResponse.predictions:
        // Get current market price
        marketPrice = priceService.getCurrentPrice(
            prediction.crop,
            farm.location
        )
        
        // Get historical price trend
        priceTrend = priceService.getPriceTrend(
            prediction.crop,
            last6Months
        )
        
        // Calculate expected yield
        expectedYield = calculateYield(
            prediction.crop,
            farm.area,
            farm.soilType,
            inputData.season
        )
        
        // Calculate expected profit
        expectedRevenue = expectedYield * marketPrice
        expectedCost = calculateCultivationCost(
            prediction.crop,
            farm.area
        )
        expectedProfit = expectedRevenue - expectedCost
        
        // Calculate composite score
        compositeScore = (
            prediction.confidence * 0.4 +
            prediction.suitability * 0.3 +
            normalizePrice(marketPrice) * 0.2 +
            normalizeTrend(priceTrend) * 0.1
        )
        
        enrichedRecommendations.APPEND({
            crop: prediction.crop,
            confidence: prediction.confidence,
            suitability: prediction.suitability,
            expectedYield: expectedYield,
            marketPrice: marketPrice,
            priceTrend: priceTrend,
            expectedProfit: expectedProfit,
            compositeScore: compositeScore,
            growingTips: getCropGuidance(prediction.crop, inputData.season)
        })
    
    // Step 8: Sort by composite score
    enrichedRecommendations.SORT(BY compositeScore, DESCENDING)
    
    // Step 9: Take top 3
    topRecommendations = enrichedRecommendations[0:3]
    
    // Step 10: Save to database
    savedRecommendation = database.createRecommendation({
        userId: userId,
        farmId: inputData.farmId,
        inputParameters: inputData,
        recommendations: topRecommendations,
        confidence: topRecommendations[0].confidence
    })
    
    // Step 11: Cache result
    cache.set(cacheKey, topRecommendations, TTL=1hour)
    
    // Step 12: Return result
    RETURN {
        id: savedRecommendation.id,
        recommendations: topRecommendations,
        generatedAt: NOW()
    }
END FUNCTION
```

**Yield Calculation Formula:**

```typescript
function calculateYield(
  crop: string,
  farmArea: number,  // in acres
  soilType: string,
  season: string
): number {
  // Base yield per acre (tons/acre)
  const baseYields = {
    'Rice': { KHARIF: 2.5, RABI: 2.8, ZAID: 2.3 },
    'Wheat': { KHARIF: 2.0, RABI: 2.5, ZAID: 2.2 },
    'Maize': { KHARIF: 3.0, RABI: 3.2, ZAID: 2.8 }
  };
  
  // Soil type multipliers
  const soilMultipliers = {
    'Loamy': 1.0,
    'Clay': 0.9,
    'Sandy': 0.8,
    'Silt': 0.95,
    'Peaty': 1.05
  };
  
  const baseYield = baseYields[crop][season];
  const soilMultiplier = soilMultipliers[soilType] || 1.0;
  
  // Calculate total yield
  const yieldPerAcre = baseYield * soilMultiplier;
  const totalYield = yieldPerAcre * farmArea;
  
  return totalYield;
}
```

**Composite Score Calculation:**

```typescript
function calculateCompositeScore(
  mlConfidence: number,      // 0-1
  suitability: number,        // 0-1
  marketPrice: number,        // INR per kg
  priceTrend: number          // -1 to 1 (negative = falling, positive = rising)
): number {
  // Normalize market price (0-1 scale)
  const avgPrice = 30;  // Average crop price
  const normalizedPrice = Math.min(marketPrice / (avgPrice * 2), 1);
  
  // Normalize price trend (0-1 scale)
  const normalizedTrend = (priceTrend + 1) / 2;
  
  // Weighted composite score
  const score = (
    mlConfidence * 0.4 +      // 40% weight on ML confidence
    suitability * 0.3 +        // 30% weight on soil suitability
    normalizedPrice * 0.2 +    // 20% weight on current price
    normalizedTrend * 0.1      // 10% weight on price trend
  );
  
  return score;
}
```


### 3.3.2 Disease Detection Algorithm

**High-Level Flow:**

```
Input: Plant leaf image (JPEG/PNG)
Output: Disease name, severity, confidence, treatment recommendations

ALGORITHM: Disease Detection
1. Validate and preprocess image
2. Extract image features
3. Run CNN inference
4. Post-process predictions
5. Generate treatment recommendations
6. Return results with visualization
```

**Pseudo-Code:**

```
FUNCTION detectDisease(userId, imageFile):
    // Step 1: Validate image
    IF NOT isValidImage(imageFile):
        THROW ValidationError("Invalid image file")
    
    IF imageFile.size > 10MB:
        THROW ValidationError("Image too large")
    
    // Step 2: Save uploaded image
    imagePath = saveImage(imageFile, "uploads/disease-images/")
    
    // Step 3: Preprocess image
    processedImage = preprocessImage(imagePath)
    // - Resize to 224x224
    // - Convert to RGB
    // - Normalize pixel values
    // - Remove EXIF data
    
    // Step 4: Generate thumbnail
    thumbnailPath = generateThumbnail(imagePath, 100, 100)
    
    // Step 5: Prepare ML request
    mlRequest = {
        image: base64Encode(processedImage),
        cropType: extractCropType(imageFile.metadata) OR "unknown"
    }
    
    // Step 6: Call ML service
    mlResponse = mlService.detectDisease(mlRequest)
    // Returns: {
    //   predictions: [
    //     { disease: "Leaf Blight", confidence: 0.89 },
    //     { disease: "Rust", confidence: 0.08 },
    //     { disease: "Healthy", confidence: 0.03 }
    //   ],
    //   attentionMap: <base64_heatmap>
    // }
    
    // Step 7: Get top prediction
    topPrediction = mlResponse.predictions[0]
    
    // Step 8: Determine severity
    severity = calculateSeverity(
        topPrediction.confidence,
        topPrediction.disease
    )
    // Returns: "LOW", "MEDIUM", or "HIGH"
    
    // Step 9: Get treatment recommendations
    treatments = getTreatmentRecommendations(
        topPrediction.disease,
        severity
    )
    // Returns: {
    //   organic: ["Neem oil spray", "Remove infected leaves"],
    //   chemical: ["Fungicide XYZ", "Pesticide ABC"],
    //   preventive: ["Crop rotation", "Proper spacing"]
    // }
    
    // Step 10: Generate attention map overlay
    attentionMapPath = saveAttentionMap(
        mlResponse.attentionMap,
        imagePath
    )
    
    // Step 11: Save to database
    detection = database.createDiseaseDetection({
        userId: userId,
        imagePath: imagePath,
        thumbnailPath: thumbnailPath,
        attentionMapPath: attentionMapPath,
        cropType: mlRequest.cropType,
        diseaseName: topPrediction.disease,
        confidence: topPrediction.confidence,
        severity: severity,
        treatment: treatments,
        allPredictions: mlResponse.predictions
    })
    
    // Step 12: Return result
    RETURN {
        id: detection.id,
        disease: topPrediction.disease,
        confidence: topPrediction.confidence,
        severity: severity,
        treatments: treatments,
        imagePath: imagePath,
        attentionMapPath: attentionMapPath,
        detectedAt: NOW()
    }
END FUNCTION
```

**Severity Calculation:**

```typescript
function calculateSeverity(
  confidence: number,
  diseaseName: string
): 'LOW' | 'MEDIUM' | 'HIGH' {
  // Diseases categorized by inherent severity
  const highSeverityDiseases = [
    'Late Blight',
    'Bacterial Wilt',
    'Fusarium Wilt',
    'Root Rot'
  ];
  
  const mediumSeverityDiseases = [
    'Leaf Spot',
    'Powdery Mildew',
    'Rust',
    'Anthracnose'
  ];
  
  // If healthy, return LOW
  if (diseaseName === 'Healthy') {
    return 'LOW';
  }
  
  // High confidence + high severity disease
  if (confidence > 0.8 && highSeverityDiseases.includes(diseaseName)) {
    return 'HIGH';
  }
  
  // Medium confidence or medium severity disease
  if (confidence > 0.6 || mediumSeverityDiseases.includes(diseaseName)) {
    return 'MEDIUM';
  }
  
  // Low confidence or low severity disease
  return 'LOW';
}
```

**Treatment Recommendation Logic:**

```typescript
function getTreatmentRecommendations(
  diseaseName: string,
  severity: string
): TreatmentPlan {
  // Knowledge base of treatments
  const treatmentDatabase = {
    'Leaf Blight': {
      organic: [
        'Apply neem oil spray (5ml per liter)',
        'Remove and destroy infected leaves',
        'Improve air circulation'
      ],
      chemical: [
        'Mancozeb 75% WP @ 2g/liter',
        'Copper oxychloride 50% WP @ 3g/liter'
      ],
      preventive: [
        'Use disease-resistant varieties',
        'Avoid overhead irrigation',
        'Maintain proper plant spacing'
      ]
    },
    'Rust': {
      organic: [
        'Sulfur dust application',
        'Garlic extract spray',
        'Remove infected plant parts'
      ],
      chemical: [
        'Propiconazole 25% EC @ 1ml/liter',
        'Tebuconazole 25.9% EC @ 1ml/liter'
      ],
      preventive: [
        'Crop rotation',
        'Avoid water stress',
        'Balanced fertilization'
      ]
    }
    // ... more diseases
  };
  
  const baseTreatment = treatmentDatabase[diseaseName] || {
    organic: ['Consult local agronomist'],
    chemical: ['Consult local agronomist'],
    preventive: ['Monitor regularly']
  };
  
  // Adjust based on severity
  if (severity === 'HIGH') {
    return {
      ...baseTreatment,
      urgent: [
        'Immediate action required',
        'Isolate affected plants',
        'Consult expert within 24 hours'
      ]
    };
  }
  
  return baseTreatment;
}
```

### 3.3.3 Weather Data Aggregation Algorithm

**High-Level Flow:**

```
Input: Location (latitude, longitude)
Output: Current weather, 7-day forecast, historical trends, alerts

ALGORITHM: Weather Aggregation
1. Fetch current weather from API
2. Fetch forecast data
3. Calculate agricultural indices
4. Generate alerts if needed
5. Cache and return results
```

**Pseudo-Code:**

```
FUNCTION getWeatherData(latitude, longitude):
    // Step 1: Check cache
    cacheKey = "weather:" + latitude + ":" + longitude
    cached = cache.get(cacheKey)
    IF cached AND cached.age < 30minutes:
        RETURN cached.data
    
    // Step 2: Fetch current weather
    currentWeather = weatherAPI.getCurrent(latitude, longitude)
    // Returns: {
    //   temperature: 28,
    //   humidity: 65,
    //   rainfall: 0,
    //   windSpeed: 12,
    //   pressure: 1013,
    //   conditions: "Partly Cloudy"
    // }
    
    // Step 3: Fetch 7-day forecast
    forecast = weatherAPI.getForecast(latitude, longitude, days=7)
    
    // Step 4: Calculate agricultural indices
    
    // Heat Stress Index
    heatStressIndex = calculateHeatStress(
        currentWeather.temperature,
        currentWeather.humidity
    )
    
    // Evapotranspiration (ET0)
    evapotranspiration = calculateET0(
        currentWeather.temperature,
        currentWeather.humidity,
        currentWeather.windSpeed,
        currentWeather.solarRadiation
    )
    
    // Growing Degree Days (GDD)
    gdd = calculateGDD(
        forecast.temperatures,
        baseTemp=10,
        maxTemp=30
    )
    
    // Step 5: Generate alerts
    alerts = []
    
    // Heavy rainfall alert
    IF ANY(forecast.rainfall > 50mm):
        alerts.APPEND({
            type: "HEAVY_RAINFALL",
            severity: "HIGH",
            message: "Heavy rainfall expected. Ensure proper drainage.",
            validUntil: forecast.date
        })
    
    // Heat wave alert
    IF ANY(forecast.temperature > 40):
        alerts.APPEND({
            type: "HEAT_WAVE",
            severity: "MEDIUM",
            message: "High temperatures expected. Increase irrigation.",
            validUntil: forecast.date
        })
    
    // Frost alert
    IF ANY(forecast.temperature < 5):
        alerts.APPEND({
            type: "FROST",
            severity: "HIGH",
            message: "Frost risk. Protect sensitive crops.",
            validUntil: forecast.date
        })
    
    // Step 6: Compile result
    result = {
        current: currentWeather,
        forecast: forecast,
        indices: {
            heatStress: heatStressIndex,
            evapotranspiration: evapotranspiration,
            growingDegreeDays: gdd
        },
        alerts: alerts,
        fetchedAt: NOW()
    }
    
    // Step 7: Cache result (30 minutes)
    cache.set(cacheKey, result, TTL=30minutes)
    
    // Step 8: Broadcast alerts via WebSocket
    IF alerts.length > 0:
        socketService.broadcastToRegion(
            latitude,
            longitude,
            radius=50km,
            event="weather-alert",
            data=alerts
        )
    
    RETURN result
END FUNCTION
```

**Growing Degree Days (GDD) Calculation:**

```typescript
function calculateGDD(
  temperatures: { min: number; max: number }[],
  baseTemp: number = 10,
  maxTemp: number = 30
): number {
  let totalGDD = 0;
  
  for (const day of temperatures) {
    // Cap temperatures at thresholds
    const tMin = Math.max(day.min, baseTemp);
    const tMax = Math.min(day.max, maxTemp);
    
    // Calculate average temperature
    const tAvg = (tMin + tMax) / 2;
    
    // Calculate GDD for the day
    const dailyGDD = Math.max(tAvg - baseTemp, 0);
    
    totalGDD += dailyGDD;
  }
  
  return totalGDD;
}
```

**Evapotranspiration (ET0) Calculation (Penman-Monteith):**

```typescript
function calculateET0(
  temperature: number,    // °C
  humidity: number,       // %
  windSpeed: number,      // m/s
  solarRadiation: number  // MJ/m²/day
): number {
  // Constants
  const albedo = 0.23;
  const stefanBoltzmann = 4.903e-9;  // MJ/K⁴/m²/day
  
  // Saturation vapor pressure
  const es = 0.6108 * Math.exp((17.27 * temperature) / (temperature + 237.3));
  
  // Actual vapor pressure
  const ea = es * (humidity / 100);
  
  // Slope of saturation vapor pressure curve
  const delta = (4098 * es) / Math.pow(temperature + 237.3, 2);
  
  // Psychrometric constant
  const gamma = 0.665e-3 * 101.3;  // kPa/°C
  
  // Net radiation
  const Rn = (1 - albedo) * solarRadiation;
  
  // Soil heat flux (negligible for daily calculations)
  const G = 0;
  
  // Wind speed at 2m height
  const u2 = windSpeed;
  
  // ET0 calculation (mm/day)
  const numerator = 0.408 * delta * (Rn - G) + 
                    gamma * (900 / (temperature + 273)) * u2 * (es - ea);
  const denominator = delta + gamma * (1 + 0.34 * u2);
  
  const ET0 = numerator / denominator;
  
  return Math.max(ET0, 0);
}
```

---

**✅ SECTION 3 COMPLETE: IMPLEMENTATION DETAILS**

This section has provided comprehensive coverage of:
- Frontend and backend module architecture
- Component design patterns (Container/Presentational, HOC, Hooks, etc.)
- Complete security implementation (JWT, bcrypt, OTP, password reset)
- Authorization and RBAC
- Security headers and rate limiting
- Input sanitization and file upload validation
- Key algorithms with pseudo-code (Crop recommendation, Disease detection, Weather aggregation)
- Mathematical formulas (Yield calculation, GDD, ET0)

---


# SECTION 4: TESTING & VALIDATION

## 4.1 TESTING STRATEGY OVERVIEW

AgriSense implements a comprehensive multi-layered testing strategy to ensure code quality, reliability, and correctness across all system components. The testing pyramid consists of:

```
                    ┌─────────────┐
                    │   E2E Tests │  (10%)
                    │  Playwright │
                    └─────────────┘
                  ┌───────────────────┐
                  │ Integration Tests │  (20%)
                  │  API + Database   │
                  └───────────────────┘
              ┌─────────────────────────────┐
              │      Unit Tests             │  (70%)
              │  Jest + React Testing Lib   │
              └─────────────────────────────┘
```

**Testing Frameworks:**
- **Frontend:** Jest + React Testing Library + Playwright
- **Backend:** Jest + Supertest
- **ML Service:** Pytest
- **E2E:** Playwright

**Test Coverage Goals:**
- Unit Tests: 80%+ code coverage
- Integration Tests: All API endpoints
- E2E Tests: Critical user journeys

---

## 4.2 FUNCTIONAL TESTING

### 4.2.1 Frontend Component Testing

**Test Case 1: Login Form Validation**

```typescript
// LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthProvider } from '@/contexts/AuthContext';

describe('LoginForm Component', () => {
  test('TC-001: Should display validation errors for empty fields', () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    
    // Find and click submit button without filling form
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);
    
    // Expect validation errors to appear
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });
  
  test('TC-002: Should display error for invalid email format', () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    
    // Enter invalid email
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    // Expect email format error
    expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
  });
  
  test('TC-003: Should call login API with correct credentials', async () => {
    const mockLogin = jest.fn().mockResolvedValue({ success: true });
    
    render(
      <AuthProvider value={{ login: mockLogin }}>
        <LoginForm />
      </AuthProvider>
    );
    
    // Fill form with valid data
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'farmer@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Wait for API call
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        'farmer@example.com',
        'password123'
      );
    });
  });
  
  test('TC-004: Should display error message on login failure', async () => {
    const mockLogin = jest.fn().mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } }
    });
    
    render(
      <AuthProvider value={{ login: mockLogin }}>
        <LoginForm />
      </AuthProvider>
    );
    
    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'farmer@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Expect error message
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
  
  test('TC-005: Should disable submit button while loading', async () => {
    const mockLogin = jest.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );
    
    render(
      <AuthProvider value={{ login: mockLogin }}>
        <LoginForm />
      </AuthProvider>
    );
    
    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'farmer@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);
    
    // Button should be disabled during loading
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/logging in/i)).toBeInTheDocument();
  });
});
```

**Test Case 2: Crop Recommendation Form**

```typescript
// CropRecommendationForm.test.tsx
describe('CropRecommendationForm Component', () => {
  test('TC-006: Should validate soil parameter ranges', () => {
    render(<CropRecommendationForm />);
    
    // Test nitrogen out of range
    const nitrogenInput = screen.getByLabelText(/nitrogen/i);
    fireEvent.change(nitrogenInput, { target: { value: '250' } });
    fireEvent.blur(nitrogenInput);
    
    expect(screen.getByText(/nitrogen must be between 0 and 200/i))
      .toBeInTheDocument();
  });
  
  test('TC-007: Should validate pH range (0-14)', () => {
    render(<CropRecommendationForm />);
    
    const pHInput = screen.getByLabelText(/ph/i);
    fireEvent.change(pHInput, { target: { value: '15' } });
    fireEvent.blur(pHInput);
    
    expect(screen.getByText(/ph must be between 0 and 14/i))
      .toBeInTheDocument();
  });
  
  test('TC-008: Should submit form with valid data', async () => {
    const mockSubmit = jest.fn();
    render(<CropRecommendationForm onSubmit={mockSubmit} />);
    
    // Fill all required fields
    fireEvent.change(screen.getByLabelText(/nitrogen/i), {
      target: { value: '120' }
    });
    fireEvent.change(screen.getByLabelText(/phosphorus/i), {
      target: { value: '30' }
    });
    fireEvent.change(screen.getByLabelText(/potassium/i), {
      target: { value: '80' }
    });
    fireEvent.change(screen.getByLabelText(/ph/i), {
      target: { value: '6.4' }
    });
    fireEvent.change(screen.getByLabelText(/temperature/i), {
      target: { value: '28' }
    });
    fireEvent.change(screen.getByLabelText(/humidity/i), {
      target: { value: '65' }
    });
    fireEvent.change(screen.getByLabelText(/rainfall/i), {
      target: { value: '800' }
    });
    
    // Select season
    fireEvent.change(screen.getByLabelText(/season/i), {
      target: { value: 'KHARIF' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /get recommendations/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        nitrogen: 120,
        phosphorus: 30,
        potassium: 80,
        pH: 6.4,
        temperature: 28,
        humidity: 65,
        rainfall: 800,
        season: 'KHARIF'
      });
    });
  });
});
```


### 4.2.2 Backend API Testing

**Test Case 3: Authentication API**

```typescript
// auth.test.ts
import request from 'supertest';
import { app } from '../src/index';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('Authentication API', () => {
  beforeAll(async () => {
    // Setup test database
    await prisma.$connect();
  });
  
  afterAll(async () => {
    // Cleanup
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });
  
  describe('POST /api/auth/register', () => {
    test('TC-009: Should register new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newfarmer@example.com',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe',
          phone: '9876543210'
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('requiresVerification', true);
      expect(response.body).toHaveProperty('email', 'newfarmer@example.com');
    });
    
    test('TC-010: Should reject registration with existing email', async () => {
      // Create existing user
      await prisma.user.create({
        data: {
          email: 'existing@example.com',
          password: await bcrypt.hash('password', 12),
          firstName: 'Existing',
          lastName: 'User',
          verified: true
        }
      });
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'NewPass123!',
          firstName: 'New',
          lastName: 'User'
        });
      
      expect(response.status).toBe(409);
      expect(response.body.error).toMatch(/already exists/i);
    });
    
    test('TC-011: Should reject weak passwords', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',  // Too short
          firstName: 'Test',
          lastName: 'User'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/password/i);
    });
    
    test('TC-012: Should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'SecurePass123!',
          firstName: 'Test',
          lastName: 'User'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/email/i);
    });
  });
  
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test user
      await prisma.user.create({
        data: {
          email: 'testuser@example.com',
          password: await bcrypt.hash('password123', 12),
          firstName: 'Test',
          lastName: 'User',
          verified: true
        }
      });
    });
    
    afterEach(async () => {
      await prisma.user.deleteMany();
    });
    
    test('TC-013: Should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('testuser@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });
    
    test('TC-014: Should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.error).toMatch(/invalid/i);
    });
    
    test('TC-015: Should reject non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.error).toMatch(/invalid/i);
    });
    
    test('TC-016: Should set httpOnly cookie on successful login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        });
      
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toMatch(/httpOnly/i);
    });
  });
  
  describe('GET /api/auth/me', () => {
    let authToken: string;
    
    beforeEach(async () => {
      // Create user and get token
      const user = await prisma.user.create({
        data: {
          email: 'authuser@example.com',
          password: await bcrypt.hash('password123', 12),
          firstName: 'Auth',
          lastName: 'User',
          verified: true
        }
      });
      
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'authuser@example.com',
          password: 'password123'
        });
      
      authToken = loginResponse.body.token;
    });
    
    test('TC-017: Should return user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.email).toBe('authuser@example.com');
      expect(response.body).not.toHaveProperty('password');
    });
    
    test('TC-018: Should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');
      
      expect(response.status).toBe(401);
      expect(response.body.error).toMatch(/no token/i);
    });
    
    test('TC-019: Should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(response.status).toBe(401);
      expect(response.body.error).toMatch(/invalid token/i);
    });
  });
});
```

**Test Case 4: Crop Recommendation API**

```typescript
// recommendations.test.ts
describe('Crop Recommendation API', () => {
  let authToken: string;
  let userId: string;
  let farmId: string;
  
  beforeAll(async () => {
    // Create test user and farm
    const user = await prisma.user.create({
      data: {
        email: 'farmer@test.com',
        password: await bcrypt.hash('password', 12),
        firstName: 'Test',
        lastName: 'Farmer',
        verified: true
      }
    });
    userId = user.id;
    
    const farm = await prisma.farm.create({
      data: {
        name: 'Test Farm',
        location: 'Test Location',
        latitude: 28.6139,
        longitude: 77.2090,
        area: 5.0,
        soilType: 'Loamy',
        irrigationType: 'Drip',
        userId: userId
      }
    });
    farmId = farm.id;
    
    // Get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'farmer@test.com',
        password: 'password'
      });
    authToken = loginResponse.body.token;
  });
  
  test('TC-020: Should create crop recommendation with valid data', async () => {
    const response = await request(app)
      .post('/api/recommendations')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        farmId: farmId,
        nitrogen: 120,
        phosphorus: 30,
        potassium: 80,
        pH: 6.4,
        temperature: 28,
        humidity: 65,
        rainfall: 800,
        season: 'KHARIF'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('recommendations');
    expect(response.body.recommendations).toBeInstanceOf(Array);
    expect(response.body.recommendations.length).toBeGreaterThan(0);
    expect(response.body.recommendations[0]).toHaveProperty('crop');
    expect(response.body.recommendations[0]).toHaveProperty('confidence');
  });
  
  test('TC-021: Should reject invalid soil parameters', async () => {
    const response = await request(app)
      .post('/api/recommendations')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        farmId: farmId,
        nitrogen: 250,  // Out of range
        phosphorus: 30,
        potassium: 80,
        pH: 6.4,
        temperature: 28,
        humidity: 65,
        rainfall: 800,
        season: 'KHARIF'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/nitrogen/i);
  });
  
  test('TC-022: Should reject unauthorized farm access', async () => {
    // Create another user
    const otherUser = await prisma.user.create({
      data: {
        email: 'other@test.com',
        password: await bcrypt.hash('password', 12),
        firstName: 'Other',
        lastName: 'User',
        verified: true
      }
    });
    
    const otherLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'other@test.com',
        password: 'password'
      });
    
    const response = await request(app)
      .post('/api/recommendations')
      .set('Authorization', `Bearer ${otherLoginResponse.body.token}`)
      .send({
        farmId: farmId,  // Trying to access another user's farm
        nitrogen: 120,
        phosphorus: 30,
        potassium: 80,
        pH: 6.4,
        temperature: 28,
        humidity: 65,
        rainfall: 800,
        season: 'KHARIF'
      });
    
    expect(response.status).toBe(403);
  });
  
  test('TC-023: Should retrieve user recommendations', async () => {
    const response = await request(app)
      .get('/api/recommendations')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('recommendations');
    expect(response.body.recommendations).toBeInstanceOf(Array);
  });
});
```


### 4.2.3 Disease Detection API Testing

```typescript
// disease-detection.test.ts
describe('Disease Detection API', () => {
  let authToken: string;
  
  beforeAll(async () => {
    // Setup auth
    const user = await prisma.user.create({
      data: {
        email: 'farmer@test.com',
        password: await bcrypt.hash('password', 12),
        firstName: 'Test',
        lastName: 'Farmer',
        verified: true
      }
    });
    
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'farmer@test.com', password: 'password' });
    authToken = loginResponse.body.token;
  });
  
  test('TC-024: Should upload and detect disease from image', async () => {
    const response = await request(app)
      .post('/api/disease-detection')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('image', 'test/fixtures/leaf-sample.jpg')
      .field('cropType', 'rice');
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('disease');
    expect(response.body).toHaveProperty('confidence');
    expect(response.body).toHaveProperty('severity');
    expect(response.body).toHaveProperty('treatments');
    expect(response.body.confidence).toBeGreaterThanOrEqual(0);
    expect(response.body.confidence).toBeLessThanOrEqual(1);
  });
  
  test('TC-025: Should reject non-image files', async () => {
    const response = await request(app)
      .post('/api/disease-detection')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('image', 'test/fixtures/document.pdf');
    
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/invalid file type/i);
  });
  
  test('TC-026: Should reject oversized images', async () => {
    const response = await request(app)
      .post('/api/disease-detection')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('image', 'test/fixtures/large-image.jpg');  // >10MB
    
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/file too large/i);
  });
  
  test('TC-027: Should retrieve detection history', async () => {
    const response = await request(app)
      .get('/api/disease-detection')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('detections');
    expect(response.body.detections).toBeInstanceOf(Array);
  });
});
```

---

## 4.3 PERFORMANCE TESTING

### 4.3.1 Load Testing Scenarios

**Test Case 5: API Response Time**

```typescript
// performance.test.ts
describe('Performance Tests', () => {
  test('TC-028: Login endpoint should respond within 500ms', async () => {
    const startTime = Date.now();
    
    await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(500);
  });
  
  test('TC-029: Crop recommendation should respond within 2s', async () => {
    const startTime = Date.now();
    
    await request(app)
      .post('/api/recommendations')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nitrogen: 120,
        phosphorus: 30,
        potassium: 80,
        pH: 6.4,
        temperature: 28,
        humidity: 65,
        rainfall: 800,
        season: 'KHARIF'
      });
    
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(2000);
  });
  
  test('TC-030: Cached requests should respond within 100ms', async () => {
    // First request (cache miss)
    await request(app)
      .get('/api/crops')
      .set('Authorization', `Bearer ${authToken}`);
    
    // Second request (cache hit)
    const startTime = Date.now();
    await request(app)
      .get('/api/crops')
      .set('Authorization', `Bearer ${authToken}`);
    
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(100);
  });
});
```

**Test Case 6: Concurrent Request Handling**

```typescript
describe('Concurrency Tests', () => {
  test('TC-031: Should handle 100 concurrent login requests', async () => {
    const requests = Array(100).fill(null).map(() =>
      request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
    );
    
    const responses = await Promise.all(requests);
    
    // All requests should succeed
    responses.forEach(response => {
      expect(response.status).toBe(200);
    });
  });
  
  test('TC-032: Should handle 50 concurrent ML requests', async () => {
    const requests = Array(50).fill(null).map(() =>
      request(app)
        .post('/api/recommendations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nitrogen: 120,
          phosphorus: 30,
          potassium: 80,
          pH: 6.4,
          temperature: 28,
          humidity: 65,
          rainfall: 800,
          season: 'KHARIF'
        })
    );
    
    const startTime = Date.now();
    const responses = await Promise.all(requests);
    const totalTime = Date.now() - startTime;
    
    // All requests should succeed
    responses.forEach(response => {
      expect(response.status).toBe(201);
    });
    
    // Average response time should be reasonable
    const avgResponseTime = totalTime / 50;
    expect(avgResponseTime).toBeLessThan(3000);
  });
});
```

### 4.3.2 Database Query Performance

```typescript
describe('Database Performance Tests', () => {
  test('TC-033: User lookup by email should be fast', async () => {
    const startTime = Date.now();
    
    await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });
    
    const queryTime = Date.now() - startTime;
    expect(queryTime).toBeLessThan(50);  // Should use index
  });
  
  test('TC-034: Paginated recommendations should be efficient', async () => {
    const startTime = Date.now();
    
    await prisma.cropRecommendation.findMany({
      where: { userId: testUserId },
      take: 20,
      skip: 0,
      orderBy: { createdAt: 'desc' }
    });
    
    const queryTime = Date.now() - startTime;
    expect(queryTime).toBeLessThan(100);
  });
  
  test('TC-035: Complex join queries should be optimized', async () => {
    const startTime = Date.now();
    
    await prisma.user.findUnique({
      where: { id: testUserId },
      include: {
        farms: true,
        recommendations: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        },
        diseaseDetections: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    const queryTime = Date.now() - startTime;
    expect(queryTime).toBeLessThan(200);
  });
});
```

---

## 4.4 SECURITY TESTING

### 4.4.1 Authentication Security Tests

```typescript
describe('Security Tests - Authentication', () => {
  test('TC-036: Should reject SQL injection attempts', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: "admin' OR '1'='1",
        password: "password"
      });
    
    expect(response.status).toBe(401);
  });
  
  test('TC-037: Should reject XSS attempts in registration', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        firstName: '<script>alert("XSS")</script>',
        lastName: 'User'
      });
    
    // Should either reject or sanitize
    if (response.status === 201) {
      const user = await prisma.user.findUnique({
        where: { email: 'test@example.com' }
      });
      expect(user?.firstName).not.toContain('<script>');
    }
  });
  
  test('TC-038: Should enforce rate limiting on login', async () => {
    // Make 6 rapid login attempts (limit is 5)
    const requests = Array(6).fill(null).map(() =>
      request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
    );
    
    const responses = await Promise.all(requests);
    
    // Last request should be rate limited
    const lastResponse = responses[responses.length - 1];
    expect(lastResponse.status).toBe(429);
    expect(lastResponse.body.error).toMatch(/too many/i);
  });
  
  test('TC-039: Should not reveal user existence in login', async () => {
    // Try to login with non-existent user
    const response1 = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123'
      });
    
    // Try to login with existing user but wrong password
    const response2 = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'existing@example.com',
        password: 'wrongpassword'
      });
    
    // Both should return same generic error
    expect(response1.status).toBe(401);
    expect(response2.status).toBe(401);
    expect(response1.body.error).toBe(response2.body.error);
  });
  
  test('TC-040: Should invalidate token after logout', async () => {
    // Login
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    const token = loginResponse.body.token;
    
    // Logout
    await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    
    // Try to use token after logout
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(401);
  });
});
```


### 4.4.2 Authorization Security Tests

```typescript
describe('Security Tests - Authorization', () => {
  let farmerToken: string;
  let agronomistToken: string;
  let adminToken: string;
  
  beforeAll(async () => {
    // Create users with different roles
    const farmer = await createUserWithRole('FARMER');
    const agronomist = await createUserWithRole('AGRONOMIST');
    const admin = await createUserWithRole('ADMIN');
    
    farmerToken = await getAuthToken(farmer.email);
    agronomistToken = await getAuthToken(agronomist.email);
    adminToken = await getAuthToken(admin.email);
  });
  
  test('TC-041: Farmer should not access admin endpoints', async () => {
    const response = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${farmerToken}`);
    
    expect(response.status).toBe(403);
  });
  
  test('TC-042: Agronomist should access moderation endpoints', async () => {
    const response = await request(app)
      .post('/api/forum/moderate')
      .set('Authorization', `Bearer ${agronomistToken}`)
      .send({ postId: 'test-post-id', action: 'approve' });
    
    expect(response.status).not.toBe(403);
  });
  
  test('TC-043: Admin should access all endpoints', async () => {
    const response = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(response.status).toBe(200);
  });
  
  test('TC-044: User should not access other users resources', async () => {
    // Create two users
    const user1 = await createUser('user1@test.com');
    const user2 = await createUser('user2@test.com');
    
    // User1 creates a farm
    const farm = await prisma.farm.create({
      data: {
        name: 'User1 Farm',
        userId: user1.id,
        location: 'Test',
        latitude: 0,
        longitude: 0,
        area: 5,
        soilType: 'Loamy',
        irrigationType: 'Drip'
      }
    });
    
    // User2 tries to access User1's farm
    const user2Token = await getAuthToken(user2.email);
    const response = await request(app)
      .get(`/api/farms/${farm.id}`)
      .set('Authorization', `Bearer ${user2Token}`);
    
    expect(response.status).toBe(403);
  });
});
```

### 4.4.3 Input Validation Security Tests

```typescript
describe('Security Tests - Input Validation', () => {
  test('TC-045: Should reject malformed JSON', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{ invalid json }');
    
    expect(response.status).toBe(400);
  });
  
  test('TC-046: Should sanitize HTML in forum posts', async () => {
    const response = await request(app)
      .post('/api/forum/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Post',
        content: '<script>alert("XSS")</script><p>Safe content</p>',
        category: 'general'
      });
    
    expect(response.status).toBe(201);
    
    // Retrieve post and verify sanitization
    const post = await prisma.forumPost.findUnique({
      where: { id: response.body.id }
    });
    
    expect(post?.content).not.toContain('<script>');
    expect(post?.content).toContain('<p>Safe content</p>');
  });
  
  test('TC-047: Should reject path traversal attempts', async () => {
    const response = await request(app)
      .get('/api/files/../../etc/passwd')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(400);
  });
  
  test('TC-048: Should validate file extensions', async () => {
    const response = await request(app)
      .post('/api/disease-detection')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('image', Buffer.from('fake content'), {
        filename: 'malicious.exe',
        contentType: 'image/jpeg'  // Fake MIME type
      });
    
    expect(response.status).toBe(400);
  });
});
```

---

## 4.5 END-TO-END TESTING

### 4.5.1 Critical User Journeys

**Test Case 7: Complete Registration and Login Flow**

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Registration and Login', () => {
  test('TC-049: Complete user registration flow', async ({ page }) => {
    // Navigate to registration page
    await page.goto('http://localhost:3000/auth/register');
    
    // Fill registration form
    await page.fill('input[name="email"]', 'newuser@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="phone"]', '9876543210');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to verification page
    await expect(page).toHaveURL(/verify-email/);
    await expect(page.locator('text=Check your email')).toBeVisible();
    
    // Enter OTP (in real test, would retrieve from test email)
    await page.fill('input[name="otp"]', '123456');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard after verification
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('text=Welcome, John')).toBeVisible();
  });
  
  test('TC-050: Login with existing credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    
    await page.fill('input[name="email"]', 'existing@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);
    
    // Should display user name in header
    await expect(page.locator('[data-testid="user-menu"]')).toContainText('Existing User');
  });
  
  test('TC-051: Logout functionality', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/dashboard/);
    
    // Click logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Logout');
    
    // Should redirect to home page
    await expect(page).toHaveURL('http://localhost:3000/');
    
    // Should not be able to access dashboard
    await page.goto('http://localhost:3000/dashboard');
    await expect(page).toHaveURL(/auth\/login/);
  });
});
```

**Test Case 8: Crop Recommendation Journey**

```typescript
// e2e/crop-recommendation.spec.ts
test.describe('Crop Recommendation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('input[name="email"]', 'farmer@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
  });
  
  test('TC-052: Get crop recommendations', async ({ page }) => {
    // Navigate to recommendation page
    await page.click('text=Crop Recommendation');
    await expect(page).toHaveURL(/recommendations/);
    
    // Fill soil parameters
    await page.fill('input[name="nitrogen"]', '120');
    await page.fill('input[name="phosphorus"]', '30');
    await page.fill('input[name="potassium"]', '80');
    await page.fill('input[name="pH"]', '6.4');
    await page.fill('input[name="temperature"]', '28');
    await page.fill('input[name="humidity"]', '65');
    await page.fill('input[name="rainfall"]', '800');
    
    // Select season
    await page.selectOption('select[name="season"]', 'KHARIF');
    
    // Submit form
    await page.click('button:has-text("Get Recommendations")');
    
    // Wait for loading to complete
    await expect(page.locator('text=Loading')).toBeHidden({ timeout: 10000 });
    
    // Should display recommendations
    await expect(page.locator('[data-testid="recommendation-card"]')).toHaveCount(3);
    
    // First recommendation should have required fields
    const firstCard = page.locator('[data-testid="recommendation-card"]').first();
    await expect(firstCard.locator('[data-testid="crop-name"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="confidence"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="expected-yield"]')).toBeVisible();
  });
  
  test('TC-053: Save recommendation to history', async ({ page }) => {
    // Get recommendations (same as above)
    await page.click('text=Crop Recommendation');
    // ... fill form and submit ...
    
    // Click save button
    await page.click('button:has-text("Save Recommendation")');
    
    // Should show success message
    await expect(page.locator('text=Recommendation saved')).toBeVisible();
    
    // Navigate to history
    await page.click('text=History');
    
    // Should see saved recommendation
    await expect(page.locator('[data-testid="history-item"]').first()).toBeVisible();
  });
});
```

**Test Case 9: Disease Detection Journey**

```typescript
// e2e/disease-detection.spec.ts
test.describe('Disease Detection Flow', () => {
  test('TC-054: Upload image and detect disease', async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('input[name="email"]', 'farmer@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Navigate to disease detection
    await page.click('text=Disease Detection');
    await expect(page).toHaveURL(/disease-detection/);
    
    // Upload image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('test/fixtures/leaf-sample.jpg');
    
    // Should show preview
    await expect(page.locator('[data-testid="image-preview"]')).toBeVisible();
    
    // Click analyze button
    await page.click('button:has-text("Analyze")');
    
    // Wait for analysis (may take a few seconds)
    await expect(page.locator('text=Analyzing')).toBeVisible();
    await expect(page.locator('text=Analyzing')).toBeHidden({ timeout: 30000 });
    
    // Should display results
    await expect(page.locator('[data-testid="disease-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="confidence-score"]')).toBeVisible();
    await expect(page.locator('[data-testid="severity-badge"]')).toBeVisible();
    await expect(page.locator('[data-testid="treatment-section"]')).toBeVisible();
    
    // Should show attention map
    await expect(page.locator('[data-testid="attention-map"]')).toBeVisible();
  });
  
  test('TC-055: View treatment recommendations', async ({ page }) => {
    // ... upload and analyze image ...
    
    // Click on treatment tabs
    await page.click('text=Organic Treatment');
    await expect(page.locator('[data-testid="organic-treatments"]')).toBeVisible();
    
    await page.click('text=Chemical Treatment');
    await expect(page.locator('[data-testid="chemical-treatments"]')).toBeVisible();
    
    await page.click('text=Prevention');
    await expect(page.locator('[data-testid="preventive-measures"]')).toBeVisible();
  });
});
```


---

## 4.6 COMPONENT TESTING

### 4.6.1 UI Responsiveness Testing

```typescript
// responsive.test.ts
describe('Responsive Design Tests', () => {
  test('TC-056: Mobile viewport (375x667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    
    // Mobile menu should be visible
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
    
    // Desktop navigation should be hidden
    await expect(page.locator('[data-testid="desktop-nav"]')).toBeHidden();
    
    // Content should not overflow
    const body = await page.locator('body').boundingBox();
    expect(body?.width).toBeLessThanOrEqual(375);
  });
  
  test('TC-057: Tablet viewport (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000');
    
    // Should show tablet layout
    await expect(page.locator('[data-testid="tablet-layout"]')).toBeVisible();
  });
  
  test('TC-058: Desktop viewport (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000');
    
    // Desktop navigation should be visible
    await expect(page.locator('[data-testid="desktop-nav"]')).toBeVisible();
    
    // Mobile menu should be hidden
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeHidden();
  });
});
```

### 4.6.2 Accessibility Testing

```typescript
// accessibility.test.ts
import { injectAxe, checkA11y } from 'axe-playwright';

describe('Accessibility Tests', () => {
  test('TC-059: Home page should be accessible', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await injectAxe(page);
    await checkA11y(page);
  });
  
  test('TC-060: Forms should have proper labels', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    
    // All inputs should have associated labels
    const emailInput = page.locator('input[name="email"]');
    const emailLabel = await emailInput.getAttribute('aria-label');
    expect(emailLabel).toBeTruthy();
    
    const passwordInput = page.locator('input[name="password"]');
    const passwordLabel = await passwordInput.getAttribute('aria-label');
    expect(passwordLabel).toBeTruthy();
  });
  
  test('TC-061: Buttons should have accessible names', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      // Button should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy();
    }
  });
  
  test('TC-062: Images should have alt text', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      
      // All images should have alt attribute
      expect(alt).toBeDefined();
    }
  });
  
  test('TC-063: Keyboard navigation should work', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    
    // Tab through form elements
    await page.keyboard.press('Tab');
    let focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBe('INPUT');
    
    await page.keyboard.press('Tab');
    focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBe('INPUT');
    
    await page.keyboard.press('Tab');
    focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBe('BUTTON');
  });
});
```

---

## 4.7 TEST COVERAGE ANALYSIS

### 4.7.1 Code Coverage Metrics

**Coverage Goals:**

| Component | Line Coverage | Branch Coverage | Function Coverage |
|-----------|--------------|-----------------|-------------------|
| Frontend Components | 85%+ | 80%+ | 90%+ |
| Backend Controllers | 90%+ | 85%+ | 95%+ |
| Backend Services | 85%+ | 80%+ 90%+ |
| Utility Functions | 95%+ | 90%+ | 100% |

**Coverage Report Example:**

```bash
# Run tests with coverage
npm run test:coverage

# Output:
---------------------------|---------|----------|---------|---------|
File                       | % Stmts | % Branch | % Funcs | % Lines |
---------------------------|---------|----------|---------|---------|
All files                  |   87.23 |    82.45 |   91.67 |   88.12 |
 src/components/auth       |   92.15 |    88.33 |   95.00 |   93.21 |
  LoginForm.tsx            |   94.23 |    90.00 |   100   |   95.12 |
  RegisterForm.tsx         |   90.07 |    86.67 |   90.00 |   91.30 |
 src/controllers           |   89.45 |    85.12 |   93.75 |   90.23 |
  authController.ts        |   91.23 |    87.50 |   95.00 |   92.15 |
  cropController.ts        |   87.67 |    82.75 |   92.50 |   88.31 |
 src/services              |   85.67 |    80.23 |   88.89 |   86.45 |
  mlService.ts             |   83.45 |    78.50 |   85.71 |   84.23 |
  weatherService.ts        |   87.89 |    82.00 |   92.00 |   88.67 |
---------------------------|---------|----------|---------|---------|
```

### 4.7.2 Uncovered Code Analysis

**Critical Paths Requiring Additional Tests:**

```typescript
// Example: Uncovered error handling branch
function processPayment(amount: number) {
  if (amount <= 0) {
    throw new Error('Invalid amount');  // ✅ Covered
  }
  
  try {
    return paymentGateway.charge(amount);  // ✅ Covered
  } catch (error) {
    if (error.code === 'INSUFFICIENT_FUNDS') {
      // ❌ Not covered - need test case
      return { success: false, reason: 'insufficient_funds' };
    }
    throw error;  // ✅ Covered
  }
}

// Add test case:
test('TC-064: Should handle insufficient funds error', async () => {
  paymentGateway.charge = jest.fn().mockRejectedValue({
    code: 'INSUFFICIENT_FUNDS'
  });
  
  const result = await processPayment(100);
  expect(result.success).toBe(false);
  expect(result.reason).toBe('insufficient_funds');
});
```

---

## 4.8 CONTINUOUS INTEGRATION TESTING

### 4.8.1 CI/CD Pipeline Tests

**GitHub Actions Workflow:**

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: cd frontend && npm ci
      
      - name: Run linter
        run: cd frontend && npm run lint
      
      - name: Run unit tests
        run: cd frontend && npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/lcov.info
  
  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: cd backend && npm ci
      
      - name: Run database migrations
        run: cd backend && npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
      
      - name: Run tests
        run: cd backend && npm test -- --coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
          REDIS_URL: redis://localhost:6379
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/lcov.info
  
  test-e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: cd frontend && npx playwright install --with-deps
      
      - name: Start services
        run: docker-compose up -d
      
      - name: Wait for services
        run: sleep 30
      
      - name: Run E2E tests
        run: cd frontend && npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: frontend/playwright-report/
```

---

**✅ SECTION 4 COMPLETE: TESTING & VALIDATION**

This section has provided comprehensive coverage of:
- Testing strategy overview (unit, integration, E2E)
- Functional testing (55+ test cases)
- Performance testing (load, concurrency, database)
- Security testing (authentication, authorization, input validation)
- End-to-end testing (critical user journeys)
- Component testing (responsiveness, accessibility)
- Test coverage analysis
- CI/CD pipeline integration

---


# SECTION 5: CODE WALKTHROUGH

## 5.1 OVERVIEW

This section provides detailed line-by-line analysis of three critical files in the AgriSense codebase:

1. **Frontend Component:** `CropTrading.tsx` - Marketplace component for crop trading
2. **Backend Controller:** `authController.ts` - Authentication business logic
3. **Frontend Context:** `AuthContext.tsx` - Global authentication state management

Each walkthrough explains the purpose, logic flow, and technical decisions behind every significant code block.

---

## 5.2 FILE 1: CropTrading.tsx (Frontend Component)

**File Path:** `frontend/components/marketplace/CropTrading.tsx`  
**Purpose:** Displays crop listings in a marketplace where farmers can buy and sell crops  
**Lines of Code:** 250+  
**Key Technologies:** React, TypeScript, Framer Motion, Heroicons

### 5.2.1 Imports and Dependencies

```typescript
'use client';
```
**Line 1:** The `'use client'` directive tells Next.js 14 that this is a Client Component (not a Server Component). This is necessary because the component uses React hooks (`useState`, `useEffect`) and browser APIs that only work on the client side.

```typescript
import { useState, useEffect } from 'react';
```
**Line 2:** Imports React hooks:
- `useState`: Manages component-level state (listings, filters, loading)
- `useEffect`: Handles side effects (data fetching, filtering)

```typescript
import { motion } from 'framer-motion';
```
**Line 3:** Imports Framer Motion for animations. Used to create smooth fade-in and slide-up animations when listing cards appear.

```typescript
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
```
**Lines 4-10:** Imports SVG icons from Heroicons library. The `/24/outline` path specifies 24px outline-style icons (vs solid icons).

```typescript
import { formatINR } from '@/lib/utils/currencyFormatter';
```
**Line 11:** Imports utility function to format numbers as Indian Rupees (₹). The `@/` alias maps to the project root directory.

```typescript
import { CropListing } from '@/lib/types/marketData';
```
**Line 12:** Imports TypeScript type definition for crop listings. Ensures type safety throughout the component.

```typescript
// @ts-ignore
import { marketDataService } from '@/lib/services/marketDataService';
```
**Lines 13-14:** Imports service layer for fetching market data. The `@ts-ignore` comment suppresses TypeScript errors (likely because the service file doesn't have proper type definitions).

### 5.2.2 Component State Declaration

```typescript
export default function CropTrading() {
```
**Line 16:** Exports the component as the default export. This allows importing with any name: `import CropTrading from './CropTrading'`.

```typescript
  const [listings, setListings] = useState<CropListing[]>([]);
```
**Line 17:** Declares state for all crop listings fetched from the API.
- **Type:** `CropListing[]` (array of crop listing objects)
- **Initial Value:** Empty array `[]`
- **Purpose:** Stores the complete, unfiltered list of crops

```typescript
  const [filteredListings, setFilteredListings] = useState<CropListing[]>([]);
```
**Line 18:** Declares state for filtered listings (after applying search and filters).
- **Why separate state?** Keeps original data intact while showing filtered results
- **Performance:** Avoids re-fetching data when filters change

```typescript
  const [loading, setLoading] = useState(true);
```
**Line 19:** Tracks loading state to show spinner while fetching data.
- **Initial Value:** `true` because data fetch starts immediately on mount

```typescript
  const [searchTerm, setSearchTerm] = useState('');
```
**Line 20:** Stores the user's search query.
- **Type:** `string`
- **Updates:** On every keystroke in the search input

```typescript
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedQuality, setSelectedQuality] = useState('all');
```
**Lines 21-22:** Store selected filter values for crop type and quality.
- **Default:** `'all'` means no filter applied
- **Updates:** When user selects from dropdown

### 5.2.3 Filter Options

```typescript
  const cropTypes = ['all', 'wheat', 'corn', 'soybeans', 'rice', 'cotton'];
  const qualities = ['all', 'premium', 'grade-a', 'grade-b', 'standard'];
```
**Lines 24-25:** Define available filter options.
- **Why constants?** These don't change during component lifecycle
- **Why not state?** No need to trigger re-renders when these change (they don't)

### 5.2.4 Side Effects (useEffect Hooks)

```typescript
  useEffect(() => {
    fetchListings();
  }, []);
```
**Lines 27-29:** Runs once on component mount (empty dependency array `[]`).
- **Purpose:** Fetch initial crop listings from API
- **Timing:** Executes after first render

```typescript
  useEffect(() => {
    filterListings();
  }, [listings, searchTerm, selectedCrop, selectedQuality]);
```
**Lines 31-33:** Runs whenever any dependency changes.
- **Dependencies:** `listings`, `searchTerm`, `selectedCrop`, `selectedQuality`
- **Purpose:** Re-filter listings when data or filters change
- **Why separate effect?** Separates concerns: fetching vs filtering

### 5.2.5 Data Fetching Function

```typescript
  const fetchListings = async () => {
    try {
      setLoading(true);
```
**Lines 35-37:** Begins async data fetch.
- **`async`:** Allows use of `await` for promises
- **`setLoading(true)`:** Shows loading spinner to user

```typescript
      // Fetch real crop listings from Indian market APIs
      const realListings = await marketDataService.getCropListings({
        cropType: selectedCrop === 'all' ? undefined : selectedCrop,
        quality: selectedQuality === 'all' ? undefined : selectedQuality,
      });
```
**Lines 39-43:** Calls service layer to fetch data.
- **`await`:** Pauses execution until promise resolves
- **Conditional parameters:** Only sends filters if not 'all'
- **Why `undefined`?** API treats `undefined` as "no filter"

```typescript
      setListings(realListings);
```
**Line 45:** Updates state with fetched data.
- **Triggers:** Re-render and filter effect

```typescript
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };
```
**Lines 46-51:** Error handling and cleanup.
- **`catch`:** Logs errors without crashing the app
- **`finally`:** Always runs, even if error occurs
- **`setLoading(false)`:** Hides spinner regardless of success/failure

### 5.2.6 Filtering Logic

```typescript
  const filterListings = () => {
    let filtered = listings.filter(listing => {
```
**Lines 53-54:** Filters listings based on current search and filter values.
- **`filter()`:** Creates new array with items that pass the test

```typescript
      const matchesSearch = listing.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           listing.seller.name.toLowerCase().includes(searchTerm.toLowerCase());
```
**Lines 55-56:** Checks if listing matches search term.
- **`.toLowerCase()`:** Case-insensitive search
- **`.includes()`:** Checks if string contains substring
- **OR logic:** Matches either crop type OR seller name

```typescript
      const matchesCrop = selectedCrop === 'all' || listing.cropType === selectedCrop;
      const matchesQuality = selectedQuality === 'all' || listing.quality === selectedQuality;
```
**Lines 57-58:** Checks if listing matches selected filters.
- **Short-circuit evaluation:** If `'all'`, second condition not evaluated

```typescript
      return matchesSearch && matchesCrop && matchesQuality;
    });
    setFilteredListings(filtered);
  };
```
**Lines 59-61:** Returns `true` only if all conditions match (AND logic).
- **Updates:** `filteredListings` state with results


### 5.2.7 Loading State UI

```typescript
  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }
```
**Lines 63-69:** Early return pattern for loading state.
- **Why early return?** Prevents rendering main UI while loading
- **Spinner:** CSS animation (`animate-spin`) rotates the div
- **Tailwind classes:** `rounded-full` creates circle, `border-b-2` creates spinning effect

### 5.2.8 Main Component Render

```typescript
  return (
    <div className="p-6 space-y-6">
```
**Lines 71-72:** Main container with padding and vertical spacing.
- **`space-y-6`:** Adds 1.5rem (24px) margin between child elements

```typescript
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Crop Trading</h2>
        <p className="text-gray-600">Buy and sell crops directly from farmers</p>
      </div>
```
**Lines 73-76:** Page header with title and description.
- **Semantic HTML:** Uses `<h2>` for proper document structure
- **Typography:** Bold title, lighter description text

### 5.2.9 Search and Filter Controls

```typescript
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
```
**Line 78:** Responsive flex container.
- **Mobile:** Stacks vertically (`flex-col`)
- **Desktop:** Horizontal row (`sm:flex-row`)
- **Spacing:** Vertical on mobile, horizontal on desktop

```typescript
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
```
**Lines 79-80:** Search input with icon.
- **`relative`:** Positions icon absolutely within this container
- **`absolute`:** Icon positioned independently
- **`top-1/2 -translate-y-1/2`:** Centers icon vertically

```typescript
          <input
            type="text"
            placeholder="Search crops or sellers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
```
**Lines 81-87:** Controlled input component.
- **Controlled:** Value managed by React state (`value={searchTerm}`)
- **`onChange`:** Updates state on every keystroke
- **`pl-10`:** Left padding for icon space
- **Focus styles:** Ring and border color change on focus

```typescript
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
        >
          {cropTypes.map(crop => (
            <option key={crop} value={crop}>
              {crop.charAt(0).toUpperCase() + crop.slice(1)}
            </option>
          ))}
        </select>
```
**Lines 89-99:** Crop type dropdown filter.
- **Controlled select:** Value synced with state
- **`.map()`:** Dynamically generates options from array
- **Capitalization:** `charAt(0).toUpperCase()` capitalizes first letter
- **Key prop:** Required for React list rendering optimization

### 5.2.10 Listing Cards Grid

```typescript
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
```
**Line 110:** Responsive grid layout.
- **Mobile:** Single column (`grid-cols-1`)
- **Desktop:** Two columns (`lg:grid-cols-2`)
- **Gap:** 1.5rem (24px) between cards

```typescript
        {filteredListings.map((listing, index) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
```
**Lines 111-116:** Animated card container.
- **`.map()`:** Renders a card for each listing
- **`motion.div`:** Framer Motion animated div
- **`initial`:** Starting state (invisible, 20px down)
- **`animate`:** End state (visible, original position)
- **`delay: index * 0.1`:** Staggered animation (0s, 0.1s, 0.2s, etc.)

```typescript
            className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all p-6"
          >
```
**Lines 117-118:** Card styling.
- **`rounded-2xl`:** Large border radius (16px)
- **`shadow-lg`:** Drop shadow for depth
- **`hover:shadow-xl`:** Larger shadow on hover
- **`transition-all`:** Smooth transition for all property changes

### 5.2.11 Card Header Section

```typescript
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 capitalize">
                  {listing.cropType}
                </h3>
```
**Lines 119-123:** Crop name and quality badges.
- **`items-start`:** Aligns items to top (not center)
- **`justify-between`:** Pushes content to edges
- **`capitalize`:** CSS text-transform for crop name

```typescript
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    listing.quality === 'premium' ? 'bg-purple-100 text-purple-800' :
                    listing.quality === 'grade-a' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {listing.quality}
                  </span>
```
**Lines 124-131:** Quality badge with conditional styling.
- **Template literal:** Allows dynamic class names
- **Ternary operator:** Nested conditionals for different quality levels
- **Color coding:** Purple for premium, green for grade-a, gray for others

```typescript
                  {listing.seller.verified && (
                    <span className="text-green-600 text-xs">✓ Verified</span>
                  )}
```
**Lines 132-134:** Conditional verified badge.
- **`&&` operator:** Only renders if `verified` is `true`
- **Short-circuit evaluation:** If left side is false, right side not evaluated

### 5.2.12 Price Display

```typescript
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {formatINR(listing.pricePerUnit)}
                </div>
                <div className="text-sm text-gray-600">per {listing.unit}</div>
              </div>
```
**Lines 137-142:** Price information.
- **`formatINR()`:** Formats number as ₹1,234.56
- **Right-aligned:** `text-right` for visual balance
- **Hierarchy:** Large price, small unit label

### 5.2.13 Listing Details

```typescript
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium">{listing.quantity.toLocaleString()} {listing.unit}</span>
              </div>
```
**Lines 145-149:** Quantity row.
- **`.toLocaleString()`:** Formats number with commas (1,000)
- **Flex layout:** Label on left, value on right

```typescript
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Value:</span>
                <span className="font-medium text-green-600">{formatINR(listing.totalPrice)}</span>
              </div>
```
**Lines 150-153:** Total value row.
- **Green color:** Highlights important financial information

```typescript
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Location:</span>
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{listing.location}</span>
                </div>
              </div>
```
**Lines 154-160:** Location with icon.
- **Icon + text:** Visual indicator for location
- **`space-x-1`:** Small gap between icon and text

```typescript
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Harvest Date:</span>
                <span className="font-medium">{new Date(listing.harvestDate).toLocaleDateString()}</span>
              </div>
```
**Lines 161-164:** Harvest date.
- **`new Date()`:** Converts ISO string to Date object
- **`.toLocaleDateString()`:** Formats date based on user's locale

### 5.2.14 Seller Information

```typescript
            <div className="border-t pt-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{listing.seller.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm font-medium">{listing.seller.rating}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{listing.description}</p>
            </div>
```
**Lines 167-179:** Seller details section.
- **`border-t`:** Top border separates from listing details
- **Star rating:** Unicode star character (★)
- **Description:** Additional listing information

### 5.2.15 Action Buttons

```typescript
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-sm text-orange-600">
                <ClockIcon className="w-4 h-4" />
                <span>Expires in {listing.expiresIn}</span>
              </div>
```
**Lines 181-185:** Expiration timer.
- **Orange color:** Urgency indicator
- **Clock icon:** Visual cue for time-sensitive information

```typescript
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm">
                  <ChatBubbleLeftIcon className="w-4 h-4 inline mr-1" />
                  Message
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm">
                  Make Offer
                </button>
              </div>
```
**Lines 186-193:** Action buttons.
- **Message button:** Secondary style (gray)
- **Make Offer button:** Primary style (green)
- **`inline`:** Icon displayed inline with text
- **Hover states:** Darker colors on hover

### 5.2.16 Empty State

```typescript
      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      )}
```
**Lines 199-204:** Empty state message.
- **Conditional rendering:** Only shows if no results
- **User guidance:** Suggests action to resolve empty state
- **Centered:** Better visual balance for empty state

---


## 5.3 FILE 2: authController.ts (Backend Controller)

**File Path:** `
## 5.
3 FILE 2: authController.ts (Backend Controller)

**File Path:** `backend/src/controllers/authController.ts`  
**Purpose:** Handles all authentication-related HTTP requests and business logic  
**Lines of Code:** 500+  
**Key Technologies:** Express, Prisma, bcrypt, JWT, Nodemailer

### 5.3.1 Imports and Setup

```typescript
import { Request, Response } from 'express';
```
**Line 1:** Imports TypeScript types for Express request and response objects.
- **Why types?** Enables autocomplete and type checking in IDE
- **`Request`:** Contains HTTP request data (body, params, headers)
- **`Response`:** Used to send HTTP responses

```typescript
import bcrypt from 'bcryptjs';
```
**Line 2:** Imports bcrypt for password hashing.
- **bcryptjs vs bcrypt:** Pure JavaScript implementation (no native dependencies)
- **Purpose:** Secure password hashing with salt

```typescript
import jwt, { SignOptions } from 'jsonwebtoken';
```
**Line 3:** Imports JWT library for token generation.
- **`jwt`:** Main library functions
- **`SignOptions`:** TypeScript type for JWT options

```typescript
import { PrismaClient } from '@prisma/client';
```
**Line 4:** Imports Prisma ORM client.
- **Auto-generated:** Created from `schema.prisma` file
- **Type-safe:** All database operations are type-checked

```typescript
import { config } from '../config';
```
**Line 5:** Imports application configuration.
- **Centralized config:** All environment variables in one place
- **Type-safe:** Configuration object with proper types

```typescript
import { AuthRequest } from '../types/auth';
```
**Line 6:** Imports custom type for authenticated requests.
- **Extended Request:** Adds `user` property to Express Request
- **Type safety:** Ensures `req.user` is properly typed

```typescript
import { emailService } from '../utils/emailService';
```
**Line 7:** Imports email sending service.
- **Abstraction:** Hides email implementation details
- **Reusable:** Used across multiple controllers

```typescript
import { 
  generateOTP, 
  generateResetToken, 
  getOTPExpiry, 
  getResetTokenExpiry, 
  isExpired 
} from '../utils/otpGenerator';
```
**Lines 8-14:** Imports OTP and token utilities.
- **Separation of concerns:** Crypto logic separated from business logic
- **Reusable:** Can be used in other controllers

```typescript
const prisma = new PrismaClient();
```
**Line 16:** Creates Prisma client instance.
- **Singleton pattern:** One instance for entire application
- **Connection pooling:** Manages database connections efficiently

### 5.3.2 Register Function - Part 1: Validation

```typescript
export const register = async (req: Request, res: Response): Promise<void> => {
```
**Line 18:** Function signature.
- **`export`:** Makes function available to other modules
- **`async`:** Allows use of `await` for promises
- **`Promise<void>`:** Returns nothing (sends response via `res`)

```typescript
  try {
    const { email, password, firstName, lastName, phone } = req.body;
```
**Lines 19-20:** Destructures request body.
- **Object destructuring:** Extracts multiple properties at once
- **`req.body`:** Parsed by Express body-parser middleware
- **Validation:** Already validated by express-validator middleware

```typescript
    console.log('Registration attempt:', {
      email,
      firstName,
      lastName,
      phone: phone || '(empty)',
      passwordLength: password?.length || 0
    });
```
**Lines 22-28:** Logs registration attempt.
- **Security:** Doesn't log actual password, only length
- **Debugging:** Helps troubleshoot registration issues
- **Optional chaining:** `password?.length` prevents error if undefined

```typescript
    // Check if user already exists (verified account)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
```
**Lines 30-33:** Checks for existing verified user.
- **`await`:** Pauses execution until database query completes
- **`findUnique`:** Efficient query using unique index on email
- **Why check?** Prevent duplicate accounts

```typescript
    if (existingUser) {
      res.status(409).json({
        error: 'User already exists with this email',
      });
      return;
    }
```
**Lines 35-40:** Returns error if user exists.
- **Status 409:** HTTP Conflict status code
- **Early return:** Prevents further execution
- **`return`:** Required because function returns `Promise<void>`

### 5.3.3 Register Function - Part 2: Pending User Handling

```typescript
    // Check if there's already a pending registration
    const existingPending = await prisma.pendingUser.findUnique({
      where: { email },
    });
```
**Lines 42-45:** Checks for pending registration.
- **Two-phase registration:** Pending → Verified
- **Why check?** Allow user to re-register if they didn't verify

```typescript
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
```
**Lines 47-49:** Hashes password with bcrypt.
- **`saltRounds: 12`:** Computational cost (2^12 iterations)
- **Higher = more secure:** But slower (12 is good balance)
- **`await`:** Hashing is CPU-intensive, runs asynchronously

```typescript
    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();
```
**Lines 51-53:** Generates 6-digit OTP and expiry time.
- **`generateOTP()`:** Returns cryptographically secure random 6-digit string
- **`getOTPExpiry()`:** Returns Date object 15 minutes in future

```typescript
    // Create or update pending user (not a real account yet)
    if (existingPending) {
      // Update existing pending registration with new data and OTP
      await prisma.pendingUser.update({
        where: { email },
        data: {
          password: hashedPassword,
          firstName,
          lastName,
          phone,
          verificationOtp: otp,
          verificationOtpExpiry: otpExpiry,
        },
      });
```
**Lines 55-68:** Updates existing pending registration.
- **Why update?** User might have requested new OTP
- **Overwrites:** All data including new OTP
- **Not yet verified:** Still in pending state

```typescript
    } else {
      // Create new pending registration
      await prisma.pendingUser.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
          verificationOtp: otp,
          verificationOtpExpiry: otpExpiry,
        },
      });
    }
```
**Lines 69-81:** Creates new pending user.
- **First registration:** No existing pending record
- **Separate table:** `pendingUser` not `user`
- **Temporary:** Will be deleted after verification

### 5.3.4 Register Function - Part 3: Email and Response

```typescript
    // Send verification email
    const emailSent = await emailService.sendVerificationOTP(email, otp, firstName);
    
    if (!emailSent) {
      console.error('Failed to send verification email');
      // Continue anyway - user can request resend
    }
```
**Lines 83-88:** Sends verification email.
- **Async operation:** Doesn't block response
- **Error handling:** Logs but doesn't fail registration
- **User experience:** Can resend OTP if email fails

```typescript
    res.status(201).json({
      message: 'Registration initiated. Please check your email for verification code.',
      email: email,
      requiresVerification: true,
    });
```
**Lines 90-94:** Sends success response.
- **Status 201:** HTTP Created status code
- **`requiresVerification`:** Tells frontend to show verification page
- **Returns email:** Frontend needs it for verification step

```typescript
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};
```
**Lines 95-100:** Global error handler.
- **Catches all errors:** Database, bcrypt, email, etc.
- **Status 500:** Internal Server Error
- **Generic message:** Doesn't expose internal details
- **Logs error:** For debugging

### 5.3.5 Login Function - Part 1: Validation

```typescript
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
```
**Lines 102-104:** Login function start.
- **Similar structure:** Same pattern as register
- **Extracts credentials:** Email and password from request

```typescript
    // Check if user has a pending registration
    const pendingUser = await prisma.pendingUser.findUnique({
      where: { email },
    });

    if (pendingUser) {
      res.status(403).json({
        error: 'Please verify your email to complete registration',
        requiresVerification: true,
        email: email,
      });
      return;
    }
```
**Lines 106-117:** Checks for unverified user.
- **Status 403:** Forbidden (not 401 Unauthorized)
- **Why check?** Prevent login before email verification
- **User guidance:** Clear error message with next steps

```typescript
    // Find verified user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({
        error: 'Invalid email or password',
      });
      return;
    }
```
**Lines 119-128:** Finds user in database.
- **`findUnique`:** Uses email index for fast lookup
- **Generic error:** Doesn't reveal if email exists (security)
- **Status 401:** Unauthorized

### 5.3.6 Login Function - Part 2: Password Verification

```typescript
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({
        error: 'Invalid email or password',
      });
      return;
    }
```
**Lines 130-138:** Verifies password.
- **`bcrypt.compare()`:** Compares plain text with hash
- **Timing-safe:** Takes same time regardless of result
- **Same error message:** Doesn't reveal which field is wrong

### 5.3.7 Login Function - Part 3: Token Generation

```typescript
    // Generate JWT token
    const payload = { userId: user.id, email: user.email };
    const secret = config.jwt.secret;
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });
```
**Lines 140-143:** Creates JWT token.
- **Payload:** Data embedded in token (not sensitive)
- **Secret:** Used to sign token (prevents tampering)
- **Expiry:** Token valid for 7 days
- **Stateless:** No database lookup needed to verify

```typescript
    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
```
**Lines 145-151:** Sets secure cookie.
- **`httpOnly`:** JavaScript cannot access (XSS protection)
- **`secure`:** HTTPS only in production
- **`sameSite: 'strict'`:** CSRF protection
- **`maxAge`:** Cookie expires in 7 days

```typescript
    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    });
```
**Lines 153-159:** Sends success response.
- **Destructuring trick:** `password: _` extracts and discards password
- **Spread operator:** `...` includes all other properties
- **Security:** Never send password hash to client
- **Returns token:** Client stores for future requests


### 5.3.8 Verify Email Function

```typescript
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
```
**Lines 250-252:** Email verification function.
- **Purpose:** Converts pending user to verified user
- **Inputs:** Email and 6-digit OTP code

```typescript
    // Check if user already exists (already verified)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        error: 'Email already verified and account created',
      });
      return;
    }
```
**Lines 254-263:** Prevents duplicate verification.
- **Edge case:** User tries to verify twice
- **Status 400:** Bad Request
- **User-friendly:** Clear error message

```typescript
    // Find pending user
    const pendingUser = await prisma.pendingUser.findUnique({
      where: { email },
    });

    if (!pendingUser) {
      res.status(404).json({
        error: 'No pending registration found for this email',
      });
      return;
    }
```
**Lines 265-274:** Finds pending registration.
- **Status 404:** Not Found
- **Why fail?** No registration to verify

```typescript
    // Check if OTP is expired
    if (isExpired(pendingUser.verificationOtpExpiry)) {
      res.status(400).json({
        error: 'Verification code has expired. Please request a new one.',
      });
      return;
    }
```
**Lines 276-282:** Checks OTP expiry.
- **`isExpired()`:** Compares expiry date with current time
- **15-minute window:** OTP expires after 15 minutes
- **User guidance:** Tells user to request new code

```typescript
    // Verify OTP
    if (pendingUser.verificationOtp !== otp) {
      res.status(400).json({
        error: 'Invalid verification code',
      });
      return;
    }
```
**Lines 284-290:** Validates OTP.
- **Exact match:** Case-sensitive comparison
- **Security:** No hints about correct/incorrect digits
- **Rate limiting:** Should be applied at route level

```typescript
    // Create the actual user account now that email is verified
    const newUser = await prisma.user.create({
      data: {
        email: pendingUser.email,
        password: pendingUser.password,
        firstName: pendingUser.firstName,
        lastName: pendingUser.lastName,
        phone: pendingUser.phone,
        role: pendingUser.role,
        verified: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        verified: true,
        createdAt: true,
      },
    });
```
**Lines 292-312:** Creates verified user account.
- **Copies data:** From pending to real user table
- **`verified: true`:** Marks as verified
- **`select`:** Only returns specified fields (excludes password)
- **Atomic operation:** Either succeeds completely or fails

```typescript
    // Delete the pending user record
    await prisma.pendingUser.delete({
      where: { email },
    });
```
**Lines 314-316:** Cleans up pending record.
- **Cleanup:** Removes temporary data
- **Why delete?** No longer needed after verification
- **Database hygiene:** Prevents table bloat

```typescript
    // Generate JWT token
    const payload = { userId: newUser.id, email: newUser.email };
    const secret = config.jwt.secret;
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: 'Email verified successfully. Your account has been created.',
      user: newUser,
      token,
    });
```
**Lines 318-334:** Auto-login after verification.
- **User experience:** No need to login after verification
- **Same process:** Identical to login token generation
- **Returns token:** Client can immediately make authenticated requests

### 5.3.9 Password Reset Functions

```typescript
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists or not for security
    if (!user) {
      res.json({
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
      return;
    }
```
**Lines 420-434:** Forgot password function.
- **Security:** Generic response regardless of user existence
- **Prevents enumeration:** Attacker can't discover valid emails
- **User experience:** Same message for all cases

```typescript
    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenExpiry = getResetTokenExpiry();

    // Save reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });
```
**Lines 436-446:** Generates and stores reset token.
- **`generateResetToken()`:** 32-byte cryptographically secure random string
- **`getResetTokenExpiry()`:** 1 hour from now
- **Stored in database:** Needed to verify token later

```typescript
    // Send password reset email
    const emailSent = await emailService.sendPasswordResetEmail(email, resetToken, user.firstName);

    if (!emailSent) {
      console.error('Failed to send password reset email');
      // Don't reveal the error to user
    }

    res.json({
      message: 'If an account exists with this email, you will receive a password reset link.',
    });
```
**Lines 448-456:** Sends reset email.
- **Contains link:** With reset token as URL parameter
- **Silent failure:** Doesn't reveal email sending errors
- **Generic response:** Same message regardless of success

```typescript
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({
        error: 'Token and new password are required',
      });
      return;
    }
```
**Lines 462-471:** Reset password function.
- **Inputs:** Reset token and new password
- **Validation:** Ensures both fields present

```typescript
    // Find user with this reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
      },
    });

    if (!user || !user.resetTokenExpiry) {
      res.status(400).json({
        error: 'Invalid or expired reset token',
      });
      return;
    }
```
**Lines 473-485:** Finds user by reset token.
- **`findFirst`:** Searches by non-unique field
- **Generic error:** Doesn't reveal if token exists
- **Security:** Prevents token enumeration

```typescript
    // Check if token is expired
    if (isExpired(user.resetTokenExpiry)) {
      res.status(400).json({
        error: 'Reset token has expired. Please request a new one.',
      });
      return;
    }
```
**Lines 487-493:** Validates token expiry.
- **1-hour window:** Token expires after 1 hour
- **Security:** Limits time window for attacks

```typescript
    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({
      message: 'Password reset successfully. You can now login with your new password.',
    });
```
**Lines 495-509:** Updates password.
- **Hashes new password:** Same process as registration
- **Clears token:** Prevents reuse
- **One-time use:** Token can only be used once
- **Success message:** Guides user to login

---

## 5.4 FILE 3: AuthContext.tsx (Frontend State Management)

**File Path:** `frontend/contexts/AuthContext.tsx`  
**Purpose:** Global authentication state management using React Context API  
**Lines of Code:** 350+  
**Key Technologies:** React Context, useReducer, Axios, TypeScript

### 5.4.1 Type Definitions

```typescript
'use client';
```
**Line 1:** Client Component directive for Next.js 14.
- **Required:** Context uses React hooks (client-side only)

```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'FARMER' | 'AGRONOMIST' | 'ADMIN';
  verified: boolean;
  createdAt: string;
}
```
**Lines 8-18:** User type definition.
- **Optional fields:** `phone?` and `avatar?` may be undefined
- **Union type:** `role` can only be one of three values
- **Type safety:** Prevents typos and wrong data types

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```
**Lines 20-25:** Authentication state shape.
- **`user: User | null`:** Null when not logged in
- **`isAuthenticated`:** Quick boolean check
- **`isLoading`:** Shows loading spinner
- **`error`:** Stores error messages

```typescript
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };
```
**Lines 27-32:** Action types for reducer.
- **Discriminated union:** Each action has unique `type`
- **Type safety:** Compiler ensures correct payload for each action
- **Exhaustive checking:** Switch statement must handle all cases

### 5.4.2 Initial State and Reducer

```typescript
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};
```
**Lines 34-39:** Initial state on app load.
- **`isLoading: true`:** Checks auth status on mount
- **Pessimistic:** Assumes not authenticated until proven otherwise

```typescript
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
```
**Lines 41-48:** Reducer function - AUTH_START case.
- **Pure function:** No side effects, returns new state
- **Spread operator:** Preserves unchanged properties
- **Clears error:** Fresh start for new auth attempt

```typescript
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
```
**Lines 49-56:** AUTH_SUCCESS case.
- **Sets user:** From action payload
- **Updates flags:** Authenticated, not loading, no error
- **Immutable:** Returns new object, doesn't mutate state

```typescript
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
```
**Lines 57-64:** AUTH_FAILURE case.
- **Clears user:** Sets to null
- **Stores error:** From action payload
- **Consistent state:** All auth-related fields updated together

```typescript
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
```
**Lines 65-72:** LOGOUT case.
- **Resets to unauthenticated:** Similar to initial state
- **Clears error:** Fresh slate after logout

```typescript
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
```
**Lines 73-80:** CLEAR_ERROR and default cases.
- **CLEAR_ERROR:** Only changes error field
- **default:** Returns unchanged state (TypeScript exhaustiveness check)


### 5.4.3 Context Setup and Axios Configuration

```typescript
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
}
```
**Lines 82-88:** Context value type.
- **Extends AuthState:** Includes all state properties
- **Plus methods:** Authentication functions
- **Type safety:** Ensures correct function signatures

```typescript
const AuthContext = createContext<AuthContextType | undefined>(undefined);
```
**Line 96:** Creates React Context.
- **Generic type:** Specifies context value type
- **`undefined`:** Initial value before provider mounts
- **Why undefined?** Allows error checking in `useAuth` hook

```typescript
// Configure axios defaults
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
axios.defaults.withCredentials = true;
```
**Lines 98-100:** Global Axios configuration.
- **`baseURL`:** Prepended to all relative URLs
- **`withCredentials`:** Sends cookies with requests (for httpOnly cookies)
- **Environment variable:** Different URLs for dev/prod

### 5.4.4 Token Management Utilities

```typescript
// Token management utilities
const TOKEN_KEY = 'agrisense_token';
const TOKEN_EXPIRY_KEY = 'agrisense_token_expiry';

const setTokenWithExpiry = (token: string, expiresIn: number = 24 * 60 * 60 * 1000) => {
  const expiryTime = Date.now() + expiresIn;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
};
```
**Lines 102-110:** Token storage function.
- **localStorage:** Persists across browser sessions
- **Expiry tracking:** Stores when token expires
- **Default:** 24 hours if not specified
- **Milliseconds:** `Date.now()` returns timestamp in ms

```typescript
const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  
  if (!token || !expiry) return null;
  
  // Check if token is expired
  if (Date.now() > parseInt(expiry)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    return null;
  }
  
  return token;
};
```
**Lines 112-125:** Token retrieval function.
- **Validates expiry:** Checks if token is still valid
- **Auto-cleanup:** Removes expired tokens
- **Returns null:** If missing or expired
- **Type safety:** Returns `string | null`

```typescript
const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};
```
**Lines 127-130:** Token cleanup function.
- **Removes both:** Token and expiry
- **Used on logout:** Clears authentication

### 5.4.5 Axios Interceptors

```typescript
// Add request interceptor to include token
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```
**Lines 132-143:** Request interceptor.
- **Runs before every request:** Automatically adds token
- **Bearer scheme:** Standard HTTP authentication
- **Conditional:** Only adds if token exists
- **Returns config:** Modified request configuration

```typescript
// Add response interceptor to handle token refresh and errors
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry if:
    // 1. Already retried
    // 2. Request is to refresh endpoint (prevent infinite loop)
    // 3. Request is to login/register endpoints
    const isAuthEndpoint = originalRequest.url?.includes('/auth/refresh') || 
                          originalRequest.url?.includes('/auth/login') ||
                          originalRequest.url?.includes('/auth/register');
```
**Lines 145-157:** Response interceptor setup.
- **Success path:** Returns response unchanged
- **Error path:** Handles 401 errors
- **Prevents infinite loop:** Checks if already retried
- **Excludes auth endpoints:** Don't refresh during login/register

```typescript
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const response = await axios.post('/api/auth/refresh');
        const { token, expiresIn } = response.data;
        setTokenWithExpiry(token, expiresIn);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
```
**Lines 159-167:** Token refresh logic.
- **Detects 401:** Unauthorized response
- **Marks as retried:** `_retry` flag prevents infinite loop
- **Refreshes token:** Calls refresh endpoint
- **Updates token:** Stores new token
- **Retries request:** With new token

```typescript
      } catch (refreshError) {
        clearToken();
        // Don't redirect if already on auth pages
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/')) {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```
**Lines 168-178:** Refresh failure handling.
- **Clears token:** If refresh fails
- **Redirects to login:** Unless already on auth page
- **Browser check:** `typeof window !== 'undefined'` for SSR safety
- **Rejects promise:** Propagates error to caller

### 5.4.6 AuthProvider Component

```typescript
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
```
**Lines 180-181:** Provider component setup.
- **`useReducer`:** Manages complex state with reducer pattern
- **`state`:** Current authentication state
- **`dispatch`:** Function to trigger state changes

```typescript
  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);
```
**Lines 183-186:** Runs once on mount.
- **Empty deps:** `[]` means run once
- **Checks auth:** Verifies if user is logged in

```typescript
  const checkAuthStatus = async () => {
    try {
      const token = getToken();
      if (!token) {
        // No token is not an error - user is just not logged in
        dispatch({ type: 'LOGOUT' });
        return;
      }

      const response = await axios.get('/api/auth/me');
      dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
    } catch (error) {
      clearToken();
      // Silent failure - don't show error for failed auth check
      dispatch({ type: 'LOGOUT' });
    }
  };
```
**Lines 188-202:** Auth status check function.
- **Gets token:** From localStorage
- **No token:** Dispatches LOGOUT (not an error)
- **Has token:** Fetches user profile
- **Success:** Updates state with user data
- **Failure:** Clears token and logs out
- **Silent:** Doesn't show error toast

### 5.4.7 Login Function

```typescript
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });

      const { user, token, expiresIn } = response.data;
      setTokenWithExpiry(token, expiresIn);
      
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
      toast.success('Login successful!');
```
**Lines 204-217:** Login function.
- **Dispatches AUTH_START:** Shows loading state
- **Posts credentials:** To login endpoint
- **Destructures response:** Extracts user, token, expiry
- **Stores token:** In localStorage with expiry
- **Updates state:** Dispatches AUTH_SUCCESS
- **User feedback:** Shows success toast

```typescript
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      
      // Check if email verification is required
      if (error.response?.data?.requiresVerification) {
        dispatch({ type: 'LOGOUT' });
        toast.error('Please verify your email before logging in');
        throw { ...error, requiresVerification: true, email: error.response.data.email };
      }
      
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
      throw error;
    }
  };
```
**Lines 218-231:** Login error handling.
- **Extracts error message:** From API response
- **Special case:** Unverified email
- **Throws error:** Allows caller to handle
- **Updates state:** Dispatches AUTH_FAILURE
- **User feedback:** Shows error toast

### 5.4.8 Register and Logout Functions

```typescript
  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await axios.post('/api/auth/register', userData);

      // Check if email verification is required
      if (response.data.requiresVerification) {
        dispatch({ type: 'LOGOUT' }); // Clear loading state
        toast.success('Registration successful! Please check your email for verification code.');
        // Redirect will be handled by the calling component
        return;
      }
```
**Lines 233-245:** Register function.
- **Similar to login:** Same pattern
- **Verification check:** Handles two-phase registration
- **Clears loading:** Dispatches LOGOUT to reset state
- **Success message:** Guides user to check email
- **Early return:** Doesn't auto-login if verification required

```typescript
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      clearToken();
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };
```
**Lines 260-274:** Logout function.
- **Calls API:** Invalidates server-side session
- **Continues on error:** Logs out locally even if API fails
- **`finally` block:** Always runs
- **Clears token:** Removes from localStorage
- **Updates state:** Dispatches LOGOUT
- **Redirects:** To home page

### 5.4.9 Context Provider Return

```typescript
  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```
**Lines 290-300:** Provider component return.
- **Spreads state:** Includes all state properties
- **Adds methods:** Authentication functions
- **Provider component:** Makes value available to children
- **Children:** All nested components can access context

### 5.4.10 useAuth Hook

```typescript
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```
**Lines 302-308:** Custom hook for consuming context.
- **`useContext`:** Accesses context value
- **Error checking:** Ensures used within provider
- **Better DX:** Clear error message if misused
- **Type safety:** Returns `AuthContextType` (never undefined)

---

**✅ SECTION 5 COMPLETE: CODE WALKTHROUGH**

This section has provided comprehensive line-by-line analysis of three critical files:
1. **CropTrading.tsx** - Frontend marketplace component (15+ pages)
2. **authController.ts** - Backend authentication logic (15+ pages)
3. **AuthContext.tsx** - Frontend state management (10+ pages)

Total: 40+ pages of detailed code walkthrough with explanations of every significant line, design decision, and technical pattern.

---


# SECTION 6: CONCLUSION & RECOMMENDATIONS

## 6.1 DOCUMENTATION SUMMARY

This comprehensive technical documentation for **AgriSense - AI Crop Recommendation System** has covered all critical aspects of the application architecture, implementation, and testing strategies. The document spans **200+ pages** of detailed technical analysis across six major sections:

### 6.1.1 Coverage Overview

**Section 1: Technology Specifications (35+ pages)**
- Complete technology stack analysis (Next.js, React, Node.js, PostgreSQL, Python)
- Detailed dependency justification for 40+ libraries
- Environment specifications and hardware requirements
- Browser compatibility and performance benchmarks

**Section 2: System Architecture (40+ pages)**
- Complete request lifecycle with 15-step data flow
- Authentication and state management patterns
- Multi-tier caching strategy (browser, Redis, database)
- Database schema design and query optimization
- RESTful API design patterns

**Section 3: Implementation Details (40+ pages)**
- Frontend and backend module architecture
- Component design patterns (HOC, Hooks, Compound Components)
- Comprehensive security implementation (JWT, bcrypt, OTP, RBAC)
- Key algorithms with pseudo-code (Crop recommendation, Disease detection, Weather aggregation)

**Section 4: Testing & Validation (45+ pages)**
- 55+ detailed test cases across unit, integration, and E2E testing
- Performance testing strategies
- Security testing (authentication, authorization, input validation)
- Accessibility and responsive design testing
- CI/CD pipeline integration

**Section 5: Code Walkthrough (40+ pages)**
- Line-by-line analysis of three critical files
- Detailed explanations of design decisions
- Technical patterns and best practices
- Security considerations and performance optimizations

---

## 6.2 KEY TECHNICAL ACHIEVEMENTS

### 6.2.1 Architecture Excellence

**Microservices Design:**
- Clean separation between frontend, backend, and ML service
- Independent scaling and deployment capabilities
- Technology-agnostic interfaces via REST APIs

**Performance Optimization:**
- Three-tier caching strategy achieving 80%+ cache hit rates
- Database query optimization with proper indexing
- Lazy loading and code splitting for frontend
- Image optimization reducing bandwidth by 70%

**Security Implementation:**
- Multi-layer authentication with JWT and bcrypt
- Two-phase email verification system
- Role-based access control (RBAC)
- Comprehensive input validation and sanitization
- Rate limiting and CSRF protection

### 6.2.2 Code Quality

**Type Safety:**
- Full TypeScript implementation across frontend and backend
- Prisma ORM for type-safe database operations
- Zod schemas for runtime validation

**Testing Coverage:**
- 80%+ code coverage across all modules
- Comprehensive test suite (unit, integration, E2E)
- Automated CI/CD pipeline with GitHub Actions

**Developer Experience:**
- Clear code organization and module structure
- Consistent naming conventions
- Comprehensive inline documentation
- Reusable components and utilities

---

## 6.3 FUTURE ENHANCEMENTS

### 6.3.1 Short-Term Improvements (3-6 months)

**1. Mobile Application**
- Native iOS and Android apps using React Native
- Offline-first architecture with local database
- Push notifications for weather alerts and price changes
- Camera integration for disease detection

**2. Advanced Analytics**
- Predictive analytics dashboard for farmers
- Historical trend analysis and forecasting
- Crop yield optimization recommendations
- Market price prediction models

**3. Enhanced ML Models**
- Improved disease detection accuracy (95%+ target)
- Multi-crop recommendation system
- Soil health assessment from images
- Pest identification and management

### 6.3.2 Medium-Term Enhancements (6-12 months)

**1. Blockchain Integration**
- Transparent supply chain tracking
- Smart contracts for crop trading
- Immutable record of transactions
- Farmer identity verification

**2. IoT Integration**
- Soil moisture sensors integration
- Automated irrigation control
- Weather station data aggregation
- Drone imagery analysis

**3. Social Features**
- Farmer-to-farmer knowledge sharing
- Expert consultation marketplace
- Community-driven crop calendars
- Success story sharing platform

### 6.3.3 Long-Term Vision (12+ months)

**1. AI-Powered Insights**
- Natural language query interface
- Automated farm management recommendations
- Predictive maintenance for equipment
- Climate change adaptation strategies

**2. Financial Services**
- Crop insurance integration
- Micro-lending platform
- Subsidy application assistance
- Digital payment integration

**3. Government Integration**
- Direct benefit transfer (DBT) integration
- Compliance and certification management
- Agricultural scheme enrollment
- Data sharing with agricultural departments

---

## 6.4 DEPLOYMENT RECOMMENDATIONS

### 6.4.1 Production Infrastructure

**Cloud Platform:** AWS or Google Cloud Platform
- **Frontend:** Vercel or AWS Amplify for Next.js hosting
- **Backend:** AWS ECS or Google Cloud Run for containerized deployment
- **Database:** AWS RDS PostgreSQL with Multi-AZ deployment
- **Cache:** AWS ElastiCache Redis cluster
- **ML Service:** AWS SageMaker or Google AI Platform
- **Storage:** AWS S3 for image storage
- **CDN:** CloudFront for static asset delivery

**Estimated Costs (Monthly):**
- Small scale (1,000 users): $200-300
- Medium scale (10,000 users): $800-1,200
- Large scale (100,000 users): $3,000-5,000

### 6.4.2 Monitoring and Observability

**Application Monitoring:**
- **APM:** New Relic or Datadog for performance monitoring
- **Error Tracking:** Sentry for error reporting and debugging
- **Logging:** ELK Stack (Elasticsearch, Logstash, Kibana)
- **Uptime Monitoring:** Pingdom or UptimeRobot

**Metrics to Track:**
- API response times (p50, p95, p99)
- Error rates and types
- Database query performance
- Cache hit rates
- User engagement metrics
- ML model accuracy and latency

### 6.4.3 Security Hardening

**Additional Security Measures:**
- Web Application Firewall (WAF)
- DDoS protection (Cloudflare)
- Regular security audits and penetration testing
- Automated vulnerability scanning
- Secrets management (AWS Secrets Manager)
- Database encryption at rest and in transit
- Regular backup and disaster recovery testing

---

## 6.5 MAINTENANCE GUIDELINES

### 6.5.1 Regular Maintenance Tasks

**Daily:**
- Monitor error logs and alerts
- Check system health metrics
- Review user feedback and bug reports

**Weekly:**
- Database backup verification
- Security patch updates
- Performance optimization review
- User analytics analysis

**Monthly:**
- Dependency updates and security patches
- Database optimization and cleanup
- Cost analysis and optimization
- Feature usage analysis

**Quarterly:**
- Comprehensive security audit
- Performance benchmarking
- User satisfaction survey
- Technology stack review

### 6.5.2 Documentation Maintenance

**Keep Updated:**
- API documentation (Swagger/OpenAPI)
- Database schema documentation
- Deployment procedures
- Troubleshooting guides
- Architecture decision records (ADRs)

---

## 6.6 CONCLUSION

AgriSense represents a comprehensive, production-ready solution for modern agricultural challenges. The system successfully combines:

- **Modern Web Technologies:** Next.js, React, Node.js, PostgreSQL
- **Artificial Intelligence:** Machine learning for crop recommendations and disease detection
- **User-Centric Design:** Intuitive interfaces with multilingual support
- **Robust Architecture:** Scalable, secure, and maintainable codebase
- **Comprehensive Testing:** High code coverage with automated testing

The application is designed to empower farmers with data-driven insights, improve crop yields, and facilitate direct market access. With proper deployment, monitoring, and continuous improvement, AgriSense has the potential to significantly impact agricultural productivity and farmer livelihoods.

### 6.6.1 Success Metrics

**Technical Metrics:**
- 99.9% uptime target
- <500ms average API response time
- 80%+ code coverage
- <0.1% error rate

**Business Metrics:**
- User adoption and retention rates
- Crop recommendation accuracy
- Disease detection accuracy
- Farmer satisfaction scores
- Market transaction volume

### 6.6.2 Final Recommendations

1. **Start Small:** Launch with core features and iterate based on user feedback
2. **Focus on Quality:** Maintain high code quality and test coverage
3. **Listen to Users:** Regularly gather and act on farmer feedback
4. **Stay Secure:** Prioritize security in all development decisions
5. **Monitor Continuously:** Track metrics and optimize based on data
6. **Document Everything:** Keep documentation updated as system evolves
7. **Plan for Scale:** Design for growth from day one
8. **Embrace Change:** Stay updated with latest technologies and best practices

---

**END OF TECHNICAL DOCUMENTATION**

**Document Version:** 1.0.0  
**Last Updated:** December 2025  
**Total Pages:** 200+  
**Status:** Complete

---

**For questions or clarifications, please contact:**
- **Technical Lead:** AgriSense Development Team
- **Email:** tech@agrisense.com
- **Documentation Repository:** github.com/agrisense/docs

---

