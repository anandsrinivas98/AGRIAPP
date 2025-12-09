/**
 * Cache Manager
 * Manages data caching with TTL support and localStorage persistence
 */

import { CacheMetadata, CacheStatus } from '../types/marketData';

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private cache: Map<string, CacheEntry>;
  private storageKey = 'agrisense_market_cache';

  constructor() {
    this.cache = new Map();
    this.loadFromStorage();
  }

  /**
   * Store data with expiration
   */
  set<T>(key: string, data: T, ttl: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    this.cache.set(key, entry);
    this.saveToStorage();
  }

  /**
   * Retrieve cached data
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if cache is still valid
    if (!this.isValid(key)) {
      this.clear(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Check if cache is valid
   */
  isValid(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    const age = Date.now() - entry.timestamp;
    return age < entry.ttl * 1000; // ttl is in seconds
  }

  /**
   * Get cache age in seconds
   */
  getAge(key: string): number {
    const entry = this.cache.get(key);

    if (!entry) {
      return 0;
    }

    return Math.floor((Date.now() - entry.timestamp) / 1000);
  }

  /**
   * Clear specific cache entry
   */
  clear(key: string): void {
    this.cache.delete(key);
    this.saveToStorage();
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.clear();
    this.saveToStorage();
  }

  /**
   * Get cache metadata
   */
  getMetadata(key: string): CacheMetadata | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const age = this.getAge(key);

    return {
      key,
      timestamp: entry.timestamp,
      ttl: entry.ttl,
      age,
      isValid: this.isValid(key),
    };
  }

  /**
   * Get cache status
   */
  getCacheStatus(): CacheStatus {
    const entries = Array.from(this.cache.entries());
    const metadataList = entries
      .map(([key]) => this.getMetadata(key))
      .filter((m): m is CacheMetadata => m !== null);

    const totalSize = this.estimateSize();

    const oldestEntry = metadataList.reduce((oldest, current) => {
      if (!oldest || current.timestamp < oldest.timestamp) {
        return current;
      }
      return oldest;
    }, metadataList[0]);

    const newestEntry = metadataList.reduce((newest, current) => {
      if (!newest || current.timestamp > newest.timestamp) {
        return current;
      }
      return newest;
    }, metadataList[0]);

    return {
      enabled: true,
      entries: this.cache.size,
      totalSize,
      oldestEntry,
      newestEntry,
    };
  }

  /**
   * Estimate cache size in bytes
   */
  private estimateSize(): number {
    try {
      const serialized = JSON.stringify(Array.from(this.cache.entries()));
      return new Blob([serialized]).size;
    } catch {
      return 0;
    }
  }

  /**
   * Load cache from localStorage
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const entries: [string, CacheEntry][] = JSON.parse(stored);
        this.cache = new Map(entries);

        // Clean up expired entries
        this.cleanupExpired();
      }
    } catch (error) {
      console.error('Failed to load cache from storage:', error);
      this.cache = new Map();
    }
  }

  /**
   * Save cache to localStorage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const entries = Array.from(this.cache.entries());
      localStorage.setItem(this.storageKey, JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save cache to storage:', error);
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanupExpired(): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach((key) => {
      if (!this.isValid(key)) {
        this.cache.delete(key);
      }
    });
    this.saveToStorage();
  }

  /**
   * Get all cache keys
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    return this.cache.has(key) && this.isValid(key);
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();
