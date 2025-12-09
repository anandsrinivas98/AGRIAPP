'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import CropGuide from '../../../components/crop-guide';
import { sampleCropData } from '../../../data/sample-crop-data';
import { cropGuideService, CropGuideData } from '../../../services/cropGuideService';

export default function PlantationPage() {
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [cropGuideData, setCropGuideData] = useState<CropGuideData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [popularCrops, setPopularCrops] = useState<string[]>([]);

  // Load popular crops on component mount
  useEffect(() => {
    loadPopularCrops();
  }, []);

  const loadPopularCrops = async () => {
    try {
      const crops = await cropGuideService.getPopularCrops();
      setPopularCrops(crops);
    } catch (error) {
      console.error('Failed to load popular crops:', error);
    }
  };

  const handleCropSelection = async (cropId: string, cropName: string) => {
    setSelectedCrop(cropId);
    setLoading(true);
    setError(null);
    setCropGuideData(null);

    try {
      // Try to generate AI-powered crop guide
      const aiCropGuide = await cropGuideService.quickGenerateCropGuide(cropName);
      setCropGuideData(aiCropGuide);
    } catch (error: any) {
      console.error('Failed to generate AI crop guide:', error);
      setError(error.message);
      
      // Fallback to sample data for demonstration
      if (cropId === 'rice') {
        setCropGuideData(sampleCropData);
      } else {
        // Create basic fallback data
        setCropGuideData({
          ...sampleCropData,
          name: cropName,
          introduction: `${cropName} is an important crop. AI-generated guide is temporarily unavailable. Please try again later.`
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const cropOptions = [
    { id: 'rice', name: 'Rice (Paddy)', emoji: '🌾', season: 'Kharif', difficulty: 'Medium' },
    { id: 'wheat', name: 'Wheat', emoji: '🌾', season: 'Rabi', difficulty: 'Easy' },
    { id: 'maize', name: 'Maize (Corn)', emoji: '🌽', season: 'Kharif/Rabi', difficulty: 'Medium' },
    { id: 'tomato', name: 'Tomato', emoji: '🍅', season: 'Year-round', difficulty: 'Medium' }
  ];

  if (selectedCrop) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b px-4 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedCrop(null);
                setCropGuideData(null);
                setError(null);
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="font-semibold">Back to Crop Selection</span>
            </button>
            <Link href="/dashboard">
              <button className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="font-semibold">Dashboard</span>
              </button>
            </Link>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600">Generating AI-powered crop guide...</p>
            </div>
          </div>
        )}

        {error && cropGuideData && (
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-blue-500">ℹ️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Showing Basic Crop Information
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>AI-generated detailed guide is temporarily unavailable. Displaying general cultivation guidelines for {cropGuideData.name}.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {cropGuideData && <CropGuide cropData={cropGuideData} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-emerald-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 mb-12"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-600 to-lime-500 rounded-3xl shadow-2xl shadow-green-300 mb-6">
            <span className="text-5xl">🌾</span>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-lime-600 bg-clip-text text-transparent">
            Plantation Guidance
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Receive expert advice on plantation techniques, crop selection, and sustainable farming methods.
          </p>
        </motion.div>

        {/* Custom Crop Input */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Generate Guide for Any Crop
          </h2>
          <div className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter crop name (e.g., Mango, Chili, Cabbage)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    if (input.value.trim()) {
                      handleCropSelection('custom', input.value.trim());
                      input.value = '';
                    }
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                  if (input?.value.trim()) {
                    handleCropSelection('custom', input.value.trim());
                    input.value = '';
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-lime-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-lime-700 transition-all"
              >
                Generate
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Powered by AI - Get expert guidance for any crop
            </p>
          </div>
        </motion.div>

        {/* Popular Crops Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {cropOptions.map((crop, index) => (
            <motion.div
              key={crop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCropSelection(crop.id, crop.name)}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-green-100 hover:border-green-300"
            >
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">{crop.emoji}</div>
                <h3 className="text-xl font-bold text-gray-800">{crop.name}</h3>
                <div className="space-y-2">
                  <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {crop.season}
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ml-2 ${
                    crop.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    crop.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {crop.difficulty}
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-green-600 to-lime-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-lime-700 transition-all">
                  View Guide
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-green-100"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            What You'll Learn
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Seed Selection & Sowing</h3>
              <p className="text-gray-600 text-sm">Learn about high-yield varieties, seed treatment, and optimal sowing techniques.</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">💧</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Irrigation & Nutrition</h3>
              <p className="text-gray-600 text-sm">Master water management and fertilizer schedules for maximum productivity.</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Pest & Disease Control</h3>
              <p className="text-gray-600 text-sm">Identify and manage pests and diseases using integrated pest management.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
