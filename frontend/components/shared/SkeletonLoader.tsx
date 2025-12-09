'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Skeleton Loader Components
 * Shimmer effect for content loading states
 */

interface SkeletonProps {
  className?: string;
}

export const Skeleton = React.memo(function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 rounded ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
});

/**
 * Card Skeleton for loading cards
 */
export const CardSkeleton = React.memo(function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
});

/**
 * Table Row Skeleton
 */
export const TableRowSkeleton = React.memo(function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-200">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/6" />
      <Skeleton className="h-4 w-1/6" />
      <Skeleton className="h-4 w-1/6" />
    </div>
  );
});

/**
 * List Item Skeleton
 */
export const ListItemSkeleton = React.memo(function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
      <Skeleton className="h-12 w-12 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
});

/**
 * Profile Skeleton
 */
export const ProfileSkeleton = React.memo(function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
});

/**
 * Dashboard Grid Skeleton
 */
export const DashboardGridSkeleton = React.memo(function DashboardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
});
