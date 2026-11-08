'use client';

import { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  MessageSquare,
  Trash2,
  Check,
} from 'lucide-react';
import { cn } from '@/src/utils/cn';

interface NotificationItem {
  id: string;
  type: 'approval' | 'ai_system' | 'comment' | 'alert';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'approval',
    title: 'Tri thức đã được phê duyệt thành công',
    description:
      'Bài đóng góp "Quy trình xử lý sự cố kẹt phôi tự động trên chuyền dập CNC" của bạn đã được Admin thẩm định và vector hóa vào Supabase pgvector.',
    time: '15 phút trước',
    isRead: false,
  },
  {
    id: 'notif-2',
    type: 'ai_system',
    title: 'Gemini AI hoàn tất trích xuất 5 file ghi âm',
    description:
      '5 file ghi âm giọng nói từ ca làm việc đêm qua đã được chuyển đổi thành văn bản và phân loại vào mục SOP Vận hành.',
    time: '1 giờ trước',
    isRead: false,
  },
  {
    id: 'notif-3',
    type: 'comment',
    title: 'Kỹ sư trưởng Trần Minh Đức vừa phản hồi',
    description:
      'Đã bổ sung lưu ý về nhiệt độ dầu thủy lực vào tài liệu "Kinh nghiệm căn chỉnh độ nhớt dung dịch làm mát".',
    time: '3 giờ trước',
    isRead: false,
  },
  {
    id: 'notif-4',
    type: 'alert',
    title: 'Cảnh báo: Tri thức hết hạn kiểm định',
    description:
      'Tài liệu "Tiêu chuẩn kiểm định bình áp lực khí nén P-201" đã quá hạn 12 tháng, cần chuyên gia rà soát lại.',
    time: 'Hôm qua',
    isRead: true,
  },
  {
    id: 'notif-5',
    type: 'approval',
    title: 'Đề xuất tri thức mới cần bạn thẩm định',
    description:
      'Có 3 đề xuất tri thức mới thuộc phân xưởng Đúc kim loại đang chờ bạn đánh giá tính thực tiễn.',
    time: '2 ngày trước',
    isRead: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const filtered = notifications.filter((n) =>
    filter === 'all' ? true : !n.isRead
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Trung tâm thông báo
          </h1>
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
            Cập nhật diễn biến phê duyệt tri thức, cảnh báo vận hành và phản hồi từ đồng nghiệp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <Check size={14} />
              Đánh dấu tất cả đã đọc
            </button>
          )}
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 shadow-xs hover:bg-red-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <Trash2 size={14} />
              Xóa tất cả
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
            'rounded-lg px-3 py-1.5 transition-colors',
            filter === 'all'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
          )}
        >
          Tất cả ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={cn(
            'rounded-lg px-3 py-1.5 transition-colors',
            filter === 'unread'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
          )}
        >
          Chưa đọc ({unreadCount})
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 p-12 text-center text-xs text-zinc-400 dark:border-zinc-800">
            Không có thông báo nào trong mục này.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleRead(item.id)}
              className={cn(
                'group flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all duration-150',
                item.isRead
                  ? 'border-zinc-200/60 bg-white/60 dark:border-zinc-800/60 dark:bg-zinc-900/40 opacity-75'
                  : 'border-blue-200 bg-white shadow-xs dark:border-blue-900/60 dark:bg-zinc-900'
              )}
            >
              {/* Type Icon */}
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white shadow-xs',
                  item.type === 'approval' && 'bg-emerald-600',
                  item.type === 'ai_system' && 'bg-indigo-600',
                  item.type === 'comment' && 'bg-blue-600',
                  item.type === 'alert' && 'bg-amber-600'
                )}
              >
                {item.type === 'approval' && <CheckCircle2 size={18} />}
                {item.type === 'ai_system' && <Sparkles size={18} />}
                {item.type === 'comment' && <MessageSquare size={18} />}
                {item.type === 'alert' && <AlertTriangle size={18} />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3
                    className={cn(
                      'text-sm font-semibold leading-tight text-zinc-900 dark:text-zinc-100',
                      !item.isRead && 'font-bold'
                    )}
                  >
                    {item.title}
                  </h3>
                  <span className="text-[11px] text-zinc-400 shrink-0 ml-2">{item.time}</span>
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Status Dot */}
              {!item.isRead && (
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
