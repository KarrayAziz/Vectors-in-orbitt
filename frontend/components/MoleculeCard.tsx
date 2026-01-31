import React from 'react';
import { Share2, ExternalLink, Activity, FlaskConical } from 'lucide-react';

interface MoleculeCardProps {
    smiles: string;
    score: number;
    svg?: string;
}

const MoleculeCard: React.FC<MoleculeCardProps> = ({ smiles, score, svg }) => {
    return (
        <div className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-[2rem] p-6 hover:bg-slate-900/60 transition-all duration-500 hover:border-bio-500/50 hover:shadow-2xl hover:shadow-bio-500/10 flex flex-col h-full border-t border-l border-white/5">
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-bio-500 font-bold tracking-widest uppercase flex items-center gap-1.5">
                        <Activity size={12} className="animate-pulse" />
                        {(score * 100).toFixed(1)}% Latent Match
                    </span>
                    <span className="text-white/40 text-[9px] font-mono uppercase tracking-widest">TYPE: SMILES_LATENT</span>
                </div>
                <div className="px-2 py-1 bg-bio-950/50 border border-bio-500/20 rounded text-[10px] text-bio-400 font-mono font-bold">
                    MOLECULE
                </div>
            </div>

            <div className="flex-1">
                {/* Visual Structure */}
                {svg ? (
                    <div
                        className="w-full h-40 flex items-center justify-center bg-white/5 rounded-2xl mb-4 border border-white/5 p-4 overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: svg }}
                    />
                ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-white/5 rounded-2xl mb-4 border border-white/5 p-4">
                        <FlaskConical size={48} className="text-white/10" />
                    </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-bio-500/10 rounded-lg flex items-center justify-center border border-bio-500/20 group-hover:scale-110 transition-transform">
                        <FlaskConical size={16} className="text-bio-500" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight break-all line-clamp-2">
                        {smiles}
                    </h3>
                </div>

                <p className="text-slate-500 text-[10px] font-mono leading-relaxed mb-6 uppercase tracking-tighter">
                    Chemical representation generated from VAE latent space discovery.
                </p>
            </div>

            <div className="mt-auto pt-6 flex gap-3 border-t border-white/5">
                <a
                    href={`https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(smiles)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-slate-800 hover:bg-bio-600 hover:shadow-lg hover:shadow-bio-600/20 text-white py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                >
                    <ExternalLink size={14} />
                    View on PubChem
                </a>
            </div>
        </div>
    );
};

export default MoleculeCard;
