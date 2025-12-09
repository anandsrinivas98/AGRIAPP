'use client';
import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';

interface HourlyData {
  time: string;
  hour: number;
  temperature: number;
  rainChance: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
}

interface Props {
  hourlyData: HourlyData[];
}

const HourlyForecast = React.memo(function HourlyForecast({ hourlyData }: Props) {
  // Convert 24-hour to 12-hour format with AM/PM
  const formatTime = useCallback((hour: number) => {
    if (hour === 0) return '12:00 AM';
    if (hour === 12) return '12:00 PM';
    if (hour < 12) return `${hour}:00 AM`;
    return `${hour - 12}:00 PM`;
  }, []);

  // Find best hour for field work (low rain, moderate temp, low wind)
  const bestHour = useMemo(() => {
    let bestHour = hourlyData[0];
    let bestScore = 0;

    hourlyData.forEach(hour => {
      let score = 0;
      // Prefer low rain chance
      score += (100 - hour.rainChance) * 0.4;
      // Prefer moderate temperature (20-28°C)
      if (hour.temperature >= 20 && hour.temperature <= 28) score += 30;
      // Prefer low wind
      if (hour.windSpeed < 15) score += 20;
      // Prefer lower humidity
      score += (100 - hour.humidity) * 0.1;

      if (score > bestScore) {
        bestScore = score;
        bestHour = hour;
      }
    });

    return bestHour;
  }, [hourlyData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Hourly Forecast</h2>
        <span className="text-sm text-gray-500">Next 24 Hours</span>
      </div>

      {/* Best Hour Highlight */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 mb-6"
      >
        <div className="flex items-center space-x-3 mb-3">
          <SparklesIcon className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-bold text-green-900">Best Time for Field Work</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-green-700">{formatTime(bestHour.hour)}</div>
            <div className="text-sm text-green-600 mt-1">
              {Math.round(bestHour.temperature)}°C • {Math.round(bestHour.rainChance)}% rain • {Math.round(bestHour.windSpeed)} km/h wind
            </div>
          </div>
          <div className="text-5xl">{bestHour.icon}</div>
        </div>
      </motion.div>

      {/* Hourly Cards */}
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-max">
          {hourlyData.map((hour, index) => {
            const isBestHour = hour.time === bestHour.time;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className={`relative min-w-[140px] rounded-2xl p-5 border-2 transition-all hover:shadow-lg ${
                  isBestHour
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-md'
                    : 'bg-gradient-to-br from-gray-50 to-white border-gray-200 hover:border-blue-300'
                }`}
              >
                {isBestHour && (
                  <div className="absolute -top-2 -right-2">
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  </div>
                )}
                
                <div className="text-center space-y-3">
                  <div className="font-bold text-gray-900 text-lg">{formatTime(hour.hour)}</div>
                  
                  <div className="text-5xl my-3">{hour.icon}</div>
                  
                  <div className="text-3xl font-bold text-gray-900">{Math.round(hour.temperature)}°</div>
                  
                  <div className="text-xs text-gray-600 capitalize">{hour.condition}</div>
                  
                  <div className="space-y-2 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Rain</span>
                      <span className={`font-semibold ${hour.rainChance > 50 ? 'text-blue-600' : 'text-gray-700'}`}>
                        {Math.round(hour.rainChance)}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Humidity</span>
                      <span className="font-semibold text-gray-700">{Math.round(hour.humidity)}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Wind</span>
                      <span className={`font-semibold ${hour.windSpeed > 20 ? 'text-orange-600' : 'text-gray-700'}`}>
                        {Math.round(hour.windSpeed)} km/h
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
});

export default HourlyForecast;
