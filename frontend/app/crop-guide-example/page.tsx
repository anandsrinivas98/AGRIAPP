'use client';

import CropGuide from '@/components/crop-guide';
import { sampleCropData } from '@/data/sample-crop-data';

export default function CropGuideExample() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b px-4 py-4 mb-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Crop Guide Example - Rice</h1>
            <a 
              href="/features/plantation" 
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              View All Crops
            </a>
          </div>
        </div>
      </div>
      <CropGuide cropData={sampleCropData} />
    </div>
  );
}