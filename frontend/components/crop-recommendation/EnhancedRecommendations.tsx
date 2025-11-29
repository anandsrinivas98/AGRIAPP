'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CropSuitabilityBreakdown from './CropSuitabilityBreakdown';
import CropComparisonMatrix from './CropComparisonMatrix';
import CropCalendar from './CropCalendar';
import AIReasoningPanel from './AIReasoningPanel';
import InputCostEstimator from './InputCostEstimator';
import WaterRequirementAnalyzer from './WaterRequirementAnalyzer';
import SoilDeficiencyAlerts from './SoilDeficiencyAlerts';
import GovernmentSubsidyInsights from './GovernmentSubsidyInsights';
import OrganicFarmingSuitability from './OrganicFarmingSuitability';
import LocalMarketDemand from './LocalMarketDemand';
import DiseaseRiskPreview from './DiseaseRiskPreview';
import DownloadReportButton from './DownloadReportButton';
import {
  ChartBarIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  BeakerIcon,
  ShieldCheckIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

interface EnhancedRecommendationsProps {
  recommendations: any[];
  inputData: any;
  soilData: any;
}

export default function EnhancedRecommendations({ 
  recommendations, 
  inputData,
  soilData 
}: EnhancedRecommendationsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCrop, setSelectedCrop] = useState(recommendations[0]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'comparison', name: 'Compare Crops', icon: ChartBarIcon },
    { id: 'calendar', name: 'Crop Calendar', icon: CalendarIcon },
    { id: 'costs', name: 'Cost Analysis', icon: CurrencyDollarIcon },
    { id: 'water', name: 'Water Needs', icon: BeakerIcon },
    { id: 'subsidies', name: 'Subsidies', icon: ShieldCheckIcon },
    { id: 'market', name: 'Market Info', icon: TruckIcon },
    { id: 'risks', name: 'Risk Analysis', icon: ExclamationTriangleIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Soil Deficiency Alerts - Always visible at top */}
      <SoilDeficiencyAlerts soilData={soilData} />

      {/* Download Report Button */}
      <div className="flex justify-end">
        <DownloadReportButton 
          recommendations={recommendations}
          inputData={inputData}
          soilData={soilData}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-b-2 border-green-600 text-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <CropSuitabilityBreakdown 
                    crop={selectedCrop}
                    inputData={inputData}
                  />
                  <AIReasoningPanel crop={selectedCrop} />
                  <OrganicFarmingSuitability crop={selectedCrop} />
                </div>
              )}

              {activeTab === 'comparison' && (
                <CropComparisonMatrix 
                  crops={recommendations.slice(0, 5)}
                  onSelectCrop={setSelectedCrop}
                />
              )}

              {activeTab === 'calendar' && (
                <CropCalendar crop={selectedCrop} />
              )}

              {activeTab === 'costs' && (
                <InputCostEstimator crop={selectedCrop} />
              )}

              {activeTab === 'water' && (
                <WaterRequirementAnalyzer 
                  crop={selectedCrop}
                  rainfall={inputData.rainfall}
                  humidity={inputData.humidity}
                />
              )}

              {activeTab === 'subsidies' && (
                <GovernmentSubsidyInsights crop={selectedCrop} />
              )}

              {activeTab === 'market' && (
                <LocalMarketDemand crop={selectedCrop} />
              )}

              {activeTab === 'risks' && (
                <DiseaseRiskPreview 
                  crop={selectedCrop}
                  weather={inputData}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
