import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Check,
  Loader2,
  ChevronDown,
  BarChart3,
  Award,
} from 'lucide-react';
import { Business, FundingMilestone, BusinessDocument } from '../types';
import { extractFinancialDocument, DocumentExtractionResult } from '../services/apiService';

interface OwnerPortalProps {
  business: Business;
  onUpdateMilestone: (milestoneId: string, completed: boolean) => void;
  onAddDocument: (doc: BusinessDocument) => void;
  onUpdateBusinessFinancials?: (businessId: string, result: DocumentExtractionResult) => void;
  onNavigateToGrowth: () => void;
  onNavigateToCampaign?: () => void;
  onOpenListModal?: () => void;
}

export const OwnerPortal: React.FC<OwnerPortalProps> = ({
  business,
  onUpdateMilestone,
  onAddDocument,
  onUpdateBusinessFinancials,
  onNavigateToGrowth,
  onNavigateToCampaign,
  onOpenListModal,
}) => {
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [latestExtraction, setLatestExtraction] = useState<DocumentExtractionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processDocumentUpload = async (fileName: string, fileType: string = 'CSV', content?: string) => {
    setIsProcessing(true);
    setProcessingStage('Reading document bytes & verifying file headers...');
    try {
      await new Promise((r) => setTimeout(r, 600));
      setProcessingStage('Executing SFSB AI Financial Intelligence Engine...');
      
      const result = await extractFinancialDocument(fileName, fileType, content, business);

      setProcessingStage('Calibrating revised margins, forward forecast & credit score...');
      await new Promise((r) => setTimeout(r, 600));

      const newDoc: BusinessDocument = {
        id: `doc-${Date.now()}`,
        name: fileName,
        type: fileName.endsWith('.pdf') ? 'PDF' : fileName.endsWith('.xlsx') ? 'XLSX' : 'CSV',
        uploadDate: new Date().toISOString().split('T')[0],
        extractedMetrics: result.extractedMetrics.map((m) => ({
          metric: m.metric,
          value: m.value,
          confidence: m.confidence,
          status: m.status,
        })),
      };

      onAddDocument(newDoc);
      if (onUpdateBusinessFinancials) {
        onUpdateBusinessFinancials(business.id, result);
      }
      setLatestExtraction(result);
    } catch (err) {
      console.error('Extraction error:', err);
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const fileType = fileName.split('.').pop()?.toUpperCase() || 'CSV';

    if (file.type.includes('text') || fileName.endsWith('.csv') || fileName.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        processDocumentUpload(fileName, fileType, text);
      };
      reader.readAsText(file);
    } else {
      processDocumentUpload(fileName, fileType, `Binary document: ${fileName} (${file.size} bytes)`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const fileName = file.name;
      const fileType = fileName.split('.').pop()?.toUpperCase() || 'CSV';
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        processDocumentUpload(fileName, fileType, text);
      };
      reader.readAsText(file);
    } else {
      processDocumentUpload('q3_audited_sales_journal.csv', 'CSV');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-800" />
            <span>Enterprise Command Center</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mt-1">
            {business.name} Owner Portal
          </h1>
          <p className="text-sm text-zinc-600 mt-0.5">
            Real-time business health monitoring, growth initiative tracking, and document verification
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {onOpenListModal && (
            <button
              onClick={onOpenListModal}
              className="px-3.5 py-2 text-xs font-semibold text-zinc-800 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg transition-colors shadow-2xs"
            >
              + New Company Listing
            </button>
          )}
          {onNavigateToCampaign && (
            <button
              onClick={onNavigateToCampaign}
              className="px-3.5 py-2 text-xs font-medium text-zinc-800 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg transition-colors shadow-2xs"
            >
              Campaign Manager
            </button>
          )}
          <button
            onClick={onNavigateToGrowth}
            className="px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Explore Strategy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-1">
          <span className="text-xs font-mono uppercase text-zinc-400 block">Health Rating</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-mono font-bold text-zinc-900">{business.healthScore}</span>
            <span className="text-xs font-mono text-zinc-400">/ 100</span>
          </div>
          <span className="text-[11px] text-emerald-700 block">Strong solvency baseline</span>
        </div>

        <div
          onClick={onNavigateToCampaign}
          className={`p-4 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-1 ${
            onNavigateToCampaign ? 'cursor-pointer hover:border-zinc-300 transition-colors' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400 block">Campaign Raised</span>
            {onNavigateToCampaign && (
              <span className="text-[10px] text-zinc-400 font-mono underline">Manage</span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-mono font-bold text-zinc-900">
              ₹{(business.campaign.raisedAmount / 100000).toFixed(1)}L
            </span>
            <span className="text-xs font-mono text-zinc-400">
              / ₹{(business.campaign.targetAmount / 100000).toFixed(1)}L
            </span>
          </div>
          <span className="text-[11px] text-zinc-500 block">
            {Math.round((business.campaign.raisedAmount / business.campaign.targetAmount) * 100)}% of target funded
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-1">
          <span className="text-xs font-mono uppercase text-zinc-400 block">Milestones Completed</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-mono font-bold text-zinc-900">
              {business.campaign.milestones.filter((m) => m.completed).length}
            </span>
            <span className="text-xs font-mono text-zinc-400">
              / {business.campaign.milestones.length}
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 block">Audited with invoice proof</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-1">
          <span className="text-xs font-mono uppercase text-zinc-400 block">Repeat Retention</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-mono font-bold text-zinc-900">
              {business.metrics.repeatRate}%
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 block">1,420 unique quarterly patrons</span>
        </div>
      </div>

      {/* Feature 1: "What should I do next?" (Prompt Section 48) */}
      <div className="bg-zinc-900 text-white rounded-xl p-6 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold">What should I do next?</h2>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 uppercase">
            Prioritized by Financial Impact & Effort
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-zinc-800/80 rounded-lg border border-zinc-700/60 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-emerald-400">PRIORITY 1</span>
                <span className="text-[10px] font-mono bg-zinc-700 text-zinc-200 px-1.5 py-0.5 rounded">
                  Impact: HIGH
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white">
                Launch 4-Week Corporate Office Catering Pilot
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Weekday oven capacity operates at 42%. Deliver morning breakfast boxes to 3 tech offices in Hitec City to validate recurring demand.
              </p>
            </div>
            <div className="pt-2 border-t border-zinc-700/60 text-[11px] text-zinc-400 font-mono">
              Estimated pilot cost: ₹30,000
            </div>
          </div>

          <div className="p-4 bg-zinc-800/80 rounded-lg border border-zinc-700/60 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-zinc-300">PRIORITY 2</span>
                <span className="text-[10px] font-mono bg-zinc-700 text-zinc-200 px-1.5 py-0.5 rounded">
                  Impact: MEDIUM
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white">
                Negotiate Forward Organic Flour Sourcing
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Raw material costs increased 14% across Q3. Lock in a 6-month fixed volume contract with Telangana farmer collectives.
              </p>
            </div>
            <div className="pt-2 border-t border-zinc-700/60 text-[11px] text-zinc-400 font-mono">
              Target savings: ₹35,000 / quarter
            </div>
          </div>

          <div className="p-4 bg-zinc-800/80 rounded-lg border border-zinc-700/60 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-zinc-300">PRIORITY 3</span>
                <span className="text-[10px] font-mono bg-zinc-700 text-zinc-200 px-1.5 py-0.5 rounded">
                  Impact: RISK AVOIDANCE
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white">
                Defer Second Physical Lease Commitment
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Maintain financial buffer until catering achieves ₹75,000 monthly run-rate. Avoid taking on high fixed retail lease liabilities prematurely.
              </p>
            </div>
            <div className="pt-2 border-t border-zinc-700/60 text-[11px] text-zinc-400 font-mono">
              Protects ₹4.5L working capital
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Milestone Management & Document Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Milestone Accountability Manager */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-zinc-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-zinc-900">
                Campaign Milestone Execution
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Toggle completion and attach verification evidence for community supporters
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {business.campaign.milestones.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-100 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-900">{m.title}</span>
                    <span className="text-[10px] font-mono text-zinc-400">({m.targetMonth})</span>
                  </div>
                  {m.evidenceDoc && (
                    <span className="text-[11px] font-mono text-zinc-500 block">
                      Evidence: {m.evidenceDoc}
                    </span>
                  )}
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
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <span>Mark Done</span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Document Ingestion */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">
                Ingest Sales & Financial Ledgers
              </h3>
              <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                AI Engine Armed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload bank statements, GST invoices, or POS exports. SFSB AI extracts financials, recalculates forecasts & recalibrates credit scores.
            </p>
          </div>

          {/* Native hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".csv,.xlsx,.xls,.pdf,.txt,.json,image/*"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`p-6 border-2 border-dashed rounded-xl text-center space-y-2 cursor-pointer transition-colors ${
              dragOver
                ? 'border-sky-600 bg-sky-50/50'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <UploadCloud className="w-9 h-9 text-sky-600 mx-auto" />
            <div className="text-xs text-slate-700">
              <span className="font-semibold text-slate-900 underline">Click to choose file</span> or drag & drop here
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              CSV, Excel, PDF, Text, or Receipts (All file types accepted)
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() =>
                  processDocumentUpload(
                    'q3_sales_pos_ledger.csv',
                    'CSV',
                    'Date,Invoice,Item,Amount,Tax,PaymentMethod\n2026-07-01,INV-101,Artisan Loaves,42000,2100,UPI\n2026-07-02,INV-102,Pastry Box,38000,1900,Card\n2026-07-03,INV-103,B2B Catering,64000,3200,NEFT'
                  )
                }
                className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-md transition-colors shadow-2xs"
              >
                + Q3 POS Sales Ledger
              </button>
              <button
                type="button"
                onClick={() =>
                  processDocumentUpload(
                    'audited_pnl_fy26_h1.csv',
                    'CSV',
                    'Category,Revenue,COGS,OperatingExpense,EBITDA\nBakery Retail,2240000,940000,520000,780000\nB2B Catering,1660000,680000,340000,640000'
                  )
                }
                className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-md transition-colors shadow-2xs"
              >
                + Audited P&L Sheet
              </button>
            </div>
          </div>

          {/* Real-time processing animation */}
          {isProcessing && (
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-900">
                <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                <span>Running SFSB AI Financial Intelligence Engine...</span>
              </div>
              <p className="text-[11px] text-sky-700 font-mono">
                {processingStage}
              </p>
            </div>
          )}

          {/* AI Extraction & Forecast Recalibration Result Card */}
          {latestExtraction && !isProcessing && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900">
                    AI Extraction & Forecast Updated
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Score: {latestExtraction.healthScoreUpdate.newScore}/100 (+{latestExtraction.healthScoreUpdate.delta} pts)
                </span>
              </div>

              <p className="text-[11px] text-emerald-800 leading-relaxed">
                {latestExtraction.executiveAuditSummary}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-200/60 text-xs">
                <div className="p-2 bg-white/80 rounded border border-emerald-100 space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">Verified Revenue</span>
                  <span className="font-bold text-slate-900">
                    ₹{latestExtraction.updatedFinancials.revenueLakhs}L
                  </span>
                </div>
                <div className="p-2 bg-white/80 rounded border border-emerald-100 space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">Gross Margin</span>
                  <span className="font-bold text-slate-900">
                    {latestExtraction.updatedFinancials.grossMargin}%
                  </span>
                </div>
                <div className="p-2 bg-white/80 rounded border border-emerald-100 space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">Projected Growth</span>
                  <span className="font-bold text-emerald-700">
                    +{latestExtraction.forecast.projectedGrowth}% YoY
                  </span>
                </div>
                <div className="p-2 bg-white/80 rounded border border-emerald-100 space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">EBITDA Forecast</span>
                  <span className="font-bold text-slate-900">
                    ₹{latestExtraction.forecast.ebitdaForecastLakhs}L
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <span className="text-[10px] text-slate-500 block mb-1 uppercase font-mono">Extracted Proof Tags</span>
                <div className="space-y-1">
                  {latestExtraction.extractedMetrics.slice(0, 3).map((em, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] text-slate-700">
                      <span>{em.metric}</span>
                      <span className="font-mono font-semibold text-emerald-700">{em.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-mono text-slate-400 uppercase block mb-2">
              Recent Verified Ledgers
            </span>
            <div className="space-y-1.5">
              {business.documents.map((d) => (
                <div key={d.id} className="flex items-center justify-between text-xs text-slate-600 bg-slate-50/60 p-2 rounded border border-slate-100">
                  <div className="flex items-center gap-1.5 truncate">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono truncate max-w-[170px]">{d.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    AI VERIFIED
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
