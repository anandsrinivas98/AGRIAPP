/**
 * Constants and configuration for Yield Prediction feature
 */

import { CropOption } from '@/lib/types/yieldPrediction';

// Crop options for the form dropdown
export const CROP_OPTIONS: CropOption[] = [
  {
    value: 'rice',
    label: 'Rice',
    category: 'Cereals',
    specificParameters: {
      optimalPH: [5.5, 6.5],
      growingSeasonDays: 120,
      waterRequirement: 'high'
    }
  },
  {
    value: 'wheat',
    label: 'Wheat',
    category: 'Cereals',
    specificParameters: {
      optimalPH: [6.0, 7.5],
      growingSeasonDays: 150,
      waterRequirement: 'medium'
    }
  },
  {
    value: 'corn',
    label: 'Corn (Maize)',
    category: 'Cereals',
    specificParameters: {
      optimalPH: [6.0, 6.8],
      growingSeasonDays: 100,
      waterRequirement: 'medium'
    }
  },
  {
    value: 'soybean',
    label: 'Soybean',
    category: 'Legumes',
    specificParameters: {
      optimalPH: [6.0, 7.0],
      growingSeasonDays: 110,
      waterRequirement: 'medium'
    }
  },
  {
    value: 'cotton',
    label: 'Cotton',
    category: 'Fiber Crops',
    specificParameters: {
      optimalPH: [5.8, 8.0],
      growingSeasonDays: 180,
      waterRequirement: 'high'
    }
  },
  {
    value: 'sugarcane',
    label: 'Sugarcane',
    category: 'Cash Crops',
    specificParameters: {
      optimalPH: [6.0, 7.5],
      growingSeasonDays: 365,
      waterRequirement: 'high'
    }
  },
  {
    value: 'potato',
    label: 'Potato',
    category: 'Tuber Crops',
    specificParameters: {
      optimalPH: [4.8, 5.4],
      growingSeasonDays: 90,
      waterRequirement: 'medium'
    }
  },
  {
    value: 'tomato',
    label: 'Tomato',
    category: 'Vegetables',
    specificParameters: {
      optimalPH: [6.0, 6.8],
      growingSeasonDays: 75,
      waterRequirement: 'medium'
    }
  }
];

// Irrigation method options
export const IRRIGATION_METHODS = [
  { value: 'drip', label: 'Drip Irrigation' },
  { value: 'sprinkler', label: 'Sprinkler Irrigation' },
  { value: 'flood', label: 'Flood Irrigation' },
  { value: 'furrow', label: 'Furrow Irrigation' },
  { value: 'traditional', label: 'Traditional/Rain-fed' }
];

// Seasonal pattern options
export const SEASONAL_PATTERNS = [
  { value: 'kharif', label: 'Kharif (Monsoon)' },
  { value: 'rabi', label: 'Rabi (Winter)' },
  { value: 'zaid', label: 'Zaid (Summer)' },
  { value: 'current', label: 'Current Season' }
];

// Input validation ranges - Enhanced for agricultural realism
export const VALIDATION_RANGES = {
  ph: { min: 0, max: 14 },
  nitrogen: { min: 0, max: 100 },
  phosphorus: { min: 0, max: 100 },
  potassium: { min: 0, max: 100 },
  organicMatter: { min: 0, max: 20 },
  temperature: { min: -10, max: 50 },
  rainfall: { min: 0, max: 3000 },
  humidity: { min: 0, max: 100 },
  area: { min: 0.01, max: 10000 },
  fertilizerUsage: { min: 0, max: 1000 },
  pesticideUsage: { min: 0, max: 50 },
  farmingExperience: { min: 0, max: 80 }
};

// Default form values
export const DEFAULT_FORM_VALUES = {
  crop: '',
  area: '',
  ph: '',
  nitrogen: '',
  phosphorus: '',
  potassium: '',
  organicMatter: '',
  temperature: '',
  rainfall: '',
  humidity: '',
  seasonalPattern: 'current',
  irrigationMethod: 'traditional',
  fertilizerUsage: '',
  pesticideUsage: '',
  farmingExperience: '1',
  location: '',
  latitude: '',
  longitude: '',
  region: '',
  historicalYields: ''
};

// Chart colors matching the existing design system
export const CHART_COLORS = {
  primary: '#22c55e',
  secondary: '#16a34a',
  accent: '#84cc16',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  gradient: ['#22c55e', '#16a34a', '#84cc16']
};

// Animation durations for consistency
export const ANIMATION_DURATIONS = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  chart: 1.0
};