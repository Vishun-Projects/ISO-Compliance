'use client';

import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  FileText, 
  Shield, 
  Users, 
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Eye,
  Download
} from 'lucide-react';

export default function CompliancePage() {
  const complianceStandards = [
    {
      name: 'ISO 27001',
      status: 'Compliant',
      score: 94,
      lastAudit: '2024-01-15',
      nextAudit: '2024-07-15',
      icon: Shield,
      color: 'green'
    },
    {
      name: 'ISO 9001',
      status: 'Compliant',
      score: 89,
      lastAudit: '2024-02-01',
      nextAudit: '2024-08-01',
      icon: CheckCircle,
      color: 'green'
    },
    {
      name: 'GDPR',
      status: 'Under Review',
      score: 76,
      lastAudit: '2024-01-20',
      nextAudit: '2024-04-20',
      icon: Users,
      color: 'yellow'
    },
    {
      name: 'SOC 2',
      status: 'In Progress',
      score: 45,
      lastAudit: 'N/A',
      nextAudit: '2024-06-30',
      icon: FileText,
      color: 'blue'
    }
  ];

  const auditHistory = [
    {
      id: 1,
      standard: 'ISO 27001',
      type: 'External Audit',
      date: '2024-01-15',
      result: 'Passed',
      auditor: 'ABC Audit Services',
      score: 94
    },
    {
      id: 2,
      standard: 'ISO 9001',
      type: 'Internal Audit',
      date: '2024-02-01',
      result: 'Passed',
      auditor: 'Internal Team',
      score: 89
    },
    {
      id: 3,
      standard: 'GDPR',
      type: 'Compliance Review',
      date: '2024-01-20',
      result: 'Minor Issues',
      auditor: 'Legal Team',
      score: 76
    },
    {
      id: 4,
      standard: 'ISO 27001',
      type: 'External Audit',
      date: '2023-07-15',
      result: 'Passed',
      auditor: 'ABC Audit Services',
      score: 92
    }
  ];

  const upcomingAudits = [
    {
      id: 1,
      standard: 'ISO 27001',
      date: '2024-07-15',
      type: 'External Audit',
      status: 'Scheduled',
      daysLeft: 45
    },
    {
      id: 2,
      standard: 'ISO 9001',
      date: '2024-08-01',
      type: 'External Audit',
      status: 'Scheduled',
      daysLeft: 62
    },
    {
      id: 3,
      standard: 'GDPR',
      date: '2024-04-20',
      type: 'Compliance Review',
      status: 'Pending',
      daysLeft: 12
    }
  ];

  const complianceMetrics = [
    {
      name: 'Overall Compliance',
      value: '87.5%',
      change: '+2.3%',
      changeType: 'positive',
      icon: TrendingUp
    },
    {
      name: 'Active Standards',
      value: '4',
      change: '+1',
      changeType: 'positive',
      icon: CheckCircle
    },
    {
      name: 'Pending Audits',
      value: '3',
      change: '-1',
      changeType: 'positive',
      icon: Clock
    },
    {
      name: 'Risk Level',
      value: 'Low',
      change: 'Stable',
      changeType: 'neutral',
      icon: AlertCircle
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Compliance Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and manage your ISO compliance standards and audit requirements
        </p>
      </div>

      {/* Compliance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {complianceMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.name} className="bg-card rounded-xl shadow-sm border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  metric.changeType === 'positive' ? 'text-green-600' : 
                  metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.change}
                </span>
                <span className="ml-2 text-sm text-muted-foreground">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compliance Standards */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Compliance Standards</h3>
          <Shield className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {complianceStandards.map((standard) => {
            const Icon = standard.icon;
            return (
              <div key={standard.name} className="border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${
                      standard.color === 'green' ? 'bg-green-100' :
                      standard.color === 'yellow' ? 'bg-yellow-100' :
                      standard.color === 'blue' ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        standard.color === 'green' ? 'text-green-600' :
                        standard.color === 'yellow' ? 'text-yellow-600' :
                        standard.color === 'blue' ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-lg font-semibold text-foreground">{standard.name}</h4>
                      <p className={`text-sm font-medium ${
                        standard.status === 'Compliant' ? 'text-green-600' :
                        standard.status === 'Under Review' ? 'text-yellow-600' :
                        'text-primary'
                      }`}>
                        {standard.status}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">{standard.score}%</div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Audit:</span>
                    <span className="font-medium">{standard.lastAudit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Next Audit:</span>
                    <span className="font-medium">{standard.nextAudit}</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button onClick={() => alert(`Details for ${standard.name}`)} className="flex-1 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    View Details
                  </button>
                  <button onClick={() => {
                    const txt = `${standard.name} (${standard.status}) - Score: ${standard.score}%`;
                    const blob = new Blob([txt], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${standard.name.replace(/[^a-z0-9]/gi,'_')}_summary.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }} className="px-3 py-2 border border-input rounded-lg text-sm font-medium hover:bg-accent transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Upcoming Audits</h3>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {upcomingAudits.map((audit) => (
              <div key={audit.id} className="flex items-center justify-between p-4 bg-accent rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground">{audit.standard}</h4>
                  <p className="text-sm text-muted-foreground">{audit.type}</p>
                  <p className="text-sm text-muted-foreground">{audit.date}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    audit.status === 'Scheduled' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {audit.status}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">{audit.daysLeft} days left</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit History */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Audit History</h3>
            <Activity className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {auditHistory.map((audit) => (
              <div key={audit.id} className="flex items-center justify-between p-4 bg-accent rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground">{audit.standard}</h4>
                  <p className="text-sm text-muted-foreground">{audit.type} - {audit.auditor}</p>
                  <p className="text-sm text-muted-foreground">{audit.date}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    audit.result === 'Passed' ? 'bg-green-100 text-green-800' :
                    audit.result === 'Minor Issues' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {audit.result}
                  </span>
                  <p className="text-sm font-medium text-foreground mt-1">{audit.score}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Actions */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
          <BarChart3 className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border border-input rounded-lg hover:bg-accent transition-colors">
            <Eye className="w-5 h-5 text-primary mr-2" />
            <span className="font-medium">Generate Report</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-input rounded-lg hover:bg-accent transition-colors">
            <Calendar className="w-5 h-5 text-green-600 mr-2" />
            <span className="font-medium">Schedule Audit</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-input rounded-lg hover:bg-accent transition-colors">
            <Download className="w-5 h-5 text-purple-600 mr-2" />
            <span className="font-medium">Export Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
