'use client';
import { motion } from 'framer-motion';
import { 
  SunIcon,
  CloudIcon,
  BeakerIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  cloudCoverage: number;
  sunrise: string;
  sunset: string;
  uvIndex: number;
  maxTemp: number;
  minTemp: number;
  condition: string;
}

interface Props {
  data: WeatherData;
}

export default function RealTimeWeatherDashboard({ data }: Props) {
  const getUVSeverity = (uv: number) => {
    if (uv < 3) return { level: 'Low', color: 'green', bg: 'bg-green-100', text: 'text-green-700' };
    if (uv < 6) return { level: 'Moderate', color: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-700' };
    if (uv < 8) return { level: 'High', color: 'orange', bg: 'bg-orange-100', text: 'text-orange-700' };
    if (uv < 11) return { level: 'Very High', color: 'red', bg: 'bg-red-100', text: 'text-red-700' };
    return { level: 'Extreme', color: 'purple', bg: 'bg-purple-100', text: 'text-purple-700' };
  };

  const uvSeverity = getUVSeverity(data.uvIndex);

  const getWeatherIcon = () => {
    const condition = data.condition.toLowerCase();
    if (condition.includes('sun') || condition.includes('clear')) {
      return '☀️';
    } else if (condition.includes('cloud')) {
      return '☁️';
    } else if (condition.includes('rain')) {
      return '🌧️';
    } else if (condition.includes('storm')) {
      return '⛈️';
    }
    return '🌤️';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl shadow-2xl p-8 text-white"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Real-Time Weather</h2>
        <div className="text-6xl animate-float">{getWeatherIcon()}</div>
      </div>

      {/* Main Temperature Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div className="flex items-baseline space-x-4">
            <div className="text-7xl font-bold">{Math.round(data.temperature)}°</div>
            <div className="text-3xl text-blue-200">C</div>
          </div>
          <div className="text-2xl text-blue-100 capitalize">{data.condition}</div>
          <div className="flex items-center space-x-6 text-lg">
            <div className="flex items-center space-x-2">
              <ArrowUpIcon className="w-5 h-5 text-red-300" />
              <span>{Math.round(data.maxTemp)}°</span>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowDownIcon className="w-5 h-5 text-blue-300" />
              <span>{Math.round(data.minTemp)}°</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="text-blue-100 text-sm mb-1">Feels Like</div>
            <div className="text-3xl font-bold">{Math.round(data.feelsLike)}°C</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="text-blue-100 text-sm mb-1">Humidity</div>
            <div className="text-3xl font-bold">{Math.round(data.humidity)}%</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="text-blue-100 text-sm mb-1">Rainfall</div>
            <div className="text-3xl font-bold">{data.rainfall.toFixed(1)} mm</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="text-blue-100 text-sm mb-1">Wind Speed</div>
            <div className="text-3xl font-bold">{Math.round(data.windSpeed)} km/h</div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="text-blue-100 text-xs mb-2">Wind Direction</div>
          <div className="text-xl font-bold">{data.windDirection}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="text-blue-100 text-xs mb-2">Pressure</div>
          <div className="text-xl font-bold">{Math.round(data.pressure)} mb</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="text-blue-100 text-xs mb-2">Cloud Cover</div>
          <div className="text-xl font-bold">{Math.round(data.cloudCoverage)}%</div>
        </div>
        <div className={`${uvSeverity.bg} rounded-xl p-4 border-2 border-${uvSeverity.color}-300`}>
          <div className={`${uvSeverity.text} text-xs mb-2 font-semibold`}>UV Index</div>
          <div className={`text-xl font-bold ${uvSeverity.text} flex items-center space-x-2`}>
            <span>{Math.round(data.uvIndex)}</span>
            {data.uvIndex >= 6 && <ExclamationTriangleIcon className="w-5 h-5" />}
          </div>
          <div className={`text-xs ${uvSeverity.text} mt-1`}>{uvSeverity.level}</div>
        </div>
      </div>

      {/* Sun Times */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-orange-400/20 to-yellow-400/20 backdrop-blur-md rounded-xl p-4 border border-orange-300/30">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">🌅</span>
            <span className="text-sm text-orange-100">Sunrise</span>
          </div>
          <div className="text-2xl font-bold">{data.sunrise}</div>
        </div>
        <div className="bg-gradient-to-r from-purple-400/20 to-pink-400/20 backdrop-blur-md rounded-xl p-4 border border-purple-300/30">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">🌇</span>
            <span className="text-sm text-purple-100">Sunset</span>
          </div>
          <div className="text-2xl font-bold">{data.sunset}</div>
        </div>
      </div>
    </motion.div>
  );
}
