import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  BookOpen,
  Layers,
  Clock,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import { Source, ChatMessage, Citation } from '../types';
import { sendRAGChat } from '../services/api';

interface RAGChatProps {
  sources: Source[];
  activeSourceId?: string;
  onSelectActiveSourceId?: (id: string) => void;
}

export const RAGChat: React.FC<RAGChatProps> = ({
  sources,
  activeSourceId,
  onSelectActiveSourceId,
}) => {
  // Selected source IDs for RAG retrieval
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>(
    activeSourceId ? [activeSourceId] : sources.length > 0 ? [sources[0].id] : []
  );

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content:
        "Hello! I'm KITTAB's Source-Grounded RAG Assistant. Ask me anything about your selected knowledge sources, and I will synthesize answers strictly grounded in your materials with precise page and timestamp citations.",
      timestamp: new Date().toISOString(),
      isSourceGrounded: true,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCitationMsgId, setExpandedCitationMsgId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Update selected sources when activeSourceId prop changes
  useEffect(() => {
    if (activeSourceId && !selectedSourceIds.includes(activeSourceId)) {
      setSelectedSourceIds([activeSourceId]);
    }
  }, [activeSourceId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleSourceSelection = (id: string) => {
    setSelectedSourceIds((prev) => {
      if (prev.includes(id)) {
        // Prevent deselecting all
        if (prev.length === 1) return prev;
        return prev.filter((s) => s !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSendMessage = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = (customQuery || inputQuery).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await sendRAGChat({
        query,
        sourceIds: selectedSourceIds,
        history: messages.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: response.answer,
        citations: response.citations,
        isSourceGrounded: response.isSourceGrounded,
        sourcesUsed: response.sourcesUsed,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          role: 'assistant',
          content: 'Sorry, I encountered an error retrieving answers: ' + (err.message || 'Error'),
          timestamp: new Date().toISOString(),
          isSourceGrounded: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'msg-cleared',
        role: 'assistant',
        content:
          'Chat history cleared. Ready for your questions on selected knowledge sources!',
        timestamp: new Date().toISOString(),
        isSourceGrounded: true,
      },
    ]);
  };

  const activeSources = sources.filter((s) => selectedSourceIds.includes(s.id));

  return (
    <div className="flex h-[calc(100vh-8.5rem)] flex-col rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Top Source Selection Bar (Multi-source RAG support) */}
      <div className="border-b border-slate-200 bg-slate-50/70 p-3.5 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              <span>Source Grounded RAG</span>
            </span>
            <span className="text-xs text-slate-500 hidden md:inline">
              Select one or more sources to query concurrently:
            </span>
          </div>

          <button
            onClick={clearChat}
            className="self-end sm:self-auto flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Chat</span>
          </button>
        </div>

        {/* Source Pills Multi-Select */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {sources.map((src) => {
            const isSelected = selectedSourceIds.includes(src.id);
            return (
              <button
                key={src.id}
                type="button"
                onClick={() => toggleSourceSelection(src.id)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-all ${
                  isSelected
                    ? 'border border-amber-600 bg-amber-100/90 text-amber-950 font-bold shadow-2xs'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isSelected ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-700" />
                ) : (
                  <div className="h-3.5 w-3.5 rounded-full border border-slate-300" />
                )}
                <span className="truncate max-w-[200px]">{src.title}</span>
                <span className="rounded bg-white/70 px-1 text-[9px] uppercase font-semibold text-slate-500">
                  {src.type}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const hasCitations = msg.citations && msg.citations.length > 0;
          const isCitationsExpanded = expandedCitationMsgId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-3xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-amber-700 text-white rounded-br-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 rounded-bl-xs'
                }`}
              >
                {!isUser && (
                  <div className="mb-2 flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                      <span className="font-bold text-xs text-amber-900">
                        KITTAB RAG
                      </span>
                      {msg.isSourceGrounded ? (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-800">
                          Grounded in Source
                        </span>
                      ) : (
                        <span className="rounded bg-slate-200 px-1.5 py-0.2 text-[10px] font-semibold text-slate-700">
                          General
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                )}

                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                {/* Grounded Source Citations Accordion (Section 11) */}
                {!isUser && hasCitations && (
                  <div className="mt-3.5 border-t border-slate-200 pt-2.5">
                    <button
                      onClick={() =>
                        setExpandedCitationMsgId(
                          isCitationsExpanded ? null : msg.id
                        )
                      }
                      className="flex items-center justify-between w-full text-[11px] font-semibold text-amber-900 hover:text-amber-950"
                    >
                      <span className="flex items-center gap-1">
                        <Bookmark className="h-3.5 w-3.5 text-amber-700" />
                        <span>
                          {msg.citations?.length} Source Citation
                          {msg.citations && msg.citations.length > 1 ? 's' : ''}
                        </span>
                      </span>
                      {isCitationsExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>

                    {isCitationsExpanded && (
                      <div className="mt-2 space-y-2">
                        {msg.citations?.map((c, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-700"
                          >
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-900 mb-1">
                              <span>{c.sourceTitle}</span>
                              <span className="rounded bg-amber-50 px-1.5 py-0.5 text-amber-800 font-mono">
                                {c.pageNumber
                                  ? `Page ${c.pageNumber}`
                                  : c.timestamp
                                  ? `Timestamp ${c.timestamp}`
                                  : c.sectionHeader || 'Excerpt'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 italic bg-slate-50 p-1.5 rounded">
                              "{c.excerpt}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <span className="mt-1 px-1 text-[10px] text-slate-400">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 italic bg-slate-50 border border-slate-200 rounded-xl p-3 max-w-sm">
            <span className="h-2 w-2 rounded-full bg-amber-600 animate-ping" />
            <span>Searching vector index & synthesizing citation-grounded response...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      {messages.length <= 2 && activeSources.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2">
          <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
            Suggested questions from selected source:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeSources[0].summary.importantQuestions.slice(0, 3).map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(undefined, q)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700 hover:border-amber-400 hover:bg-amber-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input Bar */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-slate-200 bg-white p-3.5 sm:px-6"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Ask a question about ${
              activeSources.length === 1
                ? `"${activeSources[0].title}"`
                : `${activeSources.length} selected sources`
            }...`}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="flex items-center justify-center rounded-xl bg-amber-700 px-4 py-2.5 text-white shadow-xs hover:bg-amber-800 disabled:opacity-50 transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
