import React, { useState, useEffect } from 'react';

import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Globe,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { useAIAdmin } from '@/hooks/useAIAdmin';

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: UserProfileData) => void;
}

export interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  website?: string;
  occupation?: string;
  avatar?: File;
  avatarPreview?: string;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  open,
  onOpenChange,
  onSave,
}) => {
  const { user } = useAuth();
  const { generateEventDescription, loading: aiLoading } = useAIAdmin();
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    website: '',
    occupation: '',
  });

  // Initialize avatar from user data
  useEffect(() => {
    if (user?.avatar) {
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIBio = async () => {
    if (!profileData.name || !profileData.occupation) {
      alert('Please enter your name and occupation first');
      return;
    }

    const prompt = `${profileData.name}, ${profileData.occupation}${profileData.location ? `, from ${profileData.location}` : ''}`;
    const result = await generateEventDescription({
      title: prompt,
      category: 'Profile',
      location: profileData.location,
    });

    if (result.success) {
      // Adapt the AI result for bio
      const bio = result.data.substring(0, 300); // Limit bio length
      setProfileData({ ...profileData, bio });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSave = {
        ...profileData,
        avatar: avatarFile || undefined,
        avatarPreview: avatarPreview || undefined,
      };
      await onSave(dataToSave);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <ModalHeader>
          <ModalTitle>Edit Your Profile</ModalTitle>
        </ModalHeader>

        <div className="space-y-6 py-4">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
            <div className="relative group">
              <Avatar className="w-32 h-32 text-4xl border-4 border-white shadow-xl">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  user?.name?.charAt(0) || 'U'
                )}
              </Avatar>
              <label className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full cursor-pointer hover:bg-primary-700 transition-colors shadow-lg">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Click the camera icon to upload photo</p>
              <p className="text-xs text-gray-500">JPG, PNG or WEBP (Max 5MB)</p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <Input
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address *
              </label>
              <Input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              <Input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
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
                placeholder="New York, USA"
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
                placeholder="Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-2" />
                Website
              </label>
              <Input
                type="url"
                value={profileData.website}
                onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          {/* Bio with AI Generator */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Bio / About
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAIBio}
                disabled={aiLoading}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {aiLoading ? 'Generating...' : 'AI Generate'}
              </Button>
            </div>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{profileData.bio.length}/500 characters</p>
          </div>

          {/* Profile Completion */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-900">Profile Completion</p>
              <Badge variant="default" className="bg-blue-600">
                {Math.round(
                  ((profileData.name ? 1 : 0) +
                    (profileData.email ? 1 : 0) +
                    (profileData.phone ? 1 : 0) +
                    (profileData.location ? 1 : 0) +
                    (profileData.bio ? 1 : 0) +
                    (profileData.occupation ? 1 : 0)) / 6 * 100
                )}%
              </Badge>
            </div>
            <p className="text-xs text-blue-700">
              Complete your profile to unlock all features and get personalized recommendations
            </p>
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
