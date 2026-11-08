'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/src/utils/cn';

interface BreadcrumbProps {
  className?: string;
}

const ROUTE_LABELS: Record<string, string> = {
  '': 'Tổng quan',
  dashboard: 'Bảng điều khiển',
  knowledge: 'Kho tri thức',
  contributions: 'Đóng góp tri thức',
  categories: 'Phân loại tri thức',
  reports: 'Báo cáo vận hành',
  team: 'Hiệu suất nhân sự',
  settings: 'Cài đặt hệ thống',
  notifications: 'Thông báo',
};

export function Breadcrumb({ className }: BreadcrumbProps) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs', className)}>
      <ol className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            title="Trang chủ"
          >
            <Home size={14} aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Trang chủ</span>
          </Link>
        </li>

        {segments.length === 0 ? (
          <li className="flex items-center gap-1.5">
            <ChevronRight size={13} className="text-zinc-400 dark:text-zinc-600" aria-hidden="true" />
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              Bảng điều khiển
            </span>
          </li>
        ) : (
          segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const href = `/${segments.slice(0, index + 1).join('/')}`;
            const label = ROUTE_LABELS[segment] || decodeURIComponent(segment);

            return (
              <li key={href} className="flex items-center gap-1.5">
                <ChevronRight size={13} className="text-zinc-400 dark:text-zinc-600" aria-hidden="true" />
                {isLast ? (
                  <span
                    className="font-medium text-zinc-900 dark:text-zinc-100"
                    aria-current="page"
                  >
                    {label}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    {label}
                  </Link>
                )}
              </li>
            );
          })
        )}
      </ol>
    </nav>
  );
}
