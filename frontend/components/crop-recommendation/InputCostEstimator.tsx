'use client';

import { motion } from 'framer-motion';
import { CurrencyDollarIcon, TruckIcon, BeakerIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface InputCostEstimatorProps {
  crop: any;
}

export default function InputCostEstimator({ crop }: InputCostEstimatorProps) {
  const costBreakdown = [
    {
      category: 'Seeds',
      icon: '🌱',
      cost: 5000,
      unit: 'per acre',
      details: 'High-quality certified seeds',
      color: 'from-green-500 to-emerald-500'
    },
    {
      category: 'Fertilizers',
      icon: '⚗️',
      cost: 8000,
      unit: 'per acre',
      details: 'NPK and organic fertilizers',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      category: 'Pesticides',
      icon: '🛡️',
      cost: 3000,
      unit: 'per acre',
      details: 'Organic and chemical pesticides',
      color: 'from-purple-500 to-pink-500'
    },
    {
      category: 'Labor',
      icon: '👨‍🌾',
      cost: 12000,
      unit: 'per acre',
      details: 'Planting, maintenance, harvesting',
      color: 'from-orange-500 to-red-500'
    },
    {
      category: 'Irrigation',
      icon: '💧',
      cost: 6000,
      unit: 'per acre',
      details: 'Water and irrigation equipment',
      color: 'from-teal-500 to-blue-500'
    },
    {
      category: 'Equipment',
      icon: '🚜',
      cost: 4000,
      unit: 'per acre',
      details: 'Machinery rental and fuel',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const totalCost = costBreakdown.reduce((sum, item) => sum + item.cost, 0);
  const expectedYield = 4500; // kg per acre
  const marketPrice = 25; // per kg
  const expectedRevenue = expectedYield * marketPrice;
  const expectedProfit = expectedRevenue - totalCost;
  const profitMargin = ((expectedProfit / expectedRevenue) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-red-50 to-orange-50 p-5 rounded-xl border-2 border-red-200"
        >
          <div className="flex items-center space-x-3 mb-2">
            <CurrencyDollarIcon className="w-6 h-6 text-red-600" />
            <h4 className="font-semibold text-gray-700">Total Cost</h4>
          </div>
          <p className="text-3xl font-bold text-gray-800">₹{totalCost.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">per acre</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border-2 border-blue-200"
        >
          <div className="flex items-center space-x-3 mb-2">
            <TruckIcon className="w-6 h-6 text-blue-600" />
            <h4 className="font-semibold text-gray-700">Revenue</h4>
          </div>
          <p className="text-3xl font-bold text-gray-800">₹{expectedRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">expected</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-200"
        >
          <div className="flex items-center space-x-3 mb-2">
            <BeakerIcon className="w-6 h-6 text-green-600" />
            <h4 className="font-semibold text-gray-700">Profit</h4>
          </div>
          <p className="text-3xl font-bold text-gray-800">₹{expectedProfit.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">estimated</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border-2 border-purple-200"
        >
          <div className="flex items-center space-x-3 mb-2">
            <UserGroupIcon className="w-6 h-6 text-purple-600" />
            <h4 className="font-semibold text-gray-700">Margin</h4>
          </div>
          <p className="text-3xl font-bold text-gray-800">{profitMargin}%</p>
          <p className="text-sm text-gray-600 mt-1">profit margin</p>
        </motion.div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Cost Breakdown</h3>
        <div className="space-y-4">
          {costBreakdown.map((item, index) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-2xl`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{item.category}</h4>
                  <p className="text-sm text-gray-600">{item.details}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-800">₹{item.cost.toLocaleString()}</p>
                <p className="text-sm text-gray-600">{item.unit}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Visual Breakdown */}
        <div className="mt-6">
          <h4 className="font-semibold text-gray-700 mb-3">Cost Distribution</h4>
          <div className="flex h-8 rounded-full overflow-hidden">
            {costBreakdown.map((item, index) => {
              const percentage = (item.cost / totalCost) * 100;
              return (
                <div
                  key={item.category}
                  className={`bg-gradient-to-r ${item.color} flex items-center justify-center text-white text-xs font-semibold`}
                  style={{ width: `${percentage}%` }}
                  title={`${item.category}: ${percentage.toFixed(1)}%`}
                >
                  {percentage > 10 && `${percentage.toFixed(0)}%`}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {costBreakdown.map((item) => (
              <div key={item.category} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color}`} />
                <span className="text-sm text-gray-600">{item.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI Timeline */}
      <div className="bg-gradient-to-br from-green-50 to-lime-50 p-6 rounded-2xl border-2 border-green-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Return on Investment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Break-even Point</p>
            <p className="text-2xl font-bold text-gray-800">3-4 months</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Harvest Time</p>
            <p className="text-2xl font-bold text-gray-800">4-5 months</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">ROI</p>
            <p className="text-2xl font-bold text-green-600">
              {((expectedProfit / totalCost) * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
