'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  CloudIcon,
  SunIcon,
  CloudArrowDownIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface WeatherDetailsProps {
  data: any;
  location: { lat: number; lng: number };
}

const WeatherDetails = React.memo(function WeatherDetails({ data, location }: WeatherDetailsProps) {
  const { current, forecast, hourly } = data;

  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('sun') || lower.includes('clear')) {
      return <SunIcon className="w-16 h-16 text-yellow-400" />;
    } else if (lower.includes('cloud')) {
      return <CloudIcon className="w-16 h-16 text-gray-400" />;
    } else if (lower.includes('rain')) {
      return <CloudArrowDownIcon className="w-16 h-16 text-blue-400" />;
    }
    return <CloudIcon className="w-16 h-16 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-2xl shadow-2xl text-white"
      >
        <h3 className="text-2xl font-bold mb-6">Current Weather</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Weather Info */}
          <div className="flex items-center space-x-6">
            {getWeatherIcon(current.condition)}
            <div>
              <div className="text-6xl font-bold">{current.temperature}°C</div>
              <div className="text-2xl text-blue-100 mt-2">{current.condition}</div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-blue-100 text-sm mb-1">Humidity</div>
              <div className="text-2xl font-bold">{current.humidity}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-blue-100 text-sm mb-1">Wind Speed</div>
              <div className="text-2xl font-bold">{current.windSpeed} km/h</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-blue-100 text-sm mb-1">Precipitation</div>
              <div className="text-2xl font-bold">{current.precipitation}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-blue-100 text-sm mb-1">Feels Like</div>
              <div className="text-2xl font-bold">{current.feelsLike}°C</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hourly Forecast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-8 rounded-2xl shadow-xl border-2 border-gray-200"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">24-Hour Forecast</h3>
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-4 min-w-max">
            {hourly.map((hour: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all min-w-[120px]"
              >
                <div className="text-center">
                  <div className="font-bold text-gray-900 mb-2">{hour.time}</div>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(hour.condition)}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{hour.temp}°C</div>
                  <div className="text-xs text-gray-600 mb-2">{hour.condition}</div>
                  <div className="flex items-center justify-center space-x-2 text-xs">
                    <div className="flex items-center text-blue-500">
                      <CloudArrowDownIcon className="w-3 h-3 mr-1" />
                      <span>{hour.precipitation}%</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    💨 {hour.windSpeed} km/h
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 7-Day Forecast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-8 rounded-2xl shadow-xl border-2 border-gray-200"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">7-Day Forecast</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
          {forecast.map((day: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border-2 border-gray-200 hover:border-green-400 hover:shadow-lg transition-all"
            >
              <div className="text-center">
                <div className="font-bold text-gray-900 mb-2">{day.day}</div>
                <div className="flex justify-center mb-3">
                  {getWeatherIcon(day.condition)}
                </div>
                <div className="text-sm text-gray-600 mb-3">{day.condition}</div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="flex items-center text-red-500">
                    <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                    <span className="font-bold">{day.high}°</span>
                  </div>
                  <div className="flex items-center text-blue-500">
                    <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                    <span className="font-bold">{day.low}°</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Rain: {day.precipitation}%
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Additional Weather Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-2xl border-2 border-yellow-200 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <SunIcon className="w-8 h-8 text-yellow-500" />
            <h4 className="text-lg font-bold text-gray-900">UV Index</h4>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">{current.uvIndex}</div>
          <div className="text-sm text-gray-600">
            {current.uvIndex < 3 ? 'Low' : current.uvIndex < 6 ? 'Moderate' : current.uvIndex < 8 ? 'High' : 'Very High'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border-2 border-blue-200 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <CloudIcon className="w-8 h-8 text-blue-500" />
            <h4 className="text-lg font-bold text-gray-900">Visibility</h4>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">{current.visibility} km</div>
          <div className="text-sm text-gray-600">Clear visibility</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl border-2 border-green-200 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <CloudArrowDownIcon className="w-8 h-8 text-green-500" />
            <h4 className="text-lg font-bold text-gray-900">Pressure</h4>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">{current.pressure} mb</div>
          <div className="text-sm text-gray-600">Normal pressure</div>
        </div>
      </motion.div>

      {/* Farming Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-green-500 to-green-600 p-8 rounded-2xl shadow-2xl text-white"
      >
        <h3 className="text-2xl font-bold mb-4">Farming Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <div className="font-bold mb-2">✓ Good for Irrigation</div>
            <div className="text-sm text-green-100">
              Current conditions are favorable for watering crops
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <div className="font-bold mb-2">✓ Suitable for Planting</div>
            <div className="text-sm text-green-100">
              Temperature and humidity levels are optimal
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <div className="font-bold mb-2">⚠ Monitor Wind Speed</div>
            <div className="text-sm text-green-100">
              Wind conditions may affect spraying activities
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <div className="font-bold mb-2">✓ Good Visibility</div>
            <div className="text-sm text-green-100">
              Clear conditions for field operations
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

export default WeatherDetails;
