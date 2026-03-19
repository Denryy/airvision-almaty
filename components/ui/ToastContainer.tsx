'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import type { Toast } from '@/lib/types';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const icons = {
  danger: <AlertTriangle className="w-4 h-4 text-red-400" />,
  warning: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
  success: <CheckCircle className="w-4 h-4 text-[#7ED957]" />,
  info: <Info className="w-4 h-4 text-[#4FC3F7]" />,
};

const borders = {
  danger: 'border-red-500/40',
  warning: 'border-yellow-500/40',
  success: 'border-[#7ED957]/40',
  info: 'border-[#4FC3F7]/40',
};

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useAppStore();

  useEffect(() => {
    const t = setTimeout(() => removeToast(toast.id), 4500);
    return () => clearTimeout(t);
  }, [toast.id]);

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-2xl px-4 py-3 shadow-2xl border backdrop-blur-md',
        'animate-[slideIn_0.3s_ease_forwards]',
        borders[toast.type]
      )}
      style={{ background: 'var(--overlay-bg)', minWidth: 280, maxWidth: 340 }}
    >
      <div className="mt-0.5 flex-shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{toast.title}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{toast.message}</p>
      </div>
      <button onClick={() => removeToast(toast.id)} className="flex-shrink-0 mt-0.5 hover:opacity-60 transition-opacity">
        <X className="w-3.5 h-3.5" style={{ color: 'var(--text-3)' }} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useAppStore();

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 z-[2000] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
