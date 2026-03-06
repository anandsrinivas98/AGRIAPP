require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedForum() {
  try {
    console.log('🌱 Seeding Farmer Forum data...\n');

    // Find test user
    const user = await prisma.user.findUnique({
      where: { email: 'test@agrisense.com' }
    });

    if (!user) {
      console.error('❌ Test user not found. Please create a user first.');
      return;
    }

    console.log('✅ Found user:', user.email);

    // Create Categories
    console.log('\n📁 Creating categories...');
    const categories = [
      {
        name: 'Crop Cultivation',
        slug: 'crop-cultivation',
        description: 'Discuss crop growing techniques, varieties, and best practices',
        icon: '🌾',
        color: '#10b981',
        order: 1
      },
      {
        name: 'Livestock & Poultry',
        slug: 'livestock-poultry',
        description: 'Animal husbandry, dairy farming, and poultry management',
        icon: '🐄',
        color: '#f59e0b',
        order: 2
      },
      {
        name: 'Farm Machinery',
        slug: 'farm-machinery',
        description: 'Equipment, tools, and machinery discussions',
        icon: '🚜',
        color: '#3b82f6',
        order: 3
      },
      {
        name: 'Pest & Disease Control',
        slug: 'pest-disease-control',
        description: 'Identify and manage pests, diseases, and weeds',
        icon: '🐛',
        color: '#ef4444',
        order: 4
      },
      {
        name: 'Soil & Fertilizers',
        slug: 'soil-fertilizers',
        description: 'Soil health, fertilization, and nutrient management',
        icon: '🌱',
        color: '#8b5cf6',
        order: 5
      },
      {
        name: 'Market & Prices',
        slug: 'market-prices',
        description: 'Market trends, pricing, and selling strategies',
        icon: '💰',
        color: '#ec4899',
        order: 6
      },
      {
        name: 'Government Schemes',
        slug: 'government-schemes',
        description: 'Subsidies, loans, insurance, and government programs',
        icon: '🏛️',
        color: '#06b6d4',
        order: 7
      },
      {
        name: 'Success Stories',
        slug: 'success-stories',
        description: 'Share your farming success and inspire others',
        icon: '⭐',
        color: '#f59e0b',
        order: 8
      }
    ];

    const createdCategories = [];
    for (const category of categories) {
      const created = await prisma.forumCategory.create({ data: category });
      createdCategories.push(created);
      console.log(`✅ Created category: ${created.name}`);
    }

    // Create Sample Threads
    console.log('\n💬 Creating sample threads...');
    const threads = [
      {
        categoryId: createdCategories[0].id,
        authorId: user.id,
        title: 'Best tomato varieties for summer season?',
        content: 'I am planning to grow tomatoes this summer. Which varieties give the best yield in hot weather? I have tried Pusa Ruby before but looking for better options. Any suggestions from experienced farmers?',
        tags: ['tomato', 'summer', 'varieties'],
        location: 'Maharashtra',
        isPinned: true
      },
      {
        categoryId: createdCategories[0].id,
        authorId: user.id,
        title: 'Organic farming: Is it profitable?',
        content: 'I want to switch to organic farming but worried about the initial costs and market demand. Has anyone made this transition successfully? Please share your experience and tips.',
        tags: ['organic', 'profitability', 'transition'],
        location: 'Punjab'
      },
      {
        categoryId: createdCategories[1].id,
        authorId: user.id,
        title: 'Dairy farming: How to increase milk production?',
        content: 'My cows are giving less milk than expected. I feed them properly and keep them healthy. What else can I do to improve milk yield? Any specific feed supplements you recommend?',
        tags: ['dairy', 'milk-production', 'cattle'],
        location: 'Gujarat'
      },
      {
        categoryId: createdCategories[2].id,
        authorId: user.id,
        title: 'Looking for affordable tractor options',
        content: 'Need to buy a tractor for my 10-acre farm. Budget is around 5-6 lakhs. Which brands offer good value for money? Should I go for new or used?',
        tags: ['tractor', 'machinery', 'buying-guide'],
        location: 'Haryana'
      },
      {
        categoryId: createdCategories[3].id,
        authorId: user.id,
        title: 'White fly attack on cotton crop - urgent help needed!',
        content: 'My cotton crop is severely affected by white flies. I have tried neem oil spray but it is not working. What pesticides are effective? Please help urgently!',
        tags: ['cotton', 'whitefly', 'pest-control', 'urgent'],
        location: 'Telangana'
      },
      {
        categoryId: createdCategories[5].id,
        authorId: user.id,
        title: 'Current onion prices in your area?',
        content: 'Onion prices are fluctuating a lot. What are the current rates in your local mandi? I am in Maharashtra and getting ₹20-25 per kg. Is it better in other states?',
        tags: ['onion', 'prices', 'market'],
        location: 'Maharashtra'
      }
    ];

    for (const thread of threads) {
      const slug = thread.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        + '-' + Date.now();
      
      const created = await prisma.forumThread.create({
        data: { ...thread, slug }
      });
      console.log(`✅ Created thread: ${created.title}`);

      // Add some replies
      await prisma.forumReply.create({
        data: {
          threadId: created.id,
          authorId: user.id,
          content: 'Great question! I have some experience with this. Let me share what worked for me...',
          isExpert: false
        }
      });
    }

    // Create Marketplace Listings
    console.log('\n🛒 Creating marketplace listings...');
    const listings = [
      {
        sellerId: user.id,
        title: 'Tractor - Mahindra 575 DI (2018 model)',
        description: 'Well-maintained tractor, only 1200 hours used. All papers clear. Selling due to farm size reduction. Price negotiable.',
        category: 'MACHINERY',
        price: 450000,
        location: 'Pune, Maharashtra',
        district: 'Pune',
        state: 'Maharashtra',
        condition: 'GOOD',
        contactPhone: '+91-9876543210',
        contactEmail: 'tractor.seller@agrisense.com'
      },
      {
        sellerId: user.id,
        title: 'Organic Wheat Seeds - 100 kg',
        description: 'Certified organic wheat seeds, variety HD-2967. High germination rate. Suitable for all soil types.',
        category: 'SEEDS',
        price: 3500,
        unit: 'quintal',
        quantity: 100,
        location: 'Ludhiana, Punjab',
        district: 'Ludhiana',
        state: 'Punjab',
        condition: 'NEW',
        contactPhone: '+91-9876543211',
        contactEmail: 'wheat.seeds@agrisense.com'
      },
      {
        sellerId: user.id,
        title: 'Drip Irrigation System - Complete Set',
        description: 'Complete drip irrigation system for 2-acre farm. Includes pipes, drippers, filters, and pump. 1 year old, excellent condition.',
        category: 'IRRIGATION',
        price: 75000,
        location: 'Nashik, Maharashtra',
        district: 'Nashik',
        state: 'Maharashtra',
        condition: 'LIKE_NEW',
        contactPhone: '+91-9876543212',
        contactEmail: 'irrigation.system@agrisense.com'
      },
      {
        sellerId: user.id,
        title: 'Fresh Tomatoes - Bulk Sale',
        description: 'Fresh farm tomatoes available for bulk purchase. Grade A quality. Direct from farm. Minimum order 100 kg.',
        category: 'PRODUCE',
        price: 25,
        unit: 'kg',
        quantity: 1000,
        location: 'Bangalore, Karnataka',
        district: 'Bangalore',
        state: 'Karnataka',
        condition: 'NEW',
        contactPhone: '+91-9876543213',
        contactEmail: 'tomatoes.farm@agrisense.com'
      }
    ];

    for (const listing of listings) {
      const created = await prisma.forumMarketplace.create({ data: listing });
      console.log(`✅ Created listing: ${created.title}`);
    }

    // Create Knowledge Articles
    console.log('\n📚 Creating knowledge articles...');
    const articles = [
      {
        authorId: user.id,
        title: 'Complete Guide to Drip Irrigation',
        slug: 'complete-guide-drip-irrigation-' + Date.now(),
        content: 'Drip irrigation is one of the most efficient watering methods for modern farming. This comprehensive guide covers everything you need to know about setting up and maintaining a drip irrigation system...',
        excerpt: 'Learn how to save water and increase crop yield with drip irrigation',
        category: 'IRRIGATION',
        tags: ['irrigation', 'water-management', 'drip-system'],
        readTime: 8,
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date()
      },
      {
        authorId: user.id,
        title: 'Organic Pest Control Methods',
        slug: 'organic-pest-control-methods-' + Date.now(),
        content: 'Chemical pesticides can harm the environment and reduce soil health. Here are proven organic methods to control pests naturally...',
        excerpt: 'Natural and effective ways to protect your crops from pests',
        category: 'PEST_CONTROL',
        tags: ['organic', 'pest-control', 'natural-farming'],
        readTime: 6,
        isPublished: true,
        publishedAt: new Date()
      },
      {
        authorId: user.id,
        title: 'Soil Testing: Why and How',
        slug: 'soil-testing-why-how-' + Date.now(),
        content: 'Soil testing is crucial for understanding your soil health and nutrient requirements. This guide explains the importance of soil testing and how to do it...',
        excerpt: 'Understand your soil better for improved crop productivity',
        category: 'SOIL_MANAGEMENT',
        tags: ['soil-testing', 'soil-health', 'nutrients'],
        readTime: 5,
        isPublished: true,
        publishedAt: new Date()
      }
    ];

    for (const article of articles) {
      const created = await prisma.knowledgeArticle.create({ data: article });
      console.log(`✅ Created article: ${created.title}`);
    }

    // Create Expert Session
    console.log('\n👨‍🏫 Creating expert session...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(15, 0, 0, 0);

    const session = await prisma.expertSession.create({
      data: {
        expertId: user.id,
        title: 'Modern Farming Techniques for Small Farmers',
        description: 'Join us for an interactive session on how small farmers can adopt modern farming techniques without heavy investment. Topics include precision farming, organic methods, and government schemes.',
        scheduledAt: tomorrow,
        duration: 60,
        maxParticipants: 100,
        status: 'SCHEDULED',
        tags: ['modern-farming', 'small-farmers', 'techniques']
      }
    });
    console.log(`✅ Created expert session: ${session.title}`);

    // Create User Reputation
    console.log('\n🏆 Creating user reputation...');
    await prisma.userReputation.create({
      data: {
        userId: user.id,
        points: 150,
        level: 3,
        badges: ['early-adopter', 'helpful-farmer', 'active-contributor'],
        threadsCreated: 6,
        repliesPosted: 12,
        bestAnswers: 2,
        helpfulVotes: 25
      }
    });
    console.log('✅ Created user reputation');

    console.log('\n✅ Forum seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Threads: ${threads.length}`);
    console.log(`   - Marketplace Listings: ${listings.length}`);
    console.log(`   - Knowledge Articles: ${articles.length}`);
    console.log(`   - Expert Sessions: 1`);
    console.log('\n🎉 Farmer Forum is ready to use!');

  } catch (error) {
    console.error('❌ Error seeding forum:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedForum();
