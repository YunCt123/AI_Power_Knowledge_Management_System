'use client';

import {
  TrendingDown,
  HelpCircle,
  FileDown,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { toast } from '@/src/store/toast-store';

export default function ReportsPage() {
  const handleExport = () => {
    toast.success(
      'Đang xuất báo cáo ROI RepoMind',
      'Tài liệu báo cáo phân tích tác động và tiết kiệm chi phí đang được tạo dưới dạng PDF/Excel.'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 mb-1.5">
            <ShieldCheck size={12} />
            <span>Zero-Downtime ROI Analytics</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Báo cáo Vận hành & Phân tích ROI Tri thức Kỹ thuật
          </h1>
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
            Đo lường tác động của RepoMind đến thời gian Onboarding, tỷ lệ loại bỏ bẫy lỗi lặp lại và chi phí tiết kiệm.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition active:scale-98"
        >
          <FileDown size={14} />
          <span>Xuất báo cáo PDF / Excel</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <span>Thời gian Onboarding Dev Mới</span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
              <TrendingDown size={12} /> -85.7%
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">2 ngày</span>
            <span className="text-xs text-zinc-400 line-through">14 ngày (2 tuần)</span>
          </div>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Kỹ sư mới tự tin merge code an toàn ngay từ ngày thứ 2 nhờ hệ thống Just-in-Time Warning đón lõng tại Jira & PR.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <span>Thời lượng & Chi phí Tiết kiệm</span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
              <ArrowUpRight size={12} /> +28.5k USD
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">340 giờ Dev</span>
            <span className="text-xs text-zinc-500">/ tháng này</span>
          </div>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Tránh tình trạng đập đi code lại (Rework) do hiểu sai yêu cầu và loại bỏ thời gian debug lại các lỗi cũ.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <span>Sự cố Lặp lại (Bẫy Lỗi Cũ)</span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
              Zero-Downtime
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">0 sự cố</span>
            <span className="text-xs text-zinc-400 line-through">8 sự cố / quý</span>
          </div>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            100% các rủi ro chạm vào file nhạy cảm (payment.ts, db-pool.ts) đều được Bot cảnh báo tự động trước khi merge code.
          </p>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Module Usage */}
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Tỷ trọng tra cứu tri thức & Cảnh báo theo Module
            </h3>
            <span className="text-xs text-zinc-400">Tháng hiện tại</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {[
              { dept: 'Payment & Checkout Core (payment.ts, Redis)', count: 840, percent: 36 },
              { dept: 'Database & Concurrency (PostgreSQL, Deadlock)', count: 620, percent: 27 },
              { dept: 'Authentication & Security (OAuth2, SSRF)', count: 380, percent: 16 },
              { dept: 'APIs, Webhooks & Queues (Stripe, Kafka)', count: 290, percent: 13 },
              { dept: 'Frontend & Architecture (Next.js 16, SSR)', count: 190, percent: 8 },
            ].map((d) => (
              <div key={d.dept} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{d.dept}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {d.count} lượt ({d.percent}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-blue-600 dark:bg-blue-500"
                    style={{ width: `${d.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Knowledge Gaps */}
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <HelpCircle size={16} className="text-amber-500" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Khoảng trống tri thức cần Tech Lead bổ sung (Knowledge Gaps)
              </h3>
            </div>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Cần Tech Lead
            </span>
          </div>

          <div className="mt-4 divide-y divide-zinc-100 text-xs dark:divide-zinc-800">
            {[
              {
                q: 'Xử lý timeout khi gọi gRPC microservice qua Envoy Proxy trong giờ cao điểm',
                queries: 28,
                dept: 'Core Backend',
              },
              {
                q: 'Cơ chế Rollback dữ liệu khi Saga Pattern bị ngắt quãng giữa chừng',
                queries: 22,
                dept: 'System Architecture',
              },
              {
                q: 'Cấu hình Next.js Incremental Static Regeneration (ISR) với Redis Cache',
                queries: 18,
                dept: 'Frontend Platform',
              },
              {
                q: 'Thiết lập Zero-downtime Blue/Green deployment cho hệ thống WebSocket streaming',
                queries: 15,
                dept: 'DevOps & SRE',
              },
            ].map((gap, i) => (
              <div key={i} className="flex items-start justify-between py-3">
                <div className="pr-4">
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200 leading-snug">{gap.q}</p>
                  <span className="text-[10px] text-zinc-400">Team phụ trách: {gap.dept}</span>
                </div>
                <span className="shrink-0 rounded-lg bg-zinc-100 px-2.5 py-1 text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {gap.queries} lần hỏi
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
