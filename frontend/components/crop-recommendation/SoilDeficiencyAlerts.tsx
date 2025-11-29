'use client';

import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface SoilDeficiencyAlertsProps {
  soilData: any;
}

export default function SoilDeficiencyAlerts({ soilData }: SoilDeficiencyAlertsProps) {
  const analyzeDeficiencies = () => {
    const alerts = [];

    // Nitrogen analysis
    if (soilData.N < 40) {
      alerts.push({
        nutrient: 'Nitrogen (N)',
        level: 'Low',
        severity: 'high',
        current: soilData.N,
        optimal: '40-60',
        symptoms: ['Yellowing of older leaves', 'Stunted growth', 'Reduced yield'],
        solutions: ['Apply urea or ammonium sulfate', 'Use organic compost', 'Plant nitrogen-fixing cover crops'],
        icon: '🌱'
      });
    } else if (soilData.N > 80) {
      alerts.push({
        nutrient: 'Nitrogen (N)',
        level: 'High',
        severity: 'medium',
        current: soilData.N,
        optimal: '40-60',
        symptoms: ['Excessive vegetative growth', 'Delayed maturity', 'Increased disease susceptibility'],
        solutions: ['Reduce nitrogen fertilizer', 'Plant heavy feeders', 'Improve drainage'],
        icon: '🌱'
      });
    }

    // Phosphorus analysis
    if (soilData.P < 30) {
      alerts.push({
        nutrient: 'Phosphorus (P)',
        level: 'Low',
        severity: 'high',
        current: soilData.P,
        optimal: '30-50',
        symptoms: ['Purple discoloration of leaves', 'Poor root development', 'Delayed flowering'],
        solutions: ['Apply rock phosphate', 'Use bone meal', 'Add superphosphate fertilizer'],
        icon: '⚗️'
      });
    }

    // Potassium analysis
    if (soilData.K < 35) {
      alerts.push({
        nutrient: 'Potassium (K)',
        level: 'Low',
        severity: 'high',
        current: soilData.K,
        optimal: '35-55',
        symptoms: ['Brown leaf edges', 'Weak stems', 'Poor disease resistance'],
        solutions: ['Apply potash fertilizer', 'Use wood ash', 'Add kelp meal'],
        icon: '💎'
      });
    }

    // pH analysis
    if (soilData.pH < 5.5) {
      alerts.push({
        nutrient: 'pH Level',
        level: 'Too Acidic',
        severity: 'high',
        current: soilData.pH,
        optimal: '6.0-7.5',
        symptoms: ['Nutrient lockout', 'Aluminum toxicity', 'Poor microbial activity'],
        solutions: ['Apply agricultural lime', 'Use dolomite', 'Add wood ash'],
        icon: '🧪'
      });
    } else if (soilData.pH > 8.0) {
      alerts.push({
        nutrient: 'pH Level',
        level: 'Too Alkaline',
        severity: 'high',
        current: soilData.pH,
        optimal: '6.0-7.5',
        symptoms: ['Iron deficiency', 'Manganese deficiency', 'Reduced nutrient availability'],
        solutions: ['Apply sulfur', 'Use acidifying fertilizers', 'Add organic matter'],
        icon: '🧪'
      });
    }

    return alerts;
  };

  const alerts = analyzeDeficiencies();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'from-red-500 to-orange-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (alerts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Soil Health: Excellent</h3>
            <p className="text-gray-600">All nutrient levels are within optimal range</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-2xl border-2 border-orange-200"
      >
        <div className="flex items-center space-x-3">
          <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
          <div>
            <h3 className="text-lg font-bold text-gray-800">Soil Deficiency Alerts</h3>
            <p className="text-sm text-gray-600">{alerts.length} issue{alerts.length > 1 ? 's' : ''} detected that need attention</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4">
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.nutrient}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-5 rounded-2xl border-2 ${getSeverityBg(alert.severity)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${getSeverityColor(alert.severity)} rounded-xl flex items-center justify-center text-2xl`}>
                  {alert.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800">{alert.nutrient}</h4>
                  <p className="text-sm text-gray-600">
                    Current: <span className="font-semibold">{alert.current}</span> | 
                    Optimal: <span className="font-semibold">{alert.optimal}</span>
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                alert.severity === 'high' ? 'bg-red-600 text-white' :
                alert.severity === 'medium' ? 'bg-yellow-600 text-white' :
                'bg-blue-600 text-white'
              }`}>
                {alert.level}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Symptoms */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <InformationCircleIcon className="w-5 h-5 text-gray-600" />
                  <h5 className="font-semibold text-gray-700">Symptoms</h5>
                </div>
                <ul className="space-y-1">
                  {alert.symptoms.map((symptom, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solutions */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <h5 className="font-semibold text-gray-700">Recommended Actions</h5>
                </div>
                <ul className="space-y-1">
                  {alert.solutions.map((solution, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start">
                      <CheckCircleIcon className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
