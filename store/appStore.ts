'use client';

import { create } from 'zustand';
import type { Notification, Toast } from '@/lib/types';
import { getNotifications } from '@/lib/api/airData';

interface AppStore {
  theme: 'dark' | 'light';
  notifications: Notification[];
  unreadCount: number;
  toasts: Toast[];
  toggleTheme: () => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

function applyTheme(theme: 'dark' | 'light') {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
    html.classList.remove('light');
  } else {
    html.classList.add('light');
    html.classList.remove('dark');
  }
}

export const useAppStore = create<AppStore>((set) => {
  if (typeof document !== 'undefined') applyTheme('dark');
  return {
    theme: 'dark',
    notifications: getNotifications(),
    unreadCount: getNotifications().filter((n) => !n.read).length,
    toasts: [],
    toggleTheme: () =>
      set((s) => {
        const next = s.theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        return { theme: next };
      }),
    markAllRead: () =>
      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      })),
    markRead: (id) =>
      set((s) => {
        const updated = s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
        return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length };
      }),
    addToast: (toast) =>
      set((s) => {
        const id = Date.now().toString();
        return { toasts: [...s.toasts.slice(-2), { ...toast, id }] };
      }),
    removeToast: (id) =>
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  };
});
