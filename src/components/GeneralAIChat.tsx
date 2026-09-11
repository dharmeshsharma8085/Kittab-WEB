import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Brain,
  Lightbulb,
  Gamepad2,
  Scale,
  Compass,
  MessageSquare,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { GeneralChatMode, ChatMessage } from '../types';
import { sendGeneralChat } from '../services/api';

interface Conversation {
  id: string;
  title: string;
  mode: GeneralChatMode;
  messages: ChatMessage[];
  createdAt: string;
}

export const GeneralAIChat: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-default',
      title: 'Study & General Chat',
      mode: 'study_assistant',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: 'welcome-gen',
          role: 'assistant',
          content:
            "Hey there! I'm your AI Study Companion & General Chatbot. Ask me any question, test your knowledge with interactive challenges, or brainstorm ideas freely!",
          timestamp: new Date().toISOString(),
        },
      ],
    },
  ]);

  const [activeConvId, setActiveConvId] = useState<string>('conv-default');
  const [activeMode, setActiveMode] = useState<GeneralChatMode>('study_assistant');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentConv =
    conversations.find((c) => c.id === activeConvId) || conversations[0];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConv?.messages, isLoading]);

  const createNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: 'New Conversation',
      mode: activeMode,
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: `New ${activeMode.replace('_', ' ')} session started. What would you like to explore today?`,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(newId);
  };

  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (conversations.length === 1) return;
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      setActiveConvId(remaining[0].id);
    }
  };

  const handleSendMessage = async (
    e?: React.FormEvent,
    funAction?: 'challenge' | 'quiz' | 'random_fact' | 'debate' | 'brainstorm',
    topic?: string
  ) => {
    if (e) e.preventDefault();
    const textToSend = inputMessage.trim();
    if (!textToSend && !funAction) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content:
        funAction === 'challenge'
          ? '🧠 Give me a mind challenge or logic puzzle!'
          : funAction === 'quiz'
          ? `🎮 Quiz me on ${topic || 'Computer Science & Science'}!`
          : funAction === 'random_fact'
          ? '💡 Tell me a fascinating scientific or historic fact!'
          : funAction === 'debate'
          ? `🔥 Debate mode: Explore multiple perspectives on "${textToSend || topic || 'AI Impact'}"`
          : funAction === 'brainstorm'
          ? `🧩 Brainstorm ideas for: "${textToSend || topic || 'learning project'}"`
          : textToSend,
      timestamp: new Date().toISOString(),
    };

    // Update conversation title if first user message
    const isFirstUserMsg = currentConv.messages.filter((m) => m.role === 'user').length === 0;

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === currentConv.id) {
          return {
            ...c,
            title: isFirstUserMsg ? userMessage.content.slice(0, 30) + '...' : c.title,
            messages: [...c.messages, userMessage],
          };
        }
        return c;
      })
    );

    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendGeneralChat({
        message: textToSend,
        mode: activeMode,
        funAction,
        topic,
        history: currentConv.messages.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === currentConv.id) {
            return {
              ...c,
              messages: [...c.messages, assistantMsg],
            };
          }
          return c;
        })
      );
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: 'assistant',
        content: 'Error: ' + (err.message || 'Unable to connect to AI server'),
        timestamp: new Date().toISOString(),
      };
      setConversations((prev) =>
        prev.map((c) => (c.id === currentConv.id ? { ...c, messages: [...c.messages, errorMsg] } : c))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-8.5rem)] rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Left Chat Sessions List (Collapsible on mobile) */}
      <div className="hidden sm:flex w-60 flex-col border-r border-slate-200 bg-slate-50/50">
        <div className="p-3 border-b border-slate-200">
          <button
            onClick={createNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Conversations
          </div>
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveConvId(c.id)}
              className={`group flex items-center justify-between rounded-xl px-2.5 py-2 text-xs cursor-pointer transition-all ${
                activeConvId === c.id
                  ? 'bg-amber-100/80 text-amber-950 font-bold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <MessageSquare className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{c.title}</span>
              </div>

              {conversations.length > 1 && (
                <button
                  onClick={(e) => deleteChat(c.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header: Mode Switcher & Fun Feature Triggers */}
        <div className="border-b border-slate-200 bg-slate-50/60 p-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Mode selection pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 mr-1 hidden md:inline">
                General AI
              </span>
              {[
                { id: 'study_assistant' as GeneralChatMode, label: 'Study Buddy' },
                { id: 'general' as GeneralChatMode, label: 'General' },
                { id: 'explain_anything' as GeneralChatMode, label: 'Explain Simple' },
                { id: 'brainstorm' as GeneralChatMode, label: 'Brainstorm' },
                { id: 'creative' as GeneralChatMode, label: 'Creative' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMode(m.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    activeMode === m.id
                      ? 'bg-amber-700 text-white font-semibold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Quick Action Pills: Challenge, Quiz, Random Fact */}
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => handleSendMessage(undefined, 'challenge')}
                className="flex items-center gap-1 rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1 font-medium text-purple-900 hover:bg-purple-100 shadow-2xs"
                title="Riddles and logic challenges"
              >
                <Brain className="h-3.5 w-3.5 text-purple-700" />
                <span className="hidden sm:inline">Challenge Me</span>
              </button>

              <button
                onClick={() => handleSendMessage(undefined, 'quiz', 'Computer Science & AI')}
                className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 font-medium text-blue-900 hover:bg-blue-100 shadow-2xs"
                title="Interactive Mini-Quiz"
              >
                <Gamepad2 className="h-3.5 w-3.5 text-blue-700" />
                <span className="hidden sm:inline">Quiz Me</span>
              </button>

              <button
                onClick={() => handleSendMessage(undefined, 'random_fact')}
                className="flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 font-medium text-amber-900 hover:bg-amber-100 shadow-2xs"
                title="Random interesting fact"
              >
                <Lightbulb className="h-3.5 w-3.5 text-amber-700" />
                <span className="hidden sm:inline">Random Fact</span>
              </button>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {currentConv.messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-3xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-br-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-900 rounded-bl-xs'
                  }`}
                >
                  {!isUser && (
                    <div className="mb-2 flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                        <span className="font-bold text-xs text-amber-900">
                          KITTAB Companion
                        </span>
                        <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-800">
                          General AI
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {copiedId === msg.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap">{msg.content}</div>
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
            <div className="flex items-center gap-2 text-xs text-slate-500 italic bg-slate-50 border border-slate-200 rounded-xl p-3 max-w-xs">
              <span className="h-2 w-2 rounded-full bg-slate-700 animate-ping" />
              <span>Thinking...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => handleSendMessage(e)}
          className="border-t border-slate-200 bg-white p-3.5 sm:px-6"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything, brainstorm, or explore concepts..."
              className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-white shadow-xs hover:bg-slate-800 disabled:opacity-50 transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
