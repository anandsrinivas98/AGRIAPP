# 🔔 Labour Scheduling Alerts System

## Why Alerts Were Empty

Alerts are **NOT created manually** - they are generated automatically by the system based on real conditions and events. The alerts tab was empty because:

1. ✅ You just set up the system (no historical data yet)
2. ✅ No tasks with approaching deadlines
3. ✅ No workers with overtime
4. ✅ No labor shortages detected
5. ✅ Cron jobs haven't run yet (they run on schedule)

## ✅ Test Alerts Created

I've created **9 test alerts** for you to see how the system works:

### INFO Alerts (3)
- 📅 Task Starting Soon
- 📊 Labor Surplus Detected  
- 🔄 Shift Change Required

### WARNING Alerts (4)
- ⚠️ Labor Shortage Warning
- ⏰ Overtime Alert
- 📆 Deadline Approaching
- 🌧️ Weather Alert

### CRITICAL Alerts (2)
- 🚨 Critical: Task Delayed
- 🚨 Worker Absence

## How to See the Alerts

1. **Refresh your browser** (Ctrl+Shift+R)
2. Go to: `http://localhost:3000/features/labor-scheduling`
3. Click on the **"Alerts"** tab
4. You should see all 9 alerts with color-coded severity

## How Alerts Are Generated Automatically

### 1. Upcoming Task Alerts
**Trigger**: Task starting within 24 hours
```
When: Daily cron job checks upcoming tasks
Alert: "Task 'Tomato Harvesting' is scheduled to start tomorrow"
Severity: INFO
```

### 2. Labor Shortage Alerts
**Trigger**: Predicted worker shortage based on historical data
```
When: Daily analysis of labor trends
Alert: "You may need 3 more workers in the coming week"
Severity: WARNING
Action Required: Yes
```

### 3. Overtime Alerts
**Trigger**: Worker exceeds 40 hours per week
```
When: Daily check of worker hours
Alert: "Worker John Doe has worked 45 hours this week"
Severity: WARNING
Action Required: Yes
```

### 4. Deadline Approaching
**Trigger**: Task deadline within 24 hours
```
When: Hourly check of task deadlines
Alert: "Harvesting task deadline is in 24 hours"
Severity: WARNING
```

### 5. Task Delayed
**Trigger**: Task past scheduled end date and not completed
```
When: Daily check of task status
Alert: "Irrigation task is 2 days behind schedule"
Severity: CRITICAL
Action Required: Yes
```

### 6. Worker Absence
**Trigger**: Worker reports absence
```
When: Worker submits absence request
Alert: "Worker Mike Johnson called in sick"
Severity: CRITICAL
Action Required: Yes
```

### 7. Shift Change
**Trigger**: Worker requests shift modification
```
When: Shift change request submitted
Alert: "Worker Jane Smith requested shift change"
Severity: INFO
Action Required: Yes
```

### 8. Weather Impact
**Trigger**: Severe weather predicted (integrated with weather API)
```
When: Weather API reports severe conditions
Alert: "Heavy rain predicted tomorrow"
Severity: WARNING
Action Required: Yes
```

### 9. Labor Surplus
**Trigger**: More workers scheduled than needed
```
When: Daily optimization analysis
Alert: "You have 2 extra workers scheduled"
Severity: INFO
```

## Alert Properties

### Severity Levels
- **INFO** (Blue) - Informational, no immediate action needed
- **WARNING** (Yellow) - Attention required, plan action
- **CRITICAL** (Red) - Urgent, immediate action required

### Action Required Flag
- **Yes** - You need to take action
- **No** - Just for your information

### Alert Status
- **Unread** - New alert (shown by default)
- **Read** - Acknowledged (click checkmark to mark as read)

## Automated Cron Jobs

The system runs these automated checks:

### Hourly Jobs
```javascript
// Check for tasks starting soon
checkUpcomingTasks() // Every hour
```

### Daily Jobs
```javascript
// Run at 6:00 AM daily
predictLaborShortages()  // Analyze trends
checkOvertimeWarnings()  // Check worker hours
analyzeEfficiency()      // Calculate team performance
```

### Real-time Triggers
```javascript
// Immediate alerts when:
- Worker submits absence
- Shift change requested
- Task status updated
- Weather alert received
```

## How to Trigger Real Alerts

### Method 1: Create Tasks with Near Deadlines
```
1. Add Task with start date = tomorrow
2. Wait for hourly cron job
3. Alert: "Task starting tomorrow"
```

### Method 2: Add Worker Hours
```
1. Create shifts for a worker
2. Mark shifts as completed with >40 hours total
3. Alert: "Overtime warning"
```

### Method 3: Create Tasks Without Enough Workers
```
1. Create task requiring 5 workers
2. Only have 2 workers available
3. Alert: "Labor shortage"
```

### Method 4: Mark Task as Delayed
```
1. Create task with end date in the past
2. Keep status as IN_PROGRESS
3. Alert: "Task delayed"
```

## Managing Alerts

### Mark as Read
Click the green checkmark icon on any alert to mark it as read.

### Filter Alerts
```javascript
// In the code, you can filter by:
- Severity (INFO, WARNING, CRITICAL)
- Read status (read/unread)
- Alert type
- Date range
```

### Alert Notifications
Future enhancements:
- Email notifications
- SMS alerts
- Push notifications
- Slack/Teams integration

## Alert Analytics

The system tracks:
- Total alerts generated
- Unread alert count (shown in dashboard)
- Alert response time
- Most common alert types
- Alert trends over time

## Testing the Alert System

### Test 1: View Test Alerts
```
1. Refresh browser
2. Go to Alerts tab
3. See 9 test alerts
4. Click checkmark to mark as read
```

### Test 2: Create Real Alert
```
1. Go to Tasks tab
2. Create task with start date = tomorrow
3. Wait 1 hour (or trigger cron manually)
4. Check Alerts tab for new alert
```

### Test 3: Overtime Alert
```
1. Create worker
2. Create multiple shifts totaling >40 hours
3. Mark shifts as completed
4. System generates overtime alert
```

## Alert Best Practices

### For Farm Managers
1. ✅ Check alerts daily (morning routine)
2. ✅ Address CRITICAL alerts immediately
3. ✅ Plan for WARNING alerts within 24 hours
4. ✅ Review INFO alerts weekly
5. ✅ Mark alerts as read after taking action

### For System Optimization
1. ✅ Don't ignore recurring alerts (fix root cause)
2. ✅ Use alerts to improve planning
3. ✅ Track alert patterns for insights
4. ✅ Adjust worker schedules proactively
5. ✅ Use recommendations tab for solutions

## Customizing Alerts

You can customize alert thresholds in the backend:

```typescript
// backend/src/services/labourSchedulingService.ts

// Change overtime threshold
const OVERTIME_THRESHOLD = 40; // hours per week

// Change deadline warning time
const DEADLINE_WARNING_HOURS = 24; // hours before

// Change efficiency threshold
const LOW_EFFICIENCY_THRESHOLD = 70; // percentage
```

## Alert API Endpoints

### Get Alerts
```
GET /api/labour-scheduling/alerts
Query params:
  - isRead: true/false
  - severity: INFO/WARNING/CRITICAL
  - limit: number
```

### Mark Alert as Read
```
PATCH /api/labour-scheduling/alerts/:id/read
```

### Create Alert (Internal)
```
POST /api/labour-scheduling/alerts
Body: {
  alertType, title, message, severity, actionRequired
}
```

## Troubleshooting

### Alerts Not Showing
1. Check if you're logged in as correct user
2. Refresh the page
3. Check browser console for errors
4. Verify token is valid

### No New Alerts Generated
1. Cron jobs may not be running
2. No conditions triggering alerts
3. Check backend logs for cron execution

### Alerts Not Updating
1. Hard refresh browser (Ctrl+Shift+R)
2. Check if backend is running
3. Verify database connection

## Summary

✅ **Test alerts created** - 9 alerts ready to view
✅ **Refresh browser** - See alerts in Alerts tab
✅ **Automatic system** - Real alerts generated by conditions
✅ **Cron jobs** - Run hourly/daily to check conditions
✅ **Action required** - Some alerts need your response
✅ **Color coded** - Easy to identify severity

**The alert system is working! Refresh your browser to see the test alerts.**
