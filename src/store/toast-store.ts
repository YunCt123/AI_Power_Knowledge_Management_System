'use client';

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastState {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (newToast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    set((state) => ({
      toasts: [...state.toasts.slice(-4), { ...newToast, id }], // Giữ tối đa 5 toast cùng lúc
    }));
    return id;
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}));

/**
 * Tiện ích gọi Toast nhanh ở mọi nơi (client components)
 */
export const toast = {
  success: (title: string, message?: string, options?: Partial<ToastItem>) => {
    return useToastStore.getState().addToast({
      type: 'success',
      title,
      message,
      duration: options?.duration ?? 4500,
      action: options?.action,
    });
  },
  error: (title: string, message?: string, options?: Partial<ToastItem>) => {
    return useToastStore.getState().addToast({
      type: 'error',
      title,
      message,
      duration: options?.duration ?? 5500,
      action: options?.action,
    });
  },
  warning: (title: string, message?: string, options?: Partial<ToastItem>) => {
    return useToastStore.getState().addToast({
      type: 'warning',
      title,
      message,
      duration: options?.duration ?? 5000,
      action: options?.action,
    });
  },
  info: (title: string, message?: string, options?: Partial<ToastItem>) => {
    return useToastStore.getState().addToast({
      type: 'info',
      title,
      message,
      duration: options?.duration ?? 4000,
      action: options?.action,
    });
  },
  dismiss: (id: string) => {
    useToastStore.getState().removeToast(id);
  },
  clear: () => {
    useToastStore.getState().clearToasts();
  },
};
