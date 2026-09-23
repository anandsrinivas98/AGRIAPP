# Labour Scheduling System - Quick Start

## 🚀 Quick Setup (5 minutes)

### 1. Database Migration
```bash
cd backend
npm run migrate
```

### 2. Start Backend
```bash
npm run dev
```

The automated alert system will initialize automatically.

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

### 4. Access the System
Navigate to: `http://localhost:3000/features/labor-scheduling`

## 📋 First Steps

### Add Your First Worker
1. Click "Add Worker" button
2. Fill in:
   - Name and contact info
   - Select skills (e.g., harvesting, planting)
   - Set hourly rate
   - Default availability is Mon-Fri 8AM-5PM
3. Click "Add Worker"

### Create Your First Task
1. Click "Add Task" button
2. Fill in:
   - Task title (e.g., "Wheat Harvesting")
   - Task type and location
   - Number of workers needed
   - Estimated hours
   - Start and end date/time
   - Required skills (optional)
3. Click "Create Task"
4. System will auto-assign workers if available!

## 🎯 Key Features

### Dashboard Tab
- View total workers, active tasks, efficiency metrics
- See unread alerts count
- Monitor hours and overtime
- View 7-day efficiency trend chart

### Tasks Tab
- All tasks with status badges
- Progress tracking
- Worker assignment status
- Priority indicators

### Workers Tab
- Worker profiles with skills
- Hourly rates and total hours worked
- Status (Active/Inactive/On Leave)
- Rating system

### Alerts Tab
- Real-time notifications
- Color-coded by severity (Info/Warning/Critical)
- Action required indicators
- Mark as read functionality

### Recommendations Tab
- AI-driven optimization suggestions
- Staffing recommendations
- Training needs identification
- Efficiency improvements

## 🔔 Automated Alerts

The system automatically sends alerts for:
- **Tasks starting in 24 hours** (checked hourly)
- **Labor shortages** (predicted daily at 6 AM)
- **Excessive overtime** (>10h/week, checked daily at 5 PM)

## 💡 Pro Tips

1. **Add skills to workers** - Enables smart auto-scheduling
2. **Set task priorities** - Critical tasks get highlighted
3. **Check recommendations daily** - Optimize your workforce
4. **Monitor overtime** - Keep costs under control
5. **Review alerts regularly** - Stay ahead of issues

## 📊 Sample Data

### Example Worker
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "skills": ["harvesting", "planting"],
  "hourlyRate": 15.50
}
```

### Example Task
```json
{
  "title": "Wheat Harvesting - North Field",
  "taskType": "harvesting",
  "location": "North Field",
  "priority": "HIGH",
  "requiredWorkers": 5,
  "requiredSkills": ["harvesting"],
  "estimatedHours": 40,
  "startDate": "2025-12-15T08:00:00",
  "endDate": "2025-12-15T17:00:00"
}
```

## 🔧 Troubleshooting

### Workers not auto-assigned?
- Check worker skills match task requirements
- Verify workers are marked as "ACTIVE"
- Ensure workers have availability during task timeframe

### Alerts not showing?
- Check backend console for cron job initialization
- Verify database connection
- Check system time is correct

### Can't add worker/task?
- Verify backend is running
- Check browser console for errors
- Ensure you're logged in

## 📈 Next Steps

1. Add all your workers
2. Create upcoming tasks
3. Monitor the dashboard daily
4. Review recommendations weekly
5. Analyze efficiency trends monthly

## 🎓 Advanced Features

- **Shift tracking**: Workers can clock in/out
- **Overtime calculation**: Automatic based on actual hours
- **Predictive analytics**: Uses 30-day historical data
- **Skill gap analysis**: Identifies training needs
- **Cost tracking**: Monitor labor costs per task

## 📞 Support

For detailed documentation, see `LABOUR_SCHEDULING_SETUP.md`

---

**Ready to optimize your farm workforce? Start by adding your first worker!** 🌾
