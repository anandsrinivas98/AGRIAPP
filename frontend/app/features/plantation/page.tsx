'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function PlantationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-emerald-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
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
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-600 to-lime-500 rounded-3xl shadow-2xl shadow-green-300 mb-6">
            <span className="text-5xl">🌾</span>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-lime-600 bg-clip-text text-transparent">
            Plantation Guidance
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert advice on plantation techniques, crop selection, and sustainable farming methods coming soon!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
