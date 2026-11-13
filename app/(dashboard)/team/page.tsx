'use client';

import { useState } from 'react';
import {
  Award,
  Sparkles,
  Search,
  Heart,
} from 'lucide-react';
import { toast } from '@/src/store/toast-store';

interface Expert {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  contributions: number;
  helpfulVotes: number;
  savedIncidents: number;
  kpiBonus: string;
  reputationScore: number;
  badges: string[];
}

const INITIAL_EXPERTS: Expert[] = [
  {
    id: 'exp-1',
    name: 'Nguyễn Văn A',
    avatar: 'NA',
    role: 'Tech Lead / System Architect',
    department: 'Core Architecture & Platform',
    contributions: 48,
    helpfulVotes: 480,
    savedIncidents: 12,
    kpiBonus: '+2,400 pts ($120)',
    reputationScore: 99,
    badges: ['Server Savior 🛡️', 'Vector Pioneer', 'Top 1 Tháng'],
  },
  {
    id: 'exp-2',
    name: 'Trần Quốc Bảo',
    avatar: 'TB',
    role: 'Senior Backend Engineer',
    department: 'Payment & Database Core',
    contributions: 36,
    helpfulVotes: 365,
    savedIncidents: 9,
    kpiBonus: '+1,800 pts ($90)',
    reputationScore: 96,
    badges: ['Bug Buster 🐛', 'Concurrency Master', 'Deadlock Zero'],
  },
  {
    id: 'exp-3',
    name: 'Lê Hoàng Long',
    avatar: 'LL',
    role: 'Fullstack & Integrations Lead',
    department: 'Integrations & Webhooks',
    contributions: 29,
    helpfulVotes: 290,
    savedIncidents: 7,
    kpiBonus: '+1,450 pts ($70)',
    reputationScore: 94,
    badges: ['Webhook Guardian', 'Clean Code', 'API Specialist'],
  },
  {
    id: 'exp-4',
    name: 'Đặng Thu Thảo',
    avatar: 'DT',
    role: 'Senior Frontend Engineer',
    department: 'Frontend Experience',
    contributions: 24,
    helpfulVotes: 240,
    savedIncidents: 5,
    kpiBonus: '+1,200 pts ($60)',
    reputationScore: 92,
    badges: ['React 19 Pro', 'UX Optimizer', 'SSR Master'],
  },
  {
    id: 'exp-5',
    name: 'Phạm Minh Tuấn',
    avatar: 'PT',
    role: 'DevOps & SRE Lead',
    department: 'Cloud Infrastructure',
    contributions: 21,
    helpfulVotes: 210,
    savedIncidents: 6,
    kpiBonus: '+1,150 pts ($55)',
    reputationScore: 90,
    badges: ['High Availability', 'Database Protector', 'Zero-Downtime'],
  },
  {
    id: 'exp-6',
    name: 'Trần Minh Khôi',
    avatar: 'MK',
    role: 'Fresher Developer (Newbie)',
    department: 'Core Engineering',
    contributions: 8,
    helpfulVotes: 95,
    savedIncidents: 4,
    kpiBonus: '+600 pts ($30)',
    reputationScore: 84,
    badges: ['Active Learner 🚀', 'SOP Adopter', 'Fast Onboarding'],
  },
];

export default function TeamPage() {
  const [experts, setExperts] = useState<Expert[]>(INITIAL_EXPERTS);
  const [search, setSearch] = useState('');

  const handleSendKudos = (expert: Expert) => {
    setExperts((prev) =>
      prev.map((e) =>
        e.id === expert.id ? { ...e, helpfulVotes: e.helpfulVotes + 5 } : e
      )
    );
    toast.success(
      `Đã tặng Kudos cho ${expert.name}!`,
      `+5 điểm hữu ích và hoa hồng tri thức đã được ghi nhận vào bảng KPI của ${expert.name}.`
    );
  };

  const filtered = experts.filter(
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
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-0.5 text-xs font-semibold text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300 mb-1.5">
            <Award size={12} />
            <span>Gamification & Bảng Xếp Hạng Tri Thức</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Bảng vinh danh Kỹ sư Tri thức (Knowledge Champions)
          </h1>
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
            Cơ chế thưởng KPI & Hoa hồng Tri thức: Kỹ sư được cộng điểm mỗi khi SOP hoặc code note của họ cứu sống hệ thống khỏi sự cố sập server.
          </p>
        </div>
      </div>

      {/* KPI Stats Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Tổng Kỹ sư Đóng góp Tri thức
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">48 Kỹ sư</p>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+6 tháng này</span>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Số lần Cứu Sập Server (Prevented Crashes)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">43 Sự cố</p>
            <span className="text-xs font-semibold text-blue-600">Zero-Downtime</span>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Quỹ Thưởng Hoa Hồng Tri Thức Tháng
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">$2,450 USD</p>
            <span className="text-xs text-zinc-400">Tự động cộng KPI</span>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative max-w-md">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên kỹ sư, vị trí (Tech Lead, Senior, Fresher...)"
          className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-4 text-xs text-zinc-900 placeholder:text-zinc-400 shadow-xs focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      {/* Expert Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((expert, idx) => (
          <div
            key={expert.id}
            className="flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-xs">
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

                <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                  <Award size={13} />
                  <span>#{idx + 1}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-zinc-50 p-3 text-center text-xs dark:bg-zinc-800/40">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400">SOPs Nạp</span>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">{expert.contributions}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Cứu Server</span>
                  <p className="font-bold text-rose-600 dark:text-rose-400">{expert.savedIncidents} lần</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Điểm Uy Tín</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{expert.reputationScore}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {expert.badges.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    <Sparkles size={10} className="text-amber-500" />
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer with Kudos button & KPI bonus */}
            <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs dark:border-zinc-800">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Thưởng KPI: {expert.kpiBonus}
              </span>
              <button
                type="button"
                onClick={() => handleSendKudos(expert)}
                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50/50 px-2.5 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/70 active:scale-95"
              >
                <Heart size={12} className="fill-rose-500 text-rose-500" />
                <span>Tặng Kudos</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
