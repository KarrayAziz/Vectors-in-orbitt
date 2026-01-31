import React, { useEffect, useRef } from 'react';

interface MoleculeViewerProps {
  pdbId: string;
  width?: string;
  height?: string;
}

declare global {
  interface Window {
    iCn3DUI: any;
  }
}

const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ pdbId, width = "100%", height = "400px" }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<any>(null);

  useEffect(() => {
    if (!viewerRef.current || !window.iCn3DUI) return;

    const cfg = {
      divid: viewerRef.current.id,
      width: width,
      height: height,
      resize: true,
      rotate: 'right',
    };

    // Initialize iCn3D
    // We need to clear previous instance if any, but iCn3D might not support robust re-initialization in the same div easily without cleanup.
    // For now, we assume a fresh mount or simple update.
    
    // Create a unique ID for the div to avoid conflicts if multiple viewers exist
    const uniqueId = `icn3d_${pdbId}_${Math.random().toString(36).substr(2, 9)}`;
    viewerRef.current.id = uniqueId;
    cfg.divid = uniqueId;

    try {
        const icn3dui = new window.iCn3DUI(cfg);
        uiRef.current = icn3dui;
        
        // Load structure
        // mmid: PDB ID
        icn3dui.show3DStructure({ mmid: pdbId });
    } catch (e) {
        console.error("Failed to initialize iCn3D:", e);
    }
    
    return () => {
        // Cleanup if possible
        // iCn3D doesn't have a clear 'destroy' method documented efficiently for React.
        // We might just empty the div.
        if (viewerRef.current) {
            viewerRef.current.innerHTML = "";
        }
    };
  }, [pdbId, width, height]);

  return (
    <div className="relative border border-slate-700 rounded-lg overflow-hidden bg-white">
      <div 
        ref={viewerRef} 
        style={{ width: '100%', height: '100%', minHeight: height }}
        className="icn3d-container"
      ></div>
      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded pointer-events-none">
        PDB: {pdbId}
      </div>
    </div>
  );
};

export default MoleculeViewer;
