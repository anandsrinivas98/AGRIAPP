'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogoProps } from '@/lib/navigation';

/**
 * AgriSense Logo Component
 * Displays the brand logo with animation and app name
 * Used in both public and dashboard navigation bars
 */
export default function Logo({ variant = 'public', className = '' }: LogoProps) {
  return (
    <Link 
      href="/" 
      className={`flex items-center space-x-3 group ${className}`}
      data-testid="agrisense-logo"
    >
      {/* Animated Logo Icon */}
      <motion.div 
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
        className="relative w-12 h-12 bg-gradient-to-br from-green-600 via-green-500 to-lime-400 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200"
      >
        <span className="text-2xl" role="img" aria-label="wheat">🌾</span>
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
      </motion.div>

      {/* Brand Name */}
      <div className="flex flex-col">
        <span className="text-2xl font-bold font-display bg-gradient-to-r from-green-700 via-green-600 to-lime-600 bg-clip-text text-transparent">
          AgriSense
        </span>
        <span className="text-xs text-green-600 font-medium -mt-1">
          Smart Farming Solutions
        </span>
      </div>
    </Link>
  );
}
