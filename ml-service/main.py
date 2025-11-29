"""
AgriSense ML Service
FastAPI-based machine learning inference service for crop recommendations,
yield predictions, and disease detection.
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import logging
from typing import List, Dict, Any, Optional
import numpy as np
from datetime import datetime
import os

from models.crop_recommender import CropRecommender
from models.yield_predictor import YieldPredictor
from models.disease_detector import DiseaseDetector
from schemas.requests import (
    CropRecommendationRequest,
    YieldPredictionRequest,
    DiseaseDetectionRequest
)
from schemas.responses import (
    CropRecommendationResponse,
    YieldPredictionResponse,
    DiseaseDetectionResponse
)
from utils.image_processor import ImageProcessor
from utils.logger import setup_logger

# Setup logging
logger = setup_logger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AgriSense ML Service",
    description="Machine Learning inference service for agricultural predictions",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML models
crop_recommender = CropRecommender()
yield_predictor = YieldPredictor()
disease_detector = DiseaseDetector()
image_processor = ImageProcessor()

@app.on_event("startup")
async def startup_event():
    """Initialize ML models on startup"""
    logger.info("Starting AgriSense ML Service...")
    
    # Load models
    await crop_recommender.load_model()
    await yield_predictor.load_model()
    await disease_detector.load_model()
    
    logger.info("ML Service started successfully!")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "AgriSense ML Service is running",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "models": {
            "crop_recommender": crop_recommender.is_loaded,
            "yield_predictor": yield_predictor.is_loaded,
            "disease_detector": disease_detector.is_loaded
        },
        "timestamp": datetime.now().isoformat()
    }

@app.post("/recommend/crop", response_model=CropRecommendationResponse)
async def recommend_crops(request: CropRecommendationRequest):
    """
    Get crop recommendations based on soil and environmental conditions
    
    Args:
        request: Crop recommendation parameters
        
    Returns:
        CropRecommendationResponse: Ranked crop recommendations with metadata
    """
    try:
        logger.info(f"Processing crop recommendation request: {request.dict()}")
        
        # Prepare input features
        features = np.array([[
            request.N,
            request.P,
            request.K,
            request.pH,
            request.temperature,
            request.humidity,
            request.rainfall
        ]])
        
        # Get recommendations
        recommendations = await crop_recommender.predict(
            features=features,
            season='monsoon',  # Default season
            market_demand='high',
            area=1.0,
            irrigation_method='drip'
        )
        
        logger.info(f"Generated {len(recommendations)} crop recommendations")
        
        # Format recommendations for response
        formatted_recs = []
        all_reasons = []
        
        for rec in recommendations[:5]:  # Top 5 recommendations
            formatted_recs.append({
                "crop": rec["crop"],
                "confidence": rec["confidence"],
                "yield_estimate": f"{rec.get('expected_yield', 0):.1f} quintals/acre",
                "profit_potential": "High" if rec.get("expected_profit", 0) > 10000 else "Medium"
            })
            
            # Collect reasons from first recommendation
            if rec == recommendations[0] and "reasons" in rec:
                all_reasons = rec["reasons"]
        
        # Default reasons if none provided
        if not all_reasons:
            all_reasons = [
                "Soil nutrient levels are suitable for these crops",
                "Weather conditions favor these crop types",
                "Good market demand expected"
            ]
        
        return {
            "success": True,
            "recommendations": formatted_recs,
            "reasons": all_reasons,
            "metadata": {
                "timestamp": datetime.now().isoformat(),
                "model_version": "1.0.0"
            }
        }
        
    except Exception as e:
        logger.error(f"Error in crop recommendation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/predict/yield", response_model=YieldPredictionResponse)
async def predict_yield(request: YieldPredictionRequest):
    """
    Predict crop yield based on historical and environmental data
    
    Args:
        request: Yield prediction parameters
        
    Returns:
        YieldPredictionResponse: Yield prediction with confidence interval
    """
    try:
        logger.info(f"Processing yield prediction request for crop: {request.crop}")
        
        # Prepare input features
        features = {
            "crop": request.crop,
            "area": request.area,
            "avg_rainfall": request.avg_rainfall,
            "pesticide_usage": request.pesticide_usage,
            "temperature": request.temperature,
            "past_yields": request.past_yields or []
        }
        
        # Get prediction
        prediction = await yield_predictor.predict(features)
        
        logger.info(f"Predicted yield: {prediction['predicted_yield']}")
        
        return YieldPredictionResponse(
            predicted_yield=prediction["predicted_yield"],
            confidence_interval=prediction["confidence_interval"],
            confidence=prediction["confidence"],
            factors=prediction.get("factors", {}),
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error in yield prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/detect/disease", response_model=DiseaseDetectionResponse)
async def detect_disease(
    file: UploadFile = File(...),
    crop_type: Optional[str] = None
):
    """
    Detect plant diseases from uploaded images
    
    Args:
        file: Uploaded image file
        crop_type: Optional crop type for better accuracy
        
    Returns:
        DiseaseDetectionResponse: Disease detection results with treatment recommendations
    """
    try:
        logger.info(f"Processing disease detection for file: {file.filename}")
        
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Process image
        image_data = await file.read()
        processed_image = await image_processor.process_image(image_data)
        
        # Detect disease
        detection_result = await disease_detector.predict(
            image=processed_image,
            crop_type=crop_type
        )
        
        logger.info(f"Detected disease: {detection_result['disease_name']} with confidence: {detection_result['confidence']}")
        
        return DiseaseDetectionResponse(
            disease_name=detection_result["disease_name"],
            severity=detection_result["severity"],
            confidence=detection_result["confidence"],
            treatment_recommendations=detection_result["treatment_recommendations"],
            prevention_tips=detection_result.get("prevention_tips", []),
            annotations=detection_result.get("annotations"),
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error in disease detection: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

@app.get("/models/status")
async def get_models_status():
    """Get status of all ML models"""
    return {
        "crop_recommender": {
            "loaded": crop_recommender.is_loaded,
            "model_path": crop_recommender.model_path,
            "last_updated": crop_recommender.last_updated
        },
        "yield_predictor": {
            "loaded": yield_predictor.is_loaded,
            "model_path": yield_predictor.model_path,
            "last_updated": yield_predictor.last_updated
        },
        "disease_detector": {
            "loaded": disease_detector.is_loaded,
            "model_path": disease_detector.model_path,
            "last_updated": disease_detector.last_updated
        }
    }

@app.post("/models/reload")
async def reload_models():
    """Reload all ML models"""
    try:
        await crop_recommender.load_model()
        await yield_predictor.load_model()
        await disease_detector.load_model()
        
        return {"message": "All models reloaded successfully"}
    except Exception as e:
        logger.error(f"Error reloading models: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to reload models: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )