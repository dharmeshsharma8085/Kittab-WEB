import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Zap,
  Trash2,
  Database,
  CheckCircle2,
  BookOpen,
  Info,
  Sliders,
} from 'lucide-react';
import { UserSubscription } from '../types';

interface SettingsViewProps {
  subscription: UserSubscription;
  onOpenPricing: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  subscription,
  onOpenPricing,
}) => {
  const [studyGoal, setStudyGoal] = useState('15');
  const [targetAccuracy, setTargetAccuracy] = useState('85');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 pb-16 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="h-6 w-6 text-slate-700" />
          <span>Account & Preferences</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure learning targets, vector index parameters, and view privacy settings.
        </p>
      </div>

      {/* Study Goals */}
      <form
        onSubmit={handleSavePreferences}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
      >
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="h-4 w-4 text-amber-700" />
          <span>Daily Learning Goals</span>
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Daily Flashcards Target
            </label>
            <input
              type="number"
              value={studyGoal}
              onChange={(e) => setStudyGoal(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Target Test Accuracy (%)
            </label>
            <input
              type="number"
              value={targetAccuracy}
              onChange={(e) => setTargetAccuracy(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedNotice ? (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Preferences saved!
            </span>
          ) : (
            <span />
          )}
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Save Goals
          </button>
        </div>
      </form>

      {/* System & Architecture Status */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Database className="h-4 w-4 text-emerald-600" />
          <span>System & RAG Architecture Status</span>
        </h2>

        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex items-center justify-between border-b border-slate-100 py-1.5">
            <span>Server Framework</span>
            <span className="font-mono font-medium text-slate-900">Node.js / Express</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 py-1.5">
            <span>RAG Vector Store</span>
            <span className="font-mono font-medium text-slate-900">
              ChromaDB / Cosine Hybrid Index
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 py-1.5">
            <span>LLM Grounding Model</span>
            <span className="font-mono font-medium text-slate-900">Gemini 3.8 Flash (Server-side)</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 py-1.5">
            <span>Multimodal Pipeline</span>
            <span className="font-mono font-medium text-slate-900">
              OCR + Whisper Transcription + PDF Parser
            </span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span>Active Plan</span>
            <button
              onClick={onOpenPricing}
              className="font-bold text-amber-800 hover:underline"
            >
              {subscription.plan.toUpperCase()} (Click to change)
            </button>
          </div>
        </div>
      </div>

      {/* Privacy & Academic Integrity */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-2">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Shield className="h-4 w-4 text-sky-600" />
          <span>Privacy & Academic Integrity</span>
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          KITTAB processes uploaded study materials strictly for indexing, synthesis, and active recall generation. Content is not shared or used to train third-party models. Citations always reflect your specific source text.
        </p>
      </div>
    </div>
  );
};
