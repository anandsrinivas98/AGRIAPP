/**
 * Navigation Library
 * Central export for all navigation utilities, types, and hooks
 */

// Types
export type {
  User,
  AuthState,
  NavigationLink,
  DashboardNavLink,
  NavigationControllerProps,
  PublicNavbarProps,
  DashboardNavbarProps,
  LogoProps,
  MobileMenuProps,
  SmoothScrollProps,
  ProfileMenuProps,
  NavigationState
} from './types';

export { publicNavLinks } from './types';

// Utilities
export {
  smoothScrollTo,
  handleSmoothScroll,
  getInitials,
  isActivePath,
  shouldHideNavigation
} from './utils';

// Hooks
export {
  useScrollShadow,
  useMobileMenu,
  useAuthNavigation,
  useActiveSection
} from './hooks';
