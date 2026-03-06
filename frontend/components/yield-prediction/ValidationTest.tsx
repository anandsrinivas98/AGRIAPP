// Simple test component to verify validation styling works correctly
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function ValidationTest() {
  const [testValue, setTestValue] = useState('');
  const [hasError, setHasError] = useState(false);
  const [hasWarning, setHasWarning] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTestValue(value);
    
    const numValue = parseFloat(value);
    if (value && isNaN(numValue)) {
      setHasError(true);
      setHasWarning(false);
    } else if (numValue > 100) {
      setHasError(true);
      setHasWarning(false);
    } else if (numValue > 80) {
      setHasError(false);
      setHasWarning(true);
    } else {
      setHasError(false);
      setHasWarning(false);
    }
  };

  const getInputClassName = () => {
    const baseClasses = "w-full px-4 py-3 border-2 rounded-xl focus:ring-4 outline-none transition-all";
    
    if (hasError) {
      return `${baseClasses} border-red-300 focus:border-red-500 focus:ring-red-100`;
    } else if (hasWarning) {
      return `${baseClasses} border-yellow-300 focus:border-yellow-500 focus:ring-yellow-100`;
    }
    return `${baseClasses} border-gray-200 focus:border-green-500 focus:ring-green-100`;
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md">
      <h3 className="text-lg font-bold mb-4">Validation Test</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Test Field (0-100) <span className="text-xs text-gray-500">Try values like 150, 90, 50</span>
        </label>
        <input
          type="number"
          value={testValue}
          onChange={handleChange}
          placeholder="Enter a number"
          className={getInputClassName()}
        />
        
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-1 mt-1"
          >
            <ExclamationTriangleIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-red-600 text-xs">Value cannot exceed 100</p>
          </motion.div>
        )}
        
        {hasWarning && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-1 mt-1"
          >
            <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500 flex-shrink-0" />
            <p className="text-yellow-600 text-xs">High value - please verify</p>
          </motion.div>
        )}
        
        {!hasError && !hasWarning && testValue && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-1 mt-1"
          >
            <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
            <p className="text-green-600 text-xs">Valid value</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}