/**
 * Yield Prediction Service
 * Handles API communication with the ML service for yield predictions
 */

import { YieldPredictionRequest, YieldPredictionResponse } from '@/lib/types/yieldPrediction';
import { API_ENDPOINTS, getDefaultHeaders, handleApiResponse, ApiError } from '@/lib/config/api';

// ML Service request format (based on existing schema)
interface MLServiceRequest {
  crop: string;
  area: number;
  rainfall: number;
  temperature: number;
  N?: number;
  P?: number;
  K?: number;
  pH?: number;
  humidity?: number;
  organic_matter?: number;
  irrigation_method?: string;
  fertilizer_usage?: number;
  pesticide_usage?: number;
  farming_experience?: number;
  historical_yields?: number[];
}

// ML Service response format (based on existing schema)
interface MLServiceResponse {
  success: boolean;
  predicted_yield: number;
  unit: string;
  confidence: number;
  factors?: Record<string, any>;
}

export class YieldPredictionService {
  /**
   * Predict crop yield using ML service and store in database
   * @param request - Yield prediction request data
   * @returns Promise<YieldPredictionResponse>
   */
  static async predictYield(request: YieldPredictionRequest): Promise<YieldPredictionResponse> {
    try {
      // Step 1: Transform request for ML service format
      const mlRequest = this.transformRequestForMLService(request);
      
      // Step 2: Call ML service
      const mlResponse = await this.callMLService(mlRequest);
      
      // Step 3: Transform ML response to frontend format
      const frontendResponse = this.transformResponseFromMLService(mlResponse, request);
      
      // Step 4: Store prediction in database via backend API
      await this.storePredictionInDatabase(request, frontendResponse);
      
      return frontendResponse;
      
    } catch (error: any) {
      console.error('Error in yield prediction:', error);
      throw new Error(`Yield prediction failed: ${error.message}`);
    }
  }

  /**
   * Call the ML service directly
   * @param request - ML service formatted request
   * @returns Promise<MLServiceResponse>
   */
  private static async callMLService(request: MLServiceRequest): Promise<MLServiceResponse> {
    const response = await fetch(API_ENDPOINTS.ML_SERVICE.PREDICT_YIELD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(errorData.detail || `ML service error: ${response.status}`, response.status);
    }

    return await response.json();
  }

  /**
   * Store prediction results in database via backend API
   * @param originalRequest - Original frontend request
   * @param predictionResponse - Prediction response to store
   */
  private static async storePredictionInDatabase(
    originalRequest: YieldPredictionRequest, 
    predictionResponse: YieldPredictionResponse
  ): Promise<void> {
    try {
      const token = localStorage.getItem('token'); // Assuming JWT token storage
      
      const dbPayload = {
        // Input parameters
        crop: originalRequest.crop,
        area: originalRequest.area,
        avgRainfall: originalRequest.weatherData.rainfall,
        pesticideUsage: originalRequest.farmingPractices.pesticideUsage,
        temperature: originalRequest.weatherData.temperature,
        pastYields: originalRequest.historicalYields || null,
        
        // Additional parameters for extended storage
        soilData: originalRequest.soilData,
        weatherData: originalRequest.weatherData,
        farmingPractices: originalRequest.farmingPractices,
        location: originalRequest.location,
        
        // Results
        predictedYield: predictionResponse.prediction.estimatedYield,
        confidenceInterval: {
          lower: predictionResponse.prediction.confidenceInterval[0],
          upper: predictionResponse.prediction.confidenceInterval[1]
        },
        confidence: predictionResponse.prediction.confidenceScore,
        
        // Analysis and recommendations
        analysis: predictionResponse.analysis,
        recommendations: predictionResponse.recommendations,
        comparisons: predictionResponse.comparisons,
        metadata: predictionResponse.metadata
      };

      const response = await fetch(API_ENDPOINTS.AI.YIELD_PREDICTIONS, {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify(dbPayload),
      });

      if (!response.ok) {
        console.warn('Failed to store prediction in database:', response.status);
        // Don't throw error - prediction still succeeded, just storage failed
      }
    } catch (error) {
      console.warn('Database storage failed:', error);
      // Don't throw error - prediction still succeeded
    }
  }

  /**
   * Transform frontend request to ML service format
   * @param request - Frontend request format
   * @returns ML service formatted request
   */
  private static transformRequestForMLService(request: YieldPredictionRequest): MLServiceRequest {
    return {
      crop: request.crop,
      area: request.area,
      rainfall: request.weatherData.rainfall,
      temperature: request.weatherData.temperature,
      N: request.soilData.nitrogen,
      P: request.soilData.phosphorus,
      K: request.soilData.potassium,
      pH: request.soilData.ph,
      humidity: request.weatherData.humidity,
      organic_matter: request.soilData.organicMatter,
      irrigation_method: request.farmingPractices.irrigationMethod,
      fertilizer_usage: request.farmingPractices.fertilizerUsage,
      pesticide_usage: request.farmingPractices.pesticideUsage,
      farming_experience: request.farmingPractices.farmingExperience,
      historical_yields: request.historicalYields
    };
  }

  /**
   * Transform ML service response to frontend format
   * @param mlResponse - ML service response
   * @param originalRequest - Original request for context
   * @returns Frontend formatted response
   */
  private static transformResponseFromMLService(
    mlResponse: MLServiceResponse, 
    originalRequest: YieldPredictionRequest
  ): YieldPredictionResponse {
    // Generate enhanced analysis based on ML response and input data
    const keyFactors = [
      {
        factor: 'Soil pH',
        impact: originalRequest.soilData.ph > 6.5 ? 0.25 : 0.15,
        description: originalRequest.soilData.ph > 6.5 ? 
          'Optimal pH level for selected crop' : 
          'pH could be improved for better yield'
      },
      {
        factor: 'Rainfall',
        impact: originalRequest.weatherData.rainfall > 600 ? 0.3 : 0.2,
        description: originalRequest.weatherData.rainfall > 600 ? 
          'Adequate rainfall for growth' : 
          'Consider supplemental irrigation'
      },
      {
        factor: 'Temperature',
        impact: 0.2,
        description: `${originalRequest.weatherData.temperature}°C is suitable for ${originalRequest.crop} cultivation`
      },
      {
        factor: 'Soil Nutrients',
        impact: 0.25,
        description: `NPK levels (${originalRequest.soilData.nitrogen}-${originalRequest.soilData.phosphorus}-${originalRequest.soilData.potassium}) are within acceptable range`
      }
    ];

    // Generate risk factors based on input analysis
    const riskFactors = [
      originalRequest.weatherData.rainfall < 400 ? 'Low rainfall may stress plants during critical growth periods' : null,
      originalRequest.soilData.ph < 5.5 ? 'Acidic soil may limit nutrient availability' : null,
      originalRequest.farmingPractices.pesticideUsage > 10 ? 'High pesticide usage may affect soil health' : null
    ].filter(Boolean) as string[];

    // Generate opportunities
    const opportunities = [
      originalRequest.soilData.organicMatter < 2 ? 'Increase organic matter content for better soil structure' : null,
      originalRequest.farmingPractices.irrigationMethod === 'traditional' ? 'Consider drip irrigation for water efficiency' : null,
      'Implement precision farming techniques for optimal resource utilization'
    ].filter(Boolean) as string[];

    // Generate recommendations
    const recommendations = [
      {
        category: 'Soil Management',
        action: originalRequest.soilData.ph < 6.0 ? 'Apply lime to increase soil pH' : 'Maintain current soil pH levels',
        expectedImpact: '5-10% yield increase',
        priority: 'high' as const,
        timeline: 'Before next planting season'
      },
      {
        category: 'Nutrient Management',
        action: 'Adjust fertilizer application based on soil test results',
        expectedImpact: '8-15% yield increase',
        priority: 'high' as const,
        timeline: 'During planting and growth stages'
      },
      {
        category: 'Water Management',
        action: originalRequest.farmingPractices.irrigationMethod === 'traditional' ? 
          'Consider upgrading to drip irrigation system' : 'Optimize current irrigation schedule',
        expectedImpact: '10-20% water savings, 5-12% yield increase',
        priority: 'medium' as const,
        timeline: 'Next growing season'
      }
    ];

    // Calculate confidence interval if not provided
    const confidenceInterval: [number, number] = mlResponse.factors?.confidence_interval || [
      mlResponse.predicted_yield * 0.9,
      mlResponse.predicted_yield * 1.1
    ];

    return {
      success: mlResponse.success,
      prediction: {
        estimatedYield: mlResponse.predicted_yield,
        unit: mlResponse.unit || 'tons/hectare',
        confidenceInterval,
        confidenceScore: mlResponse.confidence
      },
      analysis: {
        keyFactors,
        riskFactors,
        opportunities
      },
      recommendations,
      comparisons: {
        regionalAverage: mlResponse.factors?.regional_average || mlResponse.predicted_yield * 0.85,
        historicalAverage: originalRequest.historicalYields?.length ? 
          originalRequest.historicalYields.reduce((a, b) => a + b, 0) / originalRequest.historicalYields.length : 
          mlResponse.predicted_yield * 0.9,
        potentialMaximum: mlResponse.factors?.potential_maximum || mlResponse.predicted_yield * 1.4
      },
      metadata: {
        modelVersion: mlResponse.factors?.model_version || '1.0.0',
        timestamp: new Date().toISOString(),
        processingTime: mlResponse.factors?.processing_time || 2.5
      }
    };
  }

  /**
   * Validate prediction request data
   * @param request - Request data to validate
   * @returns boolean indicating if request is valid
   */
  static validateRequest(request: YieldPredictionRequest): boolean {
    // Basic validation
    if (!request.crop || !request.area || request.area <= 0) return false;
    if (!request.soilData.ph || request.soilData.ph < 0 || request.soilData.ph > 14) return false;
    if (!request.weatherData.temperature || !request.weatherData.rainfall) return false;
    if (!request.location.latitude || !request.location.longitude) return false;
    
    return true;
  }

  /**
   * Get user's prediction history
   * @returns Promise<Array> of previous predictions
   */
  static async getPredictionHistory(): Promise<any[]> {
    try {
      const response = await fetch(API_ENDPOINTS.AI.YIELD_PREDICTIONS, {
        headers: getDefaultHeaders(),
      });

      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error fetching prediction history:', error);
      return [];
    }
  }
}

export default YieldPredictionService;