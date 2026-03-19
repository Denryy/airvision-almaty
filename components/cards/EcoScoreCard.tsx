import Card from '@/components/ui/Card';
import { Leaf } from 'lucide-react';

interface EcoScoreCardProps {
  score: number;
}

export default function EcoScoreCard({ score }: EcoScoreCardProps) {
  const level = score >= 70 ? 'Excellent' : score >= 50 ? 'Fair' : 'Poor';
  const color = score >= 70 ? '#7ED957' : score >= 50 ? '#F5C400' : '#FF7E00';

  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <Leaf className="w-4 h-4 text-[#7ED957]" />
        <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>Eco Score</p>
      </div>
      <div className="flex items-end gap-3">
        <div>
          <span className="text-3xl font-bold" style={{ color }}>{score}</span>
          <span className="text-sm" style={{ color: 'var(--text-3)' }}>/100</span>
        </div>
        <span className="text-sm font-medium mb-0.5" style={{ color }}>{level}</span>
      </div>
      <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-subtle)' }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs mt-1.5" style={{ color: 'var(--text-4)' }}>City environmental health index</p>
    </Card>
  );
}
