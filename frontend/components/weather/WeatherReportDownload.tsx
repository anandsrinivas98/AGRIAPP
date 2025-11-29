'use client';
import { motion } from 'framer-motion';
import { DocumentArrowDownIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface Props {
  weatherData: any;
  location: string;
}

export default function WeatherReportDownload({ weatherData, location }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      
      // Reset after 3 seconds
      setTimeout(() => setDownloaded(false), 3000);
    }, 2000);

    // In real implementation, this would generate and download a PDF
    // using a library like jsPDF or calling a backend endpoint
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100"
    >
      <div className="flex items-center space-x-3 mb-6">
        <DocumentArrowDownIcon className="w-8 h-8 text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-900">Weather Advisory Report</h2>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-4">Report Includes:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <CheckCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-900 text-sm">Current Weather</div>
              <div className="text-xs text-blue-700">Real-time conditions and metrics</div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-900 text-sm">Weekly Forecast</div>
              <div className="text-xs text-blue-700">7-14 day predictions</div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-900 text-sm">Crop Recommendations</div>
              <div className="text-xs text-blue-700">Personalized farming advice</div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-900 text-sm">Weather Alerts</div>
              <div className="text-xs text-blue-700">Active warnings and advisories</div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-900 text-sm">Irrigation Advice</div>
              <div className="text-xs text-blue-700">Water management tips</div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-900 text-sm">Soil Analysis</div>
              <div className="text-xs text-blue-700">Weather impact on soil</div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Details */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Location:</span>
            <span className="ml-2 font-semibold text-gray-900">{location}</span>
          </div>
          <div>
            <span className="text-gray-600">Generated:</span>
            <span className="ml-2 font-semibold text-gray-900">{new Date().toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Format:</span>
            <span className="ml-2 font-semibold text-gray-900">PDF</span>
          </div>
          <div>
            <span className="text-gray-600">Pages:</span>
            <span className="ml-2 font-semibold text-gray-900">~5-7 pages</span>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownload}
        disabled={downloading || downloaded}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center space-x-3 ${
          downloaded
            ? 'bg-green-500 text-white'
            : downloading
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {downloaded ? (
          <>
            <CheckCircleIcon className="w-6 h-6" />
            <span>Report Downloaded!</span>
          </>
        ) : downloading ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
            <span>Generating Report...</span>
          </>
        ) : (
          <>
            <DocumentArrowDownIcon className="w-6 h-6" />
            <span>Download Weather Report</span>
          </>
        )}
      </motion.button>

      <p className="text-xs text-gray-500 text-center mt-4">
        The report will be saved as a PDF file with all weather insights and recommendations
      </p>
    </motion.div>
  );
}
