'use client';

import {
  FolderTree,
  Wrench,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Cpu,
  Flame,
  ArrowRight,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

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
    id: 'sop',
    name: 'Quy trình Vận hành Chuẩn (SOP)',
    description:
      'Quy chuẩn các bước thao tác trên dây chuyền sản xuất, vận hành máy móc thiết bị.',
    icon: Wrench,
    docCount: 342,
    monthlyQueries: 1420,
    digitizedPercent: 88,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'troubleshooting',
    name: 'Xử lý Sự cố & Khắc phục nhanh',
    description:
      'Tri thức chẩn đoán lỗi, mã báo lỗi máy móc và các kịch bản khắc phục sự cố tức thời.',
    icon: AlertTriangle,
    docCount: 289,
    monthlyQueries: 2150,
    digitizedPercent: 74,
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'tacit',
    name: 'Kinh nghiệm Ngầm Chuyên gia',
    description:
      'Bí quyết thao tác, trực giác thợ bậc cao, cảm quan chất lượng không có trong sách vở.',
    icon: Lightbulb,
    docCount: 184,
    monthlyQueries: 1890,
    digitizedPercent: 62,
    color: 'from-yellow-500 to-amber-600',
  },
  {
    id: 'qa-qc',
    name: 'Kiểm soát Chất lượng (QA/QC)',
    description:
      'Tiêu chuẩn dung sai, phương pháp đo kiểm ngoại quan và hướng dẫn phân loại lỗi thành phẩm.',
    icon: ShieldCheck,
    docCount: 195,
    monthlyQueries: 980,
    digitizedPercent: 82,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'safety',
    name: 'An toàn Lao động & Môi trường',
    description:
      'Quy chuẩn bảo hộ, ứng phó rò rỉ hóa chất, an toàn điện và phòng cháy chữa cháy trong xưởng.',
    icon: Flame,
    docCount: 112,
    monthlyQueries: 430,
    digitizedPercent: 95,
    color: 'from-red-500 to-rose-600',
  },
  {
    id: 'rd-tech',
    name: 'Nghiên cứu & Cải tiến Công nghệ (R&D)',
    description:
      'Dự án cải tiến Kaizen, thử nghiệm vật liệu mới và nâng cấp tự động hóa PLC/SCADA.',
    icon: Cpu,
    docCount: 125,
    monthlyQueries: 620,
    digitizedPercent: 54,
    color: 'from-purple-500 to-violet-600',
  },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Cây phân loại tri thức
          </h1>
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
            Hệ thống phân cấp tri thức theo tiêu chuẩn quản trị vận hành nhà máy và chuỗi cung ứng.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-xs hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <Plus size={14} />
          Thêm danh mục mới
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className="group flex flex-col justify-between rounded-xl border border-zinc-200/80 bg-white p-5 shadow-xs transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div>
                {/* Icon with gradient */}
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr ${cat.color} text-white shadow-xs`}
                >
                  <Icon size={22} />
                </div>

                <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {cat.name}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {cat.description}
                </p>
              </div>

              <div className="mt-5 border-t border-zinc-100 pt-4 dark:border-zinc-800/80">
                {/* Progress bar of digitization */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-zinc-500 dark:text-zinc-400">Tiến độ số hóa</span>
                    <span className="text-zinc-900 dark:text-zinc-100">{cat.digitizedPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-blue-600 dark:bg-blue-500"
                      style={{ width: `${cat.digitizedPercent}%` }}
                    />
                  </div>
                </div>

                {/* Stats & Link */}
                <div className="mt-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                    <span>
                      <strong className="text-zinc-900 dark:text-zinc-100">{cat.docCount}</strong> tài liệu
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-zinc-900 dark:text-zinc-100">{cat.monthlyQueries}</strong> tra cứu
                    </span>
                  </div>

                  <Link
                    href={`/knowledge?category=${encodeURIComponent(cat.name)}`}
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400"
                  >
                    <span>Xem</span>
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
