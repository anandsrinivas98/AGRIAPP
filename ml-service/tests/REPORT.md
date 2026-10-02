# AgriSense ML Service Evaluation & Benchmark Report

This document records the end-to-end evaluation, accuracy, latency, and throughput benchmarks of the **AgriSense Machine Learning Inference Service** (`ml-service`), conducted using the [`mle-workflow`](file:///c:/Users/anand/OneDrive/Desktop/cropfinally/.agents/skills/mle-workflow/SKILL.md) guidelines.

---

## 1. Executive Summary

- **Service Name:** AgriSense ML Service (`ml-service`)
- **Python Version:** 3.11.9
- **Evaluation Date:** October 2, 2026
- **Test Suite Status:** **`100% PASSED`** (17/17 tests passing)
- **Benchmark Suite Status:** **`100% PASSED`** (3/3 models verified under concurrent workload)

---

## 2. Test Suite Execution (`pytest`)

```text
============================= test session starts =============================
platform win32 -- Python 3.11.9, pytest-7.4.4, pluggy-1.6.0
rootdir: C:\Users\anand\OneDrive\Desktop\cropfinally\ml-service
plugins: anyio-4.13.0, hypothesis-6.167.1, asyncio-0.23.7

test_live_services.py .                                                  [  5%]
tests\test_disease_detector.py ......                                    [ 41%]
tests\test_main.py .....                                                 [ 70%]
tests\test_training_determinism.py .                                     [ 76%]
tests\test_yield_predictor.py ....                                       [100%]

======================= 17 passed, 6 warnings in 19.50s =======================
```

---

## 3. Performance & Latency Benchmarks

Benchmarked via [`ml-service/tests/benchmark_models.py`](file:///c:/Users/anand/OneDrive/Desktop/cropfinally/ml-service/tests/benchmark_models.py):

| Model Component | Architecture / Algorithm | Total Inferences | Success Rate | Latency ($p_{50}$) | Latency ($p_{95}$) | Latency ($p_{99}$) | Throughput | Status |
| :--- | :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **`CropRecommender`** | RandomForest / XGBoost Classifier | 150 | 100.0% | 2.15 ms | 2.77 ms | 3.06 ms | 464.0 req/sec | **`PASSED`** |
| **`YieldPredictor`** | GradientBoostingRegressor Pipeline | 150 | 100.0% | 2.07 ms | 2.74 ms | 2.97 ms | 484.0 req/sec | **`PASSED`** |
| **`DiseaseDetector`** | PyTorch MobileNetV2 (PlantVillage) | 20 | 100.0% | 42.16 ms | 47.39 ms | 52.44 ms | 23.7 req/sec | **`PASSED`** |

---

## 4. Model Capabilities & Quality Gates

### A. Crop Recommender (`models/crop_recommender.py`)
- **Inputs:** Soil Nitrogen (N), Phosphorus (P), Potassium (K), pH, Temperature, Humidity, Rainfall.
- **Supported Crop Varieties:** 10 core crop types (Rice, Wheat, Maize, Cotton, Sugarcane, Soybean, Groundnut, Tomato, Potato, Onion).
- **Fallback Strategy:** Embedded agricultural domain rules when serialized `.pkl` weights are absent.

### B. Yield Predictor (`models/yield_predictor.py`)
- **Inputs:** Crop type, prediction year, annual rainfall ($mm$), pesticide usage ($tonnes$), average temperature ($^\circ C$).
- **Output:** Predicted crop yield ($tons/hectare$), $95\%$ confidence intervals, and feature importance factor analysis.

### C. Disease Detector (`models/disease_detector.py`)
- **Inputs:** Leaf image tensor $(1, 224, 224, 3)$ with values scaled to $[0, 1]$.
- **Supported Classes:** 38 PlantVillage plant disease classes.
- **Output:** Top disease diagnosis, softmax confidence score, severity label (`High`, `Moderate`, `Low`), treatment recommendation, and prevention guidance.

---

## 5. Reproduction Instructions

To re-run the complete test suite and latency benchmarks locally:

```bash
cd ml-service

# 1. Run unit & integration test suite
pytest

# 2. Run model latency and throughput benchmarks
python -m tests.benchmark_models
```
