'use client';

import {
  BarChart3,
  TrendingDown,
  Clock,
  HelpCircle,
  FileDown,
  Zap,
  ArrowUpRight,
  PieChart,
} from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Báo cáo Vận hành & Phân tích ROI Tri thức
          </h1>
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
            Đo lường tác động của hệ thống AI Quản trị Tri thức đến thời gian downtime và năng suất lao động.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          <FileDown size={14} />
          Xuất báo cáo PDF / Excel
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Metric 1 */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span>Thời gian khắc phục sự cố (MTTR)</span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
              <TrendingDown size={12} /> -42.8%
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">14.5 phút</span>
            <span className="text-xs text-zinc-400 line-through">25.3 phút</span>
          </div>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Giảm 10.8 phút downtime trung bình trên mỗi ca sản xuất nhờ tra cứu giải pháp tức thời qua AI.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span>Thời lượng làm việc tiết kiệm</span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
              <ArrowUpRight size={12} /> +18.5%
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">340 giờ</span>
            <span className="text-xs text-zinc-500">/ tháng này</span>
          </div>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Tương đương ~42 ngày công nhân sự không phải chờ đợi chuyên gia giải đáp thủ công.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span>Tỷ lệ truy vấn RAG chính xác</span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
              Mục tiêu: &gt;90%
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">93.4%</span>
          </div>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Dựa trên 1,842 lượt phản hồi hài lòng (Helpful Vote) từ công nhân và kỹ thuật viên.
          </p>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Department Usage */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Tỷ trọng tra cứu tri thức theo phòng ban
            </h3>
            <span className="text-xs text-zinc-400">Tháng hiện tại</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {[
              { dept: 'Phân xưởng Gia công CNC', count: 684, percent: 38 },
              { dept: 'Tổ Bảo trì & Cơ điện', count: 422, percent: 24 },
              { dept: 'Phòng Quản lý Chất lượng (QA/QC)', count: 312, percent: 18 },
              { dept: 'Dây chuyền Lắp ráp & Hoàn thiện', count: 215, percent: 12 },
              { dept: 'Khối Điều độ & Kho vận', count: 142, percent: 8 },
            ].map((d) => (
              <div key={d.dept} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-700 dark:text-zinc-300">{d.dept}</span>
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
        <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <HelpCircle size={16} className="text-amber-500" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Khoảng trống tri thức cần bổ sung (Knowledge Gaps)
              </h3>
            </div>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Cần chuyên gia
            </span>
          </div>

          <div className="mt-4 divide-y divide-zinc-100 text-xs dark:divide-zinc-800">
            {[
              {
                q: 'Khắc phục lỗi E-Stop chập chờn khi nhiệt độ tủ điện trên 45°C',
                queries: 28,
                dept: 'Điện tự động hóa',
              },
              {
                q: 'Tiêu chuẩn nghiệm thu độ nhám bề mặt phôi titan cấp y tế',
                queries: 19,
                dept: 'QA/QC',
              },
              {
                q: 'Phương pháp bảo dưỡng định kỳ trục chính máy phay 5 trục Mikron',
                queries: 15,
                dept: 'Cơ khí',
              },
              {
                q: 'Quy trình xử lý nước thải xi mạ khi nồng độ kim loại nặng tăng đột biến',
                queries: 12,
                dept: 'Môi trường',
              },
            ].map((gap, i) => (
              <div key={i} className="flex items-start justify-between py-2.5">
                <div className="pr-4">
                  <p className="font-medium text-zinc-800 dark:text-zinc-200">{gap.q}</p>
                  <span className="text-[10px] text-zinc-400">Phòng phụ trách: {gap.dept}</span>
                </div>
                <span className="shrink-0 rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
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
