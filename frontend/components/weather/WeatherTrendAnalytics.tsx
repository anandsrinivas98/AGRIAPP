'use client';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';

interface TrendData {
  day: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
}

interface Props {
  trendData: TrendData[];
  insights: {
    temperature: string;
    humidity: string;
    rainfall: string;
    wind: string;
  };
}

export default function WeatherTrendAnalytics({ trendData, insights }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100"
    >
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-4xl">📊</span>
        <h2 className="text-3xl font-bold text-gray-900">Weather Trend Analytics</h2>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🌡️</span>
            <ArrowTrendingUpIcon className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-xs text-red-600 font-semibold mb-1">Temperature Trend</div>
          <div className="text-sm text-red-900 font-medium">{insights.temperature}</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💧</span>
            <ArrowTrendingDownIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-xs text-blue-600 font-semibold mb-1">Humidity Trend</div>
          <div className="text-sm text-blue-900 font-medium">{insights.humidity}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🌧️</span>
            <ArrowTrendingUpIcon className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-xs text-purple-600 font-semibold mb-1">Rainfall Trend</div>
          <div className="text-sm text-purple-900 font-medium">{insights.rainfall}</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💨</span>
            <ArrowTrendingDownIcon className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-xs text-green-600 font-semibold mb-1">Wind Trend</div>
          <div className="text-sm text-green-900 font-medium">{insights.wind}</div>
        </div>
      </div>

      {/* Temperature Trend Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Temperature Pattern (7 Days)</h3>
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" />
              <XAxis dataKey="day" stroke="#9a3412" />
              <YAxis stroke="#9a3412" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff7ed', border: '2px solid #fb923c', borderRadius: '12px' }}
              />
              <Area 
                type="monotone" 
                dataKey="temperature" 
                stroke="#ea580c" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTemp)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Humidity Trend Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Humidity Pattern (7 Days)</h3>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#bfdbfe" />
              <XAxis dataKey="day" stroke="#1e40af" />
              <YAxis stroke="#1e40af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#eff6ff', border: '2px solid #60a5fa', borderRadius: '12px' }}
              />
              <Line 
                type="monotone" 
                dataKey="humidity" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ fill: '#2563eb', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rainfall & Wind Combined Chart */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Rainfall & Wind Pattern (7 Days)</h3>
        <div className="bg-gradient-to-br from-purple-50 to-green-50 rounded-2xl p-6 border border-purple-200">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
              <XAxis dataKey="day" stroke="#6b21a8" />
              <YAxis stroke="#6b21a8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#faf5ff', border: '2px solid #a78bfa', borderRadius: '12px' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="rainfall" 
                stroke="#9333ea" 
                strokeWidth={3}
                name="Rainfall (mm)"
                dot={{ fill: '#9333ea', r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="windSpeed" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Wind Speed (km/h)"
                dot={{ fill: '#10b981', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
