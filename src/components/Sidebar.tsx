'use client';

import { useState } from 'react';
import {
  Home,
  Users,
  FileText,
  Settings,
  LogOut,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  Plus,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
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
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, onToggle, isMobile }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([
    'Manage Schools',
    'Manage Students'
  ]);

  const toggleExpanded = (itemName: string) => {
    if (isOpen) {
      setExpandedItems(prev =>
        prev.includes(itemName)
          ? prev.filter(item => item !== itemName)
          : [...prev, itemName]
      );
    }
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
    return pathname === href || pathname?.startsWith(href + '/');
  };

  const handleLinkClick = () => {
    if (isMobile) {
      onToggle();
    }
  };

  return (
    <>
      {/* Backdrop - Faster animation */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Optimized animation */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-gray-900 shadow-2xl",
          // Single fast transition - NO STACKING!
          "transition-all duration-200 ease-out",
          // Mobile: slide in/out
          isMobile && (isOpen ? "translate-x-0" : "-translate-x-full"),
          // Desktop: width change
          isOpen ? "w-64" : "w-20"
        )}
      >
        {/* Header - Simple, no animation */}
        <div className="flex items-center justify-center h-20 border-b border-gray-700 px-4">
          <Link href="/dashboard" onClick={handleLinkClick}>
            {isOpen ? (
              <h1 className="text-xl font-bold text-white cursor-pointer">
                Wezant
              </h1>
            ) : (
              <span className="text-2xl font-bold text-white">W</span>
            )}
          </Link>
        </div>

        {/* Navigation - No staggered delays */}
        <nav className="py-4 px-2 h-[calc(100vh-160px)] overflow-y-auto overflow-x-hidden">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = isItemActive(item);
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const expanded = isExpanded(item.name);

              return (
                <li key={item.name}>
                  {hasSubItems ? (
                    <>
                      {/* Parent Item */}
                      <button
                        onClick={() => toggleExpanded(item.name)}
                        className={cn(
                          "w-full flex items-center rounded-lg",
                          "transition-colors duration-150", // Fast transition
                          isOpen ? "justify-between px-3 py-3" : "justify-center px-2 py-3",
                          isActive
                            ? "bg-gray-800 text-white"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        )}
                        title={!isOpen ? item.name : undefined}
                      >
                        <div className="flex items-center min-w-0">
                          <item.icon
                            className={cn(
                              "flex-shrink-0",
                              isOpen ? "w-5 h-5" : "w-6 h-6",
                              isActive ? "text-white" : "text-gray-400"
                            )}
                            aria-hidden="true"
                          />
                          {isOpen && (
                            <span className="ml-3 text-sm font-medium truncate">
                              {item.name}
                            </span>
                          )}
                        </div>
                        
                        {isOpen && (
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 flex-shrink-0 transition-transform duration-150",
                              expanded && "rotate-180"
                            )}
                            aria-hidden="true"
                          />
                        )}
                      </button>

                      {/* Submenu - Faster transition */}
                      {isOpen && (
                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-150",
                            expanded ? "max-h-40 mt-1" : "max-h-0"
                          )}
                        >
                          <ul className="ml-6 space-y-1">
                            {item.subItems?.map((subItem) => {
                              const isSubActive = isSubItemActive(subItem.href);
                              return (
                                <li key={subItem.href}>
                                  <Link
                                    href={subItem.href}
                                    className={cn(
                                      "flex items-center px-3 py-2 text-sm font-medium rounded-lg",
                                      "transition-colors duration-150",
                                      isSubActive
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    )}
                                    onClick={handleLinkClick}
                                    aria-current={isSubActive ? "page" : undefined}
                                  >
                                    <subItem.icon
                                      className="w-4 h-4 mr-3 flex-shrink-0"
                                      aria-hidden="true"
                                    />
                                    <span className="truncate">{subItem.name}</span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href!}
                      className={cn(
                        "flex items-center rounded-lg transition-colors duration-150",
                        isOpen ? "justify-start px-3 py-3" : "justify-center px-2 py-3",
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      )}
                      onClick={handleLinkClick}
                      title={!isOpen ? item.name : undefined}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <item.icon
                        className={cn(
                          "flex-shrink-0",
                          isOpen ? "w-5 h-5" : "w-6 h-6",
                          isActive ? "text-white" : "text-gray-400"
                        )}
                        aria-hidden="true"
                      />
                      {isOpen && (
                        <span className="ml-3 text-sm font-medium truncate">
                          {item.name}
                        </span>
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-700 bg-gray-900">
          <Button
            variant="ghost"
            className={cn(
              "w-full text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-150",
              isOpen ? "justify-start px-3 py-3" : "justify-center px-2 py-3"
            )}
            onClick={() => console.log('Logout clicked')}
            title={!isOpen ? "Logout" : undefined}
          >
            <LogOut 
              className={cn(
                "flex-shrink-0",
                isOpen ? "w-5 h-5" : "w-6 h-6"
              )} 
              aria-hidden="true" 
            />
            {isOpen && (
              <span className="ml-3 text-sm font-medium">Logout</span>
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}
