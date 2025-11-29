'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  SparklesIcon,
  ShoppingBagIcon,
  CloudIcon,
  PhoneIcon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

export default function UnifiedNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Don't show navbar on auth pages
  if (pathname?.startsWith('/auth/')) {
    return null;
  }

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Dashboard', href: '/dashboard', icon: SparklesIcon, authRequired: true },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBagIcon },
    { name: 'Weather', href: '/weather', icon: CloudIcon },
    { name: 'Contact', href: '/contact', icon: PhoneIcon },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName) return 'U';
    const first = firstName.charAt(0).toUpperCase();
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-green-100 shadow-sm">
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
            {navigation.map((item) => {
              // Skip auth-required items if not authenticated
              if (item.authRequired && !isAuthenticated) return null;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group relative px-4 py-2 rounded-xl transition-all duration-300"
                >
                  <div className={`flex items-center space-x-2 transition-colors ${
                    pathname === item.href 
                      ? 'text-green-700 font-semibold' 
                      : 'text-gray-700 group-hover:text-green-700'
                  }`}>
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  {pathname === item.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-lime-500 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Calendar Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl text-green-700 border-2 border-green-200 hover:bg-green-50 transition-all"
                  title="Calendar"
                >
                  <CalendarIcon className="w-5 h-5" />
                </motion.button>

                {/* Feedback Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl text-orange-700 border-2 border-orange-200 hover:bg-orange-50 transition-all"
                  title="Feedback"
                >
                  <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                </motion.button>

                {/* Profile Dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-green-50 transition-all">
                    <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-lime-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {getInitials(user?.firstName, user?.lastName)}
                    </div>
                    <div className="text-left hidden xl:block">
                      <p className="text-sm font-semibold text-gray-800">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
                      <div className="p-3 bg-gradient-to-r from-green-50 to-lime-50 border-b border-green-100">
                        <p className="text-sm font-semibold text-gray-800">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-600">{user?.email}</p>
                      </div>
                      
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/profile"
                              className={`${
                                active ? 'bg-green-50' : ''
                              } flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 transition-colors`}
                            >
                              <UserCircleIcon className="w-5 h-5 text-green-600" />
                              <span>View Profile</span>
                            </Link>
                          )}
                        </Menu.Item>
                        
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/profile/edit"
                              className={`${
                                active ? 'bg-green-50' : ''
                              } flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 transition-colors`}
                            >
                              <Cog6ToothIcon className="w-5 h-5 text-green-600" />
                              <span>Edit Profile</span>
                            </Link>
                          )}
                        </Menu.Item>
                      </div>

                      <div className="border-t border-gray-100">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${
                                active ? 'bg-red-50' : ''
                              } flex items-center space-x-3 px-4 py-3 text-sm text-red-600 transition-colors w-full`}
                            >
                              <ArrowRightOnRectangleIcon className="w-5 h-5" />
                              <span>Logout</span>
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              <>
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
                    <span>Sign Up</span>
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-700 hover:text-green-700 hover:bg-green-50 transition-all"
          >
            {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </motion.button>
        </div>

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
                {navigation.map((item, index) => {
                  if (item.authRequired && !isAuthenticated) return null;
                  
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                          pathname === item.href
                            ? 'bg-green-50 text-green-700 font-semibold'
                            : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
                
                {isAuthenticated ? (
                  <div className="pt-4 mt-4 border-t border-green-100 space-y-2">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-green-50 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserCircleIcon className="w-5 h-5 text-green-600" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all w-full"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 mt-4 border-t border-green-100 space-y-3">
                    <Link
                      href="/auth/login"
                      className="flex items-center justify-center px-4 py-3 rounded-xl text-green-700 font-semibold border-2 border-green-200 hover:bg-green-50 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      className="flex items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-lime-600 text-white font-bold shadow-lg shadow-green-200 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
