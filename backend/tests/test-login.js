const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    const email = 'admin@example.com';
    const testPassword = 'admin123'; // Try common passwords
    
    console.log(`🔍 Testing login for: ${email}\n`);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('❌ User not found in database');
      return;
    }

    console.log('✅ User found:');
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Verified: ${user.verified}`);
    console.log(`   - Has password: ${user.password ? 'Yes' : 'No'}`);
    console.log(`   - Password hash: ${user.password.substring(0, 20)}...`);
    
    // Try to verify password
    console.log(`\n🔐 Testing password: "${testPassword}"`);
    const isValid = await bcrypt.compare(testPassword, user.password);
    console.log(`   Result: ${isValid ? '✅ Valid' : '❌ Invalid'}`);

    if (!isValid) {
      console.log('\n💡 The password might be different. Common defaults:');
      console.log('   - admin123');
      console.log('   - password');
      console.log('   - Admin@123');
      console.log('\n   Or check your database seed script for the actual password.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
