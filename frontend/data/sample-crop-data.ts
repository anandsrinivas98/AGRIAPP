export const sampleCropData = {
  name: "Rice (Paddy)",
  scientificName: "Oryza sativa",
  category: "Cereal Crop",
  season: "Kharif",
  duration: "120-150 days",
  difficulty: "Medium" as const,
  introduction: "Rice is one of the most important staple food crops in the world, feeding more than half of the global population. It is primarily grown in flooded fields and requires specific climatic conditions for optimal growth. Rice cultivation has been practiced for thousands of years and remains crucial for food security.",
  
  climate: {
    temperature: {
      min: 20,
      max: 35,
      optimal: "25-30°C"
    },
    rainfall: {
      annual: "1000-2000mm",
      critical: "During tillering and grain filling stages"
    },
    humidity: "80-90%",
    sunlight: "6-8 hours daily"
  },
  
  soil: {
    type: ["Clay", "Clay loam", "Silty clay"],
    ph: {
      min: 5.5,
      max: 7.0
    },
    drainage: "Poor drainage preferred (flooded conditions)",
    preparation: [
      "Deep ploughing 2-3 times",
      "Puddling for water retention",
      "Leveling the field",
      "Creating bunds for water management"
    ]
  },
  
  seedSelection: {
    varieties: [
      {
        name: "IR64",
        yield: "4-5 tons/ha",
        duration: "125 days",
        features: ["High yielding", "Disease resistant", "Good grain quality"]
      },
      {
        name: "Swarna",
        yield: "5-6 tons/ha", 
        duration: "145 days",
        features: ["Medium duration", "Good cooking quality", "Widely adapted"]
      },
      {
        name: "BPT 5204",
        yield: "6-7 tons/ha",
        duration: "150 days",
        features: ["High yielding", "Fine grain", "Export quality"]
      }
    ],
    seedTreatment: [
      "Soak seeds in water for 24 hours",
      "Treat with Carbendazim @ 2g/kg seed",
      "Dry in shade before sowing",
      "Use certified seeds only"
    ],
    spacing: {
      rowToRow: "20cm",
      plantToPlant: "15cm"
    },
    sowingMethod: [
      "Transplanting (recommended)",
      "Direct seeding",
      "System of Rice Intensification (SRI)"
    ],
    sowingDepth: "2-3cm"
  },
  
  nutrition: {
    basalFertilizer: [
      {
        nutrient: "Nitrogen (N)",
        quantity: "60kg/ha",
        timing: "At transplanting"
      },
      {
        nutrient: "Phosphorus (P2O5)",
        quantity: "40kg/ha", 
        timing: "At transplanting"
      },
      {
        nutrient: "Potassium (K2O)",
        quantity: "40kg/ha",
        timing: "At transplanting"
      }
    ],
    topDressing: [
      {
        stage: "Tillering stage (25-30 DAT)",
        fertilizer: "Urea",
        quantity: "30kg N/ha"
      },
      {
        stage: "Panicle initiation (45-50 DAT)",
        fertilizer: "Urea",
        quantity: "30kg N/ha"
      }
    ],
    organicOptions: [
      "Farm Yard Manure (FYM) - 10 tons/ha",
      "Compost - 5 tons/ha",
      "Green manuring with Dhaincha",
      "Vermicompost - 3 tons/ha"
    ],
    deficiencySymptoms: [
      {
        nutrient: "Nitrogen",
        symptoms: ["Yellowing of older leaves", "Stunted growth", "Reduced tillering"]
      },
      {
        nutrient: "Phosphorus", 
        symptoms: ["Purple coloration of leaves", "Delayed maturity", "Poor root development"]
      },
      {
        nutrient: "Potassium",
        symptoms: ["Brown scorching of leaf margins", "Weak stems", "Increased lodging"]
      }
    ]
  },
  
  irrigation: {
    frequency: "Maintain 2-5cm water level throughout",
    criticalStages: [
      "Transplanting to establishment",
      "Tillering stage",
      "Panicle initiation",
      "Grain filling stage"
    ],
    waterRequirement: "1200-1500mm total",
    methods: [
      "Flood irrigation (traditional)",
      "Alternate wetting and drying (AWD)",
      "Drip irrigation (for aerobic rice)"
    ],
    waterSavingTips: [
      "Use System of Rice Intensification (SRI)",
      "Practice Alternate Wetting and Drying",
      "Maintain proper bund height",
      "Use laser land leveling"
    ]
  },
  
  weedManagement: {
    commonWeeds: [
      "Echinochloa spp. (Jungle rice)",
      "Cyperus rotundus (Nut grass)",
      "Monochoria vaginalis",
      "Ludwigia spp."
    ],
    preventiveMeasures: [
      "Use certified weed-free seeds",
      "Proper field preparation",
      "Maintain proper water level",
      "Use competitive varieties"
    ],
    herbicides: [
      {
        name: "Pretilachlor",
        application: "Pre-emergence (3-5 DAT)",
        dosage: "750g a.i./ha"
      },
      {
        name: "Bispyribac sodium",
        application: "Post-emergence (15-20 DAT)",
        dosage: "25g a.i./ha"
      }
    ],
    manualMethods: [
      "Hand weeding at 20 and 40 DAT",
      "Use of cono weeder",
      "Rotary weeder operation"
    ]
  },
  
  pestDisease: {
    majorPests: [
      {
        name: "Brown Plant Hopper (BPH)",
        symptoms: [
          "Yellowing and drying of plants",
          "Hopper burn symptoms",
          "Stunted growth"
        ],
        prevention: [
          "Use resistant varieties",
          "Avoid excessive nitrogen",
          "Maintain proper spacing"
        ],
        treatment: [
          "Spray Imidacloprid 17.8% SL @ 100ml/ha",
          "Use light traps",
          "Release natural enemies"
        ]
      },
      {
        name: "Stem Borer",
        symptoms: [
          "Dead hearts in vegetative stage",
          "White ears in reproductive stage",
          "Presence of bore holes"
        ],
        prevention: [
          "Use pheromone traps",
          "Avoid staggered planting",
          "Remove stubbles after harvest"
        ],
        treatment: [
          "Spray Chlorantraniliprole @ 150ml/ha",
          "Release Trichogramma parasites",
          "Use light traps"
        ]
      }
    ],
    majorDiseases: [
      {
        name: "Blast Disease",
        symptoms: [
          "Diamond-shaped lesions on leaves",
          "Neck rot in panicles",
          "Node blast symptoms"
        ],
        prevention: [
          "Use resistant varieties",
          "Avoid excessive nitrogen",
          "Ensure proper drainage"
        ],
        treatment: [
          "Spray Tricyclazole @ 750g/ha",
          "Use Carbendazim @ 500g/ha",
          "Improve field sanitation"
        ]
      },
      {
        name: "Bacterial Leaf Blight",
        symptoms: [
          "Water-soaked lesions on leaves",
          "Yellow to white stripes",
          "Kresek symptom in severe cases"
        ],
        prevention: [
          "Use certified seeds",
          "Avoid injury to plants",
          "Maintain proper water management"
        ],
        treatment: [
          "Spray Streptocycline @ 300ppm",
          "Use copper-based fungicides",
          "Remove infected plants"
        ]
      }
    ],
    ipmStrategies: [
      "Use of resistant/tolerant varieties",
      "Biological control agents",
      "Pheromone traps for monitoring",
      "Judicious use of pesticides",
      "Crop rotation practices",
      "Field sanitation measures"
    ]
  },
  
  harvesting: {
    maturityIndicators: [
      "80% of grains turn golden yellow",
      "Moisture content 20-25%",
      "Grains become hard",
      "Easy separation from panicle"
    ],
    harvestingMethod: [
      "Cut crop 15cm above ground level",
      "Harvest in early morning",
      "Use sharp sickle or combine harvester",
      "Avoid over-maturity to prevent shattering"
    ],
    postHarvest: {
      cleaning: [
        "Remove straw and foreign matter",
        "Use winnowing or cleaning machines",
        "Grade according to size and quality"
      ],
      drying: [
        "Sun dry to 14% moisture content",
        "Use mechanical dryers if needed",
        "Spread in thin layers on clean surface",
        "Turn frequently during drying"
      ],
      storage: [
        "Store in moisture-proof containers",
        "Use proper storage structures",
        "Maintain 12-14% moisture content",
        "Regular monitoring for pests"
      ],
      packaging: [
        "Use jute bags or PP bags",
        "Proper labeling with variety and date",
        "Ensure bags are clean and dry",
        "Stack properly in storage"
      ]
    },
    shelfLife: "12-18 months under proper storage"
  },
  
  economics: {
    costBreakdown: [
      { item: "Land preparation", cost: 8000, unit: "per acre" },
      { item: "Seeds", cost: 2000, unit: "per acre" },
      { item: "Fertilizers", cost: 6000, unit: "per acre" },
      { item: "Pesticides", cost: 3000, unit: "per acre" },
      { item: "Labor", cost: 15000, unit: "per acre" },
      { item: "Irrigation", cost: 4000, unit: "per acre" },
      { item: "Harvesting", cost: 5000, unit: "per acre" },
      { item: "Miscellaneous", cost: 2000, unit: "per acre" }
    ],
    expectedYield: {
      min: 20,
      max: 25,
      unit: "quintals per acre"
    },
    marketPrice: {
      min: 1800,
      max: 2200,
      unit: "per quintal"
    },
    profitEstimate: {
      gross: 50000,
      net: 15000
    }
  },
  
  bestPractices: {
    climateSmartTips: [
      "Use drought-tolerant varieties in water-scarce areas",
      "Practice System of Rice Intensification (SRI)",
      "Adopt direct seeded rice (DSR) where applicable",
      "Use weather-based agro-advisories",
      "Implement precision agriculture techniques"
    ],
    sustainabilityTips: [
      "Practice crop rotation with legumes",
      "Use organic fertilizers and bio-pesticides",
      "Implement integrated nutrient management",
      "Conserve water through efficient irrigation",
      "Maintain soil health through organic matter"
    ],
    modernTechniques: [
      "Use of drones for monitoring and spraying",
      "GPS-guided machinery for precision farming",
      "Soil testing for nutrient management",
      "Weather stations for micro-climate monitoring",
      "Mobile apps for crop advisory services"
    ],
    commonMistakes: [
      "Excessive use of nitrogen fertilizer",
      "Improper water management",
      "Ignoring pest and disease monitoring",
      "Poor post-harvest handling",
      "Not following recommended spacing",
      "Using uncertified or poor-quality seeds"
    ]
  }
};