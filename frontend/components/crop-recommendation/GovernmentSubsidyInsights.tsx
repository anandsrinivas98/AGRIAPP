'use client';

import { motion } from 'framer-motion';
import { ShieldCheckIcon, DocumentTextIcon, CurrencyDollarIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface GovernmentSubsidyInsightsProps {
  crop: any;
}

export default function GovernmentSubsidyInsights({ crop }: GovernmentSubsidyInsightsProps) {
  const subsidies = [
    {
      name: 'PM-KISAN',
      description: 'Direct income support to farmers',
      amount: '₹6,000',
      frequency: 'per year',
      eligibility: 'All landholding farmers',
      coverage: 'National',
      icon: '💰',
      color: 'from-green-500 to-emerald-500',
      documents: ['Land records', 'Aadhaar card', 'Bank account'],
      applicationLink: 'https://pmkisan.gov.in'
    },
    {
      name: 'Soil Health Card Scheme',
      description: 'Free soil testing and recommendations',
      amount: 'Free',
      frequency: 'every 3 years',
      eligibility: 'All farmers',
      coverage: 'National',
      icon: '🧪',
      color: 'from-blue-500 to-cyan-500',
      documents: ['Land records', 'Farmer ID'],
      applicationLink: 'https://soilhealth.dac.gov.in'
    },
    {
      name: 'Pradhan Mantri Fasal Bima Yojana',
      description: 'Crop insurance against natural calamities',
      amount: '2% premium',
      frequency: 'per season',
      eligibility: 'All farmers',
      coverage: 'National',
      icon: '🛡️',
      color: 'from-purple-500 to-pink-500',
      documents: ['Land records', 'Sowing certificate', 'Bank account'],
      applicationLink: 'https://pmfby.gov.in'
    },
    {
      name: 'Micro Irrigation Subsidy',
      description: 'Subsidy for drip and sprinkler systems',
      amount: '40-55%',
      frequency: 'one-time',
      eligibility: 'Small and marginal farmers',
      coverage: 'State-specific',
      icon: '💧',
      color: 'from-teal-500 to-blue-500',
      documents: ['Land records', 'Quotation', 'Bank account'],
      applicationLink: 'Contact local agriculture office'
    },
    {
      name: 'Organic Farming Subsidy',
      description: 'Support for organic certification and inputs',
      amount: '₹20,000',
      frequency: 'per hectare',
      eligibility: 'Organic farmers',
      coverage: 'National',
      icon: '🌿',
      color: 'from-lime-500 to-green-500',
      documents: ['Land records', 'Organic certification', 'Training certificate'],
      applicationLink: 'https://pgsindia-ncof.gov.in'
    },
    {
      name: 'Kisan Credit Card',
      description: 'Low-interest credit for farming needs',
      amount: 'Up to ₹3 lakh',
      frequency: 'revolving credit',
      eligibility: 'All farmers',
      coverage: 'National',
      icon: '💳',
      color: 'from-orange-500 to-red-500',
      documents: ['Land records', 'Aadhaar', 'PAN card', 'Bank account'],
      applicationLink: 'Visit nearest bank branch'
    }
  ];

  const upcomingDeadlines = [
    {
      scheme: 'PM-KISAN Registration',
      deadline: 'Ongoing',
      status: 'open',
      urgency: 'low'
    },
    {
      scheme: 'Kharif Crop Insurance',
      deadline: 'July 31, 2024',
      status: 'closing soon',
      urgency: 'high'
    },
    {
      scheme: 'Micro Irrigation Application',
      deadline: 'March 31, 2024',
      status: 'open',
      urgency: 'medium'
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upcoming Deadlines */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 p-5 rounded-2xl border-2 border-orange-200">
        <div className="flex items-center space-x-3 mb-4">
          <CalendarIcon className="w-6 h-6 text-orange-600" />
          <h3 className="text-xl font-bold text-gray-800">Upcoming Deadlines</h3>
        </div>
        <div className="space-y-2">
          {upcomingDeadlines.map((item, index) => (
            <motion.div
              key={item.scheme}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-white rounded-xl"
            >
              <div>
                <h4 className="font-semibold text-gray-800">{item.scheme}</h4>
                <p className="text-sm text-gray-600">{item.deadline}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getUrgencyColor(item.urgency)}`}>
                {item.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Available Subsidies */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Available Government Schemes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subsidies.map((subsidy, index) => (
            <motion.div
              key={subsidy.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-5 rounded-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-start space-x-3 mb-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${subsidy.color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                  {subsidy.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-1">{subsidy.name}</h4>
                  <p className="text-sm text-gray-600">{subsidy.description}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Benefit:</span>
                  <span className="font-semibold text-green-600">{subsidy.amount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-semibold text-gray-800">{subsidy.frequency}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Coverage:</span>
                  <span className="font-semibold text-gray-800">{subsidy.coverage}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Eligibility:</p>
                <p className="text-xs text-gray-600">{subsidy.eligibility}</p>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Required Documents:</p>
                <div className="flex flex-wrap gap-1">
                  {subsidy.documents.map((doc, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded-full">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={subsidy.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2 bg-gradient-to-r from-green-600 to-lime-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Apply Now
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-2xl border-2 border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <DocumentTextIcon className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800">Application Tips</h3>
        </div>
        <ul className="space-y-2">
          <li className="flex items-start space-x-2 text-sm text-gray-700">
            <ShieldCheckIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Keep all documents ready before starting the application</span>
          </li>
          <li className="flex items-start space-x-2 text-sm text-gray-700">
            <ShieldCheckIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Apply well before deadlines to avoid last-minute issues</span>
          </li>
          <li className="flex items-start space-x-2 text-sm text-gray-700">
            <ShieldCheckIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Visit your local agriculture office for assistance</span>
          </li>
          <li className="flex items-start space-x-2 text-sm text-gray-700">
            <ShieldCheckIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Keep copies of all submitted documents for your records</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
