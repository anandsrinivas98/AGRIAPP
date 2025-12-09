require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestAlerts() {
  try {
    console.log('🔍 Finding test user...');
    
    // Find the test user
    const user = await prisma.user.findUnique({
      where: { email: 'test@agrisense.com' }
    });

    if (!user) {
      console.error('❌ Test user not found');
      return;
    }

    console.log('✅ Found user:', user.email);

    // Find existing task if any
    const task = await prisma.labourTask.findFirst({
      where: { userId: user.id }
    });

    console.log('\n📝 Creating test alerts...');

    // Create various types of alerts (using valid AlertType enum values)
    const alerts = [
      {
        userId: user.id,
        taskId: task?.id || null,
        alertType: 'UPCOMING_TASK',
        title: 'Task Starting Soon',
        message: 'Tomato harvesting is scheduled to start in 2 hours. Make sure all workers are notified.',
        severity: 'INFO',
        actionRequired: false,
        isRead: false,
      },
      {
        userId: user.id,
        taskId: task?.id || null,
        alertType: 'LABOR_SHORTAGE',
        title: 'Labor Shortage Warning',
        message: 'You need 3 more workers for next week\'s harvesting tasks. Consider hiring temporary workers.',
        severity: 'WARNING',
        actionRequired: true,
        isRead: false,
      },
      {
        userId: user.id,
        taskId: task?.id || null,
        alertType: 'OVERTIME_WARNING',
        title: 'Overtime Alert',
        message: 'Worker John Doe has worked 45 hours this week. Consider redistributing workload.',
        severity: 'WARNING',
        actionRequired: true,
        isRead: false,
      },
      {
        userId: user.id,
        taskId: task?.id || null,
        alertType: 'TASK_DELAYED',
        title: 'Critical: Task Delayed',
        message: 'Irrigation maintenance task is 2 days behind schedule. Immediate action required.',
        severity: 'CRITICAL',
        actionRequired: true,
        isRead: false,
      },
      {
        userId: user.id,
        taskId: task?.id || null,
        alertType: 'DEADLINE_APPROACHING',
        title: 'Deadline Approaching',
        message: 'Harvesting task deadline is in 24 hours. Ensure all workers are ready.',
        severity: 'WARNING',
        actionRequired: true,
        isRead: false,
      },
      {
        userId: user.id,
        taskId: task?.id || null,
        alertType: 'SHIFT_CHANGE',
        title: 'Shift Change Required',
        message: 'Worker Jane Smith requested shift change for Friday. Approval needed.',
        severity: 'INFO',
        actionRequired: true,
        isRead: false,
      },
      {
        userId: user.id,
        taskId: task?.id || null,
        alertType: 'WORKER_ABSENCE',
        title: 'Worker Absence',
        message: 'Worker Mike Johnson called in sick. Reassign his tasks for today.',
        severity: 'CRITICAL',
        actionRequired: true,
        isRead: false,
      },
      {
        userId: user.id,
        taskId: task?.id || null,
        alertType: 'WEATHER_IMPACT',
        title: 'Weather Alert',
        message: 'Heavy rain predicted tomorrow. Consider rescheduling outdoor tasks.',
        severity: 'WARNING',
        actionRequired: true,
        isRead: false,
      },
      {
        userId: user.id,
        taskId: task?.id || null,
        alertType: 'LABOR_SURPLUS',
        title: 'Labor Surplus Detected',
        message: 'You have 2 extra workers scheduled for Wednesday. Consider reassigning them.',
        severity: 'INFO',
        actionRequired: false,
        isRead: false,
      },
    ];

    for (const alertData of alerts) {
      const alert = await prisma.scheduleAlert.create({
        data: alertData
      });
      console.log(`✅ Created alert: ${alert.title}`);
    }

    console.log('\n✅ Successfully created', alerts.length, 'test alerts!');
    console.log('\n📊 Alert Summary:');
    console.log('- INFO: 3 alerts');
    console.log('- WARNING: 4 alerts');
    console.log('- CRITICAL: 2 alerts');
    console.log('\n🔔 Refresh the Labour Scheduling page to see the alerts!');
    console.log('💡 Navigate to the Alerts tab to view all notifications.');

  } catch (error) {
    console.error('❌ Error creating test alerts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestAlerts();
