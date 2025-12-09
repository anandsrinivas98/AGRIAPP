'use client';

import { usePathname } from 'next/navigation';
import { useAuthNavigation, shouldHideNavigation } from '@/lib/navigation';
import PublicNavbar from './PublicNavbar';
import DashboardNavbar from './DashboardNavbar';

/**
 * Navigation Controller Component
 * Orchestrates navigation rendering based on authentication state
 * - Renders PublicNavbar for unauthenticated users
 * - Renders DashboardNavbar for authenticated users
 * - Hides navigation on auth pages (/auth/*)
 * - Handles loading states
 */
export default function NavigationController() {
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuthNavigation();

  // Don't show navbar on auth pages
  if (shouldHideNavigation(pathname)) {
    return null;
  }

  // Show loading skeleton during authentication check
  if (loading) {
    return (
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo skeleton */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-2xl animate-pulse" />
              <div className="flex flex-col space-y-2">
                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="w-40 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            
            {/* Nav links skeleton */}
            <div className="hidden lg:flex items-center space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
            
            {/* Buttons skeleton */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="w-24 h-10 bg-gray-200 rounded-2xl animate-pulse" />
              <div className="w-24 h-10 bg-gray-200 rounded-2xl animate-pulse" />
            </div>
            
            {/* Mobile menu button skeleton */}
            <div className="lg:hidden w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  // Render appropriate navbar based on authentication state
  return isAuthenticated ? <DashboardNavbar /> : <PublicNavbar />;
}
