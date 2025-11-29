'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/shared/PageHeader';
import LocationSearchMap from '@/components/shared/LocationSearchMap';
import RealTimeWeatherDashboard from '@/components/weather/RealTimeWeatherDashboard';
import HourlyForecast from '@/components/weather/HourlyForecast';
import WeeklyForecast from '@/components/weather/WeeklyForecast';
import CropSpecificAdvice from '@/components/weather/CropSpecificAdvice';
import SmartWeatherAlerts from '@/components/weather/SmartWeatherAlerts';
import IrrigationPlanner from '@/components/weather/IrrigationPlanner';
import WeatherTrendAnalytics from '@/components/weather/WeatherTrendAnalytics';
import WeatherTaskRecommendations from '@/components/weather/WeatherTaskRecommendations';
import SoilWeatherImpact from '@/components/weather/SoilWeatherImpact';
import WeatherReportDownload from '@/components/weather/WeatherReportDownload';
import { MapPinIcon, SparklesIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function WeatherPage() {
  const [location, setLocation] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['Rice', 'Wheat']);

  const handleLocationSelect = async (data: any) => {
    const locationData = {
      lat: parseFloat(data.latitude),
      lng: parseFloat(data.longitude),
      city: data.city,
      state: data.state,
      country: data.country
    };
    
    setLocation(locationData);
    
    // Fetch weather data from backend
    await fetchWeatherData(locationData.lat, locationData.lng);
  };

  const fetchWeatherData = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/weather?lat=${lat}&lng=${lng}`);
      const result = await response.json();
      
      if (result.success) {
        setWeatherData(result.data);
        toast.success('Weather data updated successfully!');
      } else {
        toast.error('Failed to fetch weather data');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast.error('Error loading weather data');
    } finally {
      setLoading(false);
    }
  };

  // Generate crop advice based on weather data
  const generateCropAdvice = () => {
    if (!weatherData) return [];
    
    const { current } = weatherData;
    const windSuitable = current.windSpeed < 15;
    const tempOptimal = current.temperature >= 20 && current.temperature <= 30;
    
    return [
      {
        cropName: 'Rice',
        watering: { 
          recommendation: current.humidity < 60 ? 'Maintain 3-4 inches of standing water' : 'Maintain 2-3 inches of standing water', 
          amount: '50-60 mm', 
          timing: 'Early morning (6-8 AM)', 
          status: 'recommended' as const 
        },
        fertilizer: { 
          recommendation: windSuitable ? 'Apply nitrogen-based fertilizer' : 'Wait for calmer conditions', 
          timing: windSuitable ? 'Within next 2 days' : 'After wind subsides', 
          type: 'Urea (46-0-0)', 
          status: windSuitable ? 'good' as const : 'wait' as const 
        },
        sowingHarvesting: { 
          activity: 'Transplanting', 
          suitability: tempOptimal ? 'excellent' as const : 'moderate' as const, 
          reason: tempOptimal ? 'Optimal temperature and humidity for rice transplanting' : 'Temperature slightly outside optimal range' 
        },
        irrigation: { need: 'High water requirement', frequency: 'Daily monitoring', method: 'Flood irrigation' },
        weatherImpact: { 
          heatwave: current.temperature > 35, 
          coldwave: current.temperature < 15, 
          impact: current.temperature > 35 ? 'High temperature may stress plants - increase irrigation' : '' 
        },
        pestDiseaseRisk: { 
          level: current.humidity > 75 ? 'high' as const : current.humidity > 60 ? 'moderate' as const : 'low' as const, 
          risks: current.humidity > 75 ? ['Leaf folder due to high humidity', 'Brown plant hopper', 'Fungal diseases'] : ['Leaf folder due to humidity', 'Brown plant hopper'], 
          prevention: ['Monitor field regularly', 'Use pheromone traps', 'Apply neem-based pesticides', 'Ensure proper drainage'] 
        },
        sprayingAdvice: { 
          suitable: windSuitable, 
          reason: windSuitable ? `Wind speed is favorable (${current.windSpeed} km/h, below 15 km/h)` : `Not recommended - high wind speed (${current.windSpeed} km/h)`, 
          bestTime: 'Early morning or late evening' 
        }
      },
      {
        cropName: 'Wheat',
        watering: { 
          recommendation: current.humidity < 50 ? 'Moderate irrigation recommended' : 'Light irrigation recommended', 
          amount: current.humidity < 50 ? '30-35 mm' : '25-30 mm', 
          timing: 'Evening (5-7 PM)', 
          status: current.humidity < 50 ? 'recommended' as const : 'optional' as const 
        },
        fertilizer: { 
          recommendation: current.rainfall > 5 ? 'Wait for 3-4 days before applying' : 'Good time to apply fertilizer', 
          timing: current.rainfall > 5 ? 'After rainfall stops' : 'Within 1-2 days', 
          type: 'NPK (20-20-20)', 
          status: current.rainfall > 5 ? 'wait' as const : 'good' as const 
        },
        sowingHarvesting: { 
          activity: 'Sowing', 
          suitability: tempOptimal && current.humidity > 40 ? 'excellent' as const : 'good' as const, 
          reason: tempOptimal ? 'Temperature is suitable for wheat sowing' : 'Monitor soil moisture levels' 
        },
        irrigation: { need: 'Moderate water requirement', frequency: 'Every 3-4 days', method: 'Sprinkler irrigation' },
        weatherImpact: { 
          heatwave: current.temperature > 32, 
          coldwave: false, 
          impact: current.temperature > 32 ? 'Warm conditions - monitor for heat stress' : '' 
        },
        pestDiseaseRisk: { 
          level: current.temperature > 28 ? 'moderate' as const : 'low' as const, 
          risks: current.temperature > 28 ? ['Aphids in warmer conditions', 'Rust disease'] : ['Aphids in warmer conditions'], 
          prevention: ['Use yellow sticky traps', 'Maintain field hygiene', 'Spray neem oil if needed', 'Monitor regularly'] 
        },
        sprayingAdvice: { 
          suitable: windSuitable && current.rainfall < 2, 
          reason: !windSuitable ? `High wind speed (${current.windSpeed} km/h)` : current.rainfall > 2 ? 'Recent rainfall - wait for dry conditions' : 'Good conditions for spraying', 
          bestTime: 'Morning hours (7-9 AM)' 
        }
      }
    ];
  };

  // Generate weather alerts based on conditions
  const generateAlerts = () => {
    if (!weatherData) return [];
    
    const alerts = [];
    const { current, weekly } = weatherData;
    
    if (current.windSpeed > 20) {
      alerts.push({
        id: 'wind-alert',
        type: 'high-wind' as const,
        severity: current.windSpeed > 30 ? 'high' as const : 'moderate' as const,
        title: 'High Wind Alert',
        message: `Wind speeds at ${current.windSpeed} km/h`,
        actionableTips: ['Postpone pesticide spraying', 'Secure loose equipment', 'Check greenhouse structures', 'Delay irrigation if using sprinklers'],
        timestamp: 'Now'
      });
    }
    
    if (current.rainfall > 10 || (weekly && weekly[0]?.rainProbability > 70)) {
      alerts.push({
        id: 'rain-alert',
        type: 'heavy-rain' as const,
        severity: 'high' as const,
        title: 'Heavy Rainfall Warning',
        message: current.rainfall > 10 ? `${current.rainfall}mm rainfall recorded` : 'Heavy rain expected soon',
        actionableTips: ['Ensure proper drainage', 'Delay fertilizer application', 'Harvest mature crops if possible', 'Protect seedlings', 'Check for waterlogging'],
        timestamp: 'Now'
      });
    }
    
    if (current.humidity > 80) {
      alerts.push({
        id: 'humidity-alert',
        type: 'high-humidity' as const,
        severity: 'moderate' as const,
        title: 'High Humidity Notice',
        message: `Humidity at ${current.humidity}%`,
        actionableTips: ['Monitor for fungal diseases', 'Improve air circulation', 'Apply preventive fungicides', 'Check crops for disease symptoms'],
        timestamp: 'Now'
      });
    }
    
    if (current.temperature > 35) {
      alerts.push({
        id: 'heat-alert',
        type: 'heatwave' as const,
        severity: 'high' as const,
        title: 'Heatwave Warning',
        message: `Temperature at ${current.temperature}°C`,
        actionableTips: ['Increase irrigation frequency', 'Provide shade for sensitive crops', 'Monitor for heat stress', 'Avoid midday field work'],
        timestamp: 'Now'
      });
    }
    
    if (current.uvIndex > 8) {
      alerts.push({
        id: 'uv-alert',
        type: 'high-wind' as const,
        severity: 'moderate' as const,
        title: 'High UV Index',
        message: `UV Index at ${current.uvIndex}`,
        actionableTips: ['Wear protective clothing', 'Use sunscreen', 'Take breaks in shade', 'Avoid prolonged sun exposure'],
        timestamp: 'Now'
      });
    }
    
    return alerts;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Advanced Weather Intelligence"
          description="Comprehensive weather insights and farming recommendations powered by real-time data"
          icon="🌤️"
          backLink="/dashboard"
        />

        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex items-start space-x-4">
            <SparklesIcon className="w-10 h-10 flex-shrink-0 mt-1 animate-pulse" />
            <div>
              <h3 className="text-2xl font-bold mb-2">Farmer-Friendly Weather Intelligence</h3>
              <p className="text-blue-100 text-lg">
                Get actionable farming insights based on current, hourly, and weekly weather conditions. 
                Make informed decisions to maximize your yield and protect your crops.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Location Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white p-6 rounded-3xl shadow-xl border-2 border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">📍 Select Your Farm Location</h3>
            <LocationSearchMap
              onLocationSelect={handleLocationSelect}
              initialLocation=""
            />
          </div>
        </motion.div>

        {location && (
          <>
            {/* Location Confirmation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-5 bg-green-100 border-2 border-green-500 rounded-2xl"
            >
              <div className="flex items-center space-x-3">
                <MapPinIcon className="w-6 h-6 text-green-700" />
                <div>
                  <span className="font-bold text-lg text-green-900">Location Set!</span>
                  <p className="text-green-700 text-sm">
                    {location.city}, {location.state}, {location.country} • {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center py-20"
              >
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg">Loading weather data...</p>
                </div>
              </motion.div>
            )}

            {/* Main Content */}
            {!loading && weatherData && (
              <div className="space-y-8">
                {/* 1. Real-Time Weather Dashboard */}
                <RealTimeWeatherDashboard data={weatherData.current} />

                {/* 2. Smart Weather Alerts */}
                <SmartWeatherAlerts alerts={generateAlerts()} />

                {/* 3. Hourly Forecast */}
                <HourlyForecast hourlyData={weatherData.hourly} />

                {/* 4. Weekly Forecast */}
                <WeeklyForecast weeklyData={weatherData.weekly} />

                {/* 5. Crop-Specific Advice */}
                <CropSpecificAdvice 
                  selectedCrops={selectedCrops}
                  weatherData={weatherData.current}
                  adviceData={generateCropAdvice()}
                />

                {/* 6. Irrigation Planner */}
                <IrrigationPlanner data={weatherData.irrigation} />

                {/* 7. Soil Weather Impact */}
                <SoilWeatherImpact data={weatherData.soil} />

                {/* 8. Weather Trend Analytics */}
                <WeatherTrendAnalytics 
                  trendData={weatherData.trends.data}
                  insights={weatherData.trends.insights}
                />

                {/* 9. Task Recommendations */}
                <WeatherTaskRecommendations 
                  dailyTasks={weatherData.tasks.daily}
                  weeklyTasks={weatherData.tasks.weekly}
                />

                {/* 10. Download Report */}
                <WeatherReportDownload 
                  weatherData={weatherData}
                  location={`${location.city}, ${location.state}, ${location.country}`}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
