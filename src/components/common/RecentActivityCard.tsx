"use client";

import { FileText, Pencil, MessageSquare, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/src/utils/cn";

type ActivityType = "new" | "edit" | "comment";

interface Activity {
  type: ActivityType;
  title: string;
  author: string;
  timestamp: string;
  category: string;
}

const activities: Activity[] = [
  {
    type: "new",
    title: "Phát hiện rủi ro tràn RAM ở luồng payment.ts khi tải cao",
    author: "Nguyễn Văn A (Tech Lead)",
    timestamp: "15 phút trước",
    category: "Payment",
  },
  {
    type: "edit",
    title: "Trích xuất SOP từ Code Diff PR #104 qua Gemini AI",
    author: "RepoMind Bot",
    timestamp: "1 giờ trước",
    category: "AI Ingestion",
  },
  {
    type: "comment",
    title: "Cảnh báo Just-in-Time đã chặn rủi ro xóa checkTimeout() ở PR #205",
    author: "Trần Minh Khôi (Fresher)",
    timestamp: "2 giờ trước",
    category: "Risk Alert",
  },
  {
    type: "new",
    title: "Bổ sung tài liệu Root Cause cho sự cố Deadlock PostgreSQL 40P01",
    author: "Trần Quốc Bảo (Senior Backend)",
    timestamp: "5 giờ trước",
    category: "Database",
  },
  {
    type: "edit",
    title: "Kiểm duyệt thành công SOP tích hợp Stripe Webhook Idempotency",
    author: "Lê Hoàng Long (Fullstack Lead)",
    timestamp: "1 ngày trước",
    category: "Integrations",
  },
];

const activityIcons: Record<ActivityType, React.ReactNode> = {
  new: <FileText className="h-4 w-4" />,
  edit: <Pencil className="h-4 w-4" />,
  comment: <MessageSquare className="h-4 w-4" />,
};

const activityColors: Record<ActivityType, string> = {
  new: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
  edit: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
  comment: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
};

export function RecentActivityCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className={cn(
        "rounded-xl border p-6",
        "bg-white dark:bg-zinc-900",
        "border-zinc-200 dark:border-zinc-800"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Hoạt động gần đây
        </h3>
      </div>

      {/* Activity list */}
      <div className="mt-5 space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={`${activity.title}-${index}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.35 + index * 0.08 }}
            className="flex gap-3"
          >
            {/* Icon */}
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                activityColors[activity.type]
              )}
            >
              {activityIcons[activity.type]}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {activity.title}
              </p>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {activity.author}
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  {activity.timestamp}
                </span>
              </div>
            </div>

            {/* Category tag */}
            <span
              className={cn(
                "mt-0.5 shrink-0 self-start rounded-md px-2 py-0.5 text-xs font-medium",
                "bg-zinc-100 text-zinc-600",
                "dark:bg-zinc-800 dark:text-zinc-400"
              )}
            >
              {activity.category}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
