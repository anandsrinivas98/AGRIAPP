const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdminPassword() {
  try {
    const email = 'admin@example.com';
    const newPassword = 'admin123'; // Set a known password
    
    console.log(`🔧 Resetting password for: ${email}\n`);
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update the user
    const user = await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        verified: true, // Make sure it's verified
      },
    });

    console.log('✅ Password reset successfully!');
    console.log(`\n📋 Login credentials:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${newPassword}`);
    console.log(`\n🔐 You can now login with these credentials.`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
