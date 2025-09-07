'use client';

import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react';

export default function AnalyticsPage() {
  const stats = [
    {
      name: 'Total Documents',
      value: '1,247',
      change: '+12.5%',
      changeType: 'positive',
      icon: FileText
    },
    {
      name: 'Active Users',
      value: '156',
      change: '+8.2%',
      changeType: 'positive',
      icon: Users
    },
    {
      name: 'Avg. Review Time',
      value: '2.3 days',
      change: '-15.2%',
      changeType: 'positive',
      icon: Clock
    },
    {
      name: 'Compliance Rate',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive',
      icon: CheckCircle
    }
  ];

  const chartData = [
    { month: 'Jan', documents: 120, compliance: 89 },
    { month: 'Feb', documents: 135, compliance: 92 },
    { month: 'Mar', documents: 142, compliance: 91 },
    { month: 'Apr', documents: 158, compliance: 94 },
    { month: 'May', documents: 165, compliance: 96 },
    { month: 'Jun', documents: 178, compliance: 95 }
  ];

  const documentStatus = [
    { status: 'Published', count: 812, percentage: 65, color: 'bg-green-500' },
    { status: 'Under Review', count: 249, percentage: 20, color: 'bg-yellow-500' },
    { status: 'Draft', count: 149, percentage: 12, color: 'bg-gray-500' },
    { status: 'Expired', count: 37, percentage: 3, color: 'bg-red-500' }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Document published',
      document: 'Information Security Policy v3.2',
      user: 'Sarah Johnson',
      time: '2 hours ago',
      type: 'publish'
    },
    {
      id: 2,
      action: 'Review completed',
      document: 'Employee Handbook v2.1',
      user: 'Mike Davis',
      time: '4 hours ago',
      type: 'review'
    },
    {
      id: 3,
      action: 'Document created',
      document: 'Data Protection Procedures',
      user: 'Lisa Chen',
      time: '6 hours ago',
      type: 'create'
    },
    {
      id: 4,
      action: 'Document expired',
      document: 'Old Security Guidelines',
      user: 'System',
      time: '1 day ago',
      type: 'expire'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Comprehensive insights into your document management and compliance metrics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-card rounded-xl shadow-sm border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`ml-1 text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="ml-2 text-sm text-muted-foreground">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Growth Chart */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Document Growth</h3>
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {chartData.map((data, index) => (
              <div key={data.month} className="flex items-center">
                <div className="w-12 text-sm font-medium text-muted-foreground">{data.month}</div>
                <div className="flex-1 ml-4">
                  <div className="flex items-center">
                    <div className="flex-1 bg-muted rounded-full h-2 mr-4">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(data.documents / 200) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-foreground">{data.documents}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Status Distribution */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Document Status</h3>
            <PieChart className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {documentStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                  <span className="text-sm font-medium text-foreground">{item.status}</span>
                </div>
                <div className="flex items-center">
                  <div className="flex-1 bg-muted rounded-full h-2 w-24 mr-3">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <Activity className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'publish' ? 'bg-green-500' :
                  activity.type === 'review' ? 'bg-primary' :
                  activity.type === 'create' ? 'bg-purple-500' : 'bg-red-500'
                } mr-3`}></div>
                <div>
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.document}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{activity.user}</p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Compliance Overview</h3>
          <CheckCircle className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">94.2%</div>
            <div className="text-sm text-muted-foreground">Overall Compliance</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">156</div>
            <div className="text-sm text-muted-foreground">Active Documents</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">12</div>
            <div className="text-sm text-muted-foreground">Pending Reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
}
