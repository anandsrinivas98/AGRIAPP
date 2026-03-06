import { Response } from 'express';
import { AuthRequest } from '../../../shared/types/auth';
import { YieldPredictionService } from '../../../core/services/YieldPredictionService';
import { CropRecommendationService } from '../../../core/services/CropRecommendationService';
import { DiseaseDetectionService } from '../../../core/services/DiseaseDetectionService';
import { CropGuideService } from '../../../core/services/CropGuideService';
import { ApiResponse } from '../../../shared/utils/ApiResponse';

export class AIController {
  private yieldPredictionService: YieldPredictionService;
  private cropRecommendationService: CropRecommendationService;
  private diseaseDetectionService: DiseaseDetectionService;
  private cropGuideService: CropGuideService;

  constructor() {
    this.yieldPredictionService = new YieldPredictionService();
    this.cropRecommendationService = new CropRecommendationService();
    this.diseaseDetectionService = new DiseaseDetectionService();
    this.cropGuideService = new CropGuideService();
  }

  getCropRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const result = await this.cropRecommendationService.getRecommendations(userId, req.body);
      ApiResponse.success(res, result, 'Crop recommendations generated successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 500);
    }
  };

  predictYield = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const result = await this.yieldPredictionService.predictYield(userId, req.body);
      ApiResponse.success(res, result, 'Yield prediction completed successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 500);
    }
  };

  getYieldPredictions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { page = '1', limit = '10', crop, farmId } = req.query;
      
      const result = await this.yieldPredictionService.getUserPredictions(userId, {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        crop: crop as string,
        farmId: farmId as string
      });
      
      ApiResponse.success(res, result);
    } catch (error: any) {
      ApiResponse.error(res, error.message, 500);
    }
  };

  getYieldPrediction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      
      const result = await this.yieldPredictionService.getPredictionById(userId, id);
      if (!result) {
        ApiResponse.error(res, 'Yield prediction not found', 404);
        return;
      }
      
      ApiResponse.success(res, result);
    } catch (error: any) {
      ApiResponse.error(res, error.message, 500);
    }
  };

  deleteYieldPrediction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      
      await this.yieldPredictionService.deletePrediction(userId, id);
      ApiResponse.success(res, null, 'Yield prediction deleted successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 500);
    }
  };

  detectDisease = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const result = await this.diseaseDetectionService.detectDisease(userId, req.body);
      ApiResponse.success(res, result, 'Disease detection completed successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 500);
    }
  };

  generateCropGuide = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await this.cropGuideService.generateGuide(req.body);
      ApiResponse.success(res, result, 'Crop guide generated successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 500);
    }
  };

  quickGenerateCropGuide = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { cropName } = req.params;
      const { region } = req.query;
      
      const result = await this.cropGuideService.quickGenerate(cropName, region as string);
      ApiResponse.success(res, result, 'Crop guide generated successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 500);
    }
  };

  getPopularCrops = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await this.cropGuideService.getPopularCrops();
      ApiResponse.success(res, result);
    } catch (error: any) {
      ApiResponse.error(res, error.message, 500);
    }
  };

  getAIStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const stats = await Promise.all([
        this.yieldPredictionService.getUserStats(userId),
        this.cropRecommendationService.getUserStats(userId),
        this.diseaseDetectionService.getUserStats(userId)
      ]);

      const result = {
        yieldPredictions: stats[0],
        cropRecommendations: stats[1],
        diseaseDetections: stats[2]
      };

      ApiResponse.success(res, result);
    } catch (error: any) {
      ApiResponse.error(res, error.message, 500);
    }
  };
}