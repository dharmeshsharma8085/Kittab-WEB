import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  PlusCircle,
  FileText,
  Image as ImageIcon,
  Headphones,
  Video,
  Globe,
  Trash2,
  Clock,
  Layers,
  MessageSquare,
  Brain,
  FileCheck2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Source, SourceType, ActiveTab } from '../types';

interface SourceLibraryProps {
  sources: Source[];
  onSelectSource: (source: Source) => void;
  onDeleteSource: (sourceId: string) => void;
  onOpenCreate: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  onStartChatWithSource: (source: Source) => void;
}

export const SourceLibrary: React.FC<SourceLibraryProps> = ({
  sources,
  onSelectSource,
  onDeleteSource,
  onOpenCreate,
  setActiveTab,
  onStartChatWithSource,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceToDelete, setSourceToDelete] = useState<Source | null>(null);

  const filteredSources = sources.filter((s) => {
    const matchesType = filterType === 'all' || s.type === filterType;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.tags && s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: SourceType) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-amber-700" />;
      case 'notes':
      case 'image':
        return <ImageIcon className="h-4 w-4 text-indigo-600" />;
      case 'audio':
        return <Headphones className="h-4 w-4 text-emerald-600" />;
      case 'video':
      case 'youtube':
        return <Video className="h-4 w-4 text-rose-600" />;
      case 'web':
        return <Globe className="h-4 w-4 text-sky-600" />;
      default:
        return <BookOpen className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>My Knowledge Sources</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              {sources.length}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Indexed multimodal study materials available for source-grounded RAG & learning.
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-800 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New Source</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, concepts, or keywords..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        {/* Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Sources' },
            { id: 'pdf', label: 'PDFs' },
            { id: 'notes', label: 'Notes / OCR' },
            { id: 'audio', label: 'Audio' },
            { id: 'video', label: 'Video' },
            { id: 'youtube', label: 'YouTube' },
            { id: 'web', label: 'Websites' },
            { id: 'text', label: 'Notes' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                filterType === item.id
                  ? 'bg-amber-700 text-white font-semibold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sources Grid */}
      {filteredSources.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSources.map((source) => (
            <div
              key={source.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-amber-300 hover:shadow-md"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 uppercase">
                    {getTypeIcon(source.type)}
                    <span>{source.type}</span>
                  </div>

                  <button
                    onClick={() => setSourceToDelete(source)}
                    className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Delete source"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Title & Overview */}
                <h3
                  onClick={() => onSelectSource(source)}
                  className="cursor-pointer text-base font-bold text-slate-900 hover:text-amber-700 transition-colors line-clamp-2 leading-snug"
                >
                  {source.title}
                </h3>

                <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {source.summary.overview}
                </p>

                {/* Key Concept tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {source.keyConcepts.slice(0, 3).map((concept, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-amber-50/80 px-2 py-0.5 text-[10px] font-medium text-amber-900 border border-amber-200/50"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metadata & Actions */}
              <div className="mt-4 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    ~{source.estimatedReadingTime} min read
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="h-3 w-3" />
                    {source.chunksCount} chunks
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(source.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    onClick={() => onSelectSource(source)}
                    className="rounded-lg bg-amber-50 py-1.5 font-semibold text-amber-900 hover:bg-amber-100 transition-colors text-center"
                  >
                    Open Summary
                  </button>
                  <button
                    onClick={() => onStartChatWithSource(source)}
                    className="flex items-center justify-center gap-1 rounded-lg bg-slate-900 py-1.5 font-semibold text-white hover:bg-slate-800 transition-colors"
                  >
                    <MessageSquare className="h-3 w-3" />
                    <span>Chat RAG</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-900">No sources found</h3>
          <p className="mx-auto max-w-sm text-xs text-slate-500 mt-1 mb-4">
            {searchQuery
              ? `No sources matched "${searchQuery}". Try a different search term or filter.`
              : 'You have not uploaded any study materials yet. Create your first source to unlock RAG chat, flashcards, and tests.'}
          </p>
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-700 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-800"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create First Knowledge Source</span>
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {sourceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Delete Knowledge Source?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong>"{sourceToDelete.title}"</strong>?
              This will permanently delete the source, its structured summaries, vector index
              chunks, flashcards, and practice tests.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSourceToDelete(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteSource(sourceToDelete.id);
                  setSourceToDelete(null);
                }}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
