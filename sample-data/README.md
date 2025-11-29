# Sample Data for AgriSense Demo

This directory contains sample datasets and images for demonstrating AgriSense functionality.

## Contents

### 1. Disease Detection Images (`/disease-images/`)
Sample plant disease images for computer vision demo:
- `tomato_early_blight.jpg` - Tomato leaf with early blight
- `wheat_rust.jpg` - Wheat leaf with rust disease
- `rice_blast.jpg` - Rice leaf with blast disease
- `potato_late_blight.jpg` - Potato leaf with late blight
- `corn_leaf_spot.jpg` - Corn leaf with leaf spot

### 2. Historical Data (`/historical/`)
CSV files with historical agricultural data:
- `crop_yields.csv` - Historical yield data by crop and region
- `weather_data.csv` - Historical weather patterns
- `soil_data.csv` - Soil test results from various farms
- `market_prices.csv` - Historical crop prices by market

### 3. User Profiles (`/users/`)
Sample user data for testing:
- `demo_farmers.json` - Demo farmer profiles
- `demo_agronomists.json` - Demo expert profiles

## Usage in Demo

### Disease Detection Demo
1. Navigate to Disease Detection page
2. Upload any image from `/disease-images/`
3. The ML service will return mock predictions based on the filename

### Crop Recommendation Demo
Use these sample inputs for realistic recommendations:

**Sample Input 1 - Rice Suitable Conditions:**
```json
{
  "nitrogen": 120,
  "phosphorus": 30,
  "potassium": 80,
  "ph": 6.4,
  "temperature": 28,
  "humidity": 65,
  "rainfall": 150,
  "season": "monsoon",
  "area": 2
}
```

**Sample Input 2 - Wheat Suitable Conditions:**
```json
{
  "nitrogen": 100,
  "phosphorus": 40,
  "potassium": 60,
  "ph": 6.8,
  "temperature": 22,
  "humidity": 55,
  "rainfall": 80,
  "season": "winter",
  "area": 3
}
```

### Yield Prediction Demo
Use historical data from `crop_yields.csv` to show realistic predictions.

### Price Tracking Demo
Market price data from `market_prices.csv` provides realistic price trends and charts.

## Data Sources

All sample data is either:
1. Synthetically generated for demo purposes
2. Derived from public agricultural datasets
3. Anonymized real farm data (with permission)

**Note:** This is demo data only. For production use, integrate with real agricultural databases and APIs.

## Adding New Sample Data

To add new sample data:
1. Place files in appropriate subdirectories
2. Update this README with descriptions
3. Update the ML service to handle new data types
4. Add corresponding demo flows to DEMO_PLAN.md