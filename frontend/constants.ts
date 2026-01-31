import { BioResult, MoleculeType } from './types';

// Simulating what the Python FastAPI + Qdrant would return
export const MOCK_RESULTS: BioResult[] = [
  {
    id: 'res_001',
    score: 0.94,
    type: MoleculeType.PROTEIN,
    source: {
      id: '1TUP',
      title: 'Tumor suppressor p53 complexed with DNA',
      url: 'https://www.ncbi.nlm.nih.gov/structure/?term=1TUP',
      authors: ['Cho, Y.', 'Gorina, S.', 'Jeffrey, P.D.'],
      date: '1994-07-15',
      db: 'Structure'
    },
    chunk: {
      id: 'chk_1tup_01',
      text: 'The crystal structure of the p53 tumor suppressor-DNA complex reveals that the core domain of p53 binds to DNA as a tetramer. Specificity is derived from the loop-sheet-helix motif interacting with the major groove.',
    },
    pdbId: '1TUP',
    deltaG: -12.4,
    molecularWeight: 43.5,
    tags: ['Tumor Suppressor', 'Transcription Factor', 'DNA Binding']
  },
  {
    id: 'res_002',
    score: 0.89,
    type: MoleculeType.PROTEIN,
    source: {
      id: '4HHB',
      title: 'The crystal structure of human deoxyhaemoglobin at 1.74 A resolution',
      url: 'https://www.ncbi.nlm.nih.gov/structure/?term=4HHB',
      authors: ['Fermi, G.', 'Perutz, M.F.'],
      date: '1984-03-05',
      db: 'Structure'
    },
    chunk: {
      id: 'chk_4hhb_05',
      text: 'Hemoglobin exhibits cooperative binding to oxygen, regulated by allosteric transitions between the T (tense) and R (relaxed) states. The heme group iron atom shifts into the porphyrin plane upon oxygenation.',
    },
    pdbId: '4HHB',
    deltaG: -9.8,
    molecularWeight: 64.5,
    tags: ['Oxygen Transport', 'Heme', 'Allostery']
  },
  {
    id: 'res_003',
    score: 0.82,
    type: MoleculeType.PROTEIN,
    source: {
      id: '3W32',
      title: 'Crystal structure of human EGFR kinase domain complexed with therapeutic inhibitor',
      url: 'https://www.ncbi.nlm.nih.gov/structure/?term=3W32',
      authors: ['Amano, Y.', 'Namba, T.'],
      date: '2013-05-20',
      db: 'Structure'
    },
    chunk: {
      id: 'chk_3w32_02',
      text: 'The kinase domain of EGFR adopts an active conformation when bound to the inhibitor. Key interactions include hydrogen bonds with Met793 in the hinge region, stabilizing the complex for therapeutic efficacy.',
    },
    pdbId: '3W32',
    deltaG: -15.2,
    molecularWeight: 35.2,
    tags: ['Kinase', 'Oncology', 'Drug Target']
  },
  {
    id: 'res_004',
    score: 0.76,
    type: MoleculeType.SMALL_MOLECULE,
    source: {
      id: 'PMC123456',
      title: 'Thermodynamic analysis of novel ATP-competitive inhibitors',
      url: 'https://pubmed.ncbi.nlm.nih.gov/',
      authors: ['Smith, J.', 'Doe, A.'],
      date: '2023-11-10',
      db: 'PubMed'
    },
    chunk: {
      id: 'chk_pmc_99',
      text: 'We observed that rigidification of the scaffold improved the binding enthalpy significantly. However, entropy-enthalpy compensation limited the overall improvement in free energy (Delta G).',
    },
    // No PDB ID for pure abstract/small molecule text unless docked
    deltaG: -8.1,
    molecularWeight: 0.45,
    tags: ['Medicinal Chemistry', 'Thermodynamics', 'Inhibitor']
  }
];

export const SAMPLE_QUERIES = [
  "Tumor suppressor DNA binding mechanism",
  "Oxygen transport allosteric regulation",
  "Kinase inhibitor binding enthalpy",
  "CRISPR-Cas9 conformers"
];

export const DISPLAY_LIMIT = 12;