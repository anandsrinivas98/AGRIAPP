'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MobileMenuProps } from '@/lib/navigation';

/**
 * Mobile Menu Overlay
 * Animated overlay container for mobile navigation menu
 */
export default function MobileMenuOverlay({ 
  isOpen, 
  onToggle, 
  children 
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden py-4 border-t border-green-100 overflow-hidden"
        >
          <div className="flex flex-col space-y-2">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
