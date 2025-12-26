import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Sparkles,
  Upload,
  X,
  Eye,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  FileText,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui/Modal';
import { eventSchema, type EventInput } from '@/utils/validators';
import { useAIAdmin } from '@/hooks/useAIAdmin';
import eventsService from '@/services/events.service';
import { formatDate } from '@/utils/format';
import { useNavigate } from 'react-router-dom';

/**
 * Multi-step Create Event Wizard for Admin
 */

interface CreateEventWizardProps {
  onClose: () => void;
  onSuccess?: () => void;
}

type Step = 'basic' | 'schedule' | 'media' | 'tickets' | 'preview';

const steps: { id: Step; label: string; icon: any }[] = [
  { id: 'basic', label: 'Basic Info', icon: FileText },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'media', label: 'Media', icon: ImageIcon },
  { id: 'tickets', label: 'Tickets', icon: DollarSign },
  { id: 'preview', label: 'Preview', icon: Eye },
];

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

export const CreateEventWizard: React.FC<CreateEventWizardProps> = ({ onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const { generateEventDescription, loading: aiLoading } = useAIAdmin();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,

    formState: { errors },
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
  });

  const [isFeatured, setIsFeatured] = useState(false);

  const formData = watch();

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAIDescription = async () => {
    if (!formData.title || !formData.category) {
      alert('Please enter event title and category first');
      return;
    }

    const result = await generateEventDescription({
      title: formData.title,
      category: formData.category,
      location: formData.location,
      date: formData.date,
    });

    if (result.success) {
      setValue('description', result.data);
    }
  };

  const saveDraft = async () => {
    setSavingDraft(true);
    try {
      // Save to localStorage for recovery
      localStorage.setItem('eventDraft', JSON.stringify({ ...formData, imagePreview }));
      alert('Draft saved locally!');
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setSavingDraft(false);
    }
  };

  const onSubmit = async (data: EventInput) => {
    setSaving(true);
    try {
      // Upload image first if exists
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await eventsService.uploadEventImage(imageFile);
      }

      // Create event
      const eventData: any = {
        ...data,
        image: imageUrl,
        status: 'Scheduled' as const,
        isFeatured,
      };

      await eventsService.createEvent(eventData);

      // Clear draft
      localStorage.removeItem('eventDraft');

      alert('Event created successfully!');
      onSuccess?.();
      onClose();
      navigate('/admin/events');
    } catch (error: any) {
      console.error('Failed to create event:', error);
      alert(error.message || 'Failed to create event');
    } finally {
      setSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <Input
                {...register('title')}
                placeholder="e.g., Tech Conference 2024"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

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
                {...register('description')}
                rows={6}
                placeholder="Describe your event in detail..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date *
                </label>
                <Input
                  type="date"
                  {...register('date')}
                  className={errors.date ? 'border-red-500' : ''}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Time *
                </label>
                <Input
                  type="time"
                  {...register('time')}
                  className={errors.time ? 'border-red-500' : ''}
                />
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location *
              </label>
              <Input
                {...register('location')}
                placeholder="e.g., Convention Center, New York"
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>
          </div>
        );

      case 'media':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Event Banner/Poster
              </label>
              
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </div>
        );

      case 'tickets':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Ticket Price
                </label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  placeholder="0.00 (Free event)"
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank for free events</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Capacity
                </label>
                <Input
                  type="number"
                  {...register('capacity', { valueAsNumber: true })}
                  placeholder="Unlimited"
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank for unlimited</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded"
              />
              <div>
                <p className="font-medium text-gray-900">Feature this event</p>
                <p className="text-sm text-gray-600">
                  Featured events appear prominently on the homepage
                </p>
              </div>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{formData.title || 'Event Title'}</h3>
              {isFeatured && (
                <Badge variant="default" className="bg-yellow-500 mb-4">Featured Event</Badge>
              )}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-5 h-5" />
                  <span>{formData.date ? formatDate(formData.date) : 'Date TBD'} • {formData.time || 'Time TBD'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5" />
                  <span>{formData.location || 'Location TBD'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Badge variant="outline">{formData.category || 'Category'}</Badge>
                </div>
              </div>
            </div>

            {imagePreview && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Event Banner</h4>
                <img src={imagePreview} alt="Event" className="w-full h-48 object-cover rounded-lg" />
              </div>
            )}

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{formData.description || 'No description'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-xl font-bold text-gray-900">
                  {formData.price ? `$${formData.price}` : 'Free'}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Capacity</p>
                <p className="text-xl font-bold text-gray-900">
                  {formData.capacity || 'Unlimited'}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal open={true} onOpenChange={onClose}>
      <ModalContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <ModalHeader>
          <ModalTitle>Create New Event</ModalTitle>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStepIndex > index;

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isActive
                            ? 'bg-primary-600 text-white'
                            : isCompleted
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <p
                        className={`text-xs mt-2 ${
                          isActive ? 'text-primary-600 font-medium' : 'text-gray-600'
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 mx-2 ${
                          isCompleted ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="min-h-[400px]"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <ModalFooter className="mt-8 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={saveDraft}
              disabled={savingDraft}
            >
              <Save className="w-4 h-4 mr-2" />
              {savingDraft ? 'Saving...' : 'Save Draft'}
            </Button>

            <div className="flex gap-2">
              {currentStepIndex > 0 && (
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}

              {currentStepIndex < steps.length - 1 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={saving}>
                  {saving ? 'Publishing...' : 'Publish Event'}
                </Button>
              )}
            </div>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
