'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import PredictionInputForm from '@/components/yield-prediction/PredictionInputForm';
import toast from 'react-hot-toast';
import {
  YieldPredictionFormData,
  YieldPredictionRequest,
  YieldPredictionResponse,
  ValidationError
} from '@/lib/types/yieldPrediction';
import { DEFAULT_FORM_VALUES } from '@/lib/constants/yieldPrediction';
import YieldPredictionService from '@/lib/services/yieldPredictionService';
import YieldVisualizationCharts from '@/components/yield-prediction/YieldVisualizationCharts';

export default function YieldPredictionPage() {
  // State management
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<YieldPredictionResponse | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  // Form data state with default values
  const [formData, setFormData] = useState<YieldPredictionFormData>(DEFAULT_FORM_VALUES);

  // Form data change handler
  const handleFormDataChange = useCallback((data: Partial<YieldPredictionFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    // Clear validation errors for changed fields
    if (validationErrors.length > 0) {
      const updatedErrors = validationErrors.filter(error => !Object.keys(data).includes(error.field));
      setValidationErrors(updatedErrors);
    }
  }, [validationErrors]);

  // Form validation
  const validateFormData = (data: YieldPredictionFormData): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    // Required field validation
    if (!data.crop) errors.push({ field: 'crop', message: 'Crop type is required' });
    if (!data.area) errors.push({ field: 'area', message: 'Farm area is required' });
    if (!data.ph) errors.push({ field: 'ph', message: 'Soil pH is required' });
    if (!data.nitrogen) errors.push({ field: 'nitrogen', message: 'Nitrogen level is required' });
    if (!data.phosphorus) errors.push({ field: 'phosphorus', message: 'Phosphorus level is required' });
    if (!data.potassium) errors.push({ field: 'potassium', message: 'Potassium level is required' });
    if (!data.temperature) errors.push({ field: 'temperature', message: 'Temperature is required' });
    if (!data.rainfall) errors.push({ field: 'rainfall', message: 'Rainfall data is required' });
    if (!data.humidity) errors.push({ field: 'humidity', message: 'Humidity is required' });
    if (!data.location) errors.push({ field: 'location', message: 'Location is required' });

    // Range validation
    if (data.ph && (parseFloat(data.ph) < 0 || parseFloat(data.ph) > 14)) {
      errors.push({ field: 'ph', message: 'pH must be between 0 and 14' });
    }
    if (data.area && parseFloat(data.area) <= 0) {
      errors.push({ field: 'area', message: 'Area must be greater than 0' });
    }

    return errors;
  };

  // Form submission handler
  const handleFormSubmit = useCallback(async (requestData: YieldPredictionRequest) => {
    // Validate form data
    const errors = validateFormData(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error('Please fix the validation errors');
      return;
    }

    setLoading(true);
    setPredictionResult(null);
    setValidationErrors([]);

    try {
      // Call the real ML service via our service layer
      const response = await YieldPredictionService.predictYield(requestData);
      
      setPredictionResult(response);
      toast.success('Yield prediction generated successfully!');
      
    } catch (error: any) {
      console.error('Error generating prediction:', error);
      
      // Provide specific error messages based on error type
      if (error.message.includes('ML service')) {
        toast.error('ML service is currently unavailable. Please try again later.');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error(error.message || 'Failed to generate yield prediction');
      }
      
      setValidationErrors([]);
    } finally {
      setLoading(false);
    }
  }, [formData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Yield Prediction"
          description="Get AI-powered yield forecasts based on your crop, soil, and environmental conditions"
          icon="📊"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Comprehensive Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <PredictionInputForm
              formData={formData}
              onFormDataChange={handleFormDataChange}
              onSubmit={handleFormSubmit}
              loading={loading}
              validationErrors={validationErrors}
            />
          </motion.div>

          {/* Enhanced Results Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Prediction Results</h2>
            
            {loading ? (
              <LoadingSpinner message="Analyzing your data and generating yield prediction..." />
            ) : predictionResult ? (
              <div className="space-y-6">
                {/* Main Prediction Display */}
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-600 mb-3">
                    {predictionResult.prediction.estimatedYield.toFixed(1)} {predictionResult.prediction.unit}
                  </div>
                  <div className="text-lg text-gray-700 mb-2">
                    Confidence: {Math.round(predictionResult.prediction.confidenceScore * 100)}%
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    Range: {predictionResult.prediction.confidenceInterval[0]} - {predictionResult.prediction.confidenceInterval[1]} {predictionResult.prediction.unit}
                  </div>
                  
                  {/* Confidence Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-lime-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${predictionResult.prediction.confidenceScore * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Quick Insights */}
                <div className="bg-gradient-to-r from-green-50 to-lime-50 rounded-xl p-4 border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Key Insights</h3>
                  <div className="space-y-1 text-sm text-green-700">
                    {predictionResult.analysis.keyFactors.slice(0, 2).map((factor, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>{factor.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comparison with Averages */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-600 mb-1">Regional Avg</div>
                    <div className="text-lg font-bold text-blue-800">
                      {predictionResult.comparisons.regionalAverage} {predictionResult.prediction.unit}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-sm text-purple-600 mb-1">Your Potential</div>
                    <div className="text-lg font-bold text-purple-800">
                      {predictionResult.comparisons.potentialMaximum} {predictionResult.prediction.unit}
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-600">
                    Scroll down for detailed analysis and recommendations 👇
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌾</div>
                <p className="text-gray-600 mb-2">
                  Fill in the comprehensive form to get your personalized yield prediction
                </p>
                <p className="text-sm text-gray-500">
                  Our AI will analyze your crop, soil, weather, and farming practices
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Detailed Results Section */}
        {predictionResult && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Detailed Analysis & Recommendations
              </h2>
              <p className="text-gray-600">
                Comprehensive insights to optimize your farming decisions
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Detailed Results Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">📈 Detailed Results</h3>
                
                {/* Key Factors */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Key Factors Impact</h4>
                  <div className="space-y-3">
                    {predictionResult.analysis.keyFactors.map((factor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-800">{factor.factor}</div>
                          <div className="text-sm text-gray-600">{factor.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {Math.round(factor.impact * 100)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Factors */}
                {predictionResult.analysis.riskFactors.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">⚠️ Risk Factors</h4>
                    <div className="space-y-2">
                      {predictionResult.analysis.riskFactors.map((risk, index) => (
                        <div key={index} className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <span className="text-yellow-600 mt-0.5">⚠️</span>
                          <span className="text-sm text-yellow-800">{risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Opportunities */}
                {predictionResult.analysis.opportunities.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">🚀 Opportunities</h4>
                    <div className="space-y-2">
                      {predictionResult.analysis.opportunities.map((opportunity, index) => (
                        <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <span className="text-blue-600 mt-0.5">💡</span>
                          <span className="text-sm text-blue-800">{opportunity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Visualizations Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">📊 Visualizations</h3>
                <YieldVisualizationCharts
                  prediction={predictionResult.prediction}
                  analysis={predictionResult.analysis}
                  comparisons={predictionResult.comparisons}
                />
              </motion.div>
            </div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">💡 AI-Generated Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {predictionResult.recommendations.map((rec, index) => (
                  <div key={index} className="p-6 bg-gradient-to-br from-green-50 to-lime-50 rounded-2xl border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-green-800">{rec.category}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-green-700 mb-3">{rec.action}</p>
                    <div className="space-y-1 text-xs text-green-600">
                      <div><strong>Impact:</strong> {rec.expectedImpact}</div>
                      <div><strong>Timeline:</strong> {rec.timeline}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Validation Errors Display */}
        {validationErrors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-20 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50 max-w-sm"
          >
            <h3 className="text-red-800 font-semibold mb-2">Validation Errors:</h3>
            <ul className="text-red-700 text-sm space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>• {error.message}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
}
