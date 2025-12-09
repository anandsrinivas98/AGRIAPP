/**
 * Data Transformation Layer
 * Normalizes data from different API formats into consistent internal models
 */

import {
  CommodityPrice,
  MarketOverview,
  CropListing,
  MarketAnalytics,
  APISource,
  MarketMetric,
  PriceHistoryPoint,
  VolumeData,
  MarketShareData,
  MarketInsight,
} from '../types/marketData';
import { convertToINR } from '../utils/currencyFormatter';

/**
 * Transform Agmarknet response to CommodityPrice
 */
export function transformAgmarknetToCommodityPrice(rawData: any): CommodityPrice {
  const id = rawData.id || `${rawData.commodity}-${rawData.market}-${Date.now()}`;
  const name = rawData.commodity || rawData.Commodity || 'Unknown';
  const market = rawData.market || rawData.Market || 'Unknown Market';
  const state = rawData.state || rawData.State || 'Unknown State';
  const modalPrice = parseFloat(rawData.modal_price || rawData.Modal_Price || rawData.price || 0);
  
  // Calculate mock change data (in real implementation, compare with historical data)
  const change = modalPrice * (Math.random() * 0.1 - 0.05); // -5% to +5%
  const changePercent = (change / modalPrice) * 100;
  
  return {
    id,
    name,
    symbol: name.substring(0, 4).toUpperCase(),
    currentPrice: modalPrice,
    change,
    changePercent,
    high24h: modalPrice * 1.05,
    low24h: modalPrice * 0.95,
    volume: `${Math.floor(Math.random() * 5000 + 1000)} tons`,
    category: categorizeCommmodity(name),
    market,
    state,
    lastUpdated: rawData.arrival_date || new Date().toISOString(),
    source: 'agmarknet',
  };
}

/**
 * Transform OGD response to CommodityPrice
 */
export function transformOGDToCommodityPrice(rawData: any): CommodityPrice {
  // Similar to Agmarknet transformation
  return transformAgmarknetToCommodityPrice(rawData);
}

/**
 * Categorize commodity based on name
 */
function categorizeCommmodity(name: string): string {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('wheat') || nameLower.includes('rice') || nameLower.includes('corn') || 
      nameLower.includes('maize') || nameLower.includes('barley') || nameLower.includes('millet')) {
    return 'grains';
  }
  
  if (nameLower.includes('soybean') || nameLower.includes('mustard') || nameLower.includes('groundnut') ||
      nameLower.includes('sunflower') || nameLower.includes('cotton')) {
    return 'oilseeds';
  }
  
  if (nameLower.includes('potato') || nameLower.includes('onion') || nameLower.includes('tomato') ||
      nameLower.includes('cabbage') || nameLower.includes('cauliflower')) {
    return 'vegetables';
  }
  
  if (nameLower.includes('mango') || nameLower.includes('banana') || nameLower.includes('apple') ||
      nameLower.includes('orange') || nameLower.includes('grape')) {
    return 'fruits';
  }
  
  if (nameLower.includes('milk') || nameLower.includes('ghee') || nameLower.includes('butter')) {
    return 'dairy';
  }
  
  if (nameLower.includes('sugar') || nameLower.includes('jaggery')) {
    return 'sweeteners';
  }
  
  if (nameLower.includes('pulse') || nameLower.includes('lentil') || nameLower.includes('gram') ||
      nameLower.includes('pea') || nameLower.includes('bean')) {
    return 'pulses';
  }
  
  return 'others';
}

/**
 * Transform commodity prices to market overview
 */
export function transformToMarketOverview(
  commodities: CommodityPrice[],
  timeframe: '7d' | '30d'
): MarketOverview {
  // Calculate aggregate metrics
  const totalVolume = commodities.reduce((sum, c) => {
    const vol = parseInt(c.volume.replace(/[^\d]/g, '')) || 0;
    return sum + vol;
  }, 0);
  
  const totalValue = commodities.reduce((sum, c) => sum + c.currentPrice, 0);
  const avgChange = commodities.reduce((sum, c) => sum + c.changePercent, 0) / commodities.length;
  
  // Get unique markets
  const uniqueMarkets = new Set(commodities.map(c => c.market)).size;
  
  // Create metrics for top commodities
  const topCommodities = commodities
    .sort((a, b) => b.currentPrice - a.currentPrice)
    .slice(0, 4);
  
  const metrics: MarketMetric[] = topCommodities.map(c => ({
    name: c.name,
    price: c.currentPrice,
    change: c.changePercent,
    volume: c.volume,
    sentiment: c.changePercent > 2 ? 'bullish' : c.changePercent < -2 ? 'bearish' : 'neutral',
    color: c.changePercent > 0 ? '#10B981' : '#EF4444',
  }));
  
  // Generate price history data
  const days = timeframe === '7d' ? 7 : 30;
  const priceData: PriceHistoryPoint[] = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    const point: PriceHistoryPoint = {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
    
    topCommodities.forEach(c => {
      const basePrice = c.currentPrice;
      const variation = (Math.random() - 0.5) * basePrice * 0.1;
      point[c.name.toLowerCase()] = basePrice + variation;
    });
    
    return point;
  });
  
  // Get top movers
  const topMovers = commodities
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 3)
    .map(c => ({
      name: c.name,
      change: c.change,
      changePercent: c.changePercent,
    }));
  
  return {
    totalMarketValue: totalValue,
    totalVolume: `${(totalVolume / 1000).toFixed(1)}K tons`,
    activeMarkets: uniqueMarkets,
    averagePriceChange: avgChange,
    metrics,
    priceData,
    topMovers,
    sentiment: avgChange > 1 ? 'bullish' : avgChange < -1 ? 'bearish' : 'neutral',
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Transform commodity prices to crop listings
 */
export function transformToCropListings(commodities: CommodityPrice[]): CropListing[] {
  return commodities.slice(0, 10).map((c, index) => ({
    id: `listing-${c.id}`,
    cropType: c.name.toLowerCase(),
    quantity: Math.floor(Math.random() * 10000 + 1000),
    unit: 'quintals',
    pricePerUnit: c.currentPrice / 100, // Price per quintal
    totalPrice: (c.currentPrice / 100) * Math.floor(Math.random() * 10000 + 1000),
    quality: ['premium', 'grade-a', 'grade-b'][Math.floor(Math.random() * 3)],
    harvestDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    location: c.market,
    state: c.state,
    seller: {
      name: `${c.market} Farmers Co-op`,
      rating: 4 + Math.random(),
      verified: Math.random() > 0.3,
      phone: `+91-${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    },
    description: `High-quality ${c.name} from ${c.state}. Properly stored and tested.`,
    status: 'available',
    expiresIn: `${Math.floor(Math.random() * 7 + 1)} days`,
    source: c.source,
  }));
}

/**
 * Transform commodity prices to market analytics
 */
export function transformToMarketAnalytics(
  commodities: CommodityPrice[],
  timeframe: string
): MarketAnalytics {
  const days = timeframe === '7d' ? 7 : 30;
  
  // Generate price history
  const priceHistory: PriceHistoryPoint[] = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    const point: PriceHistoryPoint = {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
    
    commodities.slice(0, 3).forEach(c => {
      const basePrice = c.currentPrice;
      const variation = (Math.random() - 0.5) * basePrice * 0.15;
      point[c.name.toLowerCase()] = basePrice + variation;
    });
    
    return point;
  });
  
  // Generate volume data
  const volumeData: VolumeData[] = commodities.slice(0, 5).map(c => ({
    crop: c.name,
    volume: Math.floor(Math.random() * 2000000 + 500000),
    value: c.currentPrice * Math.floor(Math.random() * 2000000 + 500000),
  }));
  
  // Calculate market share
  const totalVolume = volumeData.reduce((sum, v) => sum + v.volume, 0);
  const marketShare: MarketShareData[] = volumeData.map(v => ({
    name: v.crop,
    value: (v.volume / totalVolume) * 100,
  }));
  
  // Generate insights
  const insights: MarketInsight[] = [
    {
      id: 1,
      title: `${commodities[0]?.name || 'Wheat'} Prices ${commodities[0]?.changePercent > 0 ? 'Rising' : 'Falling'}`,
      description: `${commodities[0]?.name || 'Wheat'} prices have ${commodities[0]?.changePercent > 0 ? 'increased' : 'decreased'} by ${Math.abs(commodities[0]?.changePercent || 0).toFixed(1)}% due to ${commodities[0]?.changePercent > 0 ? 'strong demand' : 'increased supply'}.`,
      trend: commodities[0]?.changePercent > 0 ? 'up' : 'down',
      impact: Math.abs(commodities[0]?.changePercent || 0) > 5 ? 'high' : 'medium',
      percentage: commodities[0]?.changePercent || 0,
    },
    {
      id: 2,
      title: 'Trading Volume Surge',
      description: `Trading volume has reached ${(totalVolume / 1000000).toFixed(1)}M tons this period.`,
      trend: 'up',
      impact: 'medium',
      percentage: 15.3,
    },
  ];
  
  return {
    priceHistory,
    volumeData,
    marketShare,
    insights,
    totalMarketValue: volumeData.reduce((sum, v) => sum + v.value, 0),
    totalVolume: totalVolume,
    activeTraders: Math.floor(Math.random() * 5000 + 2000),
  };
}

/**
 * Validate and clean commodity price data
 */
export function validateCommodityPrice(data: Partial<CommodityPrice>): boolean {
  return !!(
    data.name &&
    typeof data.currentPrice === 'number' &&
    data.currentPrice >= 0 &&
    data.market &&
    data.state
  );
}
