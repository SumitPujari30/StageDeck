import React, { useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/utils/format';
import { cn } from '@/utils/cn';

/**
 * Top navigation bar component
 */

interface TopbarProps {
  onMenuClick: () => void;
  isSidebarCollapsed: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick, isSidebarCollapsed }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <header className={cn(
      'fixed top-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-30 transition-all duration-300',
      isSidebarCollapsed ? 'left-20' : 'left-0 lg:left-64'
    )}>
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Search bar */}
          <div className="hidden sm:block max-w-md flex-1">
            <Input
              type="search"
              placeholder="Search events, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              className="h-9"
            />
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          
          {/* User menu */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            
            <Avatar className="w-9 h-9">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
              <AvatarFallback>{getInitials(user?.name || 'User')}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};
