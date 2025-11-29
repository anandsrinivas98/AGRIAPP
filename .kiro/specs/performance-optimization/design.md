# Performance Optimization Design Document

## Overview

This design document outlines the technical approach for optimizing the AgriSense application across all layers: frontend (Next.js), backend (Node.js/Express), ML service (Python/FastAPI), and database (PostgreSQL). The optimization strategy focuses on reducing latency, improving resource utilization, implementing intelligent caching, and ensuring scalability under high load.

The design addresses eight key performance areas identified in the requirements: frontend bundle optimization, API response times, database query efficiency, ML inference speed, caching strategies, asset delivery, real-time communication, and performance monitoring.

## Architecture

### High-Level Performance Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CDN Layer                                │
│  (Static Assets, Images, Fonts - Edge Caching)                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Application                          │
│  • Code Splitting & Lazy Loading                                │
│  • Image Optimization (Next.js Image)                           │
│  • Client-side Caching (React Query/SWR)                        │
│  • Service Worker (Offline Support)                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                           │
│  • Rate Limiting                                                 │
│  • Request Compression                                           │
│  • Response Caching Headers                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
        ┌────────────────────┴────────────────────┐
        ↓                                          ↓
┌──────────────────┐                    ┌──────────────────┐
│  Backend API     │                    │   ML Service     │
│  • Redis Cache   │←───────────────────│  • Model Cache   │
│  • DB Pool       │                    │  • Batch Proc.   │
│  • Query Opt.    │                    │  • Image Opt.    │
└──────────────────┘                    └──────────────────┘
        ↓                                          
┌──────────────────┐                              
│   PostgreSQL     │                              
│  • Indexes       │                              
│  • Query Plans   │                              
│  • Conn. Pool    │                              
└──────────────────┘                              
```

### Performance Monitoring Flow

```
Application Metrics → Logging Service → Monitoring Dashboard
     ↓                      ↓                    ↓
  - Response Times      - Slow Queries      - Alerts
  - Error Rates         - Cache Hits        - Dashboards
  - Resource Usage      - Inference Times   - Reports
```

## Components and Interfaces

### 1. Frontend Optimization Layer

#### 1.1 Code Splitting Configuration

**Purpose**: Reduce initial bundle size by splitting code at route boundaries and component level.

**Implementation**:
- Use Next.js 14 App Router automatic code splitting
- Implement dynamic imports for heavy components (charts, maps, image processors)
- Create separate chunks for vendor libraries

**Configuration** (`next.config.js`):
```javascript
module.exports = {
  experimental: {
    optimizePackageImports: ['recharts', 'mapbox-gl', 'lottie-react']
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `npm.${packageName.replace('@', '')}`;
            }
          }
        }
      };
    }
    return config;
  }
};
```

#### 1.2 Image Optimization Service

**Purpose**: Automatically optimize images for web delivery with modern formats and responsive sizing.

**Interface**:
```typescript
interface ImageOptimizationConfig {
  formats: ['webp', 'avif'];
  sizes: [640, 750, 828, 1080, 1200, 1920];
  quality: 75;
  loading: 'lazy' | 'eager';
  priority: boolean;
}
```

**Implementation Strategy**:
- Use Next.js Image component for all images
- Configure custom loader for CDN integration
- Implement blur placeholder for better perceived performance
- Lazy load images below the fold

#### 1.3 Client-Side Cache Manager

**Purpose**: Implement intelligent client-side caching to reduce redundant API calls.

**Interface**:
```typescript
interface CacheConfig {
  staleTime: number;        // Time before data is considered stale
  cacheTime: number;        // Time before cache is garbage collected
  refetchOnWindowFocus: boolean;
  refetchOnReconnect: boolean;
}

interface CacheStrategy {
  cropPrices: { staleTime: 3600000, cacheTime: 7200000 };  // 1hr stale, 2hr cache
  weatherData: { staleTime: 1800000, cacheTime: 3600000 }; // 30min stale, 1hr cache
  userProfile: { staleTime: 300000, cacheTime: 600000 };   // 5min stale, 10min cache
  recommendations: { staleTime: 0, cacheTime: 300000 };    // Always fresh, 5min cache
}
```

**Implementation**:
- Use React Query for data fetching and caching
- Implement stale-while-revalidate pattern
- Configure per-endpoint cache strategies
- Add cache invalidation on mutations

### 2. Backend API Optimization Layer

#### 2.1 Redis Cache Service

**Purpose**: Implement distributed caching layer for frequently accessed data.

**Interface**:
```typescript
interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl: number): Promise<void>;
  del(key: string): Promise<void>;
  invalidatePattern(pattern: string): Promise<void>;
}

interface CacheKeyStrategy {
  weather: (lat: number, lon: number) => `weather:${lat}:${lon}`;
  cropPrice: (crop: string, market: string) => `price:${crop}:${market}`;
  userProfile: (userId: string) => `user:${userId}`;
  recommendation: (userId: string, params: string) => `rec:${userId}:${params}`;
}
```

**Cache TTL Strategy**:
- Weather data: 30 minutes
- Crop prices: 1 hour
- User profiles: 5 minutes
- Static reference data: 24 hours
- ML predictions: 5 minutes (with param-based keys)

**Implementation**:
- Create Redis client with connection pooling
- Implement cache-aside pattern
- Add cache warming for frequently accessed data
- Implement cache invalidation on data updates

#### 2.2 Database Connection Pool Manager

**Purpose**: Optimize database connections to handle concurrent requests efficiently.

**Configuration**:
```typescript
interface PoolConfig {
  min: 10;              // Minimum connections
  max: 50;              // Maximum connections
  idleTimeoutMillis: 30000;
  connectionTimeoutMillis: 2000;
  maxUses: 7500;        // Recycle connection after N uses
}
```

**Implementation**:
- Configure Prisma connection pool
- Implement connection health checks
- Add connection retry logic
- Monitor pool utilization metrics

#### 2.3 Query Optimization Service

**Purpose**: Optimize database queries for faster execution and reduced load.

**Strategies**:
1. **Field Selection**: Use Prisma `select` to fetch only required fields
2. **Relation Loading**: Implement strategic `include` vs separate queries
3. **Pagination**: Implement cursor-based pagination for large datasets
4. **Batch Operations**: Use `createMany`, `updateMany` for bulk operations

**Interface**:
```typescript
interface QueryOptimizer {
  // Optimized user query with selective fields
  getUserProfile(userId: string): Promise<UserProfile>;
  
  // Paginated query with cursor
  getRecommendations(userId: string, cursor?: string, limit: number): Promise<PaginatedResult>;
  
  // Batch query with dataloader pattern
  batchGetCropPrices(cropIds: string[]): Promise<CropPrice[]>;
}
```

### 3. Database Optimization Layer

#### 3.1 Index Strategy

**Purpose**: Create indexes on frequently queried columns to speed up data retrieval.

**Index Definitions**:
```prisma
model User {
  @@index([email])
  @@index([createdAt])
}

model CropRecommendation {
  @@index([userId, createdAt])
  @@index([farmId])
}

model YieldPrediction {
  @@index([userId, createdAt])
  @@index([farmId, crop])
}

model DiseaseDetection {
  @@index([userId, createdAt])
  @@index([cropType, createdAt])
}

model CropPrice {
  @@index([crop, market, date])
  @@index([date])
}

model WeatherData {
  @@index([latitude, longitude, date])
  @@index([date, forecast])
}

model ForumPost {
  @@index([userId, createdAt])
  @@index([category, createdAt])
  @@index([pinned, createdAt])
}

model CalendarTask {
  @@index([userId, startDate])
  @@index([userId, completed])
}
```

#### 3.2 Query Performance Patterns

**Optimized Query Examples**:

```typescript
// BAD: Fetches all fields and relations
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { farms: true, recommendations: true }
});

// GOOD: Selective fields and limited relations
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    avatar: true,
    farms: {
      select: { id: true, name: true, location: true },
      take: 5
    }
  }
});

// BAD: N+1 query problem
for (const farm of farms) {
  const recommendations = await prisma.cropRecommendation.findMany({
    where: { farmId: farm.id }
  });
}

// GOOD: Single query with include
const farms = await prisma.farm.findMany({
  where: { userId },
  include: {
    recommendations: {
      take: 10,
      orderBy: { createdAt: 'desc' }
    }
  }
});
```

### 4. ML Service Optimization Layer

#### 4.1 Model Cache Manager

**Purpose**: Keep ML models loaded in memory to avoid repeated loading overhead.

**Interface**:
```python
class ModelCache:
    def __init__(self):
        self._models: Dict[str, Any] = {}
        self._load_times: Dict[str, datetime] = {}
        self._lock = asyncio.Lock()
    
    async def get_model(self, model_name: str) -> Any:
        """Get cached model or load if not present"""
        pass
    
    async def preload_models(self, model_names: List[str]) -> None:
        """Preload models on startup"""
        pass
    
    def is_loaded(self, model_name: str) -> bool:
        """Check if model is loaded"""
        pass
```

**Implementation Strategy**:
- Load all models on service startup
- Keep models in memory throughout service lifetime
- Implement model versioning for hot-swapping
- Add memory monitoring to prevent OOM

#### 4.2 Batch Inference Processor

**Purpose**: Process multiple inference requests in batches for improved throughput.

**Interface**:
```python
class BatchProcessor:
    def __init__(self, max_batch_size: int = 32, max_wait_ms: int = 100):
        self.max_batch_size = max_batch_size
        self.max_wait_ms = max_wait_ms
        self.queue: List[InferenceRequest] = []
    
    async def add_request(self, request: InferenceRequest) -> InferenceResult:
        """Add request to batch queue"""
        pass
    
    async def process_batch(self) -> List[InferenceResult]:
        """Process accumulated requests as batch"""
        pass
```

**Batching Strategy**:
- Accumulate requests up to max_batch_size or max_wait_ms
- Process batch through model in single forward pass
- Return results to individual request handlers
- Implement separate queues for different model types

#### 4.3 Image Preprocessing Pipeline

**Purpose**: Optimize image processing before ML inference.

**Pipeline Stages**:
1. **Validation**: Check file type and size
2. **Resizing**: Resize to model input dimensions (224x224 or 512x512)
3. **Normalization**: Apply model-specific normalization
4. **Format Conversion**: Convert to tensor format

**Interface**:
```python
class ImagePreprocessor:
    def __init__(self, target_size: Tuple[int, int] = (224, 224)):
        self.target_size = target_size
    
    async def preprocess(self, image_bytes: bytes) -> np.ndarray:
        """Preprocess image for model inference"""
        # Decode image
        # Resize to target dimensions
        # Normalize pixel values
        # Convert to model input format
        pass
    
    def validate_image(self, image_bytes: bytes) -> bool:
        """Validate image format and size"""
        pass
```

### 5. Real-Time Communication Optimization

#### 5.1 WebSocket Compression

**Purpose**: Reduce bandwidth usage for Socket.IO real-time updates.

**Configuration**:
```typescript
const io = new Server(server, {
  cors: { origin: config.frontend.url, credentials: true },
  transports: ['websocket', 'polling'],
  perMessageDeflate: {
    threshold: 1024,      // Compress messages > 1KB
    zlibDeflateOptions: {
      level: 6            // Compression level (1-9)
    }
  },
  httpCompression: {
    threshold: 1024
  }
});
```

#### 5.2 Connection Pool Manager

**Purpose**: Efficiently manage WebSocket connections and rooms.

**Interface**:
```typescript
interface SocketManager {
  joinRoom(socketId: string, roomId: string): void;
  leaveRoom(socketId: string, roomId: string): void;
  broadcastToRoom(roomId: string, event: string, data: any): void;
  getRoomSize(roomId: string): number;
  throttleEmit(event: string, data: any, minInterval: number): void;
}
```

**Optimization Strategies**:
- Use rooms for targeted message delivery
- Implement message throttling (max 10/sec per room)
- Add connection pooling with max 1000 concurrent connections
- Implement automatic reconnection with exponential backoff

### 6. Performance Monitoring System

#### 6.1 Metrics Collection Service

**Purpose**: Collect and aggregate performance metrics across all services.

**Metrics to Track**:

**Frontend Metrics**:
- Core Web Vitals (LCP, FID, CLS)
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Bundle sizes
- API call latencies

**Backend Metrics**:
- Request duration (p50, p95, p99)
- Requests per second
- Error rates
- Cache hit/miss ratios
- Database query times
- Active connections

**ML Service Metrics**:
- Inference latency per model
- Batch processing efficiency
- Model memory usage
- Request queue depth

**Database Metrics**:
- Query execution times
- Connection pool utilization
- Slow query count
- Index usage statistics

#### 6.2 Logging Strategy

**Log Levels and Usage**:
- **ERROR**: Failed requests, exceptions, critical issues
- **WARN**: Slow queries (>200ms), high memory usage, rate limit hits
- **INFO**: Request completion, cache operations, model loading
- **DEBUG**: Detailed request/response data (dev only)

**Structured Logging Format**:
```typescript
interface LogEntry {
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  service: 'frontend' | 'backend' | 'ml-service' | 'database';
  message: string;
  metadata: {
    requestId?: string;
    userId?: string;
    duration?: number;
    endpoint?: string;
    statusCode?: number;
  };
}
```

## Data Models

### Cache Data Structures

```typescript
// Redis cache key patterns
interface CacheKeys {
  weather: `weather:${latitude}:${longitude}:${date}`;
  cropPrice: `price:${crop}:${market}:${date}`;
  userProfile: `user:${userId}`;
  recommendation: `rec:${userId}:${hash(params)}`;
  mlPrediction: `ml:${modelType}:${hash(input)}`;
}

// Cache value structure
interface CachedValue<T> {
  data: T;
  cachedAt: number;
  expiresAt: number;
  version: string;
}
```

### Performance Metrics Models

```typescript
interface APIMetrics {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: Date;
  cacheHit: boolean;
}

interface MLMetrics {
  modelType: 'crop' | 'yield' | 'disease';
  inferenceTime: number;
  batchSize: number;
  timestamp: Date;
}

interface DatabaseMetrics {
  query: string;
  executionTime: number;
  rowsAffected: number;
  timestamp: Date;
}
```

## Error Handling

### Performance-Related Error Scenarios

1. **Cache Connection Failure**
   - Fallback: Direct database query
   - Log: Warning level
   - Alert: If failure persists > 5 minutes

2. **Database Connection Pool Exhaustion**
   - Response: 503 Service Unavailable
   - Action: Queue request with timeout
   - Alert: Immediate notification

3. **ML Model Loading Failure**
   - Response: 503 Service Unavailable
   - Action: Retry with exponential backoff
   - Fallback: Use cached predictions if available

4. **Slow Query Detection**
   - Threshold: > 200ms
   - Action: Log query with execution plan
   - Alert: If frequency > 10/minute

5. **High Memory Usage**
   - Threshold: > 85% of available memory
   - Action: Trigger garbage collection
   - Alert: If sustained > 5 minutes

## Testing Strategy

### Performance Testing Approach

#### 1. Load Testing

**Tools**: Apache JMeter, k6, Artillery

**Scenarios**:
- Baseline: 10 concurrent users
- Normal load: 100 concurrent users
- Peak load: 500 concurrent users
- Stress test: 1000+ concurrent users

**Metrics to Measure**:
- Response time percentiles (p50, p95, p99)
- Throughput (requests/second)
- Error rate
- Resource utilization (CPU, memory, network)

#### 2. Frontend Performance Testing

**Tools**: Lighthouse, WebPageTest, Chrome DevTools

**Tests**:
- Bundle size analysis
- Core Web Vitals measurement
- Network waterfall analysis
- JavaScript execution profiling

**Acceptance Criteria**:
- Lighthouse Performance Score > 90
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

#### 3. Database Performance Testing

**Tools**: pgBench, custom query profiling scripts

**Tests**:
- Query execution time measurement
- Index usage verification
- Connection pool stress testing
- Concurrent query handling

**Acceptance Criteria**:
- 95% of queries < 200ms
- Index hit ratio > 95%
- Connection pool utilization < 80%

#### 4. ML Inference Performance Testing

**Tools**: Locust, custom Python scripts

**Tests**:
- Single inference latency
- Batch inference throughput
- Model loading time
- Memory usage under load

**Acceptance Criteria**:
- Crop recommendation < 500ms
- Disease detection < 2s
- Yield prediction < 500ms
- Batch processing 30% faster than sequential

#### 5. Cache Performance Testing

**Tests**:
- Cache hit ratio measurement
- Cache invalidation verification
- TTL expiration testing
- Cache warming effectiveness

**Acceptance Criteria**:
- Cache hit ratio > 80% for frequently accessed data
- Cache response time < 50ms
- Successful invalidation on data updates

### Monitoring and Alerting

**Alert Conditions**:
- API response time p95 > 1000ms for 5 minutes
- Error rate > 5% for 2 minutes
- Database connection pool > 90% for 3 minutes
- ML inference time > 5s for any request
- Cache hit ratio < 50% for 10 minutes
- Memory usage > 90% for 5 minutes

**Dashboard Metrics**:
- Real-time request rate and response times
- Cache hit/miss ratios
- Database query performance
- ML inference latencies
- Error rates and types
- Resource utilization (CPU, memory, network)

## Implementation Phases

### Phase 1: Foundation (Backend & Database)
- Set up Redis caching infrastructure
- Implement database indexes
- Configure connection pooling
- Add query optimization patterns

### Phase 2: Frontend Optimization
- Implement code splitting
- Configure image optimization
- Set up client-side caching with React Query
- Add service worker for offline support

### Phase 3: ML Service Optimization
- Implement model caching
- Add batch inference processing
- Optimize image preprocessing
- Configure model serving parameters

### Phase 4: Real-Time & Assets
- Optimize WebSocket communication
- Set up CDN for static assets
- Implement asset compression
- Configure cache headers

### Phase 5: Monitoring & Tuning
- Deploy monitoring infrastructure
- Set up alerting rules
- Conduct load testing
- Fine-tune based on metrics

## Performance Targets Summary

| Metric | Current (Estimated) | Target | Improvement |
|--------|---------------------|--------|-------------|
| Frontend FCP | 3.5s | 1.5s | 57% faster |
| API Response (cached) | 800ms | 500ms | 38% faster |
| API Response (uncached) | 1500ms | 800ms | 47% faster |
| Database Query | 350ms | 200ms | 43% faster |
| ML Crop Rec | 800ms | 500ms | 38% faster |
| ML Disease Detection | 3500ms | 2000ms | 43% faster |
| Bundle Size | 450KB | 200KB | 56% smaller |
| Cache Hit Ratio | 0% | 80% | New capability |
