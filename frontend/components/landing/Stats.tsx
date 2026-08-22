'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const stats = [
  {
    key: 'farmers',
    icon: '👨‍🌾',
  },
  {
    key: 'accuracy',
    icon: '🎯',
  },
  {
    key: 'yield_increase',
    icon: '📈',
  },
  {
    key: 'reach',
    icon: '🌍',
  },
];

function CountUpAnimation({ 
  value, 
  duration = 2000, 
  isInView 
}: { 
  value: number; 
  duration?: number; 
  isInView: boolean; 
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration, isInView]);

  return <span>{count.toLocaleString()}</span>;
}

export default function Stats() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

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
    <section ref={ref} className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
            {t('stats.title', 'Empowering Sustainable Agriculture')}
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {t('stats.subtitle', 'Providing qualitative insights and tools to help farmers optimize their crops and resources')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.key}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="text-center group"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  <motion.div
                    animate={isInView ? { 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1 + 0.5,
                      ease: "easeInOut"
                    }}
                    className="text-4xl mb-4"
                  >
                    {stat.icon}
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 font-display">
                    {t(`stats.${stat.key}.title`, stat.key.replace('_', ' '))}
                  </h3>
                  
                  <p className="text-white/85 text-sm leading-relaxed">
                    {t(`stats.${stat.key}.description`, '')}
                  </p>
                </div>

                {/* Animated underline */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "60%" } : { width: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 1 }}
                  className="h-1 bg-secondary-300 rounded-full mx-auto mt-6"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid md:grid-cols-3 gap-8 text-center"
        >
          <div className="text-white/90 bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="text-xl font-bold mb-2">
              {t('stats.predictions.title', 'Continuous Predictions')}
            </div>
            <p className="text-sm text-white/80">{t('stats.predictions.description', 'Generates real-time crop recommendations and alerts daily')}</p>
          </div>
          
          <div className="text-white/90 bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="text-xl font-bold mb-2">
              {t('stats.uptime.title', 'Reliable Platform')}
            </div>
            <p className="text-sm text-white/80">{t('stats.uptime.description', 'High availability system with real-time updates')}</p>
          </div>
          
          <div className="text-white/90 bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="text-xl font-bold mb-2">
              {t('stats.support.title', 'Expert Guidance')}
            </div>
            <p className="text-sm text-white/80">{t('stats.support.description', 'Dedicated chatbot and agricultural assistance')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}