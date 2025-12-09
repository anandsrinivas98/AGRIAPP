'use client';

import Link from 'next/link';
import { ArrowLeftIcon, CalendarIcon } from '@heroicons/react/24/outline';
import FeatureCard from '../../../components/FeatureCard';
import CropPlanningIllustration from '../../../components/illustrations/CropPlanningIllustration';

export default function CropPlanningCardDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard">
          <button className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-green-700 rounded-xl shadow-md hover:shadow-lg transition-all mb-8 border border-green-200">
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-semibold">Back to Dashboard</span>
          </button>
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Feature Card Design Demo
          </h1>
          <p className="text-gray-600">
            Clean, modern card design for farming guidance features
          </p>
        </div>

        {/* Single Card Demo */}
        <div className="max-w-md mx-auto mb-16">
          <FeatureCard
            badge="Expert Tips"
            icon={<CalendarIcon className="w-6 h-6" />}
            illustration={<CropPlanningIllustration />}
            title="Crop Planning"
            description="Plan your season with confidence and unlock your farm's true potential for a more profitable and sustainable future."
            buttonText="Explore Now"
            href="/features/crop-planning"
          />
        </div>

        {/* Multiple Cards Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Feature Cards Grid
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              badge="Expert Tips"
              icon={<CalendarIcon className="w-6 h-6" />}
              illustration={<CropPlanningIllustration />}
              title="Crop Planning"
              description="Plan your season with confidence and unlock your farm's true potential for a more profitable and sustainable future."
              buttonText="Explore Now"
              href="/features/crop-planning"
              delay={0}
            />

            <FeatureCard
              badge="AI Powered"
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              illustration={
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-5xl">🌾</span>
                </div>
              }
              title="Plantation Guidance"
              description="Get expert advice on plantation techniques, crop selection, and sustainable farming methods tailored to your region."
              buttonText="Get Started"
              href="/features/plantation"
              delay={0.1}
            />

            <FeatureCard
              badge="Smart Farming"
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              illustration={
                <div className="w-32 h-32 bg-gradient-to-br from-yellow-100 to-green-100 rounded-full flex items-center justify-center">
                  <span className="text-5xl">🌱</span>
                </div>
              }
              title="Crop Recommendation"
              description="Discover the best crops for your soil, climate, and market conditions using AI-powered recommendations."
              buttonText="Discover"
              href="/features/crop-recommendation"
              delay={0.2}
            />
          </div>
        </div>

        {/* Design Specifications */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Design Specifications</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Colors</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Background: White (#FFFFFF)</li>
                <li>• Border: Green-100 (#DCFCE7)</li>
                <li>• Badge: Green-100 bg, Green-700 text</li>
                <li>• Icon Background: White with shadow</li>
                <li>• Button: Green-600 (#16A34A)</li>
                <li>• Hover: Green-700 (#15803D)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Styling</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Border Radius: 24px (rounded-3xl)</li>
                <li>• Padding: 32px (p-8)</li>
                <li>• Shadow: Large with hover effect</li>
                <li>• Transitions: Smooth 300ms</li>
                <li>• Hover: Lift effect (-8px)</li>
                <li>• Icon Size: 24px (w-6 h-6)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
