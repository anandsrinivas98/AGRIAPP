'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export default function MarketAnalytics() {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30d');
  const [priceHistory, setPriceHistory] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [marketShare, setMarketShare] = useState([]);
  const [insights, setInsights] = useState([]);

  const COLORS = ['#10B981', '#F59E0B', '#8B5CF6', '#06B6D4', '#EF4444'];

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const days = timeframe === '7d' ? 7 : 30;
      const mockPriceHistory = Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        wheat: 250 + Math.random() * 50,
        corn: 180 + Math.random() * 30,
        soybeans: 420 + Math.random() * 80,
      }));

      const mockVolumeData = [
        { crop: 'Wheat', volume: 1200000, value: 330000000 },
        { crop: 'Corn', volume: 2100000, value: 410000000 },
        { crop: 'Soybeans', volume: 850000, value: 395000000 },
        { crop: 'Rice', volume: 1800000, value: 613000000 },
        { crop: 'Cotton', volume: 650000, value: 53600000 },
      ];

      const mockMarketShare = [
        { name: 'Wheat', value: 22 },
        { name: 'Corn', value: 35 },
        { name: 'Soybeans', value: 18 },
        { name: 'Rice', value: 15 },
        { name: 'Others', value: 10 },
      ];

      const mockInsights = [
        {
          id: 1,
          title: 'Wheat Prices Trending Up',
          description: 'Wheat prices have increased by 8.5% over the last 30 days due to strong export demand.',
          trend: 'up',
          impact: 'high',
          percentage: 8.5
        },
        {
          id: 2,
          title: 'Corn Volume Surge',
          description: 'Trading volume for corn has reached record highs with 2.1M tons traded this month.',
          trend: 'up',
          impact: 'medium',
          percentage: 15.3
        },
        {
          id: 3,
          title: 'Soybean Market Stabilizing',
          description: 'After recent volatility, soybean prices are showing signs of stabilization.',
          trend: 'neutral',
          impact: 'low',
          percentage: 1.2
        }
      ];

      setPriceHistory(mockPriceHistory);
      setVolumeData(mockVolumeData);
      setMarketShare(mockMarketShare);
      setInsights(mockInsights);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Market Analytics</h2>
          <p className="text-gray-600">Comprehensive market insights and trends</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe('7d')}
            className={`px-4 py-2 rounded-lg transition-all ${
              timeframe === '7d' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeframe('30d')}
            className={`px-4 py-2 rounded-lg transition-all ${
              timeframe === '30d' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <ChartBarIcon className="w-8 h-8" />
            <ArrowUpIcon className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold mb-2">$1.8B</div>
          <div className="text-green-100">Total Market Value</div>
          <div className="mt-2 text-sm">+12.5% from last month</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <CurrencyDollarIcon className="w-8 h-8" />
            <ArrowUpIcon className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold mb-2">6.6M</div>
          <div className="text-blue-100">Total Volume (tons)</div>
          <div className="mt-2 text-sm">+8.3% from last month</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <ChartBarIcon className="w-8 h-8" />
            <ArrowUpIcon className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold mb-2">2,847</div>
          <div className="text-purple-100">Active Traders</div>
          <div className="mt-2 text-sm">+15.7% from last month</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Price Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="wheat" stroke="#10B981" strokeWidth={2} name="Wheat" />
                <Line type="monotone" dataKey="corn" stroke="#F59E0B" strokeWidth={2} name="Corn" />
                <Line type="monotone" dataKey="soybeans" stroke="#8B5CF6" strokeWidth={2} name="Soybeans" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Market Share</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marketShare}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {marketShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Trading Volume by Commodity</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="crop" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px'
                }}
              />
              <Legend />
              <Bar dataKey="volume" fill="#10B981" name="Volume (tons)" />
              <Bar dataKey="value" fill="#06B6D4" name="Value ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Market Insights</h3>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className={`p-4 rounded-xl border-l-4 ${
                insight.trend === 'up' ? 'border-green-500 bg-green-50' :
                insight.trend === 'down' ? 'border-red-500 bg-red-50' :
                'border-gray-500 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                    {insight.trend === 'up' ? (
                      <ArrowUpIcon className="w-5 h-5 text-green-600" />
                    ) : insight.trend === 'down' ? (
                      <ArrowDownIcon className="w-5 h-5 text-red-600" />
                    ) : null}
                  </div>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </div>
                <div className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold ${
                  insight.trend === 'up' ? 'bg-green-100 text-green-800' :
                  insight.trend === 'down' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {insight.trend === 'up' ? '+' : ''}{insight.percentage}%
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
