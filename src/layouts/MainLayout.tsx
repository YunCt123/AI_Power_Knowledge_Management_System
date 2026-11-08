'use client';

import { Sidebar } from '@/src/components/layout/Sidebar';
import { Header } from '@/src/components/layout/Header';
import { cn } from '@/src/utils/cn';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * MainLayout - Khung layout chính cho toàn bộ ứng dụng B2B SaaS
 * Bao gồm:
 * - Sidebar: Thanh điều hướng đa cấp, hỗ trợ thu gọn/mở rộng, responsive drawer trên mobile
 * - Header: Thanh tiêu đề với Breadcrumb, ô tìm kiếm nhanh, Dark/Light mode toggle, Thông báo và User Profile
 * - Content area: Khu vực hiển thị nội dung chính với thanh cuộn mượt và khoảng đệm chuẩn UI/UX
 */
export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Content Area */}
        <main
          className={cn(
            'flex-1 overflow-y-auto bg-zinc-50/50 p-4 sm:p-6 lg:p-8 dark:bg-zinc-950/40',
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
