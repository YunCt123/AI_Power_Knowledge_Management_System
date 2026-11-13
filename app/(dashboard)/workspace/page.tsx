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
  Sparkles,
  UserCheck,
  XCircle,
  FileCode2,
  Crown,
  Code2,
} from "lucide-react";
import { useRoleStore } from "@/src/store/role-store";

interface WarningRecord {
  title: string;
  context: string;
  root_cause: string;
  solution: string;
  hot_files: string[];
  source_url?: string;
  similarity?: number;
}

interface DraftSOP {
  title: string;
  context: string;
  rootCause: string;
  solution: string;
  hotFilesText: string; // Chuỗi phân tách bằng dấu phẩy để Tech Lead dễ sửa
}

export default function WorkspacePage() {
  const { role } = useRoleStore();
  const isTechLead = role === "TECH_LEAD";

  const [draftSOP, setDraftSOP] = useState<DraftSOP | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(false);
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

  // BƯỚC 1A (HUMAN-IN-THE-LOOP): AI phân tích PR & tạo Bản nháp SOP chờ Tech Lead duyệt
  const handleGenerateDraft = () => {
    setLoadingDraft(true);
    setErrorMessage(null);
    setSeedSuccess(null);

    setTimeout(() => {
      setDraftSOP({
        title: "Sập hệ thống thanh toán do tràn RAM",
        context:
          "Tháng 10/2025, luồng thanh toán giỏ hàng bị sập 2 tiếng vào ngày Mega Sale do lượng đơn tăng đột biến.",
        rootCause:
          "Hàm xử lý tính tiền không giải phóng bộ nhớ (memory leak) khi lặp qua hàng ngàn sản phẩm trong giỏ hàng.",
        solution:
          "Bổ sung cơ chế phân trang (pagination) và clear cache Redis sau mỗi lượt lặp. Tuyệt đối không xóa hàm checkTimeout() ở dòng 45.",
        hotFilesText: "src/services/payment.ts, src/api/cart.controller.ts",
      });
      setLoadingDraft(false);
    }, 500);
  };

  // BƯỚC 1B (HUMAN-IN-THE-LOOP): Tech Lead chỉnh sửa xong và bấm "Duyệt & Đưa vào Vector DB"
  const handleApproveAndSave = async () => {
    if (!draftSOP) return;
    setLoadingSeed(true);
    setErrorMessage(null);
    setSeedSuccess(null);

    const hotFilesArray = draftSOP.hotFilesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/knowledge/mock-ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draftSOP.title,
          context: draftSOP.context,
          rootCause: draftSOP.rootCause,
          solution: draftSOP.solution,
          hotFiles: hotFilesArray,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSeedSuccess(
          "✅ Tech Lead đã phê duyệt! Bản chuẩn SOP đã được mã hóa thành Vector (768 chiều) và đưa vào hệ thống phòng ngự Supabase."
        );
        setDraftSOP(null);
      } else {
        setErrorMessage("Lỗi lưu dữ liệu: " + data.error);
      }
    } catch {
      setErrorMessage("Lỗi kết nối khi lưu SOP đã duyệt.");
    } finally {
      setLoadingSeed(false);
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
          "Task này an toàn, không có rủi ro nào trong quá khứ! (Hãy đảm bảo Tech Lead đã Duyệt SOP trước đó)"
        );
      }
    } catch {
      setErrorMessage("Lỗi khi kiểm tra rủi ro.");
    } finally {
      setLoadingTask(false);
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
        alert("Jira Webhook: Không phát hiện rủi ro (Hãy nạp dữ liệu ở vai trò Tech Lead trước).");
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
        alert("GitHub PR Webhook: PR an toàn (Hãy nạp dữ liệu ở vai trò Tech Lead trước).");
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
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Dev Workspace
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {isTechLead
              ? "Không gian Kiểm duyệt & Quản trị Tri thức dành cho Tech Lead / Engineering Manager."
              : "Không gian làm việc & Nhận cảnh báo rủi ro tự động dành cho Developer."}
          </p>
        </div>

        {/* Badge nhỏ hiển thị vai trò hiện tại (đổi kín đáo qua Avatar góc phải trên Header) */}
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
            isTechLead
              ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300"
              : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
          }`}
        >
          {isTechLead ? (
            <>
              <Crown className="h-3.5 w-3.5 text-amber-500" />
              <span>Chế độ: Tech Lead 👑 (Full Access)</span>
            </>
          ) : (
            <>
              <Code2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Chế độ: Fresher Dev 👶 (Read-Only)</span>
            </>
          )}
        </div>
      </header>

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {errorMessage}
        </div>
      )}

      {/* ========================================================================
          CHỈ HIỂN THỊ KHI ĐANG Ở VAI TRÒ TECH LEAD (ẨN HOÀN TOÀN VỚI FRESHER DEV)
         ======================================================================== */}
      {isTechLead && (
        <div className="rounded-xl border border-zinc-200 border-l-4 border-l-amber-500 bg-white p-6 shadow-xs dark:border-zinc-800 dark:border-l-amber-500 dark:bg-zinc-900">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <UserCheck className="h-3.5 w-3.5" />
                  Human-in-the-Loop (Tech Lead Only)
                </span>
              </div>
              <h2 className="mt-2 flex items-center gap-2 text-lg font-bold text-zinc-800 dark:text-zinc-100">
                <Database className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                Kiểm Duyệt & Phê Duyệt Tri Thức Đưa Vào Vector DB (Luồng 2)
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                AI đóng vai trò thư ký tóm tắt PR thành bản nháp SOP. Tech Lead kiểm tra, chỉnh sửa rồi mới bấm Duyệt đưa vào Vector DB.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleGenerateDraft}
                disabled={loadingDraft || loadingSeed || loadingWebhook !== null}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingDraft ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    AI Đang Tóm Tắt PR...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    AI Sinh Bản Nháp SOP
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSimulateGitHubMergeWebhook}
                disabled={loadingSeed || loadingWebhook !== null}
                className="inline-flex items-center gap-2 rounded-lg border border-purple-300 bg-purple-50 px-3.5 py-2.5 text-xs font-semibold text-purple-800 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300"
              >
                {loadingWebhook === "github-merge" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    AI Đang Đọc Code Diff...
                  </>
                ) : (
                  <>
                    <GitMerge className="h-4 w-4" />
                    Auto Webhook (Merge PR #104)
                  </>
                )}
              </button>
            </div>
          </div>

          {/* KHUNG HUMAN-IN-THE-LOOP: CHO PHÉP TECH LEAD CHỈNH SỬA BẢN NHÁP TRƯỚC KHI DUYỆT */}
          {draftSOP && (
            <div className="mt-6 rounded-xl border-2 border-indigo-200 bg-indigo-50/40 p-5 space-y-4 dark:border-indigo-900/60 dark:bg-indigo-950/20">
              <div className="flex items-center justify-between border-b border-indigo-200/80 pb-3 dark:border-indigo-800/60">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                    📝 Bản nháp Post-mortem SOP do Gemini trích xuất (Chờ Tech Lead phê duyệt)
                  </h3>
                </div>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Pending Review
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Tiêu đề sự cố (Title):
                  </label>
                  <input
                    type="text"
                    value={draftSOP.title}
                    onChange={(e) => setDraftSOP({ ...draftSOP, title: e.target.value })}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    <FileCode2 className="h-3.5 w-3.5 text-rose-500" />
                    Các file nhạy cảm (Hot Files - cách nhau dấu phẩy):
                  </label>
                  <input
                    type="text"
                    value={draftSOP.hotFilesText}
                    onChange={(e) => setDraftSOP({ ...draftSOP, hotFilesText: e.target.value })}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-xs text-rose-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Bối cảnh xảy ra lỗi (Context):
                </label>
                <input
                  type="text"
                  value={draftSOP.context}
                  onChange={(e) => setDraftSOP({ ...draftSOP, context: e.target.value })}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nguyên nhân gốc rễ (Root Cause):
                </label>
                <textarea
                  rows={2}
                  value={draftSOP.rootCause}
                  onChange={(e) => setDraftSOP({ ...draftSOP, rootCause: e.target.value })}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                  Giải pháp & Quy tắc bắt buộc (SOP Solution - Tech Lead có thể gõ sửa trực tiếp):
                </label>
                <textarea
                  rows={2}
                  value={draftSOP.solution}
                  onChange={(e) => setDraftSOP({ ...draftSOP, solution: e.target.value })}
                  className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm font-medium text-emerald-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-800 dark:bg-zinc-900 dark:text-emerald-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDraftSOP(null)}
                  disabled={loadingSeed}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  <XCircle className="h-4 w-4 text-zinc-500" />
                  Hủy bỏ
                </button>

                <button
                  type="button"
                  onClick={handleApproveAndSave}
                  disabled={loadingSeed}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  {loadingSeed ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang băm Vector 768 chiều...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Tech Lead Duyệt & Đưa vào Vector DB
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {seedSuccess && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{seedSuccess}</span>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================
          PHẦN LÀM VIỆC CỦA DEVELOPER (HIỆN CHO CẢ FRESHER DEV & TECH LEAD)
         ======================================================================== */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b border-zinc-200 pb-4 mb-4 gap-4 dark:border-zinc-800">
          <div>
            <span className="inline-block rounded bg-blue-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Jira Ticket #889
            </span>
            <h2 className="mt-2 text-xl font-bold text-zinc-800 dark:text-zinc-100">
              Cập nhật API Thanh toán Giỏ hàng (Luồng 3)
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Người nhận việc: <strong>Trần Minh Khôi (Fresher Dev 👶)</strong>
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
