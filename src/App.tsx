import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SourceCreation } from './components/SourceCreation';
import { SourceLibrary } from './components/SourceLibrary';
import { SourceDetailView } from './components/SourceDetailView';
import { RAGChat } from './components/RAGChat';
import { GeneralAIChat } from './components/GeneralAIChat';
import { FlashcardsView } from './components/FlashcardsView';
import { TestsView } from './components/TestsView';
import { SemanticSearch } from './components/SemanticSearch';
import { ProgressView } from './components/ProgressView';
import { PricingView } from './components/PricingView';
import { SettingsView } from './components/SettingsView';
import {
  Source,
  Flashcard,
  Quiz,
  QuizAttempt,
  UserSubscription,
  UserProgress,
  ActiveTab,
} from './types';
import {
  fetchSources,
  fetchFlashcards,
  fetchQuizzes,
  fetchSubscription,
  fetchProgress,
  deleteSource,
} from './services/api';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core data states
  const [sources, setSources] = useState<Source[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription>({
    plan: 'free',
    dailyQuestionsUsed: 6,
    dailyQuestionsLimit: 25,
    totalSourcesCount: 3,
    sourcesLimit: 5,
  });
  const [progress, setProgress] = useState<UserProgress>({
    totalSources: 3,
    questionsAsked: 18,
    flashcardsCreated: 6,
    flashcardsMastered: 2,
    testsCompleted: 2,
    averageAccuracy: 88,
    weakTopics: [{ topic: 'Priority Inversion', incorrectCount: 1, sourceTitle: 'Operating Systems' }],
    studyStreakDays: 5,
    recentAttempts: [],
  });

  // Active contextual selections
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [contextSourceIdForChat, setContextSourceIdForChat] = useState<string | undefined>();
  const [contextSourceIdForFlashcards, setContextSourceIdForFlashcards] = useState<string | undefined>();
  const [contextSourceIdForTests, setContextSourceIdForTests] = useState<string | undefined>();
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Fetch initial data from server
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedSources, loadedCards, loadedQuizzes, loadedSub, loadedProg] =
          await Promise.all([
            fetchSources(),
            fetchFlashcards(),
            fetchQuizzes(),
            fetchSubscription(),
            fetchProgress(),
          ]);

        setSources(loadedSources);
        setFlashcards(loadedCards);
        setQuizzes(loadedQuizzes);
        setSubscription(loadedSub);
        setProgress(loadedProg);
      } catch (err) {
        console.warn('Could not load from API, will use fallback state:', err);
      } finally {
        setIsLoadingInitial(false);
      }
    }
    loadData();
  }, []);

  const handleSourceCreated = (
    newSource: Source,
    newFlashcards: Flashcard[],
    newQuiz: Quiz
  ) => {
    setSources((prev) => [newSource, ...prev]);
    setFlashcards((prev) => [...newFlashcards, ...prev]);
    setQuizzes((prev) => [newQuiz, ...prev]);
    setSelectedSource(newSource);
    setActiveTab('sources');
    // Update progress counters
    setProgress((prev) => ({
      ...prev,
      totalSources: prev.totalSources + 1,
      flashcardsCreated: prev.flashcardsCreated + newFlashcards.length,
    }));
  };

  const handleDeleteSource = async (id: string) => {
    try {
      await deleteSource(id);
      setSources((prev) => prev.filter((s) => s.id !== id));
      setFlashcards((prev) => prev.filter((f) => f.sourceId !== id));
      setQuizzes((prev) => prev.filter((q) => q.sourceId !== id));
      if (selectedSource?.id === id) {
        setSelectedSource(null);
      }
      setProgress((prev) => ({
        ...prev,
        totalSources: Math.max(0, prev.totalSources - 1),
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartChatWithSource = (source: Source) => {
    setContextSourceIdForChat(source.id);
    setActiveTab('chat');
  };

  const handleGoToFlashcardsForSource = (sourceId: string) => {
    setContextSourceIdForFlashcards(sourceId);
    setActiveTab('flashcards');
  };

  const handleGoToTestsForSource = (sourceId: string) => {
    setContextSourceIdForTests(sourceId);
    setActiveTab('tests');
  };

  const handleUpdateFlashcard = (updated: Flashcard) => {
    setFlashcards((prev) =>
      prev.map((f) => (f.id === updated.id ? updated : f))
    );
    // Update progress mastered count
    setProgress((prev) => ({
      ...prev,
      flashcardsMastered: flashcards.filter(
        (f) => (f.id === updated.id ? updated.status : f.status) === 'mastered'
      ).length,
    }));
  };

  const handleQuizCompleted = (attempt: QuizAttempt) => {
    setProgress((prev) => {
      const attempts = [attempt, ...prev.recentAttempts];
      const avg = Math.round(
        attempts.reduce((sum, a) => sum + a.accuracy, 0) / attempts.length
      );
      return {
        ...prev,
        testsCompleted: prev.testsCompleted + 1,
        averageAccuracy: avg,
        recentAttempts: attempts,
      };
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/70 font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 antialiased">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedSource(null);
          setActiveTab(tab);
        }}
        subscription={subscription}
        onOpenPricing={() => setActiveTab('pricing')}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main App Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setSelectedSource(null);
            setActiveTab(tab);
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          subscription={subscription}
          onOpenPricing={() => setActiveTab('pricing')}
        />

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          {isLoadingInitial ? (
            <div className="flex h-96 flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
              <p className="text-xs font-medium">Initializing KITTAB Knowledge Engine...</p>
            </div>
          ) : (
            <>
              {/* Home / Dashboard */}
              {activeTab === 'home' && (
                <Dashboard
                  sources={sources}
                  progress={progress}
                  setActiveTab={setActiveTab}
                  onSelectSource={(source) => {
                    setSelectedSource(source);
                    setActiveTab('sources');
                  }}
                />
              )}

              {/* My Sources / Source Detail */}
              {activeTab === 'sources' &&
                (selectedSource ? (
                  <SourceDetailView
                    source={selectedSource}
                    onBack={() => setSelectedSource(null)}
                    onStartChat={handleStartChatWithSource}
                    onGoToFlashcards={handleGoToFlashcardsForSource}
                    onGoToTests={handleGoToTestsForSource}
                  />
                ) : (
                  <SourceLibrary
                    sources={sources}
                    onSelectSource={(s) => setSelectedSource(s)}
                    onDeleteSource={handleDeleteSource}
                    onOpenCreate={() => setActiveTab('create')}
                    setActiveTab={setActiveTab}
                    onStartChatWithSource={handleStartChatWithSource}
                  />
                ))}

              {/* Create Knowledge Source */}
              {activeTab === 'create' && (
                <SourceCreation
                  onSourceCreated={handleSourceCreated}
                  onCancel={() => setActiveTab('sources')}
                />
              )}

              {/* AI Chat (Dual Mode: General AI Companion vs Grounded RAG) */}
              {activeTab === 'chat' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900">
                        {contextSourceIdForChat ? 'Source Grounded RAG Chat' : 'General AI Study Companion'}
                      </h1>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {contextSourceIdForChat
                          ? 'Answers strictly retrieved and cited from your indexed knowledge sources.'
                          : 'Explore any subject, brainstorm ideas, and solve challenges with your AI buddy.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setContextSourceIdForChat(undefined)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                          !contextSourceIdForChat
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        General AI Chat
                      </button>
                      <button
                        onClick={() =>
                          setContextSourceIdForChat(
                            sources.length > 0 ? sources[0].id : undefined
                          )
                        }
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                          contextSourceIdForChat
                            ? 'bg-amber-700 text-white shadow-2xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Source Grounded (RAG)
                      </button>
                    </div>
                  </div>

                  {contextSourceIdForChat ? (
                    <RAGChat
                      sources={sources}
                      activeSourceId={contextSourceIdForChat}
                      onSelectActiveSourceId={(id) => setContextSourceIdForChat(id)}
                    />
                  ) : (
                    <GeneralAIChat />
                  )}
                </div>
              )}

              {/* Flashcards View */}
              {activeTab === 'flashcards' && (
                <FlashcardsView
                  flashcards={flashcards}
                  sources={sources}
                  onUpdateFlashcard={handleUpdateFlashcard}
                  selectedSourceId={contextSourceIdForFlashcards}
                />
              )}

              {/* Tests View */}
              {activeTab === 'tests' && (
                <TestsView
                  quizzes={quizzes}
                  sources={sources}
                  onQuizCompleted={handleQuizCompleted}
                  onNewQuizGenerated={(newQ) => setQuizzes((prev) => [newQ, ...prev])}
                  onNavigateToFlashcards={(srcId) => {
                    setContextSourceIdForFlashcards(srcId);
                    setActiveTab('flashcards');
                  }}
                  selectedSourceId={contextSourceIdForTests}
                />
              )}

              {/* Global Semantic Search */}
              {activeTab === 'search' && (
                <SemanticSearch
                  sources={sources}
                  onSelectSource={(s) => {
                    setSelectedSource(s);
                    setActiveTab('sources');
                  }}
                />
              )}

              {/* Learning Progress & Adaptive Feedback */}
              {activeTab === 'progress' && (
                <ProgressView progress={progress} setActiveTab={setActiveTab} />
              )}

              {/* Pricing & Pro Membership */}
              {activeTab === 'pricing' && (
                <PricingView
                  subscription={subscription}
                  onSubscriptionUpdated={(sub) => setSubscription(sub)}
                  onClose={() => setActiveTab('home')}
                />
              )}

              {/* Settings & System Architecture */}
              {activeTab === 'settings' && (
                <SettingsView
                  subscription={subscription}
                  onOpenPricing={() => setActiveTab('pricing')}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
