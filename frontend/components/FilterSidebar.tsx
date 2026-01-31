import React from 'react';
import { SearchParams } from '../types';

interface FilterSidebarProps {
  params: SearchParams;
  setParams: React.Dispatch<React.SetStateAction<SearchParams>>;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ params, setParams }) => {
  
  const handleDiversityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(prev => ({ ...prev, diversity: parseFloat(e.target.value) }));
  };

  const handleDeltaGChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(prev => ({ ...prev, minDeltaG: parseFloat(e.target.value) }));
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-8 rounded-2xl bg-slate-900/50 p-6 ring-1 ring-white/5 h-fit lg:sticky lg:top-24">
      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
          Discovery Controls
        </h3>
        
        {/* MMR Diversity Slider */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-300">Similarity</span>
            <span className="text-slate-300">Exploration</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={params.diversity}
            onChange={handleDiversityChange}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-bio-500"
          />
          <div className="mt-2 flex justify-between">
            <span className="text-xs text-slate-500">MMR Lambda: {params.diversity}</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-500 leading-tight">
            Lower values prioritize exact matches. Higher values introduce biological diversity (analogs).
          </p>
        </div>

        {/* Delta G Filter */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-300">Max ΔG (kcal/mol)</span>
            <span className="text-bio-400 font-mono">{params.minDeltaG}</span>
          </div>
          <input
            type="range"
            min="-20"
            max="0"
            step="0.5"
            value={params.minDeltaG}
            onChange={handleDeltaGChange}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-bio-500"
          />
          <p className="mt-2 text-[10px] text-slate-500 leading-tight">
            Filter for thermodynamically stable complexes (more negative is better).
          </p>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-10 h-5 rounded-full relative transition-colors ${params.useSemantic ? 'bg-bio-600' : 'bg-slate-700'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${params.useSemantic ? 'left-6' : 'left-1'}`}></div>
                </div>
                <span className="text-sm text-slate-300 group-hover:text-white">Semantic Chunking</span>
            </label>
        </div>
      </div>

      <div className="rounded-xl bg-slate-800/50 p-4 border border-slate-700">
        <h4 className="text-xs font-bold text-white mb-2">System Status</h4>
        <div className="space-y-2">
            <div className="flex justify-between text-xs">
                <span className="text-slate-500">Qdrant Collection</span>
                <span className="text-green-400">bio_orbit</span>
            </div>
            <div className="flex justify-between text-xs">
                <span className="text-slate-500">Vector Count</span>
                <span className="text-slate-300">1.4M</span>
            </div>
            <div className="flex justify-between text-xs">
                <span className="text-slate-500">Model</span>
                <span className="text-slate-300">all-MiniLM-L6-v2</span>
            </div>
        </div>
      </div>
    </aside>
  );
};