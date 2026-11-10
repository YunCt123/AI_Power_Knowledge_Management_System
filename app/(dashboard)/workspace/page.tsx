"use client";

import { useState } from "react";
import {
  ShieldAlert,
  Database,
  Play,
  CheckCircle2,
  Loader2,
  ExternalLink,
  GitMerge,
  GitPullRequest,
  Ticket,
  Webhook,
} from "lucide-react";

interface WarningRecord {
  title: string;
  context: string;
  root_cause: string;
  solution: string;
  hot_files: string[];
  source_url?: string;
  similarity?: number;
}

export default function WorkspacePage() {
  const [loadingSeed, setLoadingSeed] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);
  const [loadingTask, setLoadingTask] = useState(false);
  const [loadingWebhook, setLoadingWebhook] = useState<string | null>(null);
  const [warning, setWarning] = useState<WarningRecord | null>(null);
  const [webhookCommentPreview, setWebhookCommentPreview] = useState<{
    source: string;
    content: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // KỊCH BẢN 1: Nạp bài học của người đi trước (Seed Data nhanh)
  const handleSeedData = async () => {
    setLoadingSeed(true);
    setErrorMessage(null);
    setSeedSuccess(null);
    try {
      const res = await fetch("/api/knowledge/mock-ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Sập hệ thống thanh toán do tràn RAM",
          context: "Tháng 10/2025, luồng thanh toán giỏ hàng bị sập 2 tiếng vào ngày Sale.",
          rootCause:
            "Hàm xử lý tính tiền không giải phóng bộ nhớ (memory leak) khi lặp qua hàng ngàn sản phẩm.",
          solution:
            "Bổ sung cơ chế phân trang (pagination) và clear cache Redis sau mỗi lượt lặp. Tuyệt đối không xóa hàm checkTimeout() ở dòng 45.",
          hotFiles: ["src/services/payment.ts", "src/api/cart.controller.ts"],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSeedSuccess(
          'Đã nạp thành công "Kinh nghiệm xương máu" vào Vector Database (Supabase pgvector)!'
        );
      } else {
        setErrorMessage("Lỗi nạp dữ liệu: " + data.error);
      }
    } catch {
      setErrorMessage("Lỗi kết nối khi nạp dữ liệu.");
    } finally {
      setLoadingSeed(false);
    }
  };

  // KỊCH BẢN 2: Dev mới nhận việc (Trigger AI Cảnh báo trực tiếp)
  const handleStartTask = async () => {
    setLoadingTask(true);
    setErrorMessage(null);
    setWarning(null);
    setWebhookCommentPreview(null);
    try {
      const res = await fetch("/api/warnings/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskDescription:
            "Cập nhật lại giao diện và logic tính tiền cho nút Thanh toán trong Giỏ hàng.",
          touchedFiles: ["src/services/payment.ts"],
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        setErrorMessage("Lỗi kiểm tra rủi ro: " + data.error);
      } else if (data.hasWarning && data.warnings?.length > 0) {
        setWarning(data.warnings[0]);
      } else {
        alert(
          "Task này an toàn, không có rủi ro nào trong quá khứ! (Hãy đảm bảo bạn đã bấm nút Bước 1 trước)"
        );
      }
    } catch {
      setErrorMessage("Lỗi khi kiểm tra rủi ro.");
    } finally {
      setLoadingTask(false);
    }
  };

  // KỊCH BẢN WEBHOOK 1: Giả lập GitHub bắn Webhook khi Senior Dev vừa Merge PR sửa lỗi
  const handleSimulateGitHubMergeWebhook = async () => {
    setLoadingWebhook("github-merge");
    setErrorMessage(null);
    setSeedSuccess(null);
    try {
      const res = await fetch("/api/webhooks/github", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-github-event": "pull_request",
        },
        body: JSON.stringify({
          action: "closed",
          pull_request: {
            number: 104,
            merged: true,
            title: "Hotfix: Khắc phục lỗi tràn RAM ở luồng thanh toán giỏ hàng ngày Sale",
            body: "Sửa lỗi memory leak khi tính tổng tiền cho giỏ hàng lớn và giữ nguyên hàm checkTimeout() ở dòng 45.",
            html_url: "https://github.com/org/repo/pull/104",
          },
          repository: {
            name: "AI_Power_Knowledge_Management_System",
            owner: { login: "SeniorDev" },
          },
          mockFiles: [
            {
              filename: "src/services/payment.ts",
              patch:
                "@@ -42,6 +42,9 @@ export async function processCartPayment(items) {\n+  await clearRedisBatchCache();\n+  checkTimeout(); // Cấm xóa dòng này để tránh treo kết nối cổng thanh toán\n   return paginateCalculation(items, 100);\n }",
            },
          ],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSeedSuccess(
          `[GitHub Webhook - PR #104 Merged] Gemini đã tự động đọc Code Diff, đúc kết SOP ("${data.data?.title}") và lưu Vector vào Supabase!`
        );
      } else {
        setErrorMessage("Lỗi GitHub Merge Webhook: " + data.error);
      }
    } catch {
      setErrorMessage("Lỗi khi gọi GitHub Merge Webhook.");
    } finally {
      setLoadingWebhook(null);
    }
  };

  // KỊCH BẢN WEBHOOK 2: Giả lập Jira bắn Webhook khi Sếp vừa tạo Ticket mới (Lớp phòng ngự 1)
  const handleSimulateJiraWebhook = async () => {
    setLoadingWebhook("jira");
    setErrorMessage(null);
    setWarning(null);
    setWebhookCommentPreview(null);
    try {
      const res = await fetch("/api/webhooks/jira", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookEvent: "jira:issue_created",
          issue: {
            key: "JIRA-889",
            fields: {
              summary: "Tối ưu hóa logic tính tiền và thanh toán giỏ hàng mùa Flash Sale",
              description:
                "Cần sửa lại luồng tính toán giá trị đơn hàng trong giỏ hàng để chuẩn bị cho đợt Mega Sale.",
            },
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.hasWarning) {
        setWarning(data.warnings[0]);
        setWebhookCommentPreview({
          source: "Lớp Phòng Ngự 1 — Bình luận tự động của Bot trên Jira Ticket #JIRA-889",
          content: data.jiraCommentPreview,
        });
      } else if (data.success) {
        alert("Jira Webhook: Không phát hiện rủi ro (Hãy nạp dữ liệu ở Bước 1 trước).");
      } else {
        setErrorMessage("Lỗi Jira Webhook: " + data.error);
      }
    } catch {
      setErrorMessage("Lỗi khi gọi Jira Webhook.");
    } finally {
      setLoadingWebhook(null);
    }
  };

  // KỊCH BẢN WEBHOOK 3: Giả lập GitHub bắn Webhook khi Fresher vừa mở PR mới đụng vào file nhạy cảm (Lớp phòng ngự 2)
  const handleSimulateGitHubOpenPrWebhook = async () => {
    setLoadingWebhook("github-open");
    setErrorMessage(null);
    setWarning(null);
    setWebhookCommentPreview(null);
    try {
      const res = await fetch("/api/webhooks/github", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-github-event": "pull_request",
        },
        body: JSON.stringify({
          action: "opened",
          pull_request: {
            number: 205,
            merged: false,
            title: "Feat: Cập nhật lại hàm tính tiền giỏ hàng trong payment service",
            body: "Refactor lại file src/services/payment.ts cho gọn hơn.",
            html_url: "https://github.com/org/repo/pull/205",
          },
          repository: {
            name: "AI_Power_Knowledge_Management_System",
            owner: { login: "FresherDev" },
          },
          mockFiles: [
            {
              filename: "src/services/payment.ts",
              patch: "@@ -40,5 +40,3 @@\n- checkTimeout();",
            },
          ],
        }),
      });
      const data = await res.json();
      if (data.success && data.hasWarning) {
        setWarning(data.warnings[0]);
        setWebhookCommentPreview({
          source: "Lớp Phòng Ngự 2 — Bình luận tự động của Bot trên GitHub Pull Request #205",
          content: data.commentPreview,
        });
      } else if (data.success) {
        alert("GitHub PR Webhook: PR an toàn (Hãy nạp dữ liệu ở Bước 1 trước).");
      } else {
        setErrorMessage("Lỗi GitHub Open PR Webhook: " + data.error);
      }
    } catch {
      setErrorMessage("Lỗi khi gọi GitHub Open PR Webhook.");
    } finally {
      setLoadingWebhook(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dev Workspace (Luồng Thu Thập & Cảnh Báo Rủi Ro Just-in-Time)
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Giả lập hành trình AI bảo vệ Kỹ sư phần mềm qua 2 lớp phòng ngự tự động (Jira Webhook & GitHub Webhook).
        </p>
      </header>

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {errorMessage}
        </div>
      )}

      {/* BƯỚC 1 CỦA DEMO */}
      <div className="rounded-xl border border-zinc-200 border-l-4 border-l-blue-600 bg-white p-6 shadow-xs dark:border-zinc-800 dark:border-l-blue-500 dark:bg-zinc-900">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-800 dark:text-zinc-100">
              <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              1. Hậu trường: Lưu trữ Tri thức (Luồng 2)
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Nạp bài học xương máu vào Supabase pgvector (768 chiều) hoặc giả lập sự kiện Senior Dev vừa Merge PR trên GitHub.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={handleSeedData}
              disabled={loadingSeed || loadingWebhook !== null}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-xs font-medium text-white shadow-xs transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {loadingSeed ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang mã hóa Vector...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  Nạp Nhanh Kinh Nghiệm Cũ
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSimulateGitHubMergeWebhook}
              disabled={loadingSeed || loadingWebhook !== null}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-purple-300 bg-purple-50 px-4 py-2.5 text-xs font-semibold text-purple-800 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300"
            >
              {loadingWebhook === "github-merge" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AI Đang Đọc Code Diff...
                </>
              ) : (
                <>
                  <GitMerge className="h-4 w-4" />
                  Giả lập Webhook: Merge PR #104
                </>
              )}
            </button>
          </div>
        </div>

        {seedSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{seedSuccess}</span>
          </div>
        )}
      </div>

      {/* BƯỚC 2 CỦA DEMO */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b border-zinc-200 pb-4 mb-4 gap-4 dark:border-zinc-800">
          <div>
            <span className="inline-block rounded bg-blue-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Jira Ticket #889
            </span>
            <h2 className="mt-2 text-xl font-bold text-zinc-800 dark:text-zinc-100">
              2. Tiền sảnh: Cập nhật API Thanh toán Giỏ hàng (Luồng 3)
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Người nhận việc: <strong>Dev Mới (Fresher)</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={handleStartTask}
            disabled={loadingTask || loadingWebhook !== null}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingTask ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                AI Đang Quét...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Bắt đầu Code (Tạo Branch)
              </>
            )}
          </button>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 font-mono text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          <p>
            <strong>Mô tả yêu cầu:</strong> Cập nhật lại giao diện và logic tính tiền cho nút Thanh toán trong Giỏ hàng.
          </p>
          <p className="mt-2">
            <strong>Files dự kiến sửa:</strong>{" "}
            <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 text-xs text-rose-600 dark:bg-zinc-800 dark:text-rose-400">
              src/services/payment.ts
            </code>
          </p>
        </div>

        {/* BẢNG ĐIỀU KHIỂN TEST WEBHOOK TỰ ĐỘNG (LỚP PHÒNG NGỰ 1 & 2) */}
        <div className="mt-5 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/60 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
            <Webhook className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Test Tự Động Hóa CI/CD Webhooks (Không cần rời trình duyệt):
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSimulateJiraWebhook}
              disabled={loadingWebhook !== null || loadingTask}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-800 transition hover:bg-blue-100 disabled:opacity-60 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
            >
              {loadingWebhook === "jira" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Ticket className="h-3.5 w-3.5" />
              )}
              Lớp Phòng Ngự 1: Bắn Jira Webhook (/api/webhooks/jira)
            </button>

            <button
              type="button"
              onClick={handleSimulateGitHubOpenPrWebhook}
              disabled={loadingWebhook !== null || loadingTask}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 disabled:opacity-60 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
            >
              {loadingWebhook === "github-open" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <GitPullRequest className="h-3.5 w-3.5" />
              )}
              Lớp Phòng Ngự 2: Bắn GitHub PR Webhook (/api/webhooks/github)
            </button>
          </div>
        </div>
      </div>

      {/* HIỂN THỊ NỘI DUNG COMMENT TỰ ĐỘNG CỦA BOT TRÊN JIRA / GITHUB */}
      {webhookCommentPreview && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-5 dark:border-indigo-900/60 dark:bg-indigo-950/30">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-2">
            🤖 {webhookCommentPreview.source}
          </div>
          <pre className="whitespace-pre-wrap rounded-lg border border-indigo-100 bg-white p-4 font-sans text-sm text-zinc-800 dark:border-indigo-900/40 dark:bg-zinc-900 dark:text-zinc-200">
            {webhookCommentPreview.content}
          </pre>
        </div>
      )}

      {/* POP-UP CẢNH BÁO (Chỉ hiện khi AI phát hiện rủi ro) */}
      {warning && (
        <div className="rounded-r-xl border-l-4 border-red-600 bg-red-50/90 p-6 shadow-lg dark:bg-red-950/30">
          <div className="flex items-center gap-2.5 mb-2">
            <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-400" />
            <h3 className="text-lg font-bold text-red-700 dark:text-red-300">
              🚨 CẢNH BÁO RỦI RO NGHIÊM TRỌNG TỪ REPOMIND AI
            </h3>
          </div>

          <p className="mb-4 text-sm font-medium text-red-600 dark:text-red-300">
            AI phát hiện tác vụ này đụng vào{" "}
            <code className="rounded bg-red-100 px-1.5 py-0.5 font-mono text-xs font-bold dark:bg-red-900/60">
              {warning.hot_files?.[0] || "src/services/payment.ts"}
            </code>
            . File/ngữ nghĩa này từng gây sự cố với độ trùng khớp{" "}
            <strong>
              {warning.similarity ? `${Math.round(warning.similarity * 100)}%` : "cao"}
            </strong>
            !
          </p>

          <div className="space-y-2.5 rounded-lg border border-red-200 bg-white p-4 text-sm text-zinc-700 dark:border-red-900/50 dark:bg-zinc-900 dark:text-zinc-200">
            <p>
              <strong>🔥 Sự cố cũ:</strong> {warning.title} ({warning.context})
            </p>
            <p>
              <strong>🧠 Nguyên nhân gốc:</strong> {warning.root_cause}
            </p>
            <p>
              <strong>💡 Lời khuyên (SOP):</strong>{" "}
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {warning.solution}
              </span>
            </p>
          </div>

          <a
            href={warning.source_url || "#"}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-red-600 hover:underline dark:text-red-400"
          >
            👉 Xem chi tiết PR/Ticket sửa lỗi cũ của người đi trước
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}
