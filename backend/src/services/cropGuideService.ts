import { geminiService } from './geminiService';

interface CropGuideRequest {
  cropName: string;
  region?: string;
  season?: string;
  farmSize?: string;
  soilType?: string;
  climateZone?: string;
}

interface CropGuideResponse {
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
}

class CropGuideService {
  /**
   * Generate comprehensive crop guide using Gemini AI
   */
  async generateCropGuide(request: CropGuideRequest): Promise<CropGuideResponse> {
    if (!geminiService.isConfigured()) {
      console.warn('Gemini AI not configured, using fallback');
      return this.createFallbackResponse(`{"name":"${request.cropName}"}`);
    }

    const { cropName, region, season, farmSize, soilType, climateZone } = request;

    try {
      // Create a simplified prompt for Gemini
      const prompt = this.buildSimplifiedPrompt(cropName, {
        region,
        season,
        farmSize,
        soilType,
        climateZone
      });

      console.log(`Generating crop guide for: ${cropName}`);

      // Generate response using Gemini
      const response = await geminiService.generateResponse(
        prompt,
        '', // No additional context needed
        [], // No chat history
        'crop_guide' // Intent
      );

      // Check if response is empty
      if (!response || response.trim().length === 0) {
        console.warn('Empty response from Gemini, using fallback');
        return this.createFallbackResponse(`{"name":"${cropName}"}`);
      }

      // Parse the JSON response from Gemini
      const cropGuide = this.parseGeminiResponse(response);
      
      console.log(`✅ Successfully generated guide for: ${cropName}`);
      return cropGuide;
    } catch (error: any) {
      console.error('Error generating crop guide:', error.message);
      // Return fallback instead of throwing
      return this.createFallbackResponse(`{"name":"${cropName}"}`);
    }
  }

  /**
   * Build simplified prompt for better Gemini response
   */
  private buildSimplifiedPrompt(cropName: string, context: Partial<CropGuideRequest>): string {
    const contextInfo = Object.entries(context)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    return `Generate a concise crop cultivation guide for "${cropName}"${contextInfo ? ` (${contextInfo})` : ''}.

Return ONLY a valid JSON object with this structure (keep values brief):
{
  "name": "${cropName}",
  "scientificName": "scientific name",
  "category": "crop category",
  "season": "growing season",
  "duration": "days",
  "difficulty": "Easy|Medium|Hard",
  "introduction": "brief intro (2-3 sentences)",
  "climate": {"temperature": {"min": 0, "max": 0, "optimal": "range"}, "rainfall": {"annual": "mm", "critical": "stage"}, "humidity": "%", "sunlight": "hours"},
  "soil": {"type": ["type1"], "ph": {"min": 0, "max": 0}, "drainage": "requirement", "preparation": ["step1", "step2"]},
  "seedSelection": {"varieties": [{"name": "variety", "yield": "amount", "duration": "days", "features": ["feature1"]}], "seedTreatment": ["method1"], "spacing": {"rowToRow": "cm", "plantToPlant": "cm"}, "sowingMethod": ["method1"], "sowingDepth": "cm"},
  "nutrition": {"basalFertilizer": [{"nutrient": "NPK", "quantity": "kg/acre", "timing": "when"}], "topDressing": [{"stage": "stage", "fertilizer": "type", "quantity": "amount"}], "organicOptions": ["option1"], "deficiencySymptoms": [{"nutrient": "N", "symptoms": ["symptom1"]}]},
  "irrigation": {"frequency": "schedule", "criticalStages": ["stage1"], "waterRequirement": "amount", "methods": ["method1"], "waterSavingTips": ["tip1"]},
  "weedManagement": {"commonWeeds": ["weed1"], "preventiveMeasures": ["measure1"], "herbicides": [{"name": "name", "application": "when", "dosage": "amount"}], "manualMethods": ["method1"]},
  "pestDisease": {"majorPests": [{"name": "pest", "symptoms": ["symptom1"], "prevention": ["method1"], "treatment": ["treatment1"]}], "majorDiseases": [{"name": "disease", "symptoms": ["symptom1"], "prevention": ["method1"], "treatment": ["treatment1"]}], "ipmStrategies": ["strategy1"]},
  "harvesting": {"maturityIndicators": ["indicator1"], "harvestingMethod": ["method1"], "postHarvest": {"cleaning": ["step1"], "drying": ["step1"], "storage": ["step1"], "packaging": ["step1"]}, "shelfLife": "duration"},
  "economics": {"costBreakdown": [{"item": "seeds", "cost": 2000, "unit": "per acre"}], "expectedYield": {"min": 10, "max": 20, "unit": "quintals/acre"}, "marketPrice": {"min": 1000, "max": 2000, "unit": "per quintal"}, "profitEstimate": {"gross": 30000, "net": 10000}},
  "bestPractices": {"climateSmartTips": ["tip1"], "sustainabilityTips": ["tip1"], "modernTechniques": ["technique1"], "commonMistakes": ["mistake1"]}
}

Respond with ONLY the JSON, no markdown, no explanations.`;
  }

  /**
   * Build comprehensive prompt for Gemini AI (backup)
   */
  private buildCropGuidePrompt(cropName: string, context: Partial<CropGuideRequest>): string {
    const contextInfo = Object.entries(context)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    return `You are an expert agricultural consultant. Generate a comprehensive crop cultivation guide for "${cropName}"${contextInfo ? ` in the context of ${contextInfo}` : ''}.

CRITICAL INSTRUCTIONS:
1. Respond ONLY with a valid, complete JSON object
2. Do NOT include markdown code blocks (no \`\`\`json or \`\`\`)
3. Do NOT include any explanatory text before or after the JSON
4. Ensure the JSON is properly formatted and complete
5. All string values must be properly escaped
6. Do not truncate the response - provide the complete JSON

The JSON must include all these sections:
1. Basic crop information (name, scientific name, category, season, duration, difficulty level)
2. Climate requirements (temperature ranges, rainfall, humidity, sunlight)
3. Soil requirements (types, pH range, drainage, preparation steps)
4. Seed selection (varieties with yields and features, treatment methods, spacing, sowing methods)
5. Nutrition management (basal fertilizers, top dressing schedule, organic options, deficiency symptoms)
6. Irrigation practices (frequency, critical stages, water requirements, methods, water-saving tips)
7. Weed management (common weeds, preventive measures, herbicides, manual methods)
8. Pest and disease control (major pests and diseases with symptoms/prevention/treatment, IPM strategies)
9. Harvesting guidelines (maturity indicators, methods, post-harvest handling, shelf life)
10. Economic analysis (cost breakdown, expected yields, market prices, profit estimates)
11. Best practices (climate-smart tips, sustainability practices, modern techniques, common mistakes)

Make sure all data is:
- Scientifically accurate and region-appropriate
- Practical for farmers to implement
- Include specific quantities, timings, and measurements where applicable
- Cost estimates should be realistic for the region (use appropriate currency)
- Include 3-5 high-yield varieties for seed selection
- Include 2-3 major pests and diseases with detailed management
- Provide 5-8 items in cost breakdown
- Include water-saving and sustainable farming practices

IMPORTANT: Keep responses concise but complete. Use bullet points and short phrases. Ensure the JSON is valid and complete.

Start your response with { and end with } - nothing else.`;
  }

  /**
   * Parse Gemini response and validate structure
   */
  private parseGeminiResponse(response: string): CropGuideResponse {
    try {
      // Clean the response - remove any markdown formatting or extra text
      let cleanResponse = response.trim();
      
      // Remove markdown code blocks if present
      cleanResponse = cleanResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Find JSON content between curly braces
      const jsonStart = cleanResponse.indexOf('{');
      const jsonEnd = cleanResponse.lastIndexOf('}');
      
      if (jsonStart === -1 || jsonEnd === -1) {
        console.error('No valid JSON brackets found in response');
        console.error('Response preview:', cleanResponse.substring(0, 500));
        throw new Error('No valid JSON found in response');
      }
      
      cleanResponse = cleanResponse.substring(jsonStart, jsonEnd + 1);
      
      // Try to fix common JSON issues
      cleanResponse = this.fixCommonJsonIssues(cleanResponse);
      
      // Parse JSON
      const cropGuide = JSON.parse(cleanResponse) as CropGuideResponse;
      
      // Validate required fields
      this.validateCropGuide(cropGuide);
      
      return cropGuide;
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      console.error('Raw response length:', response.length);
      console.error('Raw response preview:', response.substring(0, 1000));
      
      // Return a fallback response instead of throwing
      return this.createFallbackResponse(response);
    }
  }

  /**
   * Fix common JSON formatting issues
   */
  private fixCommonJsonIssues(jsonString: string): string {
    // Remove trailing commas before closing brackets/braces
    jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
    
    // Fix unescaped quotes in strings (basic attempt)
    jsonString = jsonString.replace(/: "([^"]*)"([^",}\]]*)"([^",}\]]*)",/g, ': "$1\\"$2\\"$3",');
    
    return jsonString;
  }

  /**
   * Create fallback response when parsing fails
   */
  private createFallbackResponse(originalResponse: string): CropGuideResponse {
    // Extract crop name from the original response if possible
    const cropNameMatch = originalResponse.match(/"name":\s*"([^"]+)"/);
    const cropName = cropNameMatch ? cropNameMatch[1] : 'Unknown Crop';
    
    console.log(`⚠️  Creating fallback response for: ${cropName}`);
    
    return {
      name: cropName,
      scientificName: "Scientific name not available",
      category: "General Crop",
      season: "Varies by region",
      duration: "Varies",
      difficulty: "Medium" as const,
      introduction: `${cropName} cultivation guide. The AI-generated detailed guide is temporarily unavailable, but basic information is provided below.`,
      climate: {
        temperature: { min: 15, max: 35, optimal: "20-30°C" },
        rainfall: { annual: "500-1500mm", critical: "During flowering and fruit development" },
        humidity: "60-80%",
        sunlight: "6-8 hours daily"
      },
      soil: {
        type: ["Loamy", "Well-drained"],
        ph: { min: 6.0, max: 7.5 },
        drainage: "Good drainage required",
        preparation: ["Deep ploughing", "Add organic matter", "Level the field"]
      },
      seedSelection: {
        varieties: [{
          name: "Local variety",
          yield: "Varies",
          duration: "Varies",
          features: ["Adapted to local conditions"]
        }],
        seedTreatment: ["Use certified seeds", "Treat with fungicide if needed"],
        spacing: { rowToRow: "30-45cm", plantToPlant: "20-30cm" },
        sowingMethod: ["Direct sowing", "Transplanting"],
        sowingDepth: "2-3cm"
      },
      nutrition: {
        basalFertilizer: [{
          nutrient: "NPK",
          quantity: "As per soil test",
          timing: "At planting"
        }],
        topDressing: [{
          stage: "Growth stage",
          fertilizer: "Nitrogen",
          quantity: "As recommended"
        }],
        organicOptions: ["Farmyard manure", "Compost"],
        deficiencySymptoms: [{
          nutrient: "Nitrogen",
          symptoms: ["Yellowing of leaves", "Stunted growth"]
        }]
      },
      irrigation: {
        frequency: "As needed based on soil moisture",
        criticalStages: ["Germination", "Flowering", "Fruit development"],
        waterRequirement: "Varies by crop and season",
        methods: ["Drip irrigation", "Sprinkler", "Flood irrigation"],
        waterSavingTips: ["Use mulching", "Drip irrigation", "Monitor soil moisture"]
      },
      weedManagement: {
        commonWeeds: ["Grass weeds", "Broadleaf weeds"],
        preventiveMeasures: ["Clean cultivation", "Crop rotation"],
        herbicides: [{
          name: "Consult local expert",
          application: "As recommended",
          dosage: "Follow label instructions"
        }],
        manualMethods: ["Hand weeding", "Hoeing"]
      },
      pestDisease: {
        majorPests: [{
          name: "Common pests",
          symptoms: ["Leaf damage", "Reduced yield"],
          prevention: ["Regular monitoring", "Clean cultivation"],
          treatment: ["Integrated pest management", "Consult expert"]
        }],
        majorDiseases: [{
          name: "Common diseases",
          symptoms: ["Leaf spots", "Wilting"],
          prevention: ["Good drainage", "Crop rotation"],
          treatment: ["Fungicide application", "Remove infected plants"]
        }],
        ipmStrategies: ["Biological control", "Cultural practices", "Chemical control as last resort"]
      },
      harvesting: {
        maturityIndicators: ["Color change", "Firmness", "Size"],
        harvestingMethod: ["Hand picking", "Mechanical harvesting"],
        postHarvest: {
          cleaning: ["Remove debris", "Sort by quality"],
          drying: ["Sun drying", "Mechanical drying"],
          storage: ["Cool, dry place", "Proper ventilation"],
          packaging: ["Clean containers", "Proper labeling"]
        },
        shelfLife: "Varies by crop and storage conditions"
      },
      economics: {
        costBreakdown: [
          { item: "Seeds", cost: 2000, unit: "per acre" },
          { item: "Fertilizers", cost: 5000, unit: "per acre" },
          { item: "Labor", cost: 10000, unit: "per acre" },
          { item: "Irrigation", cost: 3000, unit: "per acre" },
          { item: "Pesticides", cost: 2000, unit: "per acre" }
        ],
        expectedYield: { min: 10, max: 20, unit: "quintals per acre" },
        marketPrice: { min: 1000, max: 2000, unit: "per quintal" },
        profitEstimate: { gross: 30000, net: 8000 }
      },
      bestPractices: {
        climateSmartTips: ["Use drought-resistant varieties", "Efficient water use"],
        sustainabilityTips: ["Organic farming", "Crop rotation", "Soil conservation"],
        modernTechniques: ["Precision agriculture", "GPS-guided machinery"],
        commonMistakes: ["Overwatering", "Excessive fertilizer use", "Ignoring pest monitoring"]
      }
    };
  }

  /**
   * Validate crop guide structure
   */
  private validateCropGuide(guide: any): void {
    const requiredFields = [
      'name', 'scientificName', 'category', 'season', 'duration', 'difficulty',
      'introduction', 'climate', 'soil', 'seedSelection', 'nutrition',
      'irrigation', 'weedManagement', 'pestDisease', 'harvesting',
      'economics', 'bestPractices'
    ];

    for (const field of requiredFields) {
      if (!guide[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate difficulty level
    if (!['Easy', 'Medium', 'Hard'].includes(guide.difficulty)) {
      guide.difficulty = 'Medium'; // Default fallback
    }

    // Ensure arrays exist
    const arrayFields = [
      'soil.type', 'soil.preparation', 'seedSelection.varieties',
      'seedSelection.seedTreatment', 'seedSelection.sowingMethod',
      'nutrition.basalFertilizer', 'nutrition.topDressing', 'nutrition.organicOptions',
      'nutrition.deficiencySymptoms', 'irrigation.criticalStages', 'irrigation.methods',
      'irrigation.waterSavingTips', 'weedManagement.commonWeeds',
      'weedManagement.preventiveMeasures', 'weedManagement.herbicides',
      'weedManagement.manualMethods', 'pestDisease.majorPests',
      'pestDisease.majorDiseases', 'pestDisease.ipmStrategies',
      'harvesting.maturityIndicators', 'harvesting.harvestingMethod',
      'economics.costBreakdown', 'bestPractices.climateSmartTips',
      'bestPractices.sustainabilityTips', 'bestPractices.modernTechniques',
      'bestPractices.commonMistakes'
    ];

    for (const fieldPath of arrayFields) {
      const value = this.getNestedValue(guide, fieldPath);
      if (!Array.isArray(value)) {
        console.warn(`Field ${fieldPath} is not an array, setting to empty array`);
        this.setNestedValue(guide, fieldPath, []);
      }
    }
  }

  /**
   * Get nested object value by path
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Set nested object value by path
   */
  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  /**
   * Get list of popular crops for suggestions
   */
  getPopularCrops(): string[] {
    return [
      'Rice', 'Wheat', 'Maize', 'Tomato', 'Potato', 'Onion', 'Cotton',
      'Sugarcane', 'Soybean', 'Groundnut', 'Sunflower', 'Mustard',
      'Chili', 'Brinjal', 'Okra', 'Cabbage', 'Cauliflower', 'Carrot',
      'Beans', 'Peas', 'Cucumber', 'Watermelon', 'Mango', 'Banana',
      'Coconut', 'Tea', 'Coffee', 'Rubber', 'Cardamom', 'Turmeric'
    ];
  }
}

export const cropGuideService = new CropGuideService();
export type { CropGuideRequest, CropGuideResponse };