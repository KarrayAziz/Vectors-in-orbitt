import React, { useState } from 'react';
import { Button } from './Button';
import { SAMPLE_QUERIES } from '../constants';

interface SearchHeroProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchHero: React.FC<SearchHeroProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800 to-science-panel p-8 shadow-2xl ring-1 ring-white/10">
      <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-bio-500/10 blur-3xl"></div>
      
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-2xl font-semibold text-white md:text-3xl">
          Search by <span className="text-bio-400">Biological Meaning</span>, not just keywords.
        </h2>
        <p className="mb-8 text-slate-400">
          Leveraging Biopython for real-time fetching, Chonkie for semantic chunking, and Qdrant for vector similarity.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 'p53 DNA binding domain structure'"
              className="w-full rounded-xl border border-slate-600 bg-slate-900/50 px-5 py-3 text-lg text-white placeholder-slate-500 shadow-inner focus:border-bio-500 focus:outline-none focus:ring-1 focus:ring-bio-500"
            />
            <div className="absolute right-3 top-3.5 flex gap-1">
                 <span className="hidden sm:inline-block rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-300 font-mono">Semantic</span>
            </div>
          </div>
          <Button type="submit" size="lg" isLoading={isLoading} className="rounded-xl">
            Orbit Search
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <span className="text-xs text-slate-500">Try:</span>
          {SAMPLE_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => {
                setQuery(q);
                onSearch(q);
              }}
              className="rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-bio-500 hover:text-bio-400 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};