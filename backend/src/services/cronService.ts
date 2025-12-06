import cron from 'node-cron';
import { cleanupExpiredPendingUsers } from '../scripts/cleanupPendingUsers';

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

  console.log('✅ Cron jobs initialized:');
  console.log('   - Pending users cleanup: Daily at 2:00 AM');
}
