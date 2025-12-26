import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
  Camera,
  Shield,
  Bell,
  Palette,
  Lock,
  Save,
  Edit,
  TrendingUp,
  Award,
  Globe,
  Eye,
  EyeOff,
  Trash2,
  Moon,
  Sun,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { BadgeSystem, mockBadges } from '@/components/ui/BadgeSystem';
import { Progress } from '@/components/ui/Progress';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui/Modal';
import eventsService from '@/services/events.service';
import api from '@/services/api';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'badges' | 'settings'>('profile');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    occupation: '',
    website: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Enhanced Settings State
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showBookingHistory: false,
    showEmail: false,
    allowMessages: true,
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    eventReminders: true,
    bookingConfirmations: true,
    marketingEmails: false,
    newEventAlerts: true,
    smsNotifications: false,
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
  });
  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    eventsAttended: 0,
    totalSpent: 0,
    favoriteCategory: 'Technology',
  });

  useEffect(() => {
    // Initialize avatar preview from user data
    if (user?.avatar) {
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const bookings = await eventsService.getUserBookings();
      const now = new Date();
      const attended = bookings.filter(b => b.eventId && new Date(b.eventId.date) <= now).length;
      const total = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

      setUserStats({
        totalBookings: bookings.length,
        eventsAttended: attended,
        totalSpent: total,
        favoriteCategory: 'Technology',
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // TODO: API call to update profile
      console.log('Saving profile:', profileData);
      if (avatarFile) {
        // TODO: Upload avatar to server
        console.log('Uploading avatar:', avatarFile);
      }
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile');
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const avatarData = reader.result as string;
        setAvatarPreview(avatarData);
        
        // Save avatar to database immediately using API service
        try {
          const response = await api.put('/api/users/profile', {
            avatar: avatarData
          });
          
          if (response.data.success) {
            // Update auth context with new avatar
            if (user) {
              updateUser({ ...user, avatar: avatarData });
            }
            console.log('Avatar saved successfully');
          } else {
            throw new Error('Failed to save avatar');
          }
        } catch (error) {
          console.error('Failed to save avatar:', error);
          alert('Failed to save avatar to database');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters!');
      return;
    }
    // TODO: API call to change password
    console.log('Changing password');
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Password changed successfully!');
  };

  const handleDeleteAccount = () => {
    // TODO: API call to delete account
    console.log('Deleting account');
    setShowDeleteAccountModal(false);
    alert('Account deletion request submitted. You will receive a confirmation email.');
  };

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const downloadProfileJSON = () => {
    const data = {
      profile: profileData,
      stats: userStats,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `profile-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadProfilePDF = () => {
    // Simple PDF generation using window.print
    alert('PDF download feature - In production, this would generate a formatted PDF with your profile data');
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'stats' as const, label: 'Statistics', icon: TrendingUp },
    { id: 'badges' as const, label: 'Badges', icon: Award },
    { id: 'settings' as const, label: 'Settings', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar className="w-24 h-24 text-2xl border-4 border-white shadow-xl">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </Avatar>
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
            <p className="text-white/90">{user?.email}</p>
            <div className="flex gap-2 mt-3">
              <Badge variant="default" className="bg-white/20 text-white border-white/30">
                {user?.role === 'admin' ? 'Administrator' : 'Member'}
              </Badge>
              <Badge variant="default" className="bg-white/20 text-white border-white/30">
                {userStats.eventsAttended} Events Attended
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadProfileJSON} className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Download className="w-4 h-4 mr-2" />
              JSON
            </Button>
            <Button variant="outline" onClick={downloadProfilePDF} className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <Button
                    variant={isEditing ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
                  >
                    {isEditing ? (
                      <><Save className="w-4 h-4 mr-2" /> Save</>
                    ) : (
                      <><Edit className="w-4 h-4 mr-2" /> Edit</>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name
                    </label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </label>
                    <Input
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                      type="email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Location
                    </label>
                    <Input
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      disabled={!isEditing}
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Briefcase className="w-4 h-4 inline mr-2" />
                      Occupation
                    </label>
                    <Input
                      value={profileData.occupation}
                      onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Globe className="w-4 h-4 inline mr-2" />
                      Website
                    </label>
                    <Input
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      disabled={!isEditing}
                      type="url"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio / About
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">{profileData.bio.length}/500 characters</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-600">Total Bookings</span>
                  <span className="text-xl font-bold text-blue-600">{userStats.totalBookings}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-600">Events Attended</span>
                  <span className="text-xl font-bold text-green-600">{userStats.eventsAttended}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-gray-600">Total Spent</span>
                  <span className="text-xl font-bold text-purple-600">${userStats.totalSpent}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile Completion</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <Progress value={75} />
                <p className="text-xs text-gray-500">Add phone and location to reach 100%</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-100">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{userStats.totalBookings}</p>
              <p className="text-sm text-gray-600 mt-1">Total Bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-100">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{userStats.eventsAttended}</p>
              <p className="text-sm text-gray-600 mt-1">Events Attended</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-100">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">${userStats.totalSpent}</p>
              <p className="text-sm text-gray-600 mt-1">Total Spent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-100">
                  <Palette className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{userStats.favoriteCategory}</p>
              <p className="text-sm text-gray-600 mt-1">Favorite Category</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <BadgeSystem badges={mockBadges} />
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Lock className="w-5 h-5 inline mr-2" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Password</h4>
                <p className="text-sm text-gray-600 mb-3">Keep your account secure with a strong password</p>
                <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600 mb-3">Add an extra layer of security to your account</p>
                <Button variant="outline" disabled>
                  Enable 2FA (Coming Soon)
                </Button>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Active Sessions</h4>
                <p className="text-sm text-gray-600 mb-3">Manage your active login sessions</p>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Windows - Chrome</p>
                        <p className="text-xs text-gray-500">Current Session</p>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Shield className="w-5 h-5 inline mr-2" />
                Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Public Profile</p>
                  <p className="text-sm text-gray-600">Make your profile visible to others</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.profileVisible}
                  onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisible: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Show Booking History</p>
                  <p className="text-sm text-gray-600">Display your past bookings</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.showBookingHistory}
                  onChange={(e) => setPrivacySettings({ ...privacySettings, showBookingHistory: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Show Email</p>
                  <p className="text-sm text-gray-600">Display email on profile</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.showEmail}
                  onChange={(e) => setPrivacySettings({ ...privacySettings, showEmail: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Allow Messages</p>
                  <p className="text-sm text-gray-600">Let other users contact you</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.allowMessages}
                  onChange={(e) => setPrivacySettings({ ...privacySettings, allowMessages: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Bell className="w-5 h-5 inline mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.emailNotifications}
                  onChange={(e) => setNotificationPreferences({ ...notificationPreferences, emailNotifications: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Event Reminders</p>
                  <p className="text-sm text-gray-600">Get reminded before events</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.eventReminders}
                  onChange={(e) => setNotificationPreferences({ ...notificationPreferences, eventReminders: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Booking Confirmations</p>
                  <p className="text-sm text-gray-600">Get notified about bookings</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.bookingConfirmations}
                  onChange={(e) => setNotificationPreferences({ ...notificationPreferences, bookingConfirmations: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">New Event Alerts</p>
                  <p className="text-sm text-gray-600">Notify when new events added</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.newEventAlerts}
                  onChange={(e) => setNotificationPreferences({ ...notificationPreferences, newEventAlerts: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-gray-600">Promotional content</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.marketingEmails}
                  onChange={(e) => setNotificationPreferences({ ...notificationPreferences, marketingEmails: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-gray-600">Text message alerts</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.smsNotifications}
                  onChange={(e) => setNotificationPreferences({ ...notificationPreferences, smsNotifications: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance & Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Palette className="w-5 h-5 inline mr-2" />
                Appearance & Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleTheme}
                    className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                      theme === 'light'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Sun className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
                    <p className="text-sm font-medium text-center">Light</p>
                  </button>
                  <button
                    onClick={toggleTheme}
                    className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                      theme === 'dark'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Moon className="w-6 h-6 mx-auto mb-1 text-purple-500" />
                    <p className="text-sm font-medium text-center">Dark</p>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={appearanceSettings.language}
                  onChange={(e) => setAppearanceSettings({ ...appearanceSettings, language: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  value={appearanceSettings.timezone}
                  onChange={(e) => setAppearanceSettings({ ...appearanceSettings, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="IST">India Standard Time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                <select
                  value={appearanceSettings.dateFormat}
                  onChange={(e) => setAppearanceSettings({ ...appearanceSettings, dateFormat: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">
                <AlertCircle className="w-5 h-5 inline mr-2" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-red-600">Delete Account</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteAccountModal(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Settings Button */}
          <div className="lg:col-span-2">
            <Button onClick={() => alert('Settings saved!')} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save All Settings
            </Button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      <Modal open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Change Password</ModalTitle>
          </ModalHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
              <div className="mt-2">
                <Progress value={calculatePasswordStrength(passwordData.newPassword)} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  Password strength: {
                    calculatePasswordStrength(passwordData.newPassword) < 50 ? 'Weak' :
                    calculatePasswordStrength(passwordData.newPassword) < 75 ? 'Medium' : 'Strong'
                  }
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>
          </div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>
              Change Password
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Account Modal */}
      <Modal open={showDeleteAccountModal} onOpenChange={setShowDeleteAccountModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle className="text-red-600">Delete Account</ModalTitle>
          </ModalHeader>
          <div className="py-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-sm text-red-800 font-medium">
                ⚠️ Warning: This action is permanent and cannot be undone!
              </p>
            </div>
            <p className="text-gray-600 mb-4">
              Deleting your account will:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 mb-4">
              <li>Permanently delete your profile and all personal data</li>
              <li>Cancel all future event bookings</li>
              <li>Remove your booking history</li>
              <li>Delete all earned badges and achievements</li>
              <li>Unsubscribe you from all notifications</li>
            </ul>
            <p className="text-sm text-gray-600">
              If you're sure you want to proceed, type <strong>DELETE</strong> below to confirm:
            </p>
            <Input
              placeholder="Type DELETE to confirm"
              className="mt-2"
            />
          </div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setShowDeleteAccountModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete My Account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
