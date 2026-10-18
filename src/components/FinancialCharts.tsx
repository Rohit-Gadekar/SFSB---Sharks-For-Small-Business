import React, { useState } from 'react';
import { FinancialStatementYear } from '../types';

interface FinancialChartsProps {
  historicals: FinancialStatementYear[];
}

export const FinancialCharts: React.FC<FinancialChartsProps> = ({ historicals }) => {
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'profit' | 'margins'>('revenue');

  const maxRevenue = Math.max(...historicals.map((h) => h.revenue), 1) * 1.15;

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Historical Performance Trends</h3>
          <p className="text-xs text-zinc-500">Multi-year operational trajectory (FY24 - FY26)</p>
        </div>

        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveMetric('revenue')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeMetric === 'revenue'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Revenue vs Expenses
          </button>
          <button
            onClick={() => setActiveMetric('profit')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeMetric === 'profit'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Operating Profit
          </button>
          <button
            onClick={() => setActiveMetric('margins')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeMetric === 'margins'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Margin Dynamics
          </button>
        </div>
      </div>

      {activeMetric === 'revenue' && (
        <div className="pt-2">
          <div className="h-48 w-full flex items-end gap-6 justify-center px-4">
            {historicals.map((item) => {
              const revHeight = (item.revenue / maxRevenue) * 100;
              const expHeight = (item.expenses / maxRevenue) * 100;
              return (
                <div key={item.year} className="flex-1 max-w-[120px] flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center gap-2 h-36">
                    <div
                      className="w-1/2 bg-zinc-900 rounded-t transition-all hover:bg-zinc-800 relative group"
                      style={{ height: `${revHeight}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-mono px-2 py-0.5 rounded pointer-events-none whitespace-nowrap z-10 transition-opacity">
                        Rev: ₹{item.revenue}L
                      </div>
                    </div>
                    <div
                      className="w-1/2 bg-zinc-300 rounded-t transition-all hover:bg-zinc-400 relative group"
                      style={{ height: `${expHeight}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] font-mono px-2 py-0.5 rounded pointer-events-none whitespace-nowrap z-10 transition-opacity">
                        Exp: ₹{item.expenses}L
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-mono font-medium text-zinc-800 block">
                      {item.year}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      ₹{item.revenue}L
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-6 pt-3 border-t border-zinc-100 text-xs text-zinc-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-zinc-900 rounded-xs" />
              <span>Revenue (Lakhs)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-zinc-300 rounded-xs" />
              <span>Total Expenses (Lakhs)</span>
            </div>
          </div>
        </div>
      )}

      {activeMetric === 'profit' && (
        <div className="pt-2">
          <div className="h-48 w-full flex items-end gap-6 justify-center px-4">
            {historicals.map((item) => {
              const maxProfit = Math.max(...historicals.map((h) => h.operatingProfit), 1) * 1.25;
              const height = (item.operatingProfit / maxProfit) * 100;
              return (
                <div key={item.year} className="flex-1 max-w-[120px] flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center h-36">
                    <div
                      className="w-12 bg-emerald-600 rounded-t transition-all hover:bg-emerald-700 relative group"
                      style={{ height: `${height}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-mono px-2 py-0.5 rounded pointer-events-none whitespace-nowrap z-10 transition-opacity">
                        Op Profit: ₹{item.operatingProfit}L
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-mono font-medium text-zinc-800 block">
                      {item.year}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                      ₹{item.operatingProfit}L
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-2 pt-3 border-t border-zinc-100 text-xs text-zinc-600">
            <span className="w-3 h-3 bg-emerald-600 rounded-xs" />
            <span>Operating Profit (₹ Lakhs)</span>
          </div>
        </div>
      )}

      {activeMetric === 'margins' && (
        <div className="pt-2">
          <div className="h-48 w-full flex items-center justify-center px-4">
            <div className="w-full max-w-md grid grid-cols-3 gap-4">
              {historicals.map((item) => (
                <div
                  key={item.year}
                  className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex flex-col items-center text-center space-y-1.5"
                >
                  <span className="text-xs font-mono text-zinc-500 uppercase">{item.year}</span>
                  <div>
                    <span className="text-xs text-zinc-400 block text-[10px]">Gross Margin</span>
                    <span className="text-base font-mono font-semibold text-zinc-900">
                      {item.grossMargin}%
                    </span>
                  </div>
                  <div className="pt-1 border-t border-zinc-200/60 w-full">
                    <span className="text-xs text-zinc-400 block text-[10px]">Operating Margin</span>
                    <span className="text-sm font-mono font-medium text-emerald-700">
                      {item.operatingMargin}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 pt-3 border-t border-zinc-100 text-xs text-zinc-500">
            <span>Gross margin reflects product pricing discipline.</span>
            <span>Operating margin reflects net unit efficiency.</span>
          </div>
        </div>
      )}
    </div>
  );
};
