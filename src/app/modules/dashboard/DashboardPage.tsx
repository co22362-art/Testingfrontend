import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TrendingUp, Users, CheckCircle, Clock, ArrowRight, MoreVertical, Activity, Target, Zap, Award } from 'lucide-react';
import PAAppLayout from '../../components/PAAppLayout';
import PACard from '../../components/ui/PACard';

interface StatCard {
  id: number;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

interface ActivityItem {
  id: number;
  user: string;
  action: string;
  time: string;
  initials: string;
  color: string;
}

interface QuickAction {
  id: number;
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const stats: StatCard[] = [
    { 
      id: 1, 
      title: 'Total Users', 
      value: '2,847', 
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      color: 'blue'
    },
    { 
      id: 2, 
      title: 'Active Projects', 
      value: '142', 
      change: '+8.2%',
      changeType: 'positive',
      icon: Target,
      color: 'green'
    },
    { 
      id: 3, 
      title: 'Pending Tasks', 
      value: '89', 
      change: '-5.4%',
      changeType: 'negative',
      icon: Clock,
      color: 'orange'
    },
    { 
      id: 4, 
      title: 'Revenue', 
      value: '$45.2K', 
      change: '+18.7%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  const recentActivity: ActivityItem[] = [
    { id: 1, user: 'John Doe', action: 'created a new project', time: '5 minutes ago', initials: 'JD', color: 'bg-blue-500' },
    { id: 2, user: 'Sarah Smith', action: 'completed task #234', time: '15 minutes ago', initials: 'SS', color: 'bg-green-500' },
    { id: 3, user: 'Mike Johnson', action: 'updated user permissions', time: '1 hour ago', initials: 'MJ', color: 'bg-purple-500' },
    { id: 4, user: 'Emily Brown', action: 'submitted daily report', time: '2 hours ago', initials: 'EB', color: 'bg-orange-500' },
    { id: 5, user: 'David Lee', action: 'joined the team', time: '3 hours ago', initials: 'DL', color: 'bg-pink-500' }
  ];

  const quickActions: QuickAction[] = [
    { id: 1, title: 'User Management', description: 'Manage team members', path: '/people', icon: Users, color: 'blue' },
    { id: 2, title: 'Daily Wins', description: 'Track daily progress', path: '/daily-wins', icon: Award, color: 'green' },
    { id: 3, title: 'Analytics', description: 'View insights', path: '#', icon: Activity, color: 'purple' },
    { id: 4, title: 'Performance', description: 'Team metrics', path: '#', icon: Zap, color: 'orange' }
  ];

  const iconColors: Record<'blue' | 'green' | 'orange' | 'purple', string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <PAAppLayout activePage="dashboard">
      <div className="flex-1 overflow-auto bg-[#F9FAFB]">
        <div className="p-6 max-w-[1600px] mx-auto">
          <div className="space-y-6">
            {/* Page Header */}
            <div className="mb-2">
              <h1 className="text-2xl font-semibold text-[#111827] mb-1">Dashboard</h1>
              <p className="text-sm text-[#6B7280]">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <PACard key={stat.id} variant="elevated" className="p-5 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg ${iconColors[stat.color]} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        stat.changeType === 'positive' 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {stat.change}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-[#6B7280] mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-[#111827]">{stat.value}</p>
                  </PACard>
                );
              })}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity - 2 columns */}
              <div className="lg:col-span-2">
                <PACard variant="elevated" className="p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-[#111827]">Recent Activity</h2>
                      <p className="text-sm text-[#6B7280] mt-0.5">Latest updates from your team</p>
                    </div>
                    <button className="text-sm text-[#1976D2] hover:text-[#1565C0] font-semibold transition-colors">
                      View All
                    </button>
                  </div>
                  
                  <div className="space-y-1">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors group">
                        <div className={`w-10 h-10 rounded-lg ${activity.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                          <span className="text-sm font-bold text-white">
                            {activity.initials}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#111827]">
                            <span className="font-semibold">{activity.user}</span>{' '}
                            <span className="text-[#6B7280]">{activity.action}</span>
                          </p>
                          <p className="text-xs text-[#9CA3AF] mt-0.5">{activity.time}</p>
                        </div>
                        <button className="text-[#9CA3AF] hover:text-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </PACard>
              </div>

              {/* Quick Actions - 1 column */}
              <div>
                <PACard variant="elevated" className="p-6 hover:shadow-lg transition-shadow duration-200">
                  <h2 className="text-lg font-semibold text-[#111827] mb-1">Quick Actions</h2>
                  <p className="text-sm text-[#6B7280] mb-5">Common tasks</p>
                  <div className="space-y-3">
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.id}
                          onClick={() => action.path !== '#' && navigate(action.path)}
                          className="w-full text-left p-4 rounded-lg border border-[#E5E7EB] hover:border-[#1976D2] hover:bg-blue-50 transition-all duration-200 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${iconColors[action.color]} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-[#111827] text-sm mb-0.5">
                                {action.title}
                              </h3>
                              <p className="text-xs text-[#6B7280]">{action.description}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#1976D2] group-hover:translate-x-1 transition-all" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </PACard>
              </div>
            </div>

            {/* Project Overview */}
            <PACard variant="elevated" className="p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#111827]">Project Overview</h2>
                <p className="text-sm text-[#6B7280] mt-0.5">Current project status across teams</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 border border-[#E5E7EB] rounded-lg bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-[#6B7280]">In Progress</p>
                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                  </div>
                  <p className="text-3xl font-bold text-[#111827] mb-2">64</p>
                  <p className="text-sm text-[#6B7280]">Active development</p>
                  <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div className="p-5 border border-[#E5E7EB] rounded-lg bg-gradient-to-br from-green-50 to-white hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-[#6B7280]">Completed</p>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-[#111827] mb-2">127</p>
                  <p className="text-sm text-[#6B7280]">Successfully delivered</p>
                  <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div className="p-5 border border-[#E5E7EB] rounded-lg bg-gradient-to-br from-orange-50 to-white hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-[#6B7280]">On Hold</p>
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  </div>
                  <p className="text-3xl font-bold text-[#111827] mb-2">23</p>
                  <p className="text-sm text-[#6B7280]">Awaiting approval</p>
                  <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
              </div>
            </PACard>
          </div>
        </div>
      </div>
    </PAAppLayout>
  );
}
