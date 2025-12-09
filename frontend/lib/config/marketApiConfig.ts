/**
 * Market API Configuration
 * Loads and validates configuration from environment variables
 */

export interface APISourceConfig {
  enabled: boolean;
  apiKey?: string;
  baseURL: string;
  resourceId?: string;
  rateLimit: number;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: {
    prices: number;
    overview: number;
    historical: number;
    listings: number;
  };
}

export interface FallbackConfig {
  enabled: boolean;
  useMockData: boolean;
}

export interface MarketAPIConfig {
  agmarknet: APISourceConfig;
  enam: APISourceConfig;
  ogd: APISourceConfig;
  cache: CacheConfig;
  fallback: FallbackConfig;
}

/**
 * Parse boolean from environment variable
 */
function parseBoolean(value: string | undefined, defaultValue: boolean = false): boolean {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Parse number from environment variable
 */
function parseNumber(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Validate required configuration
 */
function validateConfig(config: MarketAPIConfig): void {
  const errors: string[] = [];

  // Check if at least one API source is enabled
  const hasEnabledSource = config.agmarknet.enabled || config.enam.enabled || config.ogd.enabled;
  if (!hasEnabledSource) {
    errors.push('At least one API source must be enabled (Agmarknet, eNAM, or OGD)');
  }

  // Validate Agmarknet configuration
  if (config.agmarknet.enabled) {
    if (!config.agmarknet.baseURL) {
      errors.push('NEXT_PUBLIC_AGMARKNET_API_URL is required when Agmarknet is enabled');
    }
    if (!config.agmarknet.resourceId) {
      errors.push('NEXT_PUBLIC_AGMARKNET_RESOURCE_ID is required when Agmarknet is enabled');
    }
  }

  // Validate eNAM configuration
  if (config.enam.enabled) {
    if (!config.enam.baseURL) {
      errors.push('NEXT_PUBLIC_ENAM_API_URL is required when eNAM is enabled');
    }
  }

  // Validate OGD configuration
  if (config.ogd.enabled) {
    if (!config.ogd.baseURL) {
      errors.push('NEXT_PUBLIC_OGD_API_URL is required when OGD is enabled');
    }
  }

  if (errors.length > 0) {
    console.error('Market API Configuration Errors:', errors);
    throw new Error(`Invalid Market API Configuration:\n${errors.join('\n')}`);
  }
}

/**
 * Load and validate market API configuration
 */
export function loadMarketAPIConfig(): MarketAPIConfig {
  const config: MarketAPIConfig = {
    agmarknet: {
      enabled: parseBoolean(process.env.NEXT_PUBLIC_AGMARKNET_ENABLED, true),
      apiKey: process.env.NEXT_PUBLIC_AGMARKNET_API_KEY,
      baseURL: process.env.NEXT_PUBLIC_AGMARKNET_API_URL || 'https://api.data.gov.in/resource',
      resourceId: process.env.NEXT_PUBLIC_AGMARKNET_RESOURCE_ID || '9ef84268-d588-465a-a308-a864a43d0070',
      rateLimit: parseNumber(process.env.NEXT_PUBLIC_AGMARKNET_RATE_LIMIT, 100),
    },
    enam: {
      enabled: parseBoolean(process.env.NEXT_PUBLIC_ENAM_ENABLED, false),
      apiKey: process.env.NEXT_PUBLIC_ENAM_API_KEY,
      baseURL: process.env.NEXT_PUBLIC_ENAM_API_URL || 'https://enam.gov.in/api',
      rateLimit: parseNumber(process.env.NEXT_PUBLIC_ENAM_RATE_LIMIT, 100),
    },
    ogd: {
      enabled: parseBoolean(process.env.NEXT_PUBLIC_OGD_ENABLED, true),
      apiKey: process.env.NEXT_PUBLIC_OGD_API_KEY,
      baseURL: process.env.NEXT_PUBLIC_OGD_API_URL || 'https://api.data.gov.in/resource',
      rateLimit: parseNumber(process.env.NEXT_PUBLIC_OGD_RATE_LIMIT, 100),
    },
    cache: {
      enabled: parseBoolean(process.env.NEXT_PUBLIC_MARKET_CACHE_ENABLED, true),
      ttl: {
        prices: parseNumber(process.env.NEXT_PUBLIC_MARKET_CACHE_TTL_PRICES, 300),
        overview: parseNumber(process.env.NEXT_PUBLIC_MARKET_CACHE_TTL_OVERVIEW, 600),
        historical: parseNumber(process.env.NEXT_PUBLIC_MARKET_CACHE_TTL_HISTORICAL, 3600),
        listings: parseNumber(process.env.NEXT_PUBLIC_MARKET_CACHE_TTL_LISTINGS, 900),
      },
    },
    fallback: {
      enabled: parseBoolean(process.env.NEXT_PUBLIC_MARKET_FALLBACK_ENABLED, true),
      useMockData: parseBoolean(process.env.NEXT_PUBLIC_MARKET_USE_MOCK_DATA, false),
    },
  };

  // Validate configuration
  validateConfig(config);

  return config;
}

// Export singleton instance
let configInstance: MarketAPIConfig | null = null;

export function getMarketAPIConfig(): MarketAPIConfig {
  if (!configInstance) {
    configInstance = loadMarketAPIConfig();
  }
  return configInstance;
}
