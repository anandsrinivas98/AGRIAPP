/**
 * Market Data Service
 * Unified interface for fetching Indian agriculture market data
 */

import { agmarknetService } from './agmarknetService';
import { cacheManager } from './cacheManager';
import {
  CommodityPrice,
  MarketOverview,
  CropListing,
  MarketAnalytics,
  PriceHistoryPoint,
  PriceQueryOptions,
  CropFilters,
  DataType,
} from '../types/marketData';
import {
  transformToMarketOverview,
  transformToCropListings,
  transformToMarketAnalytics,
} from './dataTransformer';
import { getMarketAPIConfig } from '../config/marketApiConfig';

class MarketDataService {
  private config = getMarketAPIConfig();

  /**
   * Fetch commodity prices with caching and fallback
   */
  async getCommodityPrices(options?: PriceQueryOptions): Promise<CommodityPrice[]> {
    const cacheKey = `commodity_prices_${JSON.stringify(options || {})}`;

    // Check cache first
    if (this.config.cache.enabled) {
      const cached = cacheManager.get<CommodityPrice[]>(cacheKey);
      if (cached) {
        console.log('Returning cached commodity prices');
        return cached;
      }
    }

    try {
      // Try primary source (Agmarknet)
      if (this.config.agmarknet.enabled) {
        const data = await agmarknetService.fetchMandiPrices({
          limit: options?.limit || 50,
          offset: options?.offset || 0,
        });

        // Apply filters
        let filtered = data;
        if (options?.category) {
          filtered = filtered.filter(c => c.category === options.category);
        }
        if (options?.state) {
          filtered = filtered.filter(c => c.state === options.state);
        }
        if (options?.market) {
          filtered = filtered.filter(c => c.market === options.market);
        }

        // Cache the result
        if (this.config.cache.enabled) {
          cacheManager.set(cacheKey, filtered, this.config.cache.ttl.prices);
        }

        return filtered;
      }

      // If no sources available, return fallback data
      return this.getFallbackCommodityPrices();
    } catch (error) {
      console.error('Failed to fetch commodity prices:', error);

      // Try to return cached data even if expired
      const cached = cacheManager.get<CommodityPrice[]>(cacheKey);
      if (cached) {
        console.log('Returning expired cache due to error');
        return cached;
      }

      // Return fallback data
      return this.getFallbackCommodityPrices();
    }
  }

  /**
   * Fetch market overview
   */
  async getMarketOverview(timeframe: '7d' | '30d' = '7d'): Promise<MarketOverview> {
    const cacheKey = `market_overview_${timeframe}`;

    // Check cache
    if (this.config.cache.enabled) {
      const cached = cacheManager.get<MarketOverview>(cacheKey);
      if (cached) {
        console.log('Returning cached market overview');
        return cached;
      }
    }

    try {
      // Fetch commodity prices
      const commodities = await this.getCommodityPrices({ limit: 20 });

      // Transform to market overview
      const overview = transformToMarketOverview(commodities, timeframe);

      // Cache the result
      if (this.config.cache.enabled) {
        cacheManager.set(cacheKey, overview, this.config.cache.ttl.overview);
      }

      return overview;
    } catch (error) {
      console.error('Failed to fetch market overview:', error);

      // Try cached data
      const cached = cacheManager.get<MarketOverview>(cacheKey);
      if (cached) {
        return cached;
      }

      // Return fallback
      return this.getFallbackMarketOverview(timeframe);
    }
  }

  /**
   * Fetch crop listings
   */
  async getCropListings(filters?: CropFilters): Promise<CropListing[]> {
    const cacheKey = `crop_listings_${JSON.stringify(filters || {})}`;

    // Check cache
    if (this.config.cache.enabled) {
      const cached = cacheManager.get<CropListing[]>(cacheKey);
      if (cached) {
        console.log('Returning cached crop listings');
        return cached;
      }
    }

    try {
      // Fetch commodity prices and transform to listings
      const commodities = await this.getCommodityPrices({ limit: 20 });
      let listings = transformToCropListings(commodities);

      // Apply filters
      if (filters?.cropType) {
        listings = listings.filter(l => l.cropType === filters.cropType);
      }
      if (filters?.quality) {
        listings = listings.filter(l => l.quality === filters.quality);
      }
      if (filters?.state) {
        listings = listings.filter(l => l.state === filters.state);
      }
      if (filters?.status) {
        listings = listings.filter(l => l.status === filters.status);
      }
      if (filters?.minPrice) {
        listings = listings.filter(l => l.pricePerUnit >= filters.minPrice!);
      }
      if (filters?.maxPrice) {
        listings = listings.filter(l => l.pricePerUnit <= filters.maxPrice!);
      }

      // Cache the result
      if (this.config.cache.enabled) {
        cacheManager.set(cacheKey, listings, this.config.cache.ttl.listings);
      }

      return listings;
    } catch (error) {
      console.error('Failed to fetch crop listings:', error);

      // Try cached data
      const cached = cacheManager.get<CropListing[]>(cacheKey);
      if (cached) {
        return cached;
      }

      // Return fallback
      return [];
    }
  }

  /**
   * Fetch price history for charts
   */
  async getPriceHistory(commodity: string, days: number): Promise<PriceHistoryPoint[]> {
    const cacheKey = `price_history_${commodity}_${days}`;

    // Check cache
    if (this.config.cache.enabled) {
      const cached = cacheManager.get<PriceHistoryPoint[]>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // For now, generate mock historical data
    // In production, this would fetch actual historical data from API
    const history: PriceHistoryPoint[] = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));

      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        [commodity]: 2000 + Math.random() * 500,
      };
    });

    // Cache the result
    if (this.config.cache.enabled) {
      cacheManager.set(cacheKey, history, this.config.cache.ttl.historical);
    }

    return history;
  }

  /**
   * Fetch market analytics
   */
  async getMarketAnalytics(timeframe: string = '30d'): Promise<MarketAnalytics> {
    const cacheKey = `market_analytics_${timeframe}`;

    // Check cache
    if (this.config.cache.enabled) {
      const cached = cacheManager.get<MarketAnalytics>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      // Fetch commodity prices
      const commodities = await this.getCommodityPrices({ limit: 20 });

      // Transform to analytics
      const analytics = transformToMarketAnalytics(commodities, timeframe);

      // Cache the result
      if (this.config.cache.enabled) {
        cacheManager.set(cacheKey, analytics, this.config.cache.ttl.overview);
      }

      return analytics;
    } catch (error) {
      console.error('Failed to fetch market analytics:', error);

      // Try cached data
      const cached = cacheManager.get<MarketAnalytics>(cacheKey);
      if (cached) {
        return cached;
      }

      // Return fallback
      return this.getFallbackMarketAnalytics(timeframe);
    }
  }

  /**
   * Manual refresh trigger
   */
  async refreshData(dataType: DataType): Promise<void> {
    // Clear cache for specific data type
    const keys = cacheManager.getKeys();
    keys.forEach(key => {
      if (key.startsWith(dataType)) {
        cacheManager.clear(key);
      }
    });
  }

  /**
   * Get cache status
   */
  getCacheStatus() {
    return cacheManager.getCacheStatus();
  }

  /**
   * Fallback commodity prices (Indian market data)
   */
  private getFallbackCommodityPrices(): CommodityPrice[] {
    console.log('⚠️ Using fallback data - API unavailable');
    return [
      {
        id: '1',
        name: 'Wheat',
        symbol: 'WHEAT',
        currentPrice: 2250,
        change: 50,
        changePercent: 2.27,
        high24h: 2300,
        low24h: 2200,
        volume: '1200 tons',
        category: 'grains',
        market: 'Azadpur Mandi',
        state: 'Delhi',
        lastUpdated: new Date().toISOString(),
        source: 'fallback',
      },
      {
        id: '2',
        name: 'Rice (Basmati)',
        symbol: 'RICE',
        currentPrice: 3500,
        change: -75,
        changePercent: -2.10,
        high24h: 3600,
        low24h: 3450,
        volume: '1800 tons',
        category: 'grains',
        market: 'Vashi APMC',
        state: 'Maharashtra',
        lastUpdated: new Date().toISOString(),
        source: 'fallback',
      },
      {
        id: '3',
        name: 'Bajra',
        symbol: 'BAJRA',
        currentPrice: 1800,
        change: 25,
        changePercent: 1.41,
        high24h: 1850,
        low24h: 1775,
        volume: '900 tons',
        category: 'grains',
        market: 'Koyambedu Market',
        state: 'Tamil Nadu',
        lastUpdated: new Date().toISOString(),
        source: 'fallback',
      },
    ];
  }

  /**
   * Fallback market overview
   */
  private getFallbackMarketOverview(timeframe: '7d' | '30d'): MarketOverview {
    const fallbackPrices = this.getFallbackCommodityPrices();
    return transformToMarketOverview(fallbackPrices, timeframe);
  }

  /**
   * Fallback market analytics
   */
  private getFallbackMarketAnalytics(timeframe: string): MarketAnalytics {
    const fallbackPrices = this.getFallbackCommodityPrices();
    return transformToMarketAnalytics(fallbackPrices, timeframe);
  }
}

export const marketDataService = new MarketDataService();
