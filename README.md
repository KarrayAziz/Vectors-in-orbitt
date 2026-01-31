# Bio-Vector Orbit - Discovery Engine v2.0

A **Vector-Powered Discovery Engine** that transforms fragmented biological data (papers, DNA sequences, and chemical molecules) into a unified, searchable intelligence layer using **NCBI**, **Qdrant**, **FastEmbed**, and **React**.

![Bio-Vector Orbit](https://img.shields.io/badge/Status-Hackathon%20Ready-success)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Quick Start with Docker (Recommended for Judges)

**Prerequisites:** [Docker](https://www.docker.com/get-started) and Docker Compose installed.

### 1. Start the Application

```bash
docker-compose up
```

That's it! The entire stack will start automatically.

### 2. Access the Application

- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000/docs](http://localhost:8000/docs) (Interactive Swagger UI)
- **Qdrant Dashboard**: [http://localhost:6333/dashboard](http://localhost:6333/dashboard)

### 3. Try It Out

1. Open [http://localhost:3000](http://localhost:3000)
2. **Choose Your Discovery Mode**:
   - **Text**: Search PubMed articles (e.g., "Alzheimer's treatments")
   - **Protein**: Visualize human protein structures from PDB (e.g., "Insulin")
   - **Molecule**: Discover chemical compounds via SMILES latent search (e.g., "CCO")
3. Watch as the system retrieves data from **NCBI**, **RCSB PDB**, or your custom **SMILES VAE** model.

### 4. Stop the Application

```bash
docker-compose down
```

---

## ✨ Features

### Core Capabilities
- 🧬 **NCBI PubMed Integration**: Real-time retrieval of the latest biomedical literature.
- 🧬 **PDB Protein Discovery**: Immersive structural search across the RCSB Protein Data Bank.
- 🧪 **SMILES Chemical Search**: Latent space discovery using a custom VAE model for molecular similarity.
- 🔍 **Unified Semantic Search**: Bge-small-en-v1.5 embeddings power both literature and structural queries.
- 🧱 **Advanced Visualizer**: PDBe-molstar integration with illustrative lighting and futuristic HUD.
- 📊 **Multimodal Results**: Hybrid UI renders specialized cards for papers, proteins, and molecules.

### Technical Highlights
- **Quad-Collection Architecture**: Separate vector spaces for Text, Proteins, and Chemical Latent vectors.
- **HNSW Indexing**: High-precision semantic clustering for sub-second retrieval.
- **Unified Embedding Logic**: Consistent BGE-Small vectorization across all biological entities.
- **Zero-Setup Docker**: Full orchestration handles model pre-loading and DB health checks.

---

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │─────▶│   FastAPI    │─────▶│   Qdrant    │
│  Frontend   │      │   Backend    │      │  Vector DB  │
│  (Port 3000)  │      │  (Port 8000) │      │ (Port 6333) │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
     ┌──────────────┐                ┌──────────────┐
     │ NCBI PubMed  │                │   RCSB PDB   │
     │   (Biopython)│                │   (Structure)│
     └──────────────┘                └──────────────┘
```

### Technology Stack
- **Frontend**: React 19 + Vite + TypeScript + TailwindCSS
- **Backend**: Python 3.11 + FastAPI + Uvicorn
- **AI Models**: FastEmbed (BGE-Small) + Custom Keras VAE (SMILES)
- **Vector Database**: Qdrant (Hybrid Cloud/Local)
- **Data Sources**: NCBI, RCSB PDB, PubChem
- **3D Visualization**: PDBe-molstar

---

## 📁 Project Structure

```
Vectros-in-orbit2.0/
├── backend/
│   ├── main.py              # Central search router & endpoints
│   ├── qdrant_db.py         # Multi-collection client logic
│   ├── ingest_proteins.py   # PDB structure scraper & ingestion
│   ├── smiles.py            # Latent molecular search logic
│   ├── Blog_simple...h5     # Chemical discovery VAE model
│   ├── Dockerfile           # Neural backend container
│   └── requirements.txt     # Unified dependency list
├── components/
│   ├── ProteinViewer.tsx    # Illustrative 3D visualization HUD
│   ├── ProteinCard.tsx      # Structure-focused result card
│   ├── MoleculeCard.tsx     # Chemical formula search card
│   └── ResultCard.tsx       # Standard PubMed article card
├── App.tsx                  # Dual-mode state & hybrid UI logic
└── ...
```

---

## 🧪 How It Works

1. **Discovery Mode**: User toggles between Literature, Proteins, and Molecules.
2. **Neural Retrieval**:
   - **Text/Protein**: BGE embeddings find semantic matches in PubMed/PDB.
   - **Chemical**: Keras VAE converts SMILES into latent vectors for similarity search.
3. **Hybrid Rendering**: Backend returns standardized types, and the UI adapts the card style (PubMed vs. PDB vs. SMILES).
4. **Immersive Viewing**: Proteins are loaded into a high-precision 3D viewport with illustrative depth and real-time metadata HUD.


---

---

## 🐳 Running with Docker

The application is fully containerized for a seamless experience across all platforms.

```bash
# Build and start all services
docker-compose up --build

# Shutdown the application
docker-compose down
```

---

## 🎯 Use Cases

- **Drug Discovery**: Find papers on specific protein targets or compounds
- **Literature Review**: Semantic search across biomedical abstracts
- **Hypothesis Generation**: Discover connections between biological concepts
- **Education**: Explore biological topics with visual 3D structures

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Author

Built for the **Vectors in Orbit** Hackathon by **Karray Aziz**

---

## 🙏 Acknowledgments

- **NCBI PubMed**: For providing open access to biomedical literature
- **Qdrant**: For the powerful vector database solution
- **FastEmbed**: For efficient, lightweight embeddings
- **iCn3D**: For 3D molecular visualization

---

**Questions?** Open an issue or contact the maintainer.

**Enjoy exploring the biology discovery engine!** 🧬🚀
