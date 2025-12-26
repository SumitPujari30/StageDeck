import React, { useState, useEffect } from 'react';

import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Save,
  Sparkles,

  Star,
  Clock,
} from 'lucide-react';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { ImageUpload } from '@/components/common/ImageUpload';
import { useAIAdmin } from '@/hooks/useAIAdmin';
import eventsService, { Event } from '@/services/events.service';

interface EditEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
  onSave: (eventId: string, data: Partial<Event>) => Promise<void>;
}

const categories = [
  'Technology',
  'Business',
  'Music',
  'Sports',
  'Arts',
  'Education',
  'Health',
  'Food',
];

export const EditEventModal: React.FC<EditEventModalProps> = ({
  open,
  onOpenChange,
  event,
  onSave,
}) => {
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(event.image || '');
  const { generateEventDescription, loading: aiLoading } = useAIAdmin();

  const [eventData, setEventData] = useState({
    title: event.title,
    description: event.description,
    date: event.date,
    time: event.time,
    location: event.location,
    category: event.category,
    price: event.price || 0,
    capacity: event.capacity || 0,
    isFeatured: event.isFeatured,
    status: event.status,
  });

  useEffect(() => {
    // Reset form when event changes
    setEventData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      price: event.price || 0,
      capacity: event.capacity || 0,
      isFeatured: event.isFeatured,
      status: event.status,
    });
    setImagePreview(event.image || '');
  }, [event]);

  const handleImageSelect = (file: File, preview: string) => {
    setImageFile(file);
    setImagePreview(preview);
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleAIDescription = async () => {
    if (!eventData.title || !eventData.category) {
      alert('Please enter event title and category first');
      return;
    }

    const result = await generateEventDescription({
      title: eventData.title,
      category: eventData.category,
      location: eventData.location,
      date: eventData.date,
    });

    if (result.success) {
      setEventData({ ...eventData, description: result.data });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Upload image if changed
      let imageUrl = imagePreview;
      if (imageFile) {
        // Upload image to server
        imageUrl = await eventsService.uploadEventImage(imageFile);
      }

      const updatedData: Partial<Event> = {
        ...eventData,
        image: imageUrl,
        price: eventData.price || undefined,
        capacity: eventData.capacity || undefined,
      };

      await onSave(event._id, updatedData);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update event:', error);
      alert('Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <ModalHeader>
          <ModalTitle>Edit Event</ModalTitle>
        </ModalHeader>

        <div className="space-y-6 py-4">
          {/* Event Image */}
          <ImageUpload
            onImageSelect={handleImageSelect}
            onImageRemove={handleImageRemove}
            currentImage={imagePreview}
            label="Event Banner"
            maxSize={5}
          />

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <Input
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                placeholder="e.g., Tech Conference 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={eventData.category}
                onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={eventData.status}
                onChange={(e) => setEventData({ ...eventData, status: e.target.value as Event['status'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Event Date *
              </label>
              <Input
                type="date"
                value={eventData.date}
                onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Event Time *
              </label>
              <Input
                type="time"
                value={eventData.time}
                onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location *
              </label>
              <Input
                value={eventData.location}
                onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                placeholder="e.g., Convention Center, New York"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Ticket Price
              </label>
              <Input
                type="number"
                step="0.01"
                value={eventData.price}
                onChange={(e) => setEventData({ ...eventData, price: parseFloat(e.target.value) || 0 })}
                placeholder="0.00 (Free event)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Capacity
              </label>
              <Input
                type="number"
                value={eventData.capacity}
                onChange={(e) => setEventData({ ...eventData, capacity: parseInt(e.target.value) || 0 })}
                placeholder="Unlimited"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAIDescription}
                disabled={aiLoading}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {aiLoading ? 'Generating...' : 'AI Generate'}
              </Button>
            </div>
            <textarea
              value={eventData.description}
              onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Describe your event in detail..."
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
            <input
              type="checkbox"
              checked={eventData.isFeatured}
              onChange={(e) => setEventData({ ...eventData, isFeatured: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded"
            />
            <div>
              <p className="font-medium text-gray-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                Featured Event
              </p>
              <p className="text-sm text-gray-600">
                Featured events appear prominently on the homepage
              </p>
            </div>
          </div>
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
