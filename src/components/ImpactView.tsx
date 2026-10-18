import React from 'react';
import { Leaf, DollarSign, Users, CheckCircle2, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { Business, ImpactMetric } from '../types';

interface ImpactViewProps {
  business: Business;
  allBusinesses: Business[];
  onSelectBusiness: (id: string) => void;
}

export const ImpactView: React.FC<ImpactViewProps> = ({
  business,
  allBusinesses,
  onSelectBusiness,
}) => {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Environmental':
        return <Leaf className="w-4 h-4 text-emerald-600" />;
      case 'Economic':
        return <DollarSign className="w-4 h-4 text-blue-600" />;
      case 'Social':
        return <Users className="w-4 h-4 text-purple-600" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-zinc-600" />;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verifiable Community & Sustainability Outcomes</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Impact Ledger & Accountability
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          SFSB audits measurable sustainability, local supplier sourcing, and fair-wage job creation linked directly to capital deployed by big believers.
        </p>
      </div>

      {/* Selected Business Impact */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Active Enterprise Audit
            </span>
            <h2 className="text-xl font-bold text-zinc-900">{business.name}</h2>
            <p className="text-xs text-zinc-500">{business.category} • {business.location}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Switch profile:</span>
            <div className="flex gap-1.5">
              {allBusinesses.map((b) => (
                <button
                  key={b.id}
                  onClick={() => onSelectBusiness(b.id)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    b.id === business.id
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {business.impactMetrics.map((metric) => (
            <div
              key={metric.id}
              className="p-5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(metric.category)}
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                      {metric.category}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      metric.status === 'ACHIEVED'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {metric.status}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-zinc-900">{metric.title}</h3>

                <div className="p-3 bg-white rounded-lg border border-zinc-100 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 block uppercase">
                      Target Goal
                    </span>
                    <span className="text-xs font-mono font-medium text-zinc-600">
                      {metric.target}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 block uppercase">
                      Current Actual
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700">
                      {metric.actual}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-200/60 text-xs space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">
                  Verified Audit Trail
                </span>
                <p className="text-[11px] text-zinc-600 leading-relaxed font-mono">
                  {metric.evidence}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Platform Ecosystem Aggregation */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4 shadow-xs">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">
            Platform-Wide Cumulative Impact
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Aggregated outcomes achieved across all participating local enterprises
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100 space-y-1">
            <span className="text-xs font-mono text-zinc-500 uppercase block">Local Farmer & Artisan Spend</span>
            <span className="text-xl font-mono font-bold text-zinc-900">₹9.4L</span>
            <span className="text-[11px] text-emerald-700 block">Direct supplier economic retention</span>
          </div>

          <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100 space-y-1">
            <span className="text-xs font-mono text-zinc-500 uppercase block">Commercial Waste Diverted</span>
            <span className="text-xl font-mono font-bold text-zinc-900">2.1 Tonnes</span>
            <span className="text-[11px] text-emerald-700 block">Baking surplus & organic coffee compost</span>
          </div>

          <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100 space-y-1">
            <span className="text-xs font-mono text-zinc-500 uppercase block">Living-Wage Jobs Sustained</span>
            <span className="text-xl font-mono font-bold text-zinc-900">10 Full-Time</span>
            <span className="text-[11px] text-emerald-700 block">Including 2 apprentice positions</span>
          </div>
        </div>
      </div>
    </div>
  );
};
