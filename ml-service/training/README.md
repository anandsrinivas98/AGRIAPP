# AgriSense ML Model Training Guide

This directory contains the training pipelines and scripts for training and exporting production ML models used by the AgriSense ML inference service.

---

## Models Overview

| Model | Architecture | Dataset | Metric Target | Artefact Output |
|---|---|---|---|---|
| **Yield Predictor** | `GradientBoostingRegressor` (scikit-learn) with Quantile Regressors (alpha=0.10, 0.90) | FAO / Kaggle Crop Yield Prediction Dataset | $R^2 \ge 0.70$ (5-fold CV) | `ml-service/models/yield_model.pkl` |
| **Disease Detector** | EfficientNet-B0 (torchvision) fine-tuned with 38-class linear classifier | PlantVillage Dataset (38 classes) | Test Accuracy $\ge 80\%$ | `ml-service/models/disease_model.pth` |

---

## 1. Crop Yield Prediction Model

### 1.1 Dataset

- **Source URL**: [Kaggle: Crop Yield Prediction Dataset](https://www.kaggle.com/datasets/patelris/crop-yield-prediction-dataset)
- **File Expected**: `crop_yield.csv` (or any CSV with equivalent schema)

#### Dataset Schema

| Column | Description | Example |
|---|---|---|
| `Item` | Crop name (categorical) | `Rice`, `Maize`, `Potatoes` |
| `Area` | Country or geographic region (categorical) | `India`, `United States` |
| `Year` | Historical observation year (integer) | `2005` |
| `average_rain_fall_mm_per_year` | Annual average precipitation in mm (float) | `1485.0` |
| `pesticides_tonnes` | Total metric tonnes of pesticides used (float) | `121.5` |
| `avg_temp` | Average annual temperature in °C (float) | `26.4` |
| `hg/ha_yield` | Crop yield in hectograms per hectare (target) | `56000` |

### 1.2 Download Dataset

Using the Kaggle CLI:

```bash
# Ensure your kaggle.json API key is in ~/.kaggle/
kaggle datasets download -d patelris/crop-yield-prediction-dataset --unzip -p ml-service/training/data/
```

### 1.3 Training Command

Run the training script:

```bash
# Default output path: ml-service/models/yield_model.pkl
python ml-service/training/train_yield_model.py --data-path ml-service/training/data/yield_df.csv

# Or specify a custom output path:
python ml-service/training/train_yield_model.py \
    --data-path ml-service/training/data/yield_df.csv \
    --output-path ml-service/models/yield_model.pkl
```

### 1.4 Expected Performance & Training Time

- **Cross-validated $R^2$**: $\ge 0.70$ (typically $0.85 - 0.92$)
- **Approximate Training Time**: 1–3 minutes on CPU (Intel Core i5 / AMD Ryzen or equivalent).

---

## 2. Crop Disease Detection Model

### 2.1 Dataset

- **Source URL**: [Kaggle: PlantVillage Dataset](https://www.kaggle.com/datasets/emmarex/plantdisease) or [Kaggle: PlantVillage Dataset (Color)](https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset)
- **Directory Structure Expected**: Root folder with 38 subdirectories matching PlantVillage class names (sorted alphabetically):

```text
plantvillage/
├── Apple___Apple_scab/
├── Apple___Black_rot/
├── Apple___Cedar_apple_rust/
├── Apple___healthy/
├── Blueberry___healthy/
├── Cherry_(including_sour)___Powdery_mildew/
├── Cherry_(including_sour)___healthy/
├── Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot/
...
└── Tomato___healthy/
```

### 2.2 Download Dataset

Using the Kaggle CLI:

```bash
kaggle datasets download -d abdallahalidev/plantvillage-dataset --unzip -p ml-service/training/data/plantvillage/
```

### 2.3 Training Command

Run the fine-tuning script:

```bash
# Basic usage with default arguments (15 epochs, batch size 32):
python ml-service/training/train_disease_model.py \
    --data-path ml-service/training/data/plantvillage/segmented

# Advanced usage with custom parameters:
python ml-service/training/train_disease_model.py \
    --data-path ml-service/training/data/plantvillage/segmented \
    --epochs 15 \
    --batch-size 32 \
    --output-path ml-service/models/disease_model.pth
```

### 2.4 Training Phases & Determinism

- **Phase 1 (Epochs 1–5)**: Classifier head only (`Linear(1280, 38)`), AdamW optimizer at learning rate `1e-3`.
- **Phase 2 (Epochs 6–15)**: Full network fine-tuning (all layers unfreezed) at learning rate `1e-4`.
- **Reproducibility**: `torch.manual_seed(42)` and `torch.backends.cudnn.deterministic = True` are configured.

### 2.5 Expected Performance & Training Time

- **Test Accuracy**: $\ge 80\%$ (typically $92\% - 97\%$)
- **Approximate Training Time**:
  - GPU (NVIDIA RTX 3060 or Google Colab T4): ~15–25 minutes.
  - CPU (8 cores): ~1.5–2.5 hours.

---

## 3. Deploying Model Artefacts to Hugging Face Spaces

Model files (`*.pkl`, `*.pth`) are tracked using Git LFS:

```bash
cd ml-service/hf-ml-space
git lfs install
git lfs track "*.pkl"
git lfs track "*.pth"

# Copy generated artefacts
cp ../models/yield_model.pkl models/
cp ../models/disease_model.pth models/

# Commit and push to Hugging Face Space
git add .
git commit -m "feat: update trained ML models"
git push
```
