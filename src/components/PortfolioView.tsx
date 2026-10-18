import React, { useState } from 'react';
import {
  Briefcase,
  ArrowUpRight,
  Shield,
  CheckCircle,
  TrendingUp,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Receipt,
  Calendar,
  CreditCard,
  Hash,
  ExternalLink,
} from 'lucide-react';
import { PortfolioInvestment, Business } from '../types';

interface PortfolioViewProps {
  portfolio: PortfolioInvestment[];
  allBusinesses: Business[];
  onSelectBusiness: (id: string) => void;
  onNavigateToDiscover: () => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  portfolio,
  allBusinesses,
  onSelectBusiness,
  onNavigateToDiscover,
}) => {
  const [filterStructure, setFilterStructure] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalAllocated = portfolio.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSharesOwned = portfolio
    .filter((i) => i.structure === 'EQUITY')
    .reduce(
      (acc, curr) =>
        acc + (curr.sharesCount || Math.floor(curr.amount / (curr.sharePrice || 100))),
      0
    );
  const totalMonthlyRevShare = portfolio
    .filter((i) => i.structure === 'REV_SHARE')
    .reduce(
      (acc, curr) =>
        acc + (curr.monthlyPayoutEstimate || Math.round(curr.amount * 0.08)),
      0
    );
  const totalAnnualBondYield = portfolio
    .filter((i) => i.structure === 'BOND')
    .reduce(
      (acc, curr) =>
        acc +
        (curr.annualYield ||
          Math.round((curr.amount * (curr.bondInterestRate || 8.5)) / 100)),
      0
    );

  const filteredPortfolio =
    filterStructure === 'ALL'
      ? portfolio
      : portfolio.filter((i) => i.structure === filterStructure);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-semibold border border-sky-200/80">
          <Briefcase className="w-3.5 h-3.5 text-sky-600" />
          <span>SFSB Shark Portfolio · Where small businesses meet big believers</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          My Shark Portfolio
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Consolidated holdings backing vetted small businesses. Open any holding to review purchase dates, individual transaction lots, percentage of business owned, share counts, and contractual payout schedules.
        </p>
      </div>

      {/* Aggregate Metrics Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase text-slate-400 block">Total Deployed</span>
          <span className="text-2xl font-mono font-bold text-slate-900 block">
            ₹{totalAllocated.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500 block">
            Across {portfolio.length} consolidated ventures
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono uppercase text-slate-400 block">Total Shares Owned</span>
          <span className="text-2xl font-mono font-bold text-emerald-700 block">
            {totalSharesOwned.toLocaleString()} Shares
          </span>
          <span className="text-[11px] text-slate-500 block">SFSB registered cap table entries</span>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono uppercase text-slate-400 block">Monthly Rev Share Inflow</span>
          <span className="text-2xl font-mono font-bold text-sky-700 block">
            ₹{totalMonthlyRevShare.toLocaleString()}/mo
          </span>
          <span className="text-[11px] text-slate-500 block">Automated dividend distribution</span>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono uppercase text-slate-400 block">Contractual Bond Coupon</span>
          <span className="text-2xl font-mono font-bold text-slate-900 block">
            ₹{totalAnnualBondYield.toLocaleString()}/yr
          </span>
          <span className="text-[11px] text-emerald-700 block">Milestone escrow protected</span>
        </div>
      </div>

      {/* Holdings Section */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900">Active Allocations</h3>
            <span className="text-xs font-mono text-slate-400">
              ({filteredPortfolio.length} ventures)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold text-slate-600">
              {['ALL', 'EQUITY', 'REV_SHARE', 'BOND'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStructure(st)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterStructure === st
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {st === 'ALL'
                    ? 'All Deals'
                    : st === 'EQUITY'
                    ? 'Equity'
                    : st === 'REV_SHARE'
                    ? 'Rev Share'
                    : 'Bonds'}
                </button>
              ))}
            </div>

            <button
              onClick={onNavigateToDiscover}
              className="text-xs font-medium text-sky-700 hover:text-sky-900 flex items-center gap-1 ml-2"
            >
              <span>The Deal Tank</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {filteredPortfolio.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm text-slate-500">No active positions matching this filter.</p>
            <button
              onClick={onNavigateToDiscover}
              className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Explore Deals in The Deal Tank
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredPortfolio.map((item) => {
              const isExpanded = expandedId === item.id;
              const lots = item.lots && item.lots.length > 0 ? item.lots : [
                {
                  id: `lot-${item.id}`,
                  date: item.date,
                  amount: item.amount,
                  structure: item.structure,
                  equityPercentage: item.equityPercentage,
                  sharesCount: item.sharesCount,
                  sharePrice: item.sharePrice,
                  revenueSharePercentage: item.revenueSharePercentage,
                  capMultiple: item.capMultiple,
                  monthlyPayoutEstimate: item.monthlyPayoutEstimate,
                  bondInterestRate: item.bondInterestRate,
                  tenureMonths: item.tenureMonths,
                  annualYield: item.annualYield,
                  transactionRef: item.transactionRef || 'TXN-SFSB-INITIAL',
                  paymentMethod: item.paymentMethod || 'Escrow Gateway',
                }
              ];

              // Calculate equity metrics fallback
              const eqPct =
                item.equityPercentage !== undefined
                  ? item.equityPercentage
                  : Number(((item.amount / 20000000) * 100).toFixed(4));
              const shCount =
                item.sharesCount !== undefined
                  ? item.sharesCount
                  : Math.floor(item.amount / (item.sharePrice || 100));

              // Calculate rev share metrics fallback
              const rsPct = item.revenueSharePercentage || 1.5;
              const capMult = item.capMultiple || 1.5;
              const moPayout = item.monthlyPayoutEstimate || Math.round(item.amount * 0.08);

              // Calculate bond metrics fallback
              const bRate = item.bondInterestRate || 8.5;
              const bTenure = item.tenureMonths || 36;
              const bYield = item.annualYield || Math.round(item.amount * (bRate / 100));

              return (
                <div key={item.id} className="transition-colors">
                  <div
                    onClick={() => toggleExpand(item.id)}
                    className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/70 cursor-pointer select-none"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          {item.businessName}
                          <span className="text-xs font-normal text-slate-400 font-mono">
                            ({lots.length} {lots.length === 1 ? 'allocation' : 'allocations'})
                          </span>
                        </h4>

                        {item.structure === 'EQUITY' && (
                          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            EQUITY OWNERSHIP
                          </span>
                        )}
                        {item.structure === 'REV_SHARE' && (
                          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                            REVENUE SHARING
                          </span>
                        )}
                        {item.structure === 'BOND' && (
                          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                            FIXED YIELD BOND
                          </span>
                        )}
                      </div>

                      {/* Cumulative Structure Details */}
                      {item.structure === 'EQUITY' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-mono text-slate-400 block">
                              Total Business Owned
                            </span>
                            <span className="font-bold text-emerald-800 text-sm">
                              {eqPct}% Equity Stake
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-mono text-slate-400 block">
                              Total Shares Owned
                            </span>
                            <span className="font-bold text-slate-900 text-sm">
                              {shCount.toLocaleString()} Shares
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              (@ ₹{item.sharePrice || 100}/share)
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-mono text-slate-400 block">
                              Cap Table Valuation
                            </span>
                            <span className="font-semibold text-slate-900 text-sm">
                              ₹{((item.valuationAtInvestment || 20000000) / 10000000).toFixed(1)} Cr
                            </span>
                          </div>
                        </div>
                      )}

                      {item.structure === 'REV_SHARE' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-sky-50/50 rounded-lg border border-sky-100 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-mono text-slate-400 block">
                              Monthly Gross Rev Share
                            </span>
                            <span className="font-bold text-sky-800 text-sm">
                              {rsPct}% of Sales
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-mono text-slate-400 block">
                              Est. Monthly Payout
                            </span>
                            <span className="font-bold text-slate-900 text-sm">
                              ₹{moPayout.toLocaleString()}/mo
                            </span>
                            <span className="text-[10px] text-slate-400 block">Automated dividend</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-mono text-slate-400 block">
                              Return Cap ({capMult}x)
                            </span>
                            <span className="font-semibold text-slate-900 text-sm">
                              ₹{Math.round(item.amount * capMult).toLocaleString()} Max Cap
                            </span>
                          </div>
                        </div>
                      )}

                      {item.structure === 'BOND' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-mono text-slate-400 block">
                              Annual Yield Coupon
                            </span>
                            <span className="font-bold text-slate-900 text-sm">
                              {bRate}% p.a. (₹{bYield.toLocaleString()}/yr)
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-mono text-slate-400 block">
                              Tenure & Payouts
                            </span>
                            <span className="font-bold text-slate-900 text-sm">
                              {bTenure} Months
                            </span>
                            <span className="text-[10px] text-slate-400 block">Quarterly coupons</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-mono text-slate-400 block">
                              Escrow Protection
                            </span>
                            <span className="font-semibold text-emerald-700 text-sm">
                              Milestone Vetted
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                        <span>First allocation: {item.date}</span>
                        {item.lastInvestedDate && item.lastInvestedDate !== item.date && (
                          <>
                            <span>•</span>
                            <span className="text-sky-700 font-medium">
                              Latest top-up: {item.lastInvestedDate}
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span>{item.projectedOutcome}</span>
                      </div>
                    </div>

                    <div className="flex lg:flex-col items-end justify-between lg:justify-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="text-left lg:text-right">
                        <span className="text-lg font-mono font-bold text-slate-900 block">
                          ₹{item.amount.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 block">
                          {item.status} · Cap Table Registered
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(item.id);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors flex items-center gap-1 border border-sky-200"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>{isExpanded ? 'Hide History' : `History (${lots.length})`}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectBusiness(item.businessId);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <span>Venture</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* EXPANDED TRANSACTION LEDGER / LOTS */}
                  {isExpanded && (
                    <div className="bg-slate-50/90 border-t border-slate-200/80 p-5 space-y-3 animate-in slide-in-from-top-2 duration-150">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-sky-700" />
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                            Purchase Lots & Allocation History ({item.businessName})
                          </h5>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          Consolidated into single cap table position
                        </span>
                      </div>

                      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100/80 text-[10px] font-mono uppercase text-slate-500 border-b border-slate-200">
                            <tr>
                              <th className="py-2.5 px-3">Date Bought</th>
                              <th className="py-2.5 px-3">Amount Paid</th>
                              <th className="py-2.5 px-3">Acquired Qty / Stake</th>
                              <th className="py-2.5 px-3">Payment Method</th>
                              <th className="py-2.5 px-3">Transaction Reference</th>
                              <th className="py-2.5 px-3">Escrow Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-sans">
                            {lots.map((lot, idx) => {
                              // Specific lot calculations
                              let qtyDescription = '';
                              if (lot.structure === 'EQUITY' || item.structure === 'EQUITY') {
                                const lotShares =
                                  lot.sharesCount ||
                                  Math.floor(lot.amount / (lot.sharePrice || item.sharePrice || 100));
                                const lotPct =
                                  lot.equityPercentage !== undefined
                                    ? lot.equityPercentage
                                    : Number(
                                        (
                                          (lot.amount /
                                            (item.valuationAtInvestment || 20000000)) *
                                          100
                                        ).toFixed(4)
                                      );
                                qtyDescription = `${lotPct}% Equity (${lotShares.toLocaleString()} shares)`;
                              } else if (lot.structure === 'REV_SHARE' || item.structure === 'REV_SHARE') {
                                const lotPct =
                                  lot.revenueSharePercentage || item.revenueSharePercentage || 1.5;
                                qtyDescription = `${lotPct}% Monthly Revenue Share`;
                              } else {
                                const lotRate =
                                  lot.bondInterestRate || item.bondInterestRate || 8.5;
                                qtyDescription = `${lotRate}% Fixed Bond Yield Note`;
                              }

                              return (
                                <tr key={lot.id || idx} className="hover:bg-slate-50/60">
                                  <td className="py-2.5 px-3 font-mono font-medium text-slate-900 whitespace-nowrap">
                                    <div className="flex items-center gap-1.5">
                                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                      <span>{lot.date}</span>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                                    ₹{lot.amount.toLocaleString()}
                                  </td>
                                  <td className="py-2.5 px-3 whitespace-nowrap">
                                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                                      {qtyDescription}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                                    <div className="flex items-center gap-1.5">
                                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                                      <span>{lot.paymentMethod || 'Escrow Gateway'}</span>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                    <div className="flex items-center gap-1">
                                      <Hash className="w-3 h-3 text-slate-400" />
                                      <span>{lot.transactionRef || `TXN-SFSB-${lot.date.replace(/-/g, '')}`}</span>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 whitespace-nowrap">
                                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700">
                                      <CheckCircle className="w-3 h-3" />
                                      <span>MINTED</span>
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-1">
                        <span>
                          Total cumulative allocation: <strong className="text-slate-900 font-mono">₹{item.amount.toLocaleString()}</strong> across {lots.length} orders.
                        </span>
                        <button
                          type="button"
                          onClick={() => onSelectBusiness(item.businessId)}
                          className="text-sky-700 hover:text-sky-900 font-medium inline-flex items-center gap-1 mt-1 sm:mt-0"
                        >
                          <span>Open Deal Room to Allocate More</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
