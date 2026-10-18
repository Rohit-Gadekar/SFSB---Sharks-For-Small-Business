import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  FileText,
  DollarSign,
  TrendingUp,
  Sparkles,
  PieChart,
  Target,
  Image as ImageIcon,
} from 'lucide-react';
import { Business, FundingCampaign, FinancialStatementYear } from '../types';

interface ListBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (newBusiness: Business) => void;
}

const IMAGE_PRESETS = [
  {
    label: 'Artisan Kitchen & Bistro',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
  },
  {
    label: 'Craft Coffee & Roastery',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop',
  },
  {
    label: 'Mindful Apparel & Textiles',
    url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop',
  },
  {
    label: 'Botanical Wellness & Apothecary',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1608248597359-597525389f41?q=80&w=1200&auto=format&fit=crop',
  },
  {
    label: 'Organic Farm-to-Table Store',
    url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1200&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
  },
];

export const ListBusinessModal: React.FC<ListBusinessModalProps> = ({
  isOpen,
  onClose,
  onPublish,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('Specialty Food & Dining');
  const [tagline, setTagline] = useState<string>('');
  const [location, setLocation] = useState<string>('Indiranagar, Bengaluru');
  const [foundedYear, setFoundedYear] = useState<number>(2023);
  const [description, setDescription] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>(IMAGE_PRESETS[0].url);
  const [selectedCover, setSelectedCover] = useState<string>(IMAGE_PRESETS[0].cover);

  // Pitch Narrative
  const [problem, setProblem] = useState<string>('');
  const [solution, setSolution] = useState<string>('');
  const [moat, setMoat] = useState<string>('');
  const [founderNote, setFounderNote] = useState<string>('');

  // Financials
  const [revenueLakhs, setRevenueLakhs] = useState<number>(32.0);
  const [revenueGrowth, setRevenueGrowth] = useState<number>(28.5);
  const [grossMargin, setGrossMargin] = useState<number>(60.0);
  const [operatingMargin, setOperatingMargin] = useState<number>(15.0);
  const [repeatRate, setRepeatRate] = useState<number>(41.0);
  const [aov, setAov] = useState<number>(550);
  const [employees, setEmployees] = useState<number>(6);

  // Campaign Terms
  const [targetAmount, setTargetAmount] = useState<number>(1000000);
  const [structure, setStructure] = useState<'BOND' | 'EQUITY'>('BOND');
  const [bondReturnRate, setBondReturnRate] = useState<number>(9.0);
  const [equityValuation, setEquityValuation] = useState<number>(20000000);
  const [minAllocation, setMinAllocation] = useState<number>(2500);

  // Fund allocation
  const [fund1Label, setFund1Label] = useState<string>('Kitchen & Equipment Modernization');
  const [fund1Amount, setFund1Amount] = useState<number>(4.5);
  const [fund2Label, setFund2Label] = useState<string>('Corporate B2B Pilot & Logistics');
  const [fund2Amount, setFund2Amount] = useState<number>(2.5);
  const [fund3Label, setFund3AmountLabel] = useState<string>('Working Capital & Regional Sourcing');
  const [fund3Amount, setFund3Amount] = useState<number>(3.0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const businessId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `biz-${Date.now()}`;
    const expensesLakhs = Number((revenueLakhs * (1 - operatingMargin / 100)).toFixed(1));

    // Construct multi-year financial statements
    const historicals: FinancialStatementYear[] = [
      {
        year: 'FY24',
        revenue: Number((revenueLakhs * 0.6).toFixed(1)),
        expenses: Number((expensesLakhs * 0.65).toFixed(1)),
        grossProfit: Number((revenueLakhs * 0.6 * (grossMargin / 100)).toFixed(1)),
        operatingProfit: Number((revenueLakhs * 0.6 * 0.1).toFixed(1)),
        grossMargin: Number((grossMargin - 2).toFixed(1)),
        operatingMargin: 10.0,
        customers: 650,
      },
      {
        year: 'FY25',
        revenue: Number((revenueLakhs * 0.8).toFixed(1)),
        expenses: Number((expensesLakhs * 0.82).toFixed(1)),
        grossProfit: Number((revenueLakhs * 0.8 * (grossMargin / 100)).toFixed(1)),
        operatingProfit: Number((revenueLakhs * 0.8 * (operatingMargin / 100 * 0.9)).toFixed(1)),
        grossMargin: Number((grossMargin - 1).toFixed(1)),
        operatingMargin: Number((operatingMargin * 0.9).toFixed(1)),
        customers: 980,
      },
      {
        year: 'FY26',
        revenue: revenueLakhs,
        expenses: expensesLakhs,
        grossProfit: Number((revenueLakhs * (grossMargin / 100)).toFixed(1)),
        operatingProfit: Number((revenueLakhs * (operatingMargin / 100)).toFixed(1)),
        grossMargin: grossMargin,
        operatingMargin: operatingMargin,
        customers: Math.round((revenueLakhs * 100000) / (aov * 3)),
      },
    ];

    const newBusiness: Business = {
      id: businessId,
      name: name.trim() || 'My Local Enterprise',
      tagline: tagline.trim() || 'Neighborhood craft & community enterprise',
      category: category,
      location: location.trim() || 'Bengaluru, India',
      foundedYear: foundedYear || 2023,
      rating: 4.8,
      customersCount: Math.round((revenueLakhs * 100000) / (aov * 3)),
      description:
        description.trim() ||
        `${name} is a high-growth local business based in ${location}, specializing in ${category} with a strong loyal patron following.`,
      imageUrl: selectedImage,
      coverImageUrl: selectedCover,
      pitch: {
        problem:
          problem.trim() ||
          'Local consumers lack access to transparent, sustainably sourced products with verifiable origins. Mass chain alternatives prioritize preservative longevity over quality.',
        solution:
          solution.trim() ||
          `${name} offers handcrafted, verified local offerings with direct community relationships and high operational discipline.`,
        moat:
          moat.trim() ||
          `High customer retention (${repeatRate}%), direct regional sourcing partnerships, and defensible unit economics.`,
        founderNote:
          founderNote.trim() ||
          'We founded this company to build an enduring local brand. Raising community capital aligns our growth directly with the patrons who love our products.',
      },
      healthScore: 80,
      healthDimensions: {
        financialHealth: 81,
        growthMomentum: 84,
        customerTraction: 82,
        operationalEfficiency: 75,
        marketOpportunity: 83,
        evidenceQuality: 78,
      },
      metrics: {
        revenueLakhs,
        expensesLakhs,
        revenueGrowth,
        grossMargin,
        operatingMargin,
        aov,
        repeatRate,
        employees,
      },
      historicals,
      evidenceLedger: [
        {
          id: `ev-${businessId}-1`,
          claim: `Revenue grew ${revenueGrowth}% YoY with gross margin of ${grossMargin}%.`,
          tag: 'CALCULATED',
          source: 'Annual Financial Returns & Sales Registry',
          details: `Certified revenue base of ₹${revenueLakhs}L with ${grossMargin}% unit gross margin.`,
          date: new Date().toISOString().split('T')[0],
        },
        {
          id: `ev-${businessId}-2`,
          claim: `${repeatRate}% of monthly receipts generated from repeat patrons.`,
          tag: 'VERIFIED',
          source: 'POS Transaction Audit',
          details: 'Verified customer frequency across POS transaction history.',
          date: new Date().toISOString().split('T')[0],
        },
      ],
      growthOpportunities: [
        {
          id: `opp-${businessId}-1`,
          title: 'Commercial Scale-Up & Off-Peak Monetization',
          category: 'Capacity Expansion',
          whyNow: 'Existing capacity is well-proven; new capital unlocks high-ticket B2B commercial accounts.',
          expectedImpact: 'HIGH',
          implementationCost: `₹${(targetAmount * 0.45 / 100000).toFixed(1)}L`,
          difficulty: 'MEDIUM',
          risk: 'LOW',
          confidence: 'HIGH',
          recommendedExperiment: 'Run a 30-day pilot before commercial asset deployment.',
          successMetric: `+30% monthly run-rate within 90 days.`,
          evidenceTag: 'SUPPORTED',
          evidenceSource: 'Operational Work-Study',
        },
      ],
      risks: [
        {
          id: `risk-${businessId}-1`,
          title: 'Supply Chain & Cost Management',
          severity: 'MEDIUM',
          detail: 'Ingredient and raw material inflation requires forward contract discipline.',
          mitigation: 'Establish quarterly volume agreements with trusted regional cooperatives.',
          evidenceTag: 'SUPPORTED',
        },
      ],
      campaign: {
        id: `camp-${businessId}`,
        title: `${name} Community Growth Campaign`,
        targetAmount,
        raisedAmount: Math.round(targetAmount * 0.15), // Initial anchor backing
        supportersCount: 12,
        structure,
        bondReturnRate: structure === 'BOND' ? bondReturnRate : undefined,
        bondDurationMonths: structure === 'BOND' ? 36 : undefined,
        equityValuation: structure === 'EQUITY' ? equityValuation : undefined,
        minAllocation,
        useOfFunds: [
          {
            label: fund1Label,
            amountLakhs: fund1Amount,
            sharePercent: Math.round((fund1Amount / (targetAmount / 100000)) * 100),
          },
          {
            label: fund2Label,
            amountLakhs: fund2Amount,
            sharePercent: Math.round((fund2Amount / (targetAmount / 100000)) * 100),
          },
          {
            label: fund3Label,
            amountLakhs: fund3Amount,
            sharePercent: Math.round((fund3Amount / (targetAmount / 100000)) * 100),
          },
        ],
        milestones: [
          {
            id: `m-${businessId}-1`,
            title: 'Equipment & Production Scale-up',
            targetMonth: 'Month 1',
            completed: false,
            progressPercent: 20,
          },
          {
            id: `m-${businessId}-2`,
            title: 'Commercial Account Launch',
            targetMonth: 'Month 2',
            completed: false,
            progressPercent: 0,
          },
          {
            id: `m-${businessId}-3`,
            title: 'Achieve Target Monthly Run Rate',
            targetMonth: 'Month 3',
            completed: false,
            progressPercent: 0,
          },
        ],
        status: 'ACTIVE',
      },
      impactMetrics: [
        {
          id: `imp-${businessId}-1`,
          category: 'Economic',
          title: 'Local Sourcing Commitment',
          target: '₹5.0L annual local spend',
          actual: '₹2.8L verified',
          unit: '₹ INR',
          evidence: 'Verified vendor purchase receipts',
          status: 'ON TRACK',
        },
        {
          id: 'imp-jobs',
          category: 'Social',
          title: 'Fair-Wage Local Jobs Created',
          target: '+3 positions',
          actual: '+1 hired',
          unit: 'Employees',
          evidence: 'Active payroll ledgers',
          status: 'ON TRACK',
        },
      ],
      documents: [
        {
          id: `doc-${businessId}-1`,
          name: 'financial_ledger_fy26.csv',
          type: 'CSV',
          uploadDate: new Date().toISOString().split('T')[0],
          extractedMetrics: [
            { metric: 'Annual Gross Turnover', value: `₹${revenueLakhs}L`, confidence: 0.99, status: 'VERIFIED' },
            { metric: 'Operating Margin', value: `${operatingMargin}%`, confidence: 0.98, status: 'CALCULATED' },
          ],
        },
      ],
      marketSignals: [
        {
          id: `sig-${businessId}-1`,
          title: `Rising demand for ${category} in urban corridors`,
          date: '2026-10-10',
          source: 'Regional Retail Commerce Monitor',
          whyItMatters: 'Community consumers are shifting spend toward independent, transparent neighborhood brands.',
          indicator: 'Positive',
        },
      ],
    };

    onPublish(newBusiness);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl border border-zinc-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-semibold">
                SFSB Deal Tank · Founder Onboarding
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Pitch Your Business & Raise Growth Capital
            </h2>
            <p className="text-xs text-slate-500">
              Where small businesses meet big believers. Share your unit economics, pitch story, and funding terms.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 border-b border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500 bg-white">
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 1 ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'
              }`}
            >
              1
            </span>
            <span className={step === 1 ? 'font-semibold text-zinc-900' : ''}>Company Basics</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 2 ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'
              }`}
            >
              2
            </span>
            <span className={step === 2 ? 'font-semibold text-zinc-900' : ''}>Founder Pitch</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 3 ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'
              }`}
            >
              3
            </span>
            <span className={step === 3 ? 'font-semibold text-zinc-900' : ''}>Financials</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 4 ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'
              }`}
            >
              4
            </span>
            <span className={step === 4 ? 'font-semibold text-zinc-900' : ''}>Campaign Terms</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: Company Profile */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">Enterprise Fundamentals</h3>
                <p className="text-xs text-zinc-500">Provide verified identifying details for your business</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700">Business / Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. GreenFork Kitchen"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:bg-white focus:border-zinc-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700">Category / Sector</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:bg-white focus:border-zinc-400"
                  >
                    <option value="Specialty Food & Dining">Specialty Food & Dining</option>
                    <option value="Artisan Bakery">Artisan Bakery</option>
                    <option value="Specialty Coffee & Roastery">Specialty Coffee & Roastery</option>
                    <option value="Sustainable Apparel & Crafts">Sustainable Apparel & Crafts</option>
                    <option value="Health & Botanical Wellness">Health & Botanical Wellness</option>
                    <option value="Local Organic Retail">Local Organic Retail</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-medium text-zinc-700">One-Liner Tagline *</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Plant-forward regional farm-to-table bistro"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:bg-white focus:border-zinc-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700">Neighborhood / City *</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Koramangala, Bengaluru"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:bg-white focus:border-zinc-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700">Founded Year</label>
                  <input
                    type="number"
                    value={foundedYear}
                    onChange={(e) => setFoundedYear(parseInt(e.target.value, 10))}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:bg-white focus:border-zinc-400"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-medium text-zinc-700">Company Overview</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of your business, operations, and local customer reach..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:bg-white focus:border-zinc-400"
                  />
                </div>
              </div>

              {/* Cover Image Preset Selector */}
              <div className="space-y-2 pt-2 border-t border-zinc-100">
                <label className="text-xs font-medium text-zinc-700 block">
                  Select Visual Brand Photography
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {IMAGE_PRESETS.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSelectedImage(preset.url);
                        setSelectedCover(preset.cover);
                      }}
                      className={`relative rounded-lg overflow-hidden border-2 text-left h-20 transition-all ${
                        selectedImage === preset.url
                          ? 'border-zinc-900 ring-2 ring-zinc-900/20'
                          : 'border-zinc-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 right-1 text-[9px] font-mono text-white bg-black/70 px-1 py-0.5 rounded truncate">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: The Pitch Narrative */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">Tyke-Style Pitch & Thesis</h3>
                <p className="text-xs text-zinc-500">
                  Explain the problem, your defensible solution, and why community supporters should back you
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700">The Problem You Are Solving *</label>
                  <textarea
                    rows={2}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="What friction exists in your sector? e.g. Packaged alternatives use preservatives, while boutique players lack scale..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:bg-white focus:border-zinc-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700">Your Solution & Product *</label>
                  <textarea
                    rows={2}
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="How does your offering directly address this? What makes customers keep coming back?"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:bg-white focus:border-zinc-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700">Your Competitive Moat & Advantage</label>
                  <textarea
                    rows={2}
                    value={moat}
                    onChange={(e) => setMoat(e.target.value)}
                    placeholder="Proprietary recipes, direct farm sourcing, loyal repeat rate, lower rent overhead..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:bg-white focus:border-zinc-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700">Founder's Note to Supporters</label>
                  <textarea
                    rows={2}
                    value={founderNote}
                    onChange={(e) => setFounderNote(e.target.value)}
                    placeholder="A personal message to your patrons on why you are raising community capital..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:bg-white focus:border-zinc-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Financials & Operating Traction */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">Financial Traction & Unit Economics</h3>
                <p className="text-xs text-zinc-500">
                  Enter verified figures from your sales register or GST filings
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/80 space-y-1">
                  <label className="text-xs font-medium text-zinc-700 block">Annual Revenue (₹ Lakhs)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={revenueLakhs}
                    onChange={(e) => setRevenueLakhs(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-sm px-3 py-1.5 bg-white border border-zinc-200 rounded"
                  />
                  <span className="text-[10px] text-zinc-400 block font-mono">Current fiscal year turnover</span>
                </div>

                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/80 space-y-1">
                  <label className="text-xs font-medium text-zinc-700 block">YoY Growth Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={revenueGrowth}
                    onChange={(e) => setRevenueGrowth(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-sm px-3 py-1.5 bg-white border border-zinc-200 rounded text-emerald-700 font-bold"
                  />
                  <span className="text-[10px] text-zinc-400 block font-mono">Year-on-year expansion</span>
                </div>

                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/80 space-y-1">
                  <label className="text-xs font-medium text-zinc-700 block">Gross Margin (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={grossMargin}
                    onChange={(e) => setGrossMargin(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-sm px-3 py-1.5 bg-white border border-zinc-200 rounded"
                  />
                  <span className="text-[10px] text-zinc-400 block font-mono">Revenue minus direct COGS</span>
                </div>

                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/80 space-y-1">
                  <label className="text-xs font-medium text-zinc-700 block">Operating Margin (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={operatingMargin}
                    onChange={(e) => setOperatingMargin(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-sm px-3 py-1.5 bg-white border border-zinc-200 rounded text-emerald-700 font-semibold"
                  />
                  <span className="text-[10px] text-zinc-400 block font-mono">Operating EBITDA margin</span>
                </div>

                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/80 space-y-1">
                  <label className="text-xs font-medium text-zinc-700 block">Repeat Customer Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={repeatRate}
                    onChange={(e) => setRepeatRate(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-sm px-3 py-1.5 bg-white border border-zinc-200 rounded"
                  />
                  <span className="text-[10px] text-zinc-400 block font-mono">Quarterly loyalty retention</span>
                </div>

                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/80 space-y-1">
                  <label className="text-xs font-medium text-zinc-700 block">Average Order Value (₹)</label>
                  <input
                    type="number"
                    value={aov}
                    onChange={(e) => setAov(parseInt(e.target.value, 10) || 0)}
                    className="w-full font-mono text-sm px-3 py-1.5 bg-white border border-zinc-200 rounded"
                  />
                  <span className="text-[10px] text-zinc-400 block font-mono">Average basket size</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Campaign Term Sheet (Tyke Model) */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">Campaign Term Sheet & Instrument</h3>
                <p className="text-xs text-zinc-500">
                  Configure community capital structure (Fixed Yield Debt or Ownership Equity)
                </p>
              </div>

              {/* Instrument Toggle */}
              <div className="flex bg-zinc-100 p-1 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setStructure('BOND')}
                  className={`flex-1 py-2 rounded-md transition-all ${
                    structure === 'BOND'
                      ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Fixed Yield Community Bond
                </button>
                <button
                  type="button"
                  onClick={() => setStructure('EQUITY')}
                  className={`flex-1 py-2 rounded-md transition-all ${
                    structure === 'EQUITY'
                      ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Equity Participation
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700">Target Raise Amount (₹ INR)</label>
                  <input
                    type="number"
                    step="50000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(parseInt(e.target.value, 10) || 0)}
                    className="w-full font-mono text-sm px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg"
                  />
                </div>

                {structure === 'BOND' ? (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700">Annual Return Rate (% p.a.)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={bondReturnRate}
                      onChange={(e) => setBondReturnRate(parseFloat(e.target.value) || 0)}
                      className="w-full font-mono text-sm px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-emerald-700 font-bold"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700">Pre-Money Valuation (₹ INR)</label>
                    <input
                      type="number"
                      step="1000000"
                      value={equityValuation}
                      onChange={(e) => setEquityValuation(parseInt(e.target.value, 10) || 0)}
                      className="w-full font-mono text-sm px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-emerald-700 font-bold"
                    />
                  </div>
                )}

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-medium text-zinc-700">Minimum Ticket Size (₹)</label>
                  <input
                    type="number"
                    value={minAllocation}
                    onChange={(e) => setMinAllocation(parseInt(e.target.value, 10) || 0)}
                    className="w-full font-mono text-sm px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Use of Funds */}
              <div className="space-y-2 pt-2 border-t border-zinc-100">
                <label className="text-xs font-medium text-zinc-700 block">Use of Funds Allocation</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={fund1Label}
                      onChange={(e) => setFund1Label(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-zinc-200 rounded"
                      placeholder="Category 1"
                    />
                    <input
                      type="number"
                      step="0.5"
                      value={fund1Amount}
                      onChange={(e) => setFund1Amount(parseFloat(e.target.value) || 0)}
                      className="w-full font-mono text-xs px-2.5 py-1 border border-zinc-200 rounded"
                      placeholder="₹ Lakhs"
                    />
                  </div>

                  <div className="space-y-1">
                    <input
                      type="text"
                      value={fund2Label}
                      onChange={(e) => setFund2Label(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-zinc-200 rounded"
                      placeholder="Category 2"
                    />
                    <input
                      type="number"
                      step="0.5"
                      value={fund2Amount}
                      onChange={(e) => setFund2Amount(parseFloat(e.target.value) || 0)}
                      className="w-full font-mono text-xs px-2.5 py-1 border border-zinc-200 rounded"
                      placeholder="₹ Lakhs"
                    />
                  </div>

                  <div className="space-y-1">
                    <input
                      type="text"
                      value={fund3Label}
                      onChange={(e) => setFund3AmountLabel(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-zinc-200 rounded"
                      placeholder="Category 3"
                    />
                    <input
                      type="number"
                      step="0.5"
                      value={fund3Amount}
                      onChange={(e) => setFund3Amount(parseFloat(e.target.value) || 0)}
                      className="w-full font-mono text-xs px-2.5 py-1 border border-zinc-200 rounded"
                      placeholder="₹ Lakhs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              Cancel
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={step === 1 && !name.trim()}
              className="px-5 py-2 text-xs font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-1.5 disabled:opacity-40"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Listing & Launch Campaign</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
