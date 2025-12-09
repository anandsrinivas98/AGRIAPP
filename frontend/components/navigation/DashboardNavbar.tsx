'use client';

import React, { Fragment, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import {
  HomeIcon,
  ShoppingBagIcon,
  CloudIcon,
  SparklesIcon,
  BeakerIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials, useMobileMenu, DashboardNavLink } from '@/lib/navigation';
import Logo from './Logo';
import MobileMenuButton from './MobileMenuButton';
import MobileMenuOverlay from './MobileMenuOverlay';

// Dashboard navigation links configuration - 7 items for perfect balance
const dashboardNavLinks: DashboardNavLink[] = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBagIcon },
  { name: 'Weather', href: '/weather', icon: CloudIcon },
  { name: 'Crop Recommendation', href: '/features/crop-recommendation', icon: SparklesIcon },
  { name: 'Soil Analysis', href: '/features/soil-analysis', icon: BeakerIcon },
  { name: 'Yield Prediction', href: '/features/yield-prediction', icon: ChartBarIcon },
  { name: 'Chatbot', href: '/features/chatbot', icon: ChatBubbleLeftRightIcon }
];

/**
 * Dashboard Navbar Component - Premium & Professional
 * Clean, modern navigation for authenticated users
 */
const DashboardNavbar = React.memo(function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, toggleMobileMenu, closeMobileMenu] = useMobileMenu();

  const handleLogout = useCallback(async () => {
    await logout();
    router.push('/');
  }, [logout, router]);

  const userInitials = useMemo(() => 
    user ? getInitials(user.firstName, user.lastName) : '',
    [user]
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section - Left Aligned with proper spacing */}
          <div className="flex items-center min-w-[240px]">
            <Logo variant="dashboard" />
          </div>

          {/* Desktop Navigation - Perfectly Centered with 7 items */}
          <nav className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center gap-2">
              {dashboardNavLinks.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group relative px-3 py-2 rounded-lg transition-all duration-200"
                  >
                    <div className={`flex items-center gap-2 transition-colors ${
                      active 
                        ? 'text-green-600 font-semibold' 
                        : 'text-gray-600 group-hover:text-green-600'
                    }`}>
                      <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                      <span className="text-[13px] font-medium whitespace-nowrap tracking-tight">
                        {item.name}
                      </span>
                    </div>
                    
                    {/* Soft hover underline */}
                    <motion.div
                      className="absolute -bottom-[1px] left-2 right-2 h-[2px] bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                      initial={{ scaleX: 0, opacity: 0 }}
                      whileHover={{ scaleX: 1, opacity: 0.6 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    />
                    
                    {/* Active indicator */}
                    {active && (
                      <motion.div
                        layoutId="dashboard-active"
                        className="absolute -bottom-[1px] left-2 right-2 h-[2px] bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Profile Section - Right Aligned with proper spacing */}
          <div className="hidden lg:flex items-center justify-end min-w-[240px]">
            {/* Profile Dropdown */}
            <Menu as="div" className="relative" data-testid="profile-menu">
              <Menu.Button className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                {/* Avatar */}
                <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                  {userInitials}
                </div>
                
                {/* User Info */}
                <div className="text-left hidden xl:block max-w-[150px]">
                  <p className="text-[13px] font-semibold text-gray-800 leading-tight truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[11px] text-gray-500 leading-tight truncate">
                    {user?.email}
                  </p>
                </div>
                
                <ChevronDownIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
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
                  {/* Profile Header */}
                  <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-lime-50 border-b border-green-100">
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/profile"
                          className={`${
                            active ? 'bg-green-50' : ''
                          } flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors`}
                        >
                          <UserCircleIcon className="w-5 h-5 text-green-600" />
                          <span>View Profile</span>
                        </Link>
                      )}
                    </Menu.Item>
                    
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/profile"
                          className={`${
                            active ? 'bg-green-50' : ''
                          } flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors`}
                        >
                          <Cog6ToothIcon className="w-5 h-5 text-green-600" />
                          <span>Settings</span>
                        </Link>
                      )}
                    </Menu.Item>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-red-50' : ''
                          } flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors w-full`}
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
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center justify-end col-span-3">
            <MobileMenuButton 
              isOpen={isMobileMenuOpen} 
              onToggle={toggleMobileMenu} 
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileMenuOverlay 
        isOpen={isMobileMenuOpen} 
        onToggle={toggleMobileMenu}
      >
        {/* Mobile Nav Links */}
        {dashboardNavLinks.map((item, index) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-green-50 text-green-700 font-semibold'
                    : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                }`}
                onClick={closeMobileMenu}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            </motion.div>
          );
        })}
        
        {/* Mobile Profile Section */}
        <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
            onClick={closeMobileMenu}
          >
            <UserCircleIcon className="w-5 h-5 text-green-600" />
            <span className="font-medium text-sm">Profile</span>
          </Link>
          
          <button
            onClick={() => {
              handleLogout();
              closeMobileMenu();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all w-full"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </MobileMenuOverlay>
    </header>
  );
});

export default DashboardNavbar;
