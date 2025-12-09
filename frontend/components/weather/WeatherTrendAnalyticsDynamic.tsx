'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import ChartSkeleton from '../shared/ChartSkeleton';

// Dynamic import with loading component
const WeatherTrendAnalytics = dynamic(
  () => import('./WeatherTrendAnalytics'),
  {
    loading: () => (
      <div className="space-y-8">
        <ChartSkeleton height={250} title="Temperature Pattern (7 Days)" />
        <ChartSkeleton height={250} title="Humidity Pattern (7 Days)" />
        <ChartSkeleton height={250} title="Rainfall & Wind Pattern (7 Days)" />
      </div>
    ),
    ssr: false, // Disable SSR for charts to avoid hydration issues
  }
);

interface TrendData {
  day: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
}

interface Props {
  trendData: TrendData[];
  insights: {
    temperature: string;
    humidity: string;
    rainfall: string;
    wind: string;
  };
}

const WeatherTrendAnalyticsDynamic = React.memo(function WeatherTrendAnalyticsDynamic(props: Props) {
  return (
    <Suspense fallback={
      <div className="space-y-8">
        <ChartSkeleton height={250} title="Temperature Pattern (7 Days)" />
        <ChartSkeleton height={250} title="Humidity Pattern (7 Days)" />
        <ChartSkeleton height={250} title="Rainfall & Wind Pattern (7 Days)" />
      </div>
    }>
      <WeatherTrendAnalytics {...props} />
    </Suspense>
  );
});

export default WeatherTrendAnalyticsDynamic;