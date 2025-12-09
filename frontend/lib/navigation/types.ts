/**
 * Navigation Types and Interfaces
 * Shared types for the landing page redesign navigation system
 */

import { ComponentType } from 'react';

// ============================================================================
// User and Authentication Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'FARMER' | 'AGRONOMIST' | 'ADMIN';
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

// ============================================================================
// Navigation Link Types
// ============================================================================

export interface NavigationLink {
  name: string;
  href: string;
  scrollTo?: string; // For smooth scroll to sections on same page
}

export interface DashboardNavLink {
  name: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  badge?: number; // For notification counts
}

// ============================================================================
// Navigation Configuration
// ============================================================================

export const publicNavLinks: NavigationLink[] = [
  { name: 'Home', href: '/', scrollTo: 'hero' },
  { name: 'About', href: '/#about', scrollTo: 'about' },
  { name: 'Solutions', href: '/#solutions', scrollTo: 'solutions' },
  { name: 'Features', href: '/#features', scrollTo: 'features' },
  { name: 'Contact', href: '/#contact', scrollTo: 'contact' }
];

// Dashboard nav links will be defined in the component to avoid circular dependencies with icons

// ============================================================================
// Component Props
// ============================================================================

export interface NavigationControllerProps {
  className?: string;
}

export interface PublicNavbarProps {
  className?: string;
}

export interface DashboardNavbarProps {
  className?: string;
}

export interface LogoProps {
  variant?: 'public' | 'dashboard';
  className?: string;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export interface SmoothScrollProps {
  targetId: string;
  offset?: number;
}

export interface ProfileMenuProps {
  user: User;
  onLogout: () => void;
}

// ============================================================================
// Navigation State
// ============================================================================

export interface NavigationState {
  currentPath: string;
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  activeSection?: string; // For scroll spy on landing page
}
