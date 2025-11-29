'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import PageHeader from '@/components/shared/PageHeader';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  TruckIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';

// Loading component
const LoadingSpinner = () => (
  <div className="p-8 flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading marketplace data...</p>
    </div>
  </div>
);

// Dynamic imports with loading states
const MarketOverview = dynamic(() => import('@/components/marketplace/MarketOverview'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

const LivePrices = dynamic(() => import('@/components/marketplace/LivePrices'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

const EquipmentMarketplace = dynamic(() => import('@/components/marketplace/EquipmentMarketplace'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

const CropTrading = dynamic(() => import('@/components/marketplace/CropTrading'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

const SupplierDirectory = dynamic(() => import('@/components/marketplace/SupplierDirectory'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

const MarketAnalytics = dynamic(() => import('@/components/marketplace/MarketAnalytics'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'overview', name: 'Market Overview', icon: ChartBarIcon },
    { id: 'prices', name: 'Live Prices', icon: CurrencyDollarIcon },
    { id: 'equipment', name: 'Equipment', icon: TruckIcon },
    { id: 'trading', name: 'Crop Trading', icon: BuildingStorefrontIcon },
    { id: 'suppliers', name: 'Suppliers', icon: MapPinIcon },
    { id: 'analytics', name: 'Analytics', icon: PresentationChartLineIcon },
  ];

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      // Fetch market status immediately
      setMarketData({
        lastUpdated: new Date().toISOString(),
        status: 'active'
      });
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <MarketOverview />;
      case 'prices':
        return <LivePrices />;
      case 'equipment':
        return <EquipmentMarketplace />;
      case 'trading':
        return <CropTrading />;
      case 'suppliers':
        return <SupplierDirectory />;
      case 'analytics':
        return <MarketAnalytics />;
      default:
        return <MarketOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Agricultural Marketplace"
          description="Real-time market data, equipment trading, and supplier connections"
          icon="🏪"
          backLink="/dashboard"
        />

        {/* Market Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-white rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Market Active</span>
              </div>
              {marketData && (
                <div className="text-sm text-gray-500">
                  Last updated: {new Date(marketData.lastUpdated).toLocaleTimeString()}
                </div>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchMarketData}
              disabled={loading}
              className="mt-2 sm:mt-0 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </motion.button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
            <nav className="flex space-x-2 overflow-x-auto scrollbar-hide" aria-label="Tabs">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-transparent text-gray-600 hover:bg-gray-100'
                  } whitespace-nowrap py-3 px-4 rounded-xl font-semibold text-sm flex items-center space-x-2 transition-all duration-200`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </motion.button>
              ))}
            </nav>
          </div>
        </div>

        {/* Active Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 min-h-[600px] overflow-hidden"
        >
          {renderActiveTab()}
        </motion.div>
      </div>
    </div>
  );
}
