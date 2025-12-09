import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface CropGuideRequest {
  cropName: string;
  region?: string;
  season?: string;
  farmSize?: string;
  soilType?: string;
  climateZone?: string;
}

export interface CropGuideData {
  name: string;
  scientificName: string;
  category: string;
  season: string;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  introduction: string;
  climate: {
    temperature: {
      min: number;
      max: number;
      optimal: string;
    };
    rainfall: {
      annual: string;
      critical: string;
    };
    humidity: string;
    sunlight: string;
  };
  soil: {
    type: string[];
    ph: {
      min: number;
      max: number;
    };
    drainage: string;
    preparation: string[];
  };
  seedSelection: {
    varieties: Array<{
      name: string;
      yield: string;
      duration: string;
      features: string[];
    }>;
    seedTreatment: string[];
    spacing: {
      rowToRow: string;
      plantToPlant: string;
    };
    sowingMethod: string[];
    sowingDepth: string;
  };
  nutrition: {
    basalFertilizer: Array<{
      nutrient: string;
      quantity: string;
      timing: string;
    }>;
    topDressing: Array<{
      stage: string;
      fertilizer: string;
      quantity: string;
    }>;
    organicOptions: string[];
    deficiencySymptoms: Array<{
      nutrient: string;
      symptoms: string[];
    }>;
  };
  irrigation: {
    frequency: string;
    criticalStages: string[];
    waterRequirement: string;
    methods: string[];
    waterSavingTips: string[];
  };
  weedManagement: {
    commonWeeds: string[];
    preventiveMeasures: string[];
    herbicides: Array<{
      name: string;
      application: string;
      dosage: string;
    }>;
    manualMethods: string[];
  };
  pestDisease: {
    majorPests: Array<{
      name: string;
      symptoms: string[];
      prevention: string[];
      treatment: string[];
    }>;
    majorDiseases: Array<{
      name: string;
      symptoms: string[];
      prevention: string[];
      treatment: string[];
    }>;
    ipmStrategies: string[];
  };
  harvesting: {
    maturityIndicators: string[];
    harvestingMethod: string[];
    postHarvest: {
      cleaning: string[];
      drying: string[];
      storage: string[];
      packaging: string[];
    };
    shelfLife: string;
  };
  economics: {
    costBreakdown: Array<{
      item: string;
      cost: number;
      unit: string;
    }>;
    expectedYield: {
      min: number;
      max: number;
      unit: string;
    };
    marketPrice: {
      min: number;
      max: number;
      unit: string;
    };
    profitEstimate: {
      gross: number;
      net: number;
    };
  };
  bestPractices: {
    climateSmartTips: string[];
    sustainabilityTips: string[];
    modernTechniques: string[];
    commonMistakes: string[];
  };
}

class CropGuideService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Generate comprehensive crop guide using AI
   */
  async generateCropGuide(request: CropGuideRequest): Promise<CropGuideData> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/crop-guide/generate`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeaders()
          }
        }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to generate crop guide');
      }
    } catch (error: any) {
      console.error('Error generating crop guide:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Please log in to generate crop guides');
      } else if (error.response?.status === 429) {
        throw new Error('Too many requests. Please try again in a few minutes.');
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Failed to generate crop guide. Please try again.');
      }
    }
  }

  /**
   * Quick generate crop guide for common crops
   */
  async quickGenerateCropGuide(cropName: string, region?: string): Promise<CropGuideData> {
    try {
      const url = `${API_BASE_URL}/api/crop-guide/quick-generate/${encodeURIComponent(cropName)}`;
      const params = region ? { region } : {};

      const response = await axios.get(url, {
        params,
        headers: this.getAuthHeaders()
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to generate crop guide');
      }
    } catch (error: any) {
      console.error('Error in quick crop guide generation:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Please log in to generate crop guides');
      } else if (error.response?.status === 429) {
        throw new Error('Too many requests. Please try again in a few minutes.');
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Failed to generate crop guide. Please try again.');
      }
    }
  }

  /**
   * Get list of popular crops
   */
  async getPopularCrops(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/crop-guide/popular-crops`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('Failed to fetch popular crops');
      }
    } catch (error: any) {
      console.error('Error fetching popular crops:', error);
      return [
        'Rice', 'Wheat', 'Maize', 'Tomato', 'Potato', 'Onion', 'Cotton',
        'Sugarcane', 'Soybean', 'Groundnut', 'Sunflower', 'Mustard'
      ]; // Fallback list
    }
  }
}

export const cropGuideService = new CropGuideService();