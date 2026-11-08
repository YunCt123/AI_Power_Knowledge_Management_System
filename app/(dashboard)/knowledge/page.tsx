'use client';

import { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Sparkles,
  ExternalLink,
  Tag,
  CheckCircle2,
  Clock,
  ThumbsUp,
  FileText,
} from 'lucide-react';
import { cn } from '@/src/utils/cn';

interface KnowledgeItem {
  id: string;
  title: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  updatedAt: string;
  summary: string;
  tags: string[];
  confidence: number;
  helpfulCount: number;
  status: 'verified' | 'ai_extracted' | 'pending';
}

const MOCK_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: 'kb-01',
    title: 'Quy trình xử lý sự cố kẹt phôi tự động trên chuyền dập CNC',
    category: 'Kỹ thuật',
    author: {
      name: 'Trần Minh Đức',
      avatar: 'TĐ',
      role: 'Kỹ sư trưởng Vận hành',
    },
    updatedAt: '2 giờ trước',
    summary:
      'Hướng dẫn khắc phục nhanh khi sensor quang phát hiện kẹt phôi ở trạm số 3. Tránh dừng chuyền đột ngột gây lệch khuôn và quá nhiệt motor servo.',
    tags: ['CNC', 'Khắc phục sự cố', 'Sensor', 'SOP'],
    confidence: 98,
    helpfulCount: 42,
    status: 'verified',
  },
  {
    id: 'kb-02',
    title: 'Kinh nghiệm căn chỉnh độ nhớt dung dịch làm mát theo nhiệt độ mùa hè',
    category: 'Sản xuất',
    author: {
      name: 'Lê Thị Hương',
      avatar: 'LH',
      role: 'Trưởng ca Sản xuất',
    },
    updatedAt: 'Hôm qua',
    summary:
      'Khi nhiệt độ xưởng vượt quá 36°C, tỷ lệ pha dung dịch làm mát cần nâng từ 1:15 lên 1:12 để bảo vệ mũi dao phay carbide và chống oxy hóa bề mặt chi tiết.',
    tags: ['Nhiệt độ', 'Làm mát', 'Kinh nghiệm ngầm', 'Carbide'],
    confidence: 95,
    helpfulCount: 38,
    status: 'verified',
  },
  {
    id: 'kb-03',
    title: 'Phương pháp nhận biết sớm lỗi rỗ khí đúc qua âm thanh buồng nung',
    category: 'QA/QC',
    author: {
      name: 'Phạm Văn Hùng',
      avatar: 'PH',
      role: 'Chuyên gia Giám sát Chất lượng',
    },
    updatedAt: '3 ngày trước',
    summary:
      'Tri thức ngầm từ chuyên gia 15 năm kinh nghiệm: Khi áp suất khí nén đạt 6 bar nhưng nghe tiếng rít cao tần ở van xả phụ, cần ngưng rót để kiểm tra độ ẩm khuôn.',
    tags: ['Đúc kim loại', 'Tri thức ngầm', 'Âm thanh', 'Kiểm tra'],
    confidence: 92,
    helpfulCount: 29,
    status: 'ai_extracted',
  },
  {
    id: 'kb-04',
    title: 'Quy chuẩn bàn giao ca sản xuất không gián đoạn dữ liệu ERP',
    category: 'Vận hành',
    author: {
      name: 'Hoàng Đức Anh',
      avatar: 'HA',
      role: 'Điều độ Vận hành',
    },
    updatedAt: '5 ngày trước',
    summary:
      'Checklist 7 bước đối soát số lượng phôi tồn, phế phẩm và log máy trước khi ký biên bản giao ca điện tử trên ứng dụng Zalo Mini App.',
    tags: ['Giao ca', 'ERP', 'SOP', 'Vận hành'],
    confidence: 96,
    helpfulCount: 19,
    status: 'verified',
  },
  {
    id: 'kb-05',
    title: 'Tối ưu chu kỳ thay dầu thủy lực dựa trên cảm biến rung động',
    category: 'Bảo trì',
    author: {
      name: 'Nguyễn Thị Mai',
      avatar: 'NM',
      role: 'Kỹ sư R&D',
    },
    updatedAt: '1 tuần trước',
    summary:
      'Mô hình dự đoán thời điểm thay dầu tối ưu theo rung động RMS thay vì chạy cố định theo 2000 giờ, tiết kiệm 18% chi phí bảo dưỡng hàng năm.',
    tags: ['Thủy lực', 'Predictive Maintenance', 'IoT'],
    confidence: 91,
    helpfulCount: 31,
    status: 'verified',
  },
];

export default function KnowledgePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredItems = MOCK_KNOWLEDGE.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Kho tri thức ngầm (Tacit Knowledge Base)
          </h1>
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
            Kho lưu trữ tri thức chuyên gia, kinh nghiệm vận hành thực tế đã được AI vector hóa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
            Hỏi trợ lý AI
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-xs hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <Plus size={14} />
            Đóng góp tri thức mới
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-zinc-200/80 bg-white p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800/80 dark:bg-zinc-900">
        <div className="relative flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tiêu đề, triệu chứng sự cố, thẻ tag hoặc kinh nghiệm..."
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50/70 py-1.5 pl-9 pr-4 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-zinc-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="Kỹ thuật">Kỹ thuật</option>
            <option value="Sản xuất">Sản xuất</option>
            <option value="QA/QC">QA/QC</option>
            <option value="Vận hành">Vận hành</option>
            <option value="Bảo trì">Bảo trì</option>
          </select>
        </div>
      </div>

      {/* Knowledge Items Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col justify-between rounded-xl border border-zinc-200/80 bg-white p-5 transition-all duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    {item.category}
                  </span>
                  {item.status === 'verified' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={12} />
                      Đã thẩm định
                    </span>
                  )}
                  {item.status === 'ai_extracted' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-600 dark:text-purple-400">
                      <Sparkles size={12} />
                      AI trích xuất
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  <span>{item.confidence}% tin cậy</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="mt-3 text-base font-semibold leading-snug text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
                {item.title}
              </h2>

              {/* Summary */}
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 line-clamp-3 dark:text-zinc-400">
                {item.summary}
              </p>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer with Author and Useful count */}
            <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                  {item.author.avatar}
                </div>
                <div>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {item.author.name}
                  </span>
                  <span className="text-zinc-400"> • {item.updatedAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <ThumbsUp size={12} />
                  {item.helpfulCount}
                </span>
                <button
                  type="button"
                  className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                  title="Xem chi tiết"
                >
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
