'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Stats from '@/components/landing/Stats';
import Testimonials from '@/components/landing/Testimonials';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <div id="hero">
        <Hero />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="solutions">
        <Stats />
      </div>
      <div id="about">
        <Testimonials />
      </div>
      <div id="contact">
        <CTA />
      </div>
      <Footer />
    </motion.div>
  );
}