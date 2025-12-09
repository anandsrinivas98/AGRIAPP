import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';

const prisma = new PrismaClient();

interface WorkerAvailability {
  [day: string]: { start: string; end: string }[];
}

interface PredictionData {
  shortage: boolean;
  surplus: boolean;
  predictedWorkers: number;
  requiredWorkers: number;
  confidence: number;
}

class LabourSchedulingService {
  // Initialize cron jobs for automated alerts
  initializeAlertSystem() {
    // Check for upcoming tasks every hour
    cron.schedule('0 * * * *', () => {
      this.checkUpcomingTasks();
    });

    // Check for labor shortages daily at 6 AM
    cron.schedule('0 6 * * *', () => {
      this.predictLaborShortages();
    });

    // Check for overtime warnings daily at 5 PM
    cron.schedule('0 17 * * *', () => {
      this.checkOvertimeWarnings();
    });
  }

  // Create a new worker
  async createWorker(userId: string, data: any) {
    return await prisma.worker.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  // Get all workers with filters
  async getWorkers(userId: string, filters?: any) {
    const where: any = { userId };
    
    if (filters?.skills) {
      where.skills = { hasSome: filters.skills };
    }
    if (filters?.status) {
      where.status = filters.status;
    }

    return await prisma.worker.findMany({
      where,
      include: {
        shifts: {
          where: {
            date: {
              gte: new Date(),
            },
          },
          take: 10,
        },
        absences: {
          where: {
            endDate: {
              gte: new Date(),
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' as const },
    });
  }

  // Create a labour task
  async createTask(userId: string, data: any) {
    const task = await prisma.labourTask.create({
      data: {
        userId,
        ...data,
      },
    });

    // Auto-schedule if possible
    await this.autoScheduleTask(task.id);

    return task;
  }

  // Get tasks with filters
  async getTasks(userId: string, filters?: any) {
    const where: any = { userId };
    
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.priority) {
      where.priority = filters.priority;
    }
    if (filters?.dateRange) {
      where.startDate = {
        gte: new Date(filters.dateRange.start),
        lte: new Date(filters.dateRange.end),
      };
    }

    return await prisma.labourTask.findMany({
      where,
      include: {
        shifts: {
          include: {
            worker: true,
          },
        },
        alerts: true,
      },
      orderBy: [
        { priority: 'desc' as const },
        { startDate: 'asc' as const },
      ],
    });
  }

  // Auto-schedule task based on worker availability and skills
  async autoScheduleTask(taskId: string) {
    const task = await prisma.labourTask.findUnique({
      where: { id: taskId },
      include: { shifts: true },
    });

    if (!task || task.status !== 'PENDING') return;

    // Find available workers with required skills
    const availableWorkers = await prisma.worker.findMany({
      where: {
        userId: task.userId,
        status: 'ACTIVE',
        skills: {
          hasSome: task.requiredSkills.length > 0 ? task.requiredSkills : undefined,
        },
      },
    });

    // Check worker availability and create shifts
    const shiftsToCreate = [];
    const taskDuration = (task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60);
    const hoursPerWorker = taskDuration / task.requiredWorkers;

    for (let i = 0; i < Math.min(task.requiredWorkers, availableWorkers.length); i++) {
      const worker = availableWorkers[i];
      
      shiftsToCreate.push({
        workerId: worker.id,
        taskId: task.id,
        date: task.startDate,
        startTime: task.startDate,
        endTime: new Date(task.startDate.getTime() + hoursPerWorker * 60 * 60 * 1000),
        status: 'SCHEDULED' as const,
      });
    }

    if (shiftsToCreate.length > 0) {
      await prisma.shift.createMany({
        data: shiftsToCreate,
      });

      await prisma.labourTask.update({
        where: { id: taskId },
        data: { status: 'SCHEDULED' },
      });
    } else {
      // Create alert for labor shortage
      await this.createAlert(task.userId, {
        taskId: task.id,
        alertType: 'LABOR_SHORTAGE',
        title: 'Labor Shortage Detected',
        message: `Not enough workers available for task: ${task.title}`,
        severity: 'CRITICAL',
        actionRequired: true,
      });
    }
  }

  // Create a shift
  async createShift(data: any) {
    return await prisma.shift.create({
      data,
      include: {
        worker: true,
        task: true,
      },
    });
  }

  // Update shift status
  async updateShiftStatus(shiftId: string, status: string, actualTimes?: any) {
    const updateData: any = { status };
    
    if (actualTimes?.actualStart) {
      updateData.actualStart = new Date(actualTimes.actualStart);
    }
    if (actualTimes?.actualEnd) {
      updateData.actualEnd = new Date(actualTimes.actualEnd);
      
      // Calculate overtime
      const shift = await prisma.shift.findUnique({ where: { id: shiftId } });
      if (shift) {
        const scheduledHours = (shift.endTime.getTime() - shift.startTime.getTime()) / (1000 * 60 * 60);
        const actualHours = (updateData.actualEnd.getTime() - (shift.actualStart || shift.startTime).getTime()) / (1000 * 60 * 60);
        const overtime = Math.max(0, actualHours - scheduledHours);
        updateData.overtimeHours = overtime;
      }
    }

    return await prisma.shift.update({
      where: { id: shiftId },
      data: updateData,
      include: {
        worker: true,
        task: true,
      },
    });
  }

  // Create an alert
  async createAlert(userId: string, data: any) {
    return await prisma.scheduleAlert.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  // Get alerts for user
  async getAlerts(userId: string, filters?: any) {
    const where: any = { userId };
    
    if (filters?.isRead !== undefined) {
      where.isRead = filters.isRead === 'false' ? false : filters.isRead;
    }
    if (filters?.severity) {
      where.severity = filters.severity;
    }

    try {
      return await prisma.scheduleAlert.findMany({
        where,
        include: {
          task: true,
        },
        orderBy: [
          { severity: 'desc' as const },
          { createdAt: 'desc' as const },
        ],
        take: filters?.limit || 50,
      });
    } catch (error) {
      console.error('Error fetching alerts:', error);
      // If include fails, try without it
      return await prisma.scheduleAlert.findMany({
        where,
        orderBy: [
          { severity: 'desc' as const },
          { createdAt: 'desc' as const },
        ],
        take: filters?.limit || 50,
      });
    }
  }

  // Mark alert as read
  async markAlertRead(alertId: string) {
    return await prisma.scheduleAlert.update({
      where: { id: alertId },
      data: { isRead: true },
    });
  }

  // Check for upcoming tasks (automated)
  async checkUpcomingTasks() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const upcomingTasks = await prisma.labourTask.findMany({
      where: {
        startDate: {
          gte: tomorrow,
          lt: dayAfter,
        },
        status: {
          in: ['PENDING', 'SCHEDULED'],
        },
      },
    });

    for (const task of upcomingTasks) {
      await this.createAlert(task.userId, {
        taskId: task.id,
        alertType: 'UPCOMING_TASK',
        title: 'Task Starting Tomorrow',
        message: `Task "${task.title}" is scheduled to start tomorrow at ${task.startDate.toLocaleTimeString()}`,
        severity: 'INFO',
      });
    }
  }

  // Predict labor shortages using historical data
  async predictLaborShortages() {
    const users = await prisma.user.findMany({
      where: { role: 'FARMER' },
    });

    for (const user of users) {
      const prediction = await this.analyzeLaborTrends(user.id);
      
      if (prediction.shortage) {
        await this.createAlert(user.id, {
          alertType: 'LABOR_SHORTAGE',
          title: 'Predicted Labor Shortage',
          message: `Based on historical data, you may need ${prediction.requiredWorkers - prediction.predictedWorkers} more workers in the coming week.`,
          severity: 'WARNING',
          actionRequired: true,
          metadata: prediction,
        });
      } else if (prediction.surplus) {
        await this.createAlert(user.id, {
          alertType: 'LABOR_SURPLUS',
          title: 'Labor Surplus Detected',
          message: `You may have ${prediction.predictedWorkers - prediction.requiredWorkers} excess workers scheduled.`,
          severity: 'INFO',
          metadata: prediction,
        });
      }
    }
  }

  // Analyze labor trends
  async analyzeLaborTrends(userId: string): Promise<PredictionData> {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Get upcoming tasks
    const upcomingTasks = await prisma.labourTask.findMany({
      where: {
        userId,
        startDate: {
          gte: new Date(),
          lte: nextWeek,
        },
      },
    });

    const requiredWorkers = upcomingTasks.reduce((sum: number, task: any) => sum + task.requiredWorkers, 0);

    // Get available workers
    const availableWorkers = await prisma.worker.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
    });

    // Get historical analytics
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const analytics = await prisma.labourAnalytics.findMany({
      where: {
        userId,
        date: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: { date: 'desc' },
    });

    // Simple prediction based on average utilization
    const avgUtilization = analytics.length > 0
      ? analytics.reduce((sum: number, a: any) => sum + (a.activeWorkers / a.totalWorkers), 0) / analytics.length
      : 0.8;

    const predictedWorkers = Math.floor(availableWorkers.length * avgUtilization);

    return {
      shortage: predictedWorkers < requiredWorkers,
      surplus: predictedWorkers > requiredWorkers * 1.2,
      predictedWorkers,
      requiredWorkers,
      confidence: analytics.length > 10 ? 0.85 : 0.6,
    };
  }

  // Check for overtime warnings
  async checkOvertimeWarnings() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const shifts = await prisma.shift.findMany({
      where: {
        date: {
          gte: weekAgo,
          lt: today,
        },
        status: 'COMPLETED',
        overtimeHours: {
          gt: 0,
        },
      },
      include: {
        worker: true,
      },
    });

    // Group by worker
    const overtimeByWorker = new Map<string, { worker: any; totalOvertime: number }>();
    
    for (const shift of shifts) {
      const existing = overtimeByWorker.get(shift.workerId) || { worker: shift.worker, totalOvertime: 0 };
      existing.totalOvertime += shift.overtimeHours;
      overtimeByWorker.set(shift.workerId, existing);
    }

    // Create alerts for excessive overtime
    for (const [workerId, data] of overtimeByWorker) {
      if (data.totalOvertime > 10) {
        const userShift = await prisma.shift.findFirst({
          where: { workerId },
          include: { task: true },
        });

        if (userShift) {
          await this.createAlert(userShift.task.userId, {
            alertType: 'OVERTIME_WARNING',
            title: 'Excessive Overtime Detected',
            message: `Worker ${data.worker.firstName} ${data.worker.lastName} has worked ${data.totalOvertime.toFixed(1)} overtime hours this week.`,
            severity: 'WARNING',
            metadata: { workerId, totalOvertime: data.totalOvertime },
          });
        }
      }
    }
  }

  // Get dashboard analytics
  async getDashboardAnalytics(userId: string, dateRange?: { start: Date; end: Date }) {
    const start = dateRange?.start || new Date(new Date().setDate(new Date().getDate() - 30));
    const end = dateRange?.end || new Date();

    const [workers, tasks, shifts, alerts, analytics] = await Promise.all([
      prisma.worker.count({ where: { userId } }),
      prisma.labourTask.findMany({
        where: {
          userId,
          startDate: { gte: start, lte: end },
        },
      }),
      prisma.shift.findMany({
        where: {
          task: { userId },
          date: { gte: start, lte: end },
        },
      }),
      prisma.scheduleAlert.count({
        where: {
          userId,
          isRead: false,
        },
      }),
      prisma.labourAnalytics.findMany({
        where: {
          userId,
          date: { gte: start, lte: end },
        },
        orderBy: { date: 'asc' },
      }),
    ]);

    const completedTasks = tasks.filter((t: any) => t.status === 'COMPLETED').length;
    const delayedTasks = tasks.filter((t: any) => t.status === 'DELAYED').length;
    const totalHours = shifts.reduce((sum: number, s: any) => {
      if (s.actualStart && s.actualEnd) {
        return sum + (s.actualEnd.getTime() - s.actualStart.getTime()) / (1000 * 60 * 60);
      }
      return sum;
    }, 0);
    const totalOvertime = shifts.reduce((sum: number, s: any) => sum + s.overtimeHours, 0);

    return {
      totalWorkers: workers,
      activeTasks: tasks.filter((t: any) => t.status === 'IN_PROGRESS').length,
      completedTasks,
      delayedTasks,
      totalHours: totalHours.toFixed(1),
      overtimeHours: totalOvertime.toFixed(1),
      unreadAlerts: alerts,
      efficiency: completedTasks / (completedTasks + delayedTasks) * 100 || 0,
      analytics: analytics.map((a: any) => ({
        date: a.date,
        efficiency: a.efficiency,
        totalHours: a.totalHours,
        activeWorkers: a.activeWorkers,
      })),
    };
  }

  // Get optimization recommendations
  async getOptimizationRecommendations(userId: string) {
    const recommendations = [];

    // Analyze task distribution
    const tasks = await prisma.labourTask.findMany({
      where: {
        userId,
        status: { in: ['PENDING', 'SCHEDULED', 'IN_PROGRESS'] },
      },
      include: { shifts: true },
    });

    // Check for understaffed tasks
    const understaffedTasks = tasks.filter((t: any) => t.shifts.length < t.requiredWorkers);
    if (understaffedTasks.length > 0) {
      recommendations.push({
        type: 'STAFFING',
        priority: 'HIGH',
        title: 'Understaffed Tasks Detected',
        description: `${understaffedTasks.length} tasks need more workers assigned.`,
        action: 'Review and assign additional workers to these tasks.',
        tasks: understaffedTasks.map((t: any) => ({ id: t.id, title: t.title })),
      });
    }

    // Check for skill gaps
    const workers = await prisma.worker.findMany({
      where: { userId, status: 'ACTIVE' },
    });

    const allRequiredSkills = new Set(tasks.flatMap((t: any) => t.requiredSkills));
    const availableSkills = new Set(workers.flatMap((w: any) => w.skills));
    const missingSkills = [...allRequiredSkills].filter(s => !availableSkills.has(s));

    if (missingSkills.length > 0) {
      recommendations.push({
        type: 'TRAINING',
        priority: 'MEDIUM',
        title: 'Skill Gaps Identified',
        description: `Missing skills: ${missingSkills.join(', ')}`,
        action: 'Consider training existing workers or hiring workers with these skills.',
      });
    }

    // Check for high overtime
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const recentShifts = await prisma.shift.findMany({
      where: {
        task: { userId },
        date: { gte: weekAgo },
        overtimeHours: { gt: 0 },
      },
    });

    const totalOvertime = recentShifts.reduce((sum: number, s: any) => sum + s.overtimeHours, 0);
    if (totalOvertime > 20) {
      recommendations.push({
        type: 'EFFICIENCY',
        priority: 'HIGH',
        title: 'High Overtime Detected',
        description: `${totalOvertime.toFixed(1)} overtime hours in the past week.`,
        action: 'Consider hiring additional workers or redistributing workload.',
      });
    }

    return recommendations;
  }
}

export default new LabourSchedulingService();
