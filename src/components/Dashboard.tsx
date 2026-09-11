import React from 'react';
import {
  BookOpen,
  PlusCircle,
  FolderOpen,
  Brain,
  FileCheck2,
  HelpCircle,
  ArrowRight,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Headphones,
  Video,
  Globe,
  Flame,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';
import { Source, UserProgress, ActiveTab } from '../types';

interface DashboardProps {
  sources: Source[];
  progress: UserProgress;
  setActiveTab: (tab: ActiveTab) => void;
  onSelectSource: (source: Source) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  sources,
  progress,
  setActiveTab,
  onSelectSource,
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/70 via-stone-50/50 to-orange-50/40 p-6 sm:p-10">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-white/90 px-3 py-1 text-xs font-semibold text-amber-900 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Multimodal Agentic RAG Learning Assistant</span>
          </div>

          <h1 className="font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Turn information into knowledge.
          </h1>

          <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
            Upload notes, lectures, videos, audio, PDFs, or websites. KITTAB understands your
            content and turns it into structured summaries, answers, flashcards, and tests.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('create')}
              className="flex items-center gap-2 rounded-xl bg-amber-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-800 hover:shadow-md"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create a Knowledge Source</span>
            </button>

            <button
              onClick={() => setActiveTab('sources')}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:text-slate-900"
            >
              <FolderOpen className="h-4 w-4 text-slate-500" />
              <span>Explore My Sources</span>
            </button>
          </div>
        </div>

        {/* Decorative subtle background watermark */}
        <div className="pointer-events-none absolute -right-12 -bottom-12 select-none opacity-5">
          <BookOpen className="h-96 w-96 text-slate-900" />
        </div>
      </section>

      {/* Useful Statistics Bar */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Sources</span>
            <FolderOpen className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{sources.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Indexed knowledge bases</div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Questions Asked</span>
            <HelpCircle className="h-4 w-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{progress.questionsAsked}</div>
          <div className="text-[11px] text-slate-400 mt-1">RAG & AI queries answered</div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Flashcards Created</span>
            <Brain className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{progress.flashcardsCreated}</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">
            {progress.flashcardsMastered} cards mastered
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Tests Completed</span>
            <FileCheck2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{progress.testsCompleted}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Avg. accuracy: {progress.averageAccuracy}%
          </div>
        </div>
      </section>

      {/* Multimodal Ingestion Formats Bar */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>Supported Input Types</span>
          </h2>
          <span className="text-xs text-slate-500">Instant multimodal processing</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-6">
          <div
            onClick={() => setActiveTab('create')}
            className="cursor-pointer rounded-lg border border-slate-200/90 bg-slate-50/60 p-3 text-center transition-all hover:border-amber-400 hover:bg-amber-50/50"
          >
            <FileText className="mx-auto h-5 w-5 text-amber-700 mb-1.5" />
            <div className="text-xs font-semibold text-slate-800">PDFs & Docs</div>
            <div className="text-[10px] text-slate-500">Multi-page texts</div>
          </div>

          <div
            onClick={() => setActiveTab('create')}
            className="cursor-pointer rounded-lg border border-slate-200/90 bg-slate-50/60 p-3 text-center transition-all hover:border-amber-400 hover:bg-amber-50/50"
          >
            <ImageIcon className="mx-auto h-5 w-5 text-indigo-600 mb-1.5" />
            <div className="text-xs font-semibold text-slate-800">Notes & OCR</div>
            <div className="text-[10px] text-slate-500">Handwritten images</div>
          </div>

          <div
            onClick={() => setActiveTab('create')}
            className="cursor-pointer rounded-lg border border-slate-200/90 bg-slate-50/60 p-3 text-center transition-all hover:border-amber-400 hover:bg-amber-50/50"
          >
            <Headphones className="mx-auto h-5 w-5 text-emerald-600 mb-1.5" />
            <div className="text-xs font-semibold text-slate-800">Audio & Calls</div>
            <div className="text-[10px] text-slate-500">Whisper transcript</div>
          </div>

          <div
            onClick={() => setActiveTab('create')}
            className="cursor-pointer rounded-lg border border-slate-200/90 bg-slate-50/60 p-3 text-center transition-all hover:border-amber-400 hover:bg-amber-50/50"
          >
            <Video className="mx-auto h-5 w-5 text-rose-600 mb-1.5" />
            <div className="text-xs font-semibold text-slate-800">Video & YouTube</div>
            <div className="text-[10px] text-slate-500">Chapters & timestamps</div>
          </div>

          <div
            onClick={() => setActiveTab('create')}
            className="cursor-pointer rounded-lg border border-slate-200/90 bg-slate-50/60 p-3 text-center transition-all hover:border-amber-400 hover:bg-amber-50/50"
          >
            <Globe className="mx-auto h-5 w-5 text-sky-600 mb-1.5" />
            <div className="text-xs font-semibold text-slate-800">Websites</div>
            <div className="text-[10px] text-slate-500">Clean content scraping</div>
          </div>

          <div
            onClick={() => setActiveTab('chat')}
            className="cursor-pointer rounded-lg border border-slate-200/90 bg-slate-50/60 p-3 text-center transition-all hover:border-amber-400 hover:bg-amber-50/50"
          >
            <MessageSquare className="mx-auto h-5 w-5 text-amber-600 mb-1.5" />
            <div className="text-xs font-semibold text-slate-800">AI Chatbot</div>
            <div className="text-[10px] text-slate-500">Study companion</div>
          </div>
        </div>
      </section>

      {/* Recent Sources & Student Study Focus */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: My Knowledge Sources */}
        <section className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-amber-700" />
              <span>Recent Knowledge Sources</span>
            </h2>
            <button
              onClick={() => setActiveTab('sources')}
              className="text-xs font-semibold text-amber-800 hover:underline flex items-center gap-1"
            >
              <span>View all ({sources.length})</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3">
            {sources.slice(0, 3).map((source) => (
              <div
                key={source.id}
                className="group rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:border-amber-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 uppercase">
                        {source.type}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {source.wordCount.toLocaleString()} words · ~{source.estimatedReadingTime} min read
                      </span>
                    </div>
                    <h3
                      onClick={() => onSelectSource(source)}
                      className="cursor-pointer text-sm font-semibold text-slate-900 hover:text-amber-700 transition-colors"
                    >
                      {source.title}
                    </h3>
                    <p className="line-clamp-2 text-xs text-slate-500 leading-relaxed">
                      {source.summary.overview}
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs">
                  <button
                    onClick={() => onSelectSource(source)}
                    className="rounded-md bg-amber-50 px-2.5 py-1 font-medium text-amber-800 hover:bg-amber-100 transition-colors"
                  >
                    Open Summary
                  </button>
                  <button
                    onClick={() => {
                      onSelectSource(source);
                      setActiveTab('sources');
                    }}
                    className="rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    Ask Questions (RAG)
                  </button>
                  <button
                    onClick={() => setActiveTab('flashcards')}
                    className="rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    Flashcards
                  </button>
                  <button
                    onClick={() => setActiveTab('tests')}
                    className="rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    Practice Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Col: Adaptive Learning & Weak Topics */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-600" />
              <span>Adaptive Study Buddy</span>
            </h2>
            <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">
              {progress.studyStreakDays} Day Streak
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3.5">
            <div>
              <div className="text-xs font-bold text-slate-800 mb-1">
                Topics Requiring Revision
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Identified from your recent tests and flashcard practice.
              </p>
            </div>

            <div className="space-y-2">
              {progress.weakTopics.length > 0 ? (
                progress.weakTopics.slice(0, 3).map((wt, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-red-50/70 border border-red-100 px-3 py-2 text-xs"
                  >
                    <div>
                      <div className="font-medium text-red-900">{wt.topic}</div>
                      <div className="text-[10px] text-red-600">From {wt.sourceTitle}</div>
                    </div>
                    <button
                      onClick={() => setActiveTab('flashcards')}
                      className="rounded bg-white px-2 py-1 text-[11px] font-semibold text-red-700 shadow-2xs hover:bg-red-50 border border-red-200"
                    >
                      Revise
                    </button>
                  </div>
                ))
              ) : (
                <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>No weak areas flagged! Keep up the great work.</span>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-3">
              <button
                onClick={() => setActiveTab('tests')}
                className="w-full rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors text-center"
              >
                Take an Adaptive Quiz
              </button>
            </div>
          </div>

          {/* Quick Chat with KITTAB CTA */}
          <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 p-4">
            <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-amber-900">
              <Sparkles className="h-3.5 w-3.5 text-amber-700" />
              <span>Have a question?</span>
            </div>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Ask KITTAB to explain any tricky concept simply, brainstorm project ideas, or challenge you with a brain teaser.
            </p>
            <button
              onClick={() => setActiveTab('chat')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 hover:underline"
            >
              <span>Open AI Chat</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
