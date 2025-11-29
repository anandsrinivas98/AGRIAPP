'use client';

import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowRightIcon, 
  CheckCircleIcon,
  SparklesIcon,
  RocketLaunchIcon 
} from '@heroicons/react/24/outline';

export default function CTA() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-primary-600 to-accent-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Transform Your Farming?
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join thousands of farmers who have increased their yields and profits with AgriSense AI technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <RocketLaunchIcon className="mr-3 w-6 h-6" />
              Start Free Trial
              <ArrowRightIcon className="ml-3 w-5 h-5" />
            </Link>

            <Link
              href="/demo"
              className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold text-lg rounded-xl border-2 border-white/30 hover:border-white/50 transition-all duration-200"
            >
              Watch Demo
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}