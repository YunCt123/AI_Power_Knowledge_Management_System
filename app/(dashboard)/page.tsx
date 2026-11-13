"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Database,
  GitPullRequest,
  ShieldCheck,
  Sparkles,
  FileText,
  GitGraph,
  Loader2,
  Copy,
  Check,
  Clock,
} from "lucide-react";
import MermaidDiagram from "@/components/MermaidDiagram";
import { StatsCard } from "@/src/components/common/StatsCard";
import { TopContributorsCard } from "@/src/components/common/TopContributorsCard";
import { RecentActivityCard } from "@/src/components/common/RecentActivityCard";
import { toast } from "@/src/store/toast-store";

const statsData = [
  {
    title: "SOPs đã Vector hóa",
    value: "1,247",
    change: 14.8,
    changeType: "increase" as const,
    icon: <Database className="h-5 w-5" />,
  },
  {
    title: "PRs quét tự động",
    value: "342",
    change: 22.4,
    changeType: "increase" as const,
    icon: <GitPullRequest className="h-5 w-5" />,
  },
  {
    title: "Cảnh báo Just-in-Time",
    value: "89",
    change: 35.1,
    changeType: "increase" as const,
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: "Thời gian Onboarding",
    value: "2 ngày",
    change: 85.0,
    changeType: "increase" as const,
    icon: <Clock className="h-5 w-5" />,
  },
];

const SAMPLE_PROMPTS = [
  {
    label: "Giỏ hàng & Khuyến mãi Zalo VIP",
    prompt:
      "Dạo này khách hay bỏ quên giỏ hàng. Em làm tính năng nhắc nhở nhé. Khách bỏ đồ vào giỏ > 2 tiếng chưa thanh toán thì gửi email. Nếu là khách VIP thì nhắn Zalo kèm mã giảm giá 10%.",
  },
  {
    label: "Stripe Webhook & Auto Refund",
    prompt:
      "Khách hủy đơn hàng trong vòng 15 phút thì tự động gọi Stripe Refund API hoàn 100% tiền. Nếu có sự cố cổng thanh toán thì ghi nhận vào Redis queue và gửi thông báo Slack cho CSKH.",
  },
  {
    label: "SSO Google & Phân quyền RBAC",
    prompt:
      "Xây dựng tính năng đăng nhập Google OAuth cho khách hàng doanh nghiệp B2B. Khi đăng nhập lần đầu, tự động kiểm tra domain công ty, gán vai trò Member hoặc Admin và cấp Refresh Token 7 ngày.",
  },
];

export default function DashboardPage() {
  const [rawPrompt, setRawPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{ structured_prd: string; mermaid_code: string } | null>(null);
  const [copiedPrd, setCopiedPrd] = useState(false);
  const [copiedMermaid, setCopiedMermaid] = useState(false);

  const handleGenerate = async () => {
    if (!rawPrompt.trim()) {
      toast.warning("Vui lòng nhập yêu cầu", "Hãy nhập đoạn mô tả yêu cầu hoặc chọn một câu mẫu bên dưới.");
      return;
    }
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
        toast.success(
          "Chuyển hóa yêu cầu thành công!",
          "AI Gemini đã tạo xong Tài liệu Kỹ thuật (PRD) và Sơ đồ Luồng (Mermaid Flowchart)."
        );
      } else {
        const err = responseData.error || "Không thể xử lý yêu cầu.";
        setErrorMessage("Lỗi từ AI: " + err);
        toast.error("Lỗi tạo yêu cầu", err);
      }
    } catch {
      const err = "Đã xảy ra lỗi khi kết nối với Backend.";
      setErrorMessage(err);
      toast.error("Lỗi kết nối", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPrd = () => {
    if (!result?.structured_prd) return;
    navigator.clipboard.writeText(result.structured_prd);
    setCopiedPrd(true);
    toast.success("Đã sao chép PRD!", "Nội dung tài liệu kỹ thuật đã được lưu vào clipboard.");
    setTimeout(() => setCopiedPrd(false), 2000);
  };

  const handleCopyMermaid = () => {
    if (!result?.mermaid_code) return;
    navigator.clipboard.writeText(result.mermaid_code);
    setCopiedMermaid(true);
    toast.success("Đã sao chép Mermaid code!", "Mã sơ đồ Mermaid đã được lưu vào clipboard.");
    setTimeout(() => setCopiedMermaid(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome & Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Hackathon MVP — Zero-Downtime Knowledge Ops</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            RepoMind — AI Product Owner & Knowledge Manager
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-3xl">
            Chuyển hóa yêu cầu lộn xộn từ Business thành Tài liệu Kỹ thuật (PRD) & Sơ đồ luồng (Flowchart) tự động, kết nối trực tiếp với hệ thống phòng ngự Just-in-Time.
          </p>
        </div>
      </div>

      {/* Luồng 1: AI Requirement & Flowchart Generator */}
      <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Nhập yêu cầu nghiệp vụ thô (Voice / Chat text):</span>
          </label>
          <span className="text-xs text-zinc-400">Gemini 1.5/2.0 Flash Engine</span>
        </div>

        <textarea
          className="w-full rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 text-sm text-zinc-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-400/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:bg-zinc-900"
          rows={4}
          placeholder="Ví dụ: Khách bỏ đồ vào giỏ > 2 tiếng chưa thanh toán thì gửi email. VIP thì nhắn Zalo..."
          value={rawPrompt}
          onChange={(e) => setRawPrompt(e.target.value)}
        />

        {/* Câu mẫu thử nghiệm */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Gợi ý kịch bản mẫu:</span>
          {SAMPLE_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setRawPrompt(item.prompt);
                toast.info("Đã chọn câu mẫu", item.label);
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 transition hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
            >
              <span>+ {item.label}</span>
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {errorMessage}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
          <span className="text-xs text-zinc-400">
            {rawPrompt.length > 0 ? `${rawPrompt.length} ký tự` : "Hỗ trợ tiếng Việt và tiếng Anh"}
          </span>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading || !rawPrompt.trim()}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all shadow-xs ${
              isLoading || !rawPrompt.trim()
                ? "cursor-not-allowed bg-zinc-400 dark:bg-zinc-700 opacity-70"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-md active:scale-98"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>AI Đang Phân Tích & Vẽ Sơ Đồ...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Chuyển Hóa Yêu Cầu (PRD & Flowchart)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Khu vực Hiển thị Kết quả (Chia đôi màn hình: Trái PRD - Phải Sơ đồ) */}
      {result && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Cột 1: Hiển thị PRD Document */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex flex-col">
            <div className="mb-4 flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
              <h2 className="flex items-center gap-2 text-base font-bold text-zinc-800 dark:text-zinc-100">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>Tài liệu Kỹ thuật (PRD)</span>
              </h2>
              <button
                type="button"
                onClick={handleCopyPrd}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                {copiedPrd ? (
                  <>
                    <Check size={13} className="text-emerald-500" />
                    <span>Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Sao chép PRD</span>
                  </>
                )}
              </button>
            </div>
            <div className="prose prose-sm max-w-none h-[500px] overflow-y-auto pr-2 text-zinc-700 dark:text-zinc-300 space-y-3 leading-relaxed">
              <ReactMarkdown>{result.structured_prd}</ReactMarkdown>
            </div>
          </div>

          {/* Cột 2: Hiển thị Diagram */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex flex-col">
            <div className="mb-4 flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
              <h2 className="flex items-center gap-2 text-base font-bold text-zinc-800 dark:text-zinc-100">
                <GitGraph className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span>Sơ đồ Luồng Kỹ thuật (Flowchart)</span>
              </h2>
              <button
                type="button"
                onClick={handleCopyMermaid}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                {copiedMermaid ? (
                  <>
                    <Check size={13} className="text-emerald-500" />
                    <span>Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Sao chép Mermaid</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex h-[500px] items-center justify-center overflow-y-auto rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-950">
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
