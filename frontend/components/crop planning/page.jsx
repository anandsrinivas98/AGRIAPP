'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  SunIcon, 
  BeakerIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

export default function ComprehensiveCropPlanning() {
  const [selectedPhase, setSelectedPhase] = useState('selection');
  const [expandedSection, setExpandedSection] = useState(null);

  const planningPhases = {
    selection: {
      title: 'Crop Selection',
      icon: <ChartBarIcon className="w-6 h-6" />,
      color: 'from-green-600 to-emerald-600',
      sections: [
        {
          title: 'Market Analysis',
          icon: '📊',
          keyPoints: [
            'Research current market prices and demand trends',
            'Identify high-value crops in your region',
            'Consider contract farming opportunities',
            'Analyze competition and market saturation'
          ],
          decisionPoints: [
            'Which crops have the best profit margins?',
            'Is there a guaranteed buyer for the crop?',
            'What is the market risk level?'
          ]
        },
        {
          title: 'Soil Compatibility',
          icon: '🌱',
          keyPoints: [
            'Conduct soil testing for pH, NPK, and micronutrients',
            'Match crop requirements with soil characteristics',
            'Consider soil texture (sandy, loamy, clay)',
            'Assess drainage and water retention capacity'
          ],
          decisionPoints: [
            'Does your soil pH match crop requirements?',
            'Are soil amendments needed?',
            'Can the soil support the crop\'s root system?'
          ]
        },
        {
          title: 'Climate Suitability',
          icon: '🌤️',
          keyPoints: [
            'Analyze temperature ranges (min, max, optimal)',
            'Review rainfall patterns and irrigation needs',
            'Consider frost dates and growing season length',
            'Evaluate humidity and wind conditions'
          ],
          decisionPoints: [
            'Does the crop fit your climate zone?',
            'Are there climate risks (drought, frost)?',
            'Do you have irrigation backup?'
          ]
        },
        {
          title: 'Resource Assessment',
          icon: '💧',
          keyPoints: [
            'Evaluate water availability and quality',
            'Assess labor requirements and availability',
            'Review equipment and machinery needs',
            'Calculate input costs (seeds, fertilizers, pesticides)'
          ],
          decisionPoints: [
            'Can you afford the initial investment?',
            'Do you have sufficient water supply?',
            'Is skilled labor available when needed?'
          ]
        }
      ]
    },
    rotation: {
      title: 'Crop Rotation',
      icon: <ArrowPathIcon className="w-6 h-6" />,
      color: 'from-blue-600 to-cyan-600',
      sections: [
        {
          title: 'Rotation Principles',
          icon: '🔄',
          keyPoints: [
            'Alternate between deep and shallow-rooted crops',
            'Rotate between nitrogen-fixing and nitrogen-consuming crops',
            'Vary crop families to break pest and disease cycles',
            'Include cover crops for soil health'
          ],
          decisionPoints: [
            'What was grown in the last 2-3 seasons?',
            'Which crop family should follow?',
            'Is a cover crop needed for soil recovery?'
          ]
        },
        {
          title: 'Sample Rotation Plans',
          icon: '📋',
          keyPoints: [
            'Year 1: Legumes (Soybean, Chickpea) - Nitrogen fixation',
            'Year 2: Cereals (Wheat, Rice) - Nitrogen consumption',
            'Year 3: Root crops (Potato, Carrot) - Different root depth',
            'Year 4: Brassicas (Mustard, Cabbage) - Pest break'
          ],
          decisionPoints: [
            'Does this rotation fit your market strategy?',
            'Can you manage different crop requirements?',
            'Will this improve soil health over time?'
          ]
        },
        {
          title: 'Benefits Tracking',
          icon: '✅',
          keyPoints: [
            'Reduced soil-borne diseases by 40-60%',
            'Improved soil structure and organic matter',
            'Better nutrient cycling and availability',
            'Lower pesticide and fertilizer costs'
          ],
          decisionPoints: [
            'Are you tracking soil health improvements?',
            'Have pest problems decreased?',
            'Is yield trending upward?'
          ]
        }
      ]
    },
    schedule: {
      title: 'Planting & Harvesting Schedule',
      icon: <CalendarIcon className="w-6 h-6" />,
      color: 'from-purple-600 to-pink-600',
      sections: [
        {
          title: 'Seasonal Calendar',
          icon: '📅',
          keyPoints: [
            'Kharif (June-Oct): Rice, Cotton, Maize, Soybean',
            'Rabi (Nov-Mar): Wheat, Barley, Mustard, Chickpea',
            'Zaid (Mar-Jun): Watermelon, Cucumber, Vegetables',
            'Perennial: Sugarcane, Banana, Papaya'
          ],
          decisionPoints: [
            'Which season offers the best opportunity?',
            'Can you manage multiple seasons?',
            'Is succession planting possible?'
          ]
        },
        {
          title: 'Critical Timing',
          icon: '⏰',
          keyPoints: [
            'Sowing: Align with monsoon onset or irrigation availability',
            'Transplanting: 20-30 days after sowing for most crops',
            'Flowering: Ensure adequate water and nutrients',
            'Harvesting: Monitor maturity indicators daily'
          ],
          decisionPoints: [
            'Is the weather forecast favorable?',
            'Are inputs ready before sowing?',
            'Can you harvest at optimal maturity?'
          ]
        },
        {
          title: 'Labor Planning',
          icon: '👥',
          keyPoints: [
            'Peak labor: Sowing, weeding, harvesting periods',
            'Book labor in advance during peak seasons',
            'Consider mechanization for labor-intensive tasks',
            'Plan for 20-30% buffer for delays'
          ],
          decisionPoints: [
            'Is labor available when needed?',
            'Should you invest in machinery?',
            'Can family labor cover critical periods?'
          ]
        }
      ]
    },
    soilNutrition: {
      title: 'Soil & Nutrient Management',
      icon: <BeakerIcon className="w-6 h-6" />,
      color: 'from-orange-600 to-red-600',
      sections: [
        {
          title: 'Soil Testing',
          icon: '🔬',
          keyPoints: [
            'Test soil every 2-3 years or before major crop change',
            'Key parameters: pH, NPK, organic carbon, micronutrients',
            'Collect samples from multiple locations (composite)',
            'Test at 0-15cm and 15-30cm depths'
          ],
          decisionPoints: [
            'When was the last soil test?',
            'Are deficiencies identified?',
            'Do you have the test report?'
          ]
        },
        {
          title: 'Fertilizer Strategy',
          icon: '🌾',
          keyPoints: [
            'Basal application: 50% N, 100% P, 100% K at sowing',
            'Top dressing: 25% N at 30 days, 25% N at 60 days',
            'Organic options: FYM, compost, green manure',
            'Micronutrients: Zinc, Boron, Iron as per soil test'
          ],
          decisionPoints: [
            'Is the fertilizer plan based on soil test?',
            'Can you afford the recommended doses?',
            'Are organic alternatives available?'
          ]
        },
        {
          title: 'Soil Health Practices',
          icon: '🌿',
          keyPoints: [
            'Add 5-10 tons FYM per hectare annually',
            'Practice minimum tillage to preserve structure',
            'Use cover crops during fallow periods',
            'Maintain crop residues (mulching)'
          ],
          decisionPoints: [
            'Is organic matter increasing?',
            'Are you reducing tillage intensity?',
            'Is soil erosion controlled?'
          ]
        }
      ]
    },
    pestDisease: {
      title: 'Pest & Disease Management',
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      color: 'from-red-600 to-pink-600',
      sections: [
        {
          title: 'Integrated Pest Management (IPM)',
          icon: '🛡️',
          keyPoints: [
            'Cultural: Crop rotation, resistant varieties, field sanitation',
            'Mechanical: Traps, barriers, hand-picking',
            'Biological: Natural predators, bio-pesticides',
            'Chemical: Last resort, use recommended doses'
          ],
          decisionPoints: [
            'What is the pest/disease threshold?',
            'Have non-chemical methods been tried?',
            'Is the pesticide approved and safe?'
          ]
        },
        {
          title: 'Monitoring & Scouting',
          icon: '🔍',
          keyPoints: [
            'Scout fields 2-3 times per week',
            'Use pheromone traps for early detection',
            'Monitor weather for disease-favorable conditions',
            'Keep records of pest/disease incidence'
          ],
          decisionPoints: [
            'Are you scouting regularly?',
            'Is pest population above threshold?',
            'Can you identify the pest/disease correctly?'
          ]
        },
        {
          title: 'Preventive Measures',
          icon: '🚫',
          keyPoints: [
            'Use certified, disease-free seeds',
            'Maintain proper plant spacing for air circulation',
            'Remove and destroy infected plants immediately',
            'Avoid overhead irrigation to reduce leaf wetness'
          ],
          decisionPoints: [
            'Are preventive measures in place?',
            'Is field hygiene maintained?',
            'Are buffer zones established?'
          ]
        }
      ]
    },
    climate: {
      title: 'Climate & Seasonal Factors',
      icon: <SunIcon className="w-6 h-6" />,
      color: 'from-yellow-600 to-orange-600',
      sections: [
        {
          title: 'Weather Monitoring',
          icon: '🌦️',
          keyPoints: [
            'Use weather apps and local forecasts daily',
            'Track rainfall, temperature, humidity patterns',
            'Monitor extreme weather alerts (storms, heatwaves)',
            'Plan operations based on 7-10 day forecasts'
          ],
          decisionPoints: [
            'Is rain expected in the next 3 days?',
            'Are temperatures suitable for the operation?',
            'Should you delay/advance activities?'
          ]
        },
        {
          title: 'Climate Adaptation',
          icon: '🌡️',
          keyPoints: [
            'Choose drought-tolerant varieties in water-scarce areas',
            'Use mulching to conserve moisture and moderate temperature',
            'Install shade nets for heat-sensitive crops',
            'Implement rainwater harvesting systems'
          ],
          decisionPoints: [
            'What are the main climate risks?',
            'Do you have adaptation measures?',
            'Is crop insurance available?'
          ]
        },
        {
          title: 'Seasonal Adjustments',
          icon: '🔄',
          keyPoints: [
            'Adjust sowing dates based on monsoon onset',
            'Modify irrigation frequency with temperature changes',
            'Increase pest monitoring during humid periods',
            'Harvest early if adverse weather is predicted'
          ],
          decisionPoints: [
            'Is the season progressing normally?',
            'Should you adjust your plan?',
            'Are contingency measures ready?'
          ]
        }
      ]
    },
    resources: {
      title: 'Resource Optimization',
      icon: <WrenchScrewdriverIcon className="w-6 h-6" />,
      color: 'from-teal-600 to-cyan-600',
      sections: [
        {
          title: 'Water Management',
          icon: '💧',
          keyPoints: [
            'Drip irrigation: 40-60% water savings, better yields',
            'Sprinkler: Suitable for vegetables, 30-40% savings',
            'Furrow/flood: Traditional, but less efficient',
            'Schedule irrigation based on crop stage and soil moisture'
          ],
          decisionPoints: [
            'What is your water source reliability?',
            'Can you invest in efficient irrigation?',
            'Are you monitoring soil moisture?'
          ]
        },
        {
          title: 'Labor Optimization',
          icon: '👷',
          keyPoints: [
            'Mechanize repetitive tasks (plowing, sowing, harvesting)',
            'Train workers for specialized operations',
            'Use contract labor for peak periods',
            'Implement piece-rate for harvesting efficiency'
          ],
          decisionPoints: [
            'Which tasks can be mechanized?',
            'Is labor cost increasing?',
            'Can you form labor-sharing groups?'
          ]
        },
        {
          title: 'Equipment Planning',
          icon: '🚜',
          keyPoints: [
            'Own: Tractors, basic implements for frequent use',
            'Rent: Specialized equipment (combine, sprayers)',
            'Share: Form cooperatives for expensive machinery',
            'Maintain: Regular servicing to avoid breakdowns'
          ],
          decisionPoints: [
            'Should you buy or rent equipment?',
            'Is custom hiring available locally?',
            'Are machines well-maintained?'
          ]
        },
        {
          title: 'Cost Management',
          icon: '💰',
          keyPoints: [
            'Track all expenses by category (seeds, fertilizer, labor)',
            'Compare costs with previous seasons',
            'Identify areas for cost reduction',
            'Negotiate bulk purchases with other farmers'
          ],
          decisionPoints: [
            'Are you tracking costs accurately?',
            'Where can you reduce expenses?',
            'Is the profit margin acceptable?'
          ]
        }
      ]
    }
  };

  const currentPhase = planningPhases[selectedPhase];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-500 rounded-3xl shadow-2xl mb-6">
            <span className="text-4xl">📋</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Comprehensive Crop Planning Strategy
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A complete guide to planning your farming season with expert recommendations on crop selection, rotation, scheduling, and resource management.
          </p>
        </motion.div>

        {/* Phase Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-12">
          {Object.entries(planningPhases).map(([key, phase], index) => (
            <motion.button
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedPhase(key)}
              className={`p-4 rounded-2xl transition-all ${
                selectedPhase === key
                  ? `bg-gradient-to-br ${phase.color} text-white shadow-lg scale-105`
                  : 'bg-white text-gray-700 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={selectedPhase === key ? 'text-white' : 'text-green-600'}>
                  {phase.icon}
                </div>
                <span className="text-xs font-semibold text-center">{phase.title}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Content Area */}
        <motion.div
          key={selectedPhase}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
        >
          <div className={`inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r ${currentPhase.color} text-white rounded-full mb-8`}>
            {currentPhase.icon}
            <h2 className="text-2xl font-bold">{currentPhase.title}</h2>
          </div>

          <div className="space-y-6">
            {currentPhase.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-green-300 transition-all"
              >
                <button
                  onClick={() => setExpandedSection(expandedSection === `${selectedPhase}-${index}` ? null : `${selectedPhase}-${index}`)}
                  className="w-full p-6 bg-gradient-to-r from-gray-50 to-green-50 hover:from-green-50 hover:to-emerald-50 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">{section.icon}</span>
                    <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSection === `${selectedPhase}-${index}` ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>

                {expandedSection === `${selectedPhase}-${index}` && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-6 bg-white"
                  >
                    <div className="space-y-6">
                      {/* Key Points */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                          Key Points
                        </h4>
                        <ul className="space-y-2">
                          {section.keyPoints.map((point, i) => (
                            <li key={i} className="flex items-start space-x-3">
                              <span className="text-green-600 mt-1">✓</span>
                              <span className="text-gray-700">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Decision Points */}
                      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                        <h4 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
                          <span className="text-2xl mr-2">🤔</span>
                          Critical Decision Points
                        </h4>
                        <ul className="space-y-2">
                          {section.decisionPoints.map((point, i) => (
                            <li key={i} className="flex items-start space-x-3">
                              <span className="text-yellow-600 font-bold">?</span>
                              <span className="text-gray-700 font-medium">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Reference Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl"
        >
          <h3 className="text-2xl font-bold mb-4">📌 Quick Planning Checklist</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Before Planting:</h4>
              <ul className="space-y-1 text-sm opacity-90">
                <li>☐ Soil test completed</li>
                <li>☐ Crop selection finalized</li>
                <li>☐ Seeds/inputs procured</li>
                <li>☐ Equipment ready</li>
                <li>☐ Labor arranged</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">During Season:</h4>
              <ul className="space-y-1 text-sm opacity-90">
                <li>☐ Regular field scouting</li>
                <li>☐ Timely irrigation</li>
                <li>☐ Fertilizer application on schedule</li>
                <li>☐ Pest/disease monitoring</li>
                <li>☐ Weather tracking</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}