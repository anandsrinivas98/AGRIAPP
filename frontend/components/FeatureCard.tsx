'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface FeatureCardProps {
  badge?: string;
  icon: React.ReactNode;
  illustration?: React.ReactNode;
  title: string;
  description: string;
  buttonText?: string;
  href: string;
  delay?: number;
}

export default function FeatureCard({
  badge = 'Expert Tips',
  icon,
  illustration,
  title,
  description,
  buttonText = 'Explore Now',
  href,
  delay = 0
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -8, shadow: '0 20px 40px rgba(0,0,0,0.12)' }}
      className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 relative overflow-hidden group"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Top Section: Badge and Icon */}
        <div className="flex items-start justify-between mb-6">
          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            {badge}
          </span>
          
          <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>

        {/* Illustration Section */}
        {illustration && (
          <div className="flex justify-center mb-6 py-4">
            {illustration}
          </div>
        )}

        {/* Content Section */}
        <div className="space-y-3 mb-6">
          <h3 className="text-2xl font-bold text-gray-800 group-hover:text-green-700 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm">
            {description}
          </p>
        </div>

        {/* Button Section */}
        <Link href={href}>
          <div className="flex items-center justify-between group/button cursor-pointer">
            <span className="text-green-600 font-semibold group-hover/button:text-green-700 transition-colors">
              {buttonText}
            </span>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover/button:bg-green-700 group-hover/button:shadow-xl transition-all"
            >
              <ArrowRightIcon className="w-5 h-5" />
            </motion.div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
