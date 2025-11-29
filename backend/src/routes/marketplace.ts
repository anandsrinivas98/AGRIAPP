import { Router } from 'express';
import { auth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/marketplace/overview:
 *   get:
 *     summary: Get market overview with real-time data
 *     tags: [Marketplace]
 *     responses:
 *       200:
 *         description: Market overview data
 */
router.get('/overview', async (req, res): Promise<void> => {
  try {
    const marketMetrics = [
      { 
        name: 'Wheat', 
        price: 275.50 + (Math.random() * 10 - 5), 
        change: 2.3 + (Math.random() * 2 - 1), 
        volume: '1.2M tons',
        sentiment: 'bullish',
        color: '#10B981'
      },
      { 
        name: 'Corn', 
        price: 195.75 + (Math.random() * 10 - 5), 
        change: -1.8 + (Math.random() * 2 - 1), 
        volume: '2.1M tons',
        sentiment: 'bearish',
        color: '#F59E0B'
      },
      { 
        name: 'Soybeans', 
        price: 465.20 + (Math.random() * 10 - 5), 
        change: 4.2 + (Math.random() * 2 - 1), 
        volume: '850K tons',
        sentiment: 'bullish',
        color: '#8B5CF6'
      },
      { 
        name: 'Rice', 
        price: 340.80 + (Math.random() * 10 - 5), 
        change: 0.9 + (Math.random() * 2 - 1), 
        volume: '1.8M tons',
        sentiment: 'neutral',
        color: '#06B6D4'
      },
    ];

    res.json({
      success: true,
      data: {
        metrics: marketMetrics,
        lastUpdated: new Date().toISOString(),
        status: 'active'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/marketplace/prices:
 *   get:
 *     summary: Get live commodity prices
 *     tags: [Marketplace]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category filter (grains, oilseeds, etc.)
 *     responses:
 *       200:
 *         description: Live commodity prices
 */
router.get('/prices', async (req, res): Promise<void> => {
  try {
    const { category } = req.query;
    
    const allPrices = [
      {
        id: '1',
        name: 'Wheat',
        symbol: 'WHEAT',
        currentPrice: 275.50 + (Math.random() * 10 - 5),
        change: 6.30 + (Math.random() * 2 - 1),
        changePercent: 2.34 + (Math.random() * 0.5 - 0.25),
        high24h: 280.00,
        low24h: 268.20,
        volume: '1.2M tons',
        category: 'grains',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Corn',
        symbol: 'CORN',
        currentPrice: 195.75 + (Math.random() * 10 - 5),
        change: -3.50 + (Math.random() * 2 - 1),
        changePercent: -1.76 + (Math.random() * 0.5 - 0.25),
        high24h: 201.25,
        low24h: 194.80,
        volume: '2.1M tons',
        category: 'grains',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Soybeans',
        symbol: 'SOY',
        currentPrice: 465.20 + (Math.random() * 10 - 5),
        change: 18.75 + (Math.random() * 2 - 1),
        changePercent: 4.20 + (Math.random() * 0.5 - 0.25),
        high24h: 470.00,
        low24h: 445.50,
        volume: '850K tons',
        category: 'oilseeds',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Rice',
        symbol: 'RICE',
        currentPrice: 340.80 + (Math.random() * 10 - 5),
        change: 3.10 + (Math.random() * 2 - 1),
        changePercent: 0.92 + (Math.random() * 0.5 - 0.25),
        high24h: 345.00,
        low24h: 335.20,
        volume: '1.8M tons',
        category: 'grains',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Cotton',
        symbol: 'COTTON',
        currentPrice: 82.45 + (Math.random() * 5 - 2.5),
        change: -1.25 + (Math.random() * 1 - 0.5),
        changePercent: -1.49 + (Math.random() * 0.5 - 0.25),
        high24h: 84.20,
        low24h: 81.80,
        volume: '650K bales',
        category: 'oilseeds',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '6',
        name: 'Sugar',
        symbol: 'SUGAR',
        currentPrice: 19.85 + (Math.random() * 2 - 1),
        change: 0.45 + (Math.random() * 0.5 - 0.25),
        changePercent: 2.32 + (Math.random() * 0.5 - 0.25),
        high24h: 20.10,
        low24h: 19.20,
        volume: '2.3M tons',
        category: 'grains',
        lastUpdated: new Date().toISOString()
      }
    ];

    let filteredPrices = allPrices;
    if (category && category !== 'all') {
      filteredPrices = allPrices.filter(p => p.category === category);
    }

    res.json({
      success: true,
      data: filteredPrices
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/marketplace/equipment:
 *   get:
 *     summary: Get equipment listings
 *     tags: [Marketplace]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Equipment category
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Sale or rent
 *     responses:
 *       200:
 *         description: Equipment listings
 */
router.get('/equipment', async (req, res): Promise<void> => {
  try {
    const { category, type } = req.query;
    
    const allEquipment = [
      {
        id: '1',
        title: 'John Deere 6120M Tractor',
        category: 'tractors',
        type: 'sale',
        price: 85000,
        location: 'Iowa, USA',
        condition: 'excellent',
        year: 2020,
        brand: 'John Deere',
        description: 'Well-maintained tractor with low hours. Perfect for medium to large farms.',
        seller: {
          name: 'Farm Equipment Co.',
          rating: 4.8,
          reviews: 127,
          phone: '+1-555-0123',
          email: 'sales@farmequip.com',
          verified: true
        },
        specifications: {
          'Engine Power': '120 HP',
          'Transmission': 'PowerQuad Plus',
          'Hours': '1,250',
          'Weight': '4,500 kg'
        },
        availability: 'available'
      },
      {
        id: '2',
        title: 'Case IH Axial-Flow 250 Combine',
        category: 'harvesters',
        type: 'rent',
        price: 450000,
        rentPrice: 2500,
        location: 'Nebraska, USA',
        condition: 'good',
        year: 2018,
        brand: 'Case IH',
        description: 'High-capacity combine harvester available for seasonal rental.',
        seller: {
          name: 'Harvest Solutions',
          rating: 4.6,
          reviews: 89,
          phone: '+1-555-0456',
          email: 'rent@harvestsol.com',
          verified: true
        },
        specifications: {
          'Engine Power': '473 HP',
          'Grain Tank': '350 bu',
          'Header Width': '35 ft',
          'Hours': '2,800'
        },
        availability: 'available'
      },
      {
        id: '3',
        title: 'Valley Center Pivot Irrigation',
        category: 'irrigation',
        type: 'sale',
        price: 125000,
        location: 'Kansas, USA',
        condition: 'new',
        year: 2023,
        brand: 'Valley',
        description: 'Brand new center pivot irrigation system with GPS guidance.',
        seller: {
          name: 'Irrigation Pro',
          rating: 4.9,
          reviews: 203,
          phone: '+1-555-0789',
          email: 'info@irrigationpro.com',
          verified: true
        },
        specifications: {
          'Coverage': '130 acres',
          'Length': '1,320 ft',
          'Flow Rate': '1,000 GPM',
          'Control': 'GPS Enabled'
        },
        availability: 'available'
      }
    ];

    let filtered = allEquipment;
    if (category && category !== 'all') {
      filtered = filtered.filter(e => e.category === category);
    }
    if (type && type !== 'all') {
      filtered = filtered.filter(e => e.type === type);
    }

    res.json({
      success: true,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/marketplace/crops:
 *   get:
 *     summary: Get crop trading listings
 *     tags: [Marketplace]
 *     parameters:
 *       - in: query
 *         name: cropType
 *         schema:
 *           type: string
 *         description: Type of crop
 *     responses:
 *       200:
 *         description: Crop listings
 */
router.get('/crops', async (req, res): Promise<void> => {
  try {
    const { cropType } = req.query;
    
    const allCrops = [
      {
        id: '1',
        cropType: 'wheat',
        quantity: 5000,
        unit: 'bushels',
        pricePerUnit: 6.50,
        totalPrice: 32500,
        quality: 'premium',
        harvestDate: '2024-09-15',
        location: 'Kansas, USA',
        seller: {
          name: 'Green Valley Farms',
          rating: 4.8,
          verified: true,
          phone: '+1-555-0123'
        },
        description: 'High-quality winter wheat, properly stored and tested.',
        status: 'available',
        expiresIn: '3 days'
      },
      {
        id: '2',
        cropType: 'corn',
        quantity: 10000,
        unit: 'bushels',
        pricePerUnit: 4.25,
        totalPrice: 42500,
        quality: 'grade-a',
        harvestDate: '2024-10-01',
        location: 'Iowa, USA',
        seller: {
          name: 'Midwest Grain Co.',
          rating: 4.6,
          verified: true,
          phone: '+1-555-0456'
        },
        description: 'Fresh corn harvest, excellent moisture content.',
        status: 'available',
        expiresIn: '5 days'
      },
      {
        id: '3',
        cropType: 'soybeans',
        quantity: 7500,
        unit: 'bushels',
        pricePerUnit: 12.80,
        totalPrice: 96000,
        quality: 'premium',
        harvestDate: '2024-09-20',
        location: 'Illinois, USA',
        seller: {
          name: 'Prairie Harvest',
          rating: 4.9,
          verified: true,
          phone: '+1-555-0789'
        },
        description: 'Organic soybeans, certified non-GMO.',
        status: 'available',
        expiresIn: '2 days'
      }
    ];

    let filtered = allCrops;
    if (cropType && cropType !== 'all') {
      filtered = allCrops.filter(c => c.cropType === cropType);
    }

    res.json({
      success: true,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/marketplace/suppliers:
 *   get:
 *     summary: Get supplier directory
 *     tags: [Marketplace]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Supplier category
 *     responses:
 *       200:
 *         description: Supplier listings
 */
router.get('/suppliers', async (req, res): Promise<void> => {
  try {
    const { category } = req.query;
    
    const allSuppliers = [
      {
        id: '1',
        name: 'AgriSupply Pro',
        category: 'seeds',
        description: 'Premium seed supplier with over 500 varieties of crops',
        location: 'Iowa, USA',
        coordinates: { lat: 41.8780, lng: -93.0977 },
        rating: 4.8,
        reviews: 234,
        verified: true,
        contact: {
          phone: '+1-555-0123',
          email: 'info@agrisupplypro.com',
          website: 'www.agrisupplypro.com'
        },
        products: ['Corn Seeds', 'Wheat Seeds', 'Soybean Seeds'],
        certifications: ['Organic Certified', 'ISO 9001'],
        yearsInBusiness: 15
      },
      {
        id: '2',
        name: 'GreenGrow Fertilizers',
        category: 'fertilizers',
        description: 'Eco-friendly fertilizer solutions for sustainable farming',
        location: 'California, USA',
        coordinates: { lat: 36.7783, lng: -119.4179 },
        rating: 4.6,
        reviews: 189,
        verified: true,
        contact: {
          phone: '+1-555-0456',
          email: 'sales@greengrow.com',
          website: 'www.greengrow.com'
        },
        products: ['Organic Fertilizers', 'NPK Blends', 'Micronutrients'],
        certifications: ['OMRI Listed', 'EPA Registered'],
        yearsInBusiness: 12
      },
      {
        id: '3',
        name: 'FarmTech Equipment',
        category: 'equipment',
        description: 'Modern farming equipment and machinery dealer',
        location: 'Nebraska, USA',
        coordinates: { lat: 41.4925, lng: -99.9018 },
        rating: 4.9,
        reviews: 312,
        verified: true,
        contact: {
          phone: '+1-555-0789',
          email: 'contact@farmtech.com',
          website: 'www.farmtech.com'
        },
        products: ['Tractors', 'Harvesters', 'Irrigation Systems'],
        certifications: ['Authorized Dealer', 'Service Certified'],
        yearsInBusiness: 20
      }
    ];

    let filtered = allSuppliers;
    if (category && category !== 'all') {
      filtered = allSuppliers.filter(s => s.category === category);
    }

    res.json({
      success: true,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/marketplace/analytics:
 *   get:
 *     summary: Get market analytics data
 *     tags: [Marketplace]
 *     parameters:
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *         description: Timeframe (7d or 30d)
 *     responses:
 *       200:
 *         description: Market analytics
 */
router.get('/analytics', async (req, res): Promise<void> => {
  try {
    const { timeframe = '30d' } = req.query;
    const days = timeframe === '7d' ? 7 : 30;

    // Generate price history
    const priceHistory = Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      wheat: 250 + Math.random() * 50,
      corn: 180 + Math.random() * 30,
      soybeans: 420 + Math.random() * 80,
    }));

    // Volume data
    const volumeData = [
      { crop: 'Wheat', volume: 1200000, value: 330000000 },
      { crop: 'Corn', volume: 2100000, value: 410000000 },
      { crop: 'Soybeans', volume: 850000, value: 395000000 },
      { crop: 'Rice', volume: 1800000, value: 613000000 },
      { crop: 'Cotton', volume: 650000, value: 53600000 },
    ];

    // Market share
    const marketShare = [
      { name: 'Wheat', value: 22 },
      { name: 'Corn', value: 35 },
      { name: 'Soybeans', value: 18 },
      { name: 'Rice', value: 15 },
      { name: 'Others', value: 10 },
    ];

    // Market insights
    const insights = [
      {
        id: 1,
        title: 'Wheat Prices Trending Up',
        description: 'Wheat prices have increased by 8.5% over the last 30 days due to strong export demand.',
        trend: 'up',
        impact: 'high',
        percentage: 8.5
      },
      {
        id: 2,
        title: 'Corn Volume Surge',
        description: 'Trading volume for corn has reached record highs with 2.1M tons traded this month.',
        trend: 'up',
        impact: 'medium',
        percentage: 15.3
      },
      {
        id: 3,
        title: 'Soybean Market Stabilizing',
        description: 'After recent volatility, soybean prices are showing signs of stabilization.',
        trend: 'neutral',
        impact: 'low',
        percentage: 1.2
      }
    ];

    res.json({
      success: true,
      data: {
        priceHistory,
        volumeData,
        marketShare,
        insights,
        summary: {
          totalMarketValue: 1800000000,
          totalVolume: 6600000,
          activeTraders: 2847,
          marketValueChange: 12.5,
          volumeChange: 8.3,
          tradersChange: 15.7
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
