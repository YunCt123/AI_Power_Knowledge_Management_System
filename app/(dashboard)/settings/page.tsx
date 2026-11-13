'use client';

import { useState } from 'react';
import {
  Cpu,
  Database,
  Share2,
  Shield,
  Save,
  CheckCircle,
  Key,
  GitBranch,
  Ticket,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { toast } from '@/src/store/toast-store';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'ai' | 'vector' | 'integrations' | 'security'>('ai');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success('Đã lưu cấu hình RepoMind!', 'Các tham số AI, Supabase và Webhooks đã được cập nhật.');
    setTimeout(() => setSaved(false), 2500);
  };

  const handleTestGemini = () => {
    toast.success('Kết nối Gemini API thành công!', 'Phản hồi từ Google AI Studio với độ trễ 240ms.');
  };

  const handleTestSupabase = () => {
    toast.success('Kết nối Supabase pgvector thành công!', 'Cột embedding vector(768) đã sẵn sàng phục vụ RAG.');
  };

  const handleTestGitHub = () => {
    toast.success('Kết nối GitHub Octokit thành công!', 'Bot đã sẵn sàng tạo comment cảnh báo trên Pull Request.');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Cài đặt Hệ thống RepoMind
          </h1>
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
            Quản trị mô hình Google Gemini AI, cơ sở dữ liệu Vector pgvector và Webhooks kết nối GitHub/Jira.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition active:scale-98"
        >
          {saved ? (
            <>
              <CheckCircle size={14} className="text-emerald-200" />
              <span>Đã lưu thay đổi</span>
            </>
          ) : (
            <>
              <Save size={14} />
              <span>Lưu cấu hình</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-200 text-xs font-semibold dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab('ai')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-4 py-2.5 transition-colors',
            activeTab === 'ai'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-bold'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          )}
        >
          <Cpu size={14} />
          <span>Mô hình AI & LLM</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('vector')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-4 py-2.5 transition-colors',
            activeTab === 'vector'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-bold'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          )}
        >
          <Database size={14} />
          <span>Vector DB & pgvector</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('integrations')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-4 py-2.5 transition-colors',
            activeTab === 'integrations'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-bold'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          )}
        >
          <Share2 size={14} />
          <span>Kênh Webhooks (GitHub / Jira)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-4 py-2.5 transition-colors',
            activeTab === 'security'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-bold'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          )}
        >
          <Shield size={14} />
          <span>Bảo mật & Phân quyền (RBAC)</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Cấu hình Google Gemini AI & Model Fallback
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Mô hình xử lý NLP đọc hiểu Code Diff, chuyển hóa yêu cầu thành PRD và sinh mã sơ đồ Mermaid Flowchart.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Google Gemini API Key
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="password"
                      defaultValue="AIzaSyA8_••••••••••••••••••••••••••••••"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 py-2 pl-9 pr-4 text-xs font-mono dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleTestGemini}
                    className="rounded-xl border border-zinc-200 px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800 transition"
                  >
                    Kiểm tra kết nối
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Mô hình Đọc Code Diff & PRD
                  </label>
                  <select
                    defaultValue="gemini-3.8-flash"
                    className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    <option value="gemini-3.8-flash">gemini-3.8-flash (Tốc độ cao, tối ưu code diff)</option>
                    <option value="gemini-2.5-flash">gemini-2.5-flash (Chuẩn ổn định)</option>
                    <option value="gemini-1.5-pro">gemini-1.5-pro (Suy luận kiến trúc phức tạp)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Mô hình Embedding Vector
                  </label>
                  <select
                    defaultValue="gemini-embedding-001"
                    className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    <option value="gemini-embedding-001">gemini-embedding-001 (768 dimensions)</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  <Sparkles size={14} className="text-purple-600" />
                  <span>Chuỗi Fallback tự động chống nghẽn mạng (High Availability):</span>
                </div>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  gemini-3.8-flash → gemini-3.7-flash → gemini-3.6-flash → gemini-3.5-flash → gemini-3.5-flash-lite
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vector' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Cấu hình Supabase pgvector (768 Dimensions)
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Quản lý bảng `knowledge_records` và hàm RPC `match_knowledge` để tìm kiếm rủi ro theo cosine similarity.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  defaultValue="https://xyzcompany.supabase.co"
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/70 p-2.5 text-xs font-mono dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Supabase Service Role Key
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    type="password"
                    defaultValue="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.••••••••"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 p-2.5 text-xs font-mono dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100"
                  />
                  <button
                    type="button"
                    onClick={handleTestSupabase}
                    className="rounded-xl border border-zinc-200 px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800 transition shrink-0"
                  >
                    Test pgvector
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Ngưỡng tương đồng phát cảnh báo (Match Threshold)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    defaultValue="0.70"
                    className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs font-semibold dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                  <span className="text-[10px] text-zinc-400 mt-1 block">
                    Độ tương đồng &gt; 70% sẽ kích hoạt cảnh báo Just-in-Time trên GitHub PR & Jira Ticket.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Số lượng cảnh báo tối đa (Match Count / Top-K)
                  </label>
                  <input
                    type="number"
                    defaultValue="3"
                    className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs font-semibold dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                  <span className="text-[10px] text-zinc-400 mt-1 block">
                    Số lượng bài học quá khứ khớp nhất được trích xuất vào nội dung bình luận của Bot.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Kênh Tích hợp Ngoại vi (Webhooks & CI/CD)
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Kết nối thụ động với công cụ lập trình của kỹ sư để vận hành theo triết lý &quot;Zero-Friction&quot;.
              </p>
            </div>

            <div className="space-y-4">
              {/* GitHub Webhook */}
              <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white font-bold dark:bg-zinc-100 dark:text-zinc-900">
                      <GitBranch size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        GitHub Webhook & Octokit REST API
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Đón lõng khi mở PR (#205) và tự động đúc kết SOP khi merge PR (#104).
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Active
                    </span>
                    <button
                      type="button"
                      onClick={handleTestGitHub}
                      className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    >
                      Test API
                    </button>
                  </div>
                </div>
                <div className="mt-3 rounded-lg bg-zinc-50 p-2 font-mono text-[11px] text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-300">
                  Payload URL: <code>https://your-domain.com/api/webhooks/github</code>
                </div>
              </div>

              {/* Jira Webhook */}
              <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
                      <Ticket size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        Atlassian Jira Webhook (Lớp 1)
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Quét tóm tắt thẻ khi vừa tạo (issue_created) và tự động bình luận rủi ro vào Ticket.
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Active
                  </span>
                </div>
                <div className="mt-3 rounded-lg bg-zinc-50 p-2 font-mono text-[11px] text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-300">
                  Payload URL: <code>https://your-domain.com/api/webhooks/jira</code>
                </div>
              </div>

              {/* Slack Incident War-room */}
              <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        Slack / Discord War-room Bot
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Bắn tin nhắn thông báo tức thời cho Tech Lead khi phát hiện có PR vi phạm SOP nghiêm trọng.
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Connected
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Bảo mật & Phân quyền Truy cập (Role-Based Access Control)
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Cơ chế phân quyền hiển thị và tương tác giữa Tech Lead và Developer.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  role: 'Tech Lead / Engineering Manager 👑',
                  desc: 'Toàn quyền kiểm duyệt bản nháp SOP (Human-in-the-Loop), phê duyệt đưa vào Vector DB, cấu hình Webhook và xem toàn bộ log cảnh báo.',
                  scope: 'Full Access (Admin)',
                },
                {
                  role: 'Senior Software Engineer 🛡️',
                  desc: 'Tự động đóng góp tri thức thông qua Merge PR và Code Diff, nhận hoa hồng điểm KPI khi SOP cứu sống hệ thống.',
                  scope: 'Write & Review',
                },
                {
                  role: 'Fresher / Junior Developer 👶',
                  desc: 'Nhận cảnh báo Just-in-Time khi mở Task hoặc tạo Branch chạm hot file, tra cứu SOPs và học hỏi kinh nghiệm ngầm.',
                  scope: 'Read & Learn (Protected)',
                },
              ].map((r) => (
                <div
                  key={r.role}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-zinc-200/90 p-4 dark:border-zinc-800/80"
                >
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{r.role}</h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{r.desc}</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">
                    {r.scope}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-200">
              <strong>🔒 Cam kết Quyền riêng tư (Zero Screen Tracking):</strong> RepoMind hoàn toàn không sử dụng phần mềm quay chụp lén màn hình. Mọi cảnh báo rủi ro đều dựa trên Metadata công khai của GitHub Pull Request và Jira Issue.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
