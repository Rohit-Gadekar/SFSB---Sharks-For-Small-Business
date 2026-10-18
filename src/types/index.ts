export type EvidenceClassification =
  | 'VERIFIED'
  | 'CALCULATED'
  | 'SUPPORTED'
  | 'SELF_REPORTED'
  | 'MARKET_SIGNAL'
  | 'ASSUMPTION'
  | 'INSUFFICIENT_DATA';

export interface UserSession {
  role: 'investor' | 'owner' | 'lister';
  name: string;
  email: string;
  businessId?: string;
}

export interface EvidenceItem {
  id: string;
  claim: string;
  tag: EvidenceClassification;
  source: string;
  details: string;
  date: string;
}

export interface FinancialStatementYear {
  year: string;
  revenue: number; // in Lakhs (₹)
  expenses: number;
  grossProfit: number;
  operatingProfit: number;
  grossMargin: number; // %
  operatingMargin: number; // %
  customers: number;
}

export interface GrowthOpportunity {
  id: string;
  title: string;
  category: string;
  whyNow: string;
  expectedImpact: 'HIGH' | 'MEDIUM' | 'LOW';
  implementationCost: string;
  difficulty: 'LOW' | 'MEDIUM' | 'HIGH';
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedExperiment: string;
  successMetric: string;
  evidenceTag: EvidenceClassification;
  evidenceSource: string;
}

export interface FundingMilestone {
  id: string;
  title: string;
  targetMonth: string;
  completed: boolean;
  completionDate?: string;
  evidenceDoc?: string;
  progressPercent?: number;
}

export interface FundingCampaign {
  id: string;
  title: string;
  targetAmount: number; // ₹
  raisedAmount: number;
  supportersCount: number;
  structure: 'BOND' | 'EQUITY' | 'REV_SHARE';
  bondReturnRate?: number; // e.g. 8.5%
  bondDurationMonths?: number; // e.g. 36
  equityValuation?: number; // e.g. 20000000 (2 Cr)
  sharePrice?: number; // e.g. 100
  revenueSharePercentage?: number; // e.g. 2.0%
  capMultiple?: number; // e.g. 1.5
  minAllocation: number;
  useOfFunds: Array<{
    label: string;
    amountLakhs: number;
    sharePercent: number;
  }>;
  milestones: FundingMilestone[];
  status: 'ACTIVE' | 'FUNDED' | 'PLANNING';
}

export interface ImpactMetric {
  id: string;
  category: 'Economic' | 'Environmental' | 'Social';
  title: string;
  target: string;
  actual: string;
  unit: string;
  evidence: string;
  status: 'ON TRACK' | 'ACHIEVED' | 'IN PROGRESS';
}

export interface BusinessDocument {
  id: string;
  name: string;
  type: 'CSV' | 'PDF' | 'XLSX' | 'IMAGE';
  uploadDate: string;
  extractedMetrics: Array<{
    metric: string;
    value: string;
    confidence: number;
    status: string;
  }>;
}

export interface BusinessRisk {
  id: string;
  title: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  detail: string;
  mitigation: string;
  evidenceTag: EvidenceClassification;
}

export interface MarketSignal {
  id: string;
  title: string;
  date: string;
  source: string;
  whyItMatters: string;
  indicator: string;
}

export interface Business {
  id: string;
  name: string;
  tagline: string;
  category: string;
  location: string;
  foundedYear: number;
  rating: number;
  customersCount: number;
  description: string;
  imageUrl: string;
  coverImageUrl?: string;
  pitch?: {
    problem: string;
    solution: string;
    moat: string;
    founderNote: string;
  };
  healthScore: number;
  healthDimensions: {
    financialHealth: number;
    growthMomentum: number;
    customerTraction: number;
    operationalEfficiency: number;
    marketOpportunity: number;
    evidenceQuality: number;
  };
  metrics: {
    revenueLakhs: number;
    expensesLakhs: number;
    revenueGrowth: number; // %
    grossMargin: number; // %
    operatingMargin: number; // %
    aov: number; // ₹
    repeatRate: number; // %
    employees: number;
  };
  historicals: FinancialStatementYear[];
  evidenceLedger: EvidenceItem[];
  growthOpportunities: GrowthOpportunity[];
  risks: BusinessRisk[];
  campaign: FundingCampaign;
  impactMetrics: ImpactMetric[];
  documents: BusinessDocument[];
  marketSignals: MarketSignal[];
  listingStatus?: 'approved' | 'under_inspection' | 'pending_payment';
  platformFeePaid?: boolean;
  platformFeeAmount?: number;
  inspectionStages?: Array<{
    id: string;
    title: string;
    status: 'completed' | 'in_progress' | 'pending';
    detail: string;
    completedAt?: string;
  }>;
  forecast?: {
    projectedRevenueLakhs: number;
    projectedGrowth: number;
    confidenceScore: number;
    ebitdaForecastLakhs: number;
    note: string;
  };
}

export interface InvestmentLot {
  id: string;
  date: string;
  amount: number;
  structure: 'BOND' | 'EQUITY' | 'REV_SHARE';
  // Equity parameters
  equityPercentage?: number;
  sharesCount?: number;
  sharePrice?: number;
  // Revenue sharing parameters
  revenueSharePercentage?: number;
  capMultiple?: number;
  monthlyPayoutEstimate?: number;
  // Bond parameters
  bondInterestRate?: number;
  tenureMonths?: number;
  annualYield?: number;
  transactionRef?: string;
  paymentMethod?: string; // UPI, Card, NetBanking, Escrow
}

export interface PortfolioInvestment {
  id: string;
  businessId: string;
  businessName: string;
  amount: number;
  date: string;
  lastInvestedDate?: string;
  structure: 'BOND' | 'EQUITY' | 'REV_SHARE';
  // Equity parameters
  equityPercentage?: number; // e.g. 0.25%
  sharesCount?: number; // e.g. 250 shares
  sharePrice?: number; // e.g. 100
  valuationAtInvestment?: number; // e.g. 20000000
  // Revenue sharing parameters
  revenueSharePercentage?: number; // e.g. 1.8%
  capMultiple?: number; // e.g. 1.5x
  monthlyPayoutEstimate?: number; // e.g. ₹1,450
  // Bond parameters
  bondInterestRate?: number; // e.g. 8.5%
  tenureMonths?: number; // e.g. 36
  annualYield?: number; // e.g. ₹850
  projectedOutcome: string;
  impactShare: string;
  status: 'Active' | 'Matured' | 'Pending';
  transactionRef?: string;
  paymentMethod?: string;
  lots?: InvestmentLot[];
}
