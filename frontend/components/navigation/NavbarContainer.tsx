'use client';

import { useScrollShadow } from '@/lib/navigation';

interface NavbarContainerProps {
  children: React.ReactNode;
  variant?: 'public' | 'dashboard';
  className?: string;
}

/**
 * Navbar Container
 * Provides consistent container styling with scroll-based shadow effect
 */
export default function NavbarContainer({ 
  children, 
  variant = 'public',
  className = '' 
}: NavbarContainerProps) {
  const isScrolled = useScrollShadow(10);

  const baseClasses = "sticky top-0 z-50 backdrop-blur-md border-b transition-shadow duration-300";
  
  const variantClasses = variant === 'public' 
    ? "bg-white/90 border-green-100" 
    : "bg-white border-gray-200";
  
  const shadowClasses = isScrolled ? "shadow-md" : "shadow-sm";

  return (
    <header className={`${baseClasses} ${variantClasses} ${shadowClasses} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </header>
  );
}
