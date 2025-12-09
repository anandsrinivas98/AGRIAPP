'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import ChartSkeleton from '../shared/ChartSkeleton';

// Dynamic import with loading component
const MarketAnalytics = dynamic(
  () => import('./MarketAnalytics'),
  {
    loading: () => (
      <div className="p-8 space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartSkeleton height={320} title="Price Trends" />
          <ChartSkeleton height={320} title="Market Share" />
        </div>
        
        <ChartSkeleton height={320} title="Trading Volume by Commodity" />
        
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-24"></div>
            ))}
          </div>
        </div>
      </div>
    ),
    ssr: false, // Disable SSR for charts to avoid hydration issues
  }
);

const MarketAnalyticsDynamic = React.memo(function MarketAnalyticsDynamic() {
  return (
    <Suspense fallback={
      <div className="p-8 space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartSkeleton height={320} title="Price Trends" />
          <ChartSkeleton height={320} title="Market Share" />
        </div>
        
        <ChartSkeleton height={320} title="Trading Volume by Commodity" />
        
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-24"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <MarketAnalytics />
    </Suspense>
  );
});

export default MarketAnalyticsDynamic;