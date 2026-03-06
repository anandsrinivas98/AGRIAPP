const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixExistingUsers() {
  try {
    console.log('🔧 Fixing existing users...\n');
    
    // Option 1: Set all existing users to verified
    const result = await prisma.user.updateMany({
      where: {
        verified: false
      },
      data: {
        verified: true
      }
    });

    console.log(`✅ Updated ${result.count} user(s) to verified status`);
    
    // Show all users now
    const users = await prisma.user.findMany({
      select: {
        email: true,
        verified: true,
      }
    });

    console.log('\n📋 Current users:');
    users.forEach(user => {
      console.log(`  - ${user.email} (verified: ${user.verified})`);
    });

    console.log('\n✨ All users are now verified and can login!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixExistingUsers();
