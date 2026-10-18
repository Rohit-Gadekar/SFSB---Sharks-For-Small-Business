import React from 'react';
import {
  Compass,
  BarChart3,
  TrendingUp,
  DollarSign,
  Leaf,
  Briefcase,
  ChevronDown,
  Building2,
  Users,
  LogOut,
  Plus,
} from 'lucide-react';
import { Business } from '../types';
import { UserSession } from './LoginPage';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserSession;
  onLogout: () => void;
  businesses: Business[];
  currentBusinessId: string;
  onSelectBusiness: (id: string) => void;
  onOpenListModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  businesses,
  currentBusinessId,
  onSelectBusiness,
  onOpenListModal,
}) => {
  const currentBusiness = businesses.find((b) => b.id === currentBusinessId) || businesses[0];

  // Strictly separated navigation per persona with SFSB mindset
  const investorNav = [
    { id: 'discover', label: 'The Deal Tank', icon: Compass },
    { id: 'analysis', label: 'Venture Profile', icon: BarChart3 },
    { id: 'capital', label: 'Shark Capital', icon: DollarSign },
    { id: 'impact', label: 'Impact Audit', icon: Leaf },
    { id: 'portfolio', label: 'Shark Portfolio', icon: Briefcase },
  ];

  const ownerNav = [
    { id: 'owner-dashboard', label: 'Command Center', icon: Building2 },
    { id: 'analysis', label: 'Financial Profile', icon: BarChart3 },
    { id: 'growth', label: 'Growth Initiatives', icon: TrendingUp },
    { id: 'capital', label: 'Campaign Manager', icon: DollarSign },
    { id: 'impact', label: 'Impact Audit', icon: Leaf },
  ];

  const listerNav = [
    { id: 'listing-hub', label: 'Listing & Pitch Studio', icon: Building2 },
    { id: 'analysis', label: 'Pitch Preview', icon: BarChart3 },
  ];

  const currentNav =
    currentUser.role === 'lister'
      ? listerNav
      : currentUser.role === 'owner'
      ? ownerNav
      : investorNav;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Context */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (currentUser.role === 'lister') {
                  setActiveTab('listing-hub');
                } else if (currentUser.role === 'investor') {
                  setActiveTab('discover');
                } else {
                  setActiveTab('owner-dashboard');
                }
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 via-sky-950 to-cyan-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs border border-sky-500/30 group-hover:border-sky-400 transition-all">
                <svg
                  className="w-5 h-5 text-sky-400 transform group-hover:scale-105 transition-transform"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4 19c2.8-1 6.2-3.3 8.2-7.2C13.8 8.8 14.8 5.4 15 2.8c.8 3.4 2.8 5.8 5.5 8.2-2.8 1.4-6.2 2.8-9.5 4.2L4 19z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold tracking-tight text-slate-900 leading-tight">
                    SFSB
                  </span>
                  <span className="text-[11px] font-semibold tracking-tight text-slate-600 hidden sm:inline">
                    Sharks For Small Businesses
                  </span>
                </div>
                <span className="text-[10px] text-sky-700 font-medium block tracking-normal leading-tight">
                  Where small businesses meet big believers
                </span>
              </div>
            </button>

            {/* Business Selector */}
            {currentUser.role !== 'lister' && (
              <div className="hidden lg:flex items-center ml-3 pl-3 border-l border-slate-200">
                <span className="text-[11px] font-mono text-slate-400 mr-2 uppercase">
                  {currentUser.role === 'owner' ? 'My Enterprise:' : 'Inspecting:'}
                </span>
                <div className="relative">
                  <select
                    value={currentBusinessId}
                    onChange={(e) => onSelectBusiness(e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 py-1.5 pl-3 pr-8 rounded-lg hover:border-slate-300 focus:outline-none cursor-pointer transition-colors"
                  >
                    {businesses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.category})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            {currentUser.role === 'owner' && onOpenListModal && (
              <button
                onClick={onOpenListModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-sky-400" />
                <span>Pitch Your Business</span>
              </button>
            )}

            {/* User Session Badge */}
            <div className="flex items-center gap-2 pl-2 sm:border-l border-slate-200">
              <div className="p-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-100">
                {currentUser.role === 'lister' ? (
                  <Building2 className="w-4 h-4 text-amber-700" />
                ) : currentUser.role === 'owner' ? (
                  <Building2 className="w-4 h-4 text-emerald-700" />
                ) : (
                  <Users className="w-4 h-4 text-sky-800" />
                )}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-semibold text-slate-900 block leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block leading-tight">
                  {currentUser.role === 'lister'
                    ? 'Listing Applicant'
                    : currentUser.role === 'owner'
                    ? 'Managing Founder'
                    : 'Big Believer (Shark)'}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* High-conviction Navigation Links */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 border-t border-slate-100 no-scrollbar">
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
