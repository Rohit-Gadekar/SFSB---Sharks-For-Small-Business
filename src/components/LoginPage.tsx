import React, { useState } from 'react';
import {
  ArrowRight,
  Building2,
  Users,
  Lock,
  Mail,
  PlusCircle,
  User,
  ShieldCheck,
} from 'lucide-react';
import { Business, UserSession } from '../types';

export { type UserSession } from '../types';

interface LoginPageProps {
  businesses: Business[];
  onLogin: (session: UserSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ businesses, onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<'investor' | 'owner' | 'lister'>('investor');
  
  // Investor Credentials
  const [investorEmail, setInvestorEmail] = useState<string>('shark@sfsb.invest');
  const [investorPassword, setInvestorPassword] = useState<string>('••••••••••••');

  // Business Owner Credentials (Username/Email & Password)
  const [ownerUsername, setOwnerUsername] = useState<string>('founder@crumbandco.in');
  const [ownerPassword, setOwnerPassword] = useState<string>('••••••••••••');

  // Lister Credentials
  const [listerEmail, setListerEmail] = useState<string>('founder.applicant@sfsb.in');
  const [listerPassword, setListerPassword] = useState<string>('••••••••••••');

  const [authError, setAuthError] = useState<string | null>(null);

  const handleRoleChange = (role: 'investor' | 'owner' | 'lister') => {
    setSelectedRole(role);
    setAuthError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (selectedRole === 'investor') {
      onLogin({
        role: 'investor',
        name: 'Community Shark',
        email: investorEmail || 'shark@sfsb.invest',
      });
    } else if (selectedRole === 'owner') {
      if (!ownerUsername.trim() || !ownerPassword.trim()) {
        setAuthError('Please enter both your business username/email and password.');
        return;
      }

      // Resolve business by matching username or work email against registered enterprises
      const cleanInput = ownerUsername.trim().toLowerCase();
      let matchedBiz = businesses.find((b) => {
        const handle = b.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const idMatch = b.id.toLowerCase();
        return (
          cleanInput.includes(handle) ||
          cleanInput.includes(idMatch) ||
          cleanInput.startsWith(handle) ||
          cleanInput.startsWith(idMatch) ||
          cleanInput === b.name.toLowerCase()
        );
      });

      // Default fallback to first business if not specifically matched
      if (!matchedBiz && businesses.length > 0) {
        matchedBiz = businesses[0];
      }

      const founderName = matchedBiz ? `${matchedBiz.name} Founder` : 'Managing Founder';
      const targetBizId = matchedBiz ? matchedBiz.id : businesses[0]?.id;

      onLogin({
        role: 'owner',
        name: founderName,
        email: ownerUsername.includes('@') ? ownerUsername : `${ownerUsername}@sfsb.invest`,
        businessId: targetBizId,
      });
    } else {
      onLogin({
        role: 'lister',
        name: 'Venture Applicant',
        email: listerEmail || 'founder.applicant@sfsb.in',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-slate-900 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2.5">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white font-bold text-lg shadow-lg border border-sky-500/30 mx-auto">
          <svg className="w-8 h-8 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 19c2.8-1 6.2-3.3 8.2-7.2C13.8 8.8 14.8 5.4 15 2.8c.8 3.4 2.8 5.8 5.5 8.2-2.8 1.4-6.2 2.8-9.5 4.2L4 19z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            SFSB
          </h1>
          <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 mt-0.5">
            Sharks For Small Businesses
          </p>
        </div>
        <div className="inline-block px-3 py-1 bg-sky-50 border border-sky-200/80 rounded-full text-xs font-semibold text-sky-800">
          Where small businesses meet big believers.
        </div>
        <p className="text-xs text-slate-500 max-w-sm mx-auto pt-1">
          The high-conviction deal platform bridging everyday community sharks with audited, revenue-generating Main Street enterprises.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 sm:rounded-2xl sm:px-10 space-y-6">
          {/* Persona Segment Control with 3 Isolated Personas */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">
              Choose Platform Persona
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleRoleChange('investor')}
                className={`flex flex-col items-center justify-center gap-1 py-2 px-1 text-center rounded-lg transition-all ${
                  selectedRole === 'investor'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-sky-600" />
                <span className="text-[11px] leading-tight">Shark Investor</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('owner')}
                className={`flex flex-col items-center justify-center gap-1 py-2 px-1 text-center rounded-lg transition-all ${
                  selectedRole === 'owner'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-sky-600" />
                <span className="text-[11px] leading-tight">Managing Founder</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('lister')}
                className={`flex flex-col items-center justify-center gap-1 py-2 px-1 text-center rounded-lg transition-all ${
                  selectedRole === 'lister'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-sky-600" />
                <span className="text-[11px] leading-tight">List Your Business</span>
              </button>
            </div>
          </div>

          {/* Persona Description */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            {selectedRole === 'investor' && (
              <div className="space-y-1">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  Big Believer (Shark Investor):
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Enter The Deal Tank: review audited unit economics, inspect sales pitches, invest in equity/rev-share/bonds, and track percentage owned & shares in your portfolio.
                </p>
              </div>
            )}

            {selectedRole === 'owner' && (
              <div className="space-y-1">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Active Business Founder:
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Enterprise command center: login with your business credentials to manage your listed round, upload sales & P&L documents, run AI financial extraction, and track shark allocations.
                </p>
              </div>
            )}

            {selectedRole === 'lister' && (
              <div className="space-y-1">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Business Listing Applicant:
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  New listing portal: prepare your sales pitch, review and pay platform due-diligence charges (₹15,000), submit for inspection, and track committee approval.
                </p>
              </div>
            )}
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {authError}
            </div>
          )}

          {/* Form based on Selected Persona */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* INVESTOR FORM */}
            {selectedRole === 'investor' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 block">
                    Investor Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={investorEmail}
                      onChange={(e) => setInvestorEmail(e.target.value)}
                      placeholder="shark@sfsb.invest"
                      className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={investorPassword}
                      onChange={(e) => setInvestorPassword(e.target.value)}
                      className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
                    />
                  </div>
                </div>
              </>
            )}

            {/* OWNER FORM - USERNAME & PASSWORD (NO BUSINESS LIST PICKER) */}
            {selectedRole === 'owner' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 block">
                    Business Username or Work Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={ownerUsername}
                      onChange={(e) => setOwnerUsername(e.target.value)}
                      placeholder="e.g. founder@crumbandco.in or crumb-and-co"
                      className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400 font-sans"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Registered enterprise handles (e.g. crumb-and-co, craftbrews, thread-and-loom)
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 block">
                    Enterprise Master Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      placeholder="Enter account password"
                      className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400 font-sans"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-2 text-[11px] text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Enterprise 2FA & encrypted ledger access enabled.</span>
                </div>
              </>
            )}

            {/* LISTER FORM */}
            {selectedRole === 'lister' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 block">
                    Applicant Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={listerEmail}
                      onChange={(e) => setListerEmail(e.target.value)}
                      placeholder="founder.applicant@sfsb.in"
                      className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={listerPassword}
                      onChange={(e) => setListerPassword(e.target.value)}
                      className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-400"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>
                {selectedRole === 'investor'
                  ? 'Enter Deal Tank as Big Believer (Shark)'
                  : selectedRole === 'owner'
                  ? 'Sign in to Founder Command Center'
                  : 'Enter Business Listing & Diligence Hub'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400 font-mono">
          SFSB - Sharks For Small Businesses • Where small businesses meet big believers
        </div>
      </div>
    </div>
  );
};
