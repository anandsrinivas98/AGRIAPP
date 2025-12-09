'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
}

/**
 * Agriculture-themed Loading Spinner
 * Lightweight SVG-based animation with growing plant concept
 */
const LoadingSpinner = React.memo(function LoadingSpinner({ 
  size = 'md', 
  fullScreen = false,
  message 
}: LoadingSpinnerProps) {
  const sizeClasses = useMemo(() => ({
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }), []);

  const LoaderContent = () => (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Growing Plant Animation */}
      <div className={`${sizeClasses[size]} relative`}>
        {/* Rotating outer circle with leaves */}
        <motion.svg
          className="absolute inset-0"
          viewBox="0 0 50 50"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Outer circle */}
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeDasharray="80 40"
            strokeLinecap="round"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* Growing sprout in center */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-6 h-6 text-green-600"
          >
            {/* Sprout/Leaf icon */}
            <path
              d="M12 2C12 2 8 6 8 10C8 12.2091 9.79086 14 12 14C14.2091 14 16 12.2091 16 10C16 6 12 2 12 2Z"
              fill="currentColor"
              opacity="0.6"
            />
            <path
              d="M12 14V22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <motion.path
              d="M12 14C12 14 15 16 15 18.5C15 20.433 13.433 22 11.5 22"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Optional loading message */}
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-medium text-gray-600"
        >
          {message}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
      >
        <LoaderContent />
      </motion.div>
    );
  }

  return <LoaderContent />;
});

export default LoadingSpinner;

/**
 * Inline Loading Spinner for buttons and cards
 */
export const InlineLoader = React.memo(function InlineLoader({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </motion.svg>
  );
});

/**
 * Minimal Dot Loader for subtle loading states
 */
export const DotLoader = React.memo(function DotLoader() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-green-600 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );
});
