'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
}

export default function EmptyState({ 
  icon = '📭', 
  title, 
  description, 
  actionText, 
  actionLink 
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="text-8xl mb-6">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">{description}</p>
      
      {actionText && actionLink && (
        <Link href={actionLink}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-lime-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            {actionText}
          </motion.button>
        </Link>
      )}
    </motion.div>
  );
}
