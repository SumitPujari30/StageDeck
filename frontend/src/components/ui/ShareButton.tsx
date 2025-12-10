import React, { useState } from 'react';
import { Share2, Twitter, Facebook, Linkedin, Link as LinkIcon, Mail, MessageCircle } from 'lucide-react';
import { Button } from './Button';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from './Modal';
import { cn } from '@/utils/cn';

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  variant?: 'default' | 'icon';
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  url,
  title,
  description = '',
  variant = 'default',
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
      color: 'text-green-600 hover:bg-green-50',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: 'text-blue-400 hover:bg-blue-50',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'text-blue-700 hover:bg-blue-50',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'text-blue-600 hover:bg-blue-50',
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`,
      color: 'text-gray-600 hover:bg-gray-50',
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <Button
        variant={variant === 'icon' ? 'ghost' : 'outline'}
        size={variant === 'icon' ? 'icon' : 'default'}
        onClick={() => setOpen(true)}
        className={className}
      >
        <Share2 className="w-4 h-4" />
        {variant === 'default' && <span className="ml-2">Share</span>}
      </Button>

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent className="sm:max-w-md">
          <ModalHeader>
            <ModalTitle>Share Event</ModalTitle>
            <ModalDescription>Share this event with your network</ModalDescription>
          </ModalHeader>

          <div className="grid grid-cols-3 gap-4 py-4">
            {shareLinks.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 transition-colors',
                  platform.color
                )}
              >
                <platform.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{platform.name}</span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input
              type="text"
              value={url}
              readOnly
              className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg"
            />
            <Button onClick={copyToClipboard} variant="outline" size="sm">
              <LinkIcon className="w-4 h-4 mr-2" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};
