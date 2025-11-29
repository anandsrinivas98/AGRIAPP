'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/24/solid';

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Wheat Farmer, Punjab',
    avatar: '/avatars/farmer1.jpg',
    rating: 5,
    text: 'AgriSense helped me increase my wheat yield by 35% last season. The AI recommendations were spot-on!',
    crop: 'Wheat',
    yield_increase: 35,
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Organic Farmer, Maharashtra',
    avatar: '/avatars/farmer2.jpg',
    rating: 5,
    text: 'The disease detection feature saved my tomato crop. Early detection meant I could treat it organically.',
    crop: 'Tomato',
    yield_increase: 28,
  },
  {
    id: 3,
    name: 'Mohammed Ali',
    role: 'Rice Farmer, West Bengal',
    avatar: '/avatars/farmer3.jpg',
    rating: 5,
    text: 'Weather alerts and crop planning helped me optimize my irrigation. Water usage reduced by 40%.',
    crop: 'Rice',
    yield_increase: 22,
  },
  {
    id: 4,
    name: 'Dr. Sunita Patel',
    role: 'Agricultural Scientist',
    avatar: '/avatars/scientist1.jpg',
    rating: 5,
    text: 'The ML models are impressive. We use AgriSense data for our research on sustainable farming practices.',
    crop: 'Research',
    yield_increase: 0,
  },
];

export default function Testimonials() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
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
            {t('testimonials.title', 'What Farmers Say About AgriSense')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('testimonials.subtitle', 'Real stories from farmers who transformed their agriculture with AI')}
          </p>
        </motion.div>

        {/* Main testimonial carousel */}
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
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mx-auto max-w-4xl"
                  >
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      {/* Avatar and info */}
                      <div className="flex-shrink-0 text-center md:text-left">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="w-24 h-24 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto md:mx-0"
                        >
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </motion.div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {testimonial.name}
                        </h3>
                        <p className="text-gray-600 mb-3">{testimonial.role}</p>
                        
                        {/* Rating stars */}
                        <div className="flex justify-center md:justify-start mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                              transition={{ delay: i * 0.1 + 0.5 }}
                            >
                              <StarIcon className="w-5 h-5 text-yellow-400" />
                            </motion.div>
                          ))}
                        </div>

                        {/* Metrics */}
                        {testimonial.yield_increase > 0 && (
                          <div className="bg-primary-50 rounded-lg p-3">
                            <div className="text-2xl font-bold text-primary-600">
                              +{testimonial.yield_increase}%
                            </div>
                            <div className="text-sm text-primary-700">
                              {t('testimonials.yield_increase', 'Yield Increase')}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Testimonial content */}
                      <div className="flex-1">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-6xl text-primary-200 mb-4"
                        >
                          "
                        </motion.div>
                        
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                          transition={{ delay: 0.4 }}
                          className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6"
                        >
                          {testimonial.text}
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                          transition={{ delay: 0.5 }}
                          className="flex items-center gap-4"
                        >
                          <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium">
                            {testimonial.crop}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {t('testimonials.verified', 'Verified Farmer')} ✓
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
              onClick={prevTestimonial}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-600" />
            </motion.button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-8">
            {t('testimonials.trust', 'Trusted by agricultural institutions and government bodies')}
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Placeholder for partner logos */}
            <div className="h-12 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
              ICAR Logo
            </div>
            <div className="h-12 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
              Ministry of Agriculture
            </div>
            <div className="h-12 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
              FAO Partner
            </div>
            <div className="h-12 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
              AgTech Alliance
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}