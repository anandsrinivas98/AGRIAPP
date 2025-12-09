const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@agrisense.com' },
    });

    if (existingUser) {
      console.log('✅ Test user already exists!');
      console.log('Email: test@agrisense.com');
      console.log('Password: Test@123');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Test@123', 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: 'test@agrisense.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567890',
        role: 'FARMER',
        verified: true,
      },
    });

    console.log('✅ Test user created successfully!');
    console.log('');
    console.log('Login Credentials:');
    console.log('==================');
    console.log('Email: test@agrisense.com');
    console.log('Password: Test@123');
    console.log('');
    console.log('You can now login at: http://localhost:3000/auth/login');
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
