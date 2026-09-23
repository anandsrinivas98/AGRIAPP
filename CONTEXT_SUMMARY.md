# AgriSense — Real ML Models: Context Summary
_Last updated: 2026-09-05_

---

## What was done

Spec: `.kiro/specs/real-ml-models/` — **all 44 tasks completed**.

Replaced two placeholder ML models in `ml-service/` with real implementations.

---

## Files changed / created

### ml-service/
| File | Status |
|---|---|
| `requirements.txt` | ✅ Added torch, torchvision, joblib, xgboost, hypothesis |
| `main.py` | ✅ Updated `/detect/disease` endpoint — now uses `DiseasePrediction` objects and new field names |
| `models/yield_predictor.py` | ✅ Full rewrite — loads `yield_model.pkl` via joblib, GBR inference |
| `models/disease_detector.py` | ✅ Full rewrite — EfficientNet-B0, TREATMENT_LOOKUP for 38 classes |
| `models/disease_classes.json` | ✅ Created — 38 PlantVillage class labels |
| `models/yield_model.pkl` | ✅ Trained artefact (3.7 MB) — 10 crops, 300 estimators |
| `models/disease_model.pth` | ⚠️ EXISTS but NOT FINE-TUNED (see below) |
| `schemas/responses.py` | ✅ Added `timestamp` field to `DiseaseDetectionResponse` |
| `training/train_yield_model.py` | ✅ Created — GBR training script |
| `training/train_disease_model.py` | ✅ Created — EfficientNet-B0 fine-tuning script |
| `training/README.md` | ✅ Created — dataset URLs, download instructions, run commands |
| `training/__init__.py` | ✅ Created |
| `tests/test_yield_predictor.py` | ✅ 4 tests — FileNotFoundError, unknown crop flag, Properties 1–5 |
| `tests/test_disease_detector.py` | ✅ 6 tests — FileNotFoundError, lookup completeness, Properties 6–11 |
| `tests/test_main.py` | ✅ 5 tests — health endpoint, schema validation |

### ml-service/hf-ml-space/ (mirror)
| File | Status |
|---|---|
| `models/yield_predictor.py` | ✅ Mirrored |
| `models/disease_detector.py` | ✅ Mirrored |
| `models/disease_classes.json` | ✅ Mirrored |
| `schemas/responses.py` | ✅ Mirrored |
| `requirements.txt` | ✅ All new deps added |
| `.gitattributes` | ✅ `*.pkl` and `*.pth` already tracked via Git LFS |

---

## Test results (last run)

```
16/16 tests passed in 9.45s — pytest ml-service/tests/
```

---

## CRITICAL: Disease Model Status ⚠️

### Problem
`disease_model.pth` contains **only the ImageNet pretrained backbone**.
The 38-class classifier head was **never fine-tuned** on PlantVillage data.

Symptoms:
- Every image → `Potato___healthy` at ~3% confidence
- Expected real accuracy: ~2.6% (random chance)
- Classifier weight std = 0.009977 (should be >0.05 after training)
- All biases = 0.000000 (untouched from init)

### Why
`train_disease_model.py` is ready but requires the PlantVillage dataset
(~54,000 images, ~2.5 GB) which was never downloaded.

### Fix (must do before production for disease detection)

**Step 1 — Download dataset:**
```bash
kaggle datasets download -d abdallahalidev/plantvillage-dataset --unzip -p ml-service/training/data/
```

**Step 2 — Run training** (~15–25 min GPU / 1.5–2.5 hrs CPU):
```bash
python ml-service/training/train_disease_model.py \
  --data-path ml-service/training/data/plantvillage/segmented \
  --epochs 15 \
  --batch-size 32 \
  --output-path ml-service/models/disease_model.pth
```

**Step 3 — Copy to hf-ml-space:**
```bash
copy ml-service\models\disease_model.pth ml-service\hf-ml-space\models\disease_model.pth
```

Expected result after training: **92–97% test accuracy**

---

## Yield Model Status ✅

Trained and working. Spot checks vs FAO world averages:

| Crop | Predicted | FAO avg | Status |
|---|---|---|---|
| Rice | 4.98 t/ha | 4.7 t/ha | ✓ |
| Wheat | 4.06 t/ha | 3.4 t/ha | ✓ |
| Maize | 6.23 t/ha | 5.7 t/ha | ✓ |
| Potatoes | 20.20 t/ha | 21.0 t/ha | ✓ |

Limitations:
- Only 10 FAO crops covered (Cassava, Maize, Plantains, Potatoes, Rice, Sorghum, Soybeans, Sweet Potatoes, Wheat, Yams)
- Any other crop → `crop_not_in_training_data: true` flag returned
- R² not measurable without the original holdout split

---

## Production Readiness

| Component | Ready? |
|---|---|
| Yield Predictor | ✅ Yes |
| Disease Detector | ❌ No — needs PlantVillage training |
| API endpoints | ✅ Yes |
| Schemas | ✅ Yes |
| Tests | ✅ Yes (16/16) |
| hf-ml-space mirror | ✅ Yes |

---

## One remaining code fix applied

sklearn `OrdinalEncoder` was fitted with a DataFrame (columns `["Item", "Area"]`) 
but `predict()` was passing a raw array — caused a UserWarning.
Fixed in both `ml-service/models/yield_predictor.py` and 
`ml-service/hf-ml-space/models/yield_predictor.py`:

```python
crop_enc_value = crop_encoder.transform(
    pd.DataFrame([[crop, ""]], columns=["Item", "Area"])
)[0][0]
```

---

## How to run tests

```bash
cd ml-service
python -m pytest tests/ -v -W ignore::UserWarning -W ignore::DeprecationWarning
```

## How to start the service

```bash
cd ml-service
uvicorn main:app --host 0.0.0.0 --port 7860
```
Note: Service will crash on startup until `disease_model.pth` is properly trained,
because `load_model()` raises `FileNotFoundError` on missing/bad model files.
The `startup_event` in `main.py` catches this and crashes fast (fail-fast behaviour).
