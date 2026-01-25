import React, { useState } from 'react';
import { Header } from './components/Header';
import { SearchHero } from './components/SearchHero';
import { FilterSidebar } from './components/FilterSidebar';
import { BioCard } from './components/BioCard';
import { VisualizerModal } from './components/VisualizerModal';
import { searchBioVector } from './services/bioService';
import { BioResult, SearchParams } from './types';

const App: React.FC = () => {
  const [results, setResults] = useState<BioResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activePdb, setActivePdb] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  
  // Try to load API Key from env if available (for demo convenience), else empty
  // In a real app, do not rely on process.env in client-side code unless explicitly injected at build
  // Here we just initialize empty and let user assume it's set or we could add an input field (omitted per strict prompt constraints on no API key input UI)
  // However, I will check process.env.API_KEY as per standard Gemini instructions
  React.useEffect(() => {
     if (process.env.API_KEY) {
         setApiKey(process.env.API_KEY);
     }
  }, []);

  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    diversity: 0.5,
    minDeltaG: -5.0,
    useSemantic: true,
    limit: 20
  });

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchParams(prev => ({ ...prev, query }));
    
    try {
      // Pass the current params state + the new query
      const data = await searchBioVector({ ...searchParams, query });
      setResults(data);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-science-dark text-slate-200 font-sans">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-12">
           <SearchHero onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <FilterSidebar params={searchParams} setParams={setSearchParams} />
          
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                    {results.length > 0 ? `Found ${results.length} Biological Entities` : 'Recent Discoveries'}
                </h3>
                {results.length > 0 && (
                    <span className="text-xs text-slate-500">Ranked by Vector Similarity</span>
                )}
            </div>

            {results.length === 0 && !isLoading ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-12 text-center">
                    <p className="text-slate-500">Enter a query above to explore the Vector Orbit.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                    {results.map((result) => (
                        <BioCard 
                            key={result.id} 
                            result={result} 
                            onVisualize={(pdbId) => setActivePdb(pdbId)} 
                            apiKey={apiKey}
                        />
                    ))}
                </div>
            )}
          </div>
        </div>
      </main>

      <VisualizerModal 
        isOpen={!!activePdb} 
        onClose={() => setActivePdb(null)} 
        pdbId={activePdb || ''} 
      />
    </div>
  );
};

export default App;