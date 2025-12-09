'use client';

import { triggerLoading } from './GlobalLoader';

/**
 * Test Component for Loading Animation
 * Use this to verify the loading animation works
 */
export default function LoadingTest() {
  const testLoading = () => {
    triggerLoading.start();
    
    // Simulate async operation
    setTimeout(() => {
      triggerLoading.stop();
    }, 2000);
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold">Loading Animation Test</h2>
      
      <div className="space-y-4">
        <button
          onClick={testLoading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Test Loading Animation (2 seconds)
        </button>

        <div className="text-sm text-gray-600">
          <p>Click the button to see:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Green progress bar at the top</li>
            <li>Growing sprout icon at bottom-right</li>
            <li>Smooth fade in/out animations</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Usage in Your Components:</h3>
        <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
{`import { triggerLoading } from '@/components/shared/GlobalLoader';

// In your button click handler:
const handleClick = async () => {
  triggerLoading.start();
  
  try {
    await fetchData();
    // or navigate somewhere
    // or any async operation
  } finally {
    triggerLoading.stop();
  }
};`}
        </pre>
      </div>
    </div>
  );
}
