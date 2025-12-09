'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Leaf, 
  Thermometer, 
  Droplets, 
  Sprout,
  Bug,
  Calendar,
  DollarSign,
  Lightbulb,
  MapPin
} from 'lucide-react';

interface CropGuideProps {
  cropData: {
    name: string;
    scientificName: string;
    category: string;
    season: string;
    duration: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    introduction: string;
    climate: {
      temperature: {
        min: number;
        max: number;
        optimal: string;
      };
      rainfall: {
        annual: string;
        critical: string;
      };
      humidity: string;
      sunlight: string;
    };
    soil: {
      type: string[];
      ph: {
        min: number;
        max: number;
      };
      drainage: string;
      preparation: string[];
    };
    seedSelection: {
      varieties: Array<{
        name: string;
        yield: string;
        duration: string;
        features: string[];
      }>;
      seedTreatment: string[];
      spacing: {
        rowToRow: string;
        plantToPlant: string;
      };
      sowingMethod: string[];
      sowingDepth: string;
    };
    nutrition: {
      basalFertilizer: Array<{
        nutrient: string;
        quantity: string;
        timing: string;
      }>;
      topDressing: Array<{
        stage: string;
        fertilizer: string;
        quantity: string;
      }>;
      organicOptions: string[];
      deficiencySymptoms: Array<{
        nutrient: string;
        symptoms: string[];
      }>;
    };
    irrigation: {
      frequency: string;
      criticalStages: string[];
      waterRequirement: string;
      methods: string[];
      waterSavingTips: string[];
    };
    weedManagement: {
      commonWeeds: string[];
      preventiveMeasures: string[];
      herbicides: Array<{
        name: string;
        application: string;
        dosage: string;
      }>;
      manualMethods: string[];
    };
    pestDisease: {
      majorPests: Array<{
        name: string;
        symptoms: string[];
        prevention: string[];
        treatment: string[];
      }>;
      majorDiseases: Array<{
        name: string;
        symptoms: string[];
        prevention: string[];
        treatment: string[];
      }>;
      ipmStrategies: string[];
    };
    harvesting: {
      maturityIndicators: string[];
      harvestingMethod: string[];
      postHarvest: {
        cleaning: string[];
        drying: string[];
        storage: string[];
        packaging: string[];
      };
      shelfLife: string;
    };
    economics: {
      costBreakdown: Array<{
        item: string;
        cost: number;
        unit: string;
      }>;
      expectedYield: {
        min: number;
        max: number;
        unit: string;
      };
      marketPrice: {
        min: number;
        max: number;
        unit: string;
      };
      profitEstimate: {
        gross: number;
        net: number;
      };
    };
    bestPractices: {
      climateSmartTips: string[];
      sustainabilityTips: string[];
      modernTechniques: string[];
      commonMistakes: string[];
    };
  };
}

export default function CropGuide({ cropData }: CropGuideProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{cropData.name}</h1>
            <p className="text-lg text-gray-600 italic mb-4">{cropData.scientificName}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="bg-blue-50">
                <Leaf className="w-3 h-3 mr-1" />
                {cropData.category}
              </Badge>
              <Badge variant="outline" className="bg-green-50">
                <Calendar className="w-3 h-3 mr-1" />
                {cropData.season}
              </Badge>
              <Badge variant="outline" className="bg-purple-50">
                Duration: {cropData.duration}
              </Badge>
              <Badge className={getDifficultyColor(cropData.difficulty)}>
                {cropData.difficulty}
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed">{cropData.introduction}</p>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="climate">Climate</TabsTrigger>
          <TabsTrigger value="sowing">Sowing</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="irrigation">Irrigation</TabsTrigger>
          <TabsTrigger value="weeds">Weeds</TabsTrigger>
          <TabsTrigger value="pests">Pests</TabsTrigger>
          <TabsTrigger value="harvest">Harvest</TabsTrigger>
          <TabsTrigger value="economics">Economics</TabsTrigger>
          <TabsTrigger value="tips">Tips</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Category:</span>
                  <span className="text-sm">{cropData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Season:</span>
                  <span className="text-sm">{cropData.season}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Duration:</span>
                  <span className="text-sm">{cropData.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Difficulty:</span>
                  <Badge className={getDifficultyColor(cropData.difficulty)}>
                    {cropData.difficulty}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Climate Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Temperature:</span>
                  <span className="text-sm">{cropData.climate.temperature.optimal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Rainfall:</span>
                  <span className="text-sm">{cropData.climate.rainfall.annual}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Soil pH:</span>
                  <span className="text-sm">{cropData.soil.ph.min} - {cropData.soil.ph.max}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Climate & Soil Requirements */}
        <TabsContent value="climate" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-red-500" />
                  Climate Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Temperature</h4>
                  <p className="text-sm text-gray-600">
                    Range: {cropData.climate.temperature.min}°C - {cropData.climate.temperature.max}°C
                  </p>
                  <p className="text-sm text-gray-600">Optimal: {cropData.climate.temperature.optimal}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Rainfall</h4>
                  <p className="text-sm text-gray-600">Annual: {cropData.climate.rainfall.annual}</p>
                  <p className="text-sm text-gray-600">Critical stages: {cropData.climate.rainfall.critical}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Other Requirements</h4>
                  <p className="text-sm text-gray-600">Humidity: {cropData.climate.humidity}</p>
                  <p className="text-sm text-gray-600">Sunlight: {cropData.climate.sunlight}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brown-500" />
                  Soil Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Soil Type</h4>
                  <div className="flex flex-wrap gap-1">
                    {cropData.soil.type.map((type, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">pH Range</h4>
                  <p className="text-sm text-gray-600">
                    {cropData.soil.ph.min} - {cropData.soil.ph.max}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Drainage</h4>
                  <p className="text-sm text-gray-600">{cropData.soil.drainage}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Soil Preparation</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {cropData.soil.preparation.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Seed Selection & Sowing */}
        <TabsContent value="sowing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-green-500" />
                High-Yield Varieties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cropData.seedSelection.varieties.map((variety, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{variety.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Yield: {variety.yield} | Duration: {variety.duration}
                    </p>
                    <div className="space-y-1">
                      {variety.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs mr-1">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nutrition Management */}
        <TabsContent value="nutrition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-green-500" />
                Fertilizer Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Basal Fertilizer</h4>
                  <div className="space-y-3">
                    {cropData.nutrition.basalFertilizer.map((fertilizer, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4">
                        <p className="font-medium">{fertilizer.nutrient}</p>
                        <p className="text-sm text-gray-600">Quantity: {fertilizer.quantity}</p>
                        <p className="text-sm text-gray-600">Timing: {fertilizer.timing}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Top Dressing</h4>
                  <div className="space-y-3">
                    {cropData.nutrition.topDressing.map((dressing, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <p className="font-medium">{dressing.stage}</p>
                        <p className="text-sm text-gray-600">Fertilizer: {dressing.fertilizer}</p>
                        <p className="text-sm text-gray-600">Quantity: {dressing.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Irrigation Practices */}
        <TabsContent value="irrigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                Irrigation Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Frequency & Requirements</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Frequency:</strong> {cropData.irrigation.frequency}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Water Requirement:</strong> {cropData.irrigation.waterRequirement}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Critical Stages</h4>
                  <ul className="space-y-1">
                    {cropData.irrigation.criticalStages.map((stage, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {stage}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Irrigation Methods</h4>
                  <ul className="space-y-1">
                    {cropData.irrigation.methods.map((method, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {method}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weed Management */}
        <TabsContent value="weeds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Weeds & Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Common Weeds</h4>
                  <div className="flex flex-wrap gap-2">
                    {cropData.weedManagement.commonWeeds.map((weed, index) => (
                      <Badge key={index} variant="outline" className="bg-red-50">
                        {weed}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Preventive Measures</h4>
                  <ul className="space-y-1">
                    {cropData.weedManagement.preventiveMeasures.map((measure, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {measure}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pest & Disease Control */}
        <TabsContent value="pests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="w-5 h-5 text-red-500" />
                Major Pests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cropData.pestDisease.majorPests.map((pest, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-red-600 mb-3">{pest.name}</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">Symptoms</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {pest.symptoms.map((symptom, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-red-400 mt-1">•</span>
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Prevention</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {pest.prevention.map((prev, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              {prev}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Treatment</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {pest.treatment.map((treat, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              {treat}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Harvesting & Post-Harvest */}
        <TabsContent value="harvest" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                Harvesting Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Maturity Indicators</h4>
                  <ul className="space-y-2">
                    {cropData.harvesting.maturityIndicators.map((indicator, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Harvesting Method</h4>
                  <ul className="space-y-2">
                    {cropData.harvesting.harvestingMethod.map((method, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {method}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Economic Details */}
        <TabsContent value="economics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Cost of Cultivation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Cost</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cropData.economics.costBreakdown.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">{item.item}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.cost}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{item.unit}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-semibold">
                      <td className="border border-gray-300 px-4 py-2">Total Cost</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        ₹{cropData.economics.costBreakdown.reduce((sum, item) => sum + item.cost, 0)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">per acre</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tips & Best Practices */}
        <TabsContent value="tips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Climate-Smart Agriculture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {cropData.bestPractices.climateSmartTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <Leaf className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}