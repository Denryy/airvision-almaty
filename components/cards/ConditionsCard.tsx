import Card from '@/components/ui/Card';
import type { CityData } from '@/lib/types';
import { Wind, Thermometer, Droplets, Navigation } from 'lucide-react';

interface ConditionsCardProps {
  data: CityData;
}

export default function ConditionsCard({ data }: ConditionsCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>Current Conditions</p>
        <div className="flex items-center gap-1 text-[#4FC3F7]">
          <Navigation className="w-3 h-3" />
          <span className="text-xs font-semibold">{data.windDirection}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: Wind, iconColor: '#4FC3F7', label: 'Wind', value: `${data.windSpeed} km/h` },
          { icon: Thermometer, iconColor: '#F97316', label: 'Temperature', value: `${data.temperature}°C` },
          { icon: Droplets, iconColor: '#60A5FA', label: 'Humidity', value: `${data.humidity}%` },
        ].map(({ icon: Icon, iconColor, label, value }) => (
          <div key={label} className="rounded-xl p-2.5 flex items-center gap-2" style={{ background: 'var(--bg-subtle)' }}>
            <Icon className="w-4 h-4" style={{ color: iconColor }} />
            <div>
              <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>{label}</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{value}</p>
            </div>
          </div>
        ))}
        <div className="rounded-xl p-2.5" style={{ background: 'var(--bg-subtle)' }}>
          <p className="text-[10px] mb-1" style={{ color: 'var(--text-3)' }}>AQI Trend</p>
          <div className="flex items-end gap-0.5 h-6">
            {[40, 55, 70, 85, 75, 90, 85].map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{ height: `${(v / 100) * 100}%`, background: 'rgba(79,195,247,0.6)' }}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
