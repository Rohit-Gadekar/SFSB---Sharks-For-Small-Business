import React, { useState } from 'react';
import {
  TrendingUp,
  Target,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Compass,
  PieChart,
  Layers,
  Edit3,
} from 'lucide-react';
import { Business, GrowthOpportunity } from '../types';
import { EvidenceBadge } from './EvidenceBadge';

interface GrowthAdvisoryViewProps {
  business: Business;
  onDeployPlanToCampaign: (plan: {
    title: string;
    targetAmount: number;
    useOfFunds: Array<{ label: string; amountLakhs: number; sharePercent: number }>;
  }) => void;
  onNavigateToCapital: (businessId: string) => void;
}

export const GrowthAdvisoryView: React.FC<GrowthAdvisoryViewProps> = ({
  business,
  onDeployPlanToCampaign,
  onNavigateToCapital,
}) => {
  const [selectedOpp, setSelectedOpp] = useState<GrowthOpportunity>(
    business.growthOpportunities[0]
  );

  const [activePlan, setActivePlan] = useState<{
    title: string;
    targetAmount: number;
    useOfFunds: Array<{ label: string; amountLakhs: number; sharePercent: number }>;
    milestones: Array<{ month: string; goal: string }>;
  }>({
    title: 'Commercial Weekday Office Catering Expansion',
    targetAmount: 800000,
    useOfFunds: [
      { label: 'Thermal Retarder Proofer & Ovens', amountLakhs: 3.5, sharePercent: 43.8 },
      { label: 'Catering Transport & Thermal Crates', amountLakhs: 1.5, sharePercent: 18.7 },
      { label: 'Bulk Organic Grain Procurement', amountLakhs: 2.0, sharePercent: 25.0 },
      { label: 'Corporate Pilot Marketing & Portal', amountLakhs: 1.0, sharePercent: 12.5 },
    ],
    milestones: [
      { month: 'Month 1', goal: 'Acquire 3 corporate breakfast pilot accounts in Hitec City' },
      { month: 'Month 2', goal: 'Commission commercial retarder proofer oven to expand bake window' },
      { month: 'Month 3', goal: 'Reach ₹50,000 monthly recurring catering revenue' },
      { month: 'Month 4', goal: 'Achieve ₹75,000 run-rate with 15% reduction in morning waste' },
    ],
  });

  const [planGenerated, setPlanGenerated] = useState<boolean>(true);
  const [deploySuccess, setDeploySuccess] = useState<boolean>(false);

  const handleSelectOpp = (opp: GrowthOpportunity) => {
    setSelectedOpp(opp);
    setPlanGenerated(true);
    setDeploySuccess(false);
  };

  const handleDeploy = () => {
    onDeployPlanToCampaign(activePlan);
    setDeploySuccess(true);
    setTimeout(() => {
      onNavigateToCapital(business.id);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 text-xs font-mono">
          <Target className="w-3.5 h-3.5 text-zinc-800" />
          <span>Strategic Advisory Engine</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Enterprise strategy for {business.name}
        </h1>
        <p className="text-sm text-zinc-600 max-w-2xl leading-relaxed">
          Rigorous analysis of capacity utilization, customer repeat trends, and local B2B demand to construct executable capital allocation plans.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
            <PieChart className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500">Pillar 1: Finance</h3>
          <p className="text-xs text-zinc-700 font-medium leading-snug">
            Protect 58% gross margin against 14% ingredient cost inflation.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
            <Compass className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500">Pillar 2: Strategy</h3>
          <p className="text-xs text-zinc-700 font-medium leading-snug">
            Monetize 42% weekday morning oven idle capacity with B2B catering.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500">Pillar 3: Market</h3>
          <p className="text-xs text-zinc-700 font-medium leading-snug">
            Capitalize on +28% corporate tech corridor breakfast catering demand.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
            <DollarSign className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500">Pillar 4: Capital</h3>
          <p className="text-xs text-zinc-700 font-medium leading-snug">
            Raise ₹8L structured community bond with 8.5% illustrative yield.
          </p>
        </div>
      </div>

      {/* Main Section: Opportunity Selector & Plan Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Opportunity List */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900">
            Identified Growth Initiatives ({business.growthOpportunities.length})
          </h3>

          <div className="space-y-3">
            {business.growthOpportunities.map((opp) => {
              const isSelected = selectedOpp.id === opp.id;
              return (
                <div
                  key={opp.id}
                  onClick={() => handleSelectOpp(opp)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                      : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider ${
                        isSelected ? 'text-zinc-400' : 'text-zinc-500'
                      }`}
                    >
                      {opp.category}
                    </span>
                    <EvidenceBadge
                      tag={opp.evidenceTag}
                      className={isSelected ? 'bg-zinc-800 text-zinc-200 border-zinc-700' : ''}
                    />
                  </div>

                  <h4 className="text-sm font-semibold mt-2 leading-snug">{opp.title}</h4>
                  <p
                    className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${
                      isSelected ? 'text-zinc-300' : 'text-zinc-600'
                    }`}
                  >
                    {opp.whyNow}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-zinc-200/20 flex items-center justify-between text-xs">
                    <span className={isSelected ? 'text-zinc-400' : 'text-zinc-500'}>
                      Cost: <span className="font-mono font-medium">{opp.implementationCost}</span>
                    </span>
                    <span
                      className={`font-mono font-semibold ${
                        isSelected ? 'text-emerald-400' : 'text-emerald-700'
                      }`}
                    >
                      Impact: {opp.expectedImpact}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Capital Execution Plan Generator */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-zinc-200 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                Executable Initiative Plan
              </span>
              <h3 className="text-base font-bold text-zinc-900 mt-0.5">{selectedOpp.title}</h3>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Confidence: {selectedOpp.confidence}
            </span>
          </div>

          {/* Why Now & Pilot */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-zinc-900 block">Strategic Thesis</span>
              <p className="text-xs text-zinc-600 leading-relaxed mt-1">{selectedOpp.whyNow}</p>
            </div>

            <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-100 space-y-1">
              <span className="text-xs font-semibold text-zinc-800 block">
                Recommended 4-Week Experiment
              </span>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {selectedOpp.recommendedExperiment}
              </p>
            </div>
          </div>

          {/* Allocation of Capital */}
          <div className="space-y-3 pt-2 border-t border-zinc-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-900">Capital Requirement Breakdown</span>
              <span className="font-mono font-bold text-zinc-900">₹8,00,000 Target</span>
            </div>

            <div className="space-y-2">
              {activePlan.useOfFunds.map((u, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-600">{u.label}</span>
                    <span className="font-mono font-medium text-zinc-900">
                      ₹{u.amountLakhs}L ({u.sharePercent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-800 rounded-full" style={{ width: `${u.sharePercent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-2.5 pt-2 border-t border-zinc-100">
            <span className="text-xs font-semibold text-zinc-900 block">Accountability Milestones</span>
            <div className="space-y-2">
              {activePlan.milestones.map((m, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-700">
                  <span className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 flex items-center justify-center text-[10px] font-mono shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-mono font-medium text-zinc-900 mr-1.5">{m.month}:</span>
                    <span className="text-zinc-600">{m.goal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deploy Action */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
            <div className="text-[11px] text-zinc-500 font-mono">
              Target outcome: {selectedOpp.successMetric}
            </div>

            <button
              onClick={handleDeploy}
              disabled={deploySuccess}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                deploySuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
              }`}
            >
              {deploySuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Campaign Updated</span>
                </>
              ) : (
                <>
                  <span>Deploy to Campaign</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
