"use client";

import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/src/utils/cn";

interface Contributor {
  name: string;
  department: string;
  contributions: number;
}

const contributors: Contributor[] = [
  { name: "Nguyễn Văn A", department: "Tech Lead / Architecture", contributions: 48 },
  { name: "Trần Quốc Bảo", department: "Backend & Database", contributions: 36 },
  { name: "Lê Hoàng Long", department: "Fullstack & Integrations", contributions: 29 },
  { name: "Đặng Thu Thảo", department: "Frontend & UI/UX", contributions: 24 },
  { name: "Phạm Minh Tuấn", department: "DevOps & Reliability", contributions: 21 },
];

const maxContributions = contributors[0].contributions;

function getInitials(name: string) {
  const parts = name.split(" ");
  return (parts[parts.length - 2]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "");
}

const rankColors = [
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
  "bg-zinc-50 text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-500",
  "bg-zinc-50 text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-500",
];

export function TopContributorsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={cn(
        "rounded-xl border p-6",
        "bg-white dark:bg-zinc-900",
        "border-zinc-200 dark:border-zinc-800"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Top đóng góp
          </h3>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium",
            "bg-zinc-100 text-zinc-600",
            "dark:bg-zinc-800 dark:text-zinc-400"
          )}
        >
          Tuần này
        </span>
      </div>

      {/* Contributors list */}
      <div className="mt-5 space-y-3">
        {contributors.map((contributor, index) => (
          <div
            key={contributor.name}
            className="flex items-center gap-3"
          >
            {/* Rank */}
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                rankColors[index]
              )}
            >
              {index + 1}
            </span>

            {/* Avatar */}
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                "bg-zinc-200 text-zinc-700",
                "dark:bg-zinc-700 dark:text-zinc-300"
              )}
            >
              {getInitials(contributor.name)}
            </div>

            {/* Info + progress */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {contributor.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {contributor.department}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
                  {contributor.contributions}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <motion.div
                  className="h-full rounded-full bg-zinc-900 dark:bg-zinc-100"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(contributor.contributions / maxContributions) * 100}%`,
                  }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
