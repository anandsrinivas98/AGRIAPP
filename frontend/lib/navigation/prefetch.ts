/**
 * Route Prefetching and Optimization
 * Preloads critical routes for instant navigation
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Critical routes to prefetch
const CRITICAL_ROUTES = [
  '/dashboard',
  '/marketplace',
  '/weather',
  '/features/crop-recommendation',
  '/features/soil-analysis',
  '/features/yield-prediction',
  '/features/chatbot',
  '/profile'
];

/**
 * Hook to prefetch critical routes on mount
 * Improves navigation performance by preloading pages
 */
export function usePrefetchRoutes() {
  const router = useRouter();

  useEffect(() => {
    // Prefetch critical routes after initial render
    const prefetchTimer = setTimeout(() => {
      CRITICAL_ROUTES.forEach(route => {
        router.prefetch(route);
      });
    }, 1000); // Delay to not block initial page load

    return () => clearTimeout(prefetchTimer);
  }, [router]);
}

/**
 * Prefetch route on hover for instant navigation
 */
export function usePrefetchOnHover(href: string) {
  const router = useRouter();

  const handleMouseEnter = () => {
    router.prefetch(href);
  };

  return { onMouseEnter: handleMouseEnter };
}
