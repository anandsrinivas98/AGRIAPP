'use client';

import { motion } from 'framer-motion';
import { CalendarIcon, SunIcon, CloudIcon } from '@heroicons/react/24/outline';

interface CropCalendarProps {
  crop: any;
}

export default function CropCalendar({ crop }: CropCalendarProps) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getCropCalendar = (cropName: string) => {
    const calendars: any = {
      'Rice': { sowing: [5, 6], growing: [7, 8, 9], harvest: [10, 11], duration: 120 },
      'Wheat': { sowing: [10, 11], growing: [0, 1, 2], harvest: [3, 4], duration: 120 },
      'Corn': { sowing: [5, 6], growing: [7, 8], harvest: [9, 10], duration: 100 },
      'Cotton': { sowing: [3, 4], growing: [5, 6, 7, 8], harvest: [9, 10, 11], duration: 150 },
      'Sugarcane': { sowing: [1, 2], growing: [3, 4, 5, 6, 7, 8, 9, 10], harvest: [11, 0], duration: 365 }
    };
    return calendars[cropName] || { sowing: [5, 6], growing: [7, 8], harvest: [9, 10], duration: 100 };
  };

  const calendar = getCropCalendar(crop.crop);

  const getMonthStatus = (monthIndex: number) => {
    if (calendar.sowing.includes(monthIndex)) return 'sowing';
    if (calendar.growing.includes(monthIndex)) return 'growing';
    if (calendar.harvest.includes(monthIndex)) return 'harvest';
    return 'inactive';
  };

  const getMonthColor = (status: string) => {
    switch (status) {
      case 'sowing': return 'bg-green-500 text-white';
      case 'growing': return 'bg-yellow-400 text-gray-800';
      case 'harvest': return 'bg-orange-500 text-white';
      default: return 'bg-gray-100 text-gray-400';
    }
  };

  const climateSuitability = months.map((_, i) => {
    const status = getMonthStatus(i);
    if (status === 'inactive') return 0;
    if (status === 'sowing') return 95;
    if (status === 'growing') return 85;
    return 90;
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Crop Calendar for {crop.crop}</h3>
        <p className="text-gray-600">Optimal timing for planting and harvesting</p>
      </div>

      {/* Key Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 p-5 rounded-xl border-2 border-green-200"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🌱</span>
            </div>
            <h4 className="font-semibold text-gray-800">Sowing Window</h4>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {months[calendar.sowing[0]]} - {months[calendar.sowing[calendar.sowing.length - 1]]}
          </p>
          <p className="text-sm text-gray-600 mt-1">Best time to plant seeds</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-orange-50 p-5 rounded-xl border-2 border-orange-200"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🌾</span>
            </div>
            <h4 className="font-semibold text-gray-800">Harvest Period</h4>
          </div>
          <p className="text-2xl font-bold text-orange-600">
            {months[calendar.harvest[0]]} - {months[calendar.harvest[calendar.harvest.length - 1]]}
          </p>
          <p className="text-sm text-gray-600 mt-1">Expected harvest time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 p-5 rounded-xl border-2 border-blue-200"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800">Growing Duration</h4>
          </div>
          <p className="text-2xl font-bold text-blue-600">{calendar.duration} days</p>
          <p className="text-sm text-gray-600 mt-1">Total crop cycle</p>
        </motion.div>
      </div>

      {/* Monthly Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-xl border-2 border-gray-200"
      >
        <h4 className="font-semibold text-gray-800 mb-4">Monthly Timeline</h4>
        <div className="grid grid-cols-12 gap-2">
          {months.map((month, index) => {
            const status = getMonthStatus(index);
            return (
              <motion.div
                key={month}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="text-center"
              >
                <div className={`p-3 rounded-lg ${getMonthColor(status)} transition-all`}>
                  <div className="text-xs font-medium mb-1">{month}</div>
                  <div className="text-lg">
                    {status === 'sowing' && '🌱'}
                    {status === 'growing' && '🌿'}
                    {status === 'harvest' && '🌾'}
                    {status === 'inactive' && '—'}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Sowing Period</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-sm text-gray-600">Growing Period</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm text-gray-600">Harvest Period</span>
          </div>
        </div>
      </motion.div>

      {/* Climate Suitability Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white p-6 rounded-xl border-2 border-gray-200"
      >
        <h4 className="font-semibold text-gray-800 mb-4">Monthly Climate Suitability</h4>
        <div className="space-y-2">
          {months.map((month, index) => (
            <div key={month} className="flex items-center space-x-3">
              <span className="w-12 text-sm text-gray-600">{month}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${climateSuitability[index]}%` }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.05 }}
                  className={`h-full flex items-center justify-end pr-2 ${
                    climateSuitability[index] >= 80 ? 'bg-green-500' :
                    climateSuitability[index] >= 50 ? 'bg-yellow-400' :
                    climateSuitability[index] > 0 ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  {climateSuitability[index] > 0 && (
                    <span className="text-xs font-medium text-white">
                      {climateSuitability[index]}%
                    </span>
                  )}
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
