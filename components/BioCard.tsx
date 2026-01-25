import React, { useState } from 'react';
import { BioResult, MoleculeType, AIAnalysis } from '../types';
import { Button } from './Button';
import { analyzeResultWithGemini } from '../services/bioService';

interface BioCardProps {
  result: BioResult;
  onVisualize: (pdbId: string) => void;
  apiKey: string | undefined;
}

export const BioCard: React.FC<BioCardProps> = ({ result, onVisualize, apiKey }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const data = await analyzeResultWithGemini(result, apiKey);
    setAnalysis(data);
    setIsAnalyzing(false);
  };

  const getDeltaGColor = (val?: number) => {
    if (!val) return 'text-slate-500';
    if (val < -10) return 'text-green-400';
    return 'text-yellow-400';
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-700 bg-science-panel transition-all hover:border-bio-500/50 hover:shadow-lg hover:shadow-bio-900/10">
      {/* Header Info */}
      <div className="flex justify-between border-b border-slate-700/50 bg-slate-800/50 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            result.type === MoleculeType.PROTEIN ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
          }`}>
            {result.type}
          </span>
          <span className="font-mono text-xs text-slate-400">{result.source.db} ID: {result.source.id}</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Sim:</span>
            <span className="font-mono text-sm font-bold text-bio-400">{(result.score * 100).toFixed(1)}%</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-lg font-semibold leading-tight text-white group-hover:text-bio-400">
          <a href={result.source.url} target="_blank" rel="noreferrer" className="hover:underline">
            {result.source.title}
          </a>
        </h3>

        {/* Semantic Chunk */}
        <div className="relative mb-4 rounded-lg bg-slate-900/50 p-3">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-bio-600 rounded-l-lg"></div>
            <p className="text-sm leading-relaxed text-slate-300 font-serif italic pl-2">
                "{result.chunk.text}"
            </p>
        </div>

        {/* Metadata Grid */}
        <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
            <div>
                <span className="block text-xs text-slate-500">Source</span>
                <span className="text-slate-300 truncate block">{result.source.authors[0]} et al., {result.source.date.split('-')[0]}</span>
            </div>
            <div>
                <span className="block text-xs text-slate-500">Thermodynamics (ΔG)</span>
                <span className={`font-mono font-medium ${getDeltaGColor(result.deltaG)}`}>
                    {result.deltaG ? `${result.deltaG} kcal/mol` : 'N/A'}
                </span>
            </div>
        </div>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
            {result.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400">
                    #{tag}
                </span>
            ))}
        </div>

        {/* Gemini Analysis Section */}
        {analysis && (
            <div className="mb-4 rounded-lg border border-indigo-500/30 bg-indigo-900/10 p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6a1 1 0 0 0-1 1v4.59l-3.29-3.3a1 1 0 0 0-1.42 1.42l5 5a1 1 0 0 0 1.42 0l5-5a1 1 0 0 0-1.42-1.42L13 11.59V7a1 1 0 0 0-1-1z"/></svg>
                    <h4 className="text-sm font-bold text-indigo-300">AI Discovery Agent</h4>
                </div>
                <p className="text-xs text-slate-300 mb-3">{analysis.summary}</p>
                <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Suggested Next Steps:</span>
                    <ul className="list-disc pl-4 text-xs text-indigo-200 space-y-1">
                        {analysis.nextSteps.map((step, i) => (
                            <li key={i}>{step}</li>
                        ))}
                    </ul>
                </div>
            </div>
        )}

        <div className="mt-auto flex gap-3 pt-2">
          {result.pdbId && (
            <Button size="sm" onClick={() => result.pdbId && onVisualize(result.pdbId)} className="flex-1 gap-2">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
               </svg>
               View 3D
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="secondary" 
            className="flex-1"
            onClick={handleAnalyze}
            isLoading={isAnalyzing}
          >
            {analysis ? "Re-Analyze" : "AI Interpret"}
          </Button>
        </div>
      </div>
    </div>
  );
};