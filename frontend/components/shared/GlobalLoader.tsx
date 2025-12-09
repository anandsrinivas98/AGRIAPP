'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Global Loading Animation
 * Shows during page navigation with agriculture theme
 */
export default function GlobalLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Start loading
    setIsLoading(true);

    // Stop loading after delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <>
            {/* Top Progress Bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 origin-left z-[9999]"
              style={{
                boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
              }}
            />

            {/* Floating Sprout Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-8 right-8 z-[9999] pointer-events-none"
            >
              <div className="bg-white rounded-full p-3 shadow-xl border border-green-200">
                <motion.svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  animate={{
                    scale: [1, 1.15, 1],
                    rotate: [0, 8, -8, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Main Leaf */}
                  <motion.path
                    d="M12 2C12 2 8 6 8 10C8 12.2091 9.79086 14 12 14C14.2091 14 16 12.2091 16 10C16 6 12 2 12 2Z"
                    fill="#22c55e"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  {/* Stem */}
                  <path
                    d="M12 14V22"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Growing Side Leaf */}
                  <motion.path
                    d="M12 16C12 16 15 17.5 15 19.5C15 20.8807 13.8807 22 12.5 22"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: [0, 1, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.svg>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Trigger loading manually for buttons/cards
 */
export const triggerLoading = {
  start: () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('globalLoadingStart'));
    }
  },
  stop: () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('globalLoadingStop'));
    }
  }
};

/**
 * Manual Loading Component
 * Use this for button clicks and card interactions
 */
export function ManualLoader() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleStop = () => setIsLoading(false);

    window.addEventListener('globalLoadingStart', handleStart);
    window.addEventListener('globalLoadingStop', handleStop);

    return () => {
      window.removeEventListener('globalLoadingStart', handleStart);
      window.removeEventListener('globalLoadingStop', handleStop);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 origin-left z-[9999]"
          style={{ boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}
        />
      )}
    </AnimatePresence>
  );
}
