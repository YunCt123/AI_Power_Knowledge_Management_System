'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, User as UserIcon, Settings, LogOut, Shield } from 'lucide-react';
import { cn } from '@/src/utils/cn';

interface UserProfileProps {
  className?: string;
}

export function UserProfile({ className }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          'flex items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors duration-150',
          'hover:bg-zinc-100 dark:hover:bg-zinc-800/70',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600',
          isOpen && 'bg-zinc-100 dark:bg-zinc-800/70'
        )}
      >
        {/* Avatar with gradient and initials */}
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-xs font-semibold text-white shadow-xs">
          <span>NA</span>
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-900" />
        </div>

        {/* User Info (hidden on compact screens) */}
        <div className="hidden flex-col sm:flex">
          <span className="text-xs font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
            Nguyễn Văn A
          </span>
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            Admin Quản trị
          </span>
        </div>

        <ChevronDown
          size={14}
          className={cn(
            'text-zinc-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-56 rounded-xl border border-zinc-200/80 bg-white p-1.5 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-2xl">
          <div className="border-b border-zinc-100 px-3 py-2 dark:border-zinc-800/80">
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Nguyễn Văn A</p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">admin@aikms.vn</p>
          </div>

          <div className="py-1">
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <UserIcon size={14} className="text-zinc-500 dark:text-zinc-400" />
              Hồ sơ cá nhân
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Shield size={14} className="text-zinc-500 dark:text-zinc-400" />
              Phân quyền & Vai trò
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Settings size={14} className="text-zinc-500 dark:text-zinc-400" />
              Cài đặt hệ thống
            </button>
          </div>

          <div className="border-t border-zinc-100 pt-1 dark:border-zinc-800/80">
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <LogOut size={14} />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
