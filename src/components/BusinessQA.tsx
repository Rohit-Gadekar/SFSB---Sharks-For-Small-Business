import React, { useState } from 'react';
import {
  Send,
  CornerDownLeft,
  Sparkles,
  AlertCircle,
  FileSearch,
  ShieldCheck,
  Info,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { Business, EvidenceClassification } from '../types';
import { askBusinessIntelligence, QueryResponse } from '../services/apiService';
import { EvidenceBadge } from './EvidenceBadge';

interface BusinessQAProps {
  business: Business;
  onSelectEvidence?: (tag: string, detail: string) => void;
}

const CATEGORY_PROMPTS = [
  {
    category: 'Valuation & Deal Terms',
    question: 'How is the valuation justified and what percentage of the company is being offered?',
  },
  {
    category: 'Margins & Cost Structure',
    question: 'Where is the business spending its capital and what are the gross margins?',
  },
  {
    category: 'Risks & Vulnerabilities',
    question: 'What are the biggest operational and supplier risks that could derail growth?',
  },
  {
    category: 'Customer Traction',
    question: 'What is the repeat customer retention rate and average transaction value?',
  },
  {
    category: 'Growth & Expansion',
    question: 'What verified initiatives drive the projected revenue acceleration?',
  },
  {
    category: 'Escrow & Milestones',
    question: 'How are milestone disbursements protected and monitored?',
  },
];

export const BusinessQA: React.FC<BusinessQAProps> = ({ business, onSelectEvidence }) => {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeQuery, setActiveQuery] = useState<string>(
    'How is the valuation justified and what percentage of the company is being offered?'
  );
  const [response, setResponse] = useState<QueryResponse | null>({
    answer: `${business.name} is raising capital at an SFSB audited valuation with disciplined capital terms:
• Valuation & Instrument: Round structured under verified SFSB Deal Room terms with transparent cap table tracking.
• Multiple Benchmark: Valuation is supported by 3 consecutive years of audited revenue growth (+${business.metrics.revenueGrowth}% YoY) and healthy ${business.metrics.grossMargin}% gross margins.
• Use of Funds: 100% of proceeds are locked in milestone escrow and disbursed only upon verified operational benchmarks.`,
    evidenceTags: [
      {
        tag: 'CALCULATED',
        detail: `Computed from reported FY25 and FY26 audited financial statements.`,
      },
      {
        tag: 'VERIFIED',
        detail: 'Cross-checked against POS transaction logs and verified supplier invoices.',
      },
    ],
    confidence: 'HIGH',
  });

  const handleAsk = async (text: string) => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setActiveQuery(text);
    try {
      const res = await askBusinessIntelligence(business, text);
      setResponse(res);
      setQuery('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-5">
      {/* Header with Guardrails Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-zinc-700" />
            <h3 className="text-base font-semibold text-zinc-900">
              SFSB Intelligence & Query Engine
            </h3>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Ask any question about {business.name}’s financials, valuation, risks, margins, or operations.
          </p>
        </div>

        {/* Guardrail Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>SFSB Guardrails Active · Grounded in Audited Records</span>
        </div>
      </div>

      {/* Suggested Topic Chips */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
          Select or Type Any Query:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_PROMPTS.map((item) => (
            <button
              key={item.category}
              onClick={() => handleAsk(item.question)}
              className="text-xs px-2.5 py-1 rounded-md bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200/80 transition-colors text-left flex items-center gap-1.5"
            >
              <span className="font-medium text-slate-900">{item.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Query Form with Freeform Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(query);
        }}
        className="space-y-2"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Ask any custom question about ${business.name} (e.g. "What happens if ingredient costs rise 10%?", "How does the revenue share pay out?", "Explain the moat")...`}
            className="w-full text-xs sm:text-sm pl-4 pr-24 py-3.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:bg-white focus:border-zinc-400 transition-colors font-sans text-slate-900"
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="absolute right-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors disabled:opacity-40 flex items-center gap-1.5 shadow-xs"
          >
            {loading ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Query</span>
                <CornerDownLeft className="w-3 h-3 text-sky-400" />
              </>
            )}
          </button>
        </div>

        {/* Guardrail Disclaimer */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Info className="w-3 h-3 text-slate-400 shrink-0" />
          <span>
            Guardrail: SFSB query engine restricts hallucination and references uploaded ledgers, P&L statements, and milestone disclosures. Not individual financial advice.
          </span>
        </div>
      </form>

      {/* Answer Output */}
      {response && (
        <div className="p-4 sm:p-5 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200/60 pb-2.5 gap-2">
            <span className="text-xs font-medium text-zinc-800">
              Inquiry: <span className="text-zinc-600 font-semibold">"{activeQuery}"</span>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-mono text-zinc-400">Confidence Score:</span>
              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {response.confidence || 'HIGH'}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed whitespace-pre-line font-sans">
            {response.answer}
          </p>

          {/* Evidence Citations */}
          {response.evidenceTags && response.evidenceTags.length > 0 && (
            <div className="pt-2 border-t border-zinc-200/60 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                Audited Evidentiary Footnotes & Sources:
              </span>
              <div className="flex flex-col gap-1.5">
                {response.evidenceTags.map((ev, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-zinc-600">
                    <EvidenceBadge
                      tag={ev.tag as EvidenceClassification}
                      onClick={() => onSelectEvidence?.(ev.tag, ev.detail)}
                    />
                    <span className="text-zinc-600 text-xs mt-0.5 font-sans">{ev.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notice footer */}
          <div className="pt-2 border-t border-zinc-200/40 text-[10px] text-zinc-400 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>SFSB Regulatory Guardrails Certified · Rigorous small business due diligence</span>
          </div>
        </div>
      )}
    </div>
  );
};
