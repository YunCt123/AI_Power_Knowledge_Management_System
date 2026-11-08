'use client';

import { useState } from 'react';
import {
  Cpu,
  Database,
  Share2,
  Users,
  Shield,
  Save,
  CheckCircle,
  Key,
  Sliders,
} from 'lucide-react';
import { cn } from '@/src/utils/cn';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'ai' | 'vector' | 'integrations' | 'security'>('ai');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Cài đặt Hệ thống
          </h1>
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
            Quản trị mô hình AI Gemini, cơ sở dữ liệu Vector pgvector và các kênh tích hợp ngoại vi.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          {saved ? (
            <>
              <CheckCircle size={14} className="text-emerald-200" />
              Đã lưu thay đổi
            </>
          ) : (
            <>
              <Save size={14} />
              Lưu cấu hình
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-200 text-xs font-medium dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab('ai')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-4 py-2.5 transition-colors',
            activeTab === 'ai'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
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
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
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
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          )}
        >
          <Share2 size={14} />
          <span>Kênh thu thập (Zalo/Web)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-4 py-2.5 transition-colors',
            activeTab === 'security'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          )}
        >
          <Shield size={14} />
          <span>Bảo mật & Phân quyền</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900">
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Cấu hình Google Gemini AI
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Lựa chọn mô hình ngôn ngữ lớn để trích xuất tri thức từ file ghi âm và trả lời RAG.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Google Gemini API Key
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="password"
                      defaultValue="AIzaSyA8_xxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50/70 py-2 pl-9 pr-4 text-xs font-mono dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100"
                    />
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Kiểm tra kết nối
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Mô hình Chatbot & RAG
                  </label>
                  <select
                    defaultValue="gemini-1.5-flash"
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Phản hồi nhanh, tối ưu chi phí)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Lý luận sâu, biểu đồ Mermaid phức tạp)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Mô hình Embedding (Vector)
                  </label>
                  <select
                    defaultValue="text-embedding-004"
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    <option value="text-embedding-004">text-embedding-004 (768 dimensions)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Temperature (Độ sáng tạo của câu trả lời)
                </label>
                <input type="range" min="0" max="1" step="0.1" defaultValue="0.2" className="mt-2 w-full" />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>0.0 (Chính xác tuyệt đối theo SOP)</span>
                  <span>0.2 (Khuyến nghị cho nhà máy)</span>
                  <span>1.0 (Sáng tạo)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vector' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Cấu hình Supabase pgvector
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Thông số tìm kiếm ngữ nghĩa (Semantic similarity search) trong cơ sở dữ liệu vector.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Ngưỡng tương đồng tối thiểu (Match Threshold)
                </label>
                <input
                  type="number"
                  step="0.05"
                  defaultValue="0.75"
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50/70 p-2 text-xs dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100"
                />
                <span className="text-[10px] text-zinc-400">Khuyến nghị: 0.70 - 0.85 để tránh trả lời lạc đề.</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Số lượng văn bản tương tự lấy ra (Top-K Chunks)
                </label>
                <input
                  type="number"
                  defaultValue="5"
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50/70 p-2 text-xs dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100"
                />
                <span className="text-[10px] text-zinc-400">Số đoạn văn bản đưa vào ngữ cảnh cho Gemini.</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Kênh thu thập Tri thức Ngoại vi
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Kết nối Zalo Mini App và Tiện ích mở rộng trình duyệt (Browser Extension) để nhân sự gửi đóng góp nhanh.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
                      Zalo
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Zalo Mini App Webhook</h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Tự động nhận audio và tin nhắn thoại từ công nhân hiện trường.</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Đang hoạt động
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs">
                      Ext
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Chrome/Edge Extension API</h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Thu thập quy trình thao tác trên các phần mềm Web ERP/MES nội bộ.</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Đang hoạt động
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
                Bảo mật & Phân quyền Truy cập (RBAC)
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Kiểm soát quyền xem các tài liệu bí quyết công nghệ theo cấp bậc nhân viên.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { role: 'Admin Quản trị', desc: 'Toàn quyền cấu hình AI, duyệt tri thức và xem báo cáo ROI.', count: '2 người' },
                { role: 'Chuyên gia Thẩm định (Expert)', desc: 'Thẩm định, hiệu đính nội dung và gắn tag tri thức trước khi vector hóa.', count: '8 người' },
                { role: 'Người đóng góp (Contributor)', desc: 'Gửi file âm thanh, ảnh chụp hiện trường và mẹo vận hành.', count: '45 người' },
                { role: 'Người tra cứu (Viewer)', desc: 'Chỉ tra cứu câu hỏi qua RAG Chatbot và bình chọn hữu ích.', count: '120 người' },
              ].map((r) => (
                <div key={r.role} className="flex items-center justify-between rounded-lg border border-zinc-100 p-3 dark:border-zinc-800/80">
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{r.role}</h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{r.desc}</p>
                  </div>
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
