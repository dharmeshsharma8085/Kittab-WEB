import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  PlusCircle,
  Award,
  AlertTriangle,
  Brain,
  Layers,
} from 'lucide-react';
import { Quiz, Source, QuizAttempt, QuizQuestion } from '../types';
import { submitQuiz, generateQuiz } from '../services/api';

interface TestsViewProps {
  quizzes: Quiz[];
  sources: Source[];
  onQuizCompleted: (attempt: QuizAttempt) => void;
  onNewQuizGenerated: (newQuiz: Quiz) => void;
  onNavigateToFlashcards: (sourceId?: string) => void;
  selectedSourceId?: string;
}

export const TestsView: React.FC<TestsViewProps> = ({
  quizzes,
  sources,
  onQuizCompleted,
  onNewQuizGenerated,
  onNavigateToFlashcards,
  selectedSourceId,
}) => {
  const [activeQuizId, setActiveQuizId] = useState<string>(
    quizzes.length > 0 ? quizzes[0].id : ''
  );
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attemptResult, setAttemptResult] = useState<{
    attempt: QuizAttempt;
    gradedQuestions: (QuizQuestion & { userAnswer: string; isCorrect: boolean })[];
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentQuiz = quizzes.find((q) => q.id === activeQuizId) || quizzes[0];

  const handleSelectAnswer = (questionId: string, answer: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmitTest = async () => {
    if (!currentQuiz) return;
    try {
      const result = await submitQuiz(currentQuiz.id, userAnswers);
      setAttemptResult(result);
      setIsSubmitted(true);
      onQuizCompleted(result.attempt);

      if (result.attempt.accuracy >= 75) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (e) {
      console.error('Failed to submit test:', e);
    }
  };

  const handleRetakeTest = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setAttemptResult(null);
  };

  const handleGenerateNewTest = async (sourceId: string, difficulty: 'easy' | 'medium' | 'hard') => {
    try {
      setIsGenerating(true);
      const newQuiz = await generateQuiz({ sourceId, difficulty });
      onNewQuizGenerated(newQuiz);
      setActiveQuizId(newQuiz.id);
      setUserAnswers({});
      setIsSubmitted(false);
      setAttemptResult(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="h-6 w-6 text-emerald-600" />
            <span>Practice Tests & Knowledge Checks</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate your comprehension with source-grounded questions and diagnostic feedback.
          </p>
        </div>

        {/* Generate New Assessment Trigger */}
        {sources.length > 0 && (
          <button
            disabled={isGenerating}
            onClick={() => handleGenerateNewTest(sources[0].id, 'medium')}
            className="flex items-center gap-1.5 rounded-xl bg-amber-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-800 disabled:opacity-50 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isGenerating ? 'Generating Test...' : 'Generate New Test'}</span>
          </button>
        )}
      </div>

      {/* Quiz Selector Dropdown & Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Select Assessment:</span>
          <select
            value={activeQuizId}
            onChange={(e) => {
              setActiveQuizId(e.target.value);
              handleRetakeTest();
            }}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-900 focus:outline-none"
          >
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title} ({q.questions.length} Qs · {q.difficulty.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {currentQuiz && (
          <div className="flex items-center gap-2 text-slate-500">
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-700">
              {currentQuiz.difficulty}
            </span>
            <span className="text-[11px] font-medium text-amber-900">
              {currentQuiz.sourceTitle}
            </span>
          </div>
        )}
      </div>

      {currentQuiz ? (
        <div className="space-y-6">
          {/* Results Screen if Submitted (Section 30) */}
          {isSubmitted && attemptResult && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              {/* Score Hero */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl bg-gradient-to-br from-amber-50/70 via-stone-50/50 to-orange-50/50 border border-amber-200 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-700 text-white shadow-sm">
                    <Award className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="font-['Space_Grotesk'] text-xl font-bold text-slate-900">
                      Score: {attemptResult.attempt.score} / {attemptResult.attempt.totalQuestions} ({attemptResult.attempt.accuracy}%)
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {attemptResult.attempt.accuracy >= 75
                        ? 'Excellent mastery! You demonstrated strong retention of key concepts.'
                        : 'Good effort! Review the weak areas and recommended flashcards below.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRetakeTest}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Retake Test</span>
                  </button>
                </div>
              </div>

              {/* Weak Areas & Topics to Revise (Section 31) */}
              {attemptResult.attempt.weakTopics.length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50/60 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-950">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span>Identified Weak Topics:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {attemptResult.attempt.weakTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-white border border-red-200 px-2.5 py-1 text-xs font-medium text-red-900"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onNavigateToFlashcards(currentQuiz.sourceId)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-800 hover:underline"
                    >
                      <Brain className="h-3.5 w-3.5" />
                      <span>Review targeted flashcards for these concepts →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Graded Questions Breakdown */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Question-by-Question Review</h3>
                {attemptResult.gradedQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`rounded-xl border p-4 text-xs space-y-2.5 ${
                      q.isCorrect
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : 'border-red-200 bg-red-50/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900">
                        Q{idx + 1}. {q.question}
                      </span>
                      {q.isCorrect ? (
                        <span className="flex items-center gap-1 font-bold text-emerald-700">
                          <CheckCircle2 className="h-4 w-4" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-bold text-red-700">
                          <XCircle className="h-4 w-4" /> Needs Review
                        </span>
                      )}
                    </div>

                    <div className="text-slate-600">
                      <strong>Your Answer:</strong> {q.userAnswer || '(None provided)'}
                    </div>

                    {!q.isCorrect && (
                      <div className="text-emerald-800 font-medium">
                        <strong>Correct Answer:</strong> {q.correctAnswer}
                      </div>
                    )}

                    <div className="rounded-lg bg-white border border-slate-200 p-2.5 text-slate-700 leading-relaxed">
                      <strong>Explanation:</strong> {q.explanation}
                      <div className="mt-1 text-[11px] text-amber-800 italic">
                        Citation: {q.sourceCitation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Test Questions (When not submitted) */}
          {!isSubmitted && (
            <div className="space-y-5">
              {currentQuiz.questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold text-slate-900">
                      Question {idx + 1} of {currentQuiz.questions.length}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 uppercase font-semibold text-[10px] text-slate-600">
                      {q.type.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="font-['Space_Grotesk'] text-sm font-semibold text-slate-900 leading-relaxed">
                    {q.question}
                  </p>

                  {/* MCQ Options */}
                  {q.type === 'mcq' && q.options && (
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectAnswer(q.id, opt)}
                            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-xs transition-all ${
                              isSelected
                                ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-semibold shadow-2xs'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-bold ${
                                isSelected
                                  ? 'border-amber-600 bg-amber-600 text-white'
                                  : 'border-slate-300 text-slate-500'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </div>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* True / False Options */}
                  {q.type === 'true_false' && (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      {['True', 'False'].map((tf) => {
                        const isSelected = userAnswers[q.id] === tf;
                        return (
                          <button
                            key={tf}
                            type="button"
                            onClick={() => handleSelectAnswer(q.id, tf)}
                            className={`rounded-xl border py-3 text-center text-xs font-semibold transition-all ${
                              isSelected
                                ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-2xs'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            {tf}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Short Answer Input */}
                  {q.type === 'short_answer' && (
                    <div className="pt-1">
                      <input
                        type="text"
                        value={userAnswers[q.id] || ''}
                        onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                        placeholder="Type your concise answer..."
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSubmitTest}
                  className="rounded-xl bg-amber-700 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-amber-800 transition-colors"
                >
                  Submit Assessment & View Diagnostic Score
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <FileCheck2 className="mx-auto h-10 w-10 text-slate-400 mb-2" />
          <h3 className="text-sm font-bold text-slate-900">No practice tests available</h3>
          <p className="text-xs text-slate-500 mt-1">
            Create or select a knowledge source to generate practice questions.
          </p>
        </div>
      )}
    </div>
  );
};
