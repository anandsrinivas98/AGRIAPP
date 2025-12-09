'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import ChartSkeleton from '../shared/ChartSkeleton';

// Dynamic import with loading component
const MarketOverview = dynamic(
  () => import('./MarketOverview'),
  {
    loading: () => (
      <div className="p-8 space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl h-32"></div>
            </div>
          ))}
        </div>
        
        <ChartSkeleton height={320} title="Price Trends" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded-2xl h-48"></div>
          </div>
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded-2xl h-48"></div>
          </div>
        </div>
      </div>
    ),
    ssr: false, // Disable SSR for charts to avoid hydration issues
  }
);

const MarketOverviewDynamic = React.memo(function MarketOverviewDynamic() {
  return (
    <Suspense fallback={
      <div className="p-8 space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl h-32"></div>
            </div>
          ))}
        </div>
        
        <ChartSkeleton height={320} title="Price Trends" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded-2xl h-48"></div>
          </div>
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded-2xl h-48"></div>
          </div>
        </div>
      </div>
    }>
      <MarketOverview />
    </Suspense>
  );
});

export default MarketOverviewDynamic;