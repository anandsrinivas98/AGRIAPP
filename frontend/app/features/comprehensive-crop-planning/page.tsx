'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ComprehensiveCropPlanning from '../../../components/crop planning/page';

export default function ComprehensiveCropPlanningPage() {
  return (
    <div>
      <div className="bg-white shadow-sm border-b px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/features/crop-planning">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl shadow-md hover:shadow-lg hover:bg-green-700 transition-all"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="font-semibold">Back to Crop Planning</span>
            </motion.button>
          </Link>
        </div>
      </div>
      <ComprehensiveCropPlanning />
    </div>
  );
}
