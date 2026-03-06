/**
 * TypeScript interfaces for Yield Prediction feature
 * Based on the design document specifications
 */

// Input data interfaces
export interface SoilData {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
}

export interface WeatherData {
  temperature: number;
  rainfall: number;
  humidity: number;
  seasonalPattern: string;
}

export interface FarmingPractices {
  irrigationMethod: string;
  fertilizerUsage: number;
  pesticideUsage: number;
  farmingExperience: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  region: string;
}

export interface YieldPredictionRequest {
  crop: string;
  area: number;
  soilData: SoilData;
  weatherData: WeatherData;
  farmingPractices: FarmingPractices;
  location: LocationData;
  historicalYields?: number[];
}

// Response data interfaces
export interface PredictionResult {
  estimatedYield: number;
  unit: string;
  confidenceInterval: [number, number];
  confidenceScore: number;
}

export interface KeyFactor {
  factor: string;
  impact: number;
  description: string;
}

export interface Analysis {
  keyFactors: KeyFactor[];
  riskFactors: string[];
  opportunities: string[];
}

export interface Recommendation {
  category: string;
  action: string;
  expectedImpact: string;
  priority: 'high' | 'medium' | 'low';
  timeline: string;
}

export interface Comparisons {
  regionalAverage: number;
  historicalAverage: number;
  potentialMaximum: number;
}

export interface PredictionMetadata {
  modelVersion: string;
  timestamp: string;
  processingTime: number;
}

export interface YieldPredictionResponse {
  success: boolean;
  prediction: PredictionResult;
  analysis: Analysis;
  recommendations: Recommendation[];
  comparisons: Comparisons;
  metadata: PredictionMetadata;
}

// Form data interface for UI state management
export interface YieldPredictionFormData {
  crop: string;
  area: string;
  // Soil parameters
  ph: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  organicMatter: string;
  // Weather parameters
  temperature: string;
  rainfall: string;
  humidity: string;
  seasonalPattern: string;
  // Farming practices
  irrigationMethod: string;
  fertilizerUsage: string;
  pesticideUsage: string;
  farmingExperience: string;
  // Location
  location: string;
  latitude: string;
  longitude: string;
  region: string;
  // Optional historical data
  historicalYields: string;
}

// Component props interfaces
export interface PredictionInputFormProps {
  formData: YieldPredictionFormData;
  onFormDataChange: (data: Partial<YieldPredictionFormData>) => void;
  onSubmit: (data: YieldPredictionRequest) => void;
  loading: boolean;
}

export interface PredictionResultsCardProps {
  prediction: PredictionResult;
  analysis: Analysis;
  comparisons: Comparisons;
  metadata: PredictionMetadata;
}

export interface YieldVisualizationChartsProps {
  prediction: PredictionResult;
  analysis: Analysis;
  comparisons: Comparisons;
  historicalData?: number[];
}

export interface MLRecommendationsPanelProps {
  recommendations: Recommendation[];
  analysis: Analysis;
}

// Crop options for form dropdown
export interface CropOption {
  value: string;
  label: string;
  category: string;
  specificParameters?: {
    optimalPH: [number, number];
    growingSeasonDays: number;
    waterRequirement: 'low' | 'medium' | 'high';
  };
}

// Validation error interface
export interface ValidationError {
  field: string;
  message: string;
}

// API error interface
export interface APIError {
  message: string;
  code?: string;
  details?: any;
}