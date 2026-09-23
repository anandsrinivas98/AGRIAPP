"""
Unit tests and property-based tests for YieldPredictor.

Validates:
  - Requirement 1.3, Property 1: Yield model loads from any valid pickle artefact.
  - Requirement 1.4: FileNotFoundError with path in message when model file is absent.
  - Requirement 1.5, Property 2: Predicted yield is a finite positive number.
  - Requirement 1.6, Property 3: Confidence is always in [0.0, 1.0].
  - Requirement 1.7, Property 4: Confidence interval always contains the point estimate.
  - Requirement 1.8, Property 5: Yield factors are model-derived importances.
  - Requirement 1.9: crop_not_in_training_data flag added to factors for unknown crops.
"""

import asyncio
import math
import tempfile
from pathlib import Path
from unittest.mock import MagicMock, patch

import joblib
import numpy as np
import pytest
from hypothesis import given, settings
import hypothesis.strategies as st
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OrdinalEncoder

from models.yield_predictor import YieldPredictor


# ---------------------------------------------------------------------------
# Test 1 — FileNotFoundError when the model file does not exist (Req 1.4)
# ---------------------------------------------------------------------------
class TestYieldFileNotFound:
    """Requirement 1.4 — informative FileNotFoundError on missing model file."""

    def test_yield_file_not_found(self):
        """
        Patching MODEL_PATH to a non-existent path should make load_model()
        raise FileNotFoundError whose message contains the expected path.
        """
        fake_path = Path("/nonexistent/yield_model.pkl")

        with patch.object(YieldPredictor, "MODEL_PATH", new=fake_path):
            predictor = YieldPredictor()

            with pytest.raises(FileNotFoundError) as exc_info:
                asyncio.run(predictor.load_model())

            assert str(fake_path) in str(exc_info.value), (
                f"Expected path '{fake_path}' to appear in the error message, "
                f"but got: {exc_info.value}"
            )


# ---------------------------------------------------------------------------
# Helper function for mock artefact
# ---------------------------------------------------------------------------
def _build_mock_artefact(
    point_pred: float = 50000.0,
    lower_pred: float = 40000.0,
    upper_pred: float = 60000.0,
    importances: np.ndarray = None,
    is_known_crop: bool = True,
) -> dict:
    feature_names = [
        "crop_enc",
        "country_enc",
        "Year",
        "average_rain_fall_mm_per_year",
        "pesticides_tonnes",
        "avg_temp",
    ]
    n_features = len(feature_names)

    if importances is None:
        importances = np.ones(n_features) / n_features

    mock_gbr_step = MagicMock()
    mock_gbr_step.feature_importances_ = importances

    mock_pipeline = MagicMock()
    mock_pipeline.predict.return_value = np.array([point_pred])
    mock_pipeline.named_steps = {"gbr": mock_gbr_step}

    mock_gbr_lower = MagicMock()
    mock_gbr_lower.predict.return_value = np.array([lower_pred])

    mock_gbr_upper = MagicMock()
    mock_gbr_upper.predict.return_value = np.array([upper_pred])

    mock_crop_encoder = MagicMock()
    if is_known_crop:
        mock_crop_encoder.transform.return_value = np.array([[1.0]])
    else:
        mock_crop_encoder.transform.return_value = np.array([[-1.0]])

    return {
        "pipeline": mock_pipeline,
        "gbr_lower": mock_gbr_lower,
        "gbr_upper": mock_gbr_upper,
        "feature_names": feature_names,
        "crop_encoder": mock_crop_encoder,
        "trained_at": "2024-01-01T00:00:00Z",
    }


# ---------------------------------------------------------------------------
# Test 2 — Unknown crop produces crop_not_in_training_data flag (Req 1.9)
# ---------------------------------------------------------------------------
class TestYieldUnknownCropFlag:
    """Requirement 1.9 — unknown crop flag set in factors."""

    def test_yield_unknown_crop_flag(self):
        predictor = YieldPredictor()
        predictor.is_loaded = True
        predictor.artefact = _build_mock_artefact(is_known_crop=False)

        result = asyncio.run(predictor.predict({"crop": "unknowncrop123"}))

        assert "factors" in result, "Response must contain a 'factors' key"
        assert result["factors"].get("crop_not_in_training_data") is True, (
            "Expected factors['crop_not_in_training_data'] == True for an unknown crop, "
            f"but factors was: {result['factors']}"
        )


# ---------------------------------------------------------------------------
# Test 3 — Property 1: Yield model loads from any valid pickle artefact
# ---------------------------------------------------------------------------
class TestYieldModelLoads:
    """Property 1: Yield model loads from any valid pickle artefact."""

    def test_yield_model_loads_from_pickle(self):
        # Create a real minimal trained artefact and save to temporary pkl
        enc = OrdinalEncoder(handle_unknown="use_encoded_value", unknown_value=-1)
        enc.fit([["rice"], ["wheat"], ["maize"]])

        gbr = GradientBoostingRegressor(n_estimators=5, random_state=42)
        X = np.random.rand(10, 6)
        y = np.random.rand(10) * 50000.0
        gbr.fit(X, y)

        gbr_lower = GradientBoostingRegressor(n_estimators=5, loss="quantile", alpha=0.1, random_state=42)
        gbr_lower.fit(X, y)

        gbr_upper = GradientBoostingRegressor(n_estimators=5, loss="quantile", alpha=0.9, random_state=42)
        gbr_upper.fit(X, y)

        pipe = Pipeline([("gbr", gbr)])

        artefact = {
            "pipeline": pipe,
            "gbr_lower": gbr_lower,
            "gbr_upper": gbr_upper,
            "feature_names": [
                "crop_enc",
                "country_enc",
                "Year",
                "average_rain_fall_mm_per_year",
                "pesticides_tonnes",
                "avg_temp",
            ],
            "crop_encoder": enc,
            "trained_at": "2026-01-01T00:00:00",
        }

        with tempfile.NamedTemporaryFile(suffix=".pkl", delete=False) as f:
            tmp_path = Path(f.name)

        try:
            joblib.dump(artefact, tmp_path)
            with patch.object(YieldPredictor, "MODEL_PATH", new=tmp_path):
                predictor = YieldPredictor()
                asyncio.run(predictor.load_model())
                assert predictor.is_loaded is True
                assert predictor.artefact is not None
        finally:
            if tmp_path.exists():
                tmp_path.unlink()


# ---------------------------------------------------------------------------
# Test 4 — Properties 2, 3, 4, 5: Invariants on predict output
# ---------------------------------------------------------------------------
class TestYieldPredictionProperties:
    """Properties 2–5: Invariants on predict output."""

    @given(
        crop=st.sampled_from(["rice", "wheat", "maize", "potatoes", "soybeans", "custom_crop"]),
        year=st.integers(min_value=1990, max_value=2050),
        rainfall=st.floats(min_value=0.0, max_value=5000.0),
        temperature=st.floats(min_value=-20.0, max_value=55.0),
        pesticide_usage=st.floats(min_value=0.0, max_value=100000.0),
        point_pred_hgha=st.floats(min_value=100.0, max_value=200000.0),
        lower_pred_hgha=st.floats(min_value=50.0, max_value=200000.0),
        upper_pred_hgha=st.floats(min_value=100.0, max_value=250000.0),
    )
    @settings(max_examples=100)
    def test_yield_prediction_invariants(
        self,
        crop,
        year,
        rainfall,
        temperature,
        pesticide_usage,
        point_pred_hgha,
        lower_pred_hgha,
        upper_pred_hgha,
    ):
        raw_weights = np.array([0.3, 0.2, 0.15, 0.15, 0.1, 0.1])
        artefact = _build_mock_artefact(
            point_pred=point_pred_hgha,
            lower_pred=lower_pred_hgha,
            upper_pred=upper_pred_hgha,
            importances=raw_weights,
            is_known_crop=(crop != "custom_crop"),
        )

        predictor = YieldPredictor()
        predictor.is_loaded = True
        predictor.artefact = artefact

        features = {
            "crop": crop,
            "year": year,
            "rainfall": rainfall,
            "temperature": temperature,
            "pesticide_usage": pesticide_usage,
        }

        result = asyncio.run(predictor.predict(features))

        # Property 2: predicted_yield > 0 and finite
        assert result["predicted_yield"] > 0
        assert math.isfinite(result["predicted_yield"])

        # Property 3: confidence in [0.0, 1.0]
        assert 0.0 <= result["confidence"] <= 1.0

        # Property 4: confidence_interval contains estimate: lower <= predicted_yield <= upper
        lower, upper = result["confidence_interval"]
        assert lower <= result["predicted_yield"] <= upper

        # Property 5: factors is non-empty, values are floats, importances sum to ≈ 1.0
        factors = result["factors"]
        assert len(factors) > 0
        numeric_importances = [
            v for k, v in factors.items() if k != "crop_not_in_training_data"
        ]
        for imp in numeric_importances:
            assert isinstance(imp, float)
        assert pytest.approx(sum(numeric_importances), abs=0.01) == 1.0

        if crop == "custom_crop":
            assert factors.get("crop_not_in_training_data") is True
