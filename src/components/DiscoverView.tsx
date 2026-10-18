import React, { useState } from 'react';
import { Search, ArrowUpRight, Check, Sparkles } from 'lucide-react';
import { Business } from '../types';

interface DiscoverViewProps {
  businesses: Business[];
  onSelectBusiness: (id: string) => void;
  onNavigateToCapital: (id: string) => void;
  selectedForCompare: string[];
  onToggleCompare: (id: string) => void;
  onOpenCompare: () => void;
  onOpenListModal?: () => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  businesses,
  onSelectBusiness,
  onNavigateToCapital,
  selectedForCompare,
  onToggleCompare,
  onOpenCompare,
  onOpenListModal,
}) => {
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Artisan Bakery', 'Specialty Coffee', 'Sustainable Apparel'];

  const filtered = businesses.filter((b) => {
    // Strictly withhold businesses undergoing platform inspection or fee payment
    const isApproved = !b.listingStatus || b.listingStatus === 'approved';
    if (!isApproved) return false;

    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()) ||
      b.location.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* SFSB Mindset Hero */}
      <div className="space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200/80">
          <span>SFSB Deal Tank</span>
          <span aria-hidden="true">·</span>
          <span>Verified Local Champions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Where small businesses meet big believers.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Inspect audited unit economics, growth opportunities, and open capital rounds. Back local enterprises with milestone-secured terms, contractual yields, and authentic community ownership.
        </p>
      </div>

      {/* Founder Callout Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm border border-sky-900/40">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-semibold">
              For Small Business Founders
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Pitch Your Business to Big Believers
          </h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Publish your sales pitch, verify operating margins, and secure expansion capital from passionate community sharks who believe in your Main Street vision.
          </p>
        </div>
        {onOpenListModal && (
          <button
            onClick={onOpenListModal}
            className="px-5 py-2.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all whitespace-nowrap self-start sm:self-center shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          >
            + Enter The Tank
          </button>
        )}
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deals by enterprise, sector, or city..."
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 transition-colors shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Compare Floating Bar */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-950 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-4 border border-sky-800/60 animate-in fade-in slide-in-from-bottom-4">
          <span className="text-xs font-mono">
            {selectedForCompare.length} deal{selectedForCompare.length > 1 ? 's' : ''} in comparison queue
          </span>
          <button
            onClick={onOpenCompare}
            className="px-3.5 py-1.5 text-xs font-medium bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5"
          >
            <span>Compare Terms</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Grid of Shark Deal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((biz) => {
          const fundingPct = Math.round((biz.campaign.raisedAmount / biz.campaign.targetAmount) * 100);
          const isComparing = selectedForCompare.includes(biz.id);

          return (
            <div
              key={biz.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all group"
            >
              <div>
                {/* Visual Image Header */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={biz.imageUrl}
                    alt={biz.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                  
                  {/* Category Quiet Indicator */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-white/95 text-slate-900 backdrop-blur-xs shadow-xs">
                      {biz.category}
                    </span>
                  </div>

                  {/* Health Index Rating */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-950/85 text-white px-2.5 py-1 rounded text-xs font-mono backdrop-blur-xs border border-white/10">
                    <span className="font-bold text-sky-400">{biz.healthScore}</span>
                    <span className="text-slate-400 text-[10px]">/100 Health</span>
                  </div>

                  {/* Title & Location overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-lg font-bold tracking-tight text-white drop-shadow-xs">
                      {biz.name}
                    </h3>
                    <p className="text-xs text-slate-200 drop-shadow-xs">{biz.location}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3.5">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {biz.description}
                  </p>

                  {/* Operational Metrics Strip */}
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">
                        YoY Growth
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-700">
                        +{biz.metrics.revenueGrowth}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">
                        Gross Margin
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {biz.metrics.grossMargin}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">
                        Repeat Rate
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {biz.metrics.repeatRate}%
                      </span>
                    </div>
                  </div>

                  {/* Campaign Progress with Shark Backers */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Backed by Believers:</span>
                      <span className="font-mono font-semibold text-slate-900">
                        {fundingPct}% (₹{(biz.campaign.raisedAmount / 100000).toFixed(1)}L / ₹
                        {(biz.campaign.targetAmount / 100000).toFixed(1)}L)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-600 to-cyan-500 rounded-full"
                        style={{ width: `${Math.min(fundingPct, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectBusiness(biz.id)}
                    className="flex-1 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <span>Inspect Deal</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
                  </button>
                  <button
                    onClick={() => onNavigateToCapital(biz.id)}
                    className="px-3.5 py-2 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200/60 rounded-lg transition-colors"
                  >
                    Back Deal
                  </button>
                </div>

                <button
                  onClick={() => onToggleCompare(biz.id)}
                  className={`w-full py-1 text-[11px] font-mono text-center rounded transition-colors flex items-center justify-center gap-1 ${
                    isComparing
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {isComparing ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Added to Comparison</span>
                    </>
                  ) : (
                    <span>+ Add to Compare</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
