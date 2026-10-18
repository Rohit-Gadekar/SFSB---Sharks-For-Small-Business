import React, { useState } from 'react';
import {
  Building2,
  FileText,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  DollarSign,
  PieChart,
  Sparkles,
  UploadCloud,
  FileCheck2,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { Business, FundingCampaign, FinancialStatementYear, UserSession } from '../types';

interface ListingPortalViewProps {
  currentUser: UserSession;
  businesses: Business[];
  onAddOrUpdateBusiness: (business: Business) => void;
  onApproveBusiness: (businessId: string) => void;
  onNavigateToDiscover?: () => void;
  onSwitchToFounderPortal?: (businessId: string) => void;
}

const PRESET_CATEGORIES = [
  'Specialty Food & Bakery',
  'Craft Coffee & Roastery',
  'Sustainable Textiles & Apparel',
  'Wellness & Clean Beauty',
  'Clean Energy & Agritech',
  'Handcrafted Decor & Artisan Goods',
];

export const ListingPortalView: React.FC<ListingPortalViewProps> = ({
  currentUser,
  businesses,
  onAddOrUpdateBusiness,
  onApproveBusiness,
  onNavigateToDiscover,
  onSwitchToFounderPortal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'pitch' | 'charges' | 'inspection'>('pitch');
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  // Find user's draft or active business
  const myBusiness =
    businesses.find((b) => b.id === currentUser.businessId) ||
    businesses.find((b) => b.listingStatus === 'under_inspection' || b.listingStatus === 'pending_payment') ||
    businesses[0];

  // Form states for business pitch
  const [name, setName] = useState<string>(myBusiness?.name || 'Artisan Mill & Kitchen');
  const [category, setCategory] = useState<string>(myBusiness?.category || PRESET_CATEGORIES[0]);
  const [tagline, setTagline] = useState<string>(
    myBusiness?.tagline || 'Slow-fermented artisan loaves & sustainable regional grains'
  );
  const [location, setLocation] = useState<string>(myBusiness?.location || 'Indiranagar, Bengaluru');
  const [foundedYear, setFoundedYear] = useState<number>(myBusiness?.foundedYear || 2023);
  const [description, setDescription] = useState<string>(
    myBusiness?.description ||
      'High-growth artisan kitchen producing organic stoneground sourdough loaves with verified direct farmer grain sourcing.'
  );

  // Pitch Narrative
  const [problem, setProblem] = useState<string>(
    myBusiness?.pitch?.problem ||
      'Commercial packaged bread relies heavily on chemical shelf-life extenders and emulsifiers. Local craft bakeries face 40% off-peak oven downtime.'
  );
  const [solution, setSolution] = useState<string>(
    myBusiness?.pitch?.solution ||
      'Deploying commercial retarder-proofers to scale high-margin corporate weekday breakfast catering across tech corridors.'
  );
  const [moat, setMoat] = useState<string>(
    myBusiness?.pitch?.moat ||
      '4-year sourdough mother culture, direct grain cooperative contracts, and 44% repeat neighborhood transaction rate.'
  );
  const [founderNote, setFounderNote] = useState<string>(
    myBusiness?.pitch?.founderNote ||
      'We built our reputation on quality and trust. Bringing in big believers allows our community to participate directly in our next expansion.'
  );

  // Deal Structure & Financials
  const [structure, setStructure] = useState<'BOND' | 'EQUITY' | 'REV_SHARE'>(
    myBusiness?.campaign?.structure || 'EQUITY'
  );
  const [targetAmount, setTargetAmount] = useState<number>(myBusiness?.campaign?.targetAmount || 1500000);
  const [revenueLakhs, setRevenueLakhs] = useState<number>(myBusiness?.metrics?.revenueLakhs || 36.5);
  const [grossMargin, setGrossMargin] = useState<number>(myBusiness?.metrics?.grossMargin || 61.0);
  const [operatingMargin, setOperatingMargin] = useState<number>(myBusiness?.metrics?.operatingMargin || 15.5);
  const [equityValuation, setEquityValuation] = useState<number>(
    myBusiness?.campaign?.equityValuation || 22000000
  );
  const [sharePrice, setSharePrice] = useState<number>(myBusiness?.campaign?.sharePrice || 100);
  const [revSharePct, setRevSharePct] = useState<number>(
    myBusiness?.campaign?.revenueSharePercentage || 2.5
  );
  const [bondYield, setBondYield] = useState<number>(myBusiness?.campaign?.bondReturnRate || 9.0);

  // Status computation
  const currentStatus = myBusiness?.listingStatus || 'under_inspection';
  const isFeePaid = myBusiness?.platformFeePaid ?? true;

  const handleSaveAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedBiz: Business = {
      ...myBusiness,
      name,
      tagline,
      category,
      location,
      foundedYear,
      description,
      pitch: {
        problem,
        solution,
        moat,
        founderNote,
      },
      metrics: {
        ...myBusiness.metrics,
        revenueLakhs,
        grossMargin,
        operatingMargin,
      },
      campaign: {
        ...myBusiness.campaign,
        structure,
        targetAmount,
        equityValuation: structure === 'EQUITY' ? equityValuation : undefined,
        sharePrice: structure === 'EQUITY' ? sharePrice : undefined,
        revenueSharePercentage: structure === 'REV_SHARE' ? revSharePct : undefined,
        bondReturnRate: structure === 'BOND' ? bondYield : undefined,
      },
      listingStatus: isFeePaid ? 'under_inspection' : 'pending_payment',
      platformFeePaid: isFeePaid,
      platformFeeAmount: 15000,
    };

    onAddOrUpdateBusiness(updatedBiz);
    setActiveSubTab('charges');
  };

  const handlePayFee = () => {
    setShowPaymentModal(false);
    setPaymentSuccess(true);
    const updatedBiz: Business = {
      ...myBusiness,
      platformFeePaid: true,
      platformFeeAmount: 15000,
      listingStatus: 'under_inspection',
    };
    onAddOrUpdateBusiness(updatedBiz);
    setTimeout(() => {
      setPaymentSuccess(false);
      setActiveSubTab('inspection');
    }, 1500);
  };

  const handleApprove = () => {
    onApproveBusiness(myBusiness.id);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-semibold border border-sky-200">
            <Building2 className="w-3.5 h-3.5 text-sky-600" />
            <span>Sfsb Business Listing & Diligence Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-2">
            List Your Business For Sharks
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed mt-1">
            Where small businesses meet big believers. Submit your sales pitch, pay platform vetting charges, and complete rigorous inspection before live listing in The Deal Tank.
          </p>
        </div>

        {/* Status Chip */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {currentStatus === 'approved' ? (
            <div className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Approved & Live in Deal Tank</span>
            </div>
          ) : (
            <div className="px-3.5 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Withheld: Under Platform Inspection</span>
            </div>
          )}
        </div>
      </div>

      {/* Persona Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-sm font-semibold">
        <button
          onClick={() => setActiveSubTab('pitch')}
          className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition-colors ${
            activeSubTab === 'pitch'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>1. Sales Pitch & Deal Terms</span>
        </button>

        <button
          onClick={() => setActiveSubTab('charges')}
          className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition-colors ${
            activeSubTab === 'charges'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>2. Platform Diligence Charges</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-sky-100 text-sky-800">
            ₹15,000
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('inspection')}
          className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition-colors ${
            activeSubTab === 'inspection'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>3. Inspection & Audit Pipeline</span>
          {currentStatus === 'approved' && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>
      </div>

      {/* ================= TAB 1: PITCH & DEAL TERMS ================= */}
      {activeSubTab === 'pitch' && (
        <form onSubmit={handleSaveAndSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-600" />
              <span>Venture Identity & High-Level Narrative</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Registered Business Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
                >
                  {PRESET_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Founded Year</label>
                <input
                  type="number"
                  value={foundedYear}
                  onChange={(e) => setFoundedYear(parseInt(e.target.value, 10) || 2023)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Overview Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
                />
              </div>
            </div>
          </div>

          {/* SFSB Sales Pitch Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>SFSB Shark Pitch Narrative</span>
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  The Market Problem / Main Street Pain Point
                </label>
                <textarea
                  rows={2}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Your Solution & Expansion Plan
                </label>
                <textarea
                  rows={2}
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Defensible Moat & Unit Economics
                </label>
                <textarea
                  rows={2}
                  value={moat}
                  onChange={(e) => setMoat(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Founder's Message to Big Believers
                </label>
                <textarea
                  rows={2}
                  value={founderNote}
                  onChange={(e) => setFounderNote(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Deal Structure & Capital Terms */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Deal Structure & Offering Terms</span>
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Choose Deal Structure for Sharks
                </label>
                <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setStructure('EQUITY')}
                    className={`py-2 px-2 text-center rounded-lg transition-all ${
                      structure === 'EQUITY'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Company Equity & Shares
                  </button>
                  <button
                    type="button"
                    onClick={() => setStructure('REV_SHARE')}
                    className={`py-2 px-2 text-center rounded-lg transition-all ${
                      structure === 'REV_SHARE'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Revenue Sharing (Monthly)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStructure('BOND')}
                    className={`py-2 px-2 text-center rounded-lg transition-all ${
                      structure === 'BOND'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Fixed Yield Bond
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Funding Target (₹)
                  </label>
                  <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(parseInt(e.target.value, 10) || 1000000)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">
                    ₹{(targetAmount / 100000).toFixed(1)} Lakhs
                  </span>
                </div>

                {structure === 'EQUITY' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Pre-Money Valuation (₹)
                      </label>
                      <input
                        type="number"
                        value={equityValuation}
                        onChange={(e) => setEquityValuation(parseInt(e.target.value, 10) || 20000000)}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
                      />
                      <span className="text-[10px] text-slate-500 font-mono">
                        ₹{(equityValuation / 10000000).toFixed(1)} Cr Valuation
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Share Price (₹)
                      </label>
                      <input
                        type="number"
                        value={sharePrice}
                        onChange={(e) => setSharePrice(parseInt(e.target.value, 10) || 100)}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
                      />
                      <span className="text-[10px] text-slate-500 font-mono">
                        {(targetAmount / sharePrice).toLocaleString()} Total Shares Offered
                      </span>
                    </div>
                  </>
                )}

                {structure === 'REV_SHARE' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Monthly Gross Rev Share %
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={revSharePct}
                        onChange={(e) => setRevSharePct(parseFloat(e.target.value) || 2.5)}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
                      />
                      <span className="text-[10px] text-slate-500 font-mono">
                        Distributed monthly to backers
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Repayment Cap Multiple
                      </label>
                      <input
                        type="number"
                        disabled
                        value={1.5}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                      />
                      <span className="text-[10px] text-slate-500 font-mono">
                        1.5x Return Cap Standard
                      </span>
                    </div>
                  </>
                )}

                {structure === 'BOND' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Annual Yield Coupon (% p.a.)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={bondYield}
                        onChange={(e) => setBondYield(parseFloat(e.target.value) || 9.0)}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
                      />
                      <span className="text-[10px] text-slate-500 font-mono">Quarterly coupon yield</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Tenure (Months)
                      </label>
                      <input
                        type="number"
                        disabled
                        value={36}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                      />
                      <span className="text-[10px] text-slate-500 font-mono">36 Months Debenture</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="py-3 px-6 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>Save Pitch & Proceed to Platform Diligence Fees</span>
              <ArrowRight className="w-4 h-4 text-sky-400" />
            </button>
          </div>
        </form>
      )}

      {/* ================= TAB 2: PLATFORM CHARGES ================= */}
      {activeSubTab === 'charges' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-sky-600" />
                  <span>Sfsb Platform Listing & Due-Diligence Charges</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  To safeguard community sharks, prevent spam, and maintain 100% audit integrity, every business pays an upfront platform due-diligence charge before committee review.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono uppercase text-slate-400 block">Platform Fee</span>
                <span className="text-3xl font-extrabold font-mono text-slate-900">₹15,000</span>
                <span className="text-[11px] text-slate-500 block font-mono">One-time flat fee</span>
              </div>
            </div>

            {/* Itemized Fee Breakdown */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-900 block uppercase font-mono tracking-wider">
                Itemized Audit Breakdown
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Forensic Ledger Audit</span>
                    <span className="text-xs font-mono font-bold text-slate-800">₹7,500</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    AI reconciliation of GST returns, P&L statements, POS terminal receipts, and bank deposit frequency.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Regulatory & Legal Vetting</span>
                    <span className="text-xs font-mono font-bold text-slate-800">₹4,500</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Entity registration check, director KYC verification, MCA filings, and compliance risk certification.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Escrow & Milestone Setup</span>
                    <span className="text-xs font-mono font-bold text-slate-800">₹3,000</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Contractual milestone escrow account creation, yield disbursement schedule, and backer cap-table ledgering.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Status Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {isFeePaid ? 'Diligence Fee Settled' : 'Payment Required'}
                </span>
                <span className="text-xs text-slate-500">
                  {isFeePaid
                    ? 'Platform charges have been paid. Receipt: #SFSB-AUDIT-99214 · GST Invoice Generated.'
                    : 'Pay the ₹15,000 diligence fee to unlock the SFSB Audit & Inspection stage.'}
                </span>
              </div>

              {isFeePaid ? (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Paid & Verified</span>
                  </span>
                  <button
                    onClick={() => setActiveSubTab('inspection')}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                  >
                    <span>Go to Inspection Stage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-xs"
                >
                  <CreditCard className="w-4 h-4 text-sky-400" />
                  <span>Pay Platform Diligence Fee (₹15,000)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: INSPECTION & AUDIT PIPELINE ================= */}
      {activeSubTab === 'inspection' && (
        <div className="space-y-6">
          {/* Important Notice */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-amber-950 block">
                Platform Rule: Venture Withheld From The Deal Tank During Inspection
              </span>
              <p className="text-amber-800 leading-relaxed">
                As requested by SFSB risk governance, newly listed enterprises are <strong>strictly withheld from the investor "The Deal Tank"</strong> page until all forensic ledgers are verified and committee sign-off is completed. Investors cannot search or allocate capital to this business yet.
              </p>
            </div>
          </div>

          {/* 4-Stage Audit Pipeline Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-sky-600" />
                  <span>SFSB Inspection & Due-Diligence Pipeline</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time verification gates before commercial public listing
                </p>
              </div>

              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                Stage 4 of 4
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {/* Gate 1 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Stage 1: Identity & Entity Registration Check
                    </span>
                    <span className="text-[11px] text-slate-500">
                      CIN, GSTIN, and Promoter PAN validated against government registries.
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  PASSED
                </span>
              </div>

              {/* Gate 2 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Stage 2: Platform Due-Diligence Fee Settlement
                    </span>
                    <span className="text-[11px] text-slate-500">
                      ₹15,000 diligence charge paid & escrow setup initialized.
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  SETTLED
                </span>
              </div>

              {/* Gate 3 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Stage 3: AI Forensic Financial & Margin Audit
                    </span>
                    <span className="text-[11px] text-slate-500">
                      SFSB AI Engine verified bank ledgers, 61% gross margin, and zero defaults.
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  AUDITED
                </span>
              </div>

              {/* Gate 4 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      currentStatus === 'approved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {currentStatus === 'approved' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Stage 4: SFSB Shark Investment Committee Sign-off
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {currentStatus === 'approved'
                        ? 'Sign-off complete! Vetting score: 92/100. Listing published to The Deal Tank.'
                        : 'Reviewing milestone disbursement rules & valuation terms for public launch.'}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    currentStatus === 'approved'
                      ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                      : 'text-amber-800 bg-amber-50 border-amber-200'
                  }`}
                >
                  {currentStatus === 'approved' ? 'APPROVED' : 'INSPECTION PENDING'}
                </span>
              </div>
            </div>

            {/* Approval Trigger Action */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Auditor & Committee Sign-off
                </span>
                <span className="text-[11px] text-slate-500">
                  {currentStatus === 'approved'
                    ? 'This venture is live. Big believers can inspect pitch and allocate capital in The Deal Tank.'
                    : 'Click below to complete final inspection and approve this business directly into The Deal Tank.'}
                </span>
              </div>

              {currentStatus !== 'approved' ? (
                <button
                  onClick={handleApprove}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Pass Platform Inspection & Approve to Deal Tank</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {onNavigateToDiscover && (
                    <button
                      onClick={onNavigateToDiscover}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <span>View in The Deal Tank</span>
                      <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                    </button>
                  )}
                  {onSwitchToFounderPortal && (
                    <button
                      onClick={() => onSwitchToFounderPortal(myBusiness.id)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Manage as Founder
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Diligence Payment Gateway Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-6 space-y-5 shadow-xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-600" />
                <span className="text-sm font-bold text-slate-900">
                  SFSB Platform Diligence Gateway
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
                ₹15,000
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Enterprise:</span>
                <span className="font-bold text-slate-900">{name}</span>
              </div>
              <div className="flex justify-between">
                <span>Diligence Service:</span>
                <span>Audit & Forensic Ledger Vetting</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18% included):</span>
                <span>₹2,288</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Payment Method (Verified Platform Gateway)
              </label>
              <div className="p-3 border border-slate-200 rounded-lg bg-sky-50/50 flex items-center justify-between text-xs text-slate-800">
                <span>SFSB Instant Escrow Settlement</span>
                <span className="text-[10px] font-mono text-sky-700 font-bold">READY</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePayFee}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center justify-center gap-2"
              >
                <span>Authorize ₹15,000</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
