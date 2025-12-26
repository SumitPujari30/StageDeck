
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  User,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

import { getInitials } from '@/utils/format';

/**
 * Sidebar navigation component
 */

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed: boolean;
  onCollapse: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const userNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
  { label: 'Events', href: '/user/events', icon: Calendar },
  { label: 'My Bookings', href: '/user/bookings', icon: Ticket },
  { label: 'Profile', href: '/user/profile', icon: User },
];

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Manage Events', href: '/admin/events', icon: Calendar },
  { label: 'Manage Users', href: '/admin/users', icon: Users },
  { label: 'Bookings', href: '/admin/bookings', icon: Ticket },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  isCollapsed,
  onCollapse,
}) => {
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();
  
  const navItems = isAdmin ? adminNavItems : userNavItems;
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-soft z-50 transition-all duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                  S
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                  StageDeck
                </span>
              </div>
            )}
            
            <button
              onClick={isCollapsed ? onCollapse : onToggle}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isOpen && !isCollapsed ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            
            <button
              onClick={onCollapse}
              className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className={cn(
                'w-5 h-5 transition-transform',
                isCollapsed && 'rotate-180'
              )} />
            </button>
          </div>
          
          {/* User info */}
          <div className={cn(
            'p-4 border-b border-gray-200',
            isCollapsed && 'px-2'
          )}>
            <div className={cn(
              'flex items-center gap-3',
              isCollapsed && 'justify-center'
            )}>
              <Avatar className={cn(
                isCollapsed ? 'w-10 h-10' : 'w-12 h-12'
              )}>
                <AvatarImage src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
                <AvatarFallback>{getInitials(user?.name || 'User')}</AvatarFallback>
              </Avatar>
              
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  <span className={cn(
                    'inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full',
                    isAdmin 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  )}>
                    {isAdmin ? 'Admin' : 'User'}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                    isCollapsed && 'justify-center px-2'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200',
                isCollapsed && 'justify-center px-2'
              )}
              title={isCollapsed ? 'Logout' : undefined}
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
