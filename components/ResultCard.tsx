import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Box, Activity, Zap } from 'lucide-react';

interface ResultPayload {
    title: string;
    source: string;
    text?: string;
    delta_g?: number;
    type?: string;
}

interface ResultProps {
    id: string;
    score: number;
    payload: ResultPayload;
    vector_type?: string;
    onViewStructure: (id: string) => void;
}

const ResultCard: React.FC<ResultProps> = ({ id, score, payload, vector_type, onViewStructure }) => {
    const isProtein = vector_type === 'protein' || payload.type === 'protein' || (payload.source && payload.source.includes('PDB'));
    const displayId = id.split('_')[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-bio-500 transition-colors group"
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono uppercase ${vector_type === 'protein' ? 'bg-purple-900 text-purple-200' :
                            vector_type === 'molecule' ? 'bg-emerald-900 text-emerald-200' :
                                'bg-blue-900 text-blue-200'
                        }`}>
                        {vector_type || 'Text'}
                    </span>
                    <span className="text-slate-400 text-xs font-mono">
                        Sim: {score.toFixed(3)}
                    </span>
                </div>
                {payload.delta_g !== undefined && (
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-mono" title="Enthalpie Libre (Delta G)">
                        <Zap size={12} />
                        <span>ΔG: {payload.delta_g.toFixed(1)}</span>
                    </div>
                )}
            </div>

            <h3 className="text-lg font-semibold text-slate-100 leading-tight mb-2 group-hover:text-bio-400">
                {payload.title || "Untitled Record"}
            </h3>

            <p className="text-slate-400 text-sm line-clamp-3 mb-4 font-light">
                {payload.text}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Activity size={14} />
                    <span>{payload.source || "Unknown Source"}</span>
                </div>

                <div className="flex gap-2">
                    {isProtein && (
                        <button
                            onClick={() => onViewStructure(displayId)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-bio-600 text-white rounded-md text-sm transition-colors"
                        >
                            <Box size={14} />
                            View 3D
                        </button>
                    )}
                    <a
                        href={`https://pubmed.ncbi.nlm.nih.gov/${displayId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-700 text-slate-300 rounded-md text-sm transition-colors"
                    >
                        <ExternalLink size={14} />
                        Evidence
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

export default ResultCard;
