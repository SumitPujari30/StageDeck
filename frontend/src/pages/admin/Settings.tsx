import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Lock,
  Bell,
  Palette,
  Globe,
  Shield,
  Mail,
  Database,
  Zap,
  Users,
  CreditCard,
  AlertCircle,
  Save,
  Moon,
  Sun,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui/Modal';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { Progress } from '@/components/ui/Progress';

type SettingsTab = 'general' | 'security' | 'notifications' | 'appearance' | 'platform' | 'integrations';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'StageDeck',
    siteDescription: 'Event Management Platform',
    adminEmail: user?.email || '',
    supportEmail: 'support@stagedeck.com',
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    ipWhitelisting: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newBookingAlert: true,
    newUserAlert: true,
    eventPublishedAlert: true,
    paymentAlert: true,
    systemAlerts: true,
    weeklyReport: true,
    monthlyReport: true,
  });

  // Platform Settings
  const [platformSettings, setPlatformSettings] = useState({
    allowUserRegistration: true,
    requireEmailVerification: true,
    allowSocialLogin: false,
    enableReviews: true,
    enableChat: false,
    maintenanceMode: false,
    maxFileSize: 5,
    allowedFileTypes: 'jpg,png,pdf',
  });

  // Integration Settings
  const [integrationSettings, setIntegrationSettings] = useState({
    geminiApiKey: '',
    razorpayKeyId: '',
    razorpayKeySecret: '',
    stripePublishableKey: '',
    stripeSecretKey: '',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
  });

  const tabs = [
    { id: 'general' as const, label: 'General', icon: SettingsIcon },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    { id: 'platform' as const, label: 'Platform', icon: Database },
    { id: 'integrations' as const, label: 'Integrations', icon: Zap },
  ];

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // TODO: API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // TODO: API call to change password
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Password changed successfully!');
  };

  const handleTestEmail = async () => {
    alert('Test email sent! Check your inbox.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your platform configuration and preferences</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium transition-colors whitespace-nowrap ${
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

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                <Input
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                <textarea
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                <Input
                  type="email"
                  value={generalSettings.adminEmail}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, adminEmail: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                <Input
                  type="email"
                  value={generalSettings.supportEmail}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  value={generalSettings.timezone}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="IST">India Standard Time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={generalSettings.language}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                <select
                  value={generalSettings.dateFormat}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, dateFormat: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={generalSettings.currency}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Lock className="w-5 h-5 inline mr-2" />
                Password & Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Change Password</h4>
                <p className="text-sm text-gray-600 mb-3">Keep your account secure with a strong password</p>
                <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={securitySettings.twoFactorEnabled}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorEnabled: e.target.checked })}
                    className="w-5 h-5 text-primary-600 rounded"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                <Input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
                <Input
                  type="number"
                  value={securitySettings.passwordExpiry}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                <Input
                  type="number"
                  value={securitySettings.loginAttempts}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, loginAttempts: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">IP Whitelisting</p>
                  <p className="text-sm text-gray-600">Restrict access to specific IPs</p>
                </div>
                <input
                  type="checkbox"
                  checked={securitySettings.ipWhitelisting}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, ipWhitelisting: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">New Booking Alerts</p>
                  <p className="text-sm text-gray-600">Get notified of new bookings</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.newBookingAlert}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, newBookingAlert: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">New User Registration</p>
                  <p className="text-sm text-gray-600">Alert when new users sign up</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.newUserAlert}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, newUserAlert: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Event Published</p>
                  <p className="text-sm text-gray-600">Notification when events go live</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.eventPublishedAlert}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, eventPublishedAlert: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Alerts & Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Payment Alerts</p>
                  <p className="text-sm text-gray-600">Notify on payment events</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.paymentAlert}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, paymentAlert: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">System Alerts</p>
                  <p className="text-sm text-gray-600">Critical system notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.systemAlerts}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, systemAlerts: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Weekly Report</p>
                  <p className="text-sm text-gray-600">Receive weekly analytics</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.weeklyReport}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyReport: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Monthly Report</p>
                  <p className="text-sm text-gray-600">Receive monthly summary</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.monthlyReport}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, monthlyReport: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Appearance Settings */}
      {activeTab === 'appearance' && (
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Color Theme</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleTheme}
                    className={`flex-1 p-6 border-2 rounded-lg transition-all ${
                      theme === 'light'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <p className="font-medium text-center">Light Mode</p>
                  </button>
                  <button
                    onClick={toggleTheme}
                    className={`flex-1 p-6 border-2 rounded-lg transition-all ${
                      theme === 'dark'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Moon className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <p className="font-medium text-center">Dark Mode</p>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-3">Accent Color</label>
                <div className="grid grid-cols-6 gap-3">
                  {['purple', 'blue', 'green', 'red', 'orange', 'pink'].map((color) => (
                    <button
                      key={color}
                      className={`w-12 h-12 rounded-lg bg-${color}-500 hover:scale-110 transition-transform`}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Platform Settings */}
      {activeTab === 'platform' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow User Registration</p>
                  <p className="text-sm text-gray-600">Users can create accounts</p>
                </div>
                <input
                  type="checkbox"
                  checked={platformSettings.allowUserRegistration}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, allowUserRegistration: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Require Email Verification</p>
                  <p className="text-sm text-gray-600">Users must verify email</p>
                </div>
                <input
                  type="checkbox"
                  checked={platformSettings.requireEmailVerification}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, requireEmailVerification: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Social Login</p>
                  <p className="text-sm text-gray-600">Allow Google/Facebook login</p>
                </div>
                <input
                  type="checkbox"
                  checked={platformSettings.allowSocialLogin}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, allowSocialLogin: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features & Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Reviews</p>
                  <p className="text-sm text-gray-600">Users can leave reviews</p>
                </div>
                <input
                  type="checkbox"
                  checked={platformSettings.enableReviews}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, enableReviews: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Enable Chat</p>
                  <p className="text-sm text-gray-600">Live chat support</p>
                </div>
                <input
                  type="checkbox"
                  checked={platformSettings.enableChat}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, enableChat: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-gray-600">Disable public access</p>
                </div>
                <input
                  type="checkbox"
                  checked={platformSettings.maintenanceMode}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, maintenanceMode: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </div>
              <div className="pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
                <Input
                  type="number"
                  value={platformSettings.maxFileSize}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, maxFileSize: parseInt(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Integration Settings */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Zap className="w-5 h-5 inline mr-2" />
                AI Integration (Google Gemini)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gemini API Key</label>
                <div className="flex gap-2">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={integrationSettings.geminiApiKey}
                    onChange={(e) => setIntegrationSettings({ ...integrationSettings, geminiApiKey: e.target.value })}
                    placeholder="Enter your Gemini API key"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <CreditCard className="w-5 h-5 inline mr-2" />
                Payment Gateways
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Razorpay</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Key ID</label>
                    <Input
                      value={integrationSettings.razorpayKeyId}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, razorpayKeyId: e.target.value })}
                      placeholder="rzp_test_..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Key Secret</label>
                    <Input
                      type="password"
                      value={integrationSettings.razorpayKeySecret}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, razorpayKeySecret: e.target.value })}
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Stripe</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Publishable Key</label>
                    <Input
                      value={integrationSettings.stripePublishableKey}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, stripePublishableKey: e.target.value })}
                      placeholder="pk_test_..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
                    <Input
                      type="password"
                      value={integrationSettings.stripeSecretKey}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, stripeSecretKey: e.target.value })}
                      placeholder="sk_test_..."
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Mail className="w-5 h-5 inline mr-2" />
                Email Configuration (SMTP)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                  <Input
                    value={integrationSettings.smtpHost}
                    onChange={(e) => setIntegrationSettings({ ...integrationSettings, smtpHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                  <Input
                    value={integrationSettings.smtpPort}
                    onChange={(e) => setIntegrationSettings({ ...integrationSettings, smtpPort: e.target.value })}
                    placeholder="587"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP User</label>
                <Input
                  type="email"
                  value={integrationSettings.smtpUser}
                  onChange={(e) => setIntegrationSettings({ ...integrationSettings, smtpUser: e.target.value })}
                  placeholder="your-email@gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
                <Input
                  type="password"
                  value={integrationSettings.smtpPassword}
                  onChange={(e) => setIntegrationSettings({ ...integrationSettings, smtpPassword: e.target.value })}
                  placeholder="••••••••••••"
                />
              </div>
              <Button variant="outline" onClick={handleTestEmail}>
                <Mail className="w-4 h-4 mr-2" />
                Send Test Email
              </Button>
            </CardContent>
          </Card>
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
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
              <div className="mt-2">
                <Progress value={33} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Password strength: Medium</p>
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
    </div>
  );
};
