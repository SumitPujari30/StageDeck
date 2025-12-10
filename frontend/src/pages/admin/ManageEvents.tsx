import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Copy,
  Star,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton, SkeletonTable } from '@/components/ui/Skeleton';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui/Modal';
import { CreateEventWizard } from '@/components/admin/CreateEventWizard';
import { EditEventModal } from '@/components/admin/EditEventModal';
import eventsService, { Event } from '@/services/events.service';
import { formatDate, formatCurrency } from '@/utils/format';
import { cn } from '@/utils/cn';

export const ManageEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery, statusFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsService.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((e) => e.status === statusFilter);
    }

    setFilteredEvents(filtered);
  };

  const handleDelete = async (id: string) => {
    setShowDeleteModal(false);
    try {
      await eventsService.deleteEvent(id);
      setEvents(events.filter(e => e._id !== id));
      alert('Event deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete event:', error);
      alert(error.message || 'Failed to delete event');
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (eventId: string, data: Partial<Event>) => {
    try {
      const updated = await eventsService.updateEvent(eventId, data);
      setEvents(events.map(e => e._id === eventId ? updated : e));
      alert('Event updated successfully');
    } catch (error: any) {
      console.error('Failed to update event:', error);
      throw new Error(error.message || 'Failed to update event');
    }
  };

  const confirmDelete = (event: Event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const updated = await eventsService.toggleFeatured(id);
      setEvents(events.map(e => e._id === id ? updated : e));
    } catch (error: any) {
      console.error('Failed to toggle featured:', error);
      alert(error.message || 'Failed to update event');
    }
  };

  const stats = {
    total: events.length,
    scheduled: events.filter(e => e.status === 'Scheduled').length,
    draft: events.filter(e => e.status === 'Draft').length,
    completed: events.filter(e => e.status === 'Completed').length,
    cancelled: events.filter(e => e.status === 'Cancelled').length,
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
          <p className="text-gray-600 mt-1">Create, edit, and manage all your events</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Event
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Events</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.scheduled}</div>
            <div className="text-sm text-gray-600">Scheduled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
            <div className="text-sm text-gray-600">Draft</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600">Cancelled</div>
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
                placeholder="Search events by name, description, or location..."
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Draft">Draft</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      {loading ? (
        <SkeletonTable rows={8} />
      ) : filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first event to get started'}
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendees</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEvents.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-6 h-6 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{event.title}</p>
                            <p className="text-sm text-gray-500">{event.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(event.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {event.attendees}{event.capacity ? ` / ${event.capacity}` : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {event.price ? formatCurrency(event.price) : 'Free'}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            event.status === 'Scheduled'
                              ? 'success'
                              : event.status === 'Draft'
                              ? 'warning'
                              : event.status === 'Completed'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {event.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFeatured(event._id)}
                            title={event.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                          >
                            <Star
                              className={cn(
                                'w-4 h-4',
                                event.isFeatured ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'
                              )}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(event)}
                            title="Edit Event"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDelete(event)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventWizard
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchEvents}
        />
      )}

      {/* Edit Event Modal */}
      {selectedEvent && (
        <EditEventModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          event={selectedEvent}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Delete Event
            </ModalTitle>
          </ModalHeader>
          <div className="py-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-sm text-red-800 font-medium">
                ⚠️ Warning: This action cannot be undone!
              </p>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this event?
            </p>
            {selectedEvent && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900">{selectedEvent.title}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedEvent.category} • {formatDate(selectedEvent.date)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Current attendees: {selectedEvent.attendees}
                </p>
              </div>
            )}
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>This will:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Permanently remove the event from the system</li>
                <li>Cancel all existing bookings</li>
                <li>Notify all registered attendees</li>
                <li>Remove event from all listings</li>
              </ul>
            </div>
          </div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedEvent && handleDelete(selectedEvent._id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Event
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
