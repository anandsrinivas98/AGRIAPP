'use client';

import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About AgriSense
            </h1>
            <p className="text-xl text-gray-600">
              Empowering farmers worldwide with AI-driven agricultural solutions
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              At AgriSense, we believe that technology can revolutionize agriculture and help farmers 
              make better decisions. Our mission is to provide intelligent, data-driven solutions that 
              increase crop yields, reduce costs, and promote sustainable farming practices.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              We combine cutting-edge artificial intelligence, machine learning, and agricultural 
              expertise to deliver actionable insights that farmers can trust and use to improve 
              their operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🌱 Our Vision</h3>
              <p className="text-gray-700">
                To create a world where every farmer has access to intelligent tools that help them 
                grow more food with fewer resources, contributing to global food security and 
                environmental sustainability.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 Our Values</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Innovation in agricultural technology</li>
                <li>• Accessibility for farmers of all sizes</li>
                <li>• Sustainability and environmental care</li>
                <li>• Data privacy and security</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🤖 AI-Powered Recommendations</h4>
                <p className="text-gray-700 mb-4">
                  Get personalized crop recommendations based on soil conditions, weather patterns, 
                  and market demand.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">📈 Yield Predictions</h4>
                <p className="text-gray-700 mb-4">
                  Accurate forecasting helps you plan better and make informed decisions about 
                  your crops.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🔍 Disease Detection</h4>
                <p className="text-gray-700 mb-4">
                  Early detection of plant diseases through computer vision technology saves 
                  crops and reduces losses.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🌤️ Weather Integration</h4>
                <p className="text-gray-700 mb-4">
                  Real-time weather data and forecasts help you make timely farming decisions.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
            <p className="text-xl mb-6">
              Thousands of farmers worldwide trust AgriSense for their agricultural needs
            </p>
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
              <div>
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm opacity-90">Active Farmers</div>
              </div>
              <div>
                <div className="text-3xl font-bold">95%</div>
                <div className="text-sm opacity-90">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm opacity-90">Countries</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}