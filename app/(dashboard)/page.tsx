import { Database, GitPullRequest, Users, Search } from "lucide-react";
import { StatsCard } from "@/src/components/common/StatsCard";
import { TopContributorsCard } from "@/src/components/common/TopContributorsCard";
import { RecentActivityCard } from "@/src/components/common/RecentActivityCard";

const statsData = [
  {
    title: "Tổng tri thức",
    value: "1,247",
    change: 12.5,
    changeType: "increase" as const,
    icon: <Database className="h-5 w-5" />,
  },
  {
    title: "Đóng góp tuần này",
    value: "89",
    change: 8.3,
    changeType: "increase" as const,
    icon: <GitPullRequest className="h-5 w-5" />,
  },
  {
    title: "Người dùng hoạt động",
    value: "156",
    change: 3.2,
    changeType: "increase" as const,
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Truy vấn RAG",
    value: "432",
    change: 2.1,
    changeType: "decrease" as const,
    icon: <Search className="h-5 w-5" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Chào mừng trở lại, Nguyễn Văn A 👋
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Đây là tổng quan về hệ thống quản lý tri thức của bạn hôm nay.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Bottom section: Contributors + Activity */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopContributorsCard />
        <RecentActivityCard />
      </div>
    </div>
  );
}
