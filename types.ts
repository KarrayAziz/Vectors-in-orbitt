export enum MoleculeType {
  PROTEIN = 'PROTEIN',
  DNA = 'DNA',
  SMALL_MOLECULE = 'SMALL_MOLECULE'
}

export interface BioSource {
  id: string; // e.g., PubMed ID or PDB ID
  title: string;
  url: string;
  authors: string[];
  date: string;
  db: 'PubMed' | 'Protein' | 'Structure';
}

export interface Chunk {
  id: string;
  text: string; // The semantic chunk content
  vector_id?: string;
  start_char?: number;
  end_char?: number;
}

export interface BioResult {
  id: string;
  score: number; // Similarity score from Qdrant
  source: BioSource;
  chunk: Chunk;
  pdbId?: string; // For 3D visualization
  deltaG?: number; // Gibbs Free Energy (kcal/mol)
  molecularWeight?: number; // Da
  tags: string[];
  type: MoleculeType;
}

export interface SearchParams {
  query: string;
  diversity: number; // MMR Lambda (0.0 to 1.0)
  minDeltaG: number;
  useSemantic: boolean;
  limit: number;
}

export interface AIAnalysis {
  summary: string;
  nextSteps: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
}