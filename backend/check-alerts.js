require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAlerts() {
  try {
    console.log('🔍 Checking alerts in database...\n');
    
    const user = await prisma.user.findUnique({
      where: { email: 'test@agrisense.com' }
    });

    if (!user) {
      console.error('❌ Test user not found');
      return;
    }

    const alerts = await prisma.scheduleAlert.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📊 Found ${alerts.length} alerts for ${user.email}\n`);

    if (alerts.length === 0) {
      console.log('❌ No alerts found. Run create-test-alerts.js first.');
      return;
    }

    // Group by severity
    const bySeverity = {
      INFO: alerts.filter(a => a.severity === 'INFO'),
      WARNING: alerts.filter(a => a.severity === 'WARNING'),
      CRITICAL: alerts.filter(a => a.severity === 'CRITICAL')
    };

    console.log('📋 Alerts by Severity:');
    console.log(`   INFO: ${bySeverity.INFO.length}`);
    console.log(`   WARNING: ${bySeverity.WARNING.length}`);
    console.log(`   CRITICAL: ${bySeverity.CRITICAL.length}\n`);

    console.log('🔔 Alert Details:\n');
    alerts.forEach((alert, index) => {
      const icon = alert.severity === 'CRITICAL' ? '🚨' : 
                   alert.severity === 'WARNING' ? '⚠️' : '📅';
      const status = alert.isRead ? '✓ Read' : '○ Unread';
      console.log(`${index + 1}. ${icon} [${alert.severity}] ${alert.title}`);
      console.log(`   ${alert.message}`);
      console.log(`   Type: ${alert.alertType} | ${status} | Action: ${alert.actionRequired ? 'Required' : 'Not Required'}`);
      console.log('');
    });

    console.log('✅ All alerts are in the database!');
    console.log('💡 Refresh your browser to see them in the UI.');

  } catch (error) {
    console.error('❌ Error checking alerts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAlerts();
