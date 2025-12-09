'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import LocationSearchMap from '../../../components/shared/LocationSearchMap';
import PageHeader from '../../../components/shared/PageHeader';
import toast from 'react-hot-toast';

function WeatherContent() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [location, setLocation] = useState({ lat: 28.6139, lon: 77.2090 }); // Default to Delhi
  const [locationData, setLocationData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/weather/current?lat=${location.lat}&lon=${location.lon}`);
      
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data.data);
      } else {
        // Mock data for demo
        setWeatherData({
          location: { lat: location.lat, lon: location.lon },
          current: {
            temperature: 28.5,
            humidity: 65,
            rainfall: 2.3,
            windSpeed: 12.5,
            pressure: 1013.2,
            description: 'Partly cloudy',
            icon: '02d'
          },
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error:', error);
      // Mock data on error
      setWeatherData({
        location: { lat: location.lat, lon: location.lon },
        current: {
          temperature: 28.5,
          humidity: 65,
          rainfall: 2.3,
          windSpeed: 12.5,
          pressure: 1013.2,
          description: 'Partly cloudy',
          icon: '02d'
        },
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (selectedLocationData: any) => {
    setLocationData(selectedLocationData);
    setLocation({
      lat: parseFloat(selectedLocationData.latitude),
      lon: parseFloat(selectedLocationData.longitude)
    });
    setShowLocationSelector(false);
    toast.success(`Location set to ${selectedLocationData.city}, ${selectedLocationData.state}`);
  };

  useEffect(() => {
    fetchWeather();
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="🌤️ Farmer-Friendly Weather Intelligence"
          description="Get actionable farming insights based on current, hourly, and weekly weather conditions. Make informed decisions to maximize your yield and protect your crops."
          backLink="/dashboard"
        />

        {/* Location Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-8 border-2 border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <span>📍</span>
              <span>Select Your Farm Location</span>
            </h2>
            {locationData && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  📍 Current: {locationData.city}, {locationData.state}
                  {locationData.fullAddress?.district && locationData.fullAddress.district !== locationData.state && (
                    <span className="text-xs text-gray-500 ml-1">({locationData.fullAddress.district})</span>
                  )}
                </div>
                <button
                  onClick={() => setShowLocationSelector(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 underline"
                >
                  Change Location
                </button>
              </div>
            )}
          </div>
          
          {!showLocationSelector ? (
            <div className="space-y-3">
              <button
                onClick={() => setShowLocationSelector(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-gray-600 hover:text-green-700"
              >
                {locationData ? 
                  `📍 ${locationData.formatted}` : 
                  '🔍 Click to search for your location or use GPS'
                }
              </button>
              
              {!locationData && (
                <div className="space-y-3">
                  <div className="text-xs text-gray-500 text-center">
                    💡 Tip: If GPS doesn't work, try searching manually or use quick locations below
                  </div>
                  
                  {/* Quick Location Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setLocationData({
                          latitude: "12.7342",
                          longitude: "77.8494",
                          city: "Hosur",
                          state: "Tamil Nadu",
                          country: "India",
                          formatted: "Hosur, Tamil Nadu, India"
                        });
                        setLocation({ lat: 12.7342, lon: 77.8494 });
                        toast.success('📍 Location set to Hosur!');
                      }}
                      className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-all"
                    >
                      📍 Hosur
                    </button>
                    <button
                      onClick={() => {
                        setLocationData({
                          latitude: "12.9716",
                          longitude: "77.5946",
                          city: "Bangalore",
                          state: "Karnataka",
                          country: "India",
                          formatted: "Bangalore, Karnataka, India"
                        });
                        setLocation({ lat: 12.9716, lon: 77.5946 });
                        toast.success('📍 Location set to Bangalore!');
                      }}
                      className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-medium transition-all"
                    >
                      📍 Bangalore
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <LocationSearchMap onLocationSelect={handleLocationSelect} />
              <button
                onClick={() => setShowLocationSelector(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          )}
        </motion.div>

        {/* Weather Data */}
        {locationData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-gray-100"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Real-Time Weather</h2>
                <p className="text-gray-600">{locationData.city}, {locationData.state}</p>
              </div>
              <button
                onClick={fetchWeather}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-50 transition-all shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  '🔄 Refresh'
                )}
              </button>
            </div>

            {weatherData && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">Temperature</h3>
                      <p className="text-3xl font-bold text-blue-600">
                        {weatherData.current.temperature.toFixed(1)}°C
                      </p>
                    </div>
                    <div className="text-4xl">🌡️</div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">Humidity</h3>
                      <p className="text-3xl font-bold text-green-600">
                        {weatherData.current.humidity.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-4xl">💧</div>
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-900">Rainfall</h3>
                      <p className="text-3xl font-bold text-purple-600">
                        {weatherData.current.rainfall.toFixed(1)}mm
                      </p>
                    </div>
                    <div className="text-4xl">🌧️</div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-900">Wind Speed</h3>
                      <p className="text-3xl font-bold text-yellow-600">
                        {weatherData.current.windSpeed.toFixed(1)} km/h
                      </p>
                    </div>
                    <div className="text-4xl">💨</div>
                  </div>
                </div>

                <div className="bg-indigo-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-900">Pressure</h3>
                      <p className="text-3xl font-bold text-indigo-600">
                        {weatherData.current.pressure.toFixed(1)} hPa
                      </p>
                    </div>
                    <div className="text-4xl">📊</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Condition</h3>
                      <p className="text-lg font-medium text-gray-600">
                        {weatherData.current.description}
                      </p>
                    </div>
                    <div className="text-4xl">☁️</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Weather Insights */}
        {weatherData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-8 text-white shadow-xl"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <span>🌾</span>
              <span>Smart Farming Insights</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <h4 className="font-bold mb-3 flex items-center space-x-2">
                  <span>🌱</span>
                  <span>Planting Conditions</span>
                </h4>
                <p className="text-blue-100 leading-relaxed">
                  Current conditions are <strong>{weatherData?.current.temperature > 20 ? 'favorable' : 'moderate'}</strong> for most crops.
                  {weatherData?.current.humidity > 70 ? ' ⚠️ High humidity may require disease monitoring.' : ' ✅ Humidity levels are good.'}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <h4 className="font-bold mb-3 flex items-center space-x-2">
                  <span>💧</span>
                  <span>Irrigation Advice</span>
                </h4>
                <p className="text-blue-100 leading-relaxed">
                  {weatherData?.current.rainfall > 5 ? 
                    '🌧️ Recent rainfall reduces irrigation needs. Monitor soil moisture.' : 
                    '☀️ Consider irrigation based on soil moisture levels and crop requirements.'
                  }
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <h4 className="font-bold mb-3 flex items-center space-x-2">
                  <span>🌪️</span>
                  <span>Wind Conditions</span>
                </h4>
                <p className="text-blue-100 leading-relaxed">
                  {weatherData?.current.windSpeed > 20 ? 
                    '⚠️ Strong winds detected. Secure tall crops and avoid spraying.' : 
                    '✅ Wind conditions are suitable for most farming activities.'
                  }
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <h4 className="font-bold mb-3 flex items-center space-x-2">
                  <span>🌡️</span>
                  <span>Temperature Alert</span>
                </h4>
                <p className="text-blue-100 leading-relaxed">
                  {weatherData?.current.temperature > 35 ? 
                    '🔥 High temperature alert! Increase irrigation and provide shade.' : 
                    weatherData?.current.temperature < 10 ?
                    '🥶 Cold weather alert! Protect sensitive crops from frost.' :
                    '✅ Temperature is optimal for crop growth.'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Default message when no location selected */}
        {!locationData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-100 to-blue-100 rounded-3xl p-8 text-center"
          >
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Select Your Location</h3>
            <p className="text-gray-600 mb-6">
              Choose your farm location to get accurate weather data and personalized farming insights.
            </p>
            <button
              onClick={() => setShowLocationSelector(true)}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all shadow-lg font-semibold"
            >
              📍 Set Location
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function WeatherPage() {
  return (
    <ProtectedRoute>
      <WeatherContent />
    </ProtectedRoute>
  );
}