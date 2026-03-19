'use client';

import { getAQIColor, getAQILevel } from '@/lib/ai/predict';

interface AQIGaugeProps {
  aqi: number;
  size?: number;
}

export default function AQIGauge({ aqi, size = 160 }: AQIGaugeProps) {
  const color = getAQIColor(aqi);
  const level = getAQILevel(aqi);

  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - 20) / 2;
  const circumference = Math.PI * radius;
  const progress = Math.min(aqi / 300, 1);
  const dashOffset = circumference * (1 - progress);
  const gradientId = `gauge-grad-${size}`;

  const startX = cx - radius;
  const endX = cx + radius;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* SVG arc — height = half circle + stroke room */}
      <div className="relative" style={{ width: size, height: size / 2 + 16 }}>
        <svg
          width={size}
          height={size / 2 + 16}
          viewBox={`0 0 ${size} ${size / 2 + 16}`}
          style={{ display: 'block' }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7ED957" />
              <stop offset="35%" stopColor="#F5C400" />
              <stop offset="65%" stopColor="#FF7E00" />
              <stop offset="100%" stopColor="#FF0000" />
            </linearGradient>
          </defs>

          {/* Track */}
          <path
            d={`M ${startX} ${cy} A ${radius} ${radius} 0 0 1 ${endX} ${cy}`}
            fill="none"
            stroke="var(--bg-subtle, #1e2a3a)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Progress */}
          <path
            d={`M ${startX} ${cy} A ${radius} ${radius} 0 0 1 ${endX} ${cy}`}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>

        {/* Perfectly centred value — sits at bottom half of the arc */}
        <div
          className="absolute left-0 right-0 flex flex-col items-center justify-end"
          style={{ bottom: 0, height: size / 2 + 4 }}
        >
          <span
            className="font-bold leading-none tabular-nums"
            style={{ fontSize: size * 0.28, color, transition: 'color 0.6s ease' }}
          >
            {aqi}
          </span>
          <span
            className="font-medium tracking-widest uppercase"
            style={{ fontSize: size * 0.09, color: 'var(--text-3)', marginTop: 2 }}
          >
            AQI
          </span>
        </div>
      </div>

      <span
        className="text-xs font-semibold px-3 py-0.5 rounded-full border transition-all duration-500"
        style={{ color, borderColor: color + '50', backgroundColor: color + '18' }}
      >
        {level}
      </span>
    </div>
  );
}
