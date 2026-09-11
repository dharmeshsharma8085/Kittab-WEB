import React, { useState } from 'react';
import {
  Brain,
  CheckCircle,
  AlertCircle,
  RotateCw,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Filter,
  Check,
  Star,
  Layers,
  LayoutGrid,
  Maximize2,
} from 'lucide-react';
import { Flashcard, Source } from '../types';
import { updateFlashcardStatus } from '../services/api';

interface FlashcardsViewProps {
  flashcards: Flashcard[];
  sources: Source[];
  onUpdateFlashcard: (updated: Flashcard) => void;
  selectedSourceId?: string;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  flashcards,
  sources,
  onUpdateFlashcard,
  selectedSourceId,
}) => {
  const [activeSourceFilter, setActiveSourceFilter] = useState<string>(
    selectedSourceId || 'all'
  );
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState<'study' | 'grid'>('study');

  const filteredCards = flashcards.filter((card) => {
    const matchesSource =
      activeSourceFilter === 'all' || card.sourceId === activeSourceFilter;
    const matchesDiff =
      difficultyFilter === 'all' || card.difficulty === difficultyFilter;
    const matchesStatus =
      statusFilter === 'all' || card.status === statusFilter;
    return matchesSource && matchesDiff && matchesStatus;
  });

  const currentCard = filteredCards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev < filteredCards.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredCards.length - 1));
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCurrentIndex(Math.floor(Math.random() * filteredCards.length));
  };

  const setCardStatus = async (
    status: 'learning' | 'mastered' | 'difficult'
  ) => {
    if (!currentCard) return;
    try {
      const updated = await updateFlashcardStatus(currentCard.id, status);
      onUpdateFlashcard(updated);
      handleNext();
    } catch (e) {
      console.error(e);
    }
  };

  const masteredCount = flashcards.filter((f) => f.status === 'mastered').length;
  const difficultCount = flashcards.filter((f) => f.status === 'difficult').length;
  const totalCount = flashcards.length;

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <span>AI Flashcard Mastery</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active recall cards generated directly from your uploaded knowledge sources.
          </p>
        </div>

        {/* View Mode & Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-emerald-800 font-semibold border border-emerald-200">
              {masteredCount} Mastered
            </span>
            <span className="rounded-lg bg-red-50 px-2.5 py-1 text-red-800 font-semibold border border-red-200">
              {difficultCount} Difficult
            </span>
          </div>

          <button
            onClick={() => setViewMode(viewMode === 'study' ? 'grid' : 'study')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {viewMode === 'study' ? <LayoutGrid className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            <span>{viewMode === 'study' ? 'Grid View' : 'Study Mode'}</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-xs">
        <span className="text-slate-400 flex items-center gap-1 font-medium">
          <Filter className="h-3.5 w-3.5" /> Filter:
        </span>

        {/* Source Dropdown */}
        <select
          value={activeSourceFilter}
          onChange={(e) => {
            setActiveSourceFilter(e.target.value);
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 focus:outline-none"
        >
          <option value="all">All Sources ({flashcards.length})</option>
          {sources.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>

        {/* Difficulty Dropdown */}
        <select
          value={difficultyFilter}
          onChange={(e) => {
            setDifficultyFilter(e.target.value);
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 focus:outline-none"
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="unseen">Unseen</option>
          <option value="learning">Learning</option>
          <option value="mastered">Mastered</option>
          <option value="difficult">Difficult</option>
        </select>
      </div>

      {filteredCards.length > 0 ? (
        viewMode === 'study' && currentCard ? (
          /* Single Interactive 3D Card Study Mode */
          <div className="space-y-6">
            {/* Progress Bar & Counter */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">
                Card {currentIndex + 1} of {filteredCards.length}
              </span>
              <div className="flex items-center gap-2">
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] uppercase font-bold text-slate-700">
                  {currentCard.difficulty}
                </span>
                <span className="text-[11px] text-amber-800 font-medium">
                  {currentCard.topic}
                </span>
              </div>
            </div>

            {/* Flashcard container with flip animation */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="group relative h-80 w-full cursor-pointer perspective-1000 select-none"
            >
              <div
                className={`relative h-full w-full rounded-2xl border border-slate-200 p-8 shadow-sm transition-all duration-300 transform-style-3d flex flex-col justify-between ${
                  isFlipped
                    ? 'bg-gradient-to-br from-purple-50/70 via-stone-50/60 to-indigo-50/70 border-purple-300 shadow-md'
                    : 'bg-white hover:border-amber-400 hover:shadow-md'
                }`}
              >
                {/* Card Top Label */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">
                    {isFlipped ? 'Answer & Explanation' : 'Question / Prompt'}
                  </span>
                  <span className="text-[11px] text-amber-700 font-medium truncate max-w-[200px]">
                    {currentCard.sourceTitle}
                  </span>
                </div>

                {/* Card Body Text */}
                <div className="my-auto text-center px-4">
                  <p
                    className={`font-['Space_Grotesk'] leading-relaxed ${
                      isFlipped
                        ? 'text-base font-medium text-slate-800'
                        : 'text-lg font-bold text-slate-900 sm:text-xl'
                    }`}
                  >
                    {isFlipped ? currentCard.back : currentCard.front}
                  </p>
                </div>

                {/* Card Bottom Hint */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <RotateCw className="h-3 w-3" />
                  <span>Click card to {isFlipped ? 'view question' : 'reveal answer'}</span>
                </div>
              </div>
            </div>

            {/* Study Controls: Known, Difficult, Next, Previous */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={handleShuffle}
                  className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  title="Shuffle deck"
                >
                  <Shuffle className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Status Marking Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCardStatus('difficult')}
                  className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-800 hover:bg-red-100"
                >
                  <Star className="h-3.5 w-3.5 text-red-600" />
                  <span>Mark Difficult</span>
                </button>

                <button
                  onClick={() => setCardStatus('mastered')}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-800"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Know It (Mastered)</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Grid View: View All Cards */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 uppercase font-bold text-slate-700">
                    {card.difficulty}
                  </span>
                  <span className="font-medium text-amber-800 truncate max-w-[150px]">
                    {card.topic}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900">{card.front}</div>
                <div className="text-xs text-slate-600 border-t border-slate-100 pt-2 leading-relaxed">
                  {card.back}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Brain className="mx-auto h-10 w-10 text-slate-400 mb-2" />
          <h3 className="text-sm font-bold text-slate-900">No flashcards match criteria</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your source or difficulty filter.
          </p>
        </div>
      )}
    </div>
  );
};
