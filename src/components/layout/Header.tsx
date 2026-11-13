'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, Search, Bell, Sparkles } from 'lucide-react';
import { useSidebarStore } from '@/src/store/sidebar-store';
import { Breadcrumb } from './Breadcrumb';
import { UserProfile } from './UserProfile';
import { ThemeToggle } from '@/src/components/common/ThemeToggle';
import { toast } from '@/src/store/toast-store';
import { cn } from '@/src/utils/cn';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { toggle } = useSidebarStore();
  const router = useRouter();
  const [quickQuery, setQuickQuery] = useState('');

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && quickQuery.trim()) {
      toast.info('Đang tìm kiếm tri thức', `Truy vấn: "${quickQuery}"`);
      router.push(`/knowledge`);
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-14 w-full shrink-0 items-center justify-between gap-4 border-b px-4 sm:px-6',
        'border-zinc-200/80 bg-white/80 dark:border-zinc-800/80 dark:bg-zinc-950/80 backdrop-blur-md',
        className
      )}
    >
      {/* Left side: Mobile menu toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label="Đóng/mở thanh điều hướng"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          <Menu size={18} aria-hidden="true" />
        </button>

        <Breadcrumb />
      </div>

      {/* Right side: Search, AI Quick Actions, Notifications, Theme, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search Bar */}
        <div className="relative hidden md:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-zinc-400">
            <Search size={14} aria-hidden="true" />
          </div>
          <input
            type="text"
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            placeholder="Tìm kiếm tri thức, SOPs, hot files..."
            className={cn(
              'h-8 w-56 lg:w-72 rounded-lg border pl-8 pr-12 text-xs transition-all duration-150',
              'border-zinc-200 bg-zinc-50/70 text-zinc-900 placeholder:text-zinc-400',
              'focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500',
              'dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100 dark:placeholder:text-zinc-500',
              'dark:focus:border-blue-500 dark:focus:bg-zinc-900'
            )}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <kbd className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-500">
              ↵ Enter
            </kbd>
          </div>
        </div>

        {/* AI Quick Query Button */}
        <button
          type="button"
          onClick={() => {
            toast.info(
              'Trợ lý RAG RepoMind',
              'Bạn có thể tra cứu nhanh các lỗi sập server và giải pháp SOP tại trang Kho Tri Thức!'
            );
            router.push('/knowledge');
          }}
          className={cn(
            'hidden sm:inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
            'border-indigo-200 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100/70',
            'dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-950/70'
          )}
          title="Hỏi trợ lý AI RAG"
        >
          <Sparkles size={13} className="text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          <span>Hỏi AI</span>
        </button>

        {/* Notifications */}
        <Link
          href="/notifications"
          aria-label="Thông báo hệ thống (3 chưa đọc)"
          className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          title="Xem thông báo cảnh báo Just-in-Time"
        >
          <Bell size={16} aria-hidden="true" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
          </span>
        </Link>

        {/* Dark/Light mode toggle */}
        <ThemeToggle />

        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" aria-hidden="true" />

        {/* User Profile dropdown */}
        <UserProfile />
      </div>
    </header>
  );
}
