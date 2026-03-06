const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addTestWorker() {
  try {
    // Find test user
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@agrisense.com' },
    });

    if (!testUser) {
      console.log('❌ Test user not found!');
      return;
    }

    console.log(`✅ Found test user: ${testUser.email} (ID: ${testUser.id})`);

    // Create worker for test user
    const worker = await prisma.worker.create({
      data: {
        userId: testUser.id,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        email: 'john.doe@example.com',
        skills: ['harvesting', 'planting', 'irrigation'],
        hourlyRate: 15.50,
        availability: {
          monday: [{ start: '08:00', end: '17:00' }],
          tuesday: [{ start: '08:00', end: '17:00' }],
          wednesday: [{ start: '08:00', end: '17:00' }],
          thursday: [{ start: '08:00', end: '17:00' }],
          friday: [{ start: '08:00', end: '17:00' }],
          saturday: [],
          sunday: [],
        },
        status: 'ACTIVE',
      },
    });

    console.log('\n✅ Worker created successfully!');
    console.log('==================');
    console.log(`Worker ID: ${worker.id}`);
    console.log(`Name: ${worker.firstName} ${worker.lastName}`);
    console.log(`Phone: ${worker.phone}`);
    console.log(`Skills: ${worker.skills.join(', ')}`);
    console.log(`Hourly Rate: $${worker.hourlyRate}`);
    console.log('');
    console.log('Now login as test@agrisense.com and you will see this worker!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestWorker();
