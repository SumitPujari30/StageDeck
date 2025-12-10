import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Eye,
  QrCode,
  FileText,
  Ticket,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  RefreshCw,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton, SkeletonTable } from '@/components/ui/Skeleton';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui/Modal';
import eventsService, { Booking } from '@/services/events.service';
import { formatDate, formatCurrency } from '@/utils/format';
import { cn } from '@/utils/cn';

export const BookingsAdmin: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchQuery, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await eventsService.getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (searchQuery) {
      filtered = filtered.filter(
        (b) =>
          b.event?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b._id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const exportCSV = () => {
    eventsService.exportBookingsCSV(filteredBookings);
  };

  const exportPDF = () => {
    alert('PDF export - In production, this would generate a formatted PDF report');
  };

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    totalRevenue: bookings.reduce((sum, b) => sum + b.totalAmount, 0),
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
          <h1 className="text-3xl font-bold text-gray-900">All Bookings</h1>
          <p className="text-gray-600 mt-1">View and manage all event bookings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={exportPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={cn('w-4 h-4 mr-2', refreshing && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalRevenue)}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
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
                placeholder="Search by event name, user email, or booking ID..."
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      {loading ? (
        <SkeletonTable rows={10} />
      ) : filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Ticket className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No bookings have been made yet'}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tickets</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">
                        {booking._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{booking.event?.title || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{booking.event?.category}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{booking.user?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{booking.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {booking.tickets}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(booking.totalAmount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            booking.status === 'confirmed'
                              ? 'success'
                              : booking.status === 'pending'
                              ? 'warning'
                              : booking.status === 'cancelled'
                              ? 'destructive'
                              : 'default'
                          }
                        >
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(booking)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <Modal open={showDetailModal} onOpenChange={setShowDetailModal}>
          <ModalContent className="max-w-2xl">
            <ModalHeader>
              <ModalTitle>Booking Details</ModalTitle>
            </ModalHeader>
            <div className="space-y-6 py-4">
              {/* Event Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Event Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="font-medium text-lg text-gray-900">
                    {selectedBooking.event?.title}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {selectedBooking.event?.date ? formatDate(selectedBooking.event.date) : 'TBD'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="outline">{selectedBooking.event?.category}</Badge>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">User Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="font-medium text-gray-900">{selectedBooking.user?.name}</p>
                  <p className="text-sm text-gray-600">{selectedBooking.user?.email}</p>
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Booking Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Booking ID</p>
                    <p className="font-mono text-sm font-medium text-gray-900">{selectedBooking._id}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Tickets</p>
                    <p className="text-lg font-bold text-gray-900">{selectedBooking.tickets}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(selectedBooking.totalAmount)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge
                      variant={
                        selectedBooking.status === 'confirmed'
                          ? 'success'
                          : selectedBooking.status === 'pending'
                          ? 'warning'
                          : 'destructive'
                      }
                    >
                      {selectedBooking.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">QR Code Ticket</h4>
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-center text-gray-500 mt-2">
                  Show this code at event entrance
                </p>
              </div>
            </div>
            <ModalFooter>
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              <Button onClick={() => alert('Download invoice - feature coming soon')}>
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};
