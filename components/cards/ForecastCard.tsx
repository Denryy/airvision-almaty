import Card from '@/components/ui/Card';
import type { ForecastPoint } from '@/lib/types';
import { getAQIColor } from '@/lib/ai/predict';

interface ForecastCardProps {
  forecast: ForecastPoint[];
}

export default function ForecastCard({ forecast }: ForecastCardProps) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--text-3)' }}>24-Hour Forecast</p>
      <div className="flex justify-between gap-1">
        {forecast.slice(0, 8).map((point) => (
          <div key={point.time} className="flex flex-col items-center gap-1 flex-1">
            <span className="text-lg">{point.icon}</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-1)' }}>{point.aqi}</span>
            <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--bg-subtle)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (point.aqi / 200) * 100)}%`,
                  backgroundColor: getAQIColor(point.aqi),
                }}
              />
            </div>
            <span className="text-[10px]" style={{ color: 'var(--text-4)' }}>{point.time}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
