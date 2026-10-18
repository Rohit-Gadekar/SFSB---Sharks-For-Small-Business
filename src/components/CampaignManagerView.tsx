import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  FileCheck,
  Send,
  UploadCloud,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Check,
} from 'lucide-react';
import { Business, FundingMilestone } from '../types';

interface CampaignManagerViewProps {
  business: Business;
  onUpdateMilestone: (milestoneId: string, completed: boolean) => void;
  onNavigateToGrowth: () => void;
}

export const CampaignManagerView: React.FC<CampaignManagerViewProps> = ({
  business,
  onUpdateMilestone,
  onNavigateToGrowth,
}) => {
  const campaign = business.campaign;
  const fundingPct = Math.round((campaign.raisedAmount / campaign.targetAmount) * 100);

  const [updateTitle, setUpdateTitle] = useState<string>('');
  const [updateMessage, setUpdateMessage] = useState<string>('');
  const [postSuccess, setPostSuccess] = useState<string | null>(null);

  const [recentBackers] = useState([
    { id: 'b-1', name: 'Priya Sharma', amount: 25000, date: '2026-10-15', type: 'Bond (8.5%)' },
    { id: 'b-2', name: 'Arjun Mehta', amount: 10000, date: '2026-10-12', type: 'Bond (8.5%)' },
    { id: 'b-3', name: 'Siddharth Rao', amount: 15000, date: '2026-10-09', type: 'Bond (8.5%)' },
    { id: 'b-4', name: 'Ananya Verma', amount: 5000, date: '2026-10-05', type: 'Bond (8.5%)' },
    { id: 'b-5', name: 'Vikram Joshi', amount: 10000, date: '2026-09-28', type: 'Bond (8.5%)' },
  ]);

  const [updatesList, setUpdatesList] = useState([
    {
      id: 'up-1',
      date: '2026-10-02',
      title: 'Deck Retarder Proofer Oven Operational',
      body: 'Our commercial retarder proofer has been commissioned. We are now running overnight sourdough bulk fermentation without overtime labor.',
    },
    {
      id: 'up-2',
      date: '2026-09-14',
      title: 'First Corporate Catering Pilot Secured',
      body: 'Signed our first corporate breakfast agreement with a 120-person tech office in Hitec City. Delivering daily morning pastry crates.',
    },
  ]);

  const handlePostUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitle.trim() || !updateMessage.trim()) return;

    setUpdatesList([
      {
        id: `up-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        title: updateTitle.trim(),
        body: updateMessage.trim(),
      },
      ...updatesList,
    ]);

    setUpdateTitle('');
    setUpdateMessage('');
    setPostSuccess('Backer announcement broadcast to 94 community supporters.');
    setTimeout(() => setPostSuccess(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* SFSB Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-semibold border border-sky-200/80">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>SFSB Shark Round Governance · Where small businesses meet big believers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-2">
            {campaign.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Oversee commitments from big believers, verify milestone escrow releases, and broadcast progress updates
          </p>
        </div>

        <button
          onClick={onNavigateToGrowth}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-center shadow-xs"
        >
          <span>Strategic Initiatives</span>
          <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
        </button>
      </div>

      {/* Capital Raise Health Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-1">
          <span className="text-xs font-mono uppercase text-zinc-400 block">Total Capital Raised</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-mono font-bold text-zinc-900">
              ₹{(campaign.raisedAmount / 100000).toFixed(1)}L
            </span>
            <span className="text-xs font-mono text-zinc-400">
              / ₹{(campaign.targetAmount / 100000).toFixed(1)}L
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium block">
            {fundingPct}% of target reached
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-1">
          <span className="text-xs font-mono uppercase text-zinc-400 block">Community Backers</span>
          <span className="text-2xl font-mono font-bold text-zinc-900">
            {campaign.supportersCount} Patrons
          </span>
          <span className="text-[11px] text-zinc-500 block">Average allocation ₹5,950</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-1">
          <span className="text-xs font-mono uppercase text-zinc-400 block">Capital Instrument</span>
          <span className="text-xl font-mono font-bold text-zinc-900">
            {campaign.structure === 'BOND' ? `${campaign.bondReturnRate}% Fixed Bond` : 'Equity Share'}
          </span>
          <span className="text-[11px] text-zinc-500 block">
            {campaign.structure === 'BOND' ? '36-month tenure' : 'Ownership participation'}
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-1">
          <span className="text-xs font-mono uppercase text-zinc-400 block">Escrow Settlement</span>
          <span className="text-xl font-mono font-bold text-emerald-700">Disbursed</span>
          <span className="text-[11px] text-zinc-500 block">₹5.6L operational liquidity released</span>
        </div>
      </div>

      {/* Campaign Progress Bar */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-xs space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-zinc-900">Funding Progress</span>
          <span className="font-mono text-zinc-600">
            ₹{((campaign.targetAmount - campaign.raisedAmount) / 100000).toFixed(1)}L remaining to close round
          </span>
        </div>
        <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-900 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(fundingPct, 100)}%` }}
          />
        </div>
      </div>

      {/* Grid: Milestones Verification & Use of Funds */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Milestone Execution for Owner */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-zinc-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-base font-semibold text-zinc-900">
                Milestone Verification & Proof Management
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Mark completed initiatives and link verified invoices to maintain backer transparency
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {campaign.milestones.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    {m.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <span className="text-xs font-semibold text-zinc-900 block">{m.title}</span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        Target Timeline: {m.targetMonth}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onUpdateMilestone(m.id, !m.completed)}
                    className={`px-3 py-1 text-xs font-mono font-medium rounded transition-colors flex items-center gap-1.5 shrink-0 ${
                      m.completed
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-100'
                    }`}
                  >
                    {m.completed ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <span>Mark Complete</span>
                    )}
                  </button>
                </div>

                {m.evidenceDoc && (
                  <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-1.5 pl-6 pt-1 border-t border-zinc-200/50">
                    <FileCheck className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="truncate">Audit Proof: {m.evidenceDoc}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Use of Funds Table */}
          <div className="pt-4 border-t border-zinc-100 space-y-3">
            <span className="text-xs font-semibold text-zinc-900 block">
              Budgeted Capital Allocation
            </span>
            <div className="grid grid-cols-2 gap-3">
              {campaign.useOfFunds.map((u, i) => (
                <div key={i} className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                  <span className="text-[11px] text-zinc-500 block truncate">{u.label}</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-sm font-mono font-semibold text-zinc-900">
                      ₹{u.amountLakhs}L
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">{u.sharePercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Backer Roster & Announcements */}
        <div className="lg:col-span-5 space-y-6">
          {/* Post Backer Update */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Broadcast Update to Big Believers
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Send verified operational progress to all {campaign.supportersCount} community sharks
              </p>
            </div>

            <form onSubmit={handlePostUpdate} className="space-y-3">
              <input
                type="text"
                value={updateTitle}
                onChange={(e) => setUpdateTitle(e.target.value)}
                placeholder="Headline (e.g. New Production Equipment Commissioned)"
                className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-sky-500"
              />
              <textarea
                rows={3}
                value={updateMessage}
                onChange={(e) => setUpdateMessage(e.target.value)}
                placeholder="Share milestone execution, retail placements, or catering contract wins..."
                className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={!updateTitle.trim() || !updateMessage.trim()}
                className="w-full py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>Post Update to Big Believers</span>
              </button>
            </form>

            {postSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 animate-in fade-in">
                {postSuccess}
              </div>
            )}
          </div>

          {/* Recent Community Inflows */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Shark Allocations & Inflows
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Escrow Protected</span>
            </div>

            <div className="divide-y divide-zinc-100">
              {recentBackers.map((b) => (
                <div key={b.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-zinc-900 block">{b.name}</span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {b.date} • {b.type}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-zinc-900">
                    ₹{b.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
