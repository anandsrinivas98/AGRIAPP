"""
Request schemas for ML service endpoints
"""

from pydantic import BaseModel, Field
from typing import Optional


class CropRecommendationRequest(BaseModel):
    """Request schema for crop recommendation"""
    N: float = Field(..., description="Nitrogen content", ge=0, le=100)
    P: float = Field(..., description="Phosphorus content", ge=0, le=100)
    K: float = Field(..., description="Potassium content", ge=0, le=100)
    pH: float = Field(..., description="Soil pH level", ge=0, le=14)
    temperature: float = Field(..., description="Temperature in Celsius", ge=-10, le=50)
    humidity: float = Field(..., description="Humidity percentage", ge=0, le=100)
    rainfall: float = Field(..., description="Rainfall in mm", ge=0, le=500)
    location: Optional[str] = Field(None, description="Location information")


class YieldPredictionRequest(BaseModel):
    """Request schema for yield prediction"""
    crop: str = Field(..., description="Crop name")
    area: float = Field(..., description="Area in hectares", gt=0)
    rainfall: float = Field(..., description="Rainfall in mm", ge=0)
    temperature: float = Field(..., description="Temperature in Celsius")
    N: Optional[float] = Field(None, description="Nitrogen content", ge=0, le=100)
    P: Optional[float] = Field(None, description="Phosphorus content", ge=0, le=100)
    K: Optional[float] = Field(None, description="Potassium content", ge=0, le=100)
    pH: Optional[float] = Field(None, description="Soil pH level", ge=0, le=14)
    humidity: Optional[float] = Field(None, description="Humidity percentage", ge=0, le=100)
    organic_matter: Optional[float] = Field(None, description="Organic matter percentage", ge=0, le=20)
    irrigation_method: Optional[str] = Field(None, description="Irrigation method")
    fertilizer_usage: Optional[float] = Field(None, description="Fertilizer usage kg/hectare", ge=0)
    pesticide_usage: Optional[float] = Field(None, description="Pesticide usage kg/hectare", ge=0)
    farming_experience: Optional[float] = Field(None, description="Farming experience in years", ge=0)
    historical_yields: Optional[list] = Field(None, description="Historical yield data")


class DiseaseDetectionRequest(BaseModel):
    """Request schema for disease detection"""
    crop_type: Optional[str] = Field(None, description="Type of crop")
    image_url: Optional[str] = Field(None, description="URL of the image")
