'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { marketDataService } from '@/lib/services/marketDataService';
import { formatINR } from '@/lib/utils/currencyFormatter';
import { MarketOverview as MarketOverviewType } from '@/lib/types/marketData';

const MarketOverview = React.memo(function MarketOverview() {
  const [timeframe, setTimeframe] = useState<'7d' | '30d'>('7d');
  const [priceData, setPriceData] = useState<any[]>([]);
  const [marketMetrics, setMarketMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMarketOverview = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch real market overview data from Indian APIs
      const overview = await marketDataService.getMarketOverview(timeframe);
      
      setPriceData(overview.priceData);
      setMarketMetrics(overview.metrics);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch market overview:', error);
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    fetchMarketOverview();
  }, [fetchMarketOverview]);

  const timeframes = useMemo(() => [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
  ], []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Market Overview</h2>
          <p className="text-base text-gray-600">Real-time commodity prices and market trends</p>
        </div>
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
          {timeframes.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id as '7d' | '30d')}
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                timeframe === tf.id
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-transparent text-gray-700 hover:bg-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketMetrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-white via-white to-gray-50 p-6 rounded-2xl border-2 border-gray-100 shadow-lg hover:shadow-2xl hover:border-green-200 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{metric.name}</h3>
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                metric.sentiment === 'bullish' ? 'bg-green-100 text-green-700' :
                metric.sentiment === 'bearish' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {metric.sentiment}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-gray-900">
                  {formatINR(metric.price)}
                </span>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                  metric.change >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {metric.change >= 0 ? (
                    <ArrowUpIcon className="w-4 h-4" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4" />
                  )}
                  <span className="font-bold text-sm">
                    {Math.abs(metric.change).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600 pt-2 border-t border-gray-100">
                Volume: <span className="text-gray-900 font-semibold">{metric.volume}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border-2 border-gray-200 shadow-xl"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Price Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line type="monotone" dataKey="wheat" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} name="Wheat" />
              <Line type="monotone" dataKey="corn" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }} name="Corn" />
              <Line type="monotone" dataKey="soybeans" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }} name="Soybeans" />
              <Line type="monotone" dataKey="rice" stroke="#06B6D4" strokeWidth={3} dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }} name="Rice" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border-2 border-gray-200 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Market Sentiment</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Overall Market</span>
              <div className="flex items-center space-x-2 text-green-600">
                <ArrowUpIcon className="w-5 h-5" />
                <span className="font-semibold">Bullish</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Trading Volume</span>
              <span className="font-semibold text-gray-900">+15.3%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Active Traders</span>
              <span className="font-semibold text-gray-900">2,847</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border-2 border-gray-200 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Top Movers</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-gray-800">Soybeans</span>
              <div className="flex items-center space-x-2 text-green-600">
                <ArrowUpIcon className="w-4 h-4" />
                <span className="font-semibold">+4.2%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-gray-800">Wheat</span>
              <div className="flex items-center space-x-2 text-green-600">
                <ArrowUpIcon className="w-4 h-4" />
                <span className="font-semibold">+2.3%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="font-medium text-gray-800">Corn</span>
              <div className="flex items-center space-x-2 text-red-600">
                <ArrowDownIcon className="w-4 h-4" />
                <span className="font-semibold">-1.8%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

export default MarketOverview;
