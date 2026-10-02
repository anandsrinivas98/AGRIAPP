'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const platformFeatures = [
  {
    id: 1,
    name: 'AI-Based Crop Recommendation',
    role: 'AgriSense Project',
    icon: '🌱',
    status: 'Model-Based',
    text: 'AgriSense analyzes soil and environmental inputs such as NPK values, pH, temperature, humidity, and rainfall to provide crop recommendations based on the available model. Designed to help farmers make more informed crop-planning decisions using available soil and environmental data.',
    tag1: 'AI RECOMMENDATION',
    tag2: 'PROJECT FEATURE',
  },
  {
    id: 2,
    name: 'Crop & Yield Analysis',
    role: 'AgriSense Project',
    icon: '📊',
    status: 'Prototype Feature',
    text: 'The platform combines machine-learning based crop analysis with farm management features to help users understand crop conditions and plan farming activities.',
    tag1: 'CROP ANALYSIS',
    tag2: 'PROJECT FEATURE',
  },
  {
    id: 3,
    name: 'Plant Disease Detection',
    role: 'AgriSense Project',
    icon: '🔍',
    status: 'AI Feature',
    text: 'The platform includes image-based plant disease detection to identify potential crop health issues and provide relevant guidance.',
    tag1: 'COMPUTER VISION',
    tag2: 'PROJECT FEATURE',
  },
  {
    id: 4,
    name: 'Farm Management Tools',
    role: 'AgriSense Project',
    icon: '🚜',
    status: 'Platform Feature',
    text: 'AgriSense brings crop planning, weather information, farming guidance, and other management features together in one platform.',
    tag1: 'FARM MANAGEMENT',
    tag2: 'PROJECT FEATURE',
  },
];

export default function Testimonials() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextFeature = () => {
    setCurrentIndex((prev) => (prev + 1) % platformFeatures.length);
  };

  const prevFeature = () => {
    setCurrentIndex((prev) => (prev - 1 + platformFeatures.length) % platformFeatures.length);
  };

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

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
            {t('testimonials.title', 'AgriSense Platform Overview')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('testimonials.subtitle', 'An AI-powered agricultural platform designed to support crop planning, crop recommendations, and farm management.')}
          </p>
        </motion.div>

        {/* Main feature carousel */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          <div className="overflow-hidden rounded-2xl">
            <motion.div
              animate={{ x: -currentIndex * 100 + '%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex"
            >
              {platformFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mx-auto max-w-4xl border border-gray-100 border-l-4 border-l-emerald-500"
                  >
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      {/* Icon and info */}
                      <div className="flex-shrink-0 text-center md:text-left">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="w-24 h-24 bg-gradient-to-tr from-green-500 via-emerald-600 to-teal-500 rounded-2xl shadow-lg flex flex-col items-center justify-center text-white relative mb-4 mx-auto md:mx-0 border border-white/20"
                        >
                          <span className="text-4xl mb-1 filter drop-shadow">{feature.icon}</span>
                          <span className="text-[10px] uppercase tracking-widest font-bold opacity-80 font-sans">
                            {feature.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </motion.div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {feature.name}
                        </h3>
                        <p className="text-gray-600 mb-3">{feature.role}</p>
                        
                        {/* Neutral status badge replacing star ratings */}
                        <div className="flex justify-center md:justify-start mb-4">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
                            {feature.status}
                          </span>
                        </div>
                      </div>

                      {/* Feature content */}
                      <div className="flex-1">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-primary-200 mb-4"
                        >
                          <svg className="w-10 h-10 text-emerald-200" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.851h5v10h-10zm-14 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.851h5v10h-11z" />
                          </svg>
                        </motion.div>
                        
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                          transition={{ delay: 0.4 }}
                          className="text-lg md:text-xl text-gray-700 italic leading-relaxed mb-6"
                        >
                          {feature.text}
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                          transition={{ delay: 0.5 }}
                          className="flex flex-wrap items-center justify-center md:justify-start gap-4"
                        >
                          <span className="px-3 py-1 bg-accent-50 text-accent-700 rounded-full text-xs font-semibold uppercase tracking-wider border border-accent-100">
                            {feature.tag1}
                          </span>
                          
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-100">
                            {feature.tag2}
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevFeature}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextFeature}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-600" />
            </motion.button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {platformFeatures.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}