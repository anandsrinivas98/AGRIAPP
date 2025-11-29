'use client';

import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface OrganicFarmingSuitabilityProps {
  crop: any;
}

export default function OrganicFarmingSuitability({ crop }: OrganicFarmingSuitabilityProps) {
  const organicScore = 78; // Calculate based on crop and conditions

  const factors = [
    {
      factor: 'Natural Pest Resistance',
      suitable: true,
      description: 'This crop has good natural resistance to common pests',
      icon: '🐛'
    },
    {
      factor: 'Organic Fertilizer Response',
      suitable: true,
      description: 'Responds well to compost and organic manures',
      icon: '🌱'
    },
    {
      factor: 'Disease Susceptibility',
      suitable: false,
      description: 'May require organic fungicides during humid conditions',
      icon: '🦠'
    },
    {
      factor: 'Weed Competition',
      suitable: true,
      description: 'Good canopy coverage helps suppress weeds naturally',
      icon: '🌿'
    },
    {
      factor: 'Market Premium',
      suitable: true,
      description: 'Organic version commands 30-40% price premium',
      icon: '💰'
    }
  ];

  const organicPractices = [
    {
      practice: 'Composting',
      benefit: 'Improves soil structure and fertility',
      implementation: 'Create compost pits with farm waste and animal manure',
      cost: 'Low',
      icon: '♻️'
    },
    {
      practice: 'Green Manuring',
      benefit: 'Adds nitrogen and organic matter to soil',
      implementation: 'Grow legumes like dhaincha or sunhemp before main crop',
      cost: 'Low',
      icon: '🌱'
    },
    {
      practice: 'Crop Rotation',
      benefit: 'Breaks pest and disease cycles',
      implementation: 'Rotate with legumes and different crop families',
      cost: 'None',
      icon: '🔄'
    },
    {
      practice: 'Biological Pest Control',
      benefit: 'Natural pest management without chemicals',
      implementation: 'Use neem oil, pheromone traps, and beneficial insects',
      cost: 'Medium',
      icon: '🐞'
    },
    {
      practice: 'Mulching',
      benefit: 'Conserves moisture and suppresses weeds',
      implementation: 'Apply organic mulch around plants',
      cost: 'Low',
      icon: '🍂'
    },
    {
      practice: 'Vermicomposting',
      benefit: 'Produces high-quality organic fertilizer',
      implementation: 'Set up vermicompost beds with earthworms',
      cost: 'Medium',
      icon: '🪱'
    }
  ];

  const certificationSteps = [
    {
      step: 1,
      title: 'Conversion Period',
      duration: '2-3 years',
      description: 'Transition from conventional to organic farming'
    },
    {
      step: 2,
      title: 'Documentation',
      duration: 'Ongoing',
      description: 'Maintain detailed records of all farming activities'
    },
    {
      step: 3,
      title: 'Inspection',
      duration: '1-2 visits/year',
      description: 'Certification body inspects farm and practices'
    },
    {
      step: 4,
      title: 'Certification',
      duration: 'Annual renewal',
      description: 'Receive organic certification and label'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Suitability Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-50 to-lime-50 p-6 rounded-2xl border-2 border-green-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Organic Farming Suitability
            </h3>
            <p className="text-gray-600">
              {crop.crop} is {organicScore >= 70 ? 'highly' : organicScore >= 50 ? 'moderately' : 'marginally'} suitable for organic cultivation
            </p>
          </div>
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - organicScore / 100)}`}
                className="text-green-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-800">{organicScore}%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Suitability Factors */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Organic Farming Factors</h3>
        <div className="space-y-3">
          {factors.map((item, index) => (
            <motion.div
              key={item.factor}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border-2 ${
                item.suitable 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{item.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-800">{item.factor}</h4>
                    {item.suitable ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    ) : (
                      <InformationCircleIcon className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommended Organic Practices */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recommended Organic Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {organicPractices.map((practice, index) => (
            <motion.div
              key={practice.practice}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gradient-to-br from-green-50 to-lime-50 rounded-xl border border-green-200"
            >
              <div className="flex items-start space-x-3 mb-3">
                <div className="text-3xl">{practice.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-800">{practice.practice}</h4>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      practice.cost === 'Low' ? 'bg-green-100 text-green-700' :
                      practice.cost === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {practice.cost} Cost
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{practice.benefit}</p>
                  <p className="text-xs text-gray-500 italic">{practice.implementation}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Certification Process */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Organic Certification Process</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {certificationSteps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white p-4 rounded-xl border-2 border-blue-200">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold mb-3">
                  {step.step}
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">{step.title}</h4>
                <p className="text-xs text-blue-600 font-semibold mb-2">{step.duration}</p>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              {index < certificationSteps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-blue-300" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits Summary */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Benefits of Organic Farming</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-4xl mb-2">💰</div>
            <h4 className="font-semibold text-gray-800 mb-1">Price Premium</h4>
            <p className="text-sm text-gray-600">30-40% higher market price</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🌍</div>
            <h4 className="font-semibold text-gray-800 mb-1">Environmental</h4>
            <p className="text-sm text-gray-600">Sustainable and eco-friendly</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">❤️</div>
            <h4 className="font-semibold text-gray-800 mb-1">Health</h4>
            <p className="text-sm text-gray-600">Chemical-free produce</p>
          </div>
        </div>
      </div>
    </div>
  );
}
