import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Cleanup expired pending user registrations
 * Deletes pending users whose OTP has expired for more than 24 hours
 */
async function cleanupExpiredPendingUsers() {
  try {
    console.log('🧹 Starting cleanup of expired pending users...');

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await prisma.pendingUser.deleteMany({
      where: {
        verificationOtpExpiry: {
          lt: twentyFourHoursAgo,
        },
      },
    });

    console.log(`✅ Deleted ${result.count} expired pending user(s)`);
    
    if (result.count > 0) {
      console.log('   These registrations were never completed and have been cleaned up.');
    }

    return result.count;
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  cleanupExpiredPendingUsers()
    .then((count) => {
      console.log(`\n✨ Cleanup completed. Removed ${count} expired registration(s).`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Cleanup failed:', error);
      process.exit(1);
    });
}

export { cleanupExpiredPendingUsers };
