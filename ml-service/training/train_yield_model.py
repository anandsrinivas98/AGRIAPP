"""
train_yield_model.py — Train a GradientBoostingRegressor for crop yield prediction.

Usage:
    python train_yield_model.py --data-path crop_yield.csv
    python train_yield_model.py --data-path crop_yield.csv --output-path /custom/path/yield_model.pkl

Requirements covered: 1.1, 1.2, 1.10, 5.1, 5.3
"""

from __future__ import annotations

import argparse
import sys
from datetime import datetime
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OrdinalEncoder

# ---------------------------------------------------------------------------
# Default output path
# ---------------------------------------------------------------------------
_DEFAULT_OUTPUT = Path(__file__).resolve().parent.parent / "models" / "yield_model.pkl"

# ---------------------------------------------------------------------------
# Feature / target constants
# ---------------------------------------------------------------------------
FEATURE_NAMES = [
    "crop_enc",
    "country_enc",
    "Year",
    "average_rain_fall_mm_per_year",
    "pesticides_tonnes",
    "avg_temp",
]
TARGET_COL = "hg/ha_yield"


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Train GradientBoostingRegressor for crop yield prediction."
    )
    parser.add_argument(
        "--data-path",
        required=True,
        type=Path,
        help="Path to the CSV dataset (e.g. crop_yield.csv).",
    )
    parser.add_argument(
        "--output-path",
        default=_DEFAULT_OUTPUT,
        type=Path,
        help=f"Path to save the trained model artefact (default: {_DEFAULT_OUTPUT}).",
    )
    return parser.parse_args(argv)


def load_and_preprocess(data_path: Path) -> tuple[np.ndarray, np.ndarray, OrdinalEncoder]:
    """Load the CSV, drop nulls, encode categoricals, and return X, y, encoder."""
    df = pd.read_csv(data_path)
    print(f"[data] Loaded {len(df):,} rows from '{data_path}'.")

    # Drop rows with any null values
    before = len(df)
    df = df.dropna()
    dropped = before - len(df)
    if dropped:
        print(f"[data] Dropped {dropped:,} rows containing nulls.")

    # Encode categorical columns: Item (crop) and Area (country)
    enc = OrdinalEncoder(
        handle_unknown="use_encoded_value",
        unknown_value=-1,
    )
    df[["crop_enc", "country_enc"]] = enc.fit_transform(df[["Item", "Area"]])

    X = df[FEATURE_NAMES].to_numpy()
    y = df[TARGET_COL].to_numpy()

    print(f"[data] Feature matrix shape: {X.shape}, target shape: {y.shape}.")
    return X, y, enc


def train(
    X: np.ndarray,
    y: np.ndarray,
    enc: OrdinalEncoder,
    output_path: Path,
    compute_cv: bool = True,
    n_estimators: int = 300,
) -> None:
    """Train the models, evaluate, and save artefacts."""

    # ------------------------------------------------------------------ #
    # 80/20 train/test split                                               #
    # ------------------------------------------------------------------ #
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )
    print(f"[split] Train: {len(X_train):,}  |  Test: {len(X_test):,}")

    # ------------------------------------------------------------------ #
    # Point-estimate GBR (wrapped in a Pipeline for easy extensibility)   #
    # ------------------------------------------------------------------ #
    gbr = GradientBoostingRegressor(
        n_estimators=n_estimators,
        max_depth=5,
        learning_rate=0.05,
        random_state=42,
    )
    pipeline = Pipeline(steps=[("gbr", gbr)])

    print("[train] Fitting point-estimate GradientBoostingRegressor …")
    pipeline.fit(X_train, y_train)

    test_r2 = pipeline.score(X_test, y_test)
    print(f"[eval]  Test R²: {test_r2:.4f}")

    # ------------------------------------------------------------------ #
    # Quantile regressors (lower = 10th percentile, upper = 90th)         #
    # ------------------------------------------------------------------ #
    print("[train] Fitting lower-quantile regressor (alpha=0.10) …")
    gbr_lower = GradientBoostingRegressor(
        loss="quantile",
        alpha=0.1,
        n_estimators=n_estimators,
        max_depth=5,
        learning_rate=0.05,
        random_state=42,
    )
    gbr_lower.fit(X_train, y_train)

    print("[train] Fitting upper-quantile regressor (alpha=0.90) …")
    gbr_upper = GradientBoostingRegressor(
        loss="quantile",
        alpha=0.9,
        n_estimators=n_estimators,
        max_depth=5,
        learning_rate=0.05,
        random_state=42,
    )
    gbr_upper.fit(X_train, y_train)

    # ------------------------------------------------------------------ #
    # 5-fold cross-validated R² (on the full dataset)                      #
    # ------------------------------------------------------------------ #
    if compute_cv:
        print("[eval]  Computing 5-fold cross-validated R² …")
        cv_scores = cross_val_score(
            GradientBoostingRegressor(
                n_estimators=n_estimators,
                max_depth=5,
                learning_rate=0.05,
                random_state=42,
            ),
            X,
            y,
            cv=5,
            scoring="r2",
        )
        cv_r2 = float(cv_scores.mean())
        print(f"[eval]  5-fold CV R²: {cv_r2:.4f}  (folds: {np.round(cv_scores, 4).tolist()})")

        if cv_r2 < 0.70:
            print(
                f"[WARNING] Cross-validated R² ({cv_r2:.4f}) is below the 0.70 threshold. "
                "Consider tuning hyperparameters or checking data quality.",
                file=sys.stderr,
            )

    # ------------------------------------------------------------------ #
    # Bundle and save                                                      #
    # ------------------------------------------------------------------ #
    output_path.parent.mkdir(parents=True, exist_ok=True)

    artefact = {
        "pipeline": pipeline,           # sklearn Pipeline with step "gbr"
        "gbr_lower": gbr_lower,         # GBR quantile alpha=0.1
        "gbr_upper": gbr_upper,         # GBR quantile alpha=0.9
        "feature_names": FEATURE_NAMES, # list of feature column names
        "crop_encoder": enc,            # fitted OrdinalEncoder (Item, Area)
        "trained_at": str(datetime.utcnow().isoformat(timespec="seconds") + "Z"),
    }

    joblib.dump(artefact, output_path)
    print(f"[save]  Model artefact saved to '{output_path}'.")


def main(argv: list[str] | None = None) -> None:
    args = parse_args(argv)

    if not args.data_path.exists():
        print(f"[ERROR] Data file not found: '{args.data_path}'", file=sys.stderr)
        sys.exit(1)

    X, y, enc = load_and_preprocess(args.data_path)
    train(X, y, enc, args.output_path)


if __name__ == "__main__":
    main()
