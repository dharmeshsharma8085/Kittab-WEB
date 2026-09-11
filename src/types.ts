export type SourceType =
  | 'pdf'
  | 'notes'
  | 'image'
  | 'audio'
  | 'video'
  | 'youtube'
  | 'web'
  | 'text'
  | 'meeting';

export interface StructuredSummary {
  overview: string;
  executiveSummary: string;
  mainConcepts: { concept: string; explanation: string }[];
  detailedExplanation: string;
  keyDefinitions: { term: string; definition: string }[];
  importantFacts: string[];
  examples: string[];
  relationships: string;
  importantQuestions: string[];
  keyTakeaways: string[];
  examFocus: string[];
  difficultConcepts: { concept: string; whyDifficult: string; studyTip: string }[];
  finalRevisionSummary: string;
}

export interface VideoChapter {
  timestamp: string;
  title: string;
  summary: string;
}

export interface MeetingAnalysis {
  isMeeting: boolean;
  participants: string[];
  mainTopics: string[];
  keyDecisions: string[];
  actionItems: { task: string; assignee?: string; priority?: 'High' | 'Medium' | 'Low' }[];
  questionsRaised: string[];
  discussionPoints: string[];
  followUpTasks: string[];
}

export interface Chunk {
  id: string;
  sourceId: string;
  sourceTitle: string;
  content: string;
  pageNumber?: number;
  timestamp?: string;
  sectionHeader?: string;
  embedding?: number[];
}

export interface Source {
  id: string;
  title: string;
  type: SourceType;
  createdAt: string;
  originalFilenameOrUrl?: string;
  processingStatus: 'processing' | 'processed' | 'error';
  errorMessage?: string;
  wordCount: number;
  estimatedReadingTime: number; // in minutes
  chunksCount: number;
  summary: StructuredSummary;
  keyConcepts: string[];
  videoChapters?: VideoChapter[];
  meetingAnalysis?: MeetingAnalysis;
  rawTextPreview?: string;
  tags: string[];
}

export interface Citation {
  sourceId: string;
  sourceTitle: string;
  chunkId: string;
  pageNumber?: number;
  timestamp?: string;
  sectionHeader?: string;
  excerpt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: Citation[];
  isSourceGrounded?: boolean;
  sourcesUsed?: string[];
}

export interface Flashcard {
  id: string;
  sourceId: string;
  sourceTitle: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  status: 'unseen' | 'learning' | 'mastered' | 'difficult';
  lastReviewed?: string;
}

export type QuizQuestionType = 'mcq' | 'true_false' | 'short_answer';

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  options?: string[]; // for mcq
  correctAnswer: string;
  explanation: string;
  sourceCitation?: string;
  topic: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface Quiz {
  id: string;
  sourceId: string;
  sourceTitle: string;
  title: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  sourceId: string;
  sourceTitle: string;
  timestamp: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  weakTopics: string[];
  topicsToRevise: string[];
  recommendedFlashcards: string[];
}

export type GeneralChatMode =
  | 'general'
  | 'study_assistant'
  | 'creative'
  | 'brainstorm'
  | 'explain_anything';

export interface GeneralChatConversation {
  id: string;
  title: string;
  mode: GeneralChatMode;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscription {
  plan: 'free' | 'pro';
  dailyQuestionsUsed: number;
  dailyQuestionsLimit: number;
  totalSourcesCount: number;
  sourcesLimit: number;
  proExpiryDate?: string;
}

export interface UserProgress {
  totalSources: number;
  questionsAsked: number;
  flashcardsCreated: number;
  flashcardsMastered: number;
  testsCompleted: number;
  averageAccuracy: number;
  weakTopics: { topic: string; incorrectCount: number; sourceTitle: string }[];
  studyStreakDays: number;
  recentAttempts: QuizAttempt[];
}

export type ActiveTab =
  | 'home'
  | 'chat'
  | 'sources'
  | 'create'
  | 'flashcards'
  | 'tests'
  | 'search'
  | 'progress'
  | 'pricing'
  | 'settings';
