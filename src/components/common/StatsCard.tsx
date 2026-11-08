"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/src/utils/cn";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  changeType: "increase" | "decrease";
  icon: React.ReactNode;
  description?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeType,
  icon,
  description,
}: StatsCardProps) {
  const isIncrease = changeType === "increase";

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "group relative rounded-xl border p-6",
        "bg-white dark:bg-zinc-900",
        "border-zinc-200 dark:border-zinc-800",
        "hover:shadow-md dark:hover:shadow-zinc-900/50",
        "transition-shadow duration-200"
      )}
    >
      {/* Top row: icon + title */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            "bg-zinc-100 text-zinc-600",
            "dark:bg-zinc-800 dark:text-zinc-400"
          )}
        >
          {icon}
        </div>
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {title}
        </span>
      </div>

      {/* Value */}
      <div className="mt-4">
        <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {value}
        </span>
      </div>

      {/* Change indicator */}
      <div className="mt-2 flex items-center gap-1.5">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-sm font-medium",
            isIncrease
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          )}
        >
          {isIncrease ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          {isIncrease ? "+" : ""}
          {change}%
        </span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {description ?? "so với tuần trước"}
        </span>
      </div>
    </motion.div>
  );
}
