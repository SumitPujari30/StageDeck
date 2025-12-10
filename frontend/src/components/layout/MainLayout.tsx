import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ChatWidget } from '@/components/ui/ChatWidget';
import { cn } from '@/utils/cn';

/**
 * Main layout wrapper for authenticated pages
 */

export const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isCollapsed={isSidebarCollapsed}
        onCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <Topbar
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      
      <main className={cn(
        'pt-16 min-h-screen transition-all duration-300',
        isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      )}>
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>

      {/* Global Chat Widget */}
      <ChatWidget />
    </div>
  );
};
