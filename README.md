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
2. Type "**Insulin**" or "**BRCA1**" in the search bar
3. Hit **Enter**
4. Watch as the system:
   - Fetches real papers from NCBI PubMed
   - Processes them with semantic chunking
   - Displays scientifically relevant results
   - Provides links back to original sources

### 4. Stop the Application

```bash
docker-compose down
```

---

## ✨ Features

### Core Capabilities
- 🧬 **Real-Time NCBI Search**: Automatically fetches the latest papers from PubMed on each query
- 🔍 **Semantic Vector Search**: Uses FastEmbed (BAAI/bge-small-en-v1.5) for meaning-based retrieval
- 📊 **Physics-Informed Ranking**: Results include thermodynamic stability (ΔG values)
- 🧱 **Semantic Chunking**: Chonkie library breaks abstracts at logical boundaries
- 🏗️ **Multimodal Embeddings**: Supports Text, Protein, and Molecule vectors
- 🔬 **3D Visualization**: iCn3D integration for protein structure viewing
- 📎 **Scientific Traceability**: Every result links back to the original PubMed article

### Technical Highlights
- **Named Vectors**: Separate vector spaces for Text (384D), Protein (384D), Molecule (384D)
- **HNSW Indexing**: High-precision clustering (m=32, ef_construct=200)
- **MMR Diversity**: Maximal Marginal Relevance for diverse result sets
- **Zero-Setup**: Docker handles all dependencies and initialization

---

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │─────▶│   FastAPI    │─────▶│   Qdrant    │
│  Frontend   │      │   Backend    │      │  Vector DB  │
│  (Port 80)  │      │  (Port 8000) │      │ (Port 6333) │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ NCBI PubMed  │
                     │   (Biopython)│
                     └──────────────┘
```

### Technology Stack
- **Frontend**: React 19 + Vite + TypeScript + TailwindCSS
- **Backend**: Python 3.1 + FastAPI + Uvicorn
- **Vector Database**: Qdrant (with Named Vectors)
- **Embeddings**: FastEmbed (BAAI/bge-small-en-v1.5)
- **Chunking**: Chonkie (Semantic Chunker)
- **Data Source**: NCBI PubMed (via Biopython Entrez)
- **3D Visualization**: iCn3D

---

## 📁 Project Structure

```
Vectros-in-orbit2.0/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── embeddings.py        # FastEmbed model manager
│   ├── fetcher.py           # NCBI PubMed integration
│   ├── qdrant_setup.py      # Vector DB schema
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend container
├── components/
│   ├── MoleculeViewer.tsx   # iCn3D 3D viewer
│   └── ResultCard.tsx       # Search result card
├── App.tsx                  # Main React application
├── index.html               # HTML entry point
├── docker-compose.yml       # Orchestration config
├── Dockerfile               # Frontend container
└── README.md                # This file
```

---

## 🧪 How It Works

1. **User Query**: User types "Insulin" and hits Enter
2. **NCBI Fetch**: Backend queries PubMed via Biopython, retrieves 5 latest papers
3. **Semantic Chunking**: Chonkie splits abstracts intelligently (not random splits)
4. **Vector Embedding**: FastEmbed converts each chunk to a 384D vector
5. **Qdrant Storage**: Vectors + metadata (title, source, ΔG) stored in Qdrant
6. **Similarity Search**: User query is embedded and compared to stored vectors
7. **Results Display**: Top matches displayed with scores, sources, and 3D viewer option

---

## 🛠️ Manual Setup (Without Docker)

<details>
<summary>Click to expand manual installation instructions</summary>

### Prerequisites
- Python 3.11+
- Node.js 18+
- Qdrant (running on localhost:6333)

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python qdrant_setup.py
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
npm install
npm run dev
```

### Start Qdrant
```bash
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
```

</details>

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
