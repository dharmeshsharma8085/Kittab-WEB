import React from 'react';
import {
  BarChart3,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Award,
  Clock,
  BookOpen,
  Brain,
  FileCheck2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { UserProgress, ActiveTab } from '../types';

interface ProgressViewProps {
  progress: UserProgress;
  setActiveTab: (tab: ActiveTab) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  setActiveTab,
}) => {
  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-amber-700" />
          <span>Learning Analytics & Retention</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track knowledge mastery, test accuracy, retention streaks, and targeted study areas.
        </p>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold text-slate-600">Study Streak</span>
            <Flame className="h-4 w-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {progress.studyStreakDays} <span className="text-sm font-normal text-slate-500">Days</span>
          </div>
          <div className="text-[11px] text-orange-700 font-medium mt-1">Consistent learner</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold text-slate-600">Avg. Accuracy</span>
            <Award className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {progress.averageAccuracy}%
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Across all tests</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold text-slate-600">Cards Mastered</span>
            <Brain className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {progress.flashcardsMastered} / {progress.flashcardsCreated}
          </div>
          <div className="text-[11px] text-purple-700 font-medium mt-1">Active recall cards</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold text-slate-600">Questions Asked</span>
            <Sparkles className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {progress.questionsAsked}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Grounded RAG queries</div>
        </div>
      </div>

      {/* Adaptive Study System: Identified Weak Areas */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span>Diagnostic Weak Topics</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Concepts where questions were answered incorrectly. Focus revision on these.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('flashcards')}
            className="rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
          >
            Study Flashcards
          </button>
        </div>

        <div className="space-y-2.5">
          {progress.weakTopics.map((wt, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50/50 p-3.5 text-xs"
            >
              <div>
                <span className="font-bold text-red-950">{wt.topic}</span>
                <span className="text-slate-500 ml-2">({wt.sourceTitle})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                  {wt.incorrectCount} missed in tests
                </span>
                <button
                  onClick={() => setActiveTab('flashcards')}
                  className="rounded-lg bg-white border border-red-200 px-2.5 py-1 font-semibold text-red-700 hover:bg-red-50"
                >
                  Revise
                </button>
              </div>
            </div>
          ))}

          {progress.weakTopics.length === 0 && (
            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>No weak topics detected! Your test answers have been 100% accurate.</span>
            </div>
          )}
        </div>
      </div>

      {/* Recent Assessment Attempts Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileCheck2 className="h-4 w-4 text-emerald-600" />
          <span>Recent Test Attempts</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-2.5">Assessment Title</th>
                <th className="pb-2.5">Source Material</th>
                <th className="pb-2.5">Score</th>
                <th className="pb-2.5">Accuracy</th>
                <th className="pb-2.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {progress.recentAttempts.map((att) => (
                <tr key={att.id} className="text-slate-700 hover:bg-slate-50/50">
                  <td className="py-3 font-semibold text-slate-900">{att.quizTitle}</td>
                  <td className="py-3 text-slate-500 truncate max-w-[180px]">{att.sourceTitle}</td>
                  <td className="py-3 font-mono font-medium">
                    {att.score} / {att.totalQuestions}
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded px-2 py-0.5 font-bold ${
                        att.accuracy >= 75
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {att.accuracy}%
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">
                    {new Date(att.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
