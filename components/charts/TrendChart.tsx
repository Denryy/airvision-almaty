'use client';

import {
  ResponsiveContainer,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { HourlyDataPoint } from '@/lib/types';

interface TrendChartProps {
  data: HourlyDataPoint[];
  dataKey: keyof HourlyDataPoint;
  color: string;
  label: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-3 py-2 text-xs shadow-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-md)' }}>
        <p className="mb-1" style={{ color: 'var(--text-3)' }}>{label}</p>
        <p className="font-semibold" style={{ color: 'var(--text-1)' }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function TrendChart({ data, dataKey, color, label }: TrendChartProps) {
  const filtered = data.filter((_, i) => i % 3 === 0);

  return (
    <div>
      <p className="text-xs mb-2" style={{ color: 'var(--text-3)' }}>{label}</p>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={filtered} margin={{ top: 5, right: 0, left: -30, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={dataKey as string}
            stroke={color}
            strokeWidth={2}
            fill={`url(#grad-${dataKey})`}
            dot={false}
            activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
