'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import with loading component
const WeatherMap = dynamic(
  () => import('./WeatherMap'),
  {
    loading: () => (
      <div className="h-96 w-full rounded-xl overflow-hidden border-2 border-gray-300 shadow-inner bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-24 mx-auto"></div>
        </div>
      </div>
    ),
    ssr: false, // Disable SSR for maps to avoid hydration issues
  }
);

interface WeatherMapProps {
  location: { lat: number; lng: number } | null;
}

const WeatherMapDynamic = React.memo(function WeatherMapDynamic(props: WeatherMapProps) {
  return (
    <Suspense fallback={
      <div className="h-96 w-full rounded-xl overflow-hidden border-2 border-gray-300 shadow-inner bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-24 mx-auto"></div>
        </div>
      </div>
    }>
      <WeatherMap {...props} />
    </Suspense>
  );
});

export default WeatherMapDynamic;