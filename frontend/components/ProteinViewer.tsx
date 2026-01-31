"use client";

import React, { useEffect, useState } from "react";
import { X, Activity, Box, Download } from 'lucide-react';

// Guard to prevent re-registration of the custom element
let isLibraryScriptInjected = false;

interface ProteinViewerProps {
    pdbId: string;
    onClose: () => void;
}

const ProteinViewer: React.FC<ProteinViewerProps> = ({ pdbId, onClose }) => {
    const [ready, setReady] = useState(false);
    const cleanId = pdbId.toUpperCase().trim();

    useEffect(() => {
        if (!isLibraryScriptInjected) {
            const link = document.createElement("link");
            link.id = "pdbe-css";
            link.rel = "stylesheet";
            link.href = "https://www.ebi.ac.uk/pdbe/pdb-component-library/css/pdbe-molstar-3.1.2.css";
            document.head.appendChild(link);

            const script = document.createElement("script");
            script.id = "pdbe-js";
            script.src = "https://www.ebi.ac.uk/pdbe/pdb-component-library/js/pdbe-molstar-component-3.1.2.js";
            script.async = true;
            document.body.appendChild(script);

            isLibraryScriptInjected = true;
        }

        const checkRegistry = setInterval(() => {
            // @ts-ignore
            if (window.customElements && customElements.get("pdbe-molstar")) {
                setReady(true);
                clearInterval(checkRegistry);
            }
        }, 100);

        return () => clearInterval(checkRegistry);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col font-sans overflow-hidden">

            {/* HIGH-END HUD OVERLAY */}
            <div className="absolute top-6 left-6 right-6 z-[200] flex justify-between items-start pointer-events-none">

                {/* Left: Metadata Tag */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-3xl pointer-events-auto shadow-2xl">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-bio-400 animate-pulse" />
                            <span className="text-[10px] text-bio-400 font-mono font-bold tracking-[0.3em] uppercase underline underline-offset-4">Visualizing Structure</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter mt-1">{cleanId}</h2>
                        <div className="flex gap-4 mt-2">
                            <div className="flex items-center gap-1.5">
                                <Activity size={10} className="text-slate-500" />
                                <span className="text-[9px] text-slate-500 font-mono uppercase">Render: Illustrative</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Download size={10} className="text-slate-500" />
                                <span className="text-[9px] text-slate-500 font-mono uppercase">Source: RCSB_CIF</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: The Close Button */}
                <button
                    onClick={onClose}
                    className="group pointer-events-auto flex items-center gap-4 bg-white hover:bg-bio-500 text-black hover:text-white px-6 py-4 rounded-2xl transition-all duration-500 shadow-2xl active:scale-95 border-none outline-none"
                >
                    <span className="text-xs font-bold tracking-widest uppercase">Terminate Session</span>
                    <div className="w-5 h-5 flex items-center justify-center border-l border-black/10 group-hover:border-white/20 ml-1 pl-4">
                        <X size={20} strokeWidth={3} />
                    </div>
                </button>
            </div>

            {/* VIEWPORT AREA */}
            <div className="flex-1 relative">
                {!ready && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-20">
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                            <div className="absolute inset-0 border-t-4 border-bio-500 rounded-full animate-spin"></div>
                            <Box size={32} className="absolute inset-0 m-auto text-bio-500 animate-pulse" />
                        </div>
                        <div className="mt-8 text-white/40 text-[10px] font-mono tracking-[0.8em] uppercase animate-pulse">Initializing Rendering Engine</div>
                    </div>
                )}

                <div className="w-full h-full">
                    {ready && (
                        // @ts-ignore
                        <pdbe-molstar
                            molecule-id={cleanId}
                            custom-data-url={`https://files.rcsb.org/download/${cleanId}.cif`}
                            custom-data-format="cif"
                            visual-style="cartoon"
                            lighting="illustrative"
                            high-precision="true"
                            hide-controls="true"
                            hide-expand-icon="true"
                            hide-settings-icon="true"
                            hide-selection-panel="true"
                            bg-color-r="2" bg-color-g="6" bg-color-b="23"
                        />
                    )}
                </div>
            </div>

            <style jsx global>{`
        pdbe-molstar { 
          width: 100%; 
          height: 100%; 
          display: block; 
        }
        .msp-layout-region-left, 
        .msp-layout-region-right, 
        .msp-layout-region-top,
        .msp-logo,
        .msp-controls-scene-watermark { 
          display: none !important; 
        }
        .msp-plugin-content { 
            background-color: transparent !important;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
        </div>
    );
};

export default ProteinViewer;
