import { getGeminiClient } from './gemini';
import { globalVectorStore } from './vectorStore';
import { Citation, ChatMessage } from '../src/types';

export interface RAGChatRequest {
  query: string;
  sourceIds: string[];
  history?: { role: 'user' | 'assistant'; content: string }[];
}

export interface RAGChatResponse {
  answer: string;
  citations: Citation[];
  isSourceGrounded: boolean;
  sourcesUsed: string[];
}

export class RAGEngine {
  public async answerQuestion(request: RAGChatRequest): Promise<RAGChatResponse> {
    const { query, sourceIds, history = [] } = request;

    // 1. Retrieve top-k relevant chunks from selected sources
    const searchResults = await globalVectorStore.search(query, {
      sourceIds: sourceIds.length > 0 ? sourceIds : undefined,
      topK: 5,
      minScore: 0.12,
    });

    const citations: Citation[] = searchResults.map((r) => ({
      sourceId: r.chunk.sourceId,
      sourceTitle: r.chunk.sourceTitle,
      chunkId: r.chunk.id,
      pageNumber: r.chunk.pageNumber,
      timestamp: r.chunk.timestamp,
      sectionHeader: r.chunk.sectionHeader,
      excerpt: r.chunk.content.slice(0, 240) + (r.chunk.content.length > 240 ? '...' : ''),
    }));

    const uniqueSourcesUsed = Array.from(new Set(searchResults.map((r) => r.chunk.sourceTitle)));

    // If no chunks were retrieved with acceptable score
    if (searchResults.length === 0) {
      return {
        answer:
          "I couldn't find this information in the selected source(s). The requested topic does not appear in the uploaded study materials. Would you like me to answer using general AI knowledge instead?",
        citations: [],
        isSourceGrounded: false,
        sourcesUsed: [],
      };
    }

    // 2. Build context string with explicit citations
    const contextBlocks = searchResults
      .map((r, i) => {
        const ref = r.chunk.pageNumber
          ? `Page ${r.chunk.pageNumber}`
          : r.chunk.timestamp
          ? `Timestamp ${r.chunk.timestamp}`
          : r.chunk.sectionHeader || `Chunk ${i + 1}`;
        return `[Source: "${r.chunk.sourceTitle}" | ${ref}]\n${r.chunk.content}`;
      })
      .join('\n\n---\n\n');

    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `You are KITTAB, an elite academic learning assistant powered by Retrieval-Augmented Generation (RAG).

User Question: "${query}"

Retrieved Source Context:
"""
${contextBlocks}
"""

Recent Conversation:
${history
  .slice(-4)
  .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
  .join('\n')}

STRICT GUIDELINES:
1. Answer the question primarily and strictly using the facts in the Retrieved Source Context above.
2. If the retrieved context does not contain enough information to answer the question, clearly state:
   "I couldn't find sufficient information about this in the selected source(s)."
   You may then briefly indicate what would be needed.
3. Attribute points to the source using citations like "[Source: <Title>, Page/Timestamp/Section]".
4. Format with clear, readable markdown with bold key terms and bullet points.
5. If the user asks to compare multiple sources, explicitly contrast how each source addresses the topic.
6. Tone: Smart study buddy, academic, friendly, precise, and supportive.`;

        const resp = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        if (resp.text) {
          return {
            answer: resp.text,
            citations,
            isSourceGrounded: true,
            sourcesUsed: uniqueSourcesUsed,
          };
        }
      } catch (err: any) {
        console.warn('Gemini RAG generation error, using grounded fallback:', err.message);
      }
    }

    // Grounded fallback synthesis from retrieved chunks
    const primaryChunk = searchResults[0].chunk;
    const ref = primaryChunk.pageNumber
      ? `(Page ${primaryChunk.pageNumber})`
      : primaryChunk.timestamp
      ? `(Timestamp ${primaryChunk.timestamp})`
      : `(${primaryChunk.sectionHeader || 'Section'})`;

    const fallbackAnswer = `According to **${primaryChunk.sourceTitle}** ${ref}:\n\n${primaryChunk.content}\n\n*Source grounded answer synthesized from your uploaded knowledge index.*`;

    return {
      answer: fallbackAnswer,
      citations,
      isSourceGrounded: true,
      sourcesUsed: uniqueSourcesUsed,
    };
  }
}

export const globalRAGEngine = new RAGEngine();
