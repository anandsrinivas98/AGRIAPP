'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function LabourAlertsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard">
          <motion.button whileHover={{ scale: 1.05, x: -5 }} whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-orange-700 rounded-xl shadow-md hover:shadow-lg transition-all mb-8 border border-orange-200">
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-semibold">Back to Dashboard</span>
          </motion.button>
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-600 to-amber-500 rounded-3xl shadow-2xl shadow-orange-300 mb-6">
            <span className="text-5xl">🔔</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent">Labour Scheduling & Alerts</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Real-time alerts and labour management system coming soon!</p>
        </motion.div>
      </div>
    </div>
  );
}
