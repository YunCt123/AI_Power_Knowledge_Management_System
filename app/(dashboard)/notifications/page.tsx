'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  MessageSquare,
  Trash2,
  Check,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { toast } from '@/src/store/toast-store';

interface NotificationItem {
  id: string;
  type: 'approval' | 'ai_system' | 'comment' | 'alert';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'approval',
    title: '[Tech Lead Phê duyệt] SOP Sập hệ thống thanh toán do tràn RAM',
    description:
      'Tech Lead Nguyễn Văn A đã kiểm duyệt bản SOP chuẩn và đưa vector 768 chiều vào hệ thống phòng ngự Supabase pgvector.',
    time: '10 phút trước',
    isRead: false,
    link: '/workspace',
  },
  {
    id: 'notif-2',
    type: 'alert',
    title: '[Lớp Phòng Ngự 2 - GitHub Webhook] Cảnh báo đánh chặn PR #205',
    description:
      'Bot RepoMind đã phát hiện PR #205 xóa hàm checkTimeout() ở src/services/payment.ts và bình luận cảnh báo nguy cơ sập cổng thanh toán.',
    time: '35 phút trước',
    isRead: false,
    link: '/workspace',
  },
  {
    id: 'notif-3',
    type: 'ai_system',
    title: '[Lớp Phòng Ngự 1 - Jira Webhook] Đón lõng rủi ro trên thẻ #JIRA-889',
    description:
      'Khi ticket thanh toán giỏ hàng được tạo, AI đã quét ngữ nghĩa và cảnh báo developer về rủi ro OOM trước khi bắt đầu code.',
    time: '1 giờ trước',
    isRead: false,
    link: '/workspace',
  },
  {
    id: 'notif-4',
    type: 'ai_system',
    title: '[GitHub PR #104 Merged] Gemini AI đã đúc kết SOP từ Code Diff',
    description:
      'SeniorDev vừa merge PR hotfix memory leak, Gemini đã tự động phân tích diff patch và tạo bản nháp SOP Root Cause Analysis.',
    time: '3 giờ trước',
    isRead: true,
    link: '/knowledge',
  },
  {
    id: 'notif-5',
    type: 'comment',
    title: '[Hoa Hồng Tri Thức] Bạn nhận được +5 điểm KPI Kudos',
    description:
      'SOP "Xử lý Deadlock PostgreSQL 40P01" của bạn vừa giúp một developer trong team tránh được lỗi sập production trong giờ cao điểm.',
    time: 'Hôm qua',
    isRead: true,
    link: '/team',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('Đã đọc tất cả', 'Tất cả các thông báo đã được đánh dấu là đã đọc.');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.info('Đã dọn sạch thông báo', 'Hộp thư thông báo hiện đang trống.');
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.info('Đã xóa thông báo');
  };

  const filtered = notifications.filter((n) =>
    filter === 'all' ? true : !n.isRead
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 mb-1.5">
            <ShieldAlert size={12} />
            <span>Just-in-Time Warning Stream</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Trung tâm Cảnh báo & Thông báo
          </h1>
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
            Cập nhật diễn biến phê duyệt SOP, thông báo đánh chặn rủi ro tại GitHub & Jira, cùng điểm thưởng hoa hồng tri thức.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition"
            >
              <Check size={14} />
              <span>Đánh dấu tất cả đã đọc</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 shadow-xs hover:bg-red-50 dark:border-red-900/60 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950/30 transition"
            >
              <Trash2 size={14} />
              <span>Xóa tất cả</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-zinc-200 pb-2 text-xs font-medium dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={cn(
            'rounded-lg px-3.5 py-1.5 transition-colors font-semibold',
            filter === 'all'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
          )}
        >
          Tất cả ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 transition-colors font-semibold',
            filter === 'unread'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
          )}
        >
          <span>Chưa đọc</span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-blue-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            Không có thông báo nào trong danh mục này.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleRead(item.id)}
              className={cn(
                'group flex items-start justify-between gap-4 rounded-2xl border p-4 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md',
                !item.isRead
                  ? 'border-blue-200 bg-blue-50/30 dark:border-blue-900/40 dark:bg-blue-950/15'
                  : 'border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900'
              )}
            >
              <div className="flex items-start gap-3.5">
                {/* Icon by Type */}
                <div className="mt-0.5 shrink-0">
                  {item.type === 'alert' && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
                      <AlertTriangle size={18} />
                    </div>
                  )}
                  {item.type === 'approval' && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                      <CheckCircle2 size={18} />
                    </div>
                  )}
                  {item.type === 'ai_system' && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                      <Sparkles size={18} />
                    </div>
                  )}
                  {item.type === 'comment' && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                      <MessageSquare size={18} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {item.title}
                    </h3>
                    {!item.isRead && (
                      <span className="h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {item.description}
                  </p>
                  <span className="text-[11px] text-zinc-400 block pt-1">{item.time}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {item.link && (
                  <a
                    href={item.link}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800 dark:hover:text-blue-400 transition"
                    title="Đi tới chi tiết"
                  >
                    <ExternalLink size={15} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={(e) => deleteNotification(item.id, e)}
                  className="rounded-lg p-1.5 text-zinc-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition"
                  title="Xóa thông báo"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
