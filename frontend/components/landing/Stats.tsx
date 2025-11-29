'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const stats = [
  {
    key: 'farmers',
    value: 10000,
    suffix: '+',
    icon: '👨‍🌾',
  },
  {
    key: 'accuracy',
    value: 95,
    suffix: '%',
    icon: '🎯',
  },
  {
    key: 'yield_increase',
    value: 30,
    suffix: '%',
    icon: '📈',
  },
  {
    key: 'countries',
    value: 15,
    suffix: '+',
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

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
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
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            {t('stats.title', 'Trusted by Farmers Worldwide')}
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {t('stats.subtitle', 'Join thousands of farmers who have transformed their agriculture with AgriSense')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
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
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
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
                
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-display">
                  <CountUpAnimation 
                    value={stat.value} 
                    isInView={isInView}
                  />
                  <span className="text-secondary-300">{stat.suffix}</span>
                </div>
                
                <p className="text-white/80 font-medium">
                  {t(`stats.${stat.key}`, stat.key.replace('_', ' '))}
                </p>

                {/* Animated underline */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "60%" } : { width: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 1 }}
                  className="h-1 bg-secondary-300 rounded-full mx-auto mt-4"
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
          <div className="text-white/90">
            <div className="text-2xl font-bold mb-2">
              <CountUpAnimation value={500} isInView={isInView} />M+
            </div>
            <p className="text-sm">{t('stats.predictions', 'AI Predictions Made')}</p>
          </div>
          
          <div className="text-white/90">
            <div className="text-2xl font-bold mb-2">
              <CountUpAnimation value={99} isInView={isInView} />.9%
            </div>
            <p className="text-sm">{t('stats.uptime', 'System Uptime')}</p>
          </div>
          
          <div className="text-white/90">
            <div className="text-2xl font-bold mb-2">
              <CountUpAnimation value={24} isInView={isInView} />/7
            </div>
            <p className="text-sm">{t('stats.support', 'Expert Support')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}