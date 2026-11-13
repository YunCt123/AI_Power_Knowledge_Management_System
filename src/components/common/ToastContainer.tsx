'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  ExternalLink,
} from 'lucide-react';
import { useToastStore, ToastItem, ToastType } from '@/src/store/toast-store';
import { cn } from '@/src/utils/cn';

const TOAST_ICONS: Record<ToastType, React.ElementType> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const TOAST_STYLES: Record<
  ToastType,
  {
    iconClass: string;
    badgeBg: string;
    borderClass: string;
    progressClass: string;
  }
> = {
  success: {
    iconClass: 'text-emerald-500 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    borderClass: 'border-emerald-200/80 dark:border-emerald-800/60',
    progressClass: 'bg-emerald-500',
  },
  error: {
    iconClass: 'text-rose-500 dark:text-rose-400',
    badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
    borderClass: 'border-rose-200/80 dark:border-rose-800/60',
    progressClass: 'bg-rose-500',
  },
  warning: {
    iconClass: 'text-amber-500 dark:text-amber-400',
    badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    borderClass: 'border-amber-200/80 dark:border-amber-800/60',
    progressClass: 'bg-amber-500',
  },
  info: {
    iconClass: 'text-blue-500 dark:text-blue-400',
    badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
    borderClass: 'border-blue-200/80 dark:border-blue-800/60',
    progressClass: 'bg-blue-500',
  },
};

function ToastMessage({ toast }: { toast: ToastItem }) {
  const { removeToast } = useToastStore();
  const [isPaused, setIsPaused] = useState(false);
  const duration = toast.duration ?? 4500;
  const style = TOAST_STYLES[toast.type];
  const IconComponent = TOAST_ICONS[toast.type];

  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, duration, isPaused, removeToast]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
      aria-live="polite"
      className={cn(
        'pointer-events-auto relative overflow-hidden rounded-xl border bg-white/95 p-4 shadow-lg backdrop-blur-md dark:bg-zinc-900/95',
        'w-full max-w-sm sm:max-w-md',
        style.borderClass
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="shrink-0 pt-0.5">
          <IconComponent className={cn('h-5 w-5', style.iconClass)} aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 leading-tight">
            {toast.title}
          </p>
          {toast.message && (
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed break-words whitespace-pre-wrap">
              {toast.message}
            </p>
          )}

          {toast.action && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick();
                  removeToast(toast.id);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <span>{toast.action.label}</span>
                <ExternalLink size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => removeToast(toast.id)}
          aria-label="Đóng thông báo"
          className="shrink-0 -mr-1 -mt-1 rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      {/* Progress bar countdown */}
      {duration > 0 && !isPaused && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={cn('absolute bottom-0 left-0 h-1 opacity-70', style.progressClass)}
        />
      )}
    </motion.div>
  );
}

export function ToastContainer() {
  const { toasts } = useToastStore();

  return (
    <div
      aria-label="Thông báo hệ thống"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 pointer-events-none p-2 sm:p-0 max-w-full"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((item) => (
          <ToastMessage key={item.id} toast={item} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ToastContainer;
