const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('Checking users in database...\n');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        verified: true,
        createdAt: true,
      }
    });

    console.log(`Found ${users.length} user(s):\n`);
    users.forEach(user => {
      console.log(`- ${user.email} (verified: ${user.verified})`);
    });

    const pendingUsers = await prisma.pendingUser.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        createdAt: true,
      }
    });

    console.log(`\nFound ${pendingUsers.length} pending user(s):\n`);
    pendingUsers.forEach(user => {
      console.log(`- ${user.email} (pending verification)`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
