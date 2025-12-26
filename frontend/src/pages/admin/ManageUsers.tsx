import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  UserPlus,
  Eye,
  Ban,
  Mail,
  Phone,
  RefreshCw,
  Users as UsersIcon,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui/Modal';
import userService, { User } from '@/services/user.service';
import { formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

export const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showAddOrganizerModal, setShowAddOrganizerModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Add Organizer form
  const [organizerData, setOrganizerData] = useState({
    name: '',
    email: '',
    phone: '',
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [addingOrganizer, setAddingOrganizer] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleSendOTP = async () => {
    if (!organizerData.email) {
      alert('Please enter email address');
      return;
    }

    setSendingOtp(true);
    try {
      // TODO: Call backend OTP endpoint
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setOtpSent(true);
      alert('OTP sent to ' + organizerData.email);
    } catch (error) {
      console.error('Failed to send OTP:', error);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleAddOrganizer = async () => {
    if (!organizerData.name || !organizerData.email || !organizerData.otp) {
      alert('Please fill all required fields');
      return;
    }

    setAddingOrganizer(true);
    try {
      // TODO: Verify OTP and add organizer via backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      const newOrganizer: User = {
        _id: Date.now().toString(),
        name: organizerData.name,
        email: organizerData.email,
        role: 'organizer',
        phone: organizerData.phone,
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      setUsers([...users, newOrganizer]);
      setShowAddOrganizerModal(false);
      setOrganizerData({ name: '', email: '', phone: '', otp: '' });
      setOtpSent(false);
      alert('Organizer added successfully!');
    } catch (error) {
      console.error('Failed to add organizer:', error);
      alert('Failed to add organizer. Please try again.');
    } finally {
      setAddingOrganizer(false);
    }
  };

  const handleApproveReject = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      await userService.updateApprovalStatus(userId, status);
      // Update local state
      setUsers(users.map(u => 
        u._id === userId ? { ...u, approvalStatus: status } : u
      ));
      alert(`User ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      console.error(`Failed to ${status} user:`, error);
      alert(`Failed to ${status} user. Please try again.`);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      await userService.toggleUserStatus(userId);
      // Update local state
      setUsers(users.map(u => 
        u._id === userId ? { ...u, isActive: !u.isActive } : u
      ));
      alert('User status updated successfully!');
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      alert('Failed to update user status. Please try again.');
    }
  };

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    organizers: users.filter(u => u.role === 'organizer').length,
    users: users.filter(u => u.role === 'user').length,
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-1">View and manage all platform users</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
            <RefreshCw className={cn('w-4 h-4 mr-2', refreshing && 'animate-spin')} />
            Refresh
          </Button>
          <Button onClick={() => setShowAddOrganizerModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Organizer
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.users}</div>
            <div className="text-sm text-gray-600">Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.organizers}</div>
            <div className="text-sm text-gray-600">Organizers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.admins}</div>
            <div className="text-sm text-gray-600">Admins</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="pl-10"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="organizer">Organizers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      {loading ? (
        <SkeletonTable rows={8} />
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <UsersIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">
              {searchQuery || roleFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No users in the system yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.phone ? (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {user.phone}
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            user.role === 'admin'
                              ? 'default'
                              : user.role === 'organizer'
                              ? 'success'
                              : 'outline'
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        {user.approvalStatus === 'pending' ? (
                          <Badge variant="warning">Pending</Badge>
                        ) : user.approvalStatus === 'approved' ? (
                          <Badge variant="success">Approved</Badge>
                        ) : (
                          <Badge variant="destructive">Rejected</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {user.approvalStatus === 'pending' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => handleApproveReject(user._id, 'approved')}
                                title="Approve User"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleApproveReject(user._id, 'rejected')}
                                title="Reject User"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm" title="View Details">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {user.role !== 'admin' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleToggleStatus(user._id)}
                              title={user.approvalStatus === 'approved' ? 'Deactivate User' : 'Activate User'}
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Organizer Modal */}
      <Modal open={showAddOrganizerModal} onOpenChange={setShowAddOrganizerModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              <UserPlus className="w-5 h-5 inline mr-2" />
              Add New Organizer
            </ModalTitle>
          </ModalHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <Input
                value={organizerData.name}
                onChange={(e) => setOrganizerData({ ...organizerData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={organizerData.email}
                  onChange={(e) => setOrganizerData({ ...organizerData, email: e.target.value })}
                  placeholder="john@example.com"
                  disabled={otpSent}
                />
                {!otpSent && (
                  <Button onClick={handleSendOTP} disabled={sendingOtp}>
                    {sendingOtp ? 'Sending...' : 'Send OTP'}
                  </Button>
                )}
              </div>
            </div>

            {otpSent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OTP Code *
                  <span className="text-xs text-gray-500 ml-2">(Check {organizerData.email})</span>
                </label>
                <Input
                  value={organizerData.otp}
                  onChange={(e) => setOrganizerData({ ...organizerData, otp: e.target.value })}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <Input
                type="tel"
                value={organizerData.phone}
                onChange={(e) => setOrganizerData({ ...organizerData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                📧 An OTP will be sent to the organizer's email for verification. Once verified, they'll
                receive their login credentials and can start creating events.
              </p>
            </div>
          </div>
          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddOrganizerModal(false);
                setOrganizerData({ name: '', email: '', phone: '', otp: '' });
                setOtpSent(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddOrganizer} disabled={!otpSent || addingOrganizer}>
              {addingOrganizer ? 'Adding...' : 'Add Organizer'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
