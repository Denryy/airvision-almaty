import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  trend?: number;
  color: string;
  description?: string;
}

export default function StatCard({ label, value, unit, icon, trend, color, description }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>{label}</p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold" style={{ color: 'var(--text-1)' }}>{value}</span>
        <span className="text-xs" style={{ color: 'var(--text-3)' }}>{unit}</span>
      </div>
      {description && <p className="text-xs" style={{ color: 'var(--text-4)' }}>{description}</p>}
      {trend !== undefined && (
        <div className={cn('flex items-center gap-1 text-xs font-medium', trend >= 0 ? 'text-red-400' : 'text-[#7ED957]')}>
          <span>{trend >= 0 ? '↑' : '↓'}</span>
          <span>{Math.abs(trend)}% from last hour</span>
        </div>
      )}
    </Card>
  );
}
