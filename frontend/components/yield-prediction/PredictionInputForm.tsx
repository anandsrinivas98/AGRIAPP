'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BeakerIcon,
  CloudIcon,
  MapPinIcon,
  SparklesIcon,
  CheckCircleIcon,
  CubeIcon,
  SunIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import LocationSearchMap from '@/components/shared/LocationSearchMap';
import { CROP_OPTIONS, IRRIGATION_METHODS, SEASONAL_PATTERNS, VALIDATION_RANGES } from '@/lib/constants/yieldPrediction';
import { YieldPredictionFormData, YieldPredictionRequest, ValidationError } from '@/lib/types/yieldPrediction';

interface PredictionInputFormProps {
  formData: YieldPredictionFormData;
  onFormDataChange: (data: Partial<YieldPredictionFormData>) => void;
  onSubmit: (data: YieldPredictionRequest) => void;
  loading: boolean;
  validationErrors: ValidationError[];
}

export default function PredictionInputForm({
  formData,
  onFormDataChange,
  onSubmit,
  loading,
  validationErrors
}: PredictionInputFormProps) {
  const [locationData, setLocationData] = useState<any>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [fieldWarnings, setFieldWarnings] = useState<Record<string, string>>({});
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Enhanced validation rules
  const validationRules = {
    area: { min: 0.01, max: 10000, step: 0.01, label: 'Farm Area', unit: 'hectares' },
    ph: { min: 0, max: 14, step: 0.1, label: 'pH Level', unit: '' },
    nitrogen: { min: 0, max: 100, step: 1, label: 'Nitrogen (N)', unit: '' },
    phosphorus: { min: 0, max: 100, step: 1, label: 'Phosphorus (P)', unit: '' },
    potassium: { min: 0, max: 100, step: 1, label: 'Potassium (K)', unit: '' },
    organicMatter: { min: 0, max: 20, step: 0.1, label: 'Organic Matter', unit: '%' },
    temperature: { min: -10, max: 50, step: 0.1, label: 'Temperature', unit: '°C' },
    rainfall: { min: 0, max: 3000, step: 1, label: 'Rainfall', unit: 'mm' },
    humidity: { min: 0, max: 100, step: 1, label: 'Humidity', unit: '%' },
    fertilizerUsage: { min: 0, max: 1000, step: 1, label: 'Fertilizer Usage', unit: 'kg/hectare' },
    pesticideUsage: { min: 0, max: 50, step: 0.1, label: 'Pesticide Usage', unit: 'kg/hectare' },
    farmingExperience: { min: 0, max: 80, step: 1, label: 'Farming Experience', unit: 'years' }
  };

  // Validate individual field
  const validateField = (name: string, value: string): { error?: string; warning?: string } => {
    if (!value || value === '') return {};
    
    const rule = validationRules[name as keyof typeof validationRules];
    if (!rule) return {};

    const numValue = parseFloat(value);
    
    // Check for invalid characters
    if (isNaN(numValue)) {
      return { error: `${rule.label} must be a valid number` };
    }

    // Check minimum value
    if (numValue < rule.min) {
      return { error: `${rule.label} cannot be less than ${rule.min}${rule.unit}` };
    }

    // Check maximum value
    if (numValue > rule.max) {
      return { error: `${rule.label} cannot exceed ${rule.max}${rule.unit}` };
    }

    // Provide warnings for potentially unrealistic values
    const warnings = getFieldWarnings(name, numValue);
    if (warnings) {
      return { warning: warnings };
    }

    return {};
  };

  // Get field-specific warnings for potentially unrealistic but valid values
  const getFieldWarnings = (name: string, value: number): string | undefined => {
    switch (name) {
      case 'area':
        if (value > 1000) return 'Very large farm area - please verify';
        break;
      case 'ph':
        if (value < 4.5 || value > 9.0) return 'Extreme pH levels may affect crop growth';
        break;
      case 'nitrogen':
      case 'phosphorus':
      case 'potassium':
        if (value > 80) return 'Very high nutrient levels - consider soil testing';
        if (value < 10) return 'Low nutrient levels may limit yield';
        break;
      case 'organicMatter':
        if (value > 10) return 'Exceptionally high organic matter content';
        if (value < 1) return 'Low organic matter may affect soil health';
        break;
      case 'temperature':
        if (value < 5 || value > 45) return 'Extreme temperatures may stress crops';
        break;
      case 'rainfall':
        if (value > 2000) return 'Very high rainfall - check for flooding risk';
        if (value < 200) return 'Low rainfall may require irrigation';
        break;
      case 'humidity':
        if (value > 90) return 'Very high humidity may increase disease risk';
        if (value < 30) return 'Low humidity may stress plants';
        break;
      case 'fertilizerUsage':
        if (value > 500) return 'High fertilizer usage - consider environmental impact';
        break;
      case 'pesticideUsage':
        if (value > 20) return 'High pesticide usage - consider integrated pest management';
        break;
      case 'farmingExperience':
        if (value > 60) return 'Exceptional farming experience!';
        break;
    }
    return undefined;
  };

  // Enhanced input change handler with real-time validation
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for historical yields (comma-separated numbers)
    if (name === 'historicalYields') {
      // Allow numbers, commas, spaces, and decimal points
      if (value !== '' && !/^[\d\s,.-]*$/.test(value)) {
        return; // Don't update if invalid characters
      }
    }
    // For numeric fields, prevent invalid characters during typing
    else if (validationRules[name as keyof typeof validationRules]) {
      // Allow empty string, numbers, and decimal point
      if (value !== '' && !/^-?\d*\.?\d*$/.test(value)) {
        return; // Don't update if invalid characters
      }
      
      // Prevent negative values for fields that shouldn't have them
      if (value.startsWith('-') && name !== 'temperature') {
        return;
      }
    }
    
    // Update form data
    onFormDataChange({ [name]: value });
    
    // Validate field in real-time
    let validation: { error?: string; warning?: string } = {};
    
    if (name === 'historicalYields') {
      validation = validateHistoricalYields(value);
    } else {
      validation = validateField(name, value);
    }
    
    // Update field errors and warnings
    setFieldErrors(prev => ({
      ...prev,
      [name]: validation.error || ''
    }));
    
    setFieldWarnings(prev => ({
      ...prev,
      [name]: validation.warning || ''
    }));
    
  }, [onFormDataChange]);

  // Validate historical yields field
  const validateHistoricalYields = (value: string): { error?: string; warning?: string } => {
    if (!value || value.trim() === '') return {};
    
    const yields = value.split(',').map(y => y.trim()).filter(y => y !== '');
    
    for (const yieldStr of yields) {
      const yieldValue = parseFloat(yieldStr);
      if (isNaN(yieldValue)) {
        return { error: 'All yield values must be valid numbers' };
      }
      if (yieldValue < 0) {
        return { error: 'Yield values cannot be negative' };
      }
      if (yieldValue > 50) {
        return { error: 'Yield values seem unrealistically high (>50 tons/hectare)' };
      }
    }
    
    if (yields.length > 10) {
      return { warning: 'Many historical values - only recent years are most relevant' };
    }
    
    return {};
  };

  // Get validation error for a field (combining prop errors and local errors)
  const getFieldError = (fieldName: string) => {
    const propError = validationErrors.find(error => error.field === fieldName)?.message;
    const localError = fieldErrors[fieldName];
    return localError || propError;
  };

  // Get field warning
  const getFieldWarning = (fieldName: string) => {
    return fieldWarnings[fieldName];
  };

  // Check if field has error or warning
  const hasFieldIssue = (fieldName: string) => {
    return !!(getFieldError(fieldName) || getFieldWarning(fieldName));
  };

  // Get input class names with validation styling
  const getInputClassName = (fieldName: string) => {
    const hasError = !!getFieldError(fieldName);
    const hasWarning = !!getFieldWarning(fieldName);
    
    const baseClasses = "w-full px-4 py-3 border-2 rounded-xl focus:ring-4 outline-none transition-all";
    
    if (hasError) {
      return `${baseClasses} border-red-300 focus:border-red-500 focus:ring-red-100`;
    } else if (hasWarning) {
      return `${baseClasses} border-yellow-300 focus:border-yellow-500 focus:ring-yellow-100`;
    }
    return `${baseClasses} border-gray-200 focus:border-green-500 focus:ring-green-100`;
  };

  // Comprehensive form validation before submission
  const validateAllFields = useCallback(() => {
    const errors: Record<string, string> = {};
    const requiredFields = ['crop', 'area', 'ph', 'nitrogen', 'phosphorus', 'potassium', 'temperature', 'rainfall', 'humidity', 'location'];
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!formData[field as keyof YieldPredictionFormData] || formData[field as keyof YieldPredictionFormData] === '') {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    
    // Validate numeric fields
    Object.keys(validationRules).forEach(field => {
      const value = formData[field as keyof YieldPredictionFormData];
      if (value && value !== '') {
        const validation = validateField(field, value);
        if (validation.error) {
          errors[field] = validation.error;
        }
      }
    });
    
    // Validate historical yields
    if (formData.historicalYields && formData.historicalYields !== '') {
      const validation = validateHistoricalYields(formData.historicalYields);
      if (validation.error) {
        errors.historicalYields = validation.error;
      }
    }
    
    return errors;
  }, [formData]);

  // Form validation and submission
  const validateAndSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = validateAllFields();
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error('Please fix all validation errors before submitting');
      return;
    }
    
    // Transform form data to request format
    const requestData: YieldPredictionRequest = {
      crop: formData.crop,
      area: parseFloat(formData.area),
      soilData: {
        ph: parseFloat(formData.ph),
        nitrogen: parseFloat(formData.nitrogen),
        phosphorus: parseFloat(formData.phosphorus),
        potassium: parseFloat(formData.potassium),
        organicMatter: parseFloat(formData.organicMatter) || 0
      },
      weatherData: {
        temperature: parseFloat(formData.temperature),
        rainfall: parseFloat(formData.rainfall),
        humidity: parseFloat(formData.humidity),
        seasonalPattern: formData.seasonalPattern || 'current'
      },
      farmingPractices: {
        irrigationMethod: formData.irrigationMethod || 'traditional',
        fertilizerUsage: parseFloat(formData.fertilizerUsage) || 0,
        pesticideUsage: parseFloat(formData.pesticideUsage) || 0,
        farmingExperience: parseFloat(formData.farmingExperience) || 1
      },
      location: {
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        region: formData.region || formData.location
      },
      historicalYields: formData.historicalYields ? 
        formData.historicalYields.split(',').map(y => parseFloat(y.trim())).filter(y => !isNaN(y)) : 
        undefined
    };

    onSubmit(requestData);
  }, [formData, onSubmit, validateAllFields]);

  // Check if form is valid for submission
  const isFormValid = formData.crop && formData.area && formData.ph && 
    formData.nitrogen && formData.phosphorus && formData.potassium &&
    formData.temperature && formData.rainfall && formData.humidity && formData.location &&
    Object.keys(validateAllFields()).length === 0;

  // Validation message component
  const ValidationMessage = ({ fieldName }: { fieldName: string }) => {
    const error = getFieldError(fieldName);
    const warning = getFieldWarning(fieldName);
    
    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-1 mt-1"
        >
          <ExclamationTriangleIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-red-600 text-xs">{error}</p>
        </motion.div>
      );
    }
    
    if (warning) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-1 mt-1"
        >
          <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          <p className="text-yellow-600 text-xs">{warning}</p>
        </motion.div>
      );
    }
    
    return null;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
        <BeakerIcon className="w-7 h-7 text-green-600" />
        <span>Crop & Environmental Data</span>
      </h2>

      <form onSubmit={validateAndSubmit} className="space-y-8">
        {/* Crop Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2">
            <SunIcon className="w-5 h-5 text-yellow-600" />
            <span>Crop Information</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2 h-10 flex items-end">
                Crop Type *
              </label>
              <select
                name="crop"
                value={formData.crop}
                onChange={handleInputChange}
                required
                className={getInputClassName('crop')}
              >
                <option value="">Select a crop</option>
                {CROP_OPTIONS.map(crop => (
                  <option key={crop.value} value={crop.value}>
                    {crop.label} ({crop.category})
                  </option>
                ))}
              </select>
              <div className="h-6 mt-1">
                <ValidationMessage fieldName="crop" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2 h-10 flex items-end">
                Farm Area (hectares) * <span className="text-xs text-gray-500">(0.01 - 10,000)</span>
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                required
                min={validationRules.area.min}
                max={validationRules.area.max}
                step={validationRules.area.step}
                placeholder="e.g., 2.5"
                className={getInputClassName('area')}
              />
              <div className="h-6 mt-1">
                <ValidationMessage fieldName="area" />
              </div>
            </div>
          </div>
        </div>

        {/* Soil Parameters */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2">
            <CubeIcon className="w-5 h-5 text-amber-600" />
            <span>Soil Parameters</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2 h-10 flex items-end">
                pH Level * <span className="text-xs text-gray-500">(0 - 14)</span>
              </label>
              <input
                type="number"
                name="ph"
                value={formData.ph}
                onChange={handleInputChange}
                required
                min={validationRules.ph.min}
                max={validationRules.ph.max}
                step={validationRules.ph.step}
                placeholder="6.5"
                className={getInputClassName('ph')}
              />
              <div className="h-6 mt-1">
                <ValidationMessage fieldName="ph" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2 h-10 flex items-end">
                Nitrogen (N) * <span className="text-xs text-gray-500">(0 - 100)</span>
              </label>
              <input
                type="number"
                name="nitrogen"
                value={formData.nitrogen}
                onChange={handleInputChange}
                required
                min={validationRules.nitrogen.min}
                max={validationRules.nitrogen.max}
                step={validationRules.nitrogen.step}
                placeholder="50"
                className={getInputClassName('nitrogen')}
              />
              <div className="h-6 mt-1">
                <ValidationMessage fieldName="nitrogen" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2 h-10 flex items-end">
                Phosphorus (P) * <span className="text-xs text-gray-500">(0 - 100)</span>
              </label>
              <input
                type="number"
                name="phosphorus"
                value={formData.phosphorus}
                onChange={handleInputChange}
                required
                min={validationRules.phosphorus.min}
                max={validationRules.phosphorus.max}
                step={validationRules.phosphorus.step}
                placeholder="40"
                className={getInputClassName('phosphorus')}
              />
              <div className="h-6 mt-1">
                <ValidationMessage fieldName="phosphorus" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2 h-10 flex items-end">
                Potassium (K) * <span className="text-xs text-gray-500">(0 - 100)</span>
              </label>
              <input
                type="number"
                name="potassium"
                value={formData.potassium}
                onChange={handleInputChange}
                required
                min={validationRules.potassium.min}
                max={validationRules.potassium.max}
                step={validationRules.potassium.step}
                placeholder="45"
                className={getInputClassName('potassium')}
              />
              <div className="h-6 mt-1">
                <ValidationMessage fieldName="potassium" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2 h-10 flex items-end">
                Organic Matter (%) <span className="text-xs text-gray-500">(0 - 20)</span>
              </label>
              <input
                type="number"
                name="organicMatter"
                value={formData.organicMatter}
                onChange={handleInputChange}
                min={validationRules.organicMatter.min}
                max={validationRules.organicMatter.max}
                step={validationRules.organicMatter.step}
                placeholder="2.5"
                className={getInputClassName('organicMatter')}
              />
              <div className="h-6 mt-1">
                <ValidationMessage fieldName="organicMatter" />
              </div>
            </div>
          </div>
        </div>

        {/* Location Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
            <MapPinIcon className="w-5 h-5 text-red-600" />
            <span>Location *</span>
          </label>
          
          {!locationData && (
            <LocationSearchMap
              onLocationSelect={async (data) => {
                setLocationData(data);
                onFormDataChange({
                  location: `${data.city}, ${data.state}`,
                  latitude: data.latitude.toString(),
                  longitude: data.longitude.toString(),
                  region: data.state,
                });

                // Fetch real weather for this location
                setWeatherLoading(true);
                try {
                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                  const res = await fetch(`${apiUrl}/api/weather?lat=${data.latitude}&lng=${data.longitude}`);
                  const result = await res.json();
                  if (result.success && result.data?.current) {
                    const w = result.data.current;
                    onFormDataChange({
                      temperature: w.temperature?.toString() || '',
                      humidity: w.humidity?.toString() || '',
                      rainfall: (w.rainfall ?? w.precipitation ?? 0).toString(),
                    });
                    setLocationData((prev: any) => ({ ...prev, weather: { temperature: w.temperature, humidity: w.humidity, precipitation: w.rainfall ?? w.precipitation ?? 0 } }));
                    toast.success('Weather conditions auto-filled from location!');
                  } else {
                    toast('Location set. Enter weather conditions manually.', { icon: '📍' });
                  }
                } catch {
                  toast('Location set. Enter weather conditions manually.', { icon: '📍' });
                } finally {
                  setWeatherLoading(false);
                }
              }}
              initialLocation={formData.location}
            />
          )}
          
          {locationData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{locationData.city}</h4>
                    <p className="text-sm text-gray-600">{locationData.state}, {locationData.country}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      📍 {parseFloat(locationData.latitude).toFixed(4)}, {parseFloat(locationData.longitude).toFixed(4)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLocationData(null);
                    onFormDataChange({ location: '', latitude: '', longitude: '', region: '', temperature: '', humidity: '', rainfall: '' });
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold underline"
                >
                  Change
                </button>
              </div>
            </motion.div>
          )}
          <ValidationMessage fieldName="location" />
        </div>

        {/* Weather Conditions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center space-x-2">
              <CloudIcon className="w-5 h-5 text-blue-600" />
              <span>Weather Conditions</span>
            </h3>
            {locationData ? (
              <button
                type="button"
                onClick={async () => {
                  setWeatherLoading(true);
                  try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                    const res = await fetch(`${apiUrl}/api/weather?lat=${locationData.latitude}&lng=${locationData.longitude}`);
                    const result = await res.json();
                    if (result.success && result.data?.current) {
                      const w = result.data.current;
                      onFormDataChange({
                        temperature: w.temperature?.toString() || '',
                        humidity: w.humidity?.toString() || '',
                        rainfall: (w.rainfall ?? w.precipitation ?? 0).toString(),
                      });
                      setLocationData((prev: any) => ({ ...prev, weather: { temperature: w.temperature, humidity: w.humidity, precipitation: w.rainfall ?? w.precipitation ?? 0 } }));
                      toast.success('Weather conditions updated!');
                    } else {
                      toast.error('Could not fetch weather for this location');
                    }
                  } catch {
                    toast.error('Failed to fetch weather data');
                  } finally {
                    setWeatherLoading(false);
                  }
                }}
                disabled={weatherLoading}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold rounded-lg transition-all disabled:opacity-50"
              >
                {weatherLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CloudIcon className="w-3.5 h-3.5" />
                )}
                <span>{weatherLoading ? 'Fetching...' : '🌤 Use current weather'}</span>
              </button>
            ) : (
              <span className="text-xs text-gray-400 italic">Select a location to auto-fill</span>
            )}
          </div>

          {locationData?.weather && !weatherLoading && (
            <div className="mb-4 flex items-center space-x-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <CheckCircleIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <p className="text-xs text-blue-700">
                Auto-filled from <strong>{locationData.city}</strong> — {locationData.weather.temperature}°C · {locationData.weather.humidity}% humidity · {locationData.weather.precipitation}mm rainfall
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2 h-10 flex items-end">
                Temperature (°C) * <span className="text-xs text-gray-500">(-10 to 50)</span>
              </label>
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleInputChange}
                required
                min={validationRules.temperature.min}
                max={validationRules.temperature.max}
                step={validationRules.temperature.step}
                placeholder="25"
                className={getInputClassName('temperature')}
              />
              <div className="h-6 mt-1">
                <ValidationMessage fieldName="temperature" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2 h-10 flex items-end">
                Rainfall (mm) * <span className="text-xs text-gray-500">(0 - 3,000)</span>
              </label>
              <input
                type="number"
                name="rainfall"
                value={formData.rainfall}
                onChange={handleInputChange}
                required
                min={validationRules.rainfall.min}
                max={validationRules.rainfall.max}
                step={validationRules.rainfall.step}
                placeholder="800"
                className={getInputClassName('rainfall')}
              />
              <div className="h-6 mt-1">
                <ValidationMessage fieldName="rainfall" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2 h-10 flex items-end">
                Humidity (%) * <span className="text-xs text-gray-500">(0 - 100)</span>
              </label>
              <input
                type="number"
                name="humidity"
                value={formData.humidity}
                onChange={handleInputChange}
                required
                min={validationRules.humidity.min}
                max={validationRules.humidity.max}
                step={validationRules.humidity.step}
                placeholder="65"
                className={getInputClassName('humidity')}
              />
              <div className="h-6 mt-1">
                <ValidationMessage fieldName="humidity" />
              </div>
            </div>
            <div className="flex flex-col sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2 h-10 flex items-end">
                Seasonal Pattern
              </label>
              <select
                name="seasonalPattern"
                value={formData.seasonalPattern}
                onChange={handleInputChange}
                className={getInputClassName('seasonalPattern')}
              >
                {SEASONAL_PATTERNS.map(pattern => (
                  <option key={pattern.value} value={pattern.value}>
                    {pattern.label}
                  </option>
                ))}
              </select>
              <div className="h-6 mt-1">
                <ValidationMessage fieldName="seasonalPattern" />
              </div>
            </div>
          </div>
        </div>

        {/* Farming Practices */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2">
            <SparklesIcon className="w-5 h-5 text-purple-600" />
            <span>Farming Practices</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2 h-10 flex items-end">
                Irrigation Method
              </label>
              <select
                name="irrigationMethod"
                value={formData.irrigationMethod}
                onChange={handleInputChange}
                className={getInputClassName('irrigationMethod')}
              >
                {IRRIGATION_METHODS.map(method => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
              <div className="h-6 mt-1">
                <ValidationMessage fieldName="irrigationMethod" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2 h-10 flex items-end">
                Farming Experience (years) <span className="text-xs text-gray-500">(0 - 80)</span>
              </label>
              <input
                type="number"
                name="farmingExperience"
                value={formData.farmingExperience}
                onChange={handleInputChange}
                min={validationRules.farmingExperience.min}
                max={validationRules.farmingExperience.max}
                step={validationRules.farmingExperience.step}
                placeholder="5"
                className={getInputClassName('farmingExperience')}
              />
              <div className="h-6 mt-1">
                <ValidationMessage fieldName="farmingExperience" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2 h-10 flex items-end">
                Fertilizer Usage (kg/hectare) <span className="text-xs text-gray-500">(0 - 1,000)</span>
              </label>
              <input
                type="number"
                name="fertilizerUsage"
                value={formData.fertilizerUsage}
                onChange={handleInputChange}
                min={validationRules.fertilizerUsage.min}
                max={validationRules.fertilizerUsage.max}
                step={validationRules.fertilizerUsage.step}
                placeholder="150"
                className={getInputClassName('fertilizerUsage')}
              />
              <div className="h-6 mt-1">
                <ValidationMessage fieldName="fertilizerUsage" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2 h-10 flex items-end">
                Pesticide Usage (kg/hectare) <span className="text-xs text-gray-500">(0 - 50)</span>
              </label>
              <input
                type="number"
                name="pesticideUsage"
                value={formData.pesticideUsage}
                onChange={handleInputChange}
                min={validationRules.pesticideUsage.min}
                max={validationRules.pesticideUsage.max}
                step={validationRules.pesticideUsage.step}
                placeholder="2.5"
                className={getInputClassName('pesticideUsage')}
              />
              <div className="h-6 mt-1">
                <ValidationMessage fieldName="pesticideUsage" />
              </div>
            </div>
          </div>
        </div>

        {/* Historical Data (Optional) */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-2 h-10 flex items-end">
            Historical Yields (optional) <span className="text-xs text-gray-500">Comma-separated values</span>
          </label>
          <input
            type="text"
            name="historicalYields"
            value={formData.historicalYields}
            onChange={handleInputChange}
            placeholder="e.g., 3.2, 3.8, 4.1 (comma-separated values in tons/hectare)"
            className={getInputClassName('historicalYields')}
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter previous yield values separated by commas to improve prediction accuracy
          </p>
          <div className="h-6 mt-1">
            <ValidationMessage fieldName="historicalYields" />
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading || !isFormValid}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-green-600 to-lime-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating Prediction...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              <span>Generate Yield Prediction</span>
            </>
          )}
        </motion.button>

        {/* Form Status */}
        {!isFormValid && (
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Please fill in all required fields (*) and fix any validation errors to generate prediction
            </p>
            {Object.keys(validateAllFields()).length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200"
              >
                <p className="text-sm text-red-700 font-medium">
                  {Object.keys(validateAllFields()).length} field(s) need attention
                </p>
              </motion.div>
            )}
          </div>
        )}
        
        {/* Validation Success Indicator */}
        {isFormValid && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-700 font-medium">
                All fields validated - ready to generate prediction!
              </p>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
}