
'use client';

import { Menu, Bell, Search, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-800 rounded-lg px-3 py-2 min-w-[300px]">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search students, reports..."
              className="bg-transparent border-none outline-none text-sm text-gray-300 placeholder-gray-500 flex-1"
            />
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm"
            className="relative text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </Button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-3 bg-gray-800 rounded-lg px-3 py-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
