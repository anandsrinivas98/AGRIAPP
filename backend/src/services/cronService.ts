import cron from 'node-cron';
import https from 'https';
import http from 'http';
import { cleanupExpiredPendingUsers } from '../scripts/cleanupPendingUsers';
import { config } from '../config';

/**
 * Pings the /health endpoint to prevent Render from spinning down the instance.
 * Uses API_BASE_URL (the production Render URL) so the ping goes through the
 * public internet — which is what Render counts as real traffic.
 */
function pingHealthEndpoint() {
  const url = `${config.api.baseUrl}/health`;
  const client = url.startsWith('https') ? https : http;

  const req = client.get(url, (res) => {
    console.log(`🏓 Keep-alive ping → ${url} [${res.statusCode}]`);
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

  // Keep Render instance alive — ping /health every 14 minutes
  // Render free tier sleeps after 15 minutes of inactivity.
  // Requires API_BASE_URL=https://your-app.onrender.com in Render environment variables.
  if (config.env === 'production') {
    if (!process.env.API_BASE_URL) {
      console.warn('⚠️  API_BASE_URL is not set — Render keep-alive ping will NOT run.');
      console.warn('   Set API_BASE_URL=https://your-app.onrender.com in Render environment variables.');
    } else {
      cron.schedule('*/14 * * * *', () => {
        pingHealthEndpoint();
      });
      console.log(`   - Render keepalive: Every 14 minutes → ${config.api.baseUrl}/health`);
    }
  }

  console.log('✅ Cron jobs initialized:');
  console.log('   - Pending users cleanup: Daily at 2:00 AM');
}
