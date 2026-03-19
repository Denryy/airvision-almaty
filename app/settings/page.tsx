'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import Card from '@/components/ui/Card';
import { Sun, Moon, Globe, Shield, User, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const mockUser = {
  name: 'Denry',
  city: 'Almaty, Kazakhstan',
  avatar: 'D',
  joinDate: 'March 2026',
};

interface ToggleProps {
  on: boolean;
  onToggle?: () => void;
}

function Toggle({ on, onToggle }: ToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label="toggle"
      className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none overflow-hidden"
      style={{ background: on ? '#7ED957' : 'var(--bg-subtle)' }}
    >
      <span
        className="absolute top-[4px] left-[4px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300"
        style={{ transform: on ? 'translateX(20px)' : 'translateX(0px)' }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useAppStore();
  const [notifToggles, setNotifToggles] = useState({ alerts: true, summary: true, forecast: false });

  const toggleNotif = (key: keyof typeof notifToggles) => {
    setNotifToggles((p) => ({ ...p, [key]: !p[key] }));
  };

  return (
    <div className="pb-16 md:pb-0 space-y-4">
      <div>
        <h1 className="text-lg font-bold" style={{ color: 'var(--text-1)' }}>Settings</h1>
        <p className="text-xs" style={{ color: 'var(--text-3)' }}>Preferences and account</p>
      </div>

      {/* User profile */}
      <Card>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-[#7ED957] font-bold text-lg flex-shrink-0 ring-2 ring-[#7ED957]/30"
            style={{ background: 'rgba(126,217,87,0.12)' }}
          >
            {mockUser.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{mockUser.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-3)' }}>{mockUser.city}</p>
            <p className="text-xs" style={{ color: 'var(--text-4)' }}>Member since {mockUser.joinDate}</p>
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card>
        <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--text-3)' }}>Appearance</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {theme === 'dark'
              ? <Moon className="w-4 h-4 text-[#4FC3F7]" />
              : <Sun className="w-4 h-4 text-yellow-400" />
            }
            <span className="text-sm" style={{ color: 'var(--text-1)' }}>
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
          <Toggle on={theme === 'dark'} onToggle={toggleTheme} />
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--text-3)' }}>Notifications</p>
        <div className="space-y-0">
          {[
            { key: 'alerts' as const, label: 'AQI Alerts', desc: 'Notify when AQI exceeds 100' },
            { key: 'summary' as const, label: 'Daily Summary', desc: 'Morning air quality report' },
            { key: 'forecast' as const, label: 'Forecast Updates', desc: 'Next 24h predictions' },
          ].map((item, i, arr) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-3"
              style={i < arr.length - 1 ? { borderBottom: '1px solid var(--border)' } : {}}
            >
              <div>
                <p className="text-sm" style={{ color: 'var(--text-1)' }}>{item.label}</p>
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>{item.desc}</p>
              </div>
              <Toggle on={notifToggles[item.key]} onToggle={() => toggleNotif(item.key)} />
            </div>
          ))}
        </div>
      </Card>

      {/* About */}
      <Card>
        <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--text-3)' }}>About</p>
        {[
          { icon: Globe, label: 'Data Source', value: 'AirVision Mock API v1.0' },
          { icon: Shield, label: 'Privacy Policy', value: '' },
          { icon: User, label: 'App Version', value: '1.0.0-MVP' },
        ].map(({ icon: Icon, label, value }, i, arr) => (
          <div
            key={label}
            className="flex items-center justify-between py-2.5 cursor-pointer hover:opacity-80 transition-opacity"
            style={i < arr.length - 1 ? { borderBottom: '1px solid var(--border)' } : {}}
          >
            <div className="flex items-center gap-2.5">
              <Icon className="w-4 h-4" style={{ color: 'var(--text-3)' }} />
              <span className="text-sm" style={{ color: 'var(--text-2)' }}>{label}</span>
            </div>
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-4)' }}>
              {value && <span>{value}</span>}
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
