import React, { useState, useEffect } from 'react';
import { RefreshCw, Calculator, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { Business } from '../types';
import { runScenarioSimulation, ScenarioResult } from '../services/apiService';

interface ScenarioSimulatorProps {
  business: Business;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ business }) => {
  const [growthRate, setGrowthRate] = useState<number>(15);
  const [costInflation, setCostInflation] = useState<number>(8);
  const [marketingSpend, setMarketingSpend] = useState<number>(50000);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ScenarioResult | null>(null);

  const calculate = async () => {
    setLoading(true);
    try {
      const data = await runScenarioSimulation(business, growthRate, costInflation, marketingSpend);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculate();
  }, [business.id]);

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-zinc-700" />
            <h3 className="text-base font-semibold text-zinc-900">
              Scenario Stress Analysis ("What If?")
            </h3>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Deterministic sensitivity analysis under variable revenue trajectories and inflation pressures
          </p>
        </div>

        <button
          onClick={calculate}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Run Scenario
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-zinc-700">Annual Revenue Growth</span>
            <span className="font-mono font-semibold text-zinc-900">{growthRate > 0 ? `+${growthRate}%` : `${growthRate}%`}</span>
          </div>
          <input
            type="range"
            min="-10"
            max="40"
            step="1"
            value={growthRate}
            onChange={(e) => setGrowthRate(parseInt(e.target.value, 10))}
            className="w-full accent-zinc-900 cursor-pointer h-1.5 bg-zinc-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
            <span>-10% (Downside)</span>
            <span>+15% (Baseline)</span>
            <span>+40% (Upside)</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-zinc-700">Cost & Ingredient Inflation</span>
            <span className="font-mono font-semibold text-zinc-900">+{costInflation}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            step="1"
            value={costInflation}
            onChange={(e) => setCostInflation(parseInt(e.target.value, 10))}
            className="w-full accent-zinc-900 cursor-pointer h-1.5 bg-zinc-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
            <span>0% (Stable)</span>
            <span>8% (Current trend)</span>
            <span>25% (High shock)</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-zinc-700">Pilot Marketing Budget</span>
            <span className="font-mono font-semibold text-zinc-900">₹{(marketingSpend / 1000).toFixed(0)}k</span>
          </div>
          <input
            type="range"
            min="0"
            max="200000"
            step="10000"
            value={marketingSpend}
            onChange={(e) => setMarketingSpend(parseInt(e.target.value, 10))}
            className="w-full accent-zinc-900 cursor-pointer h-1.5 bg-zinc-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
            <span>₹0 (Organic)</span>
            <span>₹50,000</span>
            <span>₹2,00,000 (Aggressive)</span>
          </div>
        </div>
      </div>

      {result && (
        <div className="pt-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
              <span className="text-[11px] font-mono text-zinc-400 block">Projected Revenue</span>
              <span className="text-lg font-mono font-semibold text-zinc-900">
                ₹{result.projectedRevenue}L
              </span>
              <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
                Base: ₹{business.metrics.revenueLakhs}L
              </span>
            </div>

            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
              <span className="text-[11px] font-mono text-zinc-400 block">Projected Expenses</span>
              <span className="text-lg font-mono font-semibold text-zinc-900">
                ₹{result.projectedExpenses}L
              </span>
              <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
                Base: ₹{business.metrics.expensesLakhs}L
              </span>
            </div>

            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
              <span className="text-[11px] font-mono text-zinc-400 block">Operating Profit</span>
              <span
                className={`text-lg font-mono font-semibold ${
                  result.projectedOperatingProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                ₹{result.projectedOperatingProfit}L
              </span>
              <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">Net cash buffer</span>
            </div>

            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
              <span className="text-[11px] font-mono text-zinc-400 block">Operating Margin</span>
              <span
                className={`text-lg font-mono font-semibold ${
                  result.projectedMargin >= 10 ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {result.projectedMargin}%
              </span>
              <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
                Current: {business.metrics.operatingMargin}%
              </span>
            </div>
          </div>

          <div className="p-4 bg-zinc-900 text-zinc-100 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-zinc-300" />
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-300">
                Intelligence Interpretation
              </span>
            </div>
            <p className="text-xs text-zinc-200 leading-relaxed font-sans">
              {result.interpretation}
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-zinc-400 border-t border-zinc-800">
              <span>Formula: Revenue * (1 + g) - [Expenses * (1 + i) + Marketing]</span>
              <span className="text-emerald-400">CALCULATED</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
