'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Menu, Bell, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AppLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden m-0 p-0">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden m-0 p-0">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 z-10 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            {/* Left Section - Menu Button & Search */}
            <div className="flex items-center flex-1 min-w-0">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 flex-shrink-0"
              >
                <Menu className="w-6 h-6" />
              </Button>

              {/* Search Bar */}
              <div className="relative w-full max-w-md hidden md:block">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <Input
                  type="text"
                  placeholder="Search students, reports..."
                  className="pl-10 pr-4 py-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Right Section - Notifications & User Profile */}
            <div className="flex items-center space-x-3 lg:space-x-4 flex-shrink-0">
              {/* Notification Bell */}
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
                {/* Notification Badge */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* User Profile Section */}
              <div className="flex items-center space-x-2 lg:space-x-3 pl-3 lg:pl-4 border-l border-gray-200">
                {/* Avatar */}
                <div className="w-9 h-9 lg:w-10 lg:h-10 bg-blue-600 rounded-full flex items-center justify-center ring-2 ring-blue-100 flex-shrink-0">
                  <User className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>

                {/* User Info - Hidden on mobile */}
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500 leading-tight">
                    Administrator
                  </p>
                </div>

                {/* Dropdown Arrow */}
                <ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Area - NO PADDING */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 m-0 p-0">
          {children}
        </main>
      </div>
    </div>
  );
}
