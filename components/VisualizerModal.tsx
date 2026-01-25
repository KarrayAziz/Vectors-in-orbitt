import React from 'react';

interface VisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdbId: string;
}

export const VisualizerModal: React.FC<VisualizerModalProps> = ({ isOpen, onClose, pdbId }) => {
  if (!isOpen) return null;

  // ar=1 enables Augmented Reality features in iCn3D (mobile compatible)
  const src = `https://www.ncbi.nlm.nih.gov/Structure/icn3d/full.html?pdbid=${pdbId}&ar=1&simple=1&showcommand=0`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative h-[85vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-slate-900 shadow-2xl ring-1 ring-white/10 flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-3">
          <h3 className="text-lg font-medium text-white flex items-center gap-2">
             <span className="bg-bio-600 text-xs px-2 py-0.5 rounded">3D</span>
             Structure Viewer: <span className="font-mono text-bio-400">{pdbId}</span>
          </h3>
          <div className="flex gap-2">
             <a href={src} target="_blank" rel="noreferrer" className="text-xs text-bio-400 hover:underline flex items-center">
                Open Fullscreen
             </a>
             <button
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </div>
        </div>
        
        <div className="flex-1 bg-black relative">
            <iframe 
                src={src} 
                className="w-full h-full border-none"
                title={`iCn3D Structure ${pdbId}`}
                allow="camera; gyroscope; accelerometer; magnetometer; xr-spatial-tracking;"
            />
            <div className="absolute bottom-4 left-4 bg-black/60 p-2 rounded text-xs text-slate-300 pointer-events-none">
                Mouse: Rotate | Shift+Mouse: Zoom | AR Mode Available on Mobile
            </div>
        </div>
      </div>
    </div>
  );
};