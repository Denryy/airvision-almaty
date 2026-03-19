'use client';

import { useAppStore } from '@/store/appStore';
import Card from '@/components/ui/Card';
import { Bell, BellOff, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatTime, formatDate } from '@/lib/utils/cn';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAllRead, markRead } = useAppStore();

  return (
    <div className="pb-16 md:pb-0 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--text-1)' }}>Alerts</h1>
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs text-[#7ED957] hover:opacity-80 transition-opacity"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <BellOff className="w-10 h-10" style={{ color: 'var(--text-3)' }} />
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>No notifications</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markRead(notif.id)}
              className={cn(
                'rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.01]',
                notif.read ? 'opacity-60' : 'opacity-100'
              )}
              style={{
                border: `1px solid ${notif.type === 'danger' ? 'rgba(239,68,68,0.3)' : notif.type === 'warning' ? 'rgba(234,179,8,0.3)' : 'rgba(126,217,87,0.3)'}`,
                background: notif.type === 'danger' ? 'rgba(239,68,68,0.08)' : notif.type === 'warning' ? 'rgba(234,179,8,0.08)' : 'rgba(126,217,87,0.08)',
              }}
            >
              <div className="flex items-start gap-3">
                <Bell className={cn('w-4 h-4 mt-0.5 flex-shrink-0', notif.type === 'danger' ? 'text-red-400' : notif.type === 'warning' ? 'text-yellow-400' : 'text-[#7ED957]')} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-1)' }}>{notif.title}</p>
                    {!notif.read && (
                      <span className={cn('w-2 h-2 rounded-full flex-shrink-0', notif.type === 'danger' ? 'bg-red-500' : notif.type === 'warning' ? 'bg-yellow-400' : 'bg-[#7ED957]')} />
                    )}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{notif.message}</p>
                  <p className="text-[10px] mt-1.5" style={{ color: 'var(--text-4)' }}>
                    {formatDate(notif.timestamp)} at {formatTime(notif.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
