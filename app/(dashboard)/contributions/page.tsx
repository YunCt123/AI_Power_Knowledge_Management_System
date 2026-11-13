'use client';

import { useState } from 'react';
import {
  Mic,
  MessageSquare,
  CheckCircle,
  XCircle,
  Sparkles,
  FileCode2,
  GitMerge,
  FileAudio,
  X,
} from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { toast } from '@/src/store/toast-store';

interface Contribution {
  id: string;
  source: 'github_pr' | 'voice_memo' | 'war_room' | 'jira_issue';
  title: string;
  contributor: {
    name: string;
    department: string;
  };
  submittedAt: string;
  rawContent: string;
  aiExtractedSummary: string;
  suggestedTags: string[];
  hotFiles?: string[];
  status: 'pending' | 'approved' | 'rejected';
}

const INITIAL_CONTRIBUTIONS: Contribution[] = [
  {
    id: 'contrib-01',
    source: 'github_pr',
    title: 'Hotfix: Tràn RAM ở luồng thanh toán giỏ hàng (PR #104 Merged)',
    contributor: {
      name: 'Nguyễn Văn A',
      department: 'Tech Lead / Backend',
    },
    submittedAt: '25 phút trước',
    rawContent:
      '[GitHub PR #104 Code Diff]: "@@ -42,6 +42,9 @@ export async function processCartPayment(items) {\n+  await clearRedisBatchCache();\n+  checkTimeout(); // Cấm xóa dòng này để tránh treo socket cổng thanh toán\n   return paginateCalculation(items, 100);\n }"\nPR Body: "Fix lỗi memory leak khi tính tổng tiền giỏ hàng lớn ngày Mega Sale."',
    aiExtractedSummary:
      'Gemini AI trích xuất SOP: Hàm processCartPayment() lặp qua hàng ngàn item giỏ hàng không giải phóng bộ nhớ. Khắc phục: Phân trang 100 items/batch, clear cache Redis sau mỗi lượt lặp và giữ nguyên checkTimeout() ở dòng 45 để chống treo socket.',
    suggestedTags: ['src/services/payment.ts', 'Memory Leak', 'Redis', 'Critical SOP'],
    hotFiles: ['src/services/payment.ts', 'src/api/cart.controller.ts'],
    status: 'pending',
  },
  {
    id: 'contrib-02',
    source: 'war_room',
    title: 'Post-mortem: Deadlock 40P01 khi đồng thời cộng điểm tích lũy và duyệt đơn hàng',
    contributor: {
      name: 'Trần Quốc Bảo',
      department: 'Database & Backend',
    },
    submittedAt: '2 giờ trước',
    rawContent:
      '[Ghi nhận từ War-room Slack #incident-prod]: "Tx 1 khóa bảng orders rồi update user_points; Tx 2 khóa user_points rồi update orders. Khi lưu lượng vượt 2,000 req/s thì dính deadlock 40P01 hàng loạt. Anh em thống nhất thứ tự: Luôn lock User trước, Orders sau!"',
    aiExtractedSummary:
      'Gemini AI trích xuất SOP: Để triệt tiêu hoàn toàn lỗi Deadlock 40P01 trong PostgreSQL, mọi transaction đa bảng phải tuân thủ thứ tự khóa thống nhất: (1) SELECT FOR UPDATE trên bảng Users; (2) Thực hiện ghi trên bảng Orders.',
    suggestedTags: ['PostgreSQL', 'Deadlock 40P01', 'Transactions', 'Lock Ordering'],
    hotFiles: ['src/services/order.ts', 'src/repositories/user-points.repo.ts'],
    status: 'pending',
  },
  {
    id: 'contrib-03',
    source: 'voice_memo',
    title: 'Kinh nghiệm xử lý mất webhook Stripe khi khách thanh toán qua ZaloPay/Apple Pay',
    contributor: {
      name: 'Lê Hoàng Long',
      department: 'Fullstack & Integrations',
    },
    submittedAt: 'Hôm qua',
    rawContent:
      '[Voice Memo 1m12s từ Tech Lead]: "Hôm qua bên mình bị sót mấy đơn của khách do mạng nhà mạng chập chờn, Stripe retry 3 lần thì hệ thống lại kích hoạt gói 2 lần. Cần thêm cơ chế Idempotency Key bằng Redis SETNX và xác thực chữ ký stripe-signature bằng raw body buffer."',
    aiExtractedSummary:
      'Gemini AI trích xuất SOP: Bắt buộc dùng Redis Idempotency Key với TTL 24h cho mọi webhook tài chính. Luôn đọc raw body buffer trước khi phân tích JSON để xác minh chữ ký HMAC SHA-256.',
    suggestedTags: ['Stripe', 'Idempotency', 'Redis', 'Webhooks'],
    hotFiles: ['src/api/webhooks/stripe/route.ts'],
    status: 'pending',
  },
  {
    id: 'contrib-04',
    source: 'jira_issue',
    title: 'Tối ưu N+1 Query làm nghẽn trang Danh sách Đơn hàng của Admin (JIRA-742)',
    contributor: {
      name: 'Đặng Thu Thảo',
      department: 'Frontend & Architecture',
    },
    submittedAt: '3 ngày trước',
    rawContent:
      '[Jira Ticket #742]: "Vòng lặp map() trên client gọi query riêng lẻ để lấy chi tiết 100 sản phẩm. Đã chuyển sang dùng relation include trong Prisma, giảm thời gian phản hồi từ 4.2s xuống 80ms."',
    aiExtractedSummary:
      'Gemini AI trích xuất SOP: Cấm tuyệt đối lazy-fetching trong vòng lặp lồng. Phải dùng batch relation include hoặc GraphQL query tối ưu.',
    suggestedTags: ['ORM', 'Prisma', 'N+1 Problem', 'Performance'],
    hotFiles: ['src/api/orders/list/route.ts'],
    status: 'approved',
  },
];

export default function ContributionsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'all'>('pending');
  const [contributions, setContributions] = useState(INITIAL_CONTRIBUTIONS);
  const [showAddModal, setShowAddModal] = useState(false);

  // New voice memo / manual contribution state
  const [newTitle, setNewTitle] = useState('');
  const [newRawText, setNewRawText] = useState('');

  const handleApprove = (id: string) => {
    const item = contributions.find((c) => c.id === id);
    setContributions((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: 'approved' } : it))
    );
    toast.success(
      'Đã duyệt vào Vector DB!',
      `Tri thức "${item?.title || 'SOP'}" đã được băm thành vector 768 chiều và lưu trữ thành công.`
    );
  };

  const handleReject = (id: string) => {
    setContributions((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: 'rejected' } : it))
    );
    toast.info('Đã từ chối bài đóng góp', 'Đóng góp này đã bị loại bỏ khỏi hàng chờ kiểm duyệt.');
  };

  const handleCreateMockMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newRawText.trim()) {
      toast.warning('Vui lòng điền đủ tiêu đề và nội dung');
      return;
    }

    const newItem: Contribution = {
      id: `contrib-${Date.now()}`,
      source: 'voice_memo',
      title: newTitle,
      contributor: {
        name: 'Trần Minh Khôi (Fresher)',
        department: 'Software Engineering',
      },
      submittedAt: 'Vừa xong',
      rawContent: `[Voice Note]: "${newRawText}"`,
      aiExtractedSummary: `Gemini AI đã tự động chuẩn hóa: Đối với sự cố "${newTitle}", các kỹ sư cần thực hiện đúng quy trình kiểm thử và rà soát các file liên quan trước khi triển khai.`,
      suggestedTags: ['Voice Memo', 'Gemini AI', 'Tacit Knowledge'],
      hotFiles: ['src/services/core.ts'],
      status: 'pending',
    };

    setContributions([newItem, ...contributions]);
    setShowAddModal(false);
    setNewTitle('');
    setNewRawText('');
    toast.success('Đã nạp Voice Memo!', 'Gemini AI đã phân tích và tạo bản tóm tắt SOP đang chờ Tech Lead duyệt.');
  };

  const pendingList = contributions.filter((c) => c.status === 'pending');
  const approvedList = contributions.filter((c) => c.status === 'approved');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-0.5 text-xs font-semibold text-purple-700 dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-300 mb-1.5">
            <GitMerge size={12} />
            <span>Human-in-the-Loop Approval Queue (Luồng 2)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Duyệt & Đóng góp tri thức ngầm
          </h1>
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
            Tri thức được AI tự động đúc kết từ GitHub Code Diffs, Slack War-room và Voice Memos đang chờ Tech Lead phê duyệt.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition"
          >
            <Mic size={14} className="text-red-500" />
            <span>Tải lên Incident Voice Memo</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 text-xs font-semibold dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-4 py-2.5 transition-colors',
            activeTab === 'pending'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-bold'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          )}
        >
          <span>Chờ Tech Lead duyệt</span>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            {pendingList.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('approved')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-4 py-2.5 transition-colors',
            activeTab === 'approved'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-bold'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          )}
        >
          <span>Đã lưu vào Vector DB</span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {approvedList.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={cn(
            'border-b-2 px-4 py-2.5 transition-colors',
            activeTab === 'all'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-bold'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          )}
        >
          Tất cả ({contributions.length})
        </button>
      </div>

      {/* List of Contributions */}
      <div className="space-y-4">
        {contributions
          .filter((c) => activeTab === 'all' || c.status === activeTab)
          .map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {item.source === 'github_pr' && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                        <GitMerge size={12} />
                        GitHub PR Merged
                      </span>
                    )}
                    {item.source === 'war_room' && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                        <MessageSquare size={12} />
                        Slack War-room
                      </span>
                    )}
                    {item.source === 'voice_memo' && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                        <FileAudio size={12} />
                        Voice Memo
                      </span>
                    )}
                    {item.source === 'jira_issue' && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        <MessageSquare size={12} />
                        Jira Post-mortem
                      </span>
                    )}
                    <span className="text-[11px] text-zinc-400">• {item.submittedAt}</span>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Người phụ trách:{' '}
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {item.contributor.name}
                    </span>{' '}
                    ({item.contributor.department})
                  </p>
                </div>

                {item.status === 'pending' ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleReject(item.id)}
                      className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950/30 transition"
                    >
                      <XCircle size={14} />
                      Từ chối
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(item.id)}
                      className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-xs transition active:scale-98"
                    >
                      <CheckCircle size={14} />
                      Duyệt vào Vector DB
                    </button>
                  </div>
                ) : (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                    ✅ Đã lưu vào Vector DB
                  </span>
                )}
              </div>

              {/* Hot Files */}
              {item.hotFiles && item.hotFiles.length > 0 && (
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase">Hot Files:</span>
                  {item.hotFiles.map((f) => (
                    <code
                      key={f}
                      className="inline-flex items-center gap-1 rounded bg-rose-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                    >
                      <FileCode2 size={10} />
                      {f}
                    </code>
                  ))}
                </div>
              )}

              {/* Raw content & AI summary comparison */}
              <div className="mt-4 grid grid-cols-1 gap-4 rounded-xl bg-zinc-50 p-4 lg:grid-cols-2 dark:bg-zinc-800/40">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Nội dung gốc (Code Diff / Audio Transcribe)
                  </span>
                  <p className="font-mono text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                    {item.rawContent}
                  </p>
                </div>

                <div className="space-y-1 border-t border-zinc-200 pt-3 lg:border-t-0 lg:border-l lg:pl-4 lg:pt-0 dark:border-zinc-700">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    <Sparkles size={12} />
                    <span>Gemini AI đúc kết SOP Root Cause</span>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
                    {item.aiExtractedSummary}
                  </p>
                </div>
              </div>

              {/* Suggested Tags */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-zinc-400">Tags đề xuất:</span>
                {item.suggestedTags.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Add Voice Memo Modal */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-red-500" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                  Nạp Voice Memo / Ghi Chú Sự Cố
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateMockMemo} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Tiêu đề tóm tắt:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lưu ý khi deploy Redis cluster trong ngày sale"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nội dung ghi âm giọng nói / đoạn chat:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ví dụ: Khi đổi cấu hình master-slave Redis nhớ set timeout = 3000ms..."
                  value={newRawText}
                  onChange={(e) => setNewRawText(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Gửi AI phân tích & tạo SOP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
