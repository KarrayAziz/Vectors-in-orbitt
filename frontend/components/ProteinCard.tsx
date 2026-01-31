import React from 'react';
import { Box, ExternalLink, Activity, Info } from 'lucide-react';

interface ProteinCardProps {
    id: string;
    score: number;
    payload: {
        name: string;
        description: string;
        stoichiometry: string;
    };
    onViewStructure: (pdbId: string) => void;
}

const ProteinCard: React.FC<ProteinCardProps> = ({ id, score, payload, onViewStructure }) => {
    return (
        <div className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-[2rem] p-6 hover:bg-slate-900/60 transition-all duration-500 hover:border-bio-500/50 hover:shadow-2xl hover:shadow-bio-500/10 flex flex-col h-full border-t border-l border-white/5">
            {/* HUD Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-bio-500 font-bold tracking-widest uppercase flex items-center gap-1.5">
                        <Activity size={12} className="animate-pulse" />
                        {(score * 100).toFixed(1)}% Semantic Match
                    </span>
                    <span className="text-white/40 text-[9px] font-mono uppercase tracking-widest">PDB_ID: {id}</span>
                </div>
                <div className="px-2 py-1 bg-bio-950/50 border border-bio-500/20 rounded text-[10px] text-bio-400 font-mono font-bold">
                    HUMAN_PROTEIN
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-bio-400 transition-colors duration-300 leading-tight mb-3">
                    {payload.name}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded border border-white/5">
                        <Box size={12} className="text-bio-500" />
                        <span className="text-[10px] text-slate-400 font-mono">STX: {payload.stoichiometry}</span>
                    </div>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed line-clamp-4 mb-6 italic">
                    "{payload.description}"
                </p>
            </div>

            {/* Action Footer */}
            <div className="mt-auto pt-6 flex gap-3 border-t border-white/5">
                <button
                    onClick={() => onViewStructure(id)}
                    className="flex-1 bg-bio-600 hover:bg-bio-500 text-white py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 shadow-lg shadow-bio-600/20 flex items-center justify-center gap-2"
                >
                    <Box size={14} />
                    Initialize 3D View
                </button>
                <a
                    href={`https://www.rcsb.org/structure/${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300 border border-white/5"
                    title="Open RCSB PDB"
                >
                    <ExternalLink size={18} />
                </a>
            </div>
        </div>
    );
};

export default ProteinCard;
