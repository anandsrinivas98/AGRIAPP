'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CropPlanningPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard">
          <motion.button whileHover={{ scale: 1.05, x: -5 }} whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all mb-8 border border-blue-200">
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-semibold">Back to Dashboard</span>
          </motion.button>
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-3xl shadow-2xl shadow-blue-300 mb-6">
            <span className="text-5xl">📅</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Crop Planning</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Strategic crop planning with interactive calendar coming soon!</p>
        </motion.div>
      </div>
    </div>
  );
}
