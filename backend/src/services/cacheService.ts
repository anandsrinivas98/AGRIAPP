import { createClient, RedisClientType } from 'redis';
import { config } from '../config';
import crypto from 'crypto';

/**
 * Cache Service for Redis operations
 * Implements cache-aside pattern with TTL support
 */
class CacheService {
  private client: RedisClientType | null = null;
  private isConnected: boolean = false;
  private isEnabled: boolean = true; // Can be disabled via env variable

  /**
   * Initialize Redis client with connection pooling and retry logic
   * If Redis is not available, the service will operate in disabled mode
   */
  async connect(): Promise<void> {
    // Check if Redis should be disabled
    if (process.env.DISABLE_REDIS === 'true') {
      console.log('⚠️  Redis is disabled via DISABLE_REDIS environment variable');
      this.isEnabled = false;
      return;
    }

    try {
      this.client = createClient({
        url: config.redis.url,
        socket: {
          connectTimeout: 5000, // 5 second timeout
          reconnectStrategy: false, // Disable automatic reconnection
        },
      });

      this.client.on('error', (err) => {
        // Only log once, don't spam console
        if (this.isConnected) {
          console.error('⚠️  Redis connection lost:', err.message);
          this.isConnected = false;
        }
      });

      this.client.on('connect', () => {
        console.log('✅ Redis client connected');
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        console.log('✅ Redis client ready');
      });

      await this.client.connect();
    } catch (error: any) {
      console.warn('⚠️  Redis not available:', error.message);
      console.log('ℹ️  Server will continue without caching. To disable this warning, set DISABLE_REDIS=true in .env');
      this.isConnected = false;
      this.isEnabled = false;
      // Don't throw error - allow server to continue without Redis
    }
  }

  /**
   * Check if Redis is connected and healthy
   */
  async healthCheck(): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false;
    }

    try {
      await this.client.ping();
      return true;
    } catch (error) {
      console.error('Redis health check failed:', error);
      return false;
    }
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.isEnabled || !this.client || !this.isConnected) {
      return null;
    }

    try {
      const value = await this.client.get(key);
      if (!value) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error getting cache key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache with TTL (in seconds)
   */
  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    if (!this.isEnabled || !this.client || !this.isConnected) {
      return;
    }

    try {
      const serialized = JSON.stringify(value);
      await this.client.setEx(key, ttl, serialized);
    } catch (error) {
      console.error(`Error setting cache key ${key}:`, error);
    }
  }

  /**
   * Delete a specific key from cache
   */
  async del(key: string): Promise<void> {
    if (!this.isEnabled || !this.client || !this.isConnected) {
      return;
    }

    try {
      await this.client.del(key);
    } catch (error) {
      console.error(`Error deleting cache key ${key}:`, error);
    }
  }

  /**
   * Invalidate all keys matching a pattern
   */
  async invalidatePattern(pattern: string): Promise<void> {
    if (!this.isEnabled || !this.client || !this.isConnected) {
      return;
    }

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
        console.log(`Invalidated ${keys.length} keys matching pattern: ${pattern}`);
      }
    } catch (error) {
      console.error(`Error invalidating pattern ${pattern}:`, error);
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
      console.log('Redis client disconnected');
    }
  }

  /**
   * Generate cache key for weather data
   */
  weatherKey(lat: number, lon: number, date?: string): string {
    const dateStr = date || new Date().toISOString().split('T')[0];
    return `weather:${lat.toFixed(2)}:${lon.toFixed(2)}:${dateStr}`;
  }

  /**
   * Generate cache key for crop prices
   */
  cropPriceKey(crop: string, market: string, date?: string): string {
    const dateStr = date || new Date().toISOString().split('T')[0];
    return `price:${crop}:${market}:${dateStr}`;
  }

  /**
   * Generate cache key for user profile
   */
  userProfileKey(userId: string): string {
    return `user:${userId}`;
  }

  /**
   * Generate cache key for recommendations
   */
  recommendationKey(userId: string, params: Record<string, any>): string {
    const paramsHash = this.hashParams(params);
    return `rec:${userId}:${paramsHash}`;
  }

  /**
   * Generate cache key for ML predictions
   */
  mlPredictionKey(modelType: string, input: Record<string, any>): string {
    const inputHash = this.hashParams(input);
    return `ml:${modelType}:${inputHash}`;
  }

  /**
   * Hash parameters to create consistent cache keys
   */
  private hashParams(params: Record<string, any>): string {
    const sorted = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, any>);
    
    const str = JSON.stringify(sorted);
    return crypto.createHash('md5').update(str).digest('hex').substring(0, 16);
  }
}

// Export singleton instance
export const cacheService = new CacheService();
