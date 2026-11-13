'use client';

import { useState } from 'react';
import {
  CreditCard,
  Database,
  ShieldCheck,
  Server,
  Network,
  Layout,
  ArrowRight,
  Plus,
  FolderTree,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/src/store/toast-store';

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  docCount: number;
  monthlyQueries: number;
  digitizedPercent: number;
  color: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'payment',
    name: 'Payment & Checkout Engine',
    description:
      'Cổng thanh toán Stripe/VNPay, xử lý giỏ hàng, cơ chế phân trang tránh OOM memory leak và Idempotency Webhook.',
    icon: CreditCard,
    docCount: 312,
    monthlyQueries: 2840,
    digitizedPercent: 96,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'database',
    name: 'Database, Caching & Concurrency',
    description:
      'Khắc phục Race Condition Flash Sale, chống Deadlock PostgreSQL 40P01, tối ưu N+1 Query và kết nối Connection Pool.',
    icon: Database,
    docCount: 285,
    monthlyQueries: 3410,
    digitizedPercent: 92,
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'auth',
    name: 'Authentication & Security (Zero-Trust)',
    description:
      'JWT lifecycle, Google OAuth2 SSO, RBAC phân quyền theo vai trò, phòng chống SSRF và bảo mật API OWASP.',
    icon: ShieldCheck,
    docCount: 198,
    monthlyQueries: 1950,
    digitizedPercent: 94,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'devops',
    name: 'DevOps, CI/CD & Reliability',
    description:
      'Zero-downtime deployment, GitHub Actions, Supabase pgvector 768d, Docker microVMs và quy trình Onboarding 2 ngày.',
    icon: Server,
    docCount: 176,
    monthlyQueries: 1620,
    digitizedPercent: 88,
    color: 'from-purple-500 to-violet-600',
  },
  {
    id: 'microservices',
    name: 'APIs, Webhooks & Microservices',
    description:
      'Xử lý Kafka consumer lag, RESTful rate-limiting, Background Queues và xử lý trùng lặp Webhook delivery.',
    icon: Network,
    docCount: 142,
    monthlyQueries: 1280,
    digitizedPercent: 85,
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'frontend',
    name: 'Frontend & Next.js Architecture',
    description:
      'Next.js 16 App Router, React 19 compiler, khắc phục Hydration Mismatch, tối ưu TTFB và thiết kế UI/UX B2B SaaS.',
    icon: Layout,
    docCount: 134,
    monthlyQueries: 1490,
    digitizedPercent: 90,
    color: 'from-rose-500 to-pink-600',
  },
];

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = CATEGORIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 mb-1.5">
            <FolderTree size={12} />
            <span>IT Architecture & Knowledge Modules</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Phân loại tri thức hệ thống (Knowledge Categories)
          </h1>
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
            Cấu trúc danh mục tri thức kỹ thuật phần mềm, tỷ lệ số hóa SOPs và lưu lượng truy vấn thực tế.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            toast.info('Tạo phân loại mới', 'Tính năng dành cho Tech Lead / System Architect.');
          }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition active:scale-98"
        >
          <Plus size={14} />
          <span>Thêm phân loại mới</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm phân loại (Payment, Database, DevOps, Auth, Frontend...)"
          className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-4 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      {/* Grid Categories */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800"
            >
              <div>
                {/* Header Icon + Digitized badge */}
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr ${item.color} text-white shadow-xs`}
                  >
                    <IconComponent size={20} />
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {item.digitizedPercent}% đã số hóa
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400 transition-colors">
                  {item.name}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
              </div>

              {/* Stats Footer */}
              <div className="mt-5 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-zinc-400">Tài liệu SOP</span>
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                      {item.docCount}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-zinc-400">Truy vấn / tháng</span>
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                      {item.monthlyQueries.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <Link
                    href={`/knowledge?category=${encodeURIComponent(item.name)}`}
                    className="inline-flex w-full items-center justify-between rounded-lg bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-blue-50 hover:text-blue-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-blue-950/50 dark:hover:text-blue-300"
                  >
                    <span>Xem các SOP thuộc nhóm này</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
