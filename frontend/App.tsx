import React, { useState } from 'react';
import axios from 'axios';
import { Search, Loader2, Database, Layers, Atom, X, ArrowRight } from 'lucide-react';
import ResultCard from './components/ResultCard';
import ProteinCard from './components/ProteinCard';
import MoleculeCard from './components/MoleculeCard';
import ProteinViewer from './components/ProteinViewer';
import { DISPLAY_LIMIT } from './constants';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'; // Adjust as needed

function App() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'text' | 'protein' | 'molecule'>('text');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [viewingPdbId, setViewingPdbId] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResults([]);
    setOffset(0);
    try {
      const res = await axios.get(`${API_URL}/search`, {
        params: {
          query,
          limit: DISPLAY_LIMIT,
          offset: 0,
          search_type: searchType
        }
      });
      // Backend returns directly the list of records
      setResults(res.data);
      setHasMore(res.data.length === DISPLAY_LIMIT);
    } catch (err) {
      console.error("Search failed:", err);
      alert("Search failed. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDatabase = async () => {
    setIngesting(true);
    try {
      await axios.post(`${API_URL}/update-db`);
      alert("Database update successfully triggered! Check backend console for progress.");
    } catch (err) {
      console.error("Ingestion failed:", err);
      alert("Database update failed. Ensure backend is running.");
    } finally {
      setIngesting(false);
    }
  };

  const handleLoadMore = async () => {
    if (loading) return;

    const nextOffset = offset + DISPLAY_LIMIT;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/search`, {
        params: {
          query,
          limit: DISPLAY_LIMIT,
          offset: nextOffset,
          search_type: searchType
        }
      });

      setResults(prev => [...prev, ...res.data]);
      setOffset(nextOffset);
      setHasMore(res.data.length === DISPLAY_LIMIT);
    } catch (err) {
      console.error("Load more failed:", err);
      alert("Failed to load more results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-science-dark text-slate-200 font-sans selection:bg-bio-500 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-bio-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-bio-600 rounded-lg flex items-center justify-center shadow-lg shadow-bio-500/30">
              <Atom className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Bio-Vector <span className="text-bio-500">Orbit</span></h1>
              <p className="text-xs text-slate-400">Discovery Engine v2.0</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleUpdateDatabase}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:border-bio-500 transition-all shadow-lg active:scale-95 disabled:opacity-50"
              disabled={ingesting}
              title="Fetch latest articles from PubMed"
            >
              {ingesting ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />}
              Update Database
            </button>
          </div>
        </header>

        {/* Search Section */}
        <section className="mb-12 max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative group z-10">
            <div className="absolute inset-0 bg-bio-500/20 blur-xl rounded-full group-hover:bg-bio-500/30 transition-all" />
            <div className="relative flex items-center bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-full p-2 pl-6 shadow-2xl">
              <Search className="text-slate-400 mr-3" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything (e.g., 'What are the latest treatments for Alzheimer?') ..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 h-10"
              />
              <div className="flex items-center gap-1 pr-2 border-l border-slate-700 ml-2 pl-2">
                {(['text', 'protein', 'molecule'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSearchType(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${searchType === t
                      ? 'bg-bio-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                      }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="ml-2 w-10 h-10 bg-white text-bio-600 rounded-full flex items-center justify-center hover:bg-bio-50 transition-colors shadow-lg disabled:opacity-50"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Layers size={20} />}
              </button>
            </div>
          </form>
        </section>

        {/* Results Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-bio-500 rounded-full" />
              Discovery Results
            </h2>
            <span className="text-sm text-slate-500">{results.length} vectors found</span>
          </div>


          {loading && (
            <div className="text-center py-20">
              <Loader2 className="mx-auto text-bio-500 mb-4 animate-spin" size={48} />
              <p className="text-slate-400 font-medium">Analyzing database for semantic matches...</p>
              <p className="text-slate-500 text-sm mt-2">Connecting to Qdrant vector store</p>
            </div>
          )}

          {results.length === 0 && !loading && (
            <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl">
              <Atom className="mx-auto text-slate-700 mb-4" size={48} />
              <p className="text-slate-500">No results yet. Try searching for "Insulin" or "BRCA1".</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((res) => (
              res.type === 'protein' ? (
                <ProteinCard
                  key={res.pdb_id}
                  id={res.pdb_id}
                  score={res.score}
                  payload={{
                    name: res.name,
                    description: res.description,
                    stoichiometry: res.stoichiometry
                  }}
                  onViewStructure={setViewingPdbId}
                />
              ) : res.type === 'molecule' ? (
                <MoleculeCard
                  key={res.smiles}
                  smiles={res.smiles}
                  score={res.score}
                  svg={res.svg}
                />
              ) : (
                <ResultCard
                  key={res.pmid}
                  id={res.pmid}
                  score={res.score}
                  payload={{
                    title: res.title,
                    source: "PubMed",
                    text: res.abstract
                  }}
                  onViewStructure={setViewingPdbId}
                />
              )
            ))}
          </div>

          {results.length > 0 && hasMore && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 border border-slate-700 rounded-full text-slate-300 hover:text-white hover:border-bio-500 hover:bg-slate-700/50 transition-all shadow-xl group disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <span className="font-semibold">Display next {DISPLAY_LIMIT} results</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {/* Premium 3D Viewer */}
        {viewingPdbId && (
          <ProteinViewer
            pdbId={viewingPdbId}
            onClose={() => setViewingPdbId(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;