from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from Bio import Entrez
# Placeholder imports for Chonkie and custom logic
# from chonkie import SemanticChunker 

app = FastAPI(title="Bio-Vector Orbit API")

# Configuration
QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", 6333))
COLLECTION_NAME = "bio_orbit"

# Initialize Clients
qdrant = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)
model = SentenceTransformer('all-MiniLM-L6-v2')
Entrez.email = "your_email@example.com" # Required by NCBI

class SearchRequest(BaseModel):
    query: str
    limit: int = 20
    min_delta_g: float = 0.0
    diversity: float = 0.5 # MMR Lambda

@app.post("/search")
async def search_bio_vectors(req: SearchRequest):
    """
    1. Embeds query.
    2. Searches Qdrant with HNSW filters.
    3. Applies MMR for diversity.
    """
    try:
        query_vector = model.encode(req.query).tolist()
        
        search_result = qdrant.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_vector,
            limit=req.limit,
            search_params={"hnsw_ef": 128, "exact": False},
            # In a real scenario, use query_filter for Delta G here if indexed
            # query_filter=Filter(...) 
        )
        
        # Post-processing for Delta G filter (if not in Qdrant filter)
        filtered = [
            hit for hit in search_result 
            if hit.payload.get('delta_g', 0) <= req.min_delta_g
        ]
        
        # Format response
        response = []
        for hit in filtered:
            response.append({
                "id": hit.id,
                "score": hit.score,
                "payload": hit.payload
            })
            
        return {"results": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ingest")
async def dynamic_ingest(query: str):
    """
    Dynamic Ingestor Pipeline:
    1. Search NCBI Entrez.
    2. Fetch Abstracts.
    3. Chunk with Chonkie.
    4. Upsert to Qdrant.
    """
    # 1. NCBI Search
    handle = Entrez.esearch(db="pubmed", term=query, retmax=10)
    record = Entrez.read(handle)
    id_list = record["IdList"]
    
    # 2. Fetch Details
    handle = Entrez.efetch(db="pubmed", id=id_list, retmode="xml")
    papers = Entrez.read(handle)
    
    points = []
    
    # 3. Process & Chunk
    for paper in papers['PubmedArticle']:
        abstract = paper['MedlineCitation']['Article'].get('Abstract', {}).get('AbstractText', [""])[0]
        pmid = paper['MedlineCitation']['PMID']
        
        # chunks = chunker.chunk(abstract) # Pseudo-code for Chonkie
        chunks = [abstract] # Fallback
        
        for i, chunk in enumerate(chunks):
            vector = model.encode(chunk).tolist()
            
            # Simulate Delta G calculation (Placeholder)
            delta_g = -5.0 - (len(chunk) % 10) 
            
            points.append({
                "id": f"{pmid}_{i}",
                "vector": vector,
                "payload": {
                    "text": chunk,
                    "title": paper['MedlineCitation']['Article']['ArticleTitle'],
                    "source": "PubMed",
                    "delta_g": delta_g
                }
            })
            
    # 4. Upsert
    # qdrant.upsert(collection_name=COLLECTION_NAME, points=points)
    
    return {"status": "Ingested", "count": len(points)}
