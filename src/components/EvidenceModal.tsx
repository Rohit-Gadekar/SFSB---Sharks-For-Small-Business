import React from 'react';
import { X, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { EvidenceItem } from '../types';
import { EvidenceBadge } from './EvidenceBadge';

interface EvidenceModalProps {
  item: EvidenceItem | null;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-xl border border-zinc-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-semibold text-zinc-900">Evidence Record</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Verified Statement
            </span>
            <p className="mt-1 text-base font-medium text-zinc-900 leading-snug">
              "{item.claim}"
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-zinc-500">Classification:</span>
            <EvidenceBadge tag={item.tag} />
          </div>

          <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-100 space-y-2">
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-medium text-zinc-700 block">Primary Source</span>
                <span className="text-xs text-zinc-600 font-mono">{item.source}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-200/60">
              <span className="text-xs font-medium text-zinc-700 block">Audit Details</span>
              <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{item.details}</p>
            </div>

            {item.date && (
              <div className="text-[11px] font-mono text-zinc-400 pt-1">
                Verified on: {item.date}
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
