import React from 'react';
import { EvidenceClassification } from '../types';

interface EvidenceBadgeProps {
  tag: EvidenceClassification | string;
  source?: string;
  onClick?: () => void;
  className?: string;
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({
  tag,
  source,
  onClick,
  className = '',
}) => {
  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'VERIFIED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'CALCULATED':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'SUPPORTED':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'MARKET_SIGNAL':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'SELF_REPORTED':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'ASSUMPTION':
        return 'bg-zinc-100 text-zinc-700 border-zinc-300';
      case 'INSUFFICIENT_DATA':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-zinc-50 text-zinc-700 border-zinc-200';
    }
  };

  const formatTag = (t: string) => {
    return t.replace(/_/g, ' ');
  };

  return (
    <span
      onClick={onClick}
      title={source ? `Source: ${source}` : undefined}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-mono font-medium tracking-wide border rounded cursor-pointer transition-colors hover:opacity-80 ${getBadgeStyle(
        tag
      )} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {formatTag(tag)}
    </span>
  );
};
