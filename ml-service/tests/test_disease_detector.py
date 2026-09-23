"""
Unit tests and property tests for DiseaseDetector.

Validates:
  - Requirement 2.3, Property 6: Disease model loads from any valid state-dict file.
  - Requirement 2.4: FileNotFoundError with path in message when model file is absent.
  - Requirement 2.5, Property 7: Image preprocessing produces correctly-shaped, normalised tensors.
  - Requirement 2.6, Property 8: Disease name matches the argmax of model output.
  - Requirement 2.7, Property 9: Disease confidence is the top softmax probability in [0, 1].
  - Requirement 2.8, Property 10: Severity mapping is total and returns only valid values.
  - Requirement 2.10, Property 11: Treatment lookup is complete for all 38 PlantVillage classes.
"""

import asyncio
import io
import json
import tempfile
from pathlib import Path
from unittest.mock import MagicMock, patch

import numpy as np
import pytest
import torch
import torch.nn as nn
from PIL import Image
from hypothesis import given, settings
import hypothesis.strategies as st

from models.disease_detector import (
    CLASSES_PATH,
    MODEL_PATH,
    SEVERITY_THRESHOLDS,
    TREATMENT_LOOKUP,
    DiseaseDetector,
    severity_from_confidence,
)
from utils.image_processor import ImageProcessor


# ---------------------------------------------------------------------------
# Test 1 — FileNotFoundError when model file is missing (Req 2.4)
# ---------------------------------------------------------------------------
class TestDiseaseFileNotFound:
    """Requirement 2.4 — informative FileNotFoundError on missing model file."""

    def test_disease_file_not_found(self):
        """
        Patching MODEL_PATH to a non-existent path should make load_model()
        raise FileNotFoundError whose message contains the expected path.
        """
        fake_path = Path("/nonexistent/disease_model.pth")

        with patch.dict("os.environ", {"DISABLE_HF_MODELS": "true"}), \
             patch.object(DiseaseDetector, "MODEL_PATH", new=fake_path):
            detector = DiseaseDetector()

            with pytest.raises(FileNotFoundError) as exc_info:
                asyncio.run(detector.load_model())

            assert str(fake_path) in str(exc_info.value), (
                f"Expected path '{fake_path}' to appear in error message, "
                f"but got: {exc_info.value}"
            )


# ---------------------------------------------------------------------------
# Test 2 — Treatment lookup completeness (Req 2.10, Property 11)
# ---------------------------------------------------------------------------
class TestTreatmentLookupCompleteness:
    """Requirement 2.10, Property 11 — treatment lookup completeness."""

    def test_treatment_lookup_completeness(self):
        """
        Assert all 38 class keys exist in TREATMENT_LOOKUP with non-empty
        'treatment' and 'prevention' strings.
        """
        with open(CLASSES_PATH, "r", encoding="utf-8") as f:
            classes = json.load(f)

        assert len(classes) == 38, f"Expected 38 classes, found {len(classes)}"

        for cls_name in classes:
            assert cls_name in TREATMENT_LOOKUP, (
                f"Class '{cls_name}' missing from TREATMENT_LOOKUP"
            )
            entry = TREATMENT_LOOKUP[cls_name]
            assert isinstance(entry, dict), f"Entry for '{cls_name}' must be a dict"
            assert "treatment" in entry, f"Entry for '{cls_name}' missing 'treatment'"
            assert "prevention" in entry, f"Entry for '{cls_name}' missing 'prevention'"
            assert len(entry["treatment"].strip()) > 0, (
                f"'treatment' for '{cls_name}' is empty"
            )
            assert len(entry["prevention"].strip()) > 0, (
                f"'prevention' for '{cls_name}' is empty"
            )


# ---------------------------------------------------------------------------
# Test 3 — Severity mapping total function (Req 2.8, Property 10)
# ---------------------------------------------------------------------------
class TestSeverityMapping:
    """Requirement 2.8, Property 10 — severity mapping is total and correct."""

    @given(st.floats(min_value=0.0, max_value=1.0))
    @settings(max_examples=100)
    def test_severity_from_confidence_property(self, conf: float):
        """severity_from_confidence must return Low, Moderate, or High."""
        result = severity_from_confidence(conf)
        assert result in {"Low", "Moderate", "High"}

        if conf >= 0.80:
            assert result == "High"
        elif conf >= 0.50:
            assert result == "Moderate"
        else:
            assert result == "Low"


# ---------------------------------------------------------------------------
# Test 4 — Disease inference with mock model (Properties 8, 9)
# ---------------------------------------------------------------------------
class TestDiseaseInference:
    """Tests disease inference, argmax, top-5 sorting, and confidence properties."""

    def _build_mock_detector(self, mock_logits: torch.Tensor):
        detector = DiseaseDetector()
        detector.is_loaded = True
        with open(CLASSES_PATH, "r", encoding="utf-8") as f:
            detector.disease_classes = json.load(f)

        mock_model = MagicMock()
        mock_model.return_value = mock_logits
        detector.model = mock_model
        return detector

    @given(
        st.lists(
            st.floats(min_value=-10.0, max_value=10.0, allow_nan=False, allow_infinity=False),
            min_size=38,
            max_size=38,
        )
    )
    @settings(max_examples=100)
    def test_disease_argmax_and_confidence_property(self, logit_values):
        """
        Property 8 & 9: Disease name matches argmax and confidence equals top softmax probability.
        """
        logits = torch.tensor([logit_values], dtype=torch.float32)
        detector = self._build_mock_detector(logits)

        # Create dummy preprocessed image (1, 224, 224, 3)
        dummy_img = np.zeros((1, 224, 224, 3), dtype=np.float64)

        result = asyncio.run(detector.predict(dummy_img))

        probs = torch.softmax(logits, dim=1)[0].numpy()
        max_prob = float(np.max(probs))
        predicted_idx = detector.disease_classes.index(result["detected_disease"])

        assert pytest.approx(float(probs[predicted_idx]), abs=1e-5) == max_prob
        assert pytest.approx(result["confidence"], abs=1e-5) == max_prob
        assert 0.0 <= result["confidence"] <= 1.0
        assert len(result["all_predictions"]) == min(5, len(detector.disease_classes))
        assert "treatment" in result["recommendations"]
        assert "prevention" in result["recommendations"]


# ---------------------------------------------------------------------------
# Test 5 — Property 6: Disease model loads from valid state-dict file
# ---------------------------------------------------------------------------
class TestDiseaseModelLoads:
    """Property 6: Disease model loads from any valid state-dict file."""

    def test_disease_model_loads_state_dict(self):
        detector = DiseaseDetector()
        model = detector._build_model()
        state_dict = model.state_dict()

        with tempfile.NamedTemporaryFile(suffix=".pth", delete=False) as f:
            tmp_path = Path(f.name)

        try:
            torch.save(state_dict, tmp_path)
            with patch.dict("os.environ", {"DISABLE_HF_MODELS": "true"}), \
                 patch.object(DiseaseDetector, "MODEL_PATH", new=tmp_path):
                test_detector = DiseaseDetector()
                asyncio.run(test_detector.load_model())
                assert test_detector.is_loaded is True
                assert test_detector.model is not None
                assert len(test_detector.disease_classes) == 38
        finally:
            if tmp_path.exists():
                tmp_path.unlink()


# ---------------------------------------------------------------------------
# Test 6 — Property 7: Image preprocessing produces correctly-shaped tensor
# ---------------------------------------------------------------------------
class TestImagePreprocessing:
    """Property 7: Image preprocessing produces correctly shaped, normalised tensors."""

    @given(
        width=st.integers(min_value=50, max_value=500),
        height=st.integers(min_value=50, max_value=500),
        mode=st.sampled_from(["RGB", "RGBA", "L"]),
    )
    @settings(max_examples=25)
    def test_image_preprocessing_tensor_shape_and_range(self, width, height, mode):
        # Generate random image in memory
        img = Image.new(mode, (width, height), color=(120, 150, 180) if mode != "L" else 128)
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        raw_bytes = buf.getvalue()

        processor = ImageProcessor()
        processed = asyncio.run(processor.process_image(raw_bytes))

        # Check processor output: (1, 224, 224, 3) in [0.0, 1.0]
        assert processed.shape == (1, 224, 224, 3)
        assert np.all(processed >= 0.0)
        assert np.all(processed <= 1.0)
