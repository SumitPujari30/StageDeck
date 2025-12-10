import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Calendar, Ticket, TrendingUp, Info } from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import { formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

export interface Notification {
  id: string;
  type: 'booking' | 'reminder' | 'update' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

const notificationIcons = {
  booking: Ticket,
  reminder: Calendar,
  update: TrendingUp,
  info: Info,
};

const notificationColors = {
  booking: 'text-green-600 bg-green-100',
  reminder: 'text-blue-600 bg-blue-100',
  update: 'text-purple-600 bg-purple-100',
  info: 'text-gray-600 bg-gray-100',
};

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 z-50 w-96 max-h-[600px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-500">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMarkAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Bell className="w-12 h-12 mb-3 opacity-20" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => {
                      const Icon = notificationIcons[notification.type];
                      return (
                        <div
                          key={notification.id}
                          className={cn(
                            'group relative p-4 transition-colors hover:bg-gray-50',
                            !notification.read && 'bg-blue-50/50'
                          )}
                        >
                          <div className="flex gap-3">
                            <div className={cn('p-2 rounded-lg h-fit', notificationColors[notification.type])}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-medium text-sm text-gray-900">
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatDate(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            {!notification.read && (
                              <button
                                onClick={() => onMarkAsRead(notification.id)}
                                className="p-1 rounded hover:bg-gray-200"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4 text-gray-600" />
                              </button>
                            )}
                            <button
                              onClick={() => onDelete(notification.id)}
                              className="p-1 rounded hover:bg-gray-200"
                              title="Delete"
                            >
                              <X className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
