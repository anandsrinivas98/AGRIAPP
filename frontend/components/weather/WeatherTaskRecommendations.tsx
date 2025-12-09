'use client';
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  WrenchIcon
} from '@heroicons/react/24/solid';

interface Task {
  id: string;
  category: 'sowing' | 'weeding' | 'fertilizer' | 'pest-control' | 'irrigation' | 'maintenance';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timing: string;
  weatherSuitability: 'excellent' | 'good' | 'moderate' | 'poor';
  icon: string;
}

interface Props {
  dailyTasks: Task[];
  weeklyTasks: Task[];
}

const WeatherTaskRecommendations = React.memo(function WeatherTaskRecommendations({ dailyTasks, weeklyTasks }: Props) {
  const getPriorityStyle = useCallback((priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  }, []);

  const getSuitabilityBadge = useCallback((suitability: string) => {
    switch (suitability) {
      case 'excellent':
        return { text: 'Excellent', color: 'bg-green-500 text-white' };
      case 'good':
        return { text: 'Good', color: 'bg-blue-500 text-white' };
      case 'moderate':
        return { text: 'Moderate', color: 'bg-yellow-500 text-white' };
      case 'poor':
        return { text: 'Poor', color: 'bg-red-500 text-white' };
      default:
        return { text: 'Unknown', color: 'bg-gray-500 text-white' };
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100"
    >
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-4xl">📝</span>
        <h2 className="text-3xl font-bold text-gray-900">Weather-Based Task Recommendations</h2>
      </div>

      {/* Daily Tasks */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <ClockIcon className="w-6 h-6 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-900">Today's Tasks</h3>
          <span className="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            {dailyTasks.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dailyTasks.map((task, index) => {
            const suitability = getSuitabilityBadge(task.weatherSuitability);
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border-2 border-blue-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{task.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-900">{task.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityStyle(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${suitability.color}`}>
                    {suitability.text}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-3">{task.description}</p>

                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <ClockIcon className="w-4 h-4" />
                  <span className="font-semibold">{task.timing}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Weekly Tasks */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <CalendarIcon className="w-6 h-6 text-green-600" />
          <h3 className="text-2xl font-bold text-gray-900">This Week's Tasks</h3>
          <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            {weeklyTasks.length}
          </span>
        </div>

        <div className="space-y-3">
          {weeklyTasks.map((task, index) => {
            const suitability = getSuitabilityBadge(task.weatherSuitability);
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <span className="text-3xl">{task.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-gray-900">{task.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityStyle(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{task.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <ClockIcon className="w-4 h-4" />
                        <span>{task.timing}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-2 rounded-lg ${suitability.color} whitespace-nowrap ml-4`}>
                    {suitability.text}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Task Categories Summary */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-200">
          <div className="text-2xl mb-1">🌱</div>
          <div className="text-xs text-purple-600 font-semibold">Sowing</div>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center border border-green-200">
          <div className="text-2xl mb-1">🌿</div>
          <div className="text-xs text-green-600 font-semibold">Weeding</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-3 text-center border border-yellow-200">
          <div className="text-2xl mb-1">🧪</div>
          <div className="text-xs text-yellow-600 font-semibold">Fertilizer</div>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center border border-red-200">
          <div className="text-2xl mb-1">🐛</div>
          <div className="text-xs text-red-600 font-semibold">Pest Control</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-200">
          <div className="text-2xl mb-1">💧</div>
          <div className="text-xs text-blue-600 font-semibold">Irrigation</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-200">
          <div className="text-2xl mb-1">🔧</div>
          <div className="text-xs text-gray-600 font-semibold">Maintenance</div>
        </div>
      </div>
    </motion.div>
  );
});

export default WeatherTaskRecommendations;
