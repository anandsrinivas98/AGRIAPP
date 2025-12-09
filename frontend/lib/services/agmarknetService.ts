/**
 * Agmarknet API Service
 * Fetches data from Government of India's Agmarknet API
 */

import { getMarketAPIConfig } from '../config/marketApiConfig';
import { CommodityPrice } from '../types/marketData';
import { transformAgmarknetToCommodityPrice } from './dataTransformer';

export class AgmarknetService {
  private config = getMarketAPIConfig().agmarknet;

  /**
   * Fetch mandi prices for commodities
   */
  async fetchMandiPrices(options?: {
    limit?: number;
    offset?: number;
    filters?: Record<string, string>;
  }): Promise<CommodityPrice[]> {
    if (!this.config.enabled) {
      throw new Error('Agmarknet API is disabled');
    }

    try {
      const params = new URLSearchParams({
        'api-key': this.config.apiKey || '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b',
        format: 'json',
        limit: (options?.limit || 50).toString(),
        offset: (options?.offset || 0).toString(),
      });

      // Add custom filters
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          params.append(`filters[${key}]`, value);
        });
      }

      const url = `${this.config.baseURL}/${this.config.resourceId}?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Agmarknet API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Transform records to CommodityPrice format
      const records = data.records || [];
      return records
        .map((record: any) => {
          try {
            return transformAgmarknetToCommodityPrice(record);
          } catch (error) {
            console.error('Failed to transform Agmarknet record:', error, record);
            return null;
          }
        })
        .filter((item: CommodityPrice | null): item is CommodityPrice => item !== null);
    } catch (error) {
      console.error('Agmarknet API fetch error:', error);
      throw error;
    }
  }

  /**
   * Fetch market yards list
   */
  async fetchMarketYards(): Promise<string[]> {
    // This would fetch list of markets/mandis
    // For now, return common markets
    return [
      'Azadpur Mandi, Delhi',
      'Vashi APMC, Mumbai',
      'Koyambedu Market, Chennai',
      'Yeshwanthpur APMC, Bangalore',
      'Gaddiannaram Mandi, Hyderabad',
    ];
  }

  /**
   * Fetch commodity list
   */
  async fetchCommodityList(): Promise<string[]> {
    // This would fetch list of available commodities
    // For now, return common commodities
    return [
      'Wheat',
      'Rice',
      'Maize',
      'Bajra',
      'Jowar',
      'Soybean',
      'Groundnut',
      'Mustard',
      'Cotton',
      'Sugarcane',
      'Potato',
      'Onion',
      'Tomato',
    ];
  }
}

export const agmarknetService = new AgmarknetService();
