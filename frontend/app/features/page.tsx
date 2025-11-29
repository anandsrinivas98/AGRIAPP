import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features - AgriSense',
  description: 'Explore all AgriSense features for modern farming',
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AgriSense Features
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive farming solutions powered by AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Crop Recommendation</h3>
            <p className="text-gray-600 mb-4">
              AI-powered suggestions based on soil nutrients, weather conditions, and market demand.
            </p>
            <a href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign Up to Access →
            </a>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Yield Prediction</h3>
            <p className="text-gray-600 mb-4">
              Accurate forecasting of crop yields using machine learning models.
            </p>
            <a href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign Up to Access →
            </a>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Disease Detection</h3>
            <p className="text-gray-600 mb-4">
              Computer vision technology to identify plant diseases early.
            </p>
            <a href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign Up to Access →
            </a>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Weather Monitoring</h3>
            <p className="text-gray-600 mb-4">
              Real-time weather data and forecasts for better planning.
            </p>
            <a href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign Up to Access →
            </a>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Price Tracking</h3>
            <p className="text-gray-600 mb-4">
              Market price analysis with trends and sell/buy recommendations.
            </p>
            <a href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign Up to Access →
            </a>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">AI Assistant</h3>
            <p className="text-gray-600 mb-4">
              Multilingual chatbot with voice support for farming guidance.
            </p>
            <a href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign Up to Access →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}