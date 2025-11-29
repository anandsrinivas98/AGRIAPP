'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ChevronRightIcon, PlayIcon } from '@heroicons/react/24/outline';

export default function Hero() {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Optimized Background Animations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary Floating Orbs - Reduced complexity */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-primary-200 to-accent-200 rounded-full opacity-20 blur-3xl will-change-transform"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-accent-200 to-secondary-200 rounded-full opacity-15 blur-3xl will-change-transform"
        />

        {/* Simplified Floating Elements - Only 2 instead of 4 */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-r from-green-300 to-blue-300 rounded-full opacity-15 blur-xl will-change-transform"
        />

        {/* Reduced Particles - Only 4 instead of 12 */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
            className="absolute w-2 h-2 bg-primary-400 rounded-full opacity-20 will-change-transform"
            style={{
              top: `${20 + i * 15}%`,
              left: `${15 + i * 20}%`,
            }}
          />
        ))}

        {/* Static Grid Pattern - No animation to improve performance */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Simplified Floating Icons - Only 3 instead of 5 */}
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-10 text-2xl opacity-25 will-change-transform"
        >
          🌾
        </motion.div>
        <motion.div
          animate={{
            y: [0, 12, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: 2,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/3 right-1/4 text-xl opacity-20 will-change-transform"
        >
          ☀️
        </motion.div>
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/3 left-1/2 text-lg opacity-15 will-change-transform"
        >
          🔬
        </motion.div>

        {/* Single Pulse Wave - Reduced from 3 to 1 */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.08, 0, 0.08],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-primary-300 rounded-full will-change-transform"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-100 text-primary-800 mb-4">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
                {t('hero.badge', 'AI-Powered Agriculture')}
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold font-display mb-6"
            >
              <span className="gradient-text">
                {t('hero.title.smart', 'Smart')}
              </span>
              <br />
              <span className="text-gray-900">
                {t('hero.title.farming', 'Farming')}
              </span>
              <br />
              <span className="text-primary-600">
                {t('hero.title.solutions', 'Solutions')}
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 mb-8 max-w-2xl"
            >
              {t('hero.description', 'Revolutionize your farming with AI-powered crop recommendations, yield predictions, and disease detection. Make data-driven decisions for sustainable agriculture.')}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl shadow-lg hover:bg-primary-700 transition-colors group"
                >
                  {t('hero.cta.primary', 'Get Started Free')}
                  <ChevronRightIcon className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <button className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors group">
                  <PlayIcon className="mr-2 w-5 h-5" />
                  {t('hero.cta.secondary', 'Watch Demo')}
                </button>
              </motion.div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-12 flex items-center justify-center lg:justify-start space-x-8"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">{t('hero.stats.farmers', 'Farmers')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">95%</div>
                <div className="text-sm text-gray-600">{t('hero.stats.accuracy', 'Accuracy')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">30%</div>
                <div className="text-sm text-gray-600">{t('hero.stats.yield', 'Yield Increase')}</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right column - Optimized Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative flex items-center justify-center h-96"
          >
            {/* Central Orb - Simplified */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-32 h-32 bg-gradient-to-br from-primary-400 via-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-2xl relative z-10 will-change-transform"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="text-white text-4xl will-change-transform"
              >
                🌱
              </motion.div>
            </motion.div>

            {/* Simplified Orbiting Elements - Reduced from 4 to 2 */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 will-change-transform"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-green-200">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-3 h-3 bg-green-500 rounded-full will-change-transform"
                  />
                  <div>
                    <div className="text-xs font-semibold text-gray-800">Crop Health</div>
                    <div className="text-sm font-bold text-green-600">Excellent</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 will-change-transform"
            >
              <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-primary-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">+25%</div>
                  <div className="text-xs text-gray-600 font-medium">Yield Boost</div>
                </div>
              </div>
            </motion.div>

            {/* Simplified Connecting Ring - Only 1 instead of 2 */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <motion.circle
                cx="50%"
                cy="50%"
                r="120"
                stroke="url(#gradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="15,10"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "50% 50%" }}
                className="will-change-transform"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
                </linearGradient>
              </defs>
            </svg>

            {/* Reduced Floating Particles - Only 4 instead of 8 */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  delay: i * 0.8
                }}
                className="absolute w-2 h-2 bg-primary-400 rounded-full will-change-transform"
                style={{
                  top: `${35 + (i % 2) * 30}%`,
                  left: `${25 + (i % 2) * 50}%`
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
        </div>
      </motion.div>
    </section>
  );
}