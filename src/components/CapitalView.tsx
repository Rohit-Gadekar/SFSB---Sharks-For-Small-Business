import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Shield,
  CheckCircle2,
  Clock,
  FileCheck,
  ArrowRight,
  CreditCard,
  QrCode,
  Building,
  Lock,
  X,
  Smartphone,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Business, PortfolioInvestment } from '../types';

interface CapitalViewProps {
  business: Business;
  onBackBusiness: (investment: PortfolioInvestment) => void;
  onNavigateToPortfolio: () => void;
}

type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'escrow';

export const CapitalView: React.FC<CapitalViewProps> = ({
  business,
  onBackBusiness,
  onNavigateToPortfolio,
}) => {
  const [structure, setStructure] = useState<'BOND' | 'EQUITY' | 'REV_SHARE'>('BOND');
  const [allocationAmount, setAllocationAmount] = useState<number>(10000);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Payment Gateway Modal State
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');
  const [upiApp, setUpiApp] = useState<string>('PhonePe');
  const [upiId, setUpiId] = useState<string>('shark@okhdfcbank');
  const [cardNumber, setCardNumber] = useState<string>('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState<string>('08/28');
  const [cardCvv, setCardCvv] = useState<string>('419');
  const [cardName, setCardName] = useState<string>('Community Shark Investor');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [paymentComplete, setPaymentComplete] = useState<boolean>(false);
  const [completedTxnRef, setCompletedTxnRef] = useState<string>('');

  const campaign = business.campaign;
  const fundingPct = Math.round((campaign.raisedAmount / campaign.targetAmount) * 100);

  // 1. Bond Calculations
  const bondRate = campaign.bondReturnRate || 8.5;
  const tenureMonths = campaign.bondDurationMonths || 36;
  const bondYears = tenureMonths / 12;
  const annualCoupon = Math.round(allocationAmount * (bondRate / 100));
  const bondReturn = Math.round(allocationAmount * (bondRate / 100) * bondYears);
  const bondTotal = allocationAmount + bondReturn;

  // 2. Equity Calculations
  const equityValuation = campaign.equityValuation || 20000000;
  const sharePrice = campaign.sharePrice || 100;
  const sharesCount = Math.floor(allocationAmount / sharePrice);
  const equitySharePct = ((allocationAmount / equityValuation) * 100).toFixed(4);

  // 3. Revenue Sharing Calculations
  const baseCampaignRevShare = campaign.revenueSharePercentage || 2.5;
  const revSharePct = Number(
    ((allocationAmount / (campaign.targetAmount || 1000000)) * baseCampaignRevShare).toFixed(3)
  );
  const capMultiple = campaign.capMultiple || 1.5;
  const totalReturnCap = Math.round(allocationAmount * capMultiple);
  const monthlyRevenueBase = (business.metrics.revenueLakhs * 100000) / 12;
  const estimatedMonthlyPayout = Math.round(monthlyRevenueBase * (revSharePct / 100));

  const handleOpenPayment = () => {
    setPaymentComplete(false);
    setIsProcessing(false);
    setShowPaymentModal(true);
  };

  const handleExecutePayment = () => {
    setIsProcessing(true);
    setProcessingStage('Connecting to Banking Gateway & 256-bit Escrow...');

    setTimeout(() => {
      setProcessingStage('Validating Anti-Money Laundering & Investor Limits...');
    }, 900);

    setTimeout(() => {
      setProcessingStage('Minting Cap Table Allotment & Digital Certificate...');
    }, 1800);

    setTimeout(() => {
      const txnRef = `TXN-SFSB-${Date.now().toString().slice(-6)}`;
      setCompletedTxnRef(txnRef);
      setIsProcessing(false);
      setPaymentComplete(true);

      let projectedOutcome = '';
      if (structure === 'BOND') {
        projectedOutcome = `${bondRate}% p.a. yield (${tenureMonths} mos · ₹${bondReturn.toLocaleString()} total coupon)`;
      } else if (structure === 'EQUITY') {
        projectedOutcome = `${equitySharePct}% equity ownership (${sharesCount.toLocaleString()} shares @ ₹${sharePrice})`;
      } else {
        projectedOutcome = `${revSharePct}% monthly revenue share (${capMultiple}x cap · Est. ₹${estimatedMonthlyPayout.toLocaleString()}/mo)`;
      }

      let methodLabel = '';
      if (paymentMethod === 'upi') methodLabel = `UPI (${upiApp})`;
      else if (paymentMethod === 'card') methodLabel = `Credit Card (Visa/Mastercard)`;
      else if (paymentMethod === 'netbanking') methodLabel = `Net Banking (${selectedBank})`;
      else methodLabel = `Virtual Escrow Wire`;

      const newInvestment: PortfolioInvestment = {
        id: `alloc-${Date.now()}`,
        businessId: business.id,
        businessName: business.name,
        amount: allocationAmount,
        date: new Date().toISOString().split('T')[0],
        structure,
        equityPercentage: structure === 'EQUITY' ? Number(equitySharePct) : undefined,
        sharesCount: structure === 'EQUITY' ? sharesCount : undefined,
        sharePrice: structure === 'EQUITY' ? sharePrice : undefined,
        valuationAtInvestment: structure === 'EQUITY' ? equityValuation : undefined,
        revenueSharePercentage: structure === 'REV_SHARE' ? revSharePct : undefined,
        capMultiple: structure === 'REV_SHARE' ? capMultiple : undefined,
        monthlyPayoutEstimate: structure === 'REV_SHARE' ? estimatedMonthlyPayout : undefined,
        bondInterestRate: structure === 'BOND' ? bondRate : undefined,
        tenureMonths: structure === 'BOND' ? tenureMonths : undefined,
        annualYield: structure === 'BOND' ? annualCoupon : undefined,
        projectedOutcome,
        impactShare: `Directly funds ${business.name}'s verified commercial capacity expansion and regional supplier procurement.`,
        status: 'Active',
        transactionRef: txnRef,
        paymentMethod: methodLabel,
      };

      onBackBusiness(newInvestment);
      setSuccessMessage(
        `Shark allocation of ₹${allocationAmount.toLocaleString()} to ${business.name} successfully verified (${txnRef}).`
      );
    }, 2700);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* SFSB Deal Room Header Banner */}
      <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 border border-sky-800/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-900/60 border border-sky-500/30 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <span className="font-semibold text-white block">
              SFSB Shark Deal Room · Where small businesses meet big believers
            </span>
            <span className="text-[11px] text-slate-400">
              Direct community capital with equity stakes, revenue sharing, contractual bond coupons, and milestone disbursements.
            </span>
          </div>
        </div>
      </div>

      {/* Main Campaign Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-sky-600 font-semibold">
              Vetted Growth Campaign
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
              {campaign.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Pitch by {business.name} · {business.location}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 uppercase">Target Raise</span>
            <p className="text-2xl font-mono font-bold text-slate-900">
              ₹{campaign.targetAmount.toLocaleString()}
            </p>
            <span className="text-xs font-mono text-emerald-600 font-medium">
              ₹{campaign.raisedAmount.toLocaleString()} raised ({fundingPct}%) · {campaign.supportersCount} sharks
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-sky-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, fundingPct)}%` }}
          />
        </div>
      </div>

      {/* 2-Column: Deal Structuring vs Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Structuring Calculator */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Select Shark Structure</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose between equity ownership, gross revenue share, or milestone-protected bond
            </p>
          </div>

          {/* Structure Selector */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setStructure('BOND')}
              className={`p-3 rounded-lg border text-left transition-all ${
                structure === 'BOND'
                  ? 'border-sky-600 bg-sky-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-bold text-slate-900 block">Fixed Bond</span>
              <span className="text-[11px] font-mono text-sky-700 font-semibold block mt-0.5">
                {bondRate}% p.a.
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Contractual coupon</span>
            </button>

            <button
              onClick={() => setStructure('EQUITY')}
              className={`p-3 rounded-lg border text-left transition-all ${
                structure === 'EQUITY'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-bold text-slate-900 block">Equity Stake</span>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold block mt-0.5">
                ₹{((equityValuation) / 10000000).toFixed(1)} Cr Val
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Direct shares</span>
            </button>

            <button
              onClick={() => setStructure('REV_SHARE')}
              className={`p-3 rounded-lg border text-left transition-all ${
                structure === 'REV_SHARE'
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-bold text-slate-900 block">Rev Share</span>
              <span className="text-[11px] font-mono text-indigo-700 font-semibold block mt-0.5">
                {baseCampaignRevShare}% of Sales
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">{capMultiple}x return cap</span>
            </button>
          </div>

          {/* Allocation Amount Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700">Allocation Amount</label>
              <span className="text-base font-mono font-bold text-slate-900">
                ₹{allocationAmount.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="2500"
              max="200000"
              step="2500"
              value={allocationAmount}
              onChange={(e) => setAllocationAmount(Number(e.target.value))}
              className="w-full accent-slate-900 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Min: ₹2,500</span>
              <span>₹50,000</span>
              <span>Max: ₹2,00,000</span>
            </div>
          </div>

          {/* Real-time Dynamic Financial Outcomes Box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-xs font-semibold text-slate-900">
                Projected Contractual Return
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Grounded in Verified Unit Economics
              </span>
            </div>

            {structure === 'BOND' && (
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Annual Coupon
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-900">
                    ₹{annualCoupon.toLocaleString()}/yr
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">Paid quarterly</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Total Coupon Yield
                  </span>
                  <span className="text-sm font-mono font-bold text-emerald-700">
                    ₹{bondReturn.toLocaleString()}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">Over {tenureMonths} mos</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Total Payout
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-900">
                    ₹{bondTotal.toLocaleString()}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">Principal + interest</span>
                </div>
              </div>
            )}

            {structure === 'EQUITY' && (
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Equity Owned
                  </span>
                  <span className="text-sm font-mono font-bold text-emerald-800">
                    {equitySharePct}% Stake
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">Direct registered</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Shares Acquired
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-900">
                    {sharesCount.toLocaleString()} Shares
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">@ ₹{sharePrice}/share</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Valuation Cap
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-900">
                    ₹{(equityValuation / 10000000).toFixed(1)} Cr
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">Pre-money valuation</span>
                </div>
              </div>
            )}

            {structure === 'REV_SHARE' && (
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Gross Rev Share
                  </span>
                  <span className="text-sm font-mono font-bold text-indigo-700">
                    {revSharePct}%
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">Of gross revenues</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Est. Monthly Payout
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-900">
                    ₹{estimatedMonthlyPayout.toLocaleString()}/mo
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">Direct ledger dividend</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Repayment Cap ({capMultiple}x)
                  </span>
                  <span className="text-sm font-mono font-bold text-emerald-700">
                    ₹{totalReturnCap.toLocaleString()}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">Until cap fulfilled</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Button: Opens Secure Payment Gateway Modal */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleOpenPayment}
              className="w-full py-3.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs group cursor-pointer"
            >
              <span>Back {business.name} as a Big Believer (₹{allocationAmount.toLocaleString()})</span>
              <ArrowRight className="w-4 h-4 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800 animate-in fade-in">
                <span>{successMessage}</span>
                <button
                  onClick={onNavigateToPortfolio}
                  className="font-semibold underline hover:text-emerald-900 ml-2"
                >
                  View in Shark Portfolio
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Accountability & Milestone Tracker */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-zinc-200 p-6 space-y-4 shadow-xs">
          <div>
            <h3 className="text-base font-semibold text-zinc-900">
              Accountability & Progress Proof
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Capital release is linked to verifiable execution milestones
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {campaign.milestones.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-100 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    {m.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <span className="text-xs font-semibold text-zinc-900 block">{m.title}</span>
                      <span className="text-[10px] font-mono text-zinc-500">{m.targetMonth}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      m.completed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {m.completed ? 'VERIFIED' : 'IN PROGRESS'}
                  </span>
                </div>

                {m.evidenceDoc && (
                  <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-1.5 pl-6 pt-1 border-t border-zinc-200/50">
                    <FileCheck className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="truncate">{m.evidenceDoc}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= REALISTIC PAYMENT GATEWAY MODAL ================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">
                    SFSB Escrow Payment Gateway
                  </h3>
                  <span className="text-[10px] font-mono text-sky-300">
                    256-Bit SSL Encrypted Escrow Allocation
                  </span>
                </div>
              </div>

              {!isProcessing && (
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {paymentComplete ? (
              /* Success Screen */
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-900">
                    Shark Allocation Confirmed!
                  </h4>
                  <p className="text-xs text-slate-600">
                    ₹{allocationAmount.toLocaleString()} has been securely locked in escrow and registered on {business.name}'s official cap table.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left text-xs space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Transaction Ref:</span>
                    <span className="font-bold text-slate-900">{completedTxnRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Venture:</span>
                    <span className="font-semibold text-slate-900">{business.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Structure:</span>
                    <span className="font-semibold text-emerald-700">
                      {structure === 'EQUITY'
                        ? `${equitySharePct}% Equity (${sharesCount} shares)`
                        : structure === 'REV_SHARE'
                        ? `${revSharePct}% Rev Share`
                        : `${bondRate}% Fixed Bond`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Method:</span>
                    <span className="text-slate-800">
                      {paymentMethod === 'upi' ? `UPI (${upiApp})` : paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'netbanking' ? selectedBank : 'Virtual Escrow Wire'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentModal(false);
                      onNavigateToPortfolio();
                    }}
                    className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View in My Shark Portfolio</span>
                    <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : isProcessing ? (
              /* Processing Screen */
              <div className="p-10 text-center space-y-5">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-sky-600 animate-spin" />
                  <Lock className="w-5 h-5 text-sky-600 absolute inset-0 m-auto" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900">
                    Processing Escrow Allocation
                  </h4>
                  <p className="text-xs text-slate-500 font-mono animate-pulse">
                    {processingStage}
                  </p>
                </div>
                <div className="text-[11px] text-slate-400">
                  Please do not refresh or close this window.
                </div>
              </div>
            ) : (
              /* Payment Options Interface */
              <div className="p-6 space-y-5">
                {/* Allocation Order Summary Banner */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">
                      Target Enterprise & Round
                    </span>
                    <span className="font-bold text-slate-900 block">{business.name}</span>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      {structure === 'EQUITY'
                        ? `${equitySharePct}% Equity (${sharesCount} shares)`
                        : structure === 'REV_SHARE'
                        ? `${revSharePct}% Rev Share (Est. ₹${estimatedMonthlyPayout}/mo)`
                        : `${bondRate}% Fixed Yield Coupon`}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">
                      Amount Due
                    </span>
                    <span className="text-xl font-mono font-bold text-slate-900 block">
                      ₹{allocationAmount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400">0% Convenience Fee</span>
                  </div>
                </div>

                {/* Payment Tabs: UPI, Card, Net Banking, Escrow */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                        paymentMethod === 'upi'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5 text-sky-600 mb-0.5" />
                      <span className="text-[11px]">UPI</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                        paymentMethod === 'card'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5 text-sky-600 mb-0.5" />
                      <span className="text-[11px]">Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                        paymentMethod === 'netbanking'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Building className="w-3.5 h-3.5 text-sky-600 mb-0.5" />
                      <span className="text-[11px]">Net Banking</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('escrow')}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                        paymentMethod === 'escrow'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5 text-sky-600 mb-0.5" />
                      <span className="text-[11px]">Wire/RTGS</span>
                    </button>
                  </div>
                </div>

                {/* TAB 1: UPI */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-3.5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-medium text-slate-700 block">
                        Popular UPI Apps
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                          <button
                            key={app}
                            type="button"
                            onClick={() => setUpiApp(app)}
                            className={`py-2 px-1.5 text-center text-xs font-semibold rounded-lg border transition-all ${
                              upiApp === app
                                ? 'bg-sky-50 text-sky-900 border-sky-300 shadow-2xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {app}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700 block">
                        Or Enter Virtual Payment Address (UPI ID)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="username@okhdfcbank"
                          className="w-full text-xs font-mono pl-3 pr-20 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 text-slate-900"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          VERIFIED
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: CREDIT / DEBIT CARD */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-slate-700">Card Number</label>
                        <span className="text-[10px] font-mono font-semibold text-slate-500">
                          Visa / Mastercard / RuPay
                        </span>
                      </div>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• 8921"
                        className="w-full text-xs font-mono px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 text-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700 block">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 text-slate-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700 block">CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={4}
                          placeholder="•••"
                          className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700 block">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Full Name as on card"
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 text-slate-900"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: NET BANKING */}
                {paymentMethod === 'netbanking' && (
                  <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="text-xs font-medium text-slate-700 block">
                      Select Bank for Net Banking
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setSelectedBank(b)}
                          className={`py-2 px-2 text-left text-xs font-medium rounded-lg border transition-all ${
                            selectedBank === b
                              ? 'bg-sky-50 text-sky-900 border-sky-300 font-semibold shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: ESCROW WIRE / RTGS */}
                {paymentMethod === 'escrow' && (
                  <div className="space-y-2.5 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-900 block">
                      Virtual Escrow Account Details (NEFT / RTGS)
                    </span>
                    <div className="space-y-1.5 font-mono text-[11px] bg-white p-3 rounded-lg border border-slate-200">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Beneficiary:</span>
                        <span className="font-bold text-slate-900">SFSB Escrow Trustee Pvt Ltd</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Virtual A/C No:</span>
                        <span className="font-bold text-slate-900">SFSB9821400291</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">IFSC Code:</span>
                        <span className="font-bold text-slate-900">YESB0000001</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      Funds transferred are held under independent escrow custody until milestone verification.
                    </span>
                  </div>
                )}

                {/* Security Guarantee Badge */}
                <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Secured by SFSB Milestone Escrow Trust · 100% principal protected until milestones are certified.
                  </span>
                </div>

                {/* Pay Button */}
                <button
                  type="button"
                  onClick={handleExecutePayment}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-sky-400" />
                  <span>Pay ₹{allocationAmount.toLocaleString()} via {paymentMethod === 'upi' ? `UPI (${upiApp})` : paymentMethod === 'card' ? 'Card' : paymentMethod === 'netbanking' ? selectedBank : 'Virtual Escrow'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
