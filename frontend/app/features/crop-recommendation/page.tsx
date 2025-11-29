'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import LocationSearchMap from '@/components/shared/LocationSearchMap';
import { 
  BeakerIcon, 
  CloudIcon, 
  MapPinIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Lazy load the enhanced recommendations component
const EnhancedRecommendations = dynamic(
  () => import('@/components/crop-recommendation/EnhancedRecommendations'),
  { 
    loading: () => <LoadingSpinner text="Loading enhanced analysis..." />,
    ssr: false 
  }
);

export default function CropRecommendationPage() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: '',
    temperature: '',
    humidity: '',
    rainfall: '',
    location: ''
  });

  const [locationData, setLocationData] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Validate input ranges
    let numValue = parseFloat(value);
    if (value && !isNaN(numValue)) {
      switch (name) {
        case 'nitrogen':
        case 'phosphorus':
        case 'potassium':
          if (numValue > 100) numValue = 100;
          if (numValue < 0) numValue = 0;
          break;
        case 'ph':
          if (numValue > 14) numValue = 14;
          if (numValue < 0) numValue = 0;
          break;
        case 'temperature':
          if (numValue > 50) numValue = 50;
          if (numValue < -10) numValue = -10;
          break;
        case 'humidity':
          if (numValue > 100) numValue = 100;
          if (numValue < 0) numValue = 0;
          break;
        case 'rainfall':
          if (numValue > 500) numValue = 500;
          if (numValue < 0) numValue = 0;
          break;
      }
      
      setFormData({
        ...formData,
        [name]: numValue.toString()
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!formData.nitrogen || !formData.phosphorus || !formData.potassium || 
        !formData.ph || !formData.temperature || !formData.humidity || 
        !formData.rainfall || !formData.location) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    setRecommendations(null);

    try {
      // Call the real backend API
      const response = await fetch('http://localhost:5000/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          N: parseFloat(formData.nitrogen),
          P: parseFloat(formData.phosphorus),
          K: parseFloat(formData.potassium),
          pH: parseFloat(formData.ph),
          temperature: parseFloat(formData.temperature),
          humidity: parseFloat(formData.humidity),
          rainfall: parseFloat(formData.rainfall),
          location: formData.location
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations from server');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Format the response for enhanced display
        const formattedRecommendations = data.data.recommendations?.map((crop: any) => ({
          crop: crop.crop || crop.name,
          confidence: crop.confidence || crop.probability || 85,
          yield: crop.yield || 'N/A',
          profit: crop.profit || 'Medium',
          probability: crop.confidence || crop.probability || 85
        })) || [];

        setRecommendations({
          crops: formattedRecommendations,
          inputData: {
            N: parseFloat(formData.nitrogen),
            P: parseFloat(formData.phosphorus),
            K: parseFloat(formData.potassium),
            pH: parseFloat(formData.ph),
            temperature: parseFloat(formData.temperature),
            humidity: parseFloat(formData.humidity),
            rainfall: parseFloat(formData.rainfall),
            location: formData.location
          },
          soilData: {
            N: parseFloat(formData.nitrogen),
            P: parseFloat(formData.phosphorus),
            K: parseFloat(formData.potassium),
            pH: parseFloat(formData.ph)
          },
          reasons: data.data.reasons || [
            'Based on your soil and weather conditions',
            'Optimized for your location',
            'Suitable for current season'
          ]
        });
        
        toast.success('Recommendations generated successfully!');
      } else {
        throw new Error(data.message || 'Invalid response from server');
      }
    } catch (error: any) {
      console.error('Error getting recommendations:', error);
      
      if (error.message.includes('fetch')) {
        toast.error('Cannot connect to ML service. Please ensure the backend is running on port 5000.');
      } else {
        toast.error(error.message || 'Failed to generate recommendations');
      }
      
      setRecommendations(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Crop Recommendation"
          description="Get AI-powered crop suggestions based on your soil and weather conditions"
          icon="🌾"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
              <BeakerIcon className="w-7 h-7 text-green-600" />
              <span>Soil & Weather Data</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Soil Nutrients */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Soil Nutrients</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nitrogen (N)
                    </label>
                    <input
                      type="number"
                      name="nitrogen"
                      value={formData.nitrogen}
                      onChange={handleInputChange}
                      required
                      min="0"
                      max="100"
                      placeholder="0-100"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phosphorus (P)
                    </label>
                    <input
                      type="number"
                      name="phosphorus"
                      value={formData.phosphorus}
                      onChange={handleInputChange}
                      required
                      min="0"
                      max="100"
                      placeholder="0-100"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Potassium (K)
                    </label>
                    <input
                      type="number"
                      name="potassium"
                      value={formData.potassium}
                      onChange={handleInputChange}
                      required
                      min="0"
                      max="100"
                      placeholder="0-100"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      pH Level
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="ph"
                      value={formData.ph}
                      onChange={handleInputChange}
                      required
                      min="0"
                      max="14"
                      placeholder="0-14"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Weather Conditions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                  <CloudIcon className="w-5 h-5 text-blue-600" />
                  <span>Weather Conditions</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temperature (°C)
                    </label>
                    <input
                      type="number"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      required
                      min="-10"
                      max="50"
                      placeholder="-10 to 50"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Humidity (%)
                    </label>
                    <input
                      type="number"
                      name="humidity"
                      value={formData.humidity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      max="100"
                      placeholder="0-100"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rainfall (mm)
                    </label>
                    <input
                      type="number"
                      name="rainfall"
                      value={formData.rainfall}
                      onChange={handleInputChange}
                      required
                      min="0"
                      max="500"
                      placeholder="0-500"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Location Selection - Above Submit Button */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <MapPinIcon className="w-5 h-5 text-red-600" />
                  <span>Location</span>
                </label>
                
                {/* Show map only if no location is selected */}
                {!locationData && (
                  <LocationSearchMap
                    onLocationSelect={(data) => {
                      setLocationData(data);
                      setFormData(prev => ({
                        ...prev,
                        location: `${data.city}, ${data.state}`,
                        temperature: data.weather?.temperature?.toString() || prev.temperature,
                        humidity: data.weather?.humidity?.toString() || prev.humidity,
                        rainfall: data.weather?.precipitation?.toString() || prev.rainfall
                      }));
                      toast.success('Weather data auto-filled from location!');
                    }}
                    initialLocation={formData.location}
                  />
                )}
                
                {/* Show location details after selection */}
                {locationData && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MapPinIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{locationData.city}</h4>
                          <p className="text-sm text-gray-600">{locationData.state}, {locationData.country}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            📍 {parseFloat(locationData.latitude).toFixed(4)}, {parseFloat(locationData.longitude).toFixed(4)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLocationData(null);
                          setFormData(prev => ({ ...prev, location: '' }));
                        }}
                        className="text-sm text-red-600 hover:text-red-700 font-semibold underline"
                      >
                        Change
                      </button>
                    </div>
                    
                    {/* Weather info if available */}
                    {locationData.weather && (
                      <div className="bg-white rounded-xl p-4 mt-4">
                        <p className="text-xs text-green-700 font-semibold mb-3 flex items-center space-x-2">
                          <CheckCircleIcon className="w-4 h-4" />
                          <span>Weather data auto-filled above</span>
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center">
                            <div className="text-xs text-gray-600 mb-1">Temperature</div>
                            <div className="text-lg font-bold text-gray-900">{locationData.weather.temperature}°C</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-600 mb-1">Humidity</div>
                            <div className="text-lg font-bold text-gray-900">{locationData.weather.humidity}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-600 mb-1">Rainfall</div>
                            <div className="text-lg font-bold text-gray-900">{locationData.weather.precipitation}mm</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-green-600 to-lime-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    <span>Get Recommendations</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Quick Results Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Preview</h2>

            {loading ? (
              <LoadingSpinner text="Analyzing your data..." />
            ) : recommendations ? (
              <div className="space-y-6">
                {/* Top Crops */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Recommended Crops</h3>
                  <div className="space-y-3">
                    {recommendations.crops.slice(0, 3).map((crop: any, index: number) => (
                      <motion.div
                        key={crop.crop}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gradient-to-r from-green-50 to-lime-50 rounded-xl border border-green-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-bold text-gray-800">{crop.crop}</h4>
                          <span className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded-full">
                            {crop.confidence}% Match
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>Expected Yield: <span className="font-semibold">{crop.yield}</span></div>
                          <div>Profit Potential: <span className="font-semibold">{crop.profit}</span></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Reasons */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Why These Crops?</h3>
                  <div className="space-y-2">
                    {recommendations.reasons.map((reason: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{reason}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Scroll indicator */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-600">
                    Scroll down for detailed analysis 👇
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌾</div>
                <p className="text-gray-600">
                  Fill in the form to get personalized crop recommendations
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Enhanced Recommendations Section */}
        {recommendations && recommendations.crops && recommendations.crops.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Comprehensive Analysis
              </h2>
              <p className="text-gray-600">
                Detailed insights to help you make the best farming decisions
              </p>
            </div>
            
            <EnhancedRecommendations
              recommendations={recommendations.crops}
              inputData={recommendations.inputData}
              soilData={recommendations.soilData}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
