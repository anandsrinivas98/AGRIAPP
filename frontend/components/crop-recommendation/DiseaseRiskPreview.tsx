'use client';

import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, ShieldCheckIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface DiseaseRiskPreviewProps {
  crop: any;
  weather: any;
}

export default function DiseaseRiskPreview({ crop, weather }: DiseaseRiskPreviewProps) {
  const diseases = [
    {
      name: 'Leaf Blight',
      risk: 'High',
      probability: 75,
      conditions: 'High humidity and moderate temperature',
      symptoms: ['Brown spots on leaves', 'Yellowing', 'Leaf drop'],
      prevention: ['Proper spacing', 'Fungicide spray', 'Remove infected leaves'],
      treatment: 'Apply copper-based fungicide',
      icon: '🍂',
      color: 'from-red-500 to-orange-500'
    },
    {
      name: 'Root Rot',
      risk: 'Medium',
      probability: 45,
      conditions: 'Waterlogged soil and poor drainage',
      symptoms: ['Wilting', 'Yellowing leaves', 'Stunted growth'],
      prevention: ['Improve drainage', 'Avoid overwatering', 'Use raised beds'],
      treatment: 'Reduce watering and apply fungicide',
      icon: '🌱',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      name: 'Powdery Mildew',
      risk: 'Medium',
      probability: 50,
      conditions: 'High humidity with warm days and cool nights',
      symptoms: ['White powdery coating', 'Leaf curling', 'Reduced photosynthesis'],
      prevention: ['Good air circulation', 'Avoid overhead watering', 'Resistant varieties'],
      treatment: 'Sulfur or neem oil spray',
      icon: '☁️',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      name: 'Bacterial Wilt',
      risk: 'Low',
      probability: 25,
      conditions: 'Warm temperatures and soil-borne bacteria',
      symptoms: ['Sudden wilting', 'Vascular discoloration', 'Plant death'],
      prevention: ['Crop rotation', 'Use disease-free seeds', 'Soil solarization'],
      treatment: 'Remove infected plants immediately',
      icon: '🦠',
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  const pests = [
    {
      name: 'Aphids',
      risk: 'High',
      damage: 'Sap sucking, virus transmission',
      control: ['Neem oil spray', 'Introduce ladybugs', 'Yellow sticky traps'],
      icon: '🐛'
    },
    {
      name: 'Caterpillars',
      risk: 'Medium',
      damage: 'Leaf damage, fruit boring',
      control: ['Bt spray', 'Hand picking', 'Pheromone traps'],
      icon: '🐛'
    },
    {
      name: 'Whiteflies',
      risk: 'Medium',
      damage: 'Leaf yellowing, sooty mold',
      control: ['Insecticidal soap', 'Reflective mulch', 'Parasitic wasps'],
      icon: '🦟'
    }
  ];

  const weatherRiskFactors = [
    {
      factor: 'Temperature',
      current: weather.temperature,
      optimal: '20-30°C',
      risk: weather.temperature > 30 || weather.temperature < 15 ? 'High' : 'Low',
      impact: 'Affects disease development and pest activity'
    },
    {
      factor: 'Humidity',
      current: `${weather.humidity}%`,
      optimal: '50-70%',
      risk: weather.humidity > 80 ? 'High' : weather.humidity < 40 ? 'Medium' : 'Low',
      impact: 'High humidity promotes fungal diseases'
    },
    {
      factor: 'Rainfall',
      current: `${weather.rainfall}mm`,
      optimal: '100-200mm',
      risk: weather.rainfall > 250 ? 'High' : 'Low',
      impact: 'Excess rain increases disease pressure'
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-700 bg-red-100 border-red-300';
      case 'Medium': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'Low': return 'text-green-700 bg-green-100 border-green-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const overallRisk = diseases.reduce((sum, d) => sum + d.probability, 0) / diseases.length;

  return (
    <div className="space-y-6">
      {/* Overall Risk Assessment */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-6 rounded-2xl border-2 ${
          overallRisk > 60 ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200' :
          overallRisk > 40 ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' :
          'bg-gradient-to-br from-green-50 to-lime-50 border-green-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Overall Disease Risk
            </h3>
            <p className="text-gray-600">
              {overallRisk > 60 ? 'High risk - Take preventive measures' :
               overallRisk > 40 ? 'Moderate risk - Monitor regularly' :
               'Low risk - Continue good practices'}
            </p>
          </div>
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - overallRisk / 100)}`}
                className={overallRisk > 60 ? 'text-red-500' : overallRisk > 40 ? 'text-yellow-500' : 'text-green-500'}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-800">{Math.round(overallRisk)}%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weather Risk Factors */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Weather-Based Risk Factors</h3>
        <div className="space-y-3">
          {weatherRiskFactors.map((factor, index) => (
            <motion.div
              key={factor.factor}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{factor.factor}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(factor.risk)}`}>
                  {factor.risk} Risk
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Current:</span>
                  <span className="ml-2 font-semibold text-gray-800">{factor.current}</span>
                </div>
                <div>
                  <span className="text-gray-600">Optimal:</span>
                  <span className="ml-2 font-semibold text-gray-800">{factor.optimal}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">{factor.impact}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Disease Risks */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Common Diseases</h3>
        <div className="space-y-4">
          {diseases.map((disease, index) => (
            <motion.div
              key={disease.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${disease.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {disease.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{disease.name}</h4>
                    <p className="text-sm text-gray-600">{disease.conditions}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(disease.risk)}`}>
                    {disease.risk} Risk
                  </span>
                  <p className="text-sm font-semibold text-gray-600 mt-1">{disease.probability}%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <InformationCircleIcon className="w-4 h-4 text-blue-600" />
                    <h5 className="text-sm font-semibold text-gray-700">Symptoms</h5>
                  </div>
                  <ul className="space-y-1">
                    {disease.symptoms.map((symptom, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start">
                        <span className="mr-1">•</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <ShieldCheckIcon className="w-4 h-4 text-green-600" />
                    <h5 className="text-sm font-semibold text-gray-700">Prevention</h5>
                  </div>
                  <ul className="space-y-1">
                    {disease.prevention.map((prev, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start">
                        <span className="mr-1">•</span>
                        <span>{prev}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <ExclamationTriangleIcon className="w-4 h-4 text-orange-600" />
                    <h5 className="text-sm font-semibold text-gray-700">Treatment</h5>
                  </div>
                  <p className="text-xs text-gray-600">{disease.treatment}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pest Risks */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Common Pests</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pests.map((pest, index) => (
            <motion.div
              key={pest.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200"
            >
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-3xl">{pest.icon}</span>
                <div>
                  <h4 className="font-bold text-gray-800">{pest.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(pest.risk)}`}>
                    {pest.risk} Risk
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{pest.damage}</p>
              <div>
                <h5 className="text-xs font-semibold text-gray-700 mb-2">Control Methods:</h5>
                <ul className="space-y-1">
                  {pest.control.map((method, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start">
                      <ShieldCheckIcon className="w-3 h-3 text-green-600 mr-1 flex-shrink-0 mt-0.5" />
                      <span>{method}</span>
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
