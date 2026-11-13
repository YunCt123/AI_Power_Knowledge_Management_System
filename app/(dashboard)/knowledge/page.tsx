'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Sparkles,
  ExternalLink,
  Tag,
  CheckCircle2,
  ThumbsUp,
  FileCode2,
  Copy,
  Check,
  X,
  Share2,
} from 'lucide-react';
import { toast } from '@/src/store/toast-store';

export interface KnowledgeItem {
  id: string;
  title: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  updatedAt: string;
  summary: string;
  rootCause: string;
  solution: string;
  hotFiles: string[];
  tags: string[];
  confidence: number;
  helpfulCount: number;
  status: 'verified' | 'ai_extracted' | 'pending';
}

const INITIAL_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: 'kb-01',
    title: 'Sập hệ thống thanh toán do tràn RAM (Memory Leak) luồng giỏ hàng Mega Sale',
    category: 'Payment & Checkout',
    author: {
      name: 'Nguyễn Văn A',
      avatar: 'NA',
      role: 'Tech Lead / System Architect',
    },
    updatedAt: '15 phút trước',
    summary:
      'Hàm xử lý tính tiền không giải phóng bộ nhớ (memory leak) khi lặp qua hàng ngàn sản phẩm trong giỏ hàng. Cần bổ sung cơ chế phân trang và giữ nguyên hàm checkTimeout() ở dòng 45.',
    rootCause:
      'Hàm processCartPayment lặp for-loop qua 10,000 giỏ hàng cùng lúc và lưu toàn bộ order detail object vào RAM Node.js mà không garbage collect, cộng thêm kết nối socket cổng thanh toán không timeout dẫn đến OOM crash.',
    solution:
      'Bổ sung phân trang batching (100 items/lượt), clear cache Redis sau mỗi lượt lặp. Tuyệt đối KHÔNG xóa checkTimeout() ở dòng 45 để tránh giữ socket vĩnh viễn.',
    hotFiles: ['src/services/payment.ts', 'src/api/cart.controller.ts'],
    tags: ['Payment', 'Memory Leak', 'Redis', 'Critical SOP', 'Zero-Downtime'],
    confidence: 99,
    helpfulCount: 142,
    status: 'verified',
  },
  {
    id: 'kb-02',
    title: 'Lỗi Race Condition trừ tồn kho âm khi nhiều người cùng bấm Mua Flash Sale',
    category: 'Database & Concurrency',
    author: {
      name: 'Trần Quốc Bảo',
      avatar: 'TB',
      role: 'Senior Backend Engineer',
    },
    updatedAt: 'Hôm qua',
    summary:
      'Câu lệnh UPDATE inventory SET stock = stock - 1 thiếu khóa hàng (Locking), dẫn đến việc bán vượt 120 đơn khi kho chỉ còn đúng 10 sản phẩm trong 3 giây mở bán.',
    rootCause:
      'Sử dụng Read-Modify-Write không có transaction khóa bi quan (SELECT FOR UPDATE) hoặc lạc quan (WHERE version = current_version). Nhiều transaction đọc cùng stock = 10 và cùng ghi đè.',
    solution:
      'Bắt buộc dùng SELECT FOR UPDATE trong transaction hoặc lệnh nguyên tử: UPDATE products SET stock = stock - quantity WHERE id = :id AND stock >= quantity RETURNING stock;',
    hotFiles: ['src/services/inventory.service.ts', 'src/repositories/product.repo.ts'],
    tags: ['PostgreSQL', 'Race Condition', 'Flash Sale', 'Pessimistic Lock'],
    confidence: 98,
    helpfulCount: 118,
    status: 'verified',
  },
  {
    id: 'kb-03',
    title: 'Mất tín hiệu Stripe Webhook do thiếu Idempotency Key & Retry Handling',
    category: 'API & Integrations',
    author: {
      name: 'Lê Hoàng Long',
      avatar: 'LL',
      role: 'Fullstack & Integrations Lead',
    },
    updatedAt: '2 ngày trước',
    summary:
      'Khi mạng chập chờn, Stripe bắn retry webhook 3 lần khiến tài khoản người dùng bị kích hoạt gói 2 lần và ghi trùng 2 hóa đơn vào cơ sở dữ liệu.',
    rootCause:
      'Endpoint webhook không lưu trữ event.id đã xử lý và xử lý bất đồng bộ trước khi xác thực chữ ký stripe-signature qua raw body buffer.',
    solution:
      'Lưu event.id vào Redis với TTL 24h (SET NX EX 86400). Kiểm tra trùng lặp trước khi kích hoạt dịch vụ, và luôn đối soát stripe.webhooks.constructEvent bằng raw body.',
    hotFiles: ['src/api/webhooks/stripe/route.ts', 'src/services/billing.ts'],
    tags: ['Stripe', 'Webhook', 'Idempotency', 'Security', 'Billing'],
    confidence: 96,
    helpfulCount: 95,
    status: 'verified',
  },
  {
    id: 'kb-04',
    title: 'Treo kết nối Pool Database (PostgreSQL) do quên giải phóng Client trong khối finally',
    category: 'Database & Concurrency',
    author: {
      name: 'Phạm Minh Tuấn',
      avatar: 'PT',
      role: 'DevOps & SRE Lead',
    },
    updatedAt: '4 ngày trước',
    summary:
      'Hệ thống bị sập vào giờ cao điểm với lỗi "timeout: connection pool exhausted". Nguyên nhân do query lỗi nhảy vào catch mà không gọi client.release().',
    rootCause:
      'Kỹ sư gọi const client = await pool.connect(); nhưng không bọc khối lệnh trong try...finally { client.release(); }. Khi query ném ngoại lệ, client bị rò rỉ mãi mãi.',
    solution:
      'Luôn luôn đặt client.release() vào khối finally, hoặc sử dụng pool.query() trực tiếp cho các tác vụ đơn lẻ không cần multi-statement transaction.',
    hotFiles: ['src/lib/db-pool.ts', 'src/middleware/analytics.ts'],
    tags: ['PostgreSQL', 'Connection Pool', 'DevOps', 'Prisma/pg'],
    confidence: 97,
    helpfulCount: 87,
    status: 'verified',
  },
  {
    id: 'kb-05',
    title: 'Lỗi Hydration Mismatch & vỡ giao diện trong Next.js do đọc localStorage khi SSR',
    category: 'Frontend & Architecture',
    author: {
      name: 'Đặng Thu Thảo',
      avatar: 'DT',
      role: 'Senior Frontend Engineer',
    },
    updatedAt: '5 ngày trước',
    summary:
      'Đọc window.localStorage hoặc document.cookie trực tiếp trong render body của Client Component gây sai lệch cây DOM giữa Server và Hydration Client.',
    rootCause:
      'Server render giá trị mặc định, trong khi Client render giá trị đọc từ localStorage, React 19 phát hiện TextContent mismatch và hủy bỏ quá trình selective hydration.',
    solution:
      'Sử dụng useSyncExternalStore với hàm getSnapshot và getServerSnapshot trả về giá trị đồng nhất, hoặc bọc việc truy xuất storage trong hook useMounted().',
    hotFiles: ['src/components/layout/Header.tsx', 'src/hooks/useUserTheme.ts'],
    tags: ['Next.js 16', 'React 19', 'Hydration Mismatch', 'SSR'],
    confidence: 95,
    helpfulCount: 76,
    status: 'verified',
  },
  {
    id: 'kb-06',
    title: 'Lỗi bảo mật SSRF (Server-Side Request Forgery) khi tải ảnh đại diện qua URL',
    category: 'Security & Compliance',
    author: {
      name: 'Vũ Đình Khoa',
      avatar: 'VK',
      role: 'Security Specialist',
    },
    updatedAt: '1 tuần trước',
    summary:
      'API tải ảnh đại diện từ URL người dùng cho phép kẻ tấn công truyền địa chỉ IP mạng nội bộ 169.254.169.254 để đánh cắp AWS IAM credentials.',
    rootCause:
      'Hàm downloadImage(url) không kiểm tra hostname và phân giải IP trước khi fetch. Kẻ tấn công khai thác địa chỉ loopback và private subnet RFC 1918.',
    solution:
      'Triển khai DNS resolve kiểm tra IP đích không thuộc các dải private (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16) và chặn chuyển hướng redirect tới IP nội bộ.',
    hotFiles: ['src/services/image-uploader.ts', 'src/api/user/avatar/route.ts'],
    tags: ['Security', 'SSRF', 'OWASP Top 10', 'API Protection'],
    confidence: 96,
    helpfulCount: 64,
    status: 'verified',
  },
];

export default function KnowledgePage() {
  const [items, setItems] = useState<KnowledgeItem[]>(INITIAL_KNOWLEDGE);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<KnowledgeItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New SOP Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Payment & Checkout');
  const [newSummary, setNewSummary] = useState('');
  const [newRootCause, setNewRootCause] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newHotFiles, setNewHotFiles] = useState('src/services/payment.ts');
  const [newTags, setNewTags] = useState('SOP, Hotfix, Core');

  const filteredItems = items.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(term) ||
      item.summary.toLowerCase().includes(term) ||
      item.hotFiles.some((f) => f.toLowerCase().includes(term)) ||
      item.tags.some((tag) => tag.toLowerCase().includes(term));
    const matchesCat =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleVoteHelpful = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, helpfulCount: item.helpfulCount + 1 } : item
      )
    );
    if (activeItem?.id === id) {
      setActiveItem((prev) => (prev ? { ...prev, helpfulCount: prev.helpfulCount + 1 } : null));
    }
    toast.success('Cảm ơn bạn đã phản hồi!', 'Đánh giá hữu ích đã được cộng vào điểm KPI tri thức của tác giả.');
  };

  const handleCopySOP = (item: KnowledgeItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const content = `[RepoMind SOP] ${item.title}\nDanh mục: ${item.category}\nHot Files: ${item.hotFiles.join(', ')}\nNguyên nhân: ${item.rootCause}\nGiải pháp: ${item.solution}`;
    navigator.clipboard.writeText(content);
    setCopiedId(item.id);
    toast.success('Đã sao chép SOP!', 'Nội dung quy trình xử lý đã được lưu vào clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateSOP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSolution.trim()) {
      toast.warning('Vui lòng điền đủ thông tin', 'Tiêu đề và Giải pháp là bắt buộc.');
      return;
    }

    const newItem: KnowledgeItem = {
      id: `kb-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      author: {
        name: 'Nguyễn Văn A (Bạn)',
        avatar: 'NA',
        role: 'Tech Lead / Admin',
      },
      updatedAt: 'Vừa xong',
      summary: newSummary || newSolution.slice(0, 120),
      rootCause: newRootCause || 'Đang cập nhật phân tích nguyên nhân gốc rễ...',
      solution: newSolution,
      hotFiles: newHotFiles.split(',').map((f) => f.trim()).filter(Boolean),
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      confidence: 98,
      helpfulCount: 1,
      status: 'verified',
    };

    setItems([newItem, ...items]);
    setShowAddModal(false);
    // Reset form
    setNewTitle('');
    setNewSummary('');
    setNewRootCause('');
    setNewSolution('');
    toast.success(
      'Đã thêm tri thức mới vào Vector DB!',
      `SOP "${newItem.title}" đã được nạp thành công vào hệ thống phòng ngự.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 mb-1.5">
            <CheckCircle2 size={12} />
            <span>Kho Tri Thức Ngầm Đã Vector Hóa (pgvector 768d)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Kho tri thức SOP & Root Cause Analysis
          </h1>
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
            Đúc kết tự động từ GitHub PRs, War-room Post-mortems và kinh nghiệm của các kỹ sư cốt cán.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              toast.info(
                'Semantic RAG Assistant',
                'Hệ thống đang hỗ trợ truy vấn tự nhiên: "Cách xử lý lỗi tràn RAM ở payment.ts" hoặc "Trừ tồn kho âm"'
              );
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition"
          >
            <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span>Hỏi trợ lý RAG</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition active:scale-98"
          >
            <Plus size={14} />
            <span>Đóng góp SOP mới</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200/90 bg-white p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800/90 dark:bg-zinc-900">
        <div className="relative flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tiêu đề lỗi, file nhạy cảm (payment.ts), mã lỗi (40P01) hoặc tag..."
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 py-2 pl-9 pr-4 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-zinc-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            <option value="all">Tất cả danh mục IT ({items.length})</option>
            <option value="Payment & Checkout">Payment & Checkout</option>
            <option value="Database & Concurrency">Database & Concurrency</option>
            <option value="API & Integrations">API & Integrations</option>
            <option value="Frontend & Architecture">Frontend & Architecture</option>
            <option value="Security & Compliance">Security & Compliance</option>
          </select>
        </div>
      </div>

      {/* Knowledge Items Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="group flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-5 transition-all duration-200 hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800/80 cursor-pointer"
          >
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    {item.category}
                  </span>
                  {item.status === 'verified' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={12} />
                      Đã kiểm duyệt
                    </span>
                  )}
                  {item.status === 'ai_extracted' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-600 dark:text-purple-400">
                      <Sparkles size={12} />
                      AI đúc kết
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  <span>{item.confidence}% tin cậy</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="mt-3 text-base font-bold leading-snug text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400 transition-colors">
                {item.title}
              </h2>

              {/* Hot Files Badges */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-semibold uppercase text-zinc-400">Hot Files:</span>
                {item.hotFiles.map((file) => (
                  <span
                    key={file}
                    className="inline-flex items-center gap-1 rounded bg-rose-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                  >
                    <FileCode2 size={10} />
                    {file}
                  </span>
                ))}
              </div>

              {/* Summary */}
              <p className="mt-2.5 text-xs leading-relaxed text-zinc-600 line-clamp-3 dark:text-zinc-400">
                {item.summary}
              </p>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer with Author and Useful count */}
            <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                  {item.author.avatar}
                </div>
                <div>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {item.author.name}
                  </span>
                  <span className="text-zinc-400"> • {item.updatedAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleVoteHelpful(item.id, e)}
                  title="Bình chọn hữu ích"
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-zinc-600 hover:bg-zinc-100 hover:text-blue-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-blue-400 transition"
                >
                  <ThumbsUp size={12} />
                  <span>{item.helpfulCount}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleCopySOP(item, e)}
                  title="Sao chép nội dung SOP"
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition"
                >
                  {copiedId === item.id ? (
                    <Check size={14} className="text-emerald-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveItem(item)}
                  title="Xem chi tiết"
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800 dark:hover:text-blue-400 transition"
                >
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL / DRAWER */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <div>
                <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {activeItem.category}
                </span>
                <h3 className="mt-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {activeItem.title}
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Tác giả: <strong>{activeItem.author.name}</strong> ({activeItem.author.role}) • Cập nhật: {activeItem.updatedAt}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                aria-label="Đóng chi tiết"
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Hot Files */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Các file nhạy cảm cần cảnh báo (Hot Files):
              </label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {activeItem.hotFiles.map((file) => (
                  <code
                    key={file}
                    className="rounded-md bg-rose-50 px-2.5 py-1 font-mono text-xs font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40"
                  >
                    {file}
                  </code>
                ))}
              </div>
            </div>

            {/* Root Cause */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                🧠 Phân tích nguyên nhân gốc rễ (Root Cause):
              </h4>
              <p className="mt-1.5 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                {activeItem.rootCause}
              </p>
            </div>

            {/* Solution */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                💡 Quy trình chuẩn & Giải pháp bắt buộc (SOP Solution):
              </h4>
              <p className="mt-1.5 text-sm font-medium text-emerald-950 dark:text-emerald-200 leading-relaxed whitespace-pre-wrap">
                {activeItem.solution}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => handleVoteHelpful(activeItem.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                <ThumbsUp size={14} className="text-blue-600" />
                <span>Hữu ích ({activeItem.helpfulCount})</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopySOP(activeItem)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  <Copy size={13} />
                  <span>Sao chép toàn bộ SOP</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Đã sao chép liên kết!', 'Link tài liệu tri thức đã lưu vào clipboard.');
                  }}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
                  title="Chia sẻ link"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW SOP MODAL */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Đóng góp Tri thức SOP Mới vào Vector DB
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

            <form onSubmit={handleCreateSOP} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Tiêu đề sự cố / Tri thức (Title):
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lỗi Deadlock khi cập nhật đồng thời đơn hàng và ví điện tử"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 p-2.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Danh mục hệ thống:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 p-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  >
                    <option value="Payment & Checkout">Payment & Checkout</option>
                    <option value="Database & Concurrency">Database & Concurrency</option>
                    <option value="API & Integrations">API & Integrations</option>
                    <option value="Frontend & Architecture">Frontend & Architecture</option>
                    <option value="Security & Compliance">Security & Compliance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Hot Files (cách nhau dấu phẩy):
                  </label>
                  <input
                    type="text"
                    placeholder="src/services/order.ts, src/api/payment.ts"
                    value={newHotFiles}
                    onChange={(e) => setNewHotFiles(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 p-2 font-mono text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nguyên nhân gốc rễ (Root Cause):
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả lý do kỹ thuật dẫn đến lỗi..."
                  value={newRootCause}
                  onChange={(e) => setNewRootCause(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 p-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                  Giải pháp & Hướng dẫn bắt buộc (SOP Solution):
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Các bước khắc phục cụ thể, dòng code cần lưu ý..."
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                  className="w-full rounded-lg border border-emerald-300 p-2 text-xs text-zinc-900 dark:border-emerald-800 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Tags (cách nhau dấu phẩy):
                </label>
                <input
                  type="text"
                  placeholder="PostgreSQL, Deadlock, Critical, SOP"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 p-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
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
                  Duyệt & Lưu vào Vector DB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
