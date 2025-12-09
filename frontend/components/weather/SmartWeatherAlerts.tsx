'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExclamationTriangleIcon,
  BoltIcon,
  CloudIcon,
  FireIcon,
  BeakerIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';

interface WeatherAlert {
  id: string;
  type: 'heavy-rain' | 'thunderstorm' | 'cyclone' | 'heatwave' | 'coldwave' | 'high-humidity' | 'drought' | 'high-wind';
  severity: 'low' | 'moderate' | 'high';
  title: string;
  message: string;
  actionableTips: string[];
  timestamp: string;
  icon: string;
}

interface Props {
  alerts: WeatherAlert[];
}

const SmartWeatherAlerts = React.memo(function SmartWeatherAlerts({ alerts }: Props) {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const getSeverityStyle = useCallback((severity: string) => {
    switch (severity) {
      case 'low':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-400',
          text: 'text-blue-900',
          badge: 'bg-blue-500 text-white',
          icon: 'text-blue-600'
        };
      case 'moderate':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-400',
          text: 'text-yellow-900',
          badge: 'bg-yellow-500 text-white',
          icon: 'text-yellow-600'
        };
      case 'high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-400',
          text: 'text-red-900',
          badge: 'bg-red-500 text-white',
          icon: 'text-red-600'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-400',
          text: 'text-gray-900',
          badge: 'bg-gray-500 text-white',
          icon: 'text-gray-600'
        };
    }
  }, []);

  const getAlertIcon = useCallback((type: string) => {
    switch (type) {
      case 'heavy-rain':
        return '🌧️';
      case 'thunderstorm':
        return '⛈️';
      case 'cyclone':
        return '🌀';
      case 'heatwave':
        return '🔥';
      case 'coldwave':
        return '❄️';
      case 'high-humidity':
        return '💧';
      case 'drought':
        return '🏜️';
      case 'high-wind':
        return '💨';
      default:
        return '⚠️';
    }
  }, []);

  const handleDismiss = useCallback((alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  }, []);

  const activeAlerts = useMemo(() => 
    alerts.filter(alert => !dismissedAlerts.includes(alert.id)),
    [alerts, dismissedAlerts]
  );

  const severityCounts = useMemo(() => ({
    low: activeAlerts.filter(a => a.severity === 'low').length,
    moderate: activeAlerts.filter(a => a.severity === 'moderate').length,
    high: activeAlerts.filter(a => a.severity === 'high').length
  }), [activeAlerts]);

  if (activeAlerts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50 rounded-3xl shadow-xl p-8 border-2 border-green-200"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-green-900 mb-2">All Clear!</h3>
          <p className="text-green-700">No weather alerts at this time. Conditions are favorable for farming.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100"
    >
      <div className="flex items-center space-x-3 mb-6">
        <ExclamationTriangleIcon className="w-8 h-8 text-orange-600" />
        <h2 className="text-3xl font-bold text-gray-900">Weather Alerts</h2>
        <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
          {activeAlerts.length}
        </span>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {activeAlerts.map((alert, index) => {
            const style = getSeverityStyle(alert.severity);
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.1 * index }}
                className={`${style.bg} border-2 ${style.border} rounded-2xl p-6 relative`}
              >
                {/* Dismiss Button */}
                <button
                  onClick={() => handleDismiss(alert.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>

                {/* Alert Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="text-5xl">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`text-xl font-bold ${style.text}`}>{alert.title}</h3>
                      <span className={`${style.badge} text-xs font-bold px-3 py-1 rounded-full uppercase`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className={`${style.text} text-sm mb-2`}>{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.timestamp}</p>
                  </div>
                </div>

                {/* Actionable Tips */}
                {alert.actionableTips.length > 0 && (
                  <div className={`bg-white/60 rounded-xl p-4 border ${style.border}`}>
                    <h4 className={`font-bold ${style.text} mb-3 text-sm`}>
                      📋 Recommended Actions:
                    </h4>
                    <ul className="space-y-2">
                      {alert.actionableTips.map((tip, idx) => (
                        <li key={idx} className={`text-sm ${style.text} flex items-start space-x-2`}>
                          <span className="font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
          <div className="text-2xl font-bold text-blue-700">
            {severityCounts.low}
          </div>
          <div className="text-xs text-blue-600 font-semibold">Low Severity</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 text-center border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-700">
            {severityCounts.moderate}
          </div>
          <div className="text-xs text-yellow-600 font-semibold">Moderate</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
          <div className="text-2xl font-bold text-red-700">
            {severityCounts.high}
          </div>
          <div className="text-xs text-red-600 font-semibold">High Severity</div>
        </div>
      </div>
    </motion.div>
  );
});

export default SmartWeatherAlerts;
