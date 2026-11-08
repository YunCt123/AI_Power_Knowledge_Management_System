'use client';

import { useState } from 'react';
import {
  GitPullRequest,
  Mic,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  UploadCloud,
  FileAudio,
} from 'lucide-react';
import { cn } from '@/src/utils/cn';

interface Contribution {
  id: string;
  source: 'zalo_mini_app' | 'voice_memo' | 'web_form';
  title: string;
  contributor: {
    name: string;
    department: string;
  };
  submittedAt: string;
  rawContent: string;
  aiExtractedSummary: string;
  suggestedTags: string[];
  status: 'pending' | 'approved' | 'rejected';
}

const MOCK_CONTRIBUTIONS: Contribution[] = [
  {
    id: 'contrib-01',
    source: 'voice_memo',
    title: 'Mẹo khắc phục tình trạng ba via trên phôi nhôm sau khi phay tinh',
    contributor: {
      name: 'Vũ Quốc Khánh',
      department: 'Tổ Cơ khí chính xác',
    },
    submittedAt: '35 phút trước',
    rawContent:
      '[File ghi âm 1m45s]: "Alo anh em, sáng nay chạy dao cầu R3 trên nhôm 6061 hay bị ba via cạnh dưới. Sau khi giảm bước tiến f xuống 80% và tăng lượng thổi khí nén trực tiếp vào góc thoát phôi thì cạnh cắt bóng láng, không còn xước dăm..."',
    aiExtractedSummary:
      'Gemini AI trích xuất: Đối với nhôm 6061 gia công dao cầu R3, khi phát sinh ba via mép dưới: (1) Giảm feed rate xuống 80% (khoảng F=1200mm/min); (2) Tăng áp lực vòi thổi khí trực diện góc thoát phôi.',
    suggestedTags: ['Nhôm 6061', 'Dao phay cầu', 'Ba via', 'Tối ưu feed rate'],
    status: 'pending',
  },
  {
    id: 'contrib-02',
    source: 'zalo_mini_app',
    title: 'Lỗi cảm biến áp suất dầu máy ép thủy lực 500 tấn lúc khởi động lạnh',
    contributor: {
      name: 'Đặng Hoài Nam',
      department: 'Bảo trì Cơ điện',
    },
    submittedAt: '2 giờ trước',
    rawContent:
      '[Gửi từ Zalo Mini App]: "Mỗi sáng mùa đông bật máy ép 500T hay báo lỗi Error 24 (áp suất dầu thấp). Thực ra không phải hỏng bơm, do dầu chưa đủ nhiệt độ làm việc. Anh em chỉ cần cho máy chạy tuần hoàn không tải 5 phút trước khi ép tải là hết."',
    aiExtractedSummary:
      'Gemini AI trích xuất: Error 24 trên máy ép 500T vào đầu ca sáng thường do độ nhớt dầu tăng khi nhiệt độ thấp. Khắc phục: Chạy chu trình tuần hoàn không tải (idling) 5 phút để dầu đạt nhiệt độ công tác 40°C.',
    suggestedTags: ['Máy ép 500T', 'Error 24', 'Áp suất dầu', 'Khởi động lạnh'],
    status: 'pending',
  },
  {
    id: 'contrib-03',
    source: 'web_form',
    title: 'Quy trình hiệu chuẩn thước kẹp điện tử Mitutoyo trước khi đo kiểm mẫu',
    contributor: {
      name: 'Trần Thị Thu',
      department: 'Phòng Quản lý Chất lượng (QC)',
    },
    submittedAt: 'Hôm qua',
    rawContent:
      'Tập hợp các bước vệ sinh mỏ kẹp, kiểm tra độ phẳng bằng kính quang học và cách set Zero đúng lực nén để hạn chế sai số đo giữa các ca.',
    aiExtractedSummary:
      'Gemini AI trích xuất: Quy trình chuẩn 4 bước kiểm tra độ rơ cơ học, vệ sinh bề mặt tiếp xúc bằng cồn 90 độ và kiểm tra khối chuẩn Gauge Block 10mm.',
    suggestedTags: ['Mitutoyo', 'Hiệu chuẩn', 'QC', 'Dụng cụ đo'],
    status: 'pending',
  },
];

export default function ContributionsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'all'>('pending');
  const [contributions, setContributions] = useState(MOCK_CONTRIBUTIONS);

  const handleApprove = (id: string) => {
    setContributions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );
  };

  const handleReject = (id: string) => {
    setContributions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );
  };

  const pendingList = contributions.filter((c) => c.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Duyệt & Đóng góp tri thức
          </h1>
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
            Tri thức thu thập từ Zalo Mini App, Voice Memos và Web Form đang chờ chuyên gia phê duyệt đưa vào Vector DB.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <Mic size={14} className="text-red-500" />
            Tải lên File ghi âm giọng nói
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 text-xs font-medium dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-4 py-2.5 transition-colors',
            activeTab === 'pending'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          )}
        >
          <span>Chờ thẩm định</span>
          <span className="rounded-full bg-blue-100 px-1.5 py-0.2 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            {pendingList.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('approved')}
          className={cn(
            'border-b-2 px-4 py-2.5 transition-colors',
            activeTab === 'approved'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          )}
        >
          Đã phê duyệt
        </button>
      </div>

      {/* List of Contributions */}
      <div className="space-y-4">
        {contributions
          .filter((c) => activeTab === 'all' || c.status === activeTab)
          .map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {item.source === 'voice_memo' && (
                      <span className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:bg-red-950/60 dark:text-red-400">
                        <FileAudio size={12} />
                        Ghi âm giọng nói
                      </span>
                    )}
                    {item.source === 'zalo_mini_app' && (
                      <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                        <MessageSquare size={12} />
                        Zalo Mini App
                      </span>
                    )}
                    <span className="text-[11px] text-zinc-400">• {item.submittedAt}</span>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Đóng góp bởi <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item.contributor.name}</span> ({item.contributor.department})
                  </p>
                </div>

                {item.status === 'pending' ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleReject(item.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <XCircle size={14} />
                      Từ chối
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(item.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-xs"
                    >
                      <CheckCircle size={14} />
                      Duyệt vào Vector DB
                    </button>
                  </div>
                ) : (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                    Đã lưu vào Vector DB
                  </span>
                )}
              </div>

              {/* Raw content & AI summary comparison */}
              <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg bg-zinc-50 p-4 lg:grid-cols-2 dark:bg-zinc-800/40">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Nội dung gốc thu thập
                  </span>
                  <p className="text-xs italic leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {item.rawContent}
                  </p>
                </div>

                <div className="space-y-1 border-t border-zinc-200 pt-3 lg:border-t-0 lg:border-l lg:pl-4 lg:pt-0 dark:border-zinc-700">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    <Sparkles size={12} />
                    <span>Gemini AI chuẩn hóa & cấu trúc</span>
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
    </div>
  );
}
