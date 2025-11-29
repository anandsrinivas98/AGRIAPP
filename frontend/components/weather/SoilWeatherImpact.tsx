'use client';
import { motion } from 'framer-motion';

interface SoilData {
  drynessLevel: number;
  drynessStatus: string;
  temperature: number;
  temperatureStatus: string;
  moistureScore: number;
  moistureStatus: string;
  nutrientLeaching: number;
  leachingRisk: string;
  recommendations: string[];
}

interface Props {
  data: SoilData;
}

export default function SoilWeatherImpact({ data }: Props) {
  const getStatusColor = (status: string) => {
    if (status.includes('Optimal') || status.includes('Good')) {
      return 'text-green-700 bg-green-100 border-green-300';
    } else if (status.includes('Moderate') || status.includes('Fair')) {
      return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    } else if (status.includes('High') || status.includes('Dry') || status.includes('Low')) {
      return 'text-red-700 bg-red-100 border-red-300';
    }
    return 'text-gray-700 bg-gray-100 border-gray-300';
  };

  const getGaugeColor = (value: number, type: string) => {
    if (type === 'moisture') {
      if (value >= 60) return '#10b981';
      if (value >= 40) return '#f59e0b';
      return '#ef4444';
    }
    if (type === 'dryness') {
      if (value <= 30) return '#10b981';
      if (value <= 60) return '#f59e0b';
      return '#ef4444';
    }
    if (type === 'leaching') {
      if (value <= 20) return '#10b981';
      if (value <= 50) return '#f59e0b';
      return '#ef4444';
    }
    return '#6b7280';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100"
    >
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-4xl">🌱</span>
        <h2 className="text-3xl font-bold text-gray-900">Weather Impact on Soil</h2>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Soil Dryness */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Soil Dryness</h3>
            <span className="text-3xl">🏜️</span>
          </div>
          
          <div className="mb-4">
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-4xl font-bold text-orange-900">{Math.round(data.drynessLevel)}</span>
              <span className="text-xl text-orange-700">%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.drynessLevel}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-3 rounded-full"
                style={{ backgroundColor: getGaugeColor(data.drynessLevel, 'dryness') }}
              />
            </div>
          </div>
          
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(data.drynessStatus)}`}>
            {data.drynessStatus}
          </span>
        </div>

        {/* Soil Temperature */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Soil Temperature</h3>
            <span className="text-3xl">🌡️</span>
          </div>
          
          <div className="mb-4">
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-4xl font-bold text-yellow-900">{Math.round(data.temperature)}</span>
              <span className="text-xl text-yellow-700">°C</span>
            </div>
            <div className="h-3 bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400 rounded-full relative">
              <div 
                className="absolute w-3 h-3 bg-white border-2 border-gray-800 rounded-full transform -translate-x-1/2"
                style={{ left: `${Math.min(Math.max((data.temperature / 50) * 100, 0), 100)}%` }}
              />
            </div>
          </div>
          
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(data.temperatureStatus)}`}>
            {data.temperatureStatus}
          </span>
        </div>

        {/* Soil Moisture */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Soil Moisture</h3>
            <span className="text-3xl">💧</span>
          </div>
          
          <div className="mb-4">
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-4xl font-bold text-blue-900">{Math.round(data.moistureScore)}</span>
              <span className="text-xl text-blue-700">%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.moistureScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-3 rounded-full"
                style={{ backgroundColor: getGaugeColor(data.moistureScore, 'moisture') }}
              />
            </div>
          </div>
          
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(data.moistureStatus)}`}>
            {data.moistureStatus}
          </span>
        </div>
      </div>

      {/* Nutrient Leaching Risk */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">⚠️</span>
            <h3 className="text-xl font-bold text-gray-900">Nutrient Leaching Risk</h3>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(data.leachingRisk)}`}>
            {data.leachingRisk}
          </span>
        </div>
        
        <div className="mb-4">
          <div className="flex items-baseline space-x-2 mb-3">
            <span className="text-3xl font-bold text-purple-900">{Math.round(data.nutrientLeaching)}</span>
            <span className="text-lg text-purple-700">% chance due to rain</span>
          </div>
          <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.nutrientLeaching}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-4 rounded-full"
              style={{ backgroundColor: getGaugeColor(data.nutrientLeaching, 'leaching') }}
            />
          </div>
        </div>
        
        <p className="text-sm text-purple-800">
          Heavy rainfall can wash away essential nutrients from the soil. Monitor and adjust fertilizer application accordingly.
        </p>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">💡</span>
          <h3 className="text-lg font-bold text-green-900">Soil Management Recommendations</h3>
        </div>
        
        <ul className="space-y-3">
          {data.recommendations.map((recommendation, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-start space-x-3 bg-white rounded-xl p-4 border border-green-300"
            >
              <span className="text-green-600 font-bold text-lg">•</span>
              <span className="text-sm text-green-900 flex-1">{recommendation}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Visual Indicators */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-4xl mb-2">
            {data.drynessLevel > 60 ? '🏜️' : data.drynessLevel > 30 ? '🌾' : '🌿'}
          </div>
          <div className="text-xs text-gray-600 font-semibold">Soil Condition</div>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-2">
            {data.temperature > 30 ? '🔥' : data.temperature > 20 ? '🌡️' : '❄️'}
          </div>
          <div className="text-xs text-gray-600 font-semibold">Temperature</div>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-2">
            {data.moistureScore > 60 ? '💧' : data.moistureScore > 30 ? '💦' : '🏜️'}
          </div>
          <div className="text-xs text-gray-600 font-semibold">Moisture Level</div>
        </div>
      </div>
    </motion.div>
  );
}
