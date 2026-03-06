import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../shared/types/auth';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /api/yield-predictions
 * Store a new yield prediction
 */
router.post('/', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }
    
    const userId = req.user.userId;
    const {
      // Core prediction data (matching existing schema)
      crop,
      area,
      avgRainfall,
      pesticideUsage,
      temperature,
      pastYields,
      predictedYield,
      confidenceInterval,
      confidence,
      
      // Extended data (stored as JSON)
      soilData,
      weatherData,
      farmingPractices,
      location,
      analysis,
      recommendations,
      comparisons,
      metadata
    } = req.body;

    // Validate required fields
    if (!crop || !area || !predictedYield || confidence === undefined) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: crop, area, predictedYield, confidence'
      });
      return;
    }

    // Try to find matching farm based on location
    let farmId = null;
    if (location && location.latitude && location.longitude) {
      const nearbyFarm = await prisma.farm.findFirst({
        where: {
          userId: userId,
          latitude: {
            gte: location.latitude - 0.01, // ~1km tolerance
            lte: location.latitude + 0.01
          },
          longitude: {
            gte: location.longitude - 0.01,
            lte: location.longitude + 0.01
          }
        }
      });
      
      if (nearbyFarm) {
        farmId = nearbyFarm.id;
      }
    }

    // Create yield prediction record
    const yieldPrediction = await prisma.yieldPrediction.create({
      data: {
        userId,
        farmId,
        
        // Core fields (matching existing schema)
        crop,
        area: parseFloat(area),
        avgRainfall: parseFloat(avgRainfall || weatherData?.rainfall || 0),
        pesticideUsage: parseFloat(pesticideUsage || farmingPractices?.pesticideUsage || 0),
        temperature: parseFloat(temperature || weatherData?.temperature || 0),
        pastYields: pastYields || null,
        
        // Results
        predictedYield: parseFloat(predictedYield),
        confidenceInterval: confidenceInterval || { lower: predictedYield * 0.9, upper: predictedYield * 1.1 },
        confidence: parseFloat(confidence),
        
        // Extended data stored as JSON (for future schema updates)
        // Note: These will be stored in a separate table or JSON fields in future schema updates
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

    // Store extended data in a separate JSON record for now
    // This can be moved to proper schema fields in future updates
    const extendedData = {
      yieldPredictionId: yieldPrediction.id,
      soilData,
      weatherData,
      farmingPractices,
      location,
      analysis,
      recommendations,
      comparisons,
      metadata,
      createdAt: new Date().toISOString()
    };

    // For now, we'll store extended data as a comment or in a separate logging system
    console.log('Extended yield prediction data:', JSON.stringify(extendedData, null, 2));

    res.json({
      success: true,
      data: {
        id: yieldPrediction.id,
        crop: yieldPrediction.crop,
        area: yieldPrediction.area,
        predictedYield: yieldPrediction.predictedYield,
        confidence: yieldPrediction.confidence,
        confidenceInterval: yieldPrediction.confidenceInterval,
        createdAt: yieldPrediction.createdAt,
        user: yieldPrediction.user,
        farm: yieldPrediction.farm
      },
      message: 'Yield prediction stored successfully'
    });

  } catch (error) {
    console.error('Error storing yield prediction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to store yield prediction',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

/**
 * GET /api/yield-predictions
 * Get user's yield prediction history
 */
router.get('/', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }
    
    const userId = req.user.userId;
    const { page = '1', limit = '10', crop, farmId } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Build where clause
    const where: any = {
      userId,
      ...(crop && { crop: { contains: crop as string, mode: 'insensitive' } }),
      ...(farmId && { farmId: farmId as string })
    };

    // Get predictions with pagination
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
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: parseInt(limit as string)
      }),
      prisma.yieldPrediction.count({ where })
    ]);

    res.json({
      success: true,
      data: predictions,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });

  } catch (error) {
    console.error('Error fetching yield predictions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch yield predictions',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

/**
 * GET /api/yield-predictions/:id
 * Get a specific yield prediction
 */
router.get('/:id', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }
    
    const userId = req.user.userId;
    const { id } = req.params;

    const prediction = await prisma.yieldPrediction.findFirst({
      where: {
        id,
        userId // Ensure user can only access their own predictions
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
            location: true,
            latitude: true,
            longitude: true
          }
        }
      }
    });

    if (!prediction) {
      res.status(404).json({
        success: false,
        message: 'Yield prediction not found'
      });
      return;
    }

    res.json({
      success: true,
      data: prediction
    });

  } catch (error) {
    console.error('Error fetching yield prediction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch yield prediction',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

/**
 * DELETE /api/yield-predictions/:id
 * Delete a yield prediction
 */
router.delete('/:id', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }
    
    const userId = req.user.userId;
    const { id } = req.params;

    // Check if prediction exists and belongs to user
    const prediction = await prisma.yieldPrediction.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!prediction) {
      res.status(404).json({
        success: false,
        message: 'Yield prediction not found'
      });
      return;
    }

    // Delete the prediction
    await prisma.yieldPrediction.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Yield prediction deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting yield prediction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete yield prediction',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

/**
 * GET /api/yield-predictions/stats/summary
 * Get yield prediction statistics for the user
 */
router.get('/stats/summary', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }
    
    const userId = req.user.userId;

    const [
      totalPredictions,
      avgYield,
      avgConfidence,
      cropDistribution
    ] = await Promise.all([
      // Total predictions count
      prisma.yieldPrediction.count({
        where: { userId }
      }),
      
      // Average predicted yield
      prisma.yieldPrediction.aggregate({
        where: { userId },
        _avg: {
          predictedYield: true
        }
      }),
      
      // Average confidence
      prisma.yieldPrediction.aggregate({
        where: { userId },
        _avg: {
          confidence: true
        }
      }),
      
      // Crop distribution
      prisma.yieldPrediction.groupBy({
        by: ['crop'],
        where: { userId },
        _count: {
          crop: true
        },
        orderBy: {
          _count: {
            crop: 'desc'
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalPredictions,
        averageYield: avgYield._avg.predictedYield || 0,
        averageConfidence: avgConfidence._avg.confidence || 0,
        cropDistribution: cropDistribution.map(item => ({
          crop: item.crop,
          count: item._count.crop
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching yield prediction stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

export default router;