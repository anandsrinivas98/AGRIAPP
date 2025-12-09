'use client';

import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface CropSuitabilityBreakdownProps {
  crop: any;
  inputData: any;
}

const CropSuitabilityBreakdown = React.memo(function CropSuitabilityBreakdown({ crop, inputData }: CropSuitabilityBreakdownProps) {
  // Calculate suitability scores
  const calculateNPKScore = useCallback(() => {
    const nScore = Math.min((inputData.N / 100) * 100, 100);
    const pScore = Math.min((inputData.P / 100) * 100, 100);
    const kScore = Math.min((inputData.K / 100) * 100, 100);
    return Math.round((nScore + pScore + kScore) / 3);
  }, [inputData.N, inputData.P, inputData.K]);

  const calculatePHScore = useCallback(() => {
    const optimalPH = 6.5;
    const diff = Math.abs(inputData.pH - optimalPH);
    return Math.max(0, Math.round(100 - (diff * 20)));
  }, [inputData.pH]);

  const calculateRainfallScore = useCallback(() => {
    const optimalRainfall = 200;
    const diff = Math.abs(inputData.rainfall - optimalRainfall);
    return Math.max(0, Math.round(100 - (diff / 5)));
  }, [inputData.rainfall]);

  const calculateTempScore = useCallback(() => {
    const optimalTemp = 25;
    const diff = Math.abs(inputData.temperature - optimalTemp);
    return Math.max(0, Math.round(100 - (diff * 5)));
  }, [inputData.temperature]);

  const factors = useMemo(() => [
    {
      name: 'NPK Balance',
      score: calculateNPKScore(),
      explanation: 'Soil nutrient levels match crop requirements',
      icon: '🌱',
      optimal: '60-80 for balanced growth'
    },
    {
      name: 'pH Suitability',
      score: calculatePHScore(),
      explanation: 'Soil acidity/alkalinity is suitable',
      icon: '⚗️',
      optimal: '6.0-7.5 for most crops'
    },
    {
      name: 'Rainfall Match',
      score: calculateRainfallScore(),
      explanation: 'Precipitation meets crop water needs',
      icon: '🌧️',
      optimal: '150-250mm for optimal growth'
    },
    {
      name: 'Temperature Match',
      score: calculateTempScore(),
      explanation: 'Climate temperature is ideal',
      icon: '🌡️',
      optimal: '20-30°C for best results'
    },
    {
      name: 'Soil Type Match',
      score: 85,
      explanation: 'Soil texture and structure are suitable',
      icon: '🏔️',
      optimal: 'Loamy soil preferred'
    }
  ], [calculateNPKScore, calculatePHScore, calculateRainfallScore, calculateTempScore]);

  const overallScore = useMemo(() => 
    Math.round(factors.reduce((sum, f) => sum + f.score, 0) / factors.length),
    [factors]
  );

  const getScoreColor = useCallback((score: number) => {
    if (score >= 75) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  }, []);

  const getProgressColor = useCallback((score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  }, []);

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-50 to-lime-50 p-6 rounded-2xl border-2 border-green-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Overall Suitability Score
            </h3>
            <p className="text-gray-600">
              {crop.crop} is {overallScore >= 75 ? 'highly' : overallScore >= 50 ? 'moderately' : 'marginally'} suitable for your conditions
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
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - overallScore / 100)}`}
                className={overallScore >= 75 ? 'text-green-500' : overallScore >= 50 ? 'text-yellow-500' : 'text-red-500'}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-800">{overallScore}%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Individual Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {factors.map((factor, index) => (
          <motion.div
            key={factor.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-5 rounded-xl border-2 ${getScoreColor(factor.score)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{factor.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-800">{factor.name}</h4>
                  <p className="text-sm text-gray-600">{factor.explanation}</p>
                </div>
              </div>
              <div className="text-2xl font-bold">{factor.score}%</div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${factor.score}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full ${getProgressColor(factor.score)} rounded-full`}
                />
              </div>
            </div>

            {/* Optimal Range */}
            <div className="flex items-center space-x-2 text-sm">
              {factor.score >= 75 ? (
                <CheckCircleIcon className="w-4 h-4 text-green-600" />
              ) : (
                <ExclamationCircleIcon className="w-4 h-4 text-yellow-600" />
              )}
              <span className="text-gray-600">Optimal: {factor.optimal}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

export default CropSuitabilityBreakdown;
