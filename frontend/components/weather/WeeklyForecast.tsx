'use client';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  XCircleIcon 
} from '@heroicons/react/24/solid';

interface DailyData {
  day: string;
  date: string;
  maxTemp: number;
  minTemp: number;
  rainProbability: number;
  windSpeed: number;
  windDirection: string;
  pollenLevel: string;
  dustLevel: string;
  warnings: string[];
  condition: string;
  icon: string;
  farmingSuitability: 'good' | 'moderate' | 'risky';
}

interface Props {
  weeklyData: DailyData[];
}

export default function WeeklyForecast({ weeklyData }: Props) {
  const getSuitabilityBadge = (suitability: string) => {
    switch (suitability) {
      case 'good':
        return {
          icon: <CheckCircleIcon className="w-5 h-5" />,
          text: 'Good Day',
          bg: 'bg-green-100',
          border: 'border-green-400',
          textColor: 'text-green-700'
        };
      case 'moderate':
        return {
          icon: <ExclamationTriangleIcon className="w-5 h-5" />,
          text: 'Moderate',
          bg: 'bg-yellow-100',
          border: 'border-yellow-400',
          textColor: 'text-yellow-700'
        };
      case 'risky':
        return {
          icon: <XCircleIcon className="w-5 h-5" />,
          text: 'Risky Day',
          bg: 'bg-red-100',
          border: 'border-red-400',
          textColor: 'text-red-700'
        };
      default:
        return {
          icon: <CheckCircleIcon className="w-5 h-5" />,
          text: 'Normal',
          bg: 'bg-gray-100',
          border: 'border-gray-400',
          textColor: 'text-gray-700'
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Weekly Forecast</h2>
        <span className="text-sm text-gray-500">7-14 Days Ahead</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {weeklyData.map((day, index) => {
          const badge = getSuitabilityBadge(day.farmingSuitability);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`rounded-2xl p-6 border-2 ${badge.border} ${badge.bg} hover:shadow-xl transition-all`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-bold text-gray-900 text-lg">{day.day}</div>
                  <div className="text-xs text-gray-600">{day.date}</div>
                </div>
                <div className="text-5xl">{day.icon}</div>
              </div>

              {/* Temperature */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">High</div>
                  <div className="text-2xl font-bold text-red-600">{Math.round(day.maxTemp)}°</div>
                </div>
                <div className="text-gray-300 text-2xl">/</div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Low</div>
                  <div className="text-2xl font-bold text-blue-600">{Math.round(day.minTemp)}°</div>
                </div>
              </div>

              {/* Condition */}
              <div className="text-center text-sm text-gray-700 capitalize mb-4 font-medium">
                {day.condition}
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-300">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Rain Chance</span>
                  <span className={`font-semibold ${day.rainProbability > 60 ? 'text-blue-700' : 'text-gray-700'}`}>
                    {Math.round(day.rainProbability)}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Wind</span>
                  <span className="font-semibold text-gray-700">
                    {Math.round(day.windSpeed)} km/h {day.windDirection}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Pollen</span>
                  <span className={`font-semibold ${
                    day.pollenLevel === 'High' ? 'text-orange-600' : 'text-gray-700'
                  }`}>
                    {day.pollenLevel}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Dust</span>
                  <span className={`font-semibold ${
                    day.dustLevel === 'High' ? 'text-orange-600' : 'text-gray-700'
                  }`}>
                    {day.dustLevel}
                  </span>
                </div>
              </div>

              {/* Warnings */}
              {day.warnings.length > 0 && (
                <div className="mb-4 space-y-1">
                  {day.warnings.map((warning, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs">
                      <ExclamationTriangleIcon className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span className="text-orange-700 font-medium">{warning}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Farming Suitability Badge */}
              <div className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-xl ${badge.bg} border ${badge.border}`}>
                <span className={badge.textColor}>{badge.icon}</span>
                <span className={`text-sm font-bold ${badge.textColor}`}>{badge.text}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
