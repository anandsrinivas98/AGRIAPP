'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Prefetch Provider
 * Automatically prefetches critical routes for instant navigation
 */
export default function PrefetchProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Critical routes to prefetch
    const routes = [
      '/dashboard',
      '/marketplace',
      '/weather',
      '/features/crop-recommendation',
      '/features/soil-analysis',
      '/features/yield-prediction',
      '/features/chatbot',
      '/profile'
    ];

    // Prefetch after initial load (low priority)
    const timer = setTimeout(() => {
      routes.forEach(route => {
        router.prefetch(route);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return <>{children}</>;
}
