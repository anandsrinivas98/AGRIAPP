'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  CpuChipIcon,
  ChartBarIcon,
  CameraIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CloudIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: CpuChipIcon,
    key: 'crop_recommendation',
    color: 'primary',
  },
  {
    icon: ChartBarIcon,
    key: 'yield_prediction',
    color: 'accent',
  },
  {
    icon: CameraIcon,
    key: 'disease_detection',
    color: 'secondary',
  },
  {
    icon: CalendarIcon,
    key: 'crop_planning',
    color: 'primary',
  },
  {
    icon: CurrencyDollarIcon,
    key: 'price_tracking',
    color: 'accent',
  },
  {
    icon: CloudIcon,
    key: 'weather_monitoring',
    color: 'secondary',
  },
  {
    icon: BookOpenIcon,
    key: 'organic_farming',
    color: 'primary',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    key: 'ai_assistant',
    color: 'accent',
  },
];

export default function Features() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  const getColorClasses = (color: string) => {
    const colors = {
      primary: 'bg-primary-100 text-primary-600 group-hover:bg-primary-600 group-hover:text-white',
      accent: 'bg-accent-100 text-accent-600 group-hover:bg-accent-600 group-hover:text-white',
      secondary: 'bg-secondary-100 text-secondary-600 group-hover:bg-secondary-600 group-hover:text-white',
    };
    return colors[color as keyof typeof colors] || colors.primary;
  };

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
            {t('features.title', 'Comprehensive Farming Solutions')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('features.subtitle', 'Everything you need to make informed decisions and maximize your agricultural productivity')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.key}
                variants={itemVariants}
                whileHover={{ 
                  y: -10,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${getColorClasses(feature.color)}`}>
                  <Icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {t(`features.${feature.key}.title`)}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {t(`features.${feature.key}.description`)}
                </p>

                {/* Animated progress bar */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : { width: 0 }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  className="mt-6 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Interactive demo section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            {t('features.demo.title', 'See AgriSense in Action')}
          </h3>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            {t('features.demo.description', 'Experience the power of AI-driven agriculture with our interactive demo')}
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/auth/register'}
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {t('features.demo.cta', 'Get Started - Sign Up Free')}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="ml-2"
            >
              →
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}