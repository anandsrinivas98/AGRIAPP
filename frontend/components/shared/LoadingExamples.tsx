'use client';

/**
 * Loading System Usage Examples
 * Demonstrates how to use the loading components throughout the app
 */

import { useState } from 'react';
import LoadingSpinner, { InlineLoader, DotLoader } from './LoadingSpinner';
import { TopProgressBar } from './PageLoader';
import { CardSkeleton, ListItemSkeleton, ProfileSkeleton } from './SkeletonLoader';
import LoadingButton from './LoadingButton';
import { useLoading } from '@/hooks/useLoading';

export function LoadingExamples() {
  const [showProgress, setShowProgress] = useState(false);
  const { isLoading, withLoading } = useLoading();

  const handleAsyncAction = async () => {
    await withLoading(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
    });
  };

  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold">Loading System Examples</h2>

      {/* Full Screen Loader */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Full Screen Loader</h3>
        <LoadingSpinner fullScreen message="Loading your data..." />
      </section>

      {/* Inline Loaders */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Inline Loaders</h3>
        <div className="flex items-center gap-4">
          <LoadingSpinner size="sm" />
          <LoadingSpinner size="md" />
          <LoadingSpinner size="lg" />
        </div>
      </section>

      {/* Button with Loading */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Loading Buttons</h3>
        <div className="flex gap-4">
          <LoadingButton
            isLoading={isLoading}
            onClick={handleAsyncAction}
            variant="primary"
          >
            Submit Form
          </LoadingButton>
          
          <LoadingButton
            isLoading={isLoading}
            loadingText="Saving..."
            variant="outline"
          >
            Save Changes
          </LoadingButton>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Top Progress Bar</h3>
        <button
          onClick={() => {
            setShowProgress(true);
            setTimeout(() => setShowProgress(false), 2000);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Show Progress Bar
        </button>
        <TopProgressBar isLoading={showProgress} />
      </section>

      {/* Skeleton Loaders */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Skeleton Loaders</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardSkeleton />
          <div className="space-y-2">
            <ListItemSkeleton />
            <ListItemSkeleton />
          </div>
        </div>
        <ProfileSkeleton />
      </section>

      {/* Dot Loader */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Dot Loader</h3>
        <DotLoader />
      </section>

      {/* Inline Spinner */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Inline Spinner</h3>
        <div className="flex items-center gap-2">
          <InlineLoader className="w-5 h-5 text-green-600" />
          <span>Processing...</span>
        </div>
      </section>
    </div>
  );
}

/**
 * Usage in Components:
 * 
 * 1. Page Loading:
 *    - PageLoader is automatically added to layout
 *    - Shows on route changes
 * 
 * 2. Button Loading:
 *    <LoadingButton isLoading={isSubmitting} onClick={handleSubmit}>
 *      Submit
 *    </LoadingButton>
 * 
 * 3. Card Loading:
 *    {isLoading ? <CardSkeleton /> : <YourCard />}
 * 
 * 4. API Calls:
 *    const { isLoading, withLoading } = useLoading();
 *    await withLoading(async () => {
 *      await fetchData();
 *    });
 * 
 * 5. Full Screen:
 *    {isLoading && <LoadingSpinner fullScreen message="Loading..." />}
 */
