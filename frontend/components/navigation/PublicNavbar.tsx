'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRightOnRectangleIcon, UserIcon } from '@heroicons/react/24/outline';
import { 
  publicNavLinks, 
  handleSmoothScroll, 
  isActivePath,
  useMobileMenu 
} from '@/lib/navigation';
import Logo from './Logo';
import MobileMenuButton from './MobileMenuButton';
import MobileMenuOverlay from './MobileMenuOverlay';

/**
 * Public Navbar Component - Clean & Modern
 * Marketing-focused navigation for unauthenticated visitors
 */
const PublicNavbar = React.memo(function PublicNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, toggleMobileMenu, closeMobileMenu] = useMobileMenu();

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string, scrollTo?: string) => {
    // Only handle smooth scroll for same-page anchors
    if (href.startsWith('/#') || scrollTo) {
      e.preventDefault();
      handleSmoothScroll(href, scrollTo);
      closeMobileMenu();
    } else {
      closeMobileMenu();
    }
  }, [closeMobileMenu]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-green-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo variant="public" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {publicNavLinks.map((item) => {
              const active = isActivePath(pathname, item.href);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.scrollTo)}
                  className="group relative px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <span className={`text-sm font-medium transition-colors ${
                    active 
                      ? 'text-green-600' 
                      : 'text-gray-700 group-hover:text-green-700'
                  }`}>
                    {item.name}
                  </span>
                  
                  {/* Hover underline */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-lime-500 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Sign In Button */}
            <Link href="/auth/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  pathname === '/auth/login'
                    ? 'bg-gradient-to-r from-green-600 to-lime-600 text-white shadow-lg shadow-green-200'
                    : 'text-green-700 bg-white border-2 border-green-200 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Sign In</span>
              </motion.button>
            </Link>

            {/* Sign Up Button */}
            <Link href="/auth/register">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-green-600 to-lime-600 text-white shadow-lg shadow-green-200 hover:shadow-xl transition-all duration-300"
              >
                <UserIcon className="w-5 h-5" />
                <span>Sign Up</span>
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <MobileMenuButton 
            isOpen={isMobileMenuOpen} 
            onToggle={toggleMobileMenu} 
          />
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileMenuOverlay 
        isOpen={isMobileMenuOpen} 
        onToggle={toggleMobileMenu}
      >
        {/* Mobile Nav Links */}
        {publicNavLinks.map((item, index) => {
          const active = isActivePath(pathname, item.href);
          
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.scrollTo)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-green-50 text-green-700 font-semibold'
                    : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                }`}
              >
                <span className="font-medium">{item.name}</span>
              </Link>
            </motion.div>
          );
        })}
        
        {/* Mobile Action Buttons */}
        <div className="pt-4 mt-4 border-t border-green-100 space-y-3">
          <Link
            href="/auth/login"
            className={`flex items-center justify-center space-x-2 px-4 py-3.5 rounded-2xl font-semibold transition-all ${
              pathname === '/auth/login'
                ? 'bg-gradient-to-r from-green-600 to-lime-600 text-white shadow-lg shadow-green-200'
                : 'text-green-700 bg-white border-2 border-green-200 hover:bg-green-50 hover:border-green-300'
            }`}
            onClick={closeMobileMenu}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>Sign In</span>
          </Link>
          
          <Link
            href="/auth/register"
            className="flex items-center justify-center space-x-2 px-4 py-3.5 rounded-2xl font-semibold bg-gradient-to-r from-green-600 to-lime-600 text-white shadow-lg shadow-green-200 transition-all"
            onClick={closeMobileMenu}
          >
            <UserIcon className="w-5 h-5" />
            <span>Sign Up</span>
          </Link>
        </div>
      </MobileMenuOverlay>
    </header>
  );
});

export default PublicNavbar;
