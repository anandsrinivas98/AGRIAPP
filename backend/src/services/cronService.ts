import cron from 'node-cron';
import { cleanupExpiredPendingUsers } from '../scripts/cleanupPendingUsers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Initialize all cron jobs
 */
export function initializeCronJobs() {
  console.log('⏰ Initializing cron jobs...');

  // Cleanup expired pending users every day at 2 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('\n🕐 Running scheduled cleanup of expired pending users...');
    try {
      await cleanupExpiredPendingUsers();
    } catch (error) {
      console.error('❌ Scheduled cleanup failed:', error);
    }
  });

  // Keep Neon DB alive every 4 minutes to prevent auto-suspend
  cron.schedule('*/4 * * * *', async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      // silently ignore — DB will wake on next real request
    }
  });

  console.log('✅ Cron jobs initialized:');
  console.log('   - Pending users cleanup: Daily at 2:00 AM');
  console.log('   - DB keepalive: Every 4 minutes');
}
