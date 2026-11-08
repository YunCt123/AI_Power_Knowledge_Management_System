'use client';

import {
  Users,
  Award,
  ThumbsUp,
  BookOpen,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';
import { useState } from 'react';

interface Expert {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  contributions: number;
  helpfulVotes: number;
  reputationScore: number;
  badges: string[];
}

const EXPERTS: Expert[] = [
  {
    id: 'exp-1',
    name: 'Trần Minh Đức',
    avatar: 'TĐ',
    role: 'Kỹ sư trưởng Vận hành',
    department: 'Xưởng CNC',
    contributions: 42,
    helpfulVotes: 380,
    reputationScore: 98,
    badges: ['Bậc thầy Tri thức', 'Top 1 Tháng', 'Chuyên gia CNC'],
  },
  {
    id: 'exp-2',
    name: 'Lê Thị Hương',
    avatar: 'LH',
    role: 'Trưởng ca Sản xuất',
    department: 'Khối Sản xuất',
    contributions: 31,
    helpfulVotes: 295,
    reputationScore: 94,
    badges: ['Người tiên phong AI', 'Chuyên gia Đúc'],
  },
  {
    id: 'exp-3',
    name: 'Phạm Văn Hùng',
    avatar: 'PH',
    role: 'Chuyên gia Giám sát',
    department: 'Phòng QA/QC',
    contributions: 28,
    helpfulVotes: 240,
    reputationScore: 91,
    badges: ['Thẩm định viên Xuất sắc', 'Chuẩn mực 5S'],
  },
  {
    id: 'exp-4',
    name: 'Nguyễn Thị Mai',
    avatar: 'NM',
    role: 'Kỹ sư R&D',
    department: 'Phòng Nghiên cứu & Cải tiến',
    contributions: 22,
    helpfulVotes: 185,
    reputationScore: 89,
    badges: ['Đổi mới sáng tạo', 'IoT & SCADA'],
  },
  {
    id: 'exp-5',
    name: 'Hoàng Đức Anh',
    avatar: 'HA',
    role: 'Điều độ Vận hành',
    department: 'Khối Vận hành',
    contributions: 19,
    helpfulVotes: 150,
    reputationScore: 85,
    badges: ['Đóng góp tích cực'],
  },
];

export default function TeamPage() {
  const [search, setSearch] = useState('');

  const filtered = EXPERTS.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Mạng lưới Chuyên gia Tri thức (Knowledge Champions)
          </h1>
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
            Vinh danh và ghi nhận những cá nhân tích cực chuyển hóa kinh nghiệm cá nhân thành tài sản số của doanh nghiệp.
          </p>
        </div>
      </div>

      {/* Search & Stats Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Tổng chuyên gia đóng góp</span>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">48 thành viên</p>
        </div>
        <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Điểm hữu ích cộng dồn</span>
          <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">2,450 lượt</p>
        </div>
        <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Quỹ thưởng Kaizen tháng này</span>
          <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">18.500.000 đ</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên nhân sự, chức danh hoặc bộ phận..."
          className="w-full rounded-xl border border-zinc-200/80 bg-white py-2 pl-9 pr-4 text-xs text-zinc-900 placeholder:text-zinc-400 shadow-xs focus:border-blue-500 focus:outline-none dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      {/* Expert Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((expert, idx) => (
          <div
            key={expert.id}
            className="flex flex-col justify-between rounded-xl border border-zinc-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-xs">
                    {expert.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {expert.name}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{expert.role}</p>
                    <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                      {expert.department}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                  <Award size={13} />
                  <span>#{idx + 1}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-zinc-50 p-2.5 text-center text-xs dark:bg-zinc-800/40">
                <div>
                  <span className="text-[10px] text-zinc-400">Tri thức</span>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">{expert.contributions}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400">Hữu ích</span>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">{expert.helpfulVotes}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400">Điểm uy tín</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{expert.reputationScore}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {expert.badges.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1 rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    <Sparkles size={10} className="text-amber-500" />
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
