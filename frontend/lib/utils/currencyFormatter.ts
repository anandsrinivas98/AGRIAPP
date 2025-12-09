/**
 * Currency Formatting Utilities
 * Formats currency values in Indian Rupees (INR) with proper symbols and numbering
 */

/**
 * Format number with Indian numbering system (lakhs and crores)
 */
export function formatIndianNumber(num: number): string {
  if (num < 1000) {
    return num.toFixed(2);
  }

  const numStr = Math.floor(num).toString();
  const lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);

  if (otherNumbers !== '') {
    const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    return formatted;
  }

  return lastThree;
}

/**
 * Format amount in INR with rupee symbol
 */
export function formatINR(amount: number, showDecimals: boolean = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0.00';
  }

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (showDecimals) {
    const integerPart = Math.floor(absAmount);
    const decimalPart = (absAmount - integerPart).toFixed(2).substring(1); // Get .XX part
    return `${sign}₹${formatIndianNumber(integerPart)}${decimalPart}`;
  }

  return `${sign}₹${formatIndianNumber(absAmount)}`;
}

/**
 * Format large numbers with units (Lakhs, Crores)
 */
export function formatINRWithUnits(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (absAmount >= 10000000) {
    // Crores (1 Crore = 10 Million)
    const crores = absAmount / 10000000;
    return `${sign}₹${crores.toFixed(2)} Cr`;
  } else if (absAmount >= 100000) {
    // Lakhs (1 Lakh = 100 Thousand)
    const lakhs = absAmount / 100000;
    return `${sign}₹${lakhs.toFixed(2)} L`;
  } else if (absAmount >= 1000) {
    // Thousands
    const thousands = absAmount / 1000;
    return `${sign}₹${thousands.toFixed(2)} K`;
  }

  return formatINR(amount);
}

/**
 * Format price change with absolute and percentage
 */
export interface PriceChange {
  absolute: string;
  percentage: string;
  isPositive: boolean;
}

export function formatPriceChange(
  currentPrice: number,
  previousPrice: number
): PriceChange {
  const absoluteChange = currentPrice - previousPrice;
  const percentageChange = previousPrice !== 0 
    ? ((absoluteChange / previousPrice) * 100) 
    : 0;

  const isPositive = absoluteChange >= 0;
  const sign = isPositive ? '+' : '';

  return {
    absolute: `${sign}${formatINR(absoluteChange)}`,
    percentage: `${sign}${percentageChange.toFixed(2)}%`,
    isPositive,
  };
}

/**
 * Format price change from change value and percentage
 */
export function formatPriceChangeFromValues(
  change: number,
  changePercent: number
): PriceChange {
  const isPositive = change >= 0;
  const sign = isPositive ? '+' : '';

  return {
    absolute: `${sign}${formatINR(Math.abs(change))}`,
    percentage: `${sign}${Math.abs(changePercent).toFixed(2)}%`,
    isPositive,
  };
}

/**
 * Parse INR string to number
 */
export function parseINR(inrString: string): number {
  // Remove currency symbol, commas, and spaces
  const cleaned = inrString.replace(/[₹,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format volume with appropriate units
 */
export function formatVolume(volume: number, unit: string = 'tons'): string {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(2)}M ${unit}`;
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(2)}K ${unit}`;
  }
  return `${volume.toFixed(0)} ${unit}`;
}

/**
 * Format decimal to 2 places
 */
export function formatDecimal(value: number, places: number = 2): string {
  return value.toFixed(places);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, showSign: boolean = false): string {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Convert currency to INR (placeholder for future implementation)
 */
export function convertToINR(amount: number, fromCurrency: string): number {
  // For now, assume all amounts are already in INR
  // In future, implement actual currency conversion with exchange rates
  if (fromCurrency === 'INR') {
    return amount;
  }

  // Placeholder exchange rates (should be fetched from API)
  const exchangeRates: Record<string, number> = {
    USD: 83.0,
    EUR: 90.0,
    GBP: 105.0,
  };

  const rate = exchangeRates[fromCurrency] || 1;
  return amount * rate;
}
