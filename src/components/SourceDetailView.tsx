import React, { useState } from 'react';
import {
  BookOpen,
  ArrowLeft,
  Sparkles,
  Brain,
  FileCheck2,
  MessageSquare,
  Clock,
  Layers,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  ListOrdered,
  AlertTriangle,
  FileText,
  Users,
  CheckSquare,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Source } from '../types';
import { executeSourceAction } from '../services/api';

interface SourceDetailViewProps {
  source: Source;
  onBack: () => void;
  onStartChat: (source: Source) => void;
  onGoToFlashcards: (sourceId: string) => void;
  onGoToTests: (sourceId: string) => void;
}

export const SourceDetailView: React.FC<SourceDetailViewProps> = ({
  source,
  onBack,
  onStartChat,
  onGoToFlashcards,
  onGoToTests,
}) => {
  const [activeAssistantResult, setActiveAssistantResult] = useState<{
    action: string;
    content: string;
  } | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [showRawText, setShowRawText] = useState(false);

  const assistantActions = [
    { id: 'explain_simply', label: 'Explain Simply', icon: Lightbulb },
    { id: 'explain_detail', label: 'Explain in Detail', icon: Brain },
    { id: 'find_topics', label: 'Important Topics', icon: ListOrdered },
    { id: 'extract_definitions', label: 'Extract Definitions', icon: BookOpen },
    { id: 'extract_questions', label: 'Exam Questions', icon: HelpCircle },
    { id: 'extract_action_items', label: 'Action Items', icon: CheckSquare },
    { id: 'quick_revision', label: '3-Min Revision', icon: Sparkles },
  ];

  const handleExecuteAction = async (actionId: string, label: string) => {
    try {
      setLoadingAction(actionId);
      const result = await executeSourceAction(source.id, actionId);
      setActiveAssistantResult({ action: label, content: result });
    } catch (err: any) {
      setActiveAssistantResult({
        action: label,
        content: 'Error running action: ' + (err.message || 'Unknown error'),
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const { summary, meetingAnalysis, videoChapters } = source;

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Top Navigation & Primary Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Sources</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onStartChat(source)}
            className="flex items-center gap-1.5 rounded-xl bg-amber-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-800 transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Chat with this Source (RAG)</span>
          </button>

          <button
            onClick={() => onGoToFlashcards(source.id)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Brain className="h-4 w-4 text-purple-600" />
            <span>Flashcards</span>
          </button>

          <button
            onClick={() => onGoToTests(source.id)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FileCheck2 className="h-4 w-4 text-emerald-600" />
            <span>Practice Test</span>
          </button>
        </div>
      </div>

      {/* Source Title & Header Details */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900 uppercase">
            {source.type}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {source.wordCount.toLocaleString()} words · ~{source.estimatedReadingTime} min read
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" />
            {source.chunksCount} index chunks
          </span>
        </div>

        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900 sm:text-3xl">
          {source.title}
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed">
          {summary.overview}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {source.keyConcepts.map((c, i) => (
            <span
              key={i}
              className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
            >
              #{c}
            </span>
          ))}
        </div>
      </div>

      {/* AI Study Assistant Action Toolbar (Section 16 & 18) */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50/70 via-stone-50/50 to-orange-50/50 p-4 shadow-xs">
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
            <Sparkles className="h-4 w-4 text-amber-700" />
            <span>AI Study Assistant Quick Actions</span>
          </div>
          <span className="text-[11px] text-amber-800 font-medium">One-click analysis</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {assistantActions.map((action) => {
            const Icon = action.icon;
            const isLoading = loadingAction === action.id;
            return (
              <button
                key={action.id}
                disabled={!!loadingAction}
                onClick={() => handleExecuteAction(action.id, action.label)}
                className="flex items-center gap-1.5 rounded-lg border border-amber-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-2xs hover:bg-amber-100/70 disabled:opacity-50 transition-all"
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-700" />
                ) : (
                  <Icon className="h-3.5 w-3.5 text-amber-700" />
                )}
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>

        {/* Assistant Response Box */}
        {activeAssistantResult && (
          <div className="mt-4 rounded-xl border border-amber-300/80 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>AI Study Output: {activeAssistantResult.action}</span>
              </span>
              <button
                onClick={() => setActiveAssistantResult(null)}
                className="text-xs font-medium text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>
            <div className="prose prose-sm max-w-none text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
              {activeAssistantResult.content}
            </div>
          </div>
        )}
      </div>

      {/* Video Chapters (If Video / YouTube / Audio) */}
      {videoChapters && videoChapters.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-rose-600" />
            <span>Video & Lecture Chapters</span>
          </h2>
          <div className="space-y-2">
            {videoChapters.map((ch, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3 text-xs"
              >
                <span className="rounded bg-rose-100 px-2 py-0.5 font-mono text-[11px] font-bold text-rose-800">
                  {ch.timestamp}
                </span>
                <div>
                  <div className="font-semibold text-slate-900">{ch.title}</div>
                  <div className="text-slate-500 mt-0.5">{ch.summary}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meeting Analysis (If Meeting Mode) */}
      {meetingAnalysis && meetingAnalysis.isMeeting && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Users className="h-4 w-4 text-amber-700" />
            <span>Meeting & Lecture Intelligence</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2">
              <span className="font-bold text-slate-800">Key Decisions Made:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                {meetingAnalysis.keyDecisions.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2">
              <span className="font-bold text-slate-800">Action Items:</span>
              <div className="space-y-1.5">
                {meetingAnalysis.actionItems.map((a, i) => (
                  <div key={i} className="flex items-center justify-between text-slate-700 bg-white p-1.5 rounded border border-slate-200">
                    <span className="font-medium">{a.task}</span>
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                      {a.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full 12-Section Structured Summary (Section 9) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-8">
        {/* 1 & 2: Executive Summary */}
        <section className="space-y-2 border-b border-slate-100 pb-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-900">
              1
            </span>
            <span>Executive Summary</span>
          </h2>
          <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
            {summary.executiveSummary}
          </p>
        </section>

        {/* 3: Main Concepts */}
        <section className="space-y-3 border-b border-slate-100 pb-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-900">
              2
            </span>
            <span>Main Concepts</span>
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {summary.mainConcepts.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1"
              >
                <div className="text-xs font-bold text-slate-900">{item.concept}</div>
                <div className="text-xs text-slate-600 leading-relaxed">{item.explanation}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 4: Detailed Explanation */}
        <section className="space-y-2 border-b border-slate-100 pb-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-900">
              3
            </span>
            <span>Detailed In-Depth Explanation</span>
          </h2>
          <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap sm:text-sm">
            {summary.detailedExplanation}
          </div>
        </section>

        {/* 5: Key Definitions */}
        <section className="space-y-3 border-b border-slate-100 pb-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-900">
              4
            </span>
            <span>Key Definitions & Glossary</span>
          </h2>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {summary.keyDefinitions.map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-200 bg-white p-3 text-xs"
              >
                <span className="font-bold text-amber-900">{item.term}:</span>{' '}
                <span className="text-slate-600">{item.definition}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 6 & 7: Important Facts & Examples */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 border-b border-slate-100 pb-5">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Important Facts</span>
            </h2>
            <ul className="list-disc space-y-1.5 pl-4 text-xs text-slate-600 leading-relaxed">
              {summary.importantFacts.map((fact, idx) => (
                <li key={idx}>{fact}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <span>Practical Examples</span>
            </h2>
            <ul className="list-disc space-y-1.5 pl-4 text-xs text-slate-600 leading-relaxed">
              {summary.examples.map((ex, idx) => (
                <li key={idx}>{ex}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* 8: Relationships Between Concepts */}
        <section className="space-y-2 border-b border-slate-100 pb-5">
          <h2 className="text-sm font-bold text-slate-900">
            How Main Concepts Connect & Contrast
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {summary.relationships}
          </p>
        </section>

        {/* 9 & 10: Important Questions & Key Takeaways */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 border-b border-slate-100 pb-5">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-sky-600" />
              <span>Important Exam & Viva Questions</span>
            </h2>
            <ul className="list-disc space-y-1.5 pl-4 text-xs text-slate-600 leading-relaxed">
              {summary.importantQuestions.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span>Key Takeaways</span>
            </h2>
            <ul className="list-disc space-y-1.5 pl-4 text-xs text-slate-600 leading-relaxed">
              {summary.keyTakeaways.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* 11 & 12: Difficult Concepts & Exam Focus */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 border-b border-slate-100 pb-5">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span>Difficult Concepts & How to Learn Them</span>
            </h2>
            <div className="space-y-2">
              {summary.difficultConcepts.map((d, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-red-100 bg-red-50/50 p-3 text-xs space-y-1"
                >
                  <div className="font-bold text-red-900">{d.concept}</div>
                  <div className="text-slate-600">
                    <strong>Challenge:</strong> {d.whyDifficult}
                  </div>
                  <div className="text-red-700 font-medium">
                    💡 <strong>Study Tip:</strong> {d.studyTip}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-600" />
              <span>Exam & Assessment Focus</span>
            </h2>
            <ul className="list-disc space-y-1.5 pl-4 text-xs text-slate-600 leading-relaxed">
              {summary.examFocus.map((ef, idx) => (
                <li key={idx}>{ef}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Final Rapid Revision Summary */}
        <section className="rounded-xl border border-amber-300 bg-amber-50/70 p-4 space-y-1.5">
          <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-700" />
            <span>Final Rapid Revision Summary</span>
          </div>
          <p className="text-xs leading-relaxed text-amber-900">
            {summary.finalRevisionSummary}
          </p>
        </section>

        {/* Raw Content Collapsible */}
        <div className="pt-2">
          <button
            onClick={() => setShowRawText(!showRawText)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            {showRawText ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span>{showRawText ? 'Hide Indexed Text Excerpt' : 'Show Indexed Text Excerpt'}</span>
          </button>

          {showRawText && (
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
              {source.rawTextPreview || 'Raw text preview unavailable.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
