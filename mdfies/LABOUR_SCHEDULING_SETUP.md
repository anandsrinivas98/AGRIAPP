# Labour Scheduling System - Setup Guide

## Overview
Advanced labour scheduling system for farm workforce optimization with automated alerts, predictive analytics, and efficiency recommendations.

## Features

### Core Functionality
- **Worker Management**: Track workers with skills, availability, and performance metrics
- **Task Scheduling**: Create and auto-schedule tasks based on worker availability and skills
- **Shift Management**: Track shifts with overtime calculation and status updates
- **Automated Alerts**: Real-time notifications for upcoming tasks, shortages, and deadlines
- **Predictive Analytics**: Forecast labor shortages/surpluses using historical data
- **Optimization Recommendations**: AI-driven suggestions for efficiency improvements

### Alert Types
- Upcoming tasks (24h advance notice)
- Shift changes and modifications
- Overtime warnings (>10h/week per worker)
- Critical deadline approaching
- Labor shortage predictions
- Labor surplus notifications
- Worker absence alerts
- Task delay warnings
- Weather impact alerts

### Analytics & Reporting
- Real-time dashboard with key metrics
- Efficiency trends and charts
- Worker productivity tracking
- Cost analysis per hour
- Task completion rates
- Overtime monitoring

## Database Setup

### 1. Run Prisma Migration

```bash
cd backend
npm run migrate
```

This will create the following new tables:
- `workers` - Worker profiles with skills and availability
- `shifts` - Individual work shifts with time tracking
- `labour_tasks` - Tasks requiring labor allocation
- `schedule_alerts` - Automated alert system
- `worker_absences` - Track worker time off
- `labour_analytics` - Historical performance data

### 2. Initialize Automated Alert System

The system includes cron jobs that run automatically:
- **Hourly**: Check for upcoming tasks
- **Daily 6 AM**: Predict labor shortages
- **Daily 5 PM**: Check overtime warnings

To enable, add to `backend/src/index.ts`:

```typescript
import labourSchedulingService from './services/labourSchedulingService';

// After server starts
labourSchedulingService.initializeAlertSystem();
```

## API Endpoints

### Workers
- `POST /api/labour-scheduling/workers` - Create worker
- `GET /api/labour-scheduling/workers` - List workers (with filters)

### Tasks
- `POST /api/labour-scheduling/tasks` - Create task
- `GET /api/labour-scheduling/tasks` - List tasks (with filters)

### Shifts
- `POST /api/labour-scheduling/shifts` - Create shift
- `PATCH /api/labour-scheduling/shifts/:id/status` - Update shift status

### Alerts
- `GET /api/labour-scheduling/alerts` - Get alerts
- `PATCH /api/labour-scheduling/alerts/:id/read` - Mark alert as read

### Analytics
- `GET /api/labour-scheduling/analytics/dashboard` - Dashboard metrics
- `GET /api/labour-scheduling/analytics/recommendations` - Optimization suggestions

## Frontend Usage

Navigate to: `/features/labor-scheduling`

### Tabs
1. **Dashboard**: Overview with stats and efficiency charts
2. **Tasks**: View and manage all labor tasks
3. **Workers**: Worker profiles with skills and availability
4. **Alerts**: Real-time notifications and warnings
5. **Recommendations**: AI-driven optimization suggestions

## Worker Availability Format

Workers have a weekly availability schedule stored as JSON:

```json
{
  "monday": [
    { "start": "08:00", "end": "12:00" },
    { "start": "13:00", "end": "17:00" }
  ],
  "tuesday": [
    { "start": "08:00", "end": "17:00" }
  ],
  "wednesday": [],
  "thursday": [
    { "start": "08:00", "end": "17:00" }
  ],
  "friday": [
    { "start": "08:00", "end": "15:00" }
  ],
  "saturday": [],
  "sunday": []
}
```

## Auto-Scheduling Algorithm

When a task is created, the system:
1. Finds workers with required skills
2. Checks worker availability against task timeframe
3. Distributes work hours evenly among available workers
4. Creates shifts automatically
5. Sends alerts if insufficient workers are available

## Predictive Analytics

The system analyzes:
- Historical worker utilization rates
- Seasonal workload patterns
- Task completion times
- Overtime trends

Predictions are made using:
- 30-day rolling average
- Worker availability patterns
- Upcoming task requirements
- Confidence scoring based on data volume

## Optimization Recommendations

The system provides recommendations for:
- **Staffing**: Identifies understaffed tasks
- **Training**: Detects skill gaps in workforce
- **Efficiency**: Flags excessive overtime
- **Scheduling**: Suggests workload redistribution

## Example Usage

### Create a Worker
```typescript
const worker = await labourSchedulingService.createWorker(userId, {
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  email: 'john@example.com',
  skills: ['harvesting', 'planting', 'irrigation'],
  hourlyRate: 15.50,
  availability: {
    monday: [{ start: '08:00', end: '17:00' }],
    tuesday: [{ start: '08:00', end: '17:00' }],
    // ... other days
  },
  status: 'ACTIVE'
});
```

### Create a Task
```typescript
const task = await labourSchedulingService.createTask(userId, {
  title: 'Wheat Harvesting - North Field',
  description: 'Harvest 50 acres of wheat',
  taskType: 'harvesting',
  crop: 'wheat',
  location: 'North Field',
  priority: 'HIGH',
  requiredWorkers: 5,
  requiredSkills: ['harvesting'],
  estimatedHours: 40,
  startDate: new Date('2025-12-15T08:00:00'),
  endDate: new Date('2025-12-15T17:00:00')
});
// Auto-scheduling happens automatically
```

### Track Shift Progress
```typescript
// Start shift
await labourSchedulingService.updateShiftStatus(shiftId, 'IN_PROGRESS', {
  actualStart: new Date()
});

// Complete shift
await labourSchedulingService.updateShiftStatus(shiftId, 'COMPLETED', {
  actualEnd: new Date()
});
// Overtime is calculated automatically
```

## Performance Considerations

- Alerts are generated asynchronously via cron jobs
- Dashboard analytics use aggregated data for speed
- Worker availability checks are optimized with indexing
- Historical data is retained for 90 days by default

## Future Enhancements

- Mobile app for workers to clock in/out
- GPS tracking for field workers
- Weather integration for automatic rescheduling
- Machine learning for more accurate predictions
- Integration with payroll systems
- Multi-language support for diverse workforce
- Photo verification for task completion

## Troubleshooting

### Alerts not generating
- Check cron jobs are initialized
- Verify system time is correct
- Check database connectivity

### Auto-scheduling not working
- Verify workers have skills matching task requirements
- Check worker availability schedules
- Ensure workers are marked as ACTIVE

### Performance issues
- Add database indexes on frequently queried fields
- Implement pagination for large datasets
- Use Redis caching for dashboard analytics

## Support

For issues or questions, refer to the main project documentation or contact the development team.
