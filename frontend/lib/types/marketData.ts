/**
 * Market Data Type Definitions
 * Core data models for Indian agriculture market data
 */

export type APISource = 'agmarknet' | 'enam' | 'ogd' | 'fallback';

export type MarketSentiment = 'bullish' | 'bearish' | 'neutral';

export type ListingStatus = 'available' | 'pending' | 'sold';

export type EquipmentAvailability = 'available' | 'rented' | 'sold';

/**
 * Commodity Price Data
 */
export interface CommodityPrice {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number; // in INR
  change: number; // absolute change in INR
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: string;
  category: string;
  market: string; // mandi/market name
  state: string;
  lastUpdated: string; // ISO timestamp
  source: APISource;
}

/**
 * Market Metric for Overview
 */
export interface MarketMetric {
  name: string;
  price: number;
  change: number;
  volume: string;
  sentiment: MarketSentiment;
  color: string;
}

/**
 * Price History Point for Charts
 */
export interface PriceHistoryPoint {
  date: string;
  [commodity: string]: number | string; // dynamic commodity prices
}

/**
 * Top Mover Data
 */
export interface TopMover {
  name: string;
  change: number;
  changePercent: number;
}

/**
 * Market Overview Data
 */
export interface MarketOverview {
  totalMarketValue: number; // in INR
  totalVolume: string;
  activeMarkets: number;
  averagePriceChange: number;
  metrics: MarketMetric[];
  priceData: PriceHistoryPoint[];
  topMovers: TopMover[];
  sentiment: MarketSentiment;
  lastUpdated: string;
}

/**
 * Seller Information
 */
export interface SellerInfo {
  name: string;
  rating: number;
  verified: boolean;
  phone: string;
  registrationNumber?: string;
}

/**
 * Crop Listing Data
 */
export interface CropListing {
  id: string;
  cropType: string;
  quantity: number;
  unit: string;
  pricePerUnit: number; // in INR
  totalPrice: number; // in INR
  quality: string;
  harvestDate: string;
  location: string;
  state: string;
  seller: SellerInfo;
  description: string;
  status: ListingStatus;
  expiresIn: string;
  source: APISource;
}

/**
 * Volume Data for Analytics
 */
export interface VolumeData {
  crop: string;
  volume: number;
  value: number; // in INR
}

/**
 * Market Share Data for Analytics
 */
export interface MarketShareData {
  name: string;
  value: number; // percentage
}

/**
 * Market Insight
 */
export interface MarketInsight {
  id: number;
  title: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  percentage: number;
}

/**
 * Market Analytics Data
 */
export interface MarketAnalytics {
  priceHistory: PriceHistoryPoint[];
  volumeData: VolumeData[];
  marketShare: MarketShareData[];
  insights: MarketInsight[];
  totalMarketValue: number;
  totalVolume: number;
  activeTraders: number;
}

/**
 * Equipment Data
 */
export interface Equipment {
  id: string;
  title: string;
  category: string;
  type: 'sale' | 'rent';
  price: number; // in INR
  rentPrice?: number; // in INR per day
  location: string;
  condition: string;
  year: number;
  brand: string;
  description: string;
  seller: {
    name: string;
    rating: number;
    reviews: number;
    phone: string;
    email: string;
    verified: boolean;
  };
  specifications: { [key: string]: string };
  availability: EquipmentAvailability;
}

/**
 * Supplier Data
 */
export interface Supplier {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  reviews: number;
  verified: boolean;
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  products: string[];
  certifications: string[];
  yearsInBusiness: number;
}

/**
 * Cache Metadata
 */
export interface CacheMetadata {
  key: string;
  timestamp: number;
  ttl: number;
  age: number;
  isValid: boolean;
}

/**
 * Cache Status
 */
export interface CacheStatus {
  enabled: boolean;
  entries: number;
  totalSize: number;
  oldestEntry?: CacheMetadata;
  newestEntry?: CacheMetadata;
}

/**
 * Error Context for Logging
 */
export interface ErrorContext {
  component?: string;
  action?: string;
  apiSource?: APISource;
  endpoint?: string;
  timestamp: string;
  additionalInfo?: Record<string, any>;
}

/**
 * API Response Wrapper
 */
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  source: APISource;
  timestamp: string;
  fromCache?: boolean;
  cacheAge?: number;
  fromFallback?: boolean;
}

/**
 * Price Query Options
 */
export interface PriceQueryOptions {
  category?: string;
  state?: string;
  market?: string;
  limit?: number;
  offset?: number;
}

/**
 * Crop Filters
 */
export interface CropFilters {
  cropType?: string;
  quality?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ListingStatus;
}

/**
 * Data Type Enum
 */
export enum DataType {
  COMMODITY_PRICES = 'commodity_prices',
  MARKET_OVERVIEW = 'market_overview',
  CROP_LISTINGS = 'crop_listings',
  PRICE_HISTORY = 'price_history',
  MARKET_ANALYTICS = 'market_analytics',
}
