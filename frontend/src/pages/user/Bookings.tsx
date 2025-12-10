import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Download,
  X,
  Filter,
  Search,
  QrCode,
  FileText,
  TrendingUp,
  Grid,
  List,
  ChevronDown,
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

export const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchQuery, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await eventsService.getUserBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (searchQuery) {
      filtered = filtered.filter(
        (b) =>
          b.event?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b._id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      await eventsService.cancelBooking(selectedBooking._id);
      setBookings(bookings.map(b => 
        b._id === selectedBooking._id ? { ...b, status: 'cancelled' as const } : b
      ));
      setShowCancelModal(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const downloadTicket = (booking: Booking) => {
    const ticketData = {
      bookingId: booking._id,
      event: booking.event?.title,
      date: booking.event?.date,
      tickets: booking.tickets,
      totalAmount: booking.totalAmount,
    };
    const blob = new Blob([JSON.stringify(ticketData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${booking._id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    totalSpent: bookings.reduce((sum, b) => sum + b.totalAmount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-white/90">Manage and track all your event bookings</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalSpent)}</div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by event name or booking ID..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
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
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'px-3 py-2 transition-colors',
                    viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'px-3 py-2 transition-colors',
                    viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      {loading ? (
        <SkeletonTable rows={5} />
      ) : filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Ticket className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : "You haven't made any bookings yet"}
            </p>
            <Button onClick={() => (window.location.href = '/user/events')}>Browse Events</Button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBookings.map((booking, index) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {booking.event?.title || 'Event'}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {booking.event?.date ? formatDate(booking.event.date) : 'TBD'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {booking.event?.location || 'TBD'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Ticket className="w-4 h-4" />
                          {booking.tickets} ticket{booking.tickets > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
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
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(booking.totalAmount)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowQRModal(true);
                        }}
                        title="View QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadTicket(booking)}
                        title="Download Ticket"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      {booking.status === 'confirmed' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowCancelModal(true);
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tickets</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{booking.event?.title || 'Event'}</p>
                          <p className="text-sm text-gray-500">{booking.event?.location}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {booking.event?.date ? formatDate(booking.event.date) : 'TBD'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{booking.tickets}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(booking.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            booking.status === 'confirmed'
                              ? 'success'
                              : booking.status === 'pending'
                              ? 'warning'
                              : 'destructive'
                          }
                        >
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowQRModal(true);
                            }}
                          >
                            <QrCode className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => downloadTicket(booking)}>
                            <Download className="w-4 h-4" />
                          </Button>
                          {booking.status === 'confirmed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowCancelModal(true);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
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

      {/* QR Code Modal */}
      <Modal open={showQRModal} onOpenChange={setShowQRModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Booking QR Code</ModalTitle>
          </ModalHeader>
          <div className="flex flex-col items-center py-6">
            <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <QrCode className="w-32 h-32 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-600">QR Code for</p>
                <p className="font-semibold">{selectedBooking?.event?.title}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">Booking ID: {selectedBooking?._id}</p>
            <p className="text-xs text-gray-500">Show this code at the event entrance</p>
          </div>
          <ModalFooter>
            <Button onClick={() => setShowQRModal(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Cancel Booking Modal */}
      <Modal open={showCancelModal} onOpenChange={setShowCancelModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Cancel Booking</ModalTitle>
          </ModalHeader>
          <div className="py-4">
            <p className="text-gray-600">Are you sure you want to cancel this booking?</p>
            <p className="font-semibold mt-2">{selectedBooking?.event?.title}</p>
            <p className="text-sm text-gray-500 mt-1">
              {selectedBooking?.tickets} ticket{selectedBooking?.tickets !== 1 ? 's' : ''} •{' '}
              {formatCurrency(selectedBooking?.totalAmount || 0)}
            </p>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ This action cannot be undone. Refunds may take 5-7 business days to process.
              </p>
            </div>
          </div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setShowCancelModal(false)}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Cancel Booking
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
