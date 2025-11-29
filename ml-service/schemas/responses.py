"""
Response schemas for ML service endpoints
"""

from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class CropRecommendation(BaseModel):
    """Single crop recommendation"""
    crop: str
    confidence: float
    yield_estimate: Optional[str] = None
    profit_potential: Optional[str] = None


class CropRecommendationResponse(BaseModel):
    """Response schema for crop recommendation"""
    success: bool
    recommendations: List[CropRecommendation]
    reasons: List[str]
    metadata: Optional[Dict[str, Any]] = None


class YieldPredictionResponse(BaseModel):
    """Response schema for yield prediction"""
    success: bool
    predicted_yield: float
    unit: str
    confidence: float
    factors: Optional[Dict[str, Any]] = None


class DiseasePrediction(BaseModel):
    """Single disease prediction"""
    disease: str
    confidence: float
    severity: str
    treatment: str
    prevention: str


class DiseaseDetectionResponse(BaseModel):
    """Response schema for disease detection"""
    success: bool
    detected_disease: str
    confidence: float
    severity: str
    all_predictions: List[DiseasePrediction]
    recommendations: Dict[str, str]
