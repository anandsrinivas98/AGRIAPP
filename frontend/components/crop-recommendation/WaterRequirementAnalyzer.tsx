'use client';

import { motion } from 'framer-motion';
import { BeakerIcon, CloudIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface WaterRequirementAnalyzerProps {
  crop: any;
  rainfall: number;
  humidity: number;
}

export default function WaterRequirementAnalyzer({ crop, rainfall, humidity }: WaterRequirementAnalyzerProps) {
  const waterRequirement = 250; // mm per season
  const irrigationNeeded = Math.max(0, waterRequirement - rainfall);
  const irrigationFrequency = Math.ceil(irrigationNeeded / 25); // times per season
  
  const waterStages = [
    {
      stage: 'Germination',
      duration: '0-2 weeks',
      requirement: 'High',
      frequency: 'Daily',
      amount: '20-25mm',
      icon: '🌱',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      stage: 'Vegetative Growth',
      duration: '2-8 weeks',
      requirement: 'Medium',
      frequency: 'Every 2-3 days',
      amount: '15-20mm',
      icon: '🌿',
      color: 'from-green-400 to-emerald-400'
    },
    {
      stage: 'Flowering',
      duration: '8-12 weeks',
      requirement: 'High',
      frequency: 'Every 2 days',
      amount: '25-30mm',
      icon: '🌸',
      color: 'from-pink-400 to-rose-400'
    },
    {
      stage: 'Fruit Development',
      duration: '12-16 weeks',
      requirement: 'Very High',
      frequency: 'Daily',
      amount: '30-35mm',
      icon: '🍎',
      color: 'from-orange-400 to-red-400'
    },
    {
      stage: 'Maturation',
      duration: '16-20 weeks',
      requirement: 'Low',
      frequency: 'Every 3-4 days',
      amount: '10-15mm',
      icon: '🌾',
      color: 'from-yellow-400 to-amber-400'
    }
  ];

  const irrigationMethods = [
    {
      name: 'Drip Irrigation',
      efficiency: 90,
      cost: 'High',
      suitability: 'Excellent',
      waterSaving: '40-60%',
      icon: '💧',
      pros: ['Maximum water efficiency', 'Reduced weed growth', 'Precise water delivery'],
      cons: ['High initial cost', 'Requires maintenance']
    },
    {
      name: 'Sprinkler System',
      efficiency: 75,
      cost: 'Medium',
      suitability: 'Good',
      waterSaving: '20-30%',
      icon: '🚿',
      pros: ['Uniform coverage', 'Moderate cost', 'Easy to install'],
      cons: ['Water loss to evaporation', 'Wind affects distribution']
    },
    {
      name: 'Flood Irrigation',
      efficiency: 50,
      cost: 'Low',
      suitability: 'Fair',
      waterSaving: '0-10%',
      icon: '🌊',
      pros: ['Low cost', 'Simple operation', 'Traditional method'],
      cons: ['High water wastage', 'Uneven distribution', 'Soil erosion']
    }
  ];

  const getRequirementColor = (req: string) => {
    switch (req) {
      case 'Very High': return 'text-red-600 bg-red-50';
      case 'High': return 'text-orange-600 bg-orange-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Water Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border-2 border-blue-200"
        >
          <div className="flex items-center space-x-3 mb-2">
            <CloudIcon className="w-6 h-6 text-blue-600" />
            <h4 className="font-semibold text-gray-700">Rainfall</h4>
          </div>
          <p className="text-3xl font-bold text-gray-800">{rainfall}mm</p>
          <p className="text-sm text-gray-600 mt-1">expected this season</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-200"
        >
          <div className="flex items-center space-x-3 mb-2">
            <BeakerIcon className="w-6 h-6 text-green-600" />
            <h4 className="font-semibold text-gray-700">Required</h4>
          </div>
          <p className="text-3xl font-bold text-gray-800">{waterRequirement}mm</p>
          <p className="text-sm text-gray-600 mt-1">total water needed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`bg-gradient-to-br ${irrigationNeeded > 100 ? 'from-orange-50 to-red-50' : 'from-green-50 to-lime-50'} p-5 rounded-xl border-2 ${irrigationNeeded > 100 ? 'border-orange-200' : 'border-green-200'}`}
        >
          <div className="flex items-center space-x-3 mb-2">
            {irrigationNeeded > 100 ? (
              <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
            ) : (
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            )}
            <h4 className="font-semibold text-gray-700">Irrigation</h4>
          </div>
          <p className="text-3xl font-bold text-gray-800">{irrigationNeeded}mm</p>
          <p className="text-sm text-gray-600 mt-1">{irrigationFrequency} times needed</p>
        </motion.div>
      </div>

      {/* Growth Stage Water Requirements */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Water Requirements by Growth Stage</h3>
        <div className="space-y-4">
          {waterStages.map((stage, index) => (
            <motion.div
              key={stage.stage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className={`w-14 h-14 bg-gradient-to-br ${stage.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                  {stage.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{stage.stage}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRequirementColor(stage.requirement)}`}>
                      {stage.requirement}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 font-medium text-gray-800">{stage.duration}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Frequency:</span>
                      <span className="ml-2 font-medium text-gray-800">{stage.frequency}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <span className="ml-2 font-medium text-gray-800">{stage.amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Irrigation Methods Comparison */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Recommended Irrigation Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {irrigationMethods.map((method, index) => (
            <motion.div
              key={method.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-5 rounded-xl border-2 ${index === 0 ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}
            >
              {index === 0 && (
                <div className="mb-3">
                  <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                    RECOMMENDED
                  </span>
                </div>
              )}
              <div className="text-4xl mb-3">{method.icon}</div>
              <h4 className="font-bold text-gray-800 mb-2">{method.name}</h4>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Efficiency:</span>
                  <span className="font-semibold text-gray-800">{method.efficiency}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-semibold text-gray-800">{method.cost}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Water Saving:</span>
                  <span className="font-semibold text-green-600">{method.waterSaving}</span>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-700 mb-2">Advantages:</p>
                <ul className="space-y-1">
                  {method.pros.map((pro, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start">
                      <CheckCircleIcon className="w-3 h-3 text-green-600 mr-1 flex-shrink-0 mt-0.5" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">Considerations:</p>
                <ul className="space-y-1">
                  {method.cons.map((con, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start">
                      <ExclamationTriangleIcon className="w-3 h-3 text-orange-600 mr-1 flex-shrink-0 mt-0.5" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
