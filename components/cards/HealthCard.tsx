import Card from '@/components/ui/Card';
import { getHealthRecommendation } from '@/lib/ai/predict';

interface HealthCardProps {
  aqi: number;
}

export default function HealthCard({ aqi }: HealthCardProps) {
  const rec = getHealthRecommendation(aqi);

  const tips = [
    aqi > 150 ? 'Stay indoors with windows closed' : aqi > 100 ? 'Limit time outdoors' : 'Enjoy outdoor activities',
    aqi > 100 ? 'Wear N95 mask if going outside' : 'No mask required',
    aqi > 150 ? 'Use air purifier indoors' : 'Normal ventilation is fine',
    aqi > 100 ? 'Avoid heavy exercise outdoors' : 'Outdoor exercise is safe',
  ];

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{rec.icon}</span>
        <div>
          <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>Health Impact</p>
          <p className="text-sm font-semibold" style={{ color: rec.color }}>{rec.level}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
            <circle cx="32" cy="32" r="26" fill="none" stroke="var(--bg-subtle)" strokeWidth="6" />
            <circle
              cx="32" cy="32" r="26"
              fill="none"
              stroke={rec.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${163.4 * (1 - Math.min(aqi / 300, 1))} 163.4`}
              style={{ transition: 'stroke-dasharray 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold" style={{ color: 'var(--text-1)' }}>
              {Math.max(0, Math.round(100 - aqi * 0.35))}%
            </span>
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{rec.message}</p>
      </div>

      <div className="space-y-1.5">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-3)' }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: rec.color }} />
            {tip}
          </div>
        ))}
      </div>
    </Card>
  );
}
