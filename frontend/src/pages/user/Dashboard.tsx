import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Ticket, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Star,
  MapPin,
  Users,
  Activity,
  Award,
  Bell,
  Zap,
  Camera,
  Edit,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { NotificationPanel, Notification } from '@/components/ui/NotificationPanel';
import { BadgeCard, mockBadges } from '@/components/ui/BadgeSystem';
import { UserProfileModal, UserProfileData } from '@/components/user/UserProfileModal';
import eventsService, { Event, Booking } from '@/services/events.service';
import { formatDate, formatCurrency } from '@/utils/format';

interface DashboardStats {
  totalBookings: number;
  upcomingEvents: number;
  totalSpent: number;
  eventsAttended: number;
}

interface ActivityItem {
  id: string;
  type: 'booking' | 'registration' | 'reminder' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  icon: any;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    upcomingEvents: 0,
    totalSpent: 0,
    eventsAttended: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your booking for Tech Conference 2024 has been confirmed!',
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Event Reminder',
      message: 'Your event "Music Festival" starts tomorrow at 6:00 PM',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
    {
      id: '3',
      type: 'update',
      title: 'Event Update',
      message: 'Venue changed for Business Summit - Check details',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
    },
  ]);
  const [activityTimeline, setActivityTimeline] = useState<ActivityItem[]>([]);
  
  useEffect(() => {
    fetchDashboardData();
    generateActivityTimeline();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const bookings = await eventsService.getUserBookings();
      setRecentBookings(bookings.slice(0, 5));
      
      const events = await eventsService.getEvents({ status: 'Scheduled' });
      setUpcomingEvents(events.slice(0, 4));
      
      const now = new Date();
      const upcoming = bookings.filter(b => 
        b.event && new Date(b.event.date) > now
      ).length;
      const attended = bookings.filter(b => 
        b.event && new Date(b.event.date) <= now
      ).length;
      const total = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
      
      setStats({
        totalBookings: bookings.length,
        upcomingEvents: upcoming,
        totalSpent: total,
        eventsAttended: attended,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateActivityTimeline = () => {
    const activities: ActivityItem[] = [
      {
        id: '1',
        type: 'booking',
        title: 'Booked Event',
        description: 'Tech Conference 2024',
        timestamp: new Date().toISOString(),
        icon: Ticket,
      },
      {
        id: '2',
        type: 'achievement',
        title: 'Badge Earned',
        description: 'Event Enthusiast - Attended 5 events',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        icon: Award,
      },
      {
        id: '3',
        type: 'registration',
        title: 'Profile Updated',
        description: 'Updated contact information',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        icon: Users,
      },
      {
        id: '4',
        type: 'booking',
        title: 'Booked Event',
        description: 'Music Festival',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        icon: Ticket,
      },
    ];
    setActivityTimeline(activities);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleSaveProfile = async (data: UserProfileData) => {
    try {
      // TODO: API call to update user profile
      console.log('Saving user profile:', data);
      if (data.avatarPreview) {
        setUserAvatar(data.avatarPreview);
      }
      alert('Profile updated successfully!');
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
      trend: '+12%',
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: '+5%',
    },
    {
      title: 'Total Spent',
      value: formatCurrency(stats.totalSpent),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: '+23%',
    },
    {
      title: 'Events Attended',
      value: stats.eventsAttended,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      trend: '+8%',
    },
  ];

  const earnedBadges = mockBadges.filter(b => b.earned);
  
  return (
    <div className="space-y-6">
      {/* Welcome Header with Profile Photo and Notification */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar className="w-20 h-20 text-2xl border-4 border-white shadow-xl">
                  {userAvatar ? (
                    <img src={userAvatar} alt="User" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    user?.name?.charAt(0) || 'U'
                  )}
                </Avatar>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="absolute bottom-0 right-0 p-1.5 bg-white text-primary-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.name}! 👋
                  </h1>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    title="Edit Profile"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-white/90">
                  Here's what's happening with your events
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <NotificationPanel
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDelete={handleDeleteNotification}
              />
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute left-0 bottom-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
      </motion.div>
      
      {/* Stats Grid with Trends */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
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
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {stat.trend}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recentBookings.length > 0 ? (
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {booking.event?.title || 'Event'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.tickets} ticket{booking.tickets > 1 ? 's' : ''} • {formatDate(booking.createdAt)}
                        </p>
                      </div>
                      <Badge
                        variant={
                          booking.status === 'confirmed' ? 'success' :
                          booking.status === 'pending' ? 'warning' :
                          'destructive'
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No bookings yet. Start exploring events!
                </p>
              )}
              
              <Link to="/user/bookings" className="block mt-4">
                <Button variant="outline" className="w-full">
                  View All Bookings
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <Link
                      key={event._id}
                      to={`/user/events/${event._id}`}
                      className="block"
                    >
                      <div className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-8 h-8 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{event.title}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(event.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                        {event.isFeatured && (
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No upcoming events available
                </p>
              )}
              
              <Link to="/user/events" className="block mt-4">
                <Button variant="outline" className="w-full">
                  Explore All Events
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Achievement Badges */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Achievements</CardTitle>
                <Link to="/user/profile">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {earnedBadges.slice(0, 3).map((badge) => (
                  <div key={badge.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900">{badge.name}</p>
                      <p className="text-xs text-gray-600 truncate">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Activity className="w-5 h-5 inline mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityTimeline.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary-600" />
                        </div>
                        {index < activityTimeline.length - 1 && (
                          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium text-sm text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/user/events">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Browse Events</p>
                    <p className="text-xs text-gray-500">Discover new events</p>
                  </div>
                </div>
              </Button>
            </Link>
            <Link to="/user/bookings">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Ticket className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">My Bookings</p>
                    <p className="text-xs text-gray-500">View your tickets</p>
                  </div>
                </div>
              </Button>
            </Link>
            <Link to="/user/profile">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Edit Profile</p>
                    <p className="text-xs text-gray-500">Manage your account</p>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* User Profile Modal */}
      <UserProfileModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
        onSave={handleSaveProfile}
      />
    </div>
  );
};
