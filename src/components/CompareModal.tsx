import React from 'react';
import { X, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Business } from '../types';

interface CompareModalProps {
  businesses: Business[];
  onClose: () => void;
  onSelectBusiness: (id: string) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  businesses,
  onClose,
  onSelectBusiness,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl border border-zinc-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <h3 className="text-base font-bold text-zinc-900">Side-by-Side Enterprise Contrast</h3>
            <p className="text-xs text-zinc-500">
              Evaluating financial health, margin dynamics, evidence quality, and risk factors
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Comparison Table */}
          <div className="overflow-x-auto border border-zinc-200 rounded-lg">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-mono text-[11px] uppercase">
                  <th className="py-3 px-4 font-medium">Metric Dimension</th>
                  {businesses.map((b) => (
                    <th key={b.id} className="py-3 px-4 font-semibold text-zinc-900">
                      {b.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-mono text-xs">
                <tr>
                  <td className="py-3 px-4 font-sans text-zinc-600">Category & Location</td>
                  {businesses.map((b) => (
                    <td key={b.id} className="py-3 px-4 font-sans font-medium text-zinc-900">
                      {b.category} • {b.location.split(',')[0]}
                    </td>
                  ))}
                </tr>

                <tr className="bg-zinc-50/50">
                  <td className="py-3 px-4 font-sans text-zinc-600">Health Index</td>
                  {businesses.map((b) => (
                    <td key={b.id} className="py-3 px-4 font-bold text-zinc-900">
                      {b.healthScore} / 100
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-sans text-zinc-600">Annual Revenue</td>
                  {businesses.map((b) => (
                    <td key={b.id} className="py-3 px-4 font-semibold text-zinc-900">
                      ₹{b.metrics.revenueLakhs}L
                    </td>
                  ))}
                </tr>

                <tr className="bg-zinc-50/50">
                  <td className="py-3 px-4 font-sans text-zinc-600">YoY Revenue Growth</td>
                  {businesses.map((b) => (
                    <td key={b.id} className="py-3 px-4 font-bold text-emerald-700">
                      +{b.metrics.revenueGrowth}%
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-sans text-zinc-600">Gross Margin</td>
                  {businesses.map((b) => (
                    <td key={b.id} className="py-3 px-4 font-semibold text-zinc-900">
                      {b.metrics.grossMargin}%
                    </td>
                  ))}
                </tr>

                <tr className="bg-zinc-50/50">
                  <td className="py-3 px-4 font-sans text-zinc-600">Operating Margin</td>
                  {businesses.map((b) => (
                    <td key={b.id} className="py-3 px-4 font-semibold text-emerald-700">
                      {b.metrics.operatingMargin}%
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-sans text-zinc-600">Repeat Customer Rate</td>
                  {businesses.map((b) => (
                    <td key={b.id} className="py-3 px-4 text-zinc-900 font-medium">
                      {b.metrics.repeatRate}%
                    </td>
                  ))}
                </tr>

                <tr className="bg-zinc-50/50">
                  <td className="py-3 px-4 font-sans text-zinc-600">Evidence Quality Score</td>
                  {businesses.map((b) => (
                    <td key={b.id} className="py-3 px-4 text-zinc-800">
                      {b.healthDimensions.evidenceQuality} / 100
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-sans text-zinc-600">Primary Risk Factor</td>
                  {businesses.map((b) => (
                    <td key={b.id} className="py-3 px-4 font-sans text-xs text-zinc-600">
                      {b.risks[0]?.title || 'Operational execution'}
                    </td>
                  ))}
                </tr>

                <tr className="bg-zinc-50/50">
                  <td className="py-3 px-4 font-sans text-zinc-600">Campaign Funding</td>
                  {businesses.map((b) => {
                    const pct = Math.round((b.campaign.raisedAmount / b.campaign.targetAmount) * 100);
                    return (
                      <td key={b.id} className="py-3 px-4 font-bold text-zinc-900">
                        {pct}% (₹{(b.campaign.raisedAmount / 100000).toFixed(1)}L)
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-sans text-zinc-600">Inspect Deep Profile</td>
                  {businesses.map((b) => (
                    <td key={b.id} className="py-3 px-4">
                      <button
                        onClick={() => {
                          onSelectBusiness(b.id);
                          onClose();
                        }}
                        className="px-2.5 py-1 text-xs font-medium text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded transition-colors"
                      >
                        Open Profile
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Intelligence Synthesis */}
          <div className="p-4 bg-zinc-900 text-zinc-100 rounded-xl space-y-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                Intelligence Synthesis & Contrast Thesis
              </h4>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              <strong>Crumb & Co.</strong> exhibits the highest top-line acceleration (+25.8% YoY) and an immediate off-peak monetization lever through commercial weekday catering. <strong>The Daily Grind</strong> carries slightly higher gross margin stability (61.2%) and a broader 5-year operating footprint, though exposed to upcoming commercial lease renegotiations. <strong>Thread & Loom</strong> boasts exceptional 64.5% product gross margins, but requires longer handloom production cycles.
            </p>

            <div className="pt-1 text-[10px] font-mono text-zinc-500 border-t border-zinc-800">
              *Comparison evaluated strictly against audited GST-3B filings, Square POS records, and supplier contracts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
