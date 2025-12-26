import React, { useState, useEffect } from 'react';

import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,

  Shield,
  Briefcase,
} from 'lucide-react';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';

import { useAuth } from '@/hooks/useAuth';

interface AdminProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: AdminProfileData) => void;
}

export interface AdminProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  role: string;
  department: string;
  avatar?: File;
  avatarPreview?: string;
}

export const AdminProfileModal: React.FC<AdminProfileModalProps> = ({
  open,
  onOpenChange,
  onSave,
}) => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  
  const [profileData, setProfileData] = useState<AdminProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    role: user?.role || 'admin',
    department: 'Management',
  });

  // Initialize avatar from user data
  useEffect(() => {
    if (user?.avatar) {
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  const handleImageSelect = (file: File, preview: string) => {
    setAvatarFile(file);
    setAvatarPreview(preview);
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
          <ModalTitle>Edit Admin Profile</ModalTitle>
        </ModalHeader>

        <div className="space-y-6 py-4">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
            <div className="relative group">
              <Avatar className="w-32 h-32 text-4xl border-4 border-white shadow-xl">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  user?.name?.charAt(0) || 'A'
                )}
              </Avatar>
              <label className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full cursor-pointer hover:bg-primary-700 transition-colors shadow-lg">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        handleImageSelect(file, reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
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
                placeholder="john@stagedeck.com"
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
                <Shield className="w-4 h-4 inline mr-2" />
                Role
              </label>
              <Input
                value={profileData.role}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-2" />
                Department
              </label>
              <select
                value={profileData.department}
                onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Management">Management</option>
                <option value="Operations">Operations</option>
                <option value="Marketing">Marketing</option>
                <option value="Support">Support</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio / About
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
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
