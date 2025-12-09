/**
 * Navigation Utilities
 * Shared utility functions for navigation components
 */

/**
 * Smoothly scrolls to a target element on the page
 * @param targetId - The ID of the target element (without #)
 * @param offset - Offset from the top in pixels (default: 80px for navbar height)
 */
export function smoothScrollTo(targetId: string, offset: number = 80): void {
  if (typeof window === 'undefined') return;

  const element = document.getElementById(targetId);
  
  if (!element) {
    console.warn(`Element with id "${targetId}" not found`);
    // Fallback: scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  // Check if smooth scroll is supported
  if ('scrollBehavior' in document.documentElement.style) {
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  } else {
    // Fallback for browsers that don't support smooth scroll
    window.scrollTo(0, offsetPosition);
  }
}

/**
 * Handles smooth scroll navigation for anchor links
 * @param href - The href attribute of the link
 * @param scrollTo - Optional scroll target ID
 * @param offset - Offset from the top in pixels
 */
export function handleSmoothScroll(
  href: string,
  scrollTo?: string,
  offset: number = 80
): void {
  // If scrollTo is provided, use it
  if (scrollTo) {
    smoothScrollTo(scrollTo, offset);
    return;
  }

  // Otherwise, try to extract the hash from href
  const hash = href.split('#')[1];
  if (hash) {
    smoothScrollTo(hash, offset);
  }
}

/**
 * Gets the initials from a user's name
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns Initials (e.g., "JD" for John Doe)
 */
export function getInitials(firstName?: string, lastName?: string): string {
  if (!firstName) return 'U';
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return first + last;
}

/**
 * Checks if the current path matches a given href
 * @param currentPath - The current pathname
 * @param href - The href to check against
 * @returns True if the paths match
 */
export function isActivePath(currentPath: string, href: string): boolean {
  // Remove hash from href for comparison
  const cleanHref = href.split('#')[0];
  
  // Exact match
  if (currentPath === cleanHref) return true;
  
  // Home page special case
  if (cleanHref === '/' && currentPath === '/') return true;
  
  return false;
}

/**
 * Determines if a route should hide the navigation
 * @param pathname - The current pathname
 * @returns True if navigation should be hidden
 */
export function shouldHideNavigation(pathname: string): boolean {
  return pathname?.startsWith('/auth/');
}
