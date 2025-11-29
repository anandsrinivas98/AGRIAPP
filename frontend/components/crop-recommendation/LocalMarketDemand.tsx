'use client';

import { motion } from 'framer-motion';
import { TruckIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface LocalMarketDemandProps {
  crop: any;
}

export default function LocalMarketDemand({ crop }: LocalMarketDemandProps) {
  const marketData = {
    currentPrice: 2500,
    priceChange: 12.5,
    demand: 'High',
    supply: 'Medium',
    trend: 'increasing',
    seasonalPeak: 'October-December'
  };

  const nearbyMarkets = [
    {
      name: 'City Mandi',
      distance: '15 km',
      price: 2600,
      demand: 'Very High',
      buyers: 45,
      icon: '🏪',
      rating: 4.5
    },
    {
      name: 'District Market',
      distance: '32 km',
      price: 2450,
      demand: 'High',
      buyers: 32,
      icon: '🏬',
      rating: 4.2
    },
    {
      name: 'Wholesale Hub',
      distance: '48 km',
      price: 2700,
      demand: 'Very High',
      buyers: 78,
      icon: '🏭',
      rating: 4.7
    },
    {
      name: 'Export Center',
      distance: '65 km',
      price: 2850,
      demand: 'Medium',
      buyers: 12,
      icon: '✈️',
      rating: 4.3
    }
  ];

  const priceHistory = [
    { month: 'Jan', price: 2200 },
    { month: 'Feb', price: 2150 },
    { month: 'Mar', price: 2300 },
    { month: 'Apr', price: 2400 },
    { month: 'May', price: 2350 },
    { month: 'Jun', price: 2500 }
  ];

  const buyerTypes = [
    {
      type: 'Wholesalers',
      percentage: 45,
      avgPrice: 2550,
      volume: 'High',
      icon: '🏢'
    },
    {
      type: 'Retailers',
      percentage: 30,
      avgPrice: 2650,
      volume: 'Medium',
      icon: '🏪'
    },
    {
      type: 'Food Processors',
      percentage: 15,
      avgPrice: 2400,
      volume: 'High',
      icon: '🏭'
    },
    {
      type: 'Direct Consumers',
      percentage: 10,
      avgPrice: 2800,
      volume: 'Low',
      icon: '👥'
    }
  ];

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'Very High': return 'text-green-700 bg-green-100';
      case 'High': return 'text-lime-700 bg-lime-100';
      case 'Medium': return 'text-yellow-700 bg-yellow-100';
      case 'Low': return 'text-orange-700 bg-orange-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-200"
        >
          <div className="flex items-center space-x-2 mb-2">
            <TruckIcon className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-700">Current Price</h4>
          </div>
          <p className="text-3xl font-bold text-gray-800">₹{marketData.currentPrice}</p>
          <div className="flex items-center space-x-1 mt-1">
            {marketData.priceChange > 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
            )}
            <span className={`text-sm font-semibold ${marketData.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(marketData.priceChange)}% this month
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border-2 border-blue-200"
        >
          <div className="flex items-center space-x-2 mb-2">
            <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-700">Demand</h4>
          </div>
          <p className="text-3xl font-bold text-gray-800">{marketData.demand}</p>
          <p className="text-sm text-gray-600 mt-1">Market demand level</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border-2 border-purple-200"
        >
          <div className="flex items-center space-x-2 mb-2">
            <TruckIcon className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-gray-700">Supply</h4>
          </div>
          <p className="text-3xl font-bold text-gray-800">{marketData.supply}</p>
          <p className="text-sm text-gray-600 mt-1">Current supply level</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-50 to-red-50 p-5 rounded-xl border-2 border-orange-200"
        >
          <div className="flex items-center space-x-2 mb-2">
            <MapPinIcon className="w-5 h-5 text-orange-600" />
            <h4 className="font-semibold text-gray-700">Peak Season</h4>
          </div>
          <p className="text-lg font-bold text-gray-800">{marketData.seasonalPeak}</p>
          <p className="text-sm text-gray-600 mt-1">Best selling period</p>
        </motion.div>
      </div>

      {/* Nearby Markets */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Nearby Markets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nearbyMarkets.map((market, index) => (
            <motion.div
              key={market.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{market.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-800">{market.name}</h4>
                    <p className="text-sm text-gray-600">{market.distance} away</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-semibold text-gray-700">{market.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-600">Price</p>
                  <p className="text-lg font-bold text-green-600">₹{market.price}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Active Buyers</p>
                  <p className="text-lg font-bold text-gray-800">{market.buyers}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDemandColor(market.demand)}`}>
                  {market.demand} Demand
                </span>
                <button className="px-4 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors">
                  Get Directions
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Price Trend */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">6-Month Price Trend</h3>
        <div className="flex items-end justify-between h-48 space-x-2">
          {priceHistory.map((data, index) => {
            const maxPrice = Math.max(...priceHistory.map(d => d.price));
            const height = (data.price / maxPrice) * 100;
            return (
              <motion.div
                key={data.month}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex-1 bg-gradient-to-t from-green-500 to-lime-500 rounded-t-lg relative group"
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    ₹{data.price}
                  </div>
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 font-semibold">
                  {data.month}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Buyer Types */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Buyer Distribution</h3>
        <div className="space-y-4">
          {buyerTypes.map((buyer, index) => (
            <motion.div
              key={buyer.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{buyer.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">{buyer.type}</h4>
                    <p className="text-sm text-gray-600">Avg: ₹{buyer.avgPrice} | Volume: {buyer.volume}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-800">{buyer.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${buyer.percentage}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-green-500 to-lime-500 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
