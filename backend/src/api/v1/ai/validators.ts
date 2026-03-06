import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { ApiResponse } from '../../../shared/utils/ApiResponse';

export const validateYieldPrediction = [
  body('crop')
    .notEmpty()
    .withMessage('Crop name is required'),
  body('area')
    .isFloat({ min: 0.1 })
    .withMessage('Area must be a positive number'),
  body('soilData.nitrogen')
    .isFloat({ min: 0 })
    .withMessage('Nitrogen content must be a non-negative number'),
  body('soilData.phosphorus')
    .isFloat({ min: 0 })
    .withMessage('Phosphorus content must be a non-negative number'),
  body('soilData.potassium')
    .isFloat({ min: 0 })
    .withMessage('Potassium content must be a non-negative number'),
  body('soilData.ph')
    .isFloat({ min: 0, max: 14 })
    .withMessage('pH must be between 0 and 14'),
  body('weatherData.temperature')
    .isFloat({ min: -50, max: 60 })
    .withMessage('Temperature must be between -50°C and 60°C'),
  body('weatherData.humidity')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Humidity must be between 0% and 100%'),
  body('weatherData.rainfall')
    .isFloat({ min: 0 })
    .withMessage('Rainfall must be a non-negative number'),
  body('location.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('location.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  handleValidationErrors
];

export const validateCropRecommendation = [
  body('nitrogen')
    .isFloat({ min: 0 })
    .withMessage('Nitrogen content must be a non-negative number'),
  body('phosphorus')
    .isFloat({ min: 0 })
    .withMessage('Phosphorus content must be a non-negative number'),
  body('potassium')
    .isFloat({ min: 0 })
    .withMessage('Potassium content must be a non-negative number'),
  body('ph')
    .isFloat({ min: 0, max: 14 })
    .withMessage('pH must be between 0 and 14'),
  body('temperature')
    .isFloat({ min: -50, max: 60 })
    .withMessage('Temperature must be between -50°C and 60°C'),
  body('humidity')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Humidity must be between 0% and 100%'),
  body('rainfall')
    .isFloat({ min: 0 })
    .withMessage('Rainfall must be a non-negative number'),
  body('season')
    .notEmpty()
    .withMessage('Season is required'),
  handleValidationErrors
];

export const validateDiseaseDetection = [
  body('imagePath')
    .notEmpty()
    .withMessage('Image path is required'),
  body('cropType')
    .optional()
    .isString()
    .withMessage('Crop type must be a string'),
  handleValidationErrors
];

export const validateCropGuide = [
  body('cropName')
    .notEmpty()
    .withMessage('Crop name is required'),
  body('region')
    .optional()
    .isString()
    .withMessage('Region must be a string'),
  body('season')
    .optional()
    .isString()
    .withMessage('Season must be a string'),
  body('farmSize')
    .optional()
    .isString()
    .withMessage('Farm size must be a string'),
  body('soilType')
    .optional()
    .isString()
    .withMessage('Soil type must be a string'),
  body('climateZone')
    .optional()
    .isString()
    .withMessage('Climate zone must be a string'),
  handleValidationErrors
];

function handleValidationErrors(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    ApiResponse.error(res, 'Validation failed', 400, errors.array());
    return;
  }
  next();
}