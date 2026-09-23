"""
Live end-to-end smoke test verifying all 3 real ML models load and serve live predictions.
"""

import asyncio
import io
import json
import numpy as np
from PIL import Image
from fastapi.testclient import TestClient

from main import app, startup_event, crop_recommender, yield_predictor, disease_detector

def test_live_services():
    print("=== Step 1: Loading all 3 real ML models via startup_event() ===")
    asyncio.run(startup_event())
    
    assert crop_recommender.is_loaded is True, "Crop recommender failed to load!"
    assert yield_predictor.is_loaded is True, "Yield predictor failed to load!"
    assert disease_detector.is_loaded is True, "Disease detector failed to load!"
    print("[OK] All 3 ML models loaded successfully from disk.")
    
    client = TestClient(app)
    
    print("\n=== Step 2: Testing /health endpoint ===")
    health_resp = client.get("/health")
    assert health_resp.status_code == 200
    health_data = health_resp.json()
    print(f"Health check response: {json.dumps(health_data, indent=2)}")
    assert health_data["status"] == "healthy"
    assert health_data["models"]["crop_recommender"] is True
    assert health_data["models"]["yield_predictor"] is True
    assert health_data["models"]["disease_detector"] is True
    print("[OK] Health endpoint returned all models active.")
    
    print("\n=== Step 3: Testing /recommend/crop (Real RandomForest) ===")
    rec_payload = {
        "N": 90.0,
        "P": 42.0,
        "K": 43.0,
        "pH": 6.5,
        "temperature": 25.0,
        "humidity": 80.0,
        "rainfall": 200.0,
    }
    rec_resp = client.post("/recommend/crop", json=rec_payload)
    assert rec_resp.status_code == 200
    rec_data = rec_resp.json()
    print(f"Recommended top crop: {rec_data['recommendations'][0]['crop']} (Confidence: {rec_data['recommendations'][0]['confidence']})")
    assert rec_data["success"] is True
    assert len(rec_data["recommendations"]) > 0
    print("[OK] Crop recommendation succeeded with real model.")
    
    print("\n=== Step 4: Testing /predict/yield (Real GradientBoostingRegressor) ===")
    yield_payload = {
        "crop": "Rice",
        "area": 2.5,
        "rainfall": 1400.0,
        "temperature": 26.0,
        "pesticide_usage": 45.0,
    }
    yield_resp = client.post("/predict/yield", json=yield_payload)
    assert yield_resp.status_code == 200
    yield_data = yield_resp.json()
    print(f"Predicted yield: {yield_data['predicted_yield']} t/ha (Confidence: {yield_data['confidence']}, CI: {yield_data['confidence_interval']})")
    print(f"Top factors: {yield_data['factors']}")
    assert yield_data["success"] is True
    assert yield_data["predicted_yield"] > 0
    print("[OK] Yield prediction succeeded with real model.")
    
    print("\n=== Step 5: Testing /detect/disease (Real EfficientNet-B0) ===")
    img = Image.new("RGB", (224, 224), color=(34, 139, 34)) # Forest green leaf
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    image_bytes = buf.getvalue()
    
    disease_resp = client.post(
        "/detect/disease",
        files={"file": ("leaf.jpg", image_bytes, "image/jpeg")}
    )
    assert disease_resp.status_code == 200
    disease_data = disease_resp.json()
    print(f"Detected: {disease_data['detected_disease']} (Confidence: {disease_data['confidence']}, Severity: {disease_data['severity']})")
    print(f"Treatment recommendation: {disease_data['recommendations']['treatment']}")
    assert disease_data["success"] is True
    assert len(disease_data["all_predictions"]) == 5
    print("[OK] Disease detection succeeded with real model.")
    
    print("\n========================================================")
    print("ALL ML SERVICES ARE 100% FUNCTIONAL AND RUNNING FOR REAL!")
    print("========================================================")

if __name__ == "__main__":
    test_live_services()
