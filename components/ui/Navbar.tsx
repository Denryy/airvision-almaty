'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils/cn';
import { Map, LayoutDashboard, Bell, Settings, Wind } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Map', icon: Map },
  { href: '/routing', label: 'Маршруты', icon: Map },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/features', label: 'Features', icon: Wind },
  { href: '/pricing', label: 'Pricing', icon: Settings },
  { href: '/notifications', label: 'Alerts', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();
  const { unreadCount } = useAppStore();

  return (
    <>
      {/* Top bar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 justify-between backdrop-blur-md transition-colors"
        style={{ background: 'var(--overlay-bg)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-[#7ED957]" style={{ filter: 'drop-shadow(0 0 6px #7ED95780)' }} />
          <span className="font-bold text-sm tracking-wide" style={{ color: 'var(--text-1)' }}>
            AirVision <span className="text-[#7ED957]" style={{ textShadow: '0 0 8px #7ED95760' }}>Almaty</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(126,217,87,0.08)', border: '1px solid rgba(126,217,87,0.2)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#7ED957] animate-pulse inline-block" style={{ boxShadow: '0 0 6px #7ED957' }} />
          <span style={{ color: '#7ED957' }}>Live</span>
        </div>
      </header>

      {/* Bottom nav (mobile) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 h-16 flex md:hidden backdrop-blur-md transition-colors"
        style={{ background: 'var(--overlay-bg)', borderTop: '1px solid var(--border)' }}
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 text-xs transition-all"
              style={{ color: active ? '#7ED957' : 'var(--text-3)' }}
            >
              <div className="relative">
                <Icon className="w-5 h-5" style={active ? { filter: 'drop-shadow(0 0 5px #7ED95780)' } : {}} />
                {label === 'Alerts' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="font-medium">{label}</span>
              {active && <span className="absolute bottom-0 w-6 h-0.5 rounded-full bg-[#7ED957]" />}
            </Link>
          );
        })}
      </nav>

      {/* Side nav (desktop) */}
      <aside
        className="hidden md:flex fixed left-0 top-14 bottom-0 w-56 flex-col py-6 px-3 z-40 transition-colors"
        style={{ background: 'var(--bg-base)', borderRight: '1px solid var(--border)' }}
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-all hover:scale-[1.02]"
              style={
                active
                  ? {
                      background: 'rgba(126,217,87,0.10)',
                      color: '#7ED957',
                      border: '1px solid rgba(126,217,87,0.25)',
                      boxShadow: '0 0 12px rgba(126,217,87,0.12) inset',
                    }
                  : { color: 'var(--text-3)', border: '1px solid transparent' }
              }
            >
              <div className="relative">
                <Icon className="w-4 h-4" style={active ? { filter: 'drop-shadow(0 0 4px #7ED95760)' } : {}} />
                {label === 'Alerts' && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              {label}
            </Link>
          );
        })}
      </aside>
    </>
  );
}
