'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AgriSense Demo
            </h1>
            <p className="text-xl text-gray-600">
              Experience the power of AI-driven agriculture
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Interactive Demo Features
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-primary-50 rounded-lg border-2 border-primary-200">
                <h3 className="text-lg font-semibold text-primary-900 mb-2">
                  🌾 Crop Recommendation
                </h3>
                <p className="text-primary-700 mb-4">
                  AI-powered crop suggestions based on soil conditions, weather, and market demand
                </p>
                <div className="text-sm text-primary-600 font-medium">
                  ✨ Sign up to access this feature
                </div>
              </div>

              <div className="p-6 bg-green-50 rounded-lg border-2 border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  🔍 Disease Detection
                </h3>
                <p className="text-green-700 mb-4">
                  Upload plant images to detect diseases and get treatment recommendations
                </p>
                <div className="text-sm text-green-600 font-medium">
                  ✨ Sign up to access this feature
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  🌤️ Weather Integration
                </h3>
                <p className="text-blue-700 mb-4">
                  Real-time weather data and forecasts for better farming decisions
                </p>
                <div className="text-sm text-blue-600 font-medium">
                  ✨ Sign up to access this feature
                </div>
              </div>

              <div className="p-6 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  💰 Market Analysis
                </h3>
                <p className="text-yellow-700 mb-4">
                  Track crop prices and get market insights for better profits
                </p>
                <div className="text-sm text-yellow-600 font-medium">
                  ✨ Sign up to access this feature
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-6">
              Join thousands of farmers already using AgriSense
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}