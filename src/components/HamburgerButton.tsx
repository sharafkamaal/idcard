'use client';

import { cn } from '@/lib/utils';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      type="button"
    >
      {/* Top Line */}
      <span
        className={cn(
          "block w-6 h-0.5 bg-gray-700 transition-all duration-300 ease-in-out",
          isOpen && "rotate-45 translate-y-2"
        )}
      />
      
      {/* Middle Line */}
      <span
        className={cn(
          "block w-6 h-0.5 bg-gray-700 transition-all duration-300 ease-in-out",
          isOpen && "opacity-0"
        )}
      />
      
      {/* Bottom Line */}
      <span
        className={cn(
          "block w-6 h-0.5 bg-gray-700 transition-all duration-300 ease-in-out",
          isOpen && "-rotate-45 -translate-y-2"
        )}
      />
    </button>
  );
}
