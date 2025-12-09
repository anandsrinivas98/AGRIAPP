'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  SparklesIcon, 
  LightBulbIcon,
  ChartBarIcon,
  SunIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import FeatureCard from '../../../components/FeatureCard';
import CropPlanningIllustration from '../../../components/illustrations/CropPlanningIllustration';

export default function CropPlanningPage() {
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);

  const seasons = [
    {
      id: 'kharif',
      name: 'Kharif Season',
      emoji: '🌧️',
      period: 'June - October',
      description: 'Monsoon crops requiring high rainfall',
      crops: ['Rice', 'Cotton', 'Maize', 'Soybean', 'Groundnut'],
      color: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'rabi',
      name: 'Rabi Season',
      emoji: '❄️',
      period: 'November - March',
      description: 'Winter crops requiring cool climate',
      crops: ['Wheat', 'Barley', 'Mustard', 'Chickpea', 'Lentil'],
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'zaid',
      name: 'Zaid Season',
      emoji: '☀️',
      period: 'March - June',
      description: 'Summer crops requiring warm weather',
      crops: ['Watermelon', 'Cucumber', 'Muskmelon', 'Bitter Gourd'],
      color: 'from-orange-600 to-red-600'
    },
    {
      id: 'perennial',
      name: 'Year-Round',
      emoji: '🌿',
      period: 'All Seasons',
      description: 'Crops that can be grown throughout the year',
      crops: ['Tomato', 'Spinach', 'Coriander', 'Chili', 'Brinjal'],
      color: 'from-green-600 to-lime-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-green-700 rounded-xl shadow-md hover:shadow-lg transition-all mb-8 border border-green-200"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-semibold">Back to Dashboard</span>
          </motion.button>
        </Link>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 mb-16"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-500 rounded-3xl shadow-2xl shadow-green-300 mb-6">
            <span className="text-5xl">📋</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Smart Crop Planning Starts Here
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Transform your growing season with data-driven decisions that boost productivity and sustainability.
          </p>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the tools that help your farm thrive—grow smarter, increase profitability, and build a more sustainable farm, one season at a time.
          </p>
        </motion.div>

        {/* Main Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          <FeatureCard
            badge="Expert Tips"
            icon={<CalendarIcon className="w-6 h-6" />}
            illustration={<CropPlanningIllustration />}
            title="Crop Planning"
            description="Plan your season with confidence and unlock your farm's true potential for a more profitable and sustainable future."
            buttonText="Explore Now"
            href="/features/plantation"
          />
          
          <FeatureCard
            badge="Comprehensive Guide"
            icon={<BeakerIcon className="w-6 h-6" />}
            illustration={
              <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                <span className="text-5xl">📚</span>
              </div>
            }
            title="Complete Planning Strategy"
            description="Access our comprehensive 7-phase planning guide with expert recommendations, decision points, and best practices for every stage."
            buttonText="View Full Guide"
            href="/features/comprehensive-crop-planning"
          />
        </div>

        {/* Related Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Explore More Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              badge="AI Powered"
              icon={<SparklesIcon className="w-6 h-6" />}
              illustration={
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-5xl">🌾</span>
                </div>
              }
              title="Plantation Guidance"
              description="Get expert advice on plantation techniques, crop selection, and sustainable farming methods tailored to your region."
              buttonText="Get Started"
              href="/features/plantation"
              delay={0}
            />

            <FeatureCard
              badge="Smart Farming"
              icon={<LightBulbIcon className="w-6 h-6" />}
              illustration={
                <div className="w-32 h-32 bg-gradient-to-br from-yellow-100 to-green-100 rounded-full flex items-center justify-center">
                  <span className="text-5xl">🌱</span>
                </div>
              }
              title="Crop Recommendation"
              description="Discover the best crops for your soil, climate, and market conditions using AI-powered recommendations."
              buttonText="Discover"
              href="/features/crop-recommendation"
              delay={0.1}
            />

            <FeatureCard
              badge="Analytics"
              icon={<ChartBarIcon className="w-6 h-6" />}
              illustration={
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                  <span className="text-5xl">📊</span>
                </div>
              }
              title="Yield Prediction"
              description="Predict your harvest yields with advanced AI models and optimize your farming operations for maximum output."
              buttonText="Predict Now"
              href="/features/yield-prediction"
              delay={0.2}
            />
          </div>
        </motion.div>

        {/* Seasonal Planning Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Choose Your Growing Season
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Select the season that matches your farming timeline and explore recommended crops for optimal results.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {seasons.map((season, index) => (
              <motion.div
                key={season.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSeason(season.id)}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 ${
                  selectedSeason === season.id ? 'border-green-500' : 'border-transparent'
                }`}
              >
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-4">{season.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-800">{season.name}</h3>
                  <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {season.period}
                  </div>
                  <p className="text-gray-600 text-sm">{season.description}</p>
                  
                  {selectedSeason === season.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      <p className="text-sm font-semibold text-gray-700 mb-2">Recommended Crops:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {season.crops.map((crop) => (
                          <span
                            key={crop}
                            className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                          >
                            {crop}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl p-12 shadow-xl border border-green-100 mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Why Plan Your Crops?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                <ChartBarIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Data-Driven Decisions</h3>
              <p className="text-gray-600 text-sm">Make informed choices based on soil analysis, weather patterns, and market trends.</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Maximize Profitability</h3>
              <p className="text-gray-600 text-sm">Optimize crop selection and resource allocation for better returns on investment.</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Sustainable Practices</h3>
              <p className="text-gray-600 text-sm">Implement eco-friendly farming methods that protect soil health and biodiversity.</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-center text-white shadow-2xl"
        >
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Create a more profitable, efficient, and sustainable future—starting today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/features/plantation">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-green-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Get Plantation Guidance
              </motion.button>
            </Link>
            <Link href="/features/crop-recommendation">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-white"
              >
                Get Crop Recommendations
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
