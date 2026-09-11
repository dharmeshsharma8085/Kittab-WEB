import {
  Source,
  Flashcard,
  Quiz,
  QuizAttempt,
  UserSubscription,
  UserProgress,
  Citation,
  GeneralChatMode,
  SourceType,
} from '../types';

export async function fetchSources(): Promise<Source[]> {
  const res = await fetch('/api/sources');
  if (!res.ok) throw new Error('Failed to fetch sources');
  return res.json();
}

export async function fetchSourceById(id: string): Promise<Source> {
  const res = await fetch(`/api/sources/${id}`);
  if (!res.ok) throw new Error('Source not found');
  return res.json();
}

export async function processSource(payload: {
  title: string;
  type: SourceType;
  content?: string;
  fileBase64?: string;
  mimeType?: string;
  url?: string;
  filename?: string;
  isMeetingMode?: boolean;
}): Promise<{ source: Source; flashcards: Flashcard[]; quiz: Quiz }> {
  const res = await fetch('/api/sources/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to process source');
  }
  return data;
}

export async function deleteSource(id: string): Promise<void> {
  const res = await fetch(`/api/sources/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete source');
}

export async function executeSourceAction(id: string, action: string): Promise<string> {
  const res = await fetch(`/api/sources/${id}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Action failed');
  return data.result;
}

export async function sendRAGChat(payload: {
  query: string;
  sourceIds: string[];
  history?: { role: 'user' | 'assistant'; content: string }[];
}): Promise<{
  answer: string;
  citations: Citation[];
  isSourceGrounded: boolean;
  sourcesUsed: string[];
}> {
  const res = await fetch('/api/rag/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Chat request failed');
  return data;
}

export async function sendGeneralChat(payload: {
  message?: string;
  mode?: GeneralChatMode;
  funAction?: 'challenge' | 'quiz' | 'random_fact' | 'debate' | 'brainstorm';
  history?: { role: 'user' | 'assistant'; content: string }[];
  topic?: string;
}): Promise<{ reply: string; dailyQuestionsUsed: number }> {
  const res = await fetch('/api/chat/general', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'General chat failed');
  return data;
}

export async function fetchFlashcards(sourceId?: string): Promise<Flashcard[]> {
  const url = sourceId ? `/api/flashcards?sourceId=${encodeURIComponent(sourceId)}` : '/api/flashcards';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch flashcards');
  return res.json();
}

export async function updateFlashcardStatus(
  id: string,
  status: 'unseen' | 'learning' | 'mastered' | 'difficult'
): Promise<Flashcard> {
  const res = await fetch(`/api/flashcards/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update flashcard');
  return res.json();
}

export async function fetchQuizzes(sourceId?: string): Promise<Quiz[]> {
  const url = sourceId ? `/api/quizzes?sourceId=${encodeURIComponent(sourceId)}` : '/api/quizzes';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch quizzes');
  return res.json();
}

export async function generateQuiz(payload: {
  sourceId: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  count?: number;
}): Promise<Quiz> {
  const res = await fetch('/api/quizzes/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to generate quiz');
  return data;
}

export async function submitQuiz(
  quizId: string,
  answers: Record<string, string>
): Promise<{ attempt: QuizAttempt; gradedQuestions: any[] }> {
  const res = await fetch('/api/quizzes/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quizId, answers }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit quiz');
  return data;
}

export async function semanticSearch(
  q: string,
  type?: string
): Promise<
  {
    chunkId: string;
    sourceId: string;
    sourceTitle: string;
    pageNumber?: number;
    timestamp?: string;
    sectionHeader?: string;
    content: string;
    score: number;
  }[]
> {
  const url = `/api/search?q=${encodeURIComponent(q)}${type ? `&type=${encodeURIComponent(type)}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

export async function fetchSubscription(): Promise<UserSubscription> {
  const res = await fetch('/api/user/subscription');
  if (!res.ok) throw new Error('Failed to fetch subscription');
  return res.json();
}

export async function toggleSubscription(plan: 'free' | 'pro'): Promise<UserSubscription> {
  const res = await fetch('/api/user/subscription/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  });
  if (!res.ok) throw new Error('Failed to change subscription');
  return res.json();
}

export async function fetchProgress(): Promise<UserProgress> {
  const res = await fetch('/api/user/progress');
  if (!res.ok) throw new Error('Failed to fetch progress');
  return res.json();
}
