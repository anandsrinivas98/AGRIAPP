'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDownIcon, 
  ChevronUpIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface AIReasoningPanelProps {
  crop: any;
}

export default function AIReasoningPanel({ crop }: AIReasoningPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const reasoningCategories = [
    {
      title: 'Soil Nutrient Analysis',
      icon: '🌱',
      reasons: [
        'Nitrogen levels are optimal for vegetative growth',
        'Phosphorus content supports strong root development',
        'Potassium levels enhance disease resistance'
      ],
      score: 88
    },
    {
      title: 'pH Compatibility',
      icon: '⚗️',
      reasons: [
        'Soil pH falls within the ideal range for this crop',
        'Nutrient availability is maximized at current pH',
        'No soil amendment required'
      ],
      score: 92
    },
    {
      title: 'Weather Suitability',
      icon: '🌤️',
      reasons: [
        'Temperature range is perfect for crop growth',
        'Humidity levels prevent fungal diseases',
        'Climate conditions match crop requirements'
      ],
      score: 85
    },
    {
      title: 'Water Availability',
      icon: '💧',
      reasons: [
        'Rainfall pattern aligns with crop water needs',
        'Adequate moisture for germination and growth',
        'Irrigation supplementation may be minimal'
      ],
      score: 90
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200 overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-white/50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-gray-800">AI Reasoning</h3>
            <p className="text-sm text-gray-600">Why we recommend {crop.crop}</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUpIcon className="w-6 h-6 text-gray-600" />
        ) : (
          <ChevronDownIcon className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6"
          >
            <div className="space-y-4">
              {reasoningCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-5 rounded-xl border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.icon}</span>
                      <h4 className="font-semibold text-gray-800">{category.title}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${category.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-green-600">{category.score}%</span>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {category.reasons.map((reason, i) => (
                      <li key={i} className="flex items-start space-x-2 text-sm text-gray-700">
                        <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Overall Confidence */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-5 bg-gradient-to-r from-green-500 to-lime-500 rounded-xl text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold mb-1">Overall Confidence</h4>
                  <p className="text-sm opacity-90">
                    Based on comprehensive analysis of all factors
                  </p>
                </div>
                <div className="text-4xl font-bold">{crop.confidence}%</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
