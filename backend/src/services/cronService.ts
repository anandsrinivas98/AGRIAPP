import cron from 'node-cron';
import https from 'https';
import http from 'http';
import { cleanupExpiredPendingUsers } from '../scripts/cleanupPendingUsers';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';

const prisma = new PrismaClient();

/**
 * Pings the /health endpoint to prevent Render from spinning down the instance.
 */
function pingHealthEndpoint() {
  const url = `${config.api.baseUrl}/health`;
  const client = url.startsWith('https') ? https : http;

  const req = client.get(url, (res) => {
    console.log(`🏓 Keep-alive ping → ${url} [${res.statusCode}]`);
    // Drain the response so the socket closes cleanly
    res.resume();
  });

  req.on('error', (err) => {
    console.warn(`⚠️  Keep-alive ping failed: ${err.message}`);
  });

  req.end();
}

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

  // Keep Render instance alive — ping /health every 14 minutes
  // Render free tier sleeps after 15 minutes of inactivity
  if (config.env === 'production') {
    cron.schedule('*/14 * * * *', () => {
      pingHealthEndpoint();
    });
    console.log('   - Render keepalive: Every 14 minutes (production only)');
  }

  console.log('✅ Cron jobs initialized:');
  console.log('   - Pending users cleanup: Daily at 2:00 AM');
  console.log('   - DB keepalive: Every 4 minutes');
}
