'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: string;
  backLink?: string;
  backText?: string;
}

const PageHeader = React.memo(function PageHeader({ 
  title, 
  description, 
  icon, 
  backLink = '/dashboard',
  backText = 'Back to Dashboard'
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      {backLink && (
        <Link href={backLink}>
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-green-700 rounded-xl shadow-md hover:shadow-lg transition-all mb-6 border border-green-200"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-semibold">{backText}</span>
          </motion.button>
        </Link>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {icon && (
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 to-lime-500 rounded-3xl shadow-2xl shadow-green-300 mb-6">
            <span className="text-4xl">{icon}</span>
          </div>
        )}
        
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-lime-600 bg-clip-text text-transparent mb-4">
          {title}
        </h1>
        
        {description && (
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {description}
          </p>
        )}
      </motion.div>
    </div>
  );
});

export default PageHeader;
