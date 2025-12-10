import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  onImageRemove: () => void;
  currentImage?: string;
  maxSize?: number; // in MB
  aspectRatio?: string;
  label?: string;
  showCrop?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  onImageRemove,
  currentImage,
  maxSize = 5,
  aspectRatio = '1:1',
  label = 'Upload Image',
  showCrop = false,
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`Image size must be less than ${maxSize}MB`);
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setPreview(imageUrl);
      onImageSelect(file, imageUrl);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onImageRemove();
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
            <Button
              onClick={handleRemove}
              variant="destructive"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          
          <div className="text-center">
            {uploading ? (
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary-600 animate-spin" />
            ) : (
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            )}
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold text-primary-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WEBP up to {maxSize}MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
