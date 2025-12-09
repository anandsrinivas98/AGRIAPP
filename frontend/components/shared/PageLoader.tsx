'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Global Page Transition Loader
 * Shows agriculture-themed loader during route changes
 */
export default function PageLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Show loader immediately on route change
    setIsLoading(true);

    // Hide loader after content loads
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <>
          {/* Top Progress Bar */}
          <motion.div
            key="progress-bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 origin-left z-[100] shadow-lg shadow-green-500/50"
          />
          
          {/* Pulsing Indicator */}
          <motion.div
            key="pulse-indicator"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-4 right-4 z-[100]"
          >
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg border border-green-100">
              {/* Animated Sprout Icon */}
              <motion.svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                <path
                  d="M12 2C12 2 8 6 8 10C8 12.2091 9.79086 14 12 14C14.2091 14 16 12.2091 16 10C16 6 12 2 12 2Z"
                  fill="#22c55e"
                  opacity="0.6"
                />
                <path
                  d="M12 14V22"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </motion.svg>
              
              {/* Loading Dots */}
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-green-600 rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Top Progress Bar Loader
 * Minimal loading indicator at the top of the page
 */
export function TopProgressBar({ isLoading }: { isLoading: boolean }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 origin-left z-50 shadow-lg shadow-green-500/30"
        />
      )}
    </AnimatePresence>
  );
}
