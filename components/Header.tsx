import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-science-dark/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-bio-500 to-indigo-600 shadow-lg shadow-bio-900/20">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Bio-Vector<span className="text-bio-500">Orbit</span>
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-slate-400">Multimodal Discovery Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-slate-300 font-mono">NCBI Stream: Active</span>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs text-slate-300 font-mono">Qdrant: Connected</span>
            </div>
        </div>
      </div>
    </header>
  );
};