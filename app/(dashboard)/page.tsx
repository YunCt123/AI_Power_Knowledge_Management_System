"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Database, GitPullRequest, Users, Search, Sparkles, FileText, GitGraph, Loader2 } from "lucide-react";
import MermaidDiagram from "@/components/MermaidDiagram";
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
  const [rawPrompt, setRawPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{ structured_prd: string; mermaid_code: string } | null>(null);

  const handleGenerate = async () => {
    if (!rawPrompt.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const res = await fetch("/api/requirements/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawPrompt }),
      });

      const responseData = await res.json();

      if (responseData.success) {
        setResult(responseData.data);
      } else {
        setErrorMessage("Lỗi từ API: " + responseData.error);
      }
    } catch {
      setErrorMessage("Đã xảy ra lỗi khi kết nối với Backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome & Header section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          RepoMind MVP — AI Product Owner & Knowledge Manager
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Chuyển hóa yêu cầu lộn xộn từ khách hàng/Sếp thành Tài liệu Kỹ thuật (PRD) & Sơ đồ luồng (Flowchart) tự động.
        </p>
      </div>

      {/* Luồng 1: AI Requirement & Flowchart Generator */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Nhập yêu cầu lộn xộn từ Business / Khách hàng:
          </label>
          <button
            type="button"
            onClick={() =>
              setRawPrompt(
                "Dạo này khách hay bỏ quên giỏ hàng. Em làm tính năng nhắc nhở nhé. Khách bỏ đồ vào giỏ > 2 tiếng chưa thanh toán thì gửi email. Nếu là khách VIP thì nhắn Zalo kèm mã giảm giá 10%."
              )
            }
            className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            + Dùng câu mẫu thử nghiệm
          </button>
        </div>

        <textarea
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          rows={4}
          placeholder="Ví dụ: Khách bỏ đồ vào giỏ > 2 tiếng chưa thanh toán thì gửi email. VIP thì nhắn Zalo..."
          value={rawPrompt}
          onChange={(e) => setRawPrompt(e.target.value)}
        />

        {errorMessage && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {errorMessage}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading || !rawPrompt.trim()}
            className={`inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-all ${
              isLoading || !rawPrompt.trim()
                ? "cursor-not-allowed bg-zinc-400 dark:bg-zinc-700"
                : "bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                AI Đang Xử Lý...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Chuyển Hóa Yêu Cầu
              </>
            )}
          </button>
        </div>
      </div>

      {/* Khu vực Hiển thị Kết quả (Chia đôi màn hình: Trái PRD - Phải Sơ đồ) */}
      {result && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Cột 1: Hiển thị PRD Document */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 flex items-center gap-2 border-b border-zinc-200 pb-3 text-lg font-bold text-zinc-800 dark:border-zinc-800 dark:text-zinc-100">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              📄 Tài liệu Kỹ thuật (PRD)
            </h2>
            <div className="prose prose-sm max-w-none h-[500px] overflow-y-auto pr-2 text-zinc-700 dark:text-zinc-300 space-y-3 leading-relaxed">
              <ReactMarkdown>{result.structured_prd}</ReactMarkdown>
            </div>
          </div>

          {/* Cột 2: Hiển thị Diagram */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 flex items-center gap-2 border-b border-zinc-200 pb-3 text-lg font-bold text-zinc-800 dark:border-zinc-800 dark:text-zinc-100">
              <GitGraph className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              🗺️ Sơ đồ Luồng (Flowchart)
            </h2>
            <div className="flex h-[500px] items-center justify-center overflow-y-auto rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-950">
              <MermaidDiagram chart={result.mermaid_code} />
            </div>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Bottom section: Contributors + Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopContributorsCard />
        <RecentActivityCard />
      </div>
    </div>
  );
}
