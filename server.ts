import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { initialSources, initialFlashcards, initialQuizzes, populateInitialData } from './server/initialData';
import { globalSourceProcessor } from './server/sourceProcessor';
import { globalVectorStore } from './server/vectorStore';
import { globalRAGEngine } from './server/ragEngine';
import { globalStudyAssistant } from './server/studyAssistant';
import { globalChatEngine } from './server/chatEngine';
import { Source, Flashcard, Quiz, QuizAttempt, UserSubscription, UserProgress } from './src/types';

dotenv.config();

// In-memory application state
let sources: Source[] = [...initialSources];
let flashcards: Flashcard[] = [...initialFlashcards];
let quizzes: Quiz[] = [...initialQuizzes];
let quizAttempts: QuizAttempt[] = [
  {
    id: 'att-1',
    quizId: 'quiz-os-1',
    quizTitle: 'Process Management & Synchronization Mastery Test',
    sourceId: 'src-os-process-mgmt',
    sourceTitle: 'Operating Systems — Process Management & Synchronization',
    timestamp: '2026-09-09T14:30:00.000Z',
    score: 3,
    totalQuestions: 4,
    accuracy: 75,
    weakTopics: ['Priority Inversion'],
    topicsToRevise: ['Priority Inversion', 'Real-Time Scheduling'],
    recommendedFlashcards: ['fc-2'],
  },
  {
    id: 'att-2',
    quizId: 'quiz-dbms-1',
    quizTitle: 'Relational Normalization Assessment',
    sourceId: 'src-dbms-normalization',
    sourceTitle: 'Database Systems — Relational Normalization & SQL',
    timestamp: '2026-09-10T11:15:00.000Z',
    score: 3,
    totalQuestions: 3,
    accuracy: 100,
    weakTopics: [],
    topicsToRevise: [],
    recommendedFlashcards: [],
  },
];

let subscription: UserSubscription = {
  plan: 'free',
  dailyQuestionsUsed: 6,
  dailyQuestionsLimit: 25,
  totalSourcesCount: sources.length,
  sourcesLimit: 5,
};

let progress: UserProgress = {
  totalSources: sources.length,
  questionsAsked: 18,
  flashcardsCreated: flashcards.length,
  flashcardsMastered: flashcards.filter((f) => f.status === 'mastered').length,
  testsCompleted: quizAttempts.length,
  averageAccuracy: 88,
  weakTopics: [{ topic: 'Priority Inversion', incorrectCount: 1, sourceTitle: 'Operating Systems' }],
  studyStreakDays: 5,
  recentAttempts: quizAttempts,
};

// Populate initial vector store embeddings
populateInitialData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser with ample limit for multimodal base64 files
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      sourcesCount: sources.length,
      chunksCount: globalVectorStore.getChunks().length,
      hasGeminiApiKey: !!process.env.GEMINI_API_KEY,
    });
  });

  // 1. Sources Management
  app.get('/api/sources', (req, res) => {
    res.json(sources);
  });

  app.get('/api/sources/:id', (req, res) => {
    const source = sources.find((s) => s.id === req.params.id);
    if (!source) {
      return res.status(404).json({ error: 'Source not found' });
    }
    res.json(source);
  });

  app.post('/api/sources/process', async (req, res) => {
    try {
      const { title, type, content, fileBase64, mimeType, url, filename, isMeetingMode } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required for knowledge source' });
      }

      // Check plan limits
      if (subscription.plan === 'free' && sources.length >= subscription.sourcesLimit) {
        return res.status(403).json({
          error: 'Source limit reached on Free plan (max 5 sources). Upgrade to KITTAB Pro for higher limits.',
          limitReached: true,
        });
      }

      const result = await globalSourceProcessor.processSource({
        title,
        type: type || 'text',
        content,
        fileBase64,
        mimeType,
        url,
        filename,
        isMeetingMode,
      });

      sources.unshift(result.source);
      flashcards.push(...result.flashcards);
      quizzes.unshift(result.quiz);

      subscription.totalSourcesCount = sources.length;
      progress.totalSources = sources.length;
      progress.flashcardsCreated = flashcards.length;

      res.status(201).json(result);
    } catch (err: any) {
      console.error('Failed to process source:', err);
      res.status(500).json({ error: 'Unable to process this source: ' + (err.message || 'Unknown error') });
    }
  });

  app.delete('/api/sources/:id', (req, res) => {
    const { id } = req.params;
    sources = sources.filter((s) => s.id !== id);
    flashcards = flashcards.filter((f) => f.sourceId !== id);
    quizzes = quizzes.filter((q) => q.sourceId !== id);
    globalVectorStore.removeSourceChunks(id);

    subscription.totalSourcesCount = sources.length;
    progress.totalSources = sources.length;
    progress.flashcardsCreated = flashcards.length;

    res.json({ success: true, message: 'Source and associated vector records deleted' });
  });

  // 2. AI Study Assistant Action
  app.post('/api/sources/:id/action', async (req, res) => {
    try {
      const source = sources.find((s) => s.id === req.params.id);
      if (!source) {
        return res.status(404).json({ error: 'Source not found' });
      }
      const { action } = req.body;
      const result = await globalStudyAssistant.executeAction(source, action);
      res.json({ result });
    } catch (err: any) {
      console.error('Study assistant error:', err);
      res.status(500).json({ error: err.message || 'Action failed' });
    }
  });

  // 3. Grounded RAG Chat (Single or Multi-Source)
  app.post('/api/rag/chat', async (req, res) => {
    try {
      const { query, sourceIds, history } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }

      // Check daily questions limit on free plan
      if (subscription.plan === 'free' && subscription.dailyQuestionsUsed >= subscription.dailyQuestionsLimit) {
        return res.status(403).json({
          error: `Daily limit of ${subscription.dailyQuestionsLimit} AI questions reached on Free plan. Upgrade to KITTAB Pro for unlimited learning!`,
          limitReached: true,
        });
      }

      subscription.dailyQuestionsUsed += 1;
      progress.questionsAsked += 1;

      const response = await globalRAGEngine.answerQuestion({
        query,
        sourceIds: sourceIds || [],
        history: history || [],
      });

      res.json(response);
    } catch (err: any) {
      console.error('RAG chat error:', err);
      res.status(500).json({ error: err.message || 'RAG retrieval failed' });
    }
  });

  // 4. General AI Chat (Independent from sources)
  app.post('/api/chat/general', async (req, res) => {
    try {
      const { message, mode, funAction, history, topic } = req.body;

      if (!message && !funAction) {
        return res.status(400).json({ error: 'Message or fun action is required' });
      }

      if (subscription.plan === 'free' && subscription.dailyQuestionsUsed >= subscription.dailyQuestionsLimit) {
        return res.status(403).json({
          error: `Daily limit of ${subscription.dailyQuestionsLimit} AI messages reached on Free plan. Upgrade to KITTAB Pro for more conversations.`,
          limitReached: true,
        });
      }

      subscription.dailyQuestionsUsed += 1;

      const reply = await globalChatEngine.handleChat({
        message: message || '',
        mode: mode || 'general',
        funAction,
        history: history || [],
        topic,
      });

      res.json({ reply, dailyQuestionsUsed: subscription.dailyQuestionsUsed });
    } catch (err: any) {
      console.error('General chat error:', err);
      res.status(500).json({ error: err.message || 'Chat generation failed' });
    }
  });

  // 5. Flashcards
  app.get('/api/flashcards', (req, res) => {
    const { sourceId } = req.query;
    if (sourceId) {
      return res.json(flashcards.filter((f) => f.sourceId === sourceId));
    }
    res.json(flashcards);
  });

  app.patch('/api/flashcards/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const card = flashcards.find((f) => f.id === id);
    if (!card) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    if (status) {
      card.status = status;
      card.lastReviewed = new Date().toISOString();
    }
    progress.flashcardsMastered = flashcards.filter((f) => f.status === 'mastered').length;
    res.json(card);
  });

  // 6. Quizzes and Test Engine
  app.get('/api/quizzes', (req, res) => {
    const { sourceId } = req.query;
    if (sourceId) {
      return res.json(quizzes.filter((q) => q.sourceId === sourceId));
    }
    res.json(quizzes);
  });

  app.post('/api/quizzes/generate', async (req, res) => {
    try {
      const { sourceId, topic, difficulty, count } = req.body;
      const targetSource = sources.find((s) => s.id === sourceId) || sources[0];
      if (!targetSource) {
        return res.status(404).json({ error: 'No source available to generate test from' });
      }

      const generated = await globalSourceProcessor.generateQuizForSource(
        targetSource.id,
        topic || targetSource.title,
        targetSource.rawTextPreview || targetSource.summary.detailedExplanation,
        targetSource.keyConcepts
      );

      generated.difficulty = difficulty || 'medium';
      quizzes.unshift(generated);
      res.json(generated);
    } catch (err: any) {
      console.error('Quiz generation error:', err);
      res.status(500).json({ error: 'Failed to generate quiz: ' + err.message });
    }
  });

  app.post('/api/quizzes/submit', (req, res) => {
    const { quizId, answers } = req.body;
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    let correctCount = 0;
    const weakTopics: string[] = [];
    const gradedQuestions = quiz.questions.map((q) => {
      const userAnswer = (answers && answers[q.id]) || '';
      const isCorrect =
        userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() ||
        (q.type === 'short_answer' && q.correctAnswer.toLowerCase().includes(userAnswer.toLowerCase()) && userAnswer.length > 2);

      if (isCorrect) {
        correctCount++;
      } else {
        weakTopics.push(q.topic);
      }

      return {
        ...q,
        userAnswer,
        isCorrect,
      };
    });

    const accuracy = Math.round((correctCount / quiz.questions.length) * 100);
    const uniqueWeakTopics = Array.from(new Set(weakTopics));

    const attempt: QuizAttempt = {
      id: `att-${Date.now()}`,
      quizId,
      quizTitle: quiz.title,
      sourceId: quiz.sourceId,
      sourceTitle: quiz.sourceTitle,
      timestamp: new Date().toISOString(),
      score: correctCount,
      totalQuestions: quiz.questions.length,
      accuracy,
      weakTopics: uniqueWeakTopics,
      topicsToRevise: uniqueWeakTopics.map((t) => `Review concepts around ${t}`),
      recommendedFlashcards: flashcards
        .filter((f) => f.sourceId === quiz.sourceId && uniqueWeakTopics.includes(f.topic))
        .map((f) => f.id)
        .slice(0, 3),
    };

    quizAttempts.unshift(attempt);
    progress.testsCompleted = quizAttempts.length;

    // Update weak topics in user progress
    for (const wt of uniqueWeakTopics) {
      const existing = progress.weakTopics.find((w) => w.topic === wt);
      if (existing) {
        existing.incorrectCount++;
      } else {
        progress.weakTopics.push({ topic: wt, incorrectCount: 1, sourceTitle: quiz.sourceTitle });
      }
    }

    // Recalculate average accuracy
    const totalAccuracy = quizAttempts.reduce((acc, curr) => acc + curr.accuracy, 0);
    progress.averageAccuracy = Math.round(totalAccuracy / quizAttempts.length);
    progress.recentAttempts = quizAttempts;

    res.json({
      attempt,
      gradedQuestions,
    });
  });

  // 7. Global Semantic Search
  app.get('/api/search', async (req, res) => {
    try {
      const { q, type } = req.query;
      if (!q || typeof q !== 'string') {
        return res.json([]);
      }

      let sourceIds: string[] | undefined = undefined;
      if (type && typeof type === 'string' && type !== 'all') {
        sourceIds = sources.filter((s) => s.type === type).map((s) => s.id);
      }

      const results = await globalVectorStore.search(q, {
        sourceIds,
        topK: 8,
        minScore: 0.1,
      });

      res.json(
        results.map((r) => ({
          chunkId: r.chunk.id,
          sourceId: r.chunk.sourceId,
          sourceTitle: r.chunk.sourceTitle,
          pageNumber: r.chunk.pageNumber,
          timestamp: r.chunk.timestamp,
          sectionHeader: r.chunk.sectionHeader,
          content: r.chunk.content,
          score: Math.round(r.score * 100),
        }))
      );
    } catch (err: any) {
      console.error('Search error:', err);
      res.status(500).json({ error: 'Search failed' });
    }
  });

  // 8. User Subscription & Progress
  app.get('/api/user/subscription', (req, res) => {
    res.json(subscription);
  });

  app.post('/api/user/subscription/toggle', (req, res) => {
    const { plan } = req.body;
    subscription.plan = plan === 'pro' ? 'pro' : 'free';
    if (subscription.plan === 'pro') {
      subscription.dailyQuestionsLimit = 500;
      subscription.sourcesLimit = 100;
    } else {
      subscription.dailyQuestionsLimit = 25;
      subscription.sourcesLimit = 5;
    }
    res.json(subscription);
  });

  app.get('/api/user/progress', (req, res) => {
    res.json(progress);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KITTAB Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
