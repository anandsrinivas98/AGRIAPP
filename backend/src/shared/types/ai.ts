// Crop Recommendation Types
export interface CropRecommendationRequest {
  farmId?: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  season: string;
  marketDemand?: string;
}

export interface CropRecommendationResponse {
  id: string;
  recommendations: any[];
  confidence: number;
  createdAt: Date;
}

// Yield Prediction Types
export interface YieldPredictionRequest {
  farmId?: string;
  crop: string;
  area: number;
  avgRainfall: number;
  pesticideUsage: number;
  temperature: number;
  pastYields?: any;
  
  // Extended data
  soilData?: any;
  weatherData?: any;
  farmingPractices?: any;
  location?: {
    latitude: number;
    longitude: number;
  };
  analysis?: any;
  recommendations?: any;
  comparisons?: any;
  metadata?: any;
}

export interface YieldPredictionResponse {
  id: string;
  crop: string;
  area: number;
  predictedYield: number;
  confidence: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  createdAt: Date;
  farm?: {
    id: string;
    name: string;
    location: string;
  };
}

// Disease Detection Types
export interface DiseaseDetectionRequest {
  cropType?: string;
}

export interface DiseaseDetectionResponse {
  id: string;
  imagePath: string;
  cropType?: string;
  diseaseName: string;
  severity: string;
  confidence: number;
  treatment: any;
  annotations?: any;
  createdAt: Date;
}