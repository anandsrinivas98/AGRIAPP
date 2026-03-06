import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export interface YieldPredictionRequest {
  crop: string;
  area: number;
  soilData: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    ph: number;
    organicMatter?: number;
  };
  weatherData: {
    temperature: number;
    humidity: number;
    rainfall: number;
  };
  farmingPractices: {
    irrigationMethod?: string;
    fertilizerUsage?: number;
    pesticideUsage: number;
    farmingExperience?: number;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  historicalYields?: number[];
  farmId?: string;
}

export interface YieldPredictionResponse {
  id: string;
  crop: string;
  area: number;
  predictedYield: number;
  confidence: number;
  confidenceInterval: { lower: number; upper: number };
  createdAt: Date;
  user?: any;
  farm?: any;
}

export class YieldPredictionService {
  private readonly ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

  async predictYield(userId: string, data: YieldPredictionRequest): Promise<YieldPredictionResponse> {
    try {
      // Step 1: Call ML service for prediction
      const mlPrediction = await this.callMLService(data);

      // Step 2: Find matching farm if location provided
      let farmId = data.farmId;
      if (!farmId && data.location) {
        const nearbyFarm = await this.findNearbyFarm(userId, data.location);
        farmId = nearbyFarm?.id;
      }

      // Step 3: Store prediction in database
      const yieldPrediction = await prisma.yieldPrediction.create({
        data: {
          userId,
          farmId,
          crop: data.crop,
          area: data.area,
          avgRainfall: data.weatherData.rainfall,
          pesticideUsage: data.farmingPractices.pesticideUsage,
          temperature: data.weatherData.temperature,
          pastYields: data.historicalYields || [],
          predictedYield: mlPrediction.predicted_yield,
          confidenceInterval: mlPrediction.confidence_interval || {
            lower: mlPrediction.predicted_yield * 0.9,
            upper: mlPrediction.predicted_yield * 1.1
          },
          confidence: mlPrediction.confidence,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          farm: {
            select: {
              id: true,
              name: true,
              location: true
            }
          }
        }
      });

      return {
        id: yieldPrediction.id,
        crop: yieldPrediction.crop,
        area: yieldPrediction.area,
        predictedYield: yieldPrediction.predictedYield,
        confidence: yieldPrediction.confidence,
        confidenceInterval: yieldPrediction.confidenceInterval as { lower: number; upper: number },
        createdAt: yieldPrediction.createdAt,
        user: (yieldPrediction as any).user,
        farm: (yieldPrediction as any).farm
      };

    } catch (error: any) {
      console.error('Error in yield prediction:', error);
      throw new Error(`Yield prediction failed: ${error.message}`);
    }
  }

  async getUserPredictions(userId: string, options: {
    page: number;
    limit: number;
    crop?: string;
    farmId?: string;
  }) {
    const { page, limit, crop, farmId } = options;
    const skip = (page - 1) * limit;

    const where: any = {
      userId,
      ...(crop && { crop: { contains: crop, mode: 'insensitive' } }),
      ...(farmId && { farmId })
    };

    const [predictions, total] = await Promise.all([
      prisma.yieldPrediction.findMany({
        where,
        include: {
          farm: {
            select: {
              id: true,
              name: true,
              location: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.yieldPrediction.count({ where })
    ]);

    return {
      data: predictions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getPredictionById(userId: string, id: string) {
    return await prisma.yieldPrediction.findFirst({
      where: { id, userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        farm: {
          select: {
            id: true,
            name: true,
            location: true,
            latitude: true,
            longitude: true
          }
        }
      }
    });
  }

  async deletePrediction(userId: string, id: string): Promise<void> {
    const prediction = await prisma.yieldPrediction.findFirst({
      where: { id, userId }
    });

    if (!prediction) {
      throw new Error('Yield prediction not found');
    }

    await prisma.yieldPrediction.delete({ where: { id } });
  }

  async getUserStats(userId: string) {
    const [
      totalPredictions,
      avgYield,
      avgConfidence,
      cropDistribution
    ] = await Promise.all([
      prisma.yieldPrediction.count({ where: { userId } }),
      prisma.yieldPrediction.aggregate({
        where: { userId },
        _avg: { predictedYield: true }
      }),
      prisma.yieldPrediction.aggregate({
        where: { userId },
        _avg: { confidence: true }
      }),
      prisma.yieldPrediction.groupBy({
        by: ['crop'],
        where: { userId },
        _count: { crop: true },
        orderBy: { _count: { crop: 'desc' } }
      })
    ]);

    return {
      totalPredictions,
      averageYield: avgYield._avg.predictedYield || 0,
      averageConfidence: avgConfidence._avg.confidence || 0,
      cropDistribution: cropDistribution.map(item => ({
        crop: item.crop,
        count: item._count.crop
      }))
    };
  }

  private async callMLService(data: YieldPredictionRequest) {
    const mlRequest = {
      crop: data.crop,
      area: data.area,
      rainfall: data.weatherData.rainfall,
      temperature: data.weatherData.temperature,
      N: data.soilData.nitrogen,
      P: data.soilData.phosphorus,
      K: data.soilData.potassium,
      pH: data.soilData.ph,
      humidity: data.weatherData.humidity,
      organic_matter: data.soilData.organicMatter,
      irrigation_method: data.farmingPractices.irrigationMethod,
      fertilizer_usage: data.farmingPractices.fertilizerUsage,
      pesticide_usage: data.farmingPractices.pesticideUsage,
      farming_experience: data.farmingPractices.farmingExperience,
      historical_yields: data.historicalYields
    };

    const response = await axios.post(`${this.ML_SERVICE_URL}/predict/yield`, mlRequest, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'ML service prediction failed');
    }

    return response.data;
  }

  private async findNearbyFarm(userId: string, location: { latitude: number; longitude: number }) {
    return await prisma.farm.findFirst({
      where: {
        userId,
        latitude: {
          gte: location.latitude - 0.01,
          lte: location.latitude + 0.01
        },
        longitude: {
          gte: location.longitude - 0.01,
          lte: location.longitude + 0.01
        }
      }
    });
  }
}