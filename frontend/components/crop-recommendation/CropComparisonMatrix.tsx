'use client';

import { motion } from 'framer-motion';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface CropComparisonMatrixProps {
  crops: any[];
  onSelectCrop: (crop: any) => void;
}

export default function CropComparisonMatrix({ crops, onSelectCrop }: CropComparisonMatrixProps) {
  const comparisonData = crops.map(crop => ({
    name: crop.crop,
    confidence: crop.confidence,
    yield: crop.yield || '25 quintals/acre',
    waterNeed: getWaterNeed(crop.crop),
    duration: getDuration(crop.crop),
    profitability: crop.profit || 'High',
    season: getSeason(crop.crop),
    riskLevel: getRiskLevel(crop.crop),
    soilMatch: Math.round(crop.confidence * 0.9)
  }));

  function getWaterNeed(crop: string) {
    const needs: any = {
      'Rice': 'Very High',
      'Wheat': 'Medium',
      'Corn': 'Medium',
      'Cotton': 'High',
      'Sugarcane': 'Very High'
    };
    return needs[crop] || 'Medium';
  }

  function getDuration(crop: string) {
    const durations: any = {
      'Rice': '120-150 days',
      'Wheat': '110-130 days',
      'Corn': '90-120 days',
      'Cotton': '150-180 days',
      'Sugarcane': '12-18 months'
    };
    return durations[crop] || '90-120 days';
  }

  function getSeason(crop: string) {
    const seasons: any = {
      'Rice': 'Kharif',
      'Wheat': 'Rabi',
      'Corn': 'Kharif',
      'Cotton': 'Kharif',
      'Sugarcane': 'Year-round'
    };
    return seasons[crop] || 'Kharif';
  }

  function getRiskLevel(crop: string) {
    const risks: any = {
      'Rice': 'Medium',
      'Wheat': 'Low',
      'Corn': 'Medium',
      'Cotton': 'High',
      'Sugarcane': 'Medium'
    };
    return risks[crop] || 'Medium';
  }

  const getRiskColor = (risk: string) => {
    if (risk === 'Low') return 'text-green-600 bg-green-100';
    if (risk === 'Medium') return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getWaterColor = (need: string) => {
    if (need === 'Low' || need === 'Medium') return 'text-blue-600';
    return 'text-orange-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Crop Comparison Matrix</h3>
        <p className="text-gray-600">Compare top recommended crops side by side</p>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-green-50 to-lime-50">
              <th className="p-4 text-left font-semibold text-gray-800 border-b-2 border-green-200">
                Crop Name
              </th>
              <th className="p-4 text-center font-semibold text-gray-800 border-b-2 border-green-200">
                Match Score
              </th>
              <th className="p-4 text-center font-semibold text-gray-800 border-b-2 border-green-200">
                Expected Yield
              </th>
              <th className="p-4 text-center font-semibold text-gray-800 border-b-2 border-green-200">
                Water Need
              </th>
              <th className="p-4 text-center font-semibold text-gray-800 border-b-2 border-green-200">
                Duration
              </th>
              <th className="p-4 text-center font-semibold text-gray-800 border-b-2 border-green-200">
                Profitability
              </th>
              <th className="p-4 text-center font-semibold text-gray-800 border-b-2 border-green-200">
                Season
              </th>
              <th className="p-4 text-center font-semibold text-gray-800 border-b-2 border-green-200">
                Risk Level
              </th>
              <th className="p-4 text-center font-semibold text-gray-800 border-b-2 border-green-200">
                Soil Match
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((crop, index) => (
              <motion.tr
                key={crop.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelectCrop(crops[index])}
                className="border-b border-gray-200 hover:bg-green-50 cursor-pointer transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🌾</span>
                    <span className="font-semibold text-gray-800">{crop.name}</span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                    <span>{crop.confidence}%</span>
                  </div>
                </td>
                <td className="p-4 text-center text-gray-700">{crop.yield}</td>
                <td className="p-4 text-center">
                  <span className={`font-medium ${getWaterColor(crop.waterNeed)}`}>
                    {crop.waterNeed}
                  </span>
                </td>
                <td className="p-4 text-center text-gray-700">{crop.duration}</td>
                <td className="p-4 text-center">
                  <span className="font-semibold text-green-600">{crop.profitability}</span>
                </td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {crop.season}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getRiskColor(crop.riskLevel)}`}>
                    {crop.riskLevel}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${crop.soilMatch}%` }}
                      />
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{crop.soilMatch}%</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {comparisonData.map((crop, index) => (
          <motion.div
            key={crop.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectCrop(crops[index])}
            className="bg-white p-5 rounded-xl border-2 border-gray-200 hover:border-green-500 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🌾</span>
                <span className="font-bold text-lg text-gray-800">{crop.name}</span>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold text-sm">
                {crop.confidence}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Yield:</span>
                <span className="ml-2 font-medium">{crop.yield}</span>
              </div>
              <div>
                <span className="text-gray-600">Water:</span>
                <span className={`ml-2 font-medium ${getWaterColor(crop.waterNeed)}`}>
                  {crop.waterNeed}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>
                <span className="ml-2 font-medium">{crop.duration}</span>
              </div>
              <div>
                <span className="text-gray-600">Profit:</span>
                <span className="ml-2 font-semibold text-green-600">{crop.profitability}</span>
              </div>
              <div>
                <span className="text-gray-600">Season:</span>
                <span className="ml-2 font-medium">{crop.season}</span>
              </div>
              <div>
                <span className="text-gray-600">Risk:</span>
                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${getRiskColor(crop.riskLevel)}`}>
                  {crop.riskLevel}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
