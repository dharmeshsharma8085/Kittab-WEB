import React, { useState } from 'react';
import {
  Search,
  Filter,
  Layers,
  BookOpen,
  ArrowRight,
  Sparkles,
  Clock,
  FileText,
} from 'lucide-react';
import { semanticSearch } from '../services/api';
import { Source } from '../types';

interface SearchResultItem {
  chunkId: string;
  sourceId: string;
  sourceTitle: string;
  pageNumber?: number;
  timestamp?: string;
  sectionHeader?: string;
  content: string;
  score: number;
}

interface SemanticSearchProps {
  sources: Source[];
  onSelectSource: (source: Source) => void;
}

export const SemanticSearch: React.FC<SemanticSearchProps> = ({
  sources,
  onSelectSource,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const data = await semanticSearch(query.trim(), filterType);
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePresetQuery = (q: string) => {
    setQuery(q);
    setIsSearching(true);
    setHasSearched(true);
    semanticSearch(q, filterType)
      .then((data) => setResults(data))
      .catch(console.error)
      .finally(() => setIsSearching(false));
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Search className="h-6 w-6 text-amber-700" />
          <span>Global Semantic Vector Search</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Retrieve exact passages, paragraphs, and timestamps across all indexed knowledge sources.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search concepts across your library (e.g. 'deadlock conditions', '3-way handshake', 'relational Boyce-Codd')..."
            className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-12 pr-28 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-xs"
          />
          <button
            type="submit"
            disabled={!query.trim() || isSearching}
            className="absolute right-2 top-2 rounded-xl bg-amber-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-800 disabled:opacity-50 transition-colors"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Filters and Suggestions */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Filter by source type:</span>
            {['all', 'pdf', 'notes', 'audio', 'video', 'web', 'text'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className={`rounded-lg px-2.5 py-1 uppercase font-semibold text-[10px] transition-all ${
                  filterType === t
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Sparkles className="h-3 w-3 text-amber-600" />
            <span>Try:</span>
            <button
              type="button"
              onClick={() => handlePresetQuery('What are the four conditions for deadlock?')}
              className="text-amber-800 hover:underline"
            >
              Deadlock conditions
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => handlePresetQuery('Boyce-Codd Normal Form')}
              className="text-amber-800 hover:underline"
            >
              BCNF
            </button>
          </div>
        </div>
      </form>

      {/* Results List */}
      <div className="space-y-4">
        {hasSearched && (
          <div className="text-xs font-semibold text-slate-500">
            Found {results.length} relevant passages for "{query}":
          </div>
        )}

        {results.map((res) => {
          const matchingSource = sources.find((s) => s.id === res.sourceId);
          return (
            <div
              key={res.chunkId}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2.5 hover:border-amber-300 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{res.sourceTitle}</span>
                  <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 font-mono">
                    {res.pageNumber
                      ? `Page ${res.pageNumber}`
                      : res.timestamp
                      ? `Timestamp ${res.timestamp}`
                      : res.sectionHeader || 'Chunk'}
                  </span>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                  {res.score}% relevance
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                {res.content}
              </p>

              {matchingSource && (
                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={() => onSelectSource(matchingSource)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-900 hover:underline"
                  >
                    <span>View in source context</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {hasSearched && results.length === 0 && !isSearching && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
            <Search className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <h3 className="text-xs font-bold text-slate-800">No matching chunks found</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Try broader search terms or clear the source type filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
