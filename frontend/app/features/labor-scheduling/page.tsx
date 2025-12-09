'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { labourSchedulingService } from '@/services/labourSchedulingService';
import AddWorkerModal from '@/components/labour/AddWorkerModal';
import AddTaskModal from '@/components/labour/AddTaskModal';
import {
  Calendar,
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  XCircle,
  Bell,
  Plus,
  Filter,
  Download,
} from 'lucide-react';

export default function LabourSchedulingPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analytics, setAnalytics] = useState<any>(null);
  const [workers, setWorkers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated - use correct token key
      const token = localStorage.getItem('agrisense_token');
      if (!token) {
        console.error('❌ No authentication token found');
        alert('Please login to access labour scheduling');
        window.location.href = '/auth/login';
        return;
      }
      console.log('✅ Token found, loading labour scheduling data...');

      const [analyticsData, workersData, tasksData, alertsData, recsData] = await Promise.all([
        labourSchedulingService.getDashboardAnalytics().catch(e => {
          console.error('Analytics error:', e);
          return { totalWorkers: 0, activeTasks: 0, efficiency: 0, unreadAlerts: 0, totalHours: 0, overtimeHours: 0, completedTasks: 0, delayedTasks: 0, analytics: [] };
        }),
        labourSchedulingService.getWorkers().catch(e => {
          console.error('Workers error:', e);
          return [];
        }),
        labourSchedulingService.getTasks().catch(e => {
          console.error('Tasks error:', e);
          return [];
        }),
        labourSchedulingService.getAlerts({ isRead: false }).catch(e => {
          console.error('Alerts error:', e);
          return [];
        }),
        labourSchedulingService.getRecommendations().catch(e => {
          console.error('Recommendations error:', e);
          return [];
        }),
      ]);

      setAnalytics(analyticsData);
      setWorkers(workersData);
      setTasks(tasksData);
      setAlerts(alertsData);
      setRecommendations(recsData);
    } catch (error: any) {
      console.error('Error loading data:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        window.location.href = '/auth/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddWorker = async (data: any) => {
    try {
      await labourSchedulingService.createWorker(data);
      setShowAddWorkerModal(false);
      await loadData();
      alert('Worker added successfully!');
    } catch (error: any) {
      console.error('Error adding worker:', error);
      alert(`Error adding worker: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleAddTask = async (data: any) => {
    try {
      await labourSchedulingService.createTask(data);
      setShowAddTaskModal(false);
      await loadData();
      alert('Task created successfully!');
    } catch (error: any) {
      console.error('Error adding task:', error);
      alert(`Error creating task: ${error.response?.data?.error || error.message}`);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'DELAYED':
        return 'bg-red-100 text-red-800';
      case 'SCHEDULED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading labour scheduling system...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back to Dashboard Button */}
        <a 
          href="/dashboard"
          className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 text-orange-700 rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 shadow-sm hover:shadow-md font-medium group"
        >
          <svg className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          Back to Dashboard
        </a>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Labour Scheduling & Management
              </h1>
              <p className="text-gray-600">
                Optimize workforce allocation and track productivity
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <button
                onClick={() => setShowAddWorkerModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Worker
              </button>
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white border-2 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Workers</p>
                <p className="text-3xl font-bold text-gray-900">{analytics?.totalWorkers || 0}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{analytics?.activeTasks || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Efficiency</p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics?.efficiency?.toFixed(1) || 0}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-2 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Unread Alerts</p>
                <p className="text-3xl font-bold text-gray-900">{analytics?.unreadAlerts || 0}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Bell className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            {['dashboard', 'tasks', 'workers', 'alerts', 'recommendations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Hours Overview */}
            <Card className="p-6 bg-white">
              <h3 className="text-lg font-semibold mb-4">Hours Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Hours</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.totalHours || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Overtime Hours</p>
                  <p className="text-2xl font-bold text-orange-600">{analytics?.overtimeHours || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed Tasks</p>
                  <p className="text-2xl font-bold text-green-600">{analytics?.completedTasks || 0}</p>
                </div>
              </div>
            </Card>

            {/* Efficiency Chart */}
            <Card className="p-6 bg-white">
              <h3 className="text-lg font-semibold mb-4">Efficiency Trend</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {analytics?.analytics?.slice(-7).map((data: any, index: number) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-orange-500 rounded-t"
                      style={{ height: `${data.efficiency}%` }}
                    ></div>
                    <p className="text-xs text-gray-600 mt-2">
                      {new Date(data.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">All Tasks ({tasks.length})</h3>
              <div className="flex gap-2">
                <button
                  onClick={loadData}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
            {tasks.length === 0 ? (
              <Card className="p-12 bg-white text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Yet</h4>
                <p className="text-gray-600 mb-6">
                  Create your first task to start scheduling workers.
                </p>
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Task
                </button>
              </Card>
            ) : (
              <>
                {tasks.map((task) => (
              <Card key={task.id} className="p-6 bg-white hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{task.title}</h4>
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      {task.priority === 'CRITICAL' && (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Critical
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {task.shifts?.length || 0}/{task.requiredWorkers} workers
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {task.estimatedHours}h estimated
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(task.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Progress</p>
                      <p className="text-2xl font-bold text-orange-600">{task.progress}%</p>
                    </div>
                  </div>
                </div>
              </Card>
                ))}
              </>
            )}
          </div>
        )}

        {/* Workers Tab */}
        {activeTab === 'workers' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">All Workers ({workers.length})</h3>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
            {workers.length === 0 ? (
              <Card className="p-12 bg-white text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Workers Yet</h4>
                <p className="text-gray-600 mb-6">
                  Get started by adding your first worker to the system.
                </p>
                <button
                  onClick={() => setShowAddWorkerModal(true)}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Worker
                </button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workers.map((worker) => (
              <Card key={worker.id} className="p-6 bg-white hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {worker.firstName} {worker.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">{worker.phone}</p>
                  </div>
                  <Badge
                    className={
                      worker.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {worker.status}
                  </Badge>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Hourly Rate:</span>
                    <span className="font-semibold">${worker.hourlyRate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Hours:</span>
                    <span className="font-semibold">{worker.totalHours}h</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-semibold">⭐ {worker.rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {worker.skills.map((skill: string, index: number) => (
                      <Badge key={index} className="bg-orange-100 text-orange-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card
                key={alert.id}
                className={`p-6 bg-white border-l-4 ${
                  alert.severity === 'CRITICAL'
                    ? 'border-l-red-500'
                    : alert.severity === 'WARNING'
                    ? 'border-l-yellow-500'
                    : 'border-l-blue-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{alert.title}</h4>
                      <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                      {alert.actionRequired && (
                        <Badge className="bg-purple-100 text-purple-800">Action Required</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{alert.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => labourSchedulingService.markAlertRead(alert.id)}
                    className="ml-4 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                Optimization Recommendations
              </h3>
              <p className="text-gray-600 mb-4">
                Based on historical data and current workload analysis
              </p>
            </Card>

            {recommendations.map((rec, index) => (
              <Card key={index} className="p-6 bg-white">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      rec.priority === 'HIGH'
                        ? 'bg-red-100'
                        : rec.priority === 'MEDIUM'
                        ? 'bg-yellow-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    {rec.priority === 'HIGH' ? (
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    ) : (
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{rec.title}</h4>
                      <Badge
                        className={
                          rec.priority === 'HIGH'
                            ? 'bg-red-100 text-red-800'
                            : rec.priority === 'MEDIUM'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }
                      >
                        {rec.priority} Priority
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{rec.description}</p>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-3">
                      <p className="text-sm font-medium text-orange-900">Recommended Action:</p>
                      <p className="text-sm text-orange-800">{rec.action}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {recommendations.length === 0 && (
              <Card className="p-12 bg-white text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  All Systems Optimal
                </h4>
                <p className="text-gray-600">
                  No optimization recommendations at this time. Your labour scheduling is running
                  efficiently!
                </p>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddWorkerModal
        isOpen={showAddWorkerModal}
        onClose={() => setShowAddWorkerModal(false)}
        onSubmit={handleAddWorker}
      />
      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onSubmit={handleAddTask}
      />
    </div>
  );
}
