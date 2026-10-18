import React, { useState } from 'react';
import {
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  FileText,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { Business, EvidenceItem } from '../types';
import { EvidenceBadge } from './EvidenceBadge';
import { FinancialCharts } from './FinancialCharts';
import { ScenarioSimulator } from './ScenarioSimulator';
import { BusinessQA } from './BusinessQA';
import { explainBusinessFinancials, FinancialExplanationResponse } from '../services/apiService';

interface BusinessDetailViewProps {
  business: Business;
  userRole?: 'investor' | 'owner';
  onSelectEvidence: (item: EvidenceItem) => void;
  onNavigateToCapital: (businessId: string) => void;
  onNavigateToGrowth: (businessId: string) => void;
  onOpenCompare: () => void;
}

export const BusinessDetailView: React.FC<BusinessDetailViewProps> = ({
  business,
  userRole = 'investor',
  onSelectEvidence,
  onNavigateToCapital,
  onNavigateToGrowth,
  onOpenCompare,
}) => {
  const [activeTab, setActiveTab] = useState<
    'pitch' | 'financials' | 'evidence' | 'growth' | 'scenario' | 'qa' | 'documents'
  >('pitch');

  const [explaining, setExplaining] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<FinancialExplanationResponse | null>(null);

  const handleExplainFinancials = async () => {
    setExplaining(true);
    try {
      const res = await explainBusinessFinancials(business);
      setExplanation(res);
    } catch (err) {
      console.error(err);
    } finally {
      setExplaining(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header Card with Visual Banner */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-xs">
        <div className="relative h-48 sm:h-60 w-full overflow-hidden bg-zinc-100">
          <img
            src={business.coverImageUrl || business.imageUrl}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-5 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-zinc-300 text-xs font-mono uppercase tracking-wider mb-1">
                <span>{business.category}</span>
                <span>•</span>
                <span>{business.location}</span>
                <span>•</span>
                <span>Est. {business.foundedYear}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-xs">
                {business.name}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {userRole === 'owner' ? (
                <button
                  onClick={() => onNavigateToCapital(business.id)}
                  className="px-4 py-2 text-xs font-medium text-white bg-zinc-900/90 hover:bg-zinc-900 backdrop-blur-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-white/20 shadow-xs"
                >
                  <span>Campaign Manager</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => onNavigateToCapital(business.id)}
                  className="px-4 py-2 text-xs font-medium text-white bg-zinc-900/90 hover:bg-zinc-900 backdrop-blur-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-white/20 shadow-xs"
                >
                  <span>Support Campaign</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={onOpenCompare}
                className="px-4 py-2 text-xs font-medium text-white bg-white/20 hover:bg-white/30 backdrop-blur-xs rounded-lg transition-colors border border-white/30"
              >
                Compare
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <p className="text-sm text-zinc-600 max-w-2xl leading-relaxed">
              {business.description}
            </p>

            {/* Health Score Box */}
            <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/80 text-right min-w-[150px] shrink-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-zinc-500 uppercase">Health Index</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-1 flex items-baseline justify-end gap-1">
                <span className="text-2xl font-mono font-bold text-zinc-900">
                  {business.healthScore}
                </span>
                <span className="text-xs font-mono text-zinc-400">/ 100</span>
              </div>
              <span className="text-[10px] font-medium text-emerald-700 block mt-0.5">
                Robust Financial Resilience
              </span>
            </div>
          </div>

        {/* Health Dimensions Bar */}
        <div className="mt-6 pt-4 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {Object.entries(business.healthDimensions).map(([key, val]) => {
            const formatted = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase());
            return (
              <div key={key} className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-500 block truncate">
                  {formatted}
                </span>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm font-mono font-semibold text-zinc-900">{val}</span>
                  <div className="w-12 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-800 rounded-full"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Screener Key Metrics Strip */}
        <div className="mt-4 pt-4 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
          <div className="p-2">
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">
              Annual Revenue
            </span>
            <span className="text-base font-mono font-bold text-zinc-900">
              ₹{business.metrics.revenueLakhs}L
            </span>
          </div>
          <div className="p-2">
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">YoY Growth</span>
            <span className="text-base font-mono font-bold text-emerald-700">
              +{business.metrics.revenueGrowth}%
            </span>
          </div>
          <div className="p-2">
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">Gross Margin</span>
            <span className="text-base font-mono font-bold text-zinc-900">
              {business.metrics.grossMargin}%
            </span>
          </div>
          <div className="p-2">
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">
              Operating Margin
            </span>
            <span className="text-base font-mono font-bold text-emerald-700">
              {business.metrics.operatingMargin}%
            </span>
          </div>
          <div className="p-2">
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">Avg Ticket</span>
            <span className="text-base font-mono font-bold text-zinc-900">
              ₹{business.metrics.aov}
            </span>
          </div>
          <div className="p-2">
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">Repeat Rate</span>
            <span className="text-base font-mono font-bold text-zinc-900">
              {business.metrics.repeatRate}%
            </span>
          </div>
        </div>
      </div>
    </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-200 overflow-x-auto gap-2">
        {[
          { id: 'pitch', label: 'Pitch & Story' },
          { id: 'financials', label: 'Financial Statements' },
          { id: 'evidence', label: 'Evidence & Vulnerabilities' },
          { id: 'growth', label: 'Strategic Opportunities' },
          { id: 'scenario', label: 'Scenario Stress Analysis' },
          { id: 'qa', label: 'Query Engine' },
          { id: 'documents', label: 'Verified Ledgers' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-zinc-900 text-zinc-900 font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: Founder Pitch (Tyke-Inspired) */}
      {activeTab === 'pitch' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                  Founder Campaign Pitch
                </span>
                <h3 className="text-xl font-bold text-zinc-900 mt-1">{business.name} Campaign Narrative</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{business.tagline}</p>
              </div>

              {userRole === 'owner' ? (
                <button
                  onClick={() => onNavigateToCapital(business.id)}
                  className="px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs shrink-0"
                >
                  <span>Campaign Manager</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => onNavigateToCapital(business.id)}
                  className="px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs shrink-0"
                >
                  <span>Back This Campaign</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Problem & Solution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                <div className="flex items-center gap-2 text-rose-700">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider">
                    The Problem
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-zinc-900">Market Friction & Pain Point</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {business.pitch?.problem ||
                    'Local consumers lack access to transparent, authentic offerings. Mass commercial brands prioritize shelf-life and preservatives over quality, while boutique artisans lack the growth capital to scale production.'}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider">
                    The Solution
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-zinc-900">Our Defensible Product</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {business.pitch?.solution ||
                    'We combine verified regional sourcing, artisan craftsmanship, and operational discipline to deliver an uncompromising neighborhood experience with exceptional repeat traction.'}
                </p>
              </div>
            </div>

            {/* Competitive Moat */}
            <div className="p-5 rounded-xl bg-zinc-900 text-white space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  Our Competitive Moat
                </span>
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed font-sans">
                {business.pitch?.moat ||
                  `${business.metrics.repeatRate}% repeat patron rate, certified direct supply agreements cutting out intermediary markups, and defensible unit economics with ${business.metrics.grossMargin}% gross margin.`}
              </p>
            </div>

            {/* Founder Note */}
            <div className="p-5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                Founder's Note to Supporters
              </span>
              <p className="text-xs text-zinc-700 italic leading-relaxed">
                "{business.pitch?.founderNote ||
                  `We founded ${business.name} to build an enduring local institution. Raising community capital aligns our growth directly with the patrons who believe in our craft.`}"
              </p>
              <div className="pt-2 text-[11px] font-mono text-zinc-500">
                — Founding Team, {business.name} ({business.location})
              </div>
            </div>

            {/* Campaign Summary Strip */}
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Funding Goal</span>
                <span className="text-base font-mono font-bold text-zinc-900">
                  ₹{(business.campaign.targetAmount / 100000).toFixed(1)}L
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Instrument</span>
                <span className="text-base font-mono font-bold text-zinc-900">
                  {business.campaign.structure === 'BOND'
                    ? `${business.campaign.bondReturnRate}% Bond`
                    : 'Equity Share'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Min Ticket</span>
                <span className="text-base font-mono font-bold text-zinc-900">
                  ₹{business.campaign.minAllocation.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Raised So Far</span>
                <span className="text-base font-mono font-bold text-emerald-700">
                  ₹{(business.campaign.raisedAmount / 100000).toFixed(1)}L
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: Financials */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          {/* Screener Table */}
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">Multi-Year Income Statement</h3>
                <p className="text-xs text-zinc-500">
                  Standardized metrics derived from audited GST filings and POS logs
                </p>
              </div>

              <button
                onClick={handleExplainFinancials}
                disabled={explaining}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-600" />
                {explaining ? 'Analyzing...' : 'Explain Financials'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-zinc-50/80 border-b border-zinc-200/80 text-[11px] font-mono uppercase text-zinc-500">
                    <th className="py-3 px-4 font-medium">Financial Line Item (₹ Lakhs)</th>
                    {business.historicals.map((h) => (
                      <th key={h.year} className="py-3 px-4 font-medium text-right">
                        {h.year}
                      </th>
                    ))}
                    <th className="py-3 px-4 font-medium text-right text-zinc-400">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-mono">
                  <tr className="hover:bg-zinc-50/50">
                    <td className="py-3 px-4 font-sans font-medium text-zinc-900">Gross Sales (Revenue)</td>
                    {business.historicals.map((h) => (
                      <td key={h.year} className="py-3 px-4 text-right font-semibold text-zinc-900">
                        ₹{h.revenue.toFixed(1)}L
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right">
                      <EvidenceBadge tag="VERIFIED" />
                    </td>
                  </tr>

                  <tr className="hover:bg-zinc-50/50">
                    <td className="py-3 px-4 font-sans text-zinc-700">Total Operating Expenses</td>
                    {business.historicals.map((h) => (
                      <td key={h.year} className="py-3 px-4 text-right text-zinc-600">
                        ₹{h.expenses.toFixed(1)}L
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right">
                      <EvidenceBadge tag="VERIFIED" />
                    </td>
                  </tr>

                  <tr className="hover:bg-zinc-50/50">
                    <td className="py-3 px-4 font-sans font-medium text-zinc-900">Gross Profit</td>
                    {business.historicals.map((h) => (
                      <td key={h.year} className="py-3 px-4 text-right font-medium text-zinc-900">
                        ₹{h.grossProfit.toFixed(1)}L
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right">
                      <EvidenceBadge tag="CALCULATED" />
                    </td>
                  </tr>

                  <tr className="hover:bg-zinc-50/50">
                    <td className="py-3 px-4 font-sans font-medium text-emerald-800">Operating Profit (EBITDA)</td>
                    {business.historicals.map((h) => (
                      <td key={h.year} className="py-3 px-4 text-right font-bold text-emerald-700">
                        ₹{h.operatingProfit.toFixed(1)}L
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right">
                      <EvidenceBadge tag="CALCULATED" />
                    </td>
                  </tr>

                  <tr className="hover:bg-zinc-50/50 bg-zinc-50/30">
                    <td className="py-3 px-4 font-sans text-zinc-600">Gross Margin %</td>
                    {business.historicals.map((h) => (
                      <td key={h.year} className="py-3 px-4 text-right text-zinc-700">
                        {h.grossMargin.toFixed(1)}%
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right">
                      <EvidenceBadge tag="CALCULATED" />
                    </td>
                  </tr>

                  <tr className="hover:bg-zinc-50/50 bg-zinc-50/30">
                    <td className="py-3 px-4 font-sans text-zinc-600">Operating Margin %</td>
                    {business.historicals.map((h) => (
                      <td key={h.year} className="py-3 px-4 text-right font-semibold text-emerald-700">
                        {h.operatingMargin.toFixed(1)}%
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right">
                      <EvidenceBadge tag="CALCULATED" />
                    </td>
                  </tr>

                  <tr className="hover:bg-zinc-50/50">
                    <td className="py-3 px-4 font-sans text-zinc-600">Annual Unique Customers</td>
                    {business.historicals.map((h) => (
                      <td key={h.year} className="py-3 px-4 text-right text-zinc-700">
                        {h.customers.toLocaleString()}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right">
                      <EvidenceBadge tag="VERIFIED" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Explanation Panel if requested */}
          {explanation && (
            <div className="bg-zinc-900 text-zinc-100 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-semibold text-white">Financial Statement Analysis</h4>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">Grounding: Audited Statements</span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                {explanation.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 bg-zinc-800/70 rounded-lg space-y-2">
                  <span className="text-xs font-mono font-medium text-emerald-400 block uppercase">
                    Standout Signals
                  </span>
                  <div className="space-y-1.5">
                    {explanation.standoutObservations.map((obs, i) => (
                      <div key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                        <span className="text-emerald-400 font-mono">•</span>
                        <div>
                          <span>{obs.observation}</span>
                          <span className="text-[10px] text-zinc-400 font-mono block">
                            [{obs.evidenceType}: {obs.source}]
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-zinc-800/70 rounded-lg space-y-2">
                  <span className="text-xs font-mono font-medium text-amber-400 block uppercase">
                    Vulnerabilities & Margin Trajectory
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {explanation.marginAnalysis}
                  </p>
                  <div className="pt-2 border-t border-zinc-700/60 space-y-1">
                    {explanation.topRisks.map((r, i) => (
                      <div key={i} className="text-[11px] text-zinc-300">
                        <span className="text-amber-400 font-semibold">{r.risk}: </span>
                        <span className="text-zinc-400">{r.mitigation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SVG Charts */}
          <FinancialCharts historicals={business.historicals} />
        </div>
      )}

      {/* TAB 2: Evidence & Vulnerabilities */}
      {activeTab === 'evidence' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Verified Evidence Ledger</h3>
              <p className="text-xs text-zinc-500">
                Every claim is classified by evidence rigour to prevent ungrounded assumptions
              </p>
            </div>

            <div className="divide-y divide-zinc-100">
              {business.evidenceLedger.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectEvidence(item)}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-medium text-zinc-900">{item.claim}</p>
                    <p className="text-[11px] text-zinc-500 font-mono">{item.source}</p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <EvidenceBadge tag={item.tag} />
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-semibold text-zinc-900">
                Key Vulnerabilities & Risk Mitigation
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {business.risks.map((risk) => (
                <div
                  key={risk.id}
                  className="p-4 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-900">{risk.title}</span>
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                          risk.severity === 'HIGH'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : risk.severity === 'MEDIUM'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {risk.severity} RISK
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">{risk.detail}</p>
                  </div>

                  <div className="pt-2 border-t border-zinc-200 text-[11px] text-zinc-500">
                    <span className="font-semibold text-zinc-700 block text-[10px] uppercase">
                      Mitigation Strategy
                    </span>
                    <p className="text-zinc-600 mt-0.5">{risk.mitigation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Growth Opportunities */}
      {activeTab === 'growth' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-zinc-900">
                Data-Grounded Strategic Opportunities
              </h3>
              <p className="text-xs text-zinc-500">
                Identified through operating capacity audits and customer purchase frequency
              </p>
            </div>
            <button
              onClick={() => onNavigateToGrowth(business.id)}
              className="px-3.5 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
            >
              Open Advisory Engine
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {business.growthOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4 flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                      {opp.category}
                    </span>
                    <EvidenceBadge tag={opp.evidenceTag} />
                  </div>

                  <h4 className="text-sm font-semibold text-zinc-900 leading-snug">{opp.title}</h4>

                  <p className="text-xs text-zinc-600 leading-relaxed">{opp.whyNow}</p>

                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Required Capital:</span>
                      <span className="font-mono font-semibold text-zinc-900">
                        {opp.implementationCost}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Execution Difficulty:</span>
                      <span className="font-mono text-zinc-700">{opp.difficulty}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Projected Impact:</span>
                      <span className="font-mono font-medium text-emerald-700">
                        {opp.expectedImpact}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <span className="font-medium text-zinc-700 block text-[11px]">
                      Recommended Pilot Experiment:
                    </span>
                    <p className="text-zinc-600 text-[11px] leading-relaxed">
                      {opp.recommendedExperiment}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400">Target: {opp.successMetric}</span>
                  <button
                    onClick={() => onNavigateToCapital(business.id)}
                    className="text-xs font-medium text-zinc-900 hover:underline flex items-center gap-1"
                  >
                    <span>{userRole === 'owner' ? 'Campaign Manager' : 'View Campaign'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Scenario Stress Analysis */}
      {activeTab === 'scenario' && <ScenarioSimulator business={business} />}

      {/* TAB 5: Query Engine */}
      {activeTab === 'qa' && (
        <BusinessQA
          business={business}
          onSelectEvidence={(tag, detail) => {
            onSelectEvidence({
              id: 'custom-query-evidence',
              claim: detail,
              tag: tag as any,
              source: 'Verified Ledger / GST Records',
              details: detail,
              date: '2026-10-01',
            });
          }}
        />
      )}

      {/* TAB 6: Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Primary Ingested Documents</h3>
            <p className="text-xs text-zinc-500">
              Raw files parsed into normalized metrics with verification confidence
            </p>
          </div>

          <div className="divide-y divide-zinc-100">
            {business.documents.map((doc) => (
              <div key={doc.id} className="py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-zinc-500" />
                    <span className="text-xs font-mono font-medium text-zinc-900">{doc.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">Uploaded {doc.uploadDate}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {doc.extractedMetrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-100 text-xs flex justify-between items-center"
                    >
                      <div>
                        <span className="text-zinc-500 block text-[11px]">{m.metric}</span>
                        <span className="font-mono font-medium text-zinc-900">{m.value}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {(m.confidence * 100).toFixed(0)}% Match
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
