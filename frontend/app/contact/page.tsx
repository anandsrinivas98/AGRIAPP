'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { PhoneIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl shadow-2xl shadow-purple-300 mb-6">
            <PhoneIcon className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you! Our contact page is under construction. For now, reach us at support@agrisense.com
          </p>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-300 hover:shadow-xl transition-all"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to Home</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
