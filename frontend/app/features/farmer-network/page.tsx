'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function FarmerNetworkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard">
          <motion.button whileHover={{ scale: 1.05, x: -5 }} whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all mb-8 border border-indigo-200">
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-semibold">Back to Dashboard</span>
          </motion.button>
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-3xl shadow-2xl shadow-indigo-300 mb-6">
            <span className="text-5xl">🤝</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent">Farmer Connection</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Connect with fellow farmers and share experiences coming soon!</p>
        </motion.div>
      </div>
    </div>
  );
}
