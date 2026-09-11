import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Check,
  Crown,
  Sparkles,
  Zap,
  Shield,
  HelpCircle,
  Clock,
  BookOpen,
  Brain,
  FileCheck2,
  Users,
} from 'lucide-react';
import { UserSubscription } from '../types';
import { toggleSubscription } from '../services/api';

interface PricingViewProps {
  subscription: UserSubscription;
  onSubscriptionUpdated: (sub: UserSubscription) => void;
  onClose?: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  subscription,
  onSubscriptionUpdated,
  onClose,
}) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handlePlanToggle = async (targetPlan: 'free' | 'pro') => {
    try {
      setIsUpgrading(true);
      const updated = await toggleSubscription(targetPlan);
      onSubscriptionUpdated(updated);
      setShowCheckoutModal(false);
      if (targetPlan === 'pro') {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpgrading(false);
    }
  };

  const isPro = subscription.plan === 'pro';

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
          <Crown className="h-3.5 w-3.5 text-amber-600" />
          <span>Student-Friendly Pricing</span>
        </div>
        <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-slate-900">
          Supercharge your learning with KITTAB Pro
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed">
          Affordable, academic AI built for university students, researchers, and competitive exams.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        {/* Free Plan */}
        <div
          className={`relative flex flex-col justify-between rounded-3xl border p-6 shadow-xs transition-all ${
            !isPro
              ? 'border-amber-600 bg-white ring-2 ring-amber-500/20'
              : 'border-slate-200 bg-slate-50/50'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-900">Free Tier</span>
              {!isPro && (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 uppercase">
                  Current Plan
                </span>
              )}
            </div>

            <div className="mb-4">
              <span className="font-['Space_Grotesk'] text-4xl font-bold text-slate-900">₹0</span>
              <span className="text-xs text-slate-500"> / forever</span>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Essential multimodal learning tools for everyday coursework and reading.
            </p>

            <div className="space-y-3 border-t border-slate-100 pt-5 text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Up to 5 Knowledge Sources</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>25 AI queries / day</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Full 12-Section structured summaries</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Up to 2 sources concurrent RAG</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Standard Flashcards & Practice Tests</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            {isPro ? (
              <button
                onClick={() => handlePlanToggle('free')}
                disabled={isUpgrading}
                className="w-full rounded-xl border border-slate-300 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Downgrade to Free
              </button>
            ) : (
              <button
                disabled
                className="w-full rounded-xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-400 cursor-default"
              >
                Active Plan
              </button>
            )}
          </div>
        </div>

        {/* Pro Plan (₹299/mo) */}
        <div
          className={`relative flex flex-col justify-between rounded-3xl border p-6 shadow-md transition-all ${
            isPro
              ? 'border-amber-600 bg-white ring-2 ring-amber-500/20'
              : 'border-amber-300 bg-gradient-to-br from-amber-50/70 via-stone-50/50 to-orange-50/60'
          }`}
        >
          {/* Top Pill */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-700 px-3 py-0.5 text-[10px] font-bold text-white shadow-xs uppercase tracking-wider">
            Most Popular
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                <Crown className="h-4 w-4 text-amber-600" />
                <span>KITTAB Pro</span>
              </span>
              {isPro && (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 uppercase">
                  Active Member
                </span>
              )}
            </div>

            <div className="mb-4">
              <span className="font-['Space_Grotesk'] text-4xl font-bold text-slate-900">₹299</span>
              <span className="text-xs text-slate-600"> / month</span>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Designed for serious university students, competitive exam prep, and research teams.
            </p>

            <div className="space-y-3 border-t border-amber-200/60 pt-5 text-xs text-slate-800">
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-amber-700 shrink-0" />
                <span className="font-semibold">100+ Knowledge Sources</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-amber-700 shrink-0" />
                <span className="font-semibold">Unlimited AI queries (500/day)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-amber-700 shrink-0" />
                <span>Unlimited multi-source RAG synthesis</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-amber-700 shrink-0" />
                <span>300 mins Audio/Video lecture transcription</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-amber-700 shrink-0" />
                <span>Full Meeting & Lecture Intelligence</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-amber-700 shrink-0" />
                <span>Priority Vector Store embeddings</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            {isPro ? (
              <button
                disabled
                className="w-full rounded-xl bg-amber-100 py-2.5 text-xs font-semibold text-amber-900 cursor-default"
              >
                ✓ Active Pro Membership
              </button>
            ) : (
              <button
                onClick={() => setShowCheckoutModal(true)}
                disabled={isUpgrading}
                className="w-full rounded-xl bg-amber-700 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-800 transition-colors"
              >
                Upgrade to Pro (₹299/mo)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Simulated Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-600" />
                <span className="font-bold text-sm text-slate-900">
                  Upgrade to KITTAB Pro
                </span>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>

            <div className="rounded-xl bg-amber-50/80 p-3.5 text-xs text-amber-950 space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Plan:</span>
                <span>KITTAB Pro (Monthly)</span>
              </div>
              <div className="flex justify-between font-bold text-amber-900 text-sm pt-1">
                <span>Total Due:</span>
                <span>₹299</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              *Prototyping Mode: Click below to simulate an instant mock checkout. No real card will be charged.
            </p>

            <button
              onClick={() => handlePlanToggle('pro')}
              disabled={isUpgrading}
              className="w-full rounded-xl bg-amber-700 py-3 text-xs font-bold text-white shadow-sm hover:bg-amber-800 transition-colors"
            >
              {isUpgrading ? 'Activating Pro...' : 'Confirm Upgrade (Mock Payment ₹299)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
