require('dotenv').config();
const { exec } = require('child_process');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabaseAndSetup() {
  console.log('🔍 Checking database connection...\n');
  
  try {
    // Try to connect to database
    await prisma.$connect();
    console.log('✅ Database is connected!\n');
    
    // Check if forum tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'forum_categories'
    `;
    
    if (tables.length > 0) {
      console.log('✅ Forum tables already exist!');
      console.log('📊 Checking forum data...\n');
      
      const categoriesCount = await prisma.forumCategory.count();
      const threadsCount = await prisma.forumThread.count();
      
      console.log(`   Categories: ${categoriesCount}`);
      console.log(`   Threads: ${threadsCount}`);
      
      if (categoriesCount === 0) {
        console.log('\n📝 No data found. Running seeder...\n');
        await runSeeder();
      } else {
        console.log('\n✅ Forum is already set up and has data!');
        console.log('\n🎉 You can access the forum at:');
        console.log('   http://localhost:3001/features/farmer-forum\n');
      }
    } else {
      console.log('⚠️  Forum tables not found. Running migration...\n');
      await runMigration();
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n💡 The database might be sleeping. Please try again in 1-2 minutes.');
    console.log('   Or run manually: cd backend && npx prisma db push\n');
  } finally {
    await prisma.$disconnect();
  }
}

function runMigration() {
  return new Promise((resolve, reject) => {
    console.log('🔄 Running database migration...\n');
    
    exec('npx prisma db push --accept-data-loss', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Migration failed:', error.message);
        reject(error);
        return;
      }
      
      console.log(stdout);
      console.log('✅ Migration completed successfully!\n');
      console.log('📝 Running seeder...\n');
      
      runSeeder().then(resolve).catch(reject);
    });
  });
}

function runSeeder() {
  return new Promise((resolve, reject) => {
    exec('node seed-forum.js', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Seeding failed:', error.message);
        reject(error);
        return;
      }
      
      console.log(stdout);
      console.log('\n✅ Forum setup complete!');
      console.log('\n🎉 Access the forum at:');
      console.log('   http://localhost:3001/features/farmer-forum\n');
      console.log('📚 Documentation:');
      console.log('   - FARMER_FORUM_COMPLETE.md');
      console.log('   - FARMER_FORUM_QUICKSTART.md\n');
      
      resolve();
    });
  });
}

// Run the setup
checkDatabaseAndSetup();
