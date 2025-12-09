'use client';

import { motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * Mobile Menu Hamburger Button
 * Toggles between hamburger and X icon with animation
 */
export default function MobileMenuButton({ 
  isOpen, 
  onToggle, 
  className = '' 
}: MobileMenuButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onToggle}
      className={`lg:hidden p-2 rounded-xl text-gray-700 hover:text-green-700 hover:bg-green-50 transition-all ${className}`}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <XMarkIcon className="w-6 h-6" />
      ) : (
        <Bars3Icon className="w-6 h-6" />
      )}
    </motion.button>
  );
}
