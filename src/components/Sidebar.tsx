import React from 'react';
import {
  Home,
  MessageSquare,
  BookMarked,
  PlusCircle,
  Brain,
  FileCheck2,
  Search,
  BarChart3,
  CreditCard,
  Settings,
  Sparkles,
  X,
  Crown,
} from 'lucide-react';
import { ActiveTab, UserSubscription } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription;
  onOpenPricing: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  subscription,
  onOpenPricing,
}) => {
  const navItems = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'chat' as ActiveTab, label: 'AI Chat', icon: MessageSquare, badge: 'General AI' },
    { id: 'sources' as ActiveTab, label: 'My Sources', icon: BookMarked },
    { id: 'create' as ActiveTab, label: 'Create Source', icon: PlusCircle, highlight: true },
    { id: 'flashcards' as ActiveTab, label: 'Flashcards', icon: Brain },
    { id: 'tests' as ActiveTab, label: 'Tests', icon: FileCheck2 },
    { id: 'search' as ActiveTab, label: 'Search', icon: Search },
    { id: 'progress' as ActiveTab, label: 'Progress', icon: BarChart3 },
    { id: 'pricing' as ActiveTab, label: 'Pricing', icon: CreditCard },
    { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:z-auto lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header with close button */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 lg:hidden">
          <span className="font-['Space_Grotesk'] text-lg font-bold text-slate-900">
            KITTAB Navigation
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation items list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-50 text-amber-900 font-semibold shadow-xs'
                    : item.highlight
                    ? 'text-amber-800 hover:bg-amber-50/60'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive
                        ? 'text-amber-700'
                        : item.highlight
                        ? 'text-amber-600'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="rounded bg-amber-200/60 px-1.5 py-0.5 text-[10px] font-medium text-amber-900">
                    + New
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Pro Upgrade & Plan Info Card */}
        <div className="border-t border-slate-200 p-3.5">
          <div className="rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 via-yellow-50/40 to-orange-50/60 p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Crown className="h-3.5 w-3.5 text-amber-600" />
                {subscription.plan === 'pro' ? 'Pro Membership' : 'Free Learning Plan'}
              </span>
              <span className="text-[10px] uppercase font-semibold text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded">
                {subscription.plan.toUpperCase()}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
              {subscription.plan === 'pro'
                ? 'High-limit multimodal processing, advanced multi-source RAG, and tests.'
                : 'Turn your notes, PDFs, lectures, and calls into active knowledge.'}
            </p>

            {subscription.plan !== 'pro' ? (
              <button
                onClick={() => {
                  onOpenPricing();
                  onClose();
                }}
                className="w-full rounded-lg bg-amber-700 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-800 transition-colors"
              >
                Upgrade to Pro (₹299/mo)
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenPricing();
                  onClose();
                }}
                className="w-full rounded-lg border border-amber-300 bg-white py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-50 transition-colors"
              >
                Manage Subscription
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
