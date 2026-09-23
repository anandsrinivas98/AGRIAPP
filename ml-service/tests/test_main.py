"""
Unit tests for FastAPI endpoints in main.py.

Validates:
  - Requirement 3.1, Property 12: Yield inference response satisfies the YieldPredictionResponse schema.
  - Requirement 3.2, Property 13: Disease inference response satisfies the DiseaseDetectionResponse schema.
  - Requirement 3.4: Health endpoint returns true/false model load statuses.
"""

import io
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient
from PIL import Image

from main import app
from schemas.responses import DiseaseDetectionResponse, YieldPredictionResponse

client = TestClient(app)


# ---------------------------------------------------------------------------
# Test 1 & 2 — Health Check Endpoints (Req 3.4)
# ---------------------------------------------------------------------------
class TestHealthEndpoints:
    """Requirement 3.4 — health endpoint reflects model loading state."""

    def test_health_both_loaded(self):
        """When all models are loaded, /health returns true for all model flags."""
        with patch("main.crop_recommender.is_loaded", True), \
             patch("main.yield_predictor.is_loaded", True), \
             patch("main.disease_detector.is_loaded", True):

            response = client.get("/health")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "healthy"
            assert data["models"]["crop_recommender"] is True
            assert data["models"]["yield_predictor"] is True
            assert data["models"]["disease_detector"] is True

    def test_health_partial_load(self):
        """When one model is not loaded, /health returns false for that model."""
        with patch("main.crop_recommender.is_loaded", True), \
             patch("main.yield_predictor.is_loaded", False), \
             patch("main.disease_detector.is_loaded", True):

            response = client.get("/health")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "healthy"
            assert data["models"]["yield_predictor"] is False
            assert data["models"]["disease_detector"] is True


# ---------------------------------------------------------------------------
# Test 3 — Yield Endpoint Schema Compliance (Req 3.1, Property 12)
# ---------------------------------------------------------------------------
class TestYieldEndpoint:
    """Requirement 3.1, Property 12 — yield response matches schema."""

    def test_predict_yield_success(self):
        mock_pred = {
            "predicted_yield": 4.52,
            "unit": "tons/hectare",
            "confidence": 0.88,
            "confidence_interval": [4.10, 4.95],
            "factors": {"rainfall": 0.4, "temp": 0.3, "pesticides": 0.3},
        }

        with patch("main.yield_predictor.predict", new_callable=AsyncMock) as mock_predict:
            mock_predict.return_value = mock_pred

            payload = {
                "crop": "rice",
                "area": 10.0,
                "rainfall": 1200.0,
                "temperature": 28.0,
                "pesticide_usage": 50.0,
            }

            response = client.post("/predict/yield", json=payload)
            assert response.status_code == 200
            data = response.json()

            # Validate against Pydantic schema
            schema_obj = YieldPredictionResponse(**data)
            assert schema_obj.success is True
            assert schema_obj.predicted_yield == 4.52
            assert schema_obj.unit == "tons/hectare"
            assert schema_obj.confidence == 0.88
            assert schema_obj.confidence_interval == [4.10, 4.95]


# ---------------------------------------------------------------------------
# Test 4 — Disease Endpoint Schema Compliance & File Validation (Req 2.9, 3.2, Property 13)
# ---------------------------------------------------------------------------
class TestDiseaseEndpoint:
    """Requirement 2.9, 3.2, Property 13 — disease detection endpoint and schema."""

    def test_invalid_image_passes_through(self):
        """Non-image files should be rejected with HTTP 400."""
        file_content = b"Not an image file"
        response = client.post(
            "/detect/disease",
            files={"file": ("test.txt", file_content, "text/plain")},
        )
        assert response.status_code == 400
        assert "image" in response.json()["detail"].lower()

    def test_detect_disease_success(self):
        """Valid image produces response satisfying DiseaseDetectionResponse schema."""
        mock_detection = {
            "detected_disease": "Tomato___Early_blight",
            "confidence": 0.94,
            "severity": "High",
            "all_predictions": [
                {
                    "disease": "Tomato___Early_blight",
                    "confidence": 0.94,
                    "severity": "High",
                    "treatment": "Apply chlorothalonil or azoxystrobin.",
                    "prevention": "Mulch around base and rotate crops.",
                },
                {
                    "disease": "Tomato___Septoria_leaf_spot",
                    "confidence": 0.04,
                    "severity": "Low",
                    "treatment": "Apply mancozeb.",
                    "prevention": "Stake plants and rotate annually.",
                },
            ],
            "recommendations": {
                "treatment": "Apply chlorothalonil or azoxystrobin.",
                "prevention": "Mulch around base and rotate crops.",
            },
            "timestamp": "2026-09-05T12:00:00",
        }

        # Create dummy image in memory
        img = Image.new("RGB", (224, 224), color=(73, 109, 137))
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        image_bytes = buf.getvalue()

        with patch("main.disease_detector.predict", new_callable=AsyncMock) as mock_predict:
            mock_predict.return_value = mock_detection

            response = client.post(
                "/detect/disease",
                files={"file": ("leaf.jpg", image_bytes, "image/jpeg")},
            )
            assert response.status_code == 200
            data = response.json()

            # Validate against Pydantic schema
            schema_obj = DiseaseDetectionResponse(**data)
            assert schema_obj.success is True
            assert schema_obj.detected_disease == "Tomato___Early_blight"
            assert schema_obj.confidence == 0.94
            assert schema_obj.severity == "High"
            assert len(schema_obj.all_predictions) == 2
            assert schema_obj.recommendations["treatment"] == "Apply chlorothalonil or azoxystrobin."
