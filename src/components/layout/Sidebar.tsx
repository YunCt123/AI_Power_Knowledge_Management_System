'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  GitPullRequest,
  FolderTree,
  BarChart3,
  Users,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  Brain,
  Zap,
} from 'lucide-react';
import { useSidebarStore } from '@/src/store/sidebar-store';
import { cn } from '@/src/utils/cn';

interface NavSection {
  title?: string;
  items: {
    icon: React.ElementType;
    label: string;
    href: string;
    badge?: string;
  }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Tổng quan',
    items: [
      {
        icon: LayoutDashboard,
        label: 'Bảng điều khiển',
        href: '/',
      },
      {
        icon: Zap,
        label: 'Dev Workspace (Demo)',
        href: '/workspace',
        badge: 'Hot',
      },
      {
        icon: Bell,
        label: 'Thông báo',
        href: '/notifications',
        badge: '3',
      },
    ],
  },
  {
    title: 'Quản trị Tri thức',
    items: [
      {
        icon: BookOpen,
        label: 'Kho tri thức ngầm',
        href: '/knowledge',
      },
      {
        icon: GitPullRequest,
        label: 'Đóng góp & Duyệt',
        href: '/contributions',
        badge: '5 mới',
      },
      {
        icon: FolderTree,
        label: 'Phân loại tri thức',
        href: '/categories',
      },
    ],
  },
  {
    title: 'Phân tích & Tối ưu',
    items: [
      {
        icon: BarChart3,
        label: 'Báo cáo vận hành',
        href: '/reports',
      },
      {
        icon: Users,
        label: 'Hiệu suất nhân sự',
        href: '/team',
      },
      {
        icon: Settings,
        label: 'Cài đặt hệ thống',
        href: '/settings',
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, isCollapsed, close, toggleCollapse } = useSidebarStore();

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-xs md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r duration-200 ease-in-out md:static',
          'border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-950',
          // Desktop collapsed vs expanded width
          isCollapsed ? 'md:w-16' : 'md:w-64',
          // Mobile open vs closed transform
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          'w-64'
        )}
      >
        {/* Brand / Logo Area */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200/80 px-4 dark:border-zinc-800/80">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xs">
              <Brain size={18} strokeWidth={2.2} />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  RepoMind
                </span>
                <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                  Zero-Downtime AI
                </span>
              </div>
            )}
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={close}
            aria-label="Đóng thanh điều hướng"
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 md:hidden dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Navigation items list */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {NAV_SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && !isCollapsed && (
                <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {section.title}
                </div>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-150',
                      isActive
                        ? 'bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-100',
                      isCollapsed && 'justify-center px-2'
                    )}
                  >
                    {/* Active left indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-blue-600 dark:bg-blue-500" />
                    )}

                    <Icon
                      size={18}
                      className={cn(
                        'shrink-0 transition-colors',
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300'
                      )}
                    />

                    {!isCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span
                        className={cn(
                          'rounded-md px-1.5 py-0.5 text-[10px] font-semibold tracking-tight',
                          isActive
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* AI Engine Status Card (when expanded) */}
        {!isCollapsed && (
          <div className="p-3">
            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-3 dark:border-zinc-800/80 dark:bg-zinc-900/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                    Gemini AI & pgvector
                  </span>
                </div>
                <span className="rounded bg-emerald-100 px-1 text-[9px] font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Ready
                </span>
              </div>
              <p className="mt-1 text-[10px] leading-tight text-zinc-500 dark:text-zinc-400">
                Vector DB kết nối trực tiếp Supabase pgvector.
              </p>
            </div>
          </div>
        )}

        {/* Bottom Collapse Toggle button (Desktop only) */}
        <div className="hidden border-t border-zinc-200/80 p-2 md:block dark:border-zinc-800/80">
          <button
            type="button"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg p-2 text-xs font-medium text-zinc-500 transition-colors',
              'hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
              isCollapsed && 'justify-center'
            )}
          >
            {isCollapsed ? (
              <ChevronRight size={16} aria-hidden="true" />
            ) : (
              <>
                <ChevronLeft size={16} aria-hidden="true" />
                <span>Thu gọn menu</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
