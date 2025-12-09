/**
 * Navigation Hooks
 * Custom React hooks for navigation functionality
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthState } from './types';

/**
 * Hook to detect if the page has been scrolled
 * Returns true when scroll position is greater than threshold
 * @param threshold - Scroll threshold in pixels (default: 10)
 */
export function useScrollShadow(threshold: number = 10): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    // Set initial state
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
}

/**
 * Hook for managing mobile menu state
 * Returns [isOpen, toggleMenu, closeMenu]
 */
export function useMobileMenu(): [boolean, () => void, () => void] {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  // Close menu on window resize above mobile breakpoint
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        closeMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [closeMenu]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return [isOpen, toggleMenu, closeMenu];
}

/**
 * Hook for managing authentication-aware navigation
 * Returns authentication state formatted for navigation components
 */
export function useAuthNavigation(): AuthState {
  const { user, isAuthenticated, isLoading } = useAuth();

  return {
    isAuthenticated,
    user: user ? {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatar,
      createdAt: new Date(user.createdAt),
      lastLogin: undefined // Not provided by current auth context
    } : null,
    loading: isLoading
  };
}

/**
 * Hook for detecting the active section on the page (scroll spy)
 * @param sectionIds - Array of section IDs to track
 * @param offset - Offset from the top in pixels (default: 100)
 */
export function useActiveSection(sectionIds: string[], offset: number = 100): string | null {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      // Find the section that is currently in view
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (!element) continue;

        const { top, bottom } = element.getBoundingClientRect();
        const elementTop = top + window.scrollY;
        const elementBottom = bottom + window.scrollY;

        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          setActiveSection(id);
          return;
        }
      }

      // If we're at the top, set to first section
      if (window.scrollY < offset) {
        setActiveSection(sectionIds[0] || null);
      }
    };

    // Set initial state
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return activeSection;
}
