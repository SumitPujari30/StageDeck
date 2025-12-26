import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Ticket,
  Star,
  Plus,
  Eye,
  UserPlus,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Trophy,
  ArrowUp,
  ArrowDown,

  Edit,
  Camera,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Avatar } from '@/components/ui/Avatar';
import { LineChart } from '@/components/dashboard/charts/LineChart';
import { PieChart } from '@/components/dashboard/charts/PieChart';

import { AdminProfileModal, AdminProfileData } from '@/components/admin/AdminProfileModal';
import { useAIAdmin } from '@/hooks/useAIAdmin';
import { useAuth } from '@/hooks/useAuth';
import eventsService from '@/services/events.service';
import { formatCurrency, formatDate } from '@/utils/format';

export const AdminDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [adminAvatar, setAdminAvatar] = useState<string>('');
  const { generateDashboardInsights, loading: aiLoading } = useAIAdmin();
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeEvents: 0,
    totalRevenue: 0,
    totalUsers: 0,
    feedbackRating: 0,
  });

  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [topEvents, setTopEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
    fetchAIInsights();
  }, []);

  // Initialize avatar from user object
  useEffect(() => {
    if (user?.avatar) {
      setAdminAvatar(user.avatar);
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from backend
      const events = await eventsService.getEvents();
      const bookings = await eventsService.getAllBookings();
      
      const activeEvents = events.filter(e => e.status === 'Scheduled').length;
      const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

      setStats({
        totalBookings: bookings.length,
        activeEvents,
        totalRevenue,
        totalUsers: 248, // Mock - TODO: fetch from API
        feedbackRating: 4.7,
      });

      // Mock revenue data
      setRevenueData([
        { month: 'Jan', revenue: 12000, bookings: 45 },
        { month: 'Feb', revenue: 15000, bookings: 58 },
        { month: 'Mar', revenue: 18000, bookings: 67 },
        { month: 'Apr', revenue: 22000, bookings: 82 },
        { month: 'May', revenue: 25000, bookings: 95 },
        { month: 'Jun', revenue: 30000, bookings: 110 },
      ]);

      // Mock category data
      setCategoryData([
        { name: 'Technology', value: 35 },
        { name: 'Music', value: 28 },
        { name: 'Business', value: 18 },
        { name: 'Sports', value: 12 },
        { name: 'Arts', value: 7 },
      ]);

      // Top performing events
      const sorted = [...events]
        .sort((a, b) => b.attendees - a.attendees)
        .slice(0, 5);
      setTopEvents(sorted);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIInsights = async () => {
    const result = await generateDashboardInsights({});
    if (result.success) {
      setAiInsights(result.data);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    await fetchAIInsights();
    setRefreshing(false);
  };


  const handleSaveProfile = async (data: AdminProfileData) => {
    try {
      console.log('Saving admin profile:', data);
      
      let avatarData: string | undefined;
      
      // Convert avatar File to base64 if present
      if (data.avatar) {
        avatarData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(data.avatar as File);
        });
      } else if (data.avatarPreview) {
        // Use existing preview if no new file
        avatarData = data.avatarPreview;
      }

      // Save to database via API
      const api = await import('@/services/api').then(m => m.default);
      const response = await api.put('/api/users/profile', {
        name: data.name,
        phone: data.phone,
        department: data.department,
        avatar: avatarData
      });

      if (response.data.success) {
        const updatedUser = {
          ...user!,
          name: data.name,
          phone: data.phone,
          department: data.department,
          avatar: avatarData
        };

        // Update local avatar state
        if (avatarData) {
          setAdminAvatar(avatarData);
        }

        // Update auth context
        updateUser(updatedUser);

        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      throw error;
    }
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Ticket,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: '+12.5%',
      trendUp: true,
    },
    {
      title: 'Active Events',
      value: stats.activeEvents,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: '+8.2%',
      trendUp: true,
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: '+23.1%',
      trendUp: true,
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      trend: '+15.3%',
      trendUp: true,
    },
    {
      title: 'Avg. Rating',
      value: stats.feedbackRating.toFixed(1),
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      trend: '+0.3',
      trendUp: true,
    },
  ];

  const quickActions = [
    {
      label: 'Create Event',
      icon: Plus,
      href: '/admin/events',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      label: 'View Bookings',
      icon: Eye,
      href: '/admin/bookings',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      label: 'Add Organizer',
      icon: UserPlus,
      href: '/admin/users',
      color: 'bg-green-600 hover:bg-green-700',
    },
  ];

  const insightIcons = {
    'trending-up': TrendingUp,
    'alert': AlertCircle,
    'trophy': Trophy,
  };

  return (
    <div className="space-y-6">
      {/* Header with Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Avatar className="w-16 h-16 text-xl border-2 border-primary-500">
              {adminAvatar ? (
                <img src={adminAvatar} alt="Admin" className="w-full h-full object-cover rounded-full" />
              ) : (
                user?.name?.charAt(0) || 'A'
              )}
            </Avatar>
            <button
              onClick={() => setShowProfileModal(true)}
              className="absolute bottom-0 right-0 p-1.5 bg-primary-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfileModal(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name}! Here's your platform overview.</p>
          </div>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </motion.div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={action.href}>
                <Button
                  className={`w-full h-auto py-4 ${action.color} text-white`}
                  variant="default"
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {action.label}
                </Button>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))
        ) : (
          statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                        {stat.trendUp ? (
                          <ArrowUp className="w-4 h-4" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={stat.trendUp ? 'text-green-600' : 'text-red-600'}>
                          {stat.trend}
                        </span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* AI Insights Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI-Powered Insights
            <Badge variant="outline" className="ml-2 text-xs">Powered by Gemini</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {aiLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiInsights.map((insight, index) => {
                const Icon = insightIcons[insight.icon as keyof typeof insightIcons] || Sparkles;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white rounded-lg border border-purple-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 rounded-lg" />
            ) : (
              <LineChart
                data={revenueData}
                dataKeys={[
                  { key: 'revenue', color: '#8b5cf6', name: 'Revenue ($)' },
                ]}
                xAxisKey="month"
                height={300}
              />
            )}
          </CardContent>
        </Card>

        {/* Booking Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 rounded-lg" />
            ) : (
              <PieChart
                data={categoryData}
                dataKey="value"
                nameKey="name"
                height={300}
                innerRadius={60}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Top Performing Events</CardTitle>
            <Link to="/admin/events">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : topEvents.length > 0 ? (
            <div className="space-y-3">
              {topEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600">{event.category} • {formatDate(event.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{event.attendees} attendees</span>
                    </div>
                    {event.isFeatured && (
                      <Badge variant="default" className="mt-1 bg-yellow-500">
                        Featured
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No events data available</p>
          )}
        </CardContent>
      </Card>

      {/* Admin Profile Modal */}
      <AdminProfileModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
        onSave={handleSaveProfile}
      />
    </div>
  );
};
