'use client';

import { useState } from 'react';
import { 
  X, 
  Home, 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  LogOut,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  Plus,
  List,
  Eye,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubMenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  subItems?: SubMenuItem[];
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  {
    name: 'Manage Schools',
    icon: GraduationCap,
    subItems: [
      { name: 'Add School', href: '/manage-school/add-school', icon: Plus },
      { name: 'List Schools', href: '/manage-school/list-school', icon: List },
    ],
  },
  {
    name: 'Manage Students',
    icon: Users,
    subItems: [
      { name: 'Add Student', href: '/manage-students/add-students', icon: Plus },
      { name: 'List Students', href: '/manage-students/list-students', icon: List },
    ],
  },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Manage Schools', 'Manage Students']);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const isExpanded = (itemName: string) => expandedItems.includes(itemName);

  const isItemActive = (item: NavigationItem) => {
    if (item.href) {
      return pathname === item.href;
    }
    if (item.subItems) {
      return item.subItems.some(subItem => 
        pathname === subItem.href || 
        pathname?.startsWith(subItem.href + '/')
      );
    }
    return false;
  };

  const isSubItemActive = (href: string) => {
    // Handle dynamic routes
    if (href === '/manage-school/view') {
      return pathname?.startsWith('/manage-school/view');
    }
    if (href === '/manage-school/edit') {
      return pathname?.startsWith('/manage-school/edit');
    }
    if (href === '/manage-students/list') {
      return pathname?.startsWith('/manage-students/list');
    }
    return pathname === href;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">Wezant</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Navigation */}
        <nav className="mt-6 px-3 h-[calc(100vh-180px)] overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = isItemActive(item);
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const expanded = isExpanded(item.name);

              return (
                <li key={item.name}>
                  {/* Main Navigation Item */}
                  {hasSubItems ? (
                    <>
                      <button
                        onClick={() => toggleExpanded(item.name)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-colors group",
                          isActive
                            ? "bg-gray-800 text-white"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        )}
                      >
                        <div className="flex items-center">
                          <item.icon className={cn(
                            "w-5 h-5 mr-3 transition-colors",
                            isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                          )} />
                          {item.name}
                        </div>
                        {expanded ? (
                          <ChevronDown className="w-4 h-4 transition-transform" />
                        ) : (
                          <ChevronRight className="w-4 h-4 transition-transform" />
                        )}
                      </button>

                      {/* Submenu Items */}
                      {expanded && (
                        <ul className="mt-1 ml-4 space-y-1">
                          {item.subItems?.map((subItem) => {
                            const isSubActive = isSubItemActive(subItem.href);
                            return (
                              <li key={subItem.href}>
                                <Link
                                  href={subItem.href}
                                  className={cn(
                                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                                    isSubActive
                                      ? "bg-blue-600 text-white shadow-lg"
                                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                  )}
                                  onClick={onClose}
                                >
                                  <subItem.icon className={cn(
                                    "w-4 h-4 mr-3 transition-colors",
                                    isSubActive ? "text-white" : "text-gray-500 group-hover:text-white"
                                  )} />
                                  {subItem.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href!}
                      className={cn(
                        "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors group",
                        isActive
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      )}
                      onClick={onClose}
                    >
                      <item.icon className={cn(
                        "w-5 h-5 mr-3 transition-colors",
                        isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                      )} />
                      {item.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Logout Button at Bottom */}
        <div className="absolute bottom-6 left-3 right-3 border-t border-gray-700 pt-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
            onClick={() => {
              // Add logout logic here
              console.log('Logout clicked');
            }}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}
