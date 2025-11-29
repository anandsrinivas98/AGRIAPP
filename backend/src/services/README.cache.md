# Cache Service Documentation

## Overview

The Cache Service provides a Redis-based caching layer for the AgriSense backend API. It implements the cache-aside pattern with automatic retry logic, health checks, and convenient key generation methods.

## Features

- **Automatic Reconnection**: Exponential backoff retry strategy
- **Health Monitoring**: Built-in health check functionality
- **Type-Safe Operations**: Generic methods with TypeScript support
- **Key Generation Helpers**: Consistent cache key generation for different data types
- **Pattern Invalidation**: Bulk cache invalidation using patterns
- **Graceful Degradation**: Continues operation even if Redis is unavailable

## Configuration

Redis connection is configured via environment variable:

```env
REDIS_URL=redis://localhost:6379
```

## Usage Examples

### Basic Operations

```typescript
import { cacheService } from './services/cacheService';

// Get from cache
const data = await cacheService.get<UserProfile>('user:123');

// Set with TTL (in seconds)
await cacheService.set('user:123', userData, 300); // 5 minutes

// Delete specific key
await cacheService.del('user:123');

// Invalidate pattern
await cacheService.invalidatePattern('user:*');
```

### Using Key Generation Helpers

```typescript
// Weather data cache key
const weatherKey = cacheService.weatherKey(40.7128, -74.0060);
await cacheService.set(weatherKey, weatherData, 1800); // 30 minutes

// Crop price cache key
const priceKey = cacheService.cropPriceKey('wheat', 'chicago');
await cacheService.set(priceKey, priceData, 3600); // 1 hour

// User profile cache key
const userKey = cacheService.userProfileKey(userId);
await cacheService.set(userKey, profile, 300); // 5 minutes

// Recommendation cache key (with params hashing)
const recKey = cacheService.recommendationKey(userId, {
  nitrogen: 120,
  phosphorus: 30,
  potassium: 80,
  ph: 6.4
});
await cacheService.set(recKey, recommendations, 300); // 5 minutes

// ML prediction cache key
const mlKey = cacheService.mlPredictionKey('crop-recommendation', inputData);
await cacheService.set(mlKey, prediction, 300); // 5 minutes
```

### Cache-Aside Pattern

```typescript
async function getUserProfile(userId: string): Promise<UserProfile> {
  // Try to get from cache
  const cacheKey = cacheService.userProfileKey(userId);
  const cached = await cacheService.get<UserProfile>(cacheKey);
  
  if (cached) {
    console.log('Cache hit');
    return cached;
  }
  
  // Cache miss - fetch from database
  console.log('Cache miss');
  const profile = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatar: true,
    },
  });
  
  // Store in cache for future requests
  if (profile) {
    await cacheService.set(cacheKey, profile, 300); // 5 minutes TTL
  }
  
  return profile;
}
```

### Cache Invalidation on Updates

```typescript
async function updateUserProfile(userId: string, data: UpdateData): Promise<UserProfile> {
  // Update database
  const updated = await prisma.user.update({
    where: { id: userId },
    data,
  });
  
  // Invalidate cache
  const cacheKey = cacheService.userProfileKey(userId);
  await cacheService.del(cacheKey);
  
  return updated;
}
```

### Bulk Invalidation

```typescript
// Invalidate all user caches
await cacheService.invalidatePattern('user:*');

// Invalidate all weather caches
await cacheService.invalidatePattern('weather:*');

// Invalidate all recommendations for a user
await cacheService.invalidatePattern(`rec:${userId}:*`);
```

## TTL Recommendations

Based on data volatility and access patterns:

| Data Type | TTL | Reason |
|-----------|-----|--------|
| Weather Data | 30 minutes (1800s) | External API rate limits, data updates hourly |
| Crop Prices | 1 hour (3600s) | Market data updates periodically |
| User Profiles | 5 minutes (300s) | Balance between freshness and performance |
| ML Predictions | 5 minutes (300s) | Computationally expensive, params-based caching |
| Static Reference Data | 24 hours (86400s) | Rarely changes |

## Health Monitoring

The cache service includes health check functionality:

```typescript
const isHealthy = await cacheService.healthCheck();

if (!isHealthy) {
  console.warn('Cache service is unhealthy');
  // Fallback to direct database queries
}
```

The health check is automatically integrated into the `/health` endpoint.

## Error Handling

The cache service is designed to fail gracefully:

- If Redis is unavailable, operations log warnings but don't throw errors
- Application continues to function using direct database queries
- Automatic reconnection attempts with exponential backoff
- Maximum 5 reconnection attempts before giving up

## Performance Considerations

1. **Key Design**: Use consistent, predictable key patterns
2. **TTL Selection**: Balance between freshness and cache hit ratio
3. **Serialization**: JSON serialization is used - avoid caching very large objects
4. **Pattern Matching**: Use `invalidatePattern` sparingly as it scans all keys
5. **Connection Pooling**: Redis client handles connection pooling internally

## Monitoring

Monitor these metrics for cache performance:

- Cache hit ratio (target: >80% for frequently accessed data)
- Cache response time (target: <50ms)
- Redis connection status
- Memory usage
- Eviction rate

## Troubleshooting

### Cache Not Working

1. Check Redis is running: `redis-cli ping`
2. Verify REDIS_URL environment variable
3. Check application logs for connection errors
4. Verify network connectivity to Redis server

### High Cache Miss Rate

1. Review TTL values - may be too short
2. Check if cache invalidation is too aggressive
3. Verify cache keys are consistent
4. Monitor for cache evictions due to memory limits

### Memory Issues

1. Review cached data sizes
2. Adjust Redis maxmemory configuration
3. Implement cache eviction policies
4. Consider reducing TTL values

## Best Practices

1. **Always use TTL**: Never cache without expiration
2. **Invalidate on updates**: Clear cache when data changes
3. **Handle cache misses**: Always have fallback to database
4. **Monitor performance**: Track cache hit ratios and response times
5. **Use key helpers**: Leverage provided key generation methods for consistency
6. **Graceful degradation**: Application should work even if cache fails
