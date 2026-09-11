import React from 'react';
import {
  BookOpen,
  Sparkles,
  Zap,
  Search,
  Crown,
  Layers,
  Menu,
  CheckCircle2,
} from 'lucide-react';
import { ActiveTab, UserSubscription } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  subscription: UserSubscription;
  onOpenPricing: () => void;
  toggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  subscription,
  onOpenPricing,
  toggleSidebar,
}) => {
  const isSourceGroundedMode =
    activeTab === 'sources' || activeTab === 'flashcards' || activeTab === 'tests';
  const isGeneralChat = activeTab === 'chat';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          title="Toggle Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div
          onClick={() => setActiveTab('home')}
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-700 via-amber-600 to-yellow-600 text-white shadow-sm shadow-amber-700/20">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-['Space_Grotesk'] text-xl font-bold tracking-tight text-slate-900">
                KITTAB
              </span>
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                AI RAG
              </span>
            </div>
            <p className="hidden text-[11px] text-slate-500 sm:block">
              Turn information into knowledge
            </p>
          </div>
        </div>
      </div>

      {/* Mode Indicator & Quick Search */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Knowledge Mode Indicator */}
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs md:flex">
          {isGeneralChat ? (
            <>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-slate-700">General AI Companion</span>
            </>
          ) : isSourceGroundedMode ? (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-600" />
              <span className="font-medium text-slate-700">Source Grounded RAG</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span className="font-medium text-slate-700">Multimodal Knowledge Base</span>
            </>
          )}
        </div>

        {/* Semantic Search Quick Trigger */}
        <button
          onClick={() => setActiveTab('search')}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100"
          title="Search across all sources"
        >
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <span className="hidden sm:inline">Search Index</span>
        </button>

        {/* AI Usage Quota Indicator */}
        <div className="hidden items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600 lg:flex">
          <Zap className="h-3.5 w-3.5 text-amber-600" />
          <span>
            {subscription.plan === 'pro'
              ? 'Pro Unlimited'
              : `${subscription.dailyQuestionsUsed} / ${subscription.dailyQuestionsLimit} queries`}
          </span>
        </div>

        {/* Subscription Plan Badge */}
        {subscription.plan === 'pro' ? (
          <div
            onClick={onOpenPricing}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-1 text-xs font-semibold text-amber-800 shadow-sm"
          >
            <Crown className="h-3.5 w-3.5 text-amber-600" />
            <span>KITTAB PRO</span>
          </div>
        ) : (
          <button
            onClick={onOpenPricing}
            className="flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-slate-800 shadow-sm"
          >
            <Crown className="h-3.5 w-3.5 text-amber-400" />
            <span>Upgrade ₹299</span>
          </button>
        )}
      </div>
    </header>
  );
};
