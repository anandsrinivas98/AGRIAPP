const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkWorkers() {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    console.log('=== USERS IN DATABASE ===');
    users.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.firstName} ${user.lastName}`);
      console.log('---');
    });

    // Get all workers
    const workers = await prisma.worker.findMany({
      select: {
        id: true,
        userId: true,
        firstName: true,
        lastName: true,
        phone: true,
        skills: true,
        hourlyRate: true,
      },
    });

    console.log('\n=== WORKERS IN DATABASE ===');
    if (workers.length === 0) {
      console.log('No workers found!');
    } else {
      workers.forEach(worker => {
        console.log(`Worker ID: ${worker.id}`);
        console.log(`User ID: ${worker.userId}`);
        console.log(`Name: ${worker.firstName} ${worker.lastName}`);
        console.log(`Phone: ${worker.phone}`);
        console.log(`Skills: ${worker.skills.join(', ')}`);
        console.log(`Hourly Rate: $${worker.hourlyRate}`);
        console.log('---');
      });
    }

    // Check if userId matches
    if (workers.length > 0 && users.length > 0) {
      console.log('\n=== MATCHING CHECK ===');
      workers.forEach(worker => {
        const matchingUser = users.find(u => u.id === worker.userId);
        if (matchingUser) {
          console.log(`✅ Worker "${worker.firstName} ${worker.lastName}" belongs to user "${matchingUser.email}"`);
        } else {
          console.log(`❌ Worker "${worker.firstName} ${worker.lastName}" has invalid userId: ${worker.userId}`);
        }
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkWorkers();
