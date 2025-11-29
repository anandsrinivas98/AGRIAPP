'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bars3Icon, 
  XMarkIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  SparklesIcon,
  ShoppingBagIcon,
  CloudIcon,
  PhoneIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Features', href: '/features', icon: SparklesIcon },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBagIcon },
    { name: 'Weather', href: '/weather', icon: CloudIcon },
    { name: 'Contact', href: '/contact', icon: PhoneIcon },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-green-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="relative w-12 h-12 bg-gradient-to-br from-green-600 via-green-500 to-lime-400 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200"
            >
              <span className="text-2xl">🌾</span>
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold font-display bg-gradient-to-r from-green-700 via-green-600 to-lime-600 bg-clip-text text-transparent">
                AgriSense
              </span>
              <span className="text-xs text-green-600 font-medium -mt-1">Smart Farming Solutions</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative px-4 py-2 rounded-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-2 text-gray-700 group-hover:text-green-700 transition-colors">
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-lime-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 rounded-xl text-gray-600 hover:text-green-700 hover:bg-green-50 transition-all duration-300"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </motion.button>

            {/* Sign In */}
            <Link href="/auth/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  pathname === '/auth/login'
                    ? 'bg-gradient-to-r from-green-600 to-lime-600 text-white font-bold shadow-lg shadow-green-200'
                    : 'text-green-700 bg-white border-2 border-green-200 hover:border-green-300 shadow-sm hover:bg-green-50'
                }`}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Sign In</span>
              </motion.button>
            </Link>

            {/* Sign Up */}
            <Link href="/auth/register">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  pathname === '/auth/register'
                    ? 'bg-gradient-to-r from-green-600 to-lime-600 text-white font-bold shadow-lg shadow-green-200'
                    : 'text-green-700 bg-white border-2 border-green-200 hover:border-green-300 shadow-sm hover:bg-green-50'
                }`}
              >
                <UserIcon className="w-5 h-5" />
                <span>Sign Up</span>
              </motion.button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-700 hover:text-green-700 hover:bg-green-50 transition-all"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </motion.button>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pb-4 overflow-hidden"
            >
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search crops, products, weather..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-green-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden py-4 border-t border-green-100 overflow-hidden"
            >
              <div className="flex flex-col space-y-2">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-green-700 hover:bg-green-50 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </motion.div>
                ))}
                
                <div className="pt-4 mt-4 border-t border-green-100 space-y-3">
                  <Link
                    href="/auth/login"
                    className={`flex items-center justify-center space-x-2 px-4 py-3.5 rounded-2xl font-semibold transition-all ${
                      pathname === '/auth/login'
                        ? 'bg-gradient-to-r from-green-600 to-lime-600 text-white font-bold shadow-lg shadow-green-200'
                        : 'text-green-700 bg-white border-2 border-green-200 hover:bg-green-50 hover:border-green-300 shadow-sm'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/auth/register"
                    className={`flex items-center justify-center space-x-2 px-4 py-3.5 rounded-2xl font-semibold transition-all ${
                      pathname === '/auth/register'
                        ? 'bg-gradient-to-r from-green-600 to-lime-600 text-white font-bold shadow-lg shadow-green-200'
                        : 'text-green-700 bg-white border-2 border-green-200 hover:bg-green-50 hover:border-green-300 shadow-sm'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserIcon className="w-5 h-5" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}