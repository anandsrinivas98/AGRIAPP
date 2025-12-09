'use client';

import React from 'react';

interface ChartSkeletonProps {
  height?: number;
  title?: string;
}

const ChartSkeleton = React.memo(function ChartSkeleton({ height = 250, title }: ChartSkeletonProps) {
  return (
    <div className="animate-pulse">
      {title && (
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      )}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
        <div 
          className="bg-gray-200 rounded-lg flex items-center justify-center"
          style={{ height: `${height}px` }}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-24 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-16 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChartSkeleton;