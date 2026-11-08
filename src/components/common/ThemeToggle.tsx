'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore, type Theme } from '@/src/store/theme-store';
import { cn } from '@/src/lib/utils';

const icons: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const labels: Record<Theme, string> = {
  light: 'Light mode',
  dark: 'Dark mode',
  system: 'System theme',
};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, cycleTheme } = useThemeStore();

  const Icon = icons[theme];
  const label = labels[theme];

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={cn(
        'relative inline-flex h-8 w-8 items-center justify-center rounded-md',
        'text-muted-foreground transition-colors duration-150',
        'hover:bg-surface-hover hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        'cursor-pointer',
        className
      )}
      title={label}
      aria-label={label}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
          transition={{ duration: 0.15, ease: 'easeInOut' }}
          className="inline-flex items-center justify-center"
        >
          <Icon size={16} strokeWidth={1.75} />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
