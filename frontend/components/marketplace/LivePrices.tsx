'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpIcon,
  ArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface CommodityPrice {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: string;
  category: string;
  lastUpdated: string;
}

export default function LivePrices() {
  const [prices, setPrices] = useState<CommodityPrice[]>([]);
  const [filteredPrices, setFilteredPrices] = useState<CommodityPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const categories = ['all', 'grains', 'oilseeds', 'livestock', 'dairy', 'fruits'];

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterAndSortPrices();
  }, [prices, searchTerm, selectedCategory, sortConfig]);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      
      // Set data immediately for faster render
      const mockPrices: CommodityPrice[] = [
        { id: '1', name: 'Wheat', symbol: 'WHEAT', currentPrice: 275.50, change: 6.30, changePercent: 2.34, high24h: 280.00, low24h: 268.20, volume: '1.2M tons', category: 'grains', lastUpdated: new Date().toISOString() },
        { id: '2', name: 'Corn', symbol: 'CORN', currentPrice: 195.75, change: -3.50, changePercent: -1.76, high24h: 201.25, low24h: 194.80, volume: '2.1M tons', category: 'grains', lastUpdated: new Date().toISOString() },
        { id: '3', name: 'Soybeans', symbol: 'SOY', currentPrice: 465.20, change: 18.75, changePercent: 4.20, high24h: 470.00, low24h: 445.50, volume: '850K tons', category: 'oilseeds', lastUpdated: new Date().toISOString() },
        { id: '4', name: 'Rice', symbol: 'RICE', currentPrice: 340.80, change: 3.10, changePercent: 0.92, high24h: 345.00, low24h: 335.20, volume: '1.8M tons', category: 'grains', lastUpdated: new Date().toISOString() },
        { id: '5', name: 'Cotton', symbol: 'COTTON', currentPrice: 82.45, change: -1.25, changePercent: -1.49, high24h: 84.20, low24h: 81.80, volume: '650K bales', category: 'oilseeds', lastUpdated: new Date().toISOString() },
        { id: '6', name: 'Sugar', symbol: 'SUGAR', currentPrice: 19.85, change: 0.45, changePercent: 2.32, high24h: 20.10, low24h: 19.20, volume: '2.3M tons', category: 'grains', lastUpdated: new Date().toISOString() }
      ];
      
      setPrices(mockPrices);
      setLastRefresh(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch prices:', error);
      setLoading(false);
    }
  };

  const filterAndSortPrices = () => {
    let filtered = prices.filter(price => {
      const matchesSearch = price.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           price.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || price.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof CommodityPrice];
      const bValue = b[sortConfig.key as keyof CommodityPrice];
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      if (sortConfig.direction === 'asc') {
        return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
      } else {
        return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
      }
    });

    setFilteredPrices(filtered);
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Live Commodity Prices</h2>
          <p className="text-base text-gray-600">Last updated: {lastRefresh.toLocaleTimeString()}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchPrices}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          <ArrowPathIcon className="w-5 h-5" />
          <span>Refresh Prices</span>
        </motion.button>
      </div>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search commodities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <FunnelIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th onClick={() => handleSort('name')} className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors">
                  Commodity {getSortIcon('name')}
                </th>
                <th onClick={() => handleSort('currentPrice')} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  Current Price {getSortIcon('currentPrice')}
                </th>
                <th onClick={() => handleSort('changePercent')} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  Change % {getSortIcon('changePercent')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  24h High/Low
                </th>
                <th onClick={() => handleSort('volume')} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  Volume {getSortIcon('volume')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrices.map((price, index) => (
                <motion.tr
                  key={price.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{price.name}</div>
                      <div className="text-sm text-gray-500">{price.symbol}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">${price.currentPrice.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center space-x-1 ${price.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {price.changePercent >= 0 ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                      <span className="text-sm font-semibold">{Math.abs(price.changePercent).toFixed(2)}%</span>
                    </div>
                    <div className={`text-xs ${price.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {price.change >= 0 ? '+' : ''}{price.change.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${price.high24h.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">${price.low24h.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{price.volume}</div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPrices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No commodities found matching your criteria</div>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl border-2 border-green-200 shadow-lg">
          <div className="text-sm font-semibold text-gray-600 mb-2">Total Volume</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">8.6M tons</div>
          <div className="text-sm font-medium text-green-600">+12.3% from yesterday</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border-2 border-blue-200 shadow-lg">
          <div className="text-sm font-semibold text-gray-600 mb-2">Active Markets</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">24</div>
          <div className="text-sm font-medium text-blue-600">Across 12 countries</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border-2 border-purple-200 shadow-lg">
          <div className="text-sm font-semibold text-gray-600 mb-2">Avg. Price Change</div>
          <div className="text-3xl font-bold text-green-600 mb-1">+1.8%</div>
          <div className="text-sm font-medium text-gray-600">Last 24 hours</div>
        </div>
      </div>
    </div>
  );
}
