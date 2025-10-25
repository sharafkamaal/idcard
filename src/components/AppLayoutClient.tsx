'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Menu, Bell, User, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function AppLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div 
        className={cn(
          "flex-1 flex flex-col overflow-hidden",
          "transition-all duration-300 ease-in-out",
          !isMobile && (sidebarOpen ? "ml-64" : "ml-20")
        )}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-200 z-10 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <div className="flex items-center flex-1 min-w-0 gap-3">
              

              {/* Search */}
              <div className="relative w-full max-w-md">
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2 text-sm border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-md transition-all"
                  aria-label="Search"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
              <button 
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>

              <button className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-3 ml-2 border-l border-gray-200 hover:bg-gray-50 rounded-lg transition-colors py-1 pr-2">
                <div className="w-8 h-8 lg:w-9 lg:h-9 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <span className="hidden lg:block text-sm font-semibold text-gray-900">Admin User</span>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
