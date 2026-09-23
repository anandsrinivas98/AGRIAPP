"""
Property test for training determinism.

Validates:
  - Requirement 5.3, Property 14: Training determinism — same seed, same model, same predictions.
"""

import tempfile
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import pytest
from hypothesis import given, settings
import hypothesis.strategies as st

from training.train_yield_model import load_and_preprocess, train


class TestTrainingDeterminism:
    """Property 14: Training with the same seed on the same data produces identical predictions."""

    @given(
        rainfalls=st.lists(
            st.floats(min_value=100.0, max_value=2000.0, allow_nan=False, allow_infinity=False),
            min_size=25,
            max_size=25,
        ),
        temperatures=st.lists(
            st.floats(min_value=10.0, max_value=40.0, allow_nan=False, allow_infinity=False),
            min_size=25,
            max_size=25,
        ),
        pesticides=st.lists(
            st.floats(min_value=1.0, max_value=500.0, allow_nan=False, allow_infinity=False),
            min_size=25,
            max_size=25,
        ),
        yields=st.lists(
            st.floats(min_value=1000.0, max_value=50000.0, allow_nan=False, allow_infinity=False),
            min_size=25,
            max_size=25,
        ),
    )
    @settings(max_examples=5)  # Keep count low since fitting GBR models 2x per example takes compute
    def test_yield_training_determinism(self, rainfalls, temperatures, pesticides, yields):
        crops = ["rice", "wheat", "maize", "potatoes", "soybeans"] * 5
        countries = ["India", "USA", "Brazil", "China", "France"] * 5
        years = [2000 + (i % 20) for i in range(25)]

        df = pd.DataFrame({
            "Item": crops,
            "Area": countries,
            "Year": years,
            "average_rain_fall_mm_per_year": rainfalls,
            "pesticides_tonnes": pesticides,
            "avg_temp": temperatures,
            "hg/ha_yield": yields,
        })

        with tempfile.TemporaryDirectory() as tmpdir:
            csv_path = Path(tmpdir) / "data.csv"
            df.to_csv(csv_path, index=False)

            out_path1 = Path(tmpdir) / "model1.pkl"
            out_path2 = Path(tmpdir) / "model2.pkl"

            X1, y1, enc1 = load_and_preprocess(csv_path)
            train(X1, y1, enc1, out_path1, compute_cv=False, n_estimators=10)

            X2, y2, enc2 = load_and_preprocess(csv_path)
            train(X2, y2, enc2, out_path2, compute_cv=False, n_estimators=10)

            artefact1 = joblib.load(out_path1)
            artefact2 = joblib.load(out_path2)

            # Evaluate predictions on a test matrix
            test_X = np.array([[0.0, 0.0, 2020, 1000.0, 50.0, 25.0]])
            pred1 = artefact1["pipeline"].predict(test_X)
            pred2 = artefact2["pipeline"].predict(test_X)

            np.testing.assert_allclose(pred1, pred2, rtol=1e-6)

            lower1 = artefact1["gbr_lower"].predict(test_X)
            lower2 = artefact2["gbr_lower"].predict(test_X)
            np.testing.assert_allclose(lower1, lower2, rtol=1e-6)

            upper1 = artefact1["gbr_upper"].predict(test_X)
            upper2 = artefact2["gbr_upper"].predict(test_X)
            np.testing.assert_allclose(upper1, upper2, rtol=1e-6)
