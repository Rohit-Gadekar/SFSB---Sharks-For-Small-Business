import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LoginPage, UserSession } from './components/LoginPage';
import { DiscoverView } from './components/DiscoverView';
import { BusinessDetailView } from './components/BusinessDetailView';
import { GrowthAdvisoryView } from './components/GrowthAdvisoryView';
import { CapitalView } from './components/CapitalView';
import { ImpactView } from './components/ImpactView';
import { PortfolioView } from './components/PortfolioView';
import { OwnerPortal } from './components/OwnerPortal';
import { CampaignManagerView } from './components/CampaignManagerView';
import { ListingPortalView } from './components/ListingPortalView';
import { EvidenceModal } from './components/EvidenceModal';
import { CompareModal } from './components/CompareModal';
import { ListBusinessModal } from './components/ListBusinessModal';
import { INITIAL_BUSINESSES, INITIAL_USER_PORTFOLIO } from './data/mockData';
import { Business, EvidenceItem, PortfolioInvestment, BusinessDocument } from './types';
import { DocumentExtractionResult } from './services/apiService';

export default function App() {
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('crumb-and-co');

  // Authenticated user session
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('sfsb_session') || localStorage.getItem('localproof_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('sfsb_session') || localStorage.getItem('localproof_session');
      if (saved) {
        const session: UserSession = JSON.parse(saved);
        if (session.role === 'lister') return 'listing-hub';
        if (session.role === 'owner') return 'owner-dashboard';
        return 'discover';
      }
    } catch {}
    return 'discover';
  });

  const [portfolio, setPortfolio] = useState<PortfolioInvestment[]>(INITIAL_USER_PORTFOLIO);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [activeEvidenceItem, setActiveEvidenceItem] = useState<EvidenceItem | null>(null);
  const [compareModalOpen, setCompareModalOpen] = useState<boolean>(false);
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);

  const handleLogin = (session: UserSession) => {
    setCurrentUser(session);
    try {
      localStorage.setItem('sfsb_session', JSON.stringify(session));
    } catch {}

    if (session.role === 'owner') {
      const bId = session.businessId || businesses[0]?.id || 'crumb-and-co';
      setCurrentBusinessId(bId);
      setActiveTab('owner-dashboard');
    } else if (session.role === 'lister') {
      const bId = session.businessId || businesses[0]?.id || 'crumb-and-co';
      setCurrentBusinessId(bId);
      setActiveTab('listing-hub');
    } else {
      setActiveTab('discover');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('sfsb_session');
      localStorage.removeItem('localproof_session');
    } catch {}
    setActiveTab('discover');
  };

  const handlePublishBusiness = (newBusiness: Business) => {
    setBusinesses((prev) => [newBusiness, ...prev]);
    setCurrentBusinessId(newBusiness.id);
    if (currentUser?.role === 'owner') {
      const updatedUser: UserSession = {
        ...currentUser,
        name: `${newBusiness.name} Founder`,
        businessId: newBusiness.id,
      };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem('sfsb_session', JSON.stringify(updatedUser));
      } catch {}
    }
    setActiveTab('analysis');
    setIsListModalOpen(false);
  };

  const handleUpdateOrAddBusiness = (updatedBiz: Business) => {
    setBusinesses((prev) => {
      const exists = prev.some((b) => b.id === updatedBiz.id);
      if (exists) {
        return prev.map((b) => (b.id === updatedBiz.id ? updatedBiz : b));
      }
      return [updatedBiz, ...prev];
    });
    setCurrentBusinessId(updatedBiz.id);
  };

  const handleApproveBusiness = (businessId: string) => {
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === businessId) {
          return {
            ...b,
            listingStatus: 'approved',
            platformFeePaid: true,
          };
        }
        return b;
      })
    );
  };

  const handleUpdateBusinessFinancials = (businessId: string, result: DocumentExtractionResult) => {
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === businessId) {
          const updatedHistoricals = [...b.historicals];
          const latestIdx = updatedHistoricals.length - 1;
          if (latestIdx >= 0) {
            updatedHistoricals[latestIdx] = {
              ...updatedHistoricals[latestIdx],
              revenue: result.updatedFinancials.revenueLakhs,
              expenses: result.updatedFinancials.expensesLakhs,
              grossMargin: result.updatedFinancials.grossMargin,
              operatingMargin: result.updatedFinancials.operatingMargin,
            };
          }

          return {
            ...b,
            healthScore: result.healthScoreUpdate.newScore,
            metrics: {
              ...b.metrics,
              revenueLakhs: result.updatedFinancials.revenueLakhs,
              expensesLakhs: result.updatedFinancials.expensesLakhs,
              grossMargin: result.updatedFinancials.grossMargin,
              operatingMargin: result.updatedFinancials.operatingMargin,
              revenueGrowth: result.updatedFinancials.revenueGrowth,
              repeatRate: result.updatedFinancials.repeatRate,
            },
            historicals: updatedHistoricals,
            forecast: result.forecast,
            evidenceLedger: [
              {
                id: `ev-ai-${Date.now()}`,
                claim: `Ingested ${result.documentName}: Verified revenue ₹${result.updatedFinancials.revenueLakhs}L & ${result.updatedFinancials.grossMargin}% gross margin.`,
                tag: 'VERIFIED',
                source: 'SFSB AI Financial Intelligence Engine',
                details: result.executiveAuditSummary,
                date: new Date().toISOString().split('T')[0],
              },
              ...b.evidenceLedger,
            ],
          };
        }
        return b;
      })
    );
  };

  const currentBusiness =
    businesses.find((b) => b.id === currentBusinessId) || businesses[0];

  const handleSelectBusiness = (id: string) => {
    setCurrentBusinessId(id);
    setActiveTab('analysis');
  };

  const handleNavigateToCapital = (id: string) => {
    setCurrentBusinessId(id);
    setActiveTab('capital');
  };

  const handleNavigateToGrowth = (id: string) => {
    setCurrentBusinessId(id);
    setActiveTab('growth');
  };

  const handleToggleCompare = (id: string) => {
    setSelectedForCompare((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBackBusiness = (newInvestment: PortfolioInvestment) => {
    setPortfolio((prev) => {
      const existingIdx = prev.findIndex((p) => p.businessId === newInvestment.businessId);

      const newLot = {
        id: `lot-${Date.now()}`,
        date: newInvestment.date || new Date().toISOString().split('T')[0],
        amount: newInvestment.amount,
        structure: newInvestment.structure,
        equityPercentage: newInvestment.equityPercentage,
        sharesCount: newInvestment.sharesCount,
        sharePrice: newInvestment.sharePrice,
        revenueSharePercentage: newInvestment.revenueSharePercentage,
        capMultiple: newInvestment.capMultiple,
        monthlyPayoutEstimate: newInvestment.monthlyPayoutEstimate,
        bondInterestRate: newInvestment.bondInterestRate,
        tenureMonths: newInvestment.tenureMonths,
        annualYield: newInvestment.annualYield,
        transactionRef: newInvestment.transactionRef || `TXN-SFSB-${Date.now().toString().slice(-6)}`,
        paymentMethod: newInvestment.paymentMethod || 'Escrow Gateway',
      };

      if (existingIdx >= 0) {
        const existing = prev[existingIdx];
        const existingLots = existing.lots && existing.lots.length > 0
          ? existing.lots
          : [
              {
                id: `lot-${existing.id}`,
                date: existing.date,
                amount: existing.amount,
                structure: existing.structure,
                equityPercentage: existing.equityPercentage,
                sharesCount: existing.sharesCount,
                sharePrice: existing.sharePrice,
                revenueSharePercentage: existing.revenueSharePercentage,
                capMultiple: existing.capMultiple,
                monthlyPayoutEstimate: existing.monthlyPayoutEstimate,
                bondInterestRate: existing.bondInterestRate,
                tenureMonths: existing.tenureMonths,
                annualYield: existing.annualYield,
                transactionRef: existing.transactionRef || 'TXN-SFSB-ORIGINAL',
                paymentMethod: existing.paymentMethod || 'Escrow Gateway',
              },
            ];

        const updatedLots = [newLot, ...existingLots];
        const combinedAmount = existing.amount + newInvestment.amount;
        const combinedShares = (existing.sharesCount || 0) + (newInvestment.sharesCount || 0);
        const combinedEquityPct = Number(
          ((existing.equityPercentage || 0) + (newInvestment.equityPercentage || 0)).toFixed(4)
        );
        const combinedRevShare = Number(
          ((existing.revenueSharePercentage || 0) + (newInvestment.revenueSharePercentage || 0)).toFixed(3)
        );
        const combinedMonthlyPayout =
          (existing.monthlyPayoutEstimate || 0) + (newInvestment.monthlyPayoutEstimate || 0);
        const combinedAnnualYield =
          (existing.annualYield || 0) + (newInvestment.annualYield || 0);

        let updatedOutcome = existing.projectedOutcome;
        if (existing.structure === 'EQUITY') {
          updatedOutcome = `${combinedEquityPct}% total equity stake (${combinedShares.toLocaleString()} shares @ ₹${existing.sharePrice || 100})`;
        } else if (existing.structure === 'REV_SHARE') {
          updatedOutcome = `${combinedRevShare}% gross monthly rev-share (Est. ₹${combinedMonthlyPayout.toLocaleString()}/mo)`;
        } else {
          updatedOutcome = `${existing.bondInterestRate || 8.5}% p.a. contractual yield (₹${combinedAnnualYield.toLocaleString()}/yr coupon)`;
        }

        const merged: PortfolioInvestment = {
          ...existing,
          amount: combinedAmount,
          sharesCount: combinedShares > 0 ? combinedShares : undefined,
          equityPercentage: combinedEquityPct > 0 ? combinedEquityPct : undefined,
          revenueSharePercentage: combinedRevShare > 0 ? combinedRevShare : undefined,
          monthlyPayoutEstimate: combinedMonthlyPayout > 0 ? combinedMonthlyPayout : undefined,
          annualYield: combinedAnnualYield > 0 ? combinedAnnualYield : undefined,
          lastInvestedDate: newLot.date,
          projectedOutcome: updatedOutcome,
          transactionRef: newLot.transactionRef,
          paymentMethod: newLot.paymentMethod,
          lots: updatedLots,
        };

        const copy = [...prev];
        copy[existingIdx] = merged;
        return copy;
      } else {
        return [{ ...newInvestment, lots: [newLot], lastInvestedDate: newLot.date }, ...prev];
      }
    });

    // Update business campaign raised metrics
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === newInvestment.businessId) {
          return {
            ...b,
            campaign: {
              ...b.campaign,
              raisedAmount: b.campaign.raisedAmount + newInvestment.amount,
              supportersCount: b.campaign.supportersCount + 1,
            },
          };
        }
        return b;
      })
    );
  };

  const handleUpdateMilestone = (milestoneId: string, completed: boolean) => {
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === currentBusinessId) {
          return {
            ...b,
            campaign: {
              ...b.campaign,
              milestones: b.campaign.milestones.map((m) =>
                m.id === milestoneId
                  ? {
                      ...m,
                      completed,
                      completionDate: completed
                        ? new Date().toISOString().split('T')[0]
                        : undefined,
                    }
                  : m
              ),
            },
          };
        }
        return b;
      })
    );
  };

  const handleAddDocument = (doc: BusinessDocument) => {
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === currentBusinessId) {
          return {
            ...b,
            documents: [doc, ...b.documents],
          };
        }
        return b;
      })
    );
  };

  const handleDeployPlanToCampaign = (plan: {
    title: string;
    targetAmount: number;
    useOfFunds: Array<{ label: string; amountLakhs: number; sharePercent: number }>;
  }) => {
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === currentBusinessId) {
          return {
            ...b,
            campaign: {
              ...b.campaign,
              title: plan.title,
              targetAmount: plan.targetAmount,
              useOfFunds: plan.useOfFunds,
            },
          };
        }
        return b;
      })
    );
  };

  // If user is not logged in, render the login page
  if (!currentUser) {
    return <LoginPage businesses={businesses} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Top Navigation with strict persona isolation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        businesses={businesses}
        currentBusinessId={currentBusinessId}
        onSelectBusiness={setCurrentBusinessId}
        onOpenListModal={() => setIsListModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {/* ================= INVESTOR VIEWS ================= */}
        {currentUser.role === 'investor' && (
          <>
            {activeTab === 'discover' && (
              <DiscoverView
                businesses={businesses}
                onSelectBusiness={handleSelectBusiness}
                onNavigateToCapital={handleNavigateToCapital}
                selectedForCompare={selectedForCompare}
                onToggleCompare={handleToggleCompare}
                onOpenCompare={() => setCompareModalOpen(true)}
                onOpenListModal={() => setIsListModalOpen(true)}
              />
            )}

            {activeTab === 'analysis' && (
              <BusinessDetailView
                business={currentBusiness}
                userRole="investor"
                onSelectEvidence={(item) => setActiveEvidenceItem(item)}
                onNavigateToCapital={handleNavigateToCapital}
                onNavigateToGrowth={handleNavigateToGrowth}
                onOpenCompare={() => setCompareModalOpen(true)}
              />
            )}

            {activeTab === 'capital' && (
              <CapitalView
                business={currentBusiness}
                onBackBusiness={handleBackBusiness}
                onNavigateToPortfolio={() => setActiveTab('portfolio')}
              />
            )}

            {activeTab === 'impact' && (
              <ImpactView
                business={currentBusiness}
                allBusinesses={businesses}
                onSelectBusiness={setCurrentBusinessId}
              />
            )}

            {activeTab === 'portfolio' && (
              <PortfolioView
                portfolio={portfolio}
                allBusinesses={businesses}
                onSelectBusiness={handleSelectBusiness}
                onNavigateToDiscover={() => setActiveTab('discover')}
              />
            )}
          </>
        )}

        {/* ================= BUSINESS OWNER VIEWS ================= */}
        {currentUser.role === 'owner' && (
          <>
            {activeTab === 'owner-dashboard' && (
              <OwnerPortal
                business={currentBusiness}
                onUpdateMilestone={handleUpdateMilestone}
                onAddDocument={handleAddDocument}
                onUpdateBusinessFinancials={handleUpdateBusinessFinancials}
                onNavigateToGrowth={() => setActiveTab('growth')}
                onNavigateToCampaign={() => setActiveTab('capital')}
                onOpenListModal={() => setIsListModalOpen(true)}
              />
            )}

            {activeTab === 'analysis' && (
              <BusinessDetailView
                business={currentBusiness}
                userRole="owner"
                onSelectEvidence={(item) => setActiveEvidenceItem(item)}
                onNavigateToCapital={handleNavigateToCapital}
                onNavigateToGrowth={handleNavigateToGrowth}
                onOpenCompare={() => setCompareModalOpen(true)}
              />
            )}

            {activeTab === 'growth' && (
              <GrowthAdvisoryView
                business={currentBusiness}
                onDeployPlanToCampaign={handleDeployPlanToCampaign}
                onNavigateToCapital={handleNavigateToCapital}
              />
            )}

            {activeTab === 'capital' && (
              <CampaignManagerView
                business={currentBusiness}
                onUpdateMilestone={handleUpdateMilestone}
                onNavigateToGrowth={() => setActiveTab('growth')}
              />
            )}

            {activeTab === 'impact' && (
              <ImpactView
                business={currentBusiness}
                allBusinesses={businesses}
                onSelectBusiness={setCurrentBusinessId}
              />
            )}
          </>
        )}

        {/* ================= BUSINESS LISTING APPLICANT VIEWS ================= */}
        {currentUser.role === 'lister' && (
          <>
            {activeTab === 'listing-hub' && (
              <ListingPortalView
                currentUser={currentUser}
                businesses={businesses}
                onAddOrUpdateBusiness={handleUpdateOrAddBusiness}
                onApproveBusiness={handleApproveBusiness}
                onNavigateToDiscover={() => setActiveTab('analysis')}
                onSwitchToFounderPortal={(bizId) => {
                  const updated: UserSession = {
                    role: 'owner',
                    name: 'Managing Founder',
                    email: currentUser.email,
                    businessId: bizId,
                  };
                  handleLogin(updated);
                }}
              />
            )}

            {activeTab === 'analysis' && (
              <BusinessDetailView
                business={currentBusiness}
                userRole="owner"
                onSelectEvidence={(item) => setActiveEvidenceItem(item)}
                onNavigateToCapital={handleNavigateToCapital}
                onNavigateToGrowth={handleNavigateToGrowth}
                onOpenCompare={() => setCompareModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Transparent Evidence Detail Modal */}
      <EvidenceModal
        item={activeEvidenceItem}
        onClose={() => setActiveEvidenceItem(null)}
      />

      {/* Cross-Business Comparison Modal */}
      {compareModalOpen && (
        <CompareModal
          businesses={businesses.filter((b) =>
            selectedForCompare.length > 0 ? selectedForCompare.includes(b.id) : true
          )}
          onClose={() => setCompareModalOpen(false)}
          onSelectBusiness={handleSelectBusiness}
        />
      )}

      {/* Tyke-Inspired Business Onboarding & Campaign Wizard */}
      <ListBusinessModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onPublish={handlePublishBusiness}
      />

      {/* SFSB Professional Platform Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] border border-sky-500/30">
              <svg className="w-3.5 h-3.5 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 19c2.8-1 6.2-3.3 8.2-7.2C13.8 8.8 14.8 5.4 15 2.8c.8 3.4 2.8 5.8 5.5 8.2-2.8 1.4-6.2 2.8-9.5 4.2L4 19z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900">SFSB — Sharks For Small Businesses</span>
            <span className="text-slate-400 hidden sm:inline">·</span>
            <span className="text-slate-600 font-medium">Where small businesses meet big believers.</span>
          </div>

          <div className="text-[11px] text-slate-400 text-center sm:text-right max-w-xl">
            Logged in as {currentUser.name} (
            {currentUser.role === 'lister'
              ? 'Listing Applicant'
              : currentUser.role === 'owner'
              ? 'Small Business Founder'
              : 'Big Believer (Shark)'}
            ).
          </div>
        </div>
      </footer>
    </div>
  );
}
