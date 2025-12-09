'use client';

import { ReactNode, MouseEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { triggerLoading } from './GlobalLoader';

interface OptimizedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
  onClick?: () => void;
}

/**
 * Optimized Link Component
 * Prefetches on hover and shows loading on click
 */
export default function OptimizedLink({
  href,
  children,
  className = '',
  prefetch = true,
  onClick
}: OptimizedLinkProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Trigger loading animation
    triggerLoading.start();

    // Call custom onClick if provided
    if (onClick) {
      onClick();
    }

    // Stop loading after navigation
    setTimeout(() => {
      triggerLoading.stop();
    }, 1000);
  };

  const handleMouseEnter = () => {
    // Prefetch on hover for instant navigation
    if (prefetch) {
      router.prefetch(href);
    }
  };

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      prefetch={prefetch}
    >
      {children}
    </Link>
  );
}
