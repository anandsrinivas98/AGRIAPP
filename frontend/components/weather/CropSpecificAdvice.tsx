'use client';
import { motion } from 'framer-motion';
import { 
  BeakerIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/solid';

interface CropAdvice {
  cropName: string;
  watering: {
    recommendation: string;
    amount: string;
    timing: string;
    status: 'recommended' | 'optional' | 'not-needed';
  };
  fertilizer: {
    recommendation: string;
    timing: string;
    type: string;
    status: 'good' | 'wait' | 'not-recommended';
  };
  sowingHarvesting: {
    activity: string;
    suitability: 'excellent' | 'good' | 'moderate' | 'poor';
    reason: string;
  };
  irrigation: {
    need: string;
    frequency: string;
    method: string;
  };
  weatherImpact: {
    heatwave: boolean;
    coldwave: boolean;
    impact: string;
  };
  pestDiseaseRisk: {
    level: 'low' | 'moderate' | 'high';
    risks: string[];
    prevention: string[];
  };
  sprayingAdvice: {
    suitable: boolean;
    reason: string;
    bestTime: string;
  };
}

interface Props {
  selectedCrops: string[];
  weatherData: any;
  adviceData: CropAdvice[];
}

export default function CropSpecificAdvice({ selectedCrops, weatherData, adviceData }: Props) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100 border-green-300';
      case 'moderate': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'high': return 'text-red-600 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getSuitabilityIcon = (suitability: string) => {
    switch (suitability) {
      case 'excellent': return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
      case 'good': return <CheckCircleIcon className="w-6 h-6 text-blue-600" />;
      case 'moderate': return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />;
      case 'poor': return <XCircleIcon className="w-6 h-6 text-red-600" />;
      default: return <CheckCircleIcon className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100"
    >
      <div className="flex items-center space-x-3 mb-6">
        <SparklesIcon className="w-8 h-8 text-green-600" />
        <h2 className="text-3xl font-bold text-gray-900">Crop-Specific Weather Advice</h2>
      </div>

      {selectedCrops.length === 0 ? (
        <div className="text-center py-12">
          <BeakerIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Select crops to get personalized weather advice</p>
        </div>
      ) : (
        <div className="space-y-6">
          {adviceData.map((advice, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200"
            >
              {/* Crop Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-green-900">{advice.cropName}</h3>
                <span className="text-3xl">🌾</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Watering Recommendations */}
                <div className="bg-white rounded-xl p-5 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">💧</span>
                    <h4 className="font-bold text-gray-900">Watering</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      advice.watering.status === 'recommended' ? 'bg-blue-100 text-blue-700' :
                      advice.watering.status === 'optional' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {advice.watering.status.replace('-', ' ').toUpperCase()}
                    </div>
                    <p className="text-gray-700 font-medium">{advice.watering.recommendation}</p>
                    <p className="text-gray-600">Amount: {advice.watering.amount}</p>
                    <p className="text-gray-600">Best Time: {advice.watering.timing}</p>
                  </div>
                </div>

                {/* Fertilizer Timing */}
                <div className="bg-white rounded-xl p-5 border border-green-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">🧪</span>
                    <h4 className="font-bold text-gray-900">Fertilizer</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      advice.fertilizer.status === 'good' ? 'bg-green-100 text-green-700' :
                      advice.fertilizer.status === 'wait' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {advice.fertilizer.status.toUpperCase()}
                    </div>
                    <p className="text-gray-700 font-medium">{advice.fertilizer.recommendation}</p>
                    <p className="text-gray-600">Type: {advice.fertilizer.type}</p>
                    <p className="text-gray-600">Timing: {advice.fertilizer.timing}</p>
                  </div>
                </div>

                {/* Sowing/Harvesting Suitability */}
                <div className="bg-white rounded-xl p-5 border border-purple-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">🌱</span>
                    <h4 className="font-bold text-gray-900">Sowing/Harvesting</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      {getSuitabilityIcon(advice.sowingHarvesting.suitability)}
                      <span className="font-semibold text-gray-900 capitalize">
                        {advice.sowingHarvesting.suitability} Conditions
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium">{advice.sowingHarvesting.activity}</p>
                    <p className="text-gray-600">{advice.sowingHarvesting.reason}</p>
                  </div>
                </div>

                {/* Irrigation Needs */}
                <div className="bg-white rounded-xl p-5 border border-cyan-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">🚿</span>
                    <h4 className="font-bold text-gray-900">Irrigation</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700 font-medium">{advice.irrigation.need}</p>
                    <p className="text-gray-600">Frequency: {advice.irrigation.frequency}</p>
                    <p className="text-gray-600">Method: {advice.irrigation.method}</p>
                  </div>
                </div>
              </div>

              {/* Weather Impact Warning */}
              {(advice.weatherImpact.heatwave || advice.weatherImpact.coldwave) && (
                <div className="mt-6 bg-orange-100 border-2 border-orange-400 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <ExclamationTriangleIcon className="w-6 h-6 text-orange-600 flex-shrink-0" />
                    <div>
                      <h5 className="font-bold text-orange-900 mb-1">
                        {advice.weatherImpact.heatwave ? '🔥 Heatwave Alert' : '❄️ Cold Wave Alert'}
                      </h5>
                      <p className="text-sm text-orange-800">{advice.weatherImpact.impact}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pest & Disease Risk */}
              <div className="mt-6 bg-white rounded-xl p-5 border-2 border-red-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🐛</span>
                    <h4 className="font-bold text-gray-900">Pest & Disease Risk</h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getRiskColor(advice.pestDiseaseRisk.level)}`}>
                    {advice.pestDiseaseRisk.level.toUpperCase()} RISK
                  </span>
                </div>
                
                {advice.pestDiseaseRisk.risks.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Potential Risks:</p>
                    <ul className="space-y-1">
                      {advice.pestDiseaseRisk.risks.map((risk, idx) => (
                        <li key={idx} className="text-sm text-red-700 flex items-start space-x-2">
                          <span>•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Prevention Tips:</p>
                  <ul className="space-y-1">
                    {advice.pestDiseaseRisk.prevention.map((tip, idx) => (
                      <li key={idx} className="text-sm text-green-700 flex items-start space-x-2">
                        <CheckCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Spraying Advice */}
              <div className={`mt-6 rounded-xl p-5 border-2 ${
                advice.sprayingAdvice.suitable 
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-red-50 border-red-400'
              }`}>
                <div className="flex items-start space-x-3">
                  {advice.sprayingAdvice.suitable ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h5 className={`font-bold mb-1 ${
                      advice.sprayingAdvice.suitable ? 'text-green-900' : 'text-red-900'
                    }`}>
                      Spray/Fertilizer Application
                    </h5>
                    <p className={`text-sm mb-2 ${
                      advice.sprayingAdvice.suitable ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {advice.sprayingAdvice.reason}
                    </p>
                    {advice.sprayingAdvice.suitable && (
                      <p className="text-sm text-green-700">
                        <span className="font-semibold">Best Time:</span> {advice.sprayingAdvice.bestTime}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
