from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Literal
import os
import uuid
from qdrant_client import QdrantClient, models
from chonkie import SemanticChunker # Assuming Chonkie is installed

from embeddings import EmbeddingManager
from fetcher import NCBIFetcher

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Bio-Vector Orbit API")

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", 6333))
COLLECTION_NAME = "bio_orbit"

# Initialize Clients
print("Initializing Qdrant...")
qdrant = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)

print("Initializing Embedding Models (this may take time)...")
embedding_manager = EmbeddingManager()

print("Initializing Fetcher...")
fetcher = NCBIFetcher()

# Startup event to ensure Qdrant collection exists
@app.on_event("startup")
async def startup_event():
    """Initialize Qdrant collection on startup if it doesn't exist"""
    try:
        collections = qdrant.get_collections()
        exists = any(c.name == COLLECTION_NAME for c in collections.collections)
        
        if exists:
            print(f"Collection '{COLLECTION_NAME}' already exists.")
            return
        
        print(f"Creating collection '{COLLECTION_NAME}'...")
        qdrant.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config={
                "text": models.VectorParams(size=384, distance=models.Distance.COSINE),
                "protein": models.VectorParams(size=384, distance=models.Distance.COSINE),
                "molecule": models.VectorParams(size=384, distance=models.Distance.COSINE),
            },
            hnsw_config=models.HnswConfigDiff(m=32, ef_construct=200, full_scan_threshold=10000),
            optimizers_config=models.OptimizersConfigDiff(default_segment_number=2, memmap_threshold=20000)
        )
        
        qdrant.create_payload_index(
            collection_name=COLLECTION_NAME,
            field_name="delta_g",
            field_schema=models.PayloadSchemaType.FLOAT
        )
        
        print(f"Collection '{COLLECTION_NAME}' created successfully.")
    except Exception as e:
        print(f"Error during collection setup: {e}")

# Models
class SearchRequest(BaseModel):
    query: str
    type: Literal["text", "protein", "molecule"] = "text"
    limit: int = 10
    min_delta_g: float = 0.0
    diversity: float = 0.5 # MMR Lambda

class IngestRequest(BaseModel):
    query: str
    max_results: int = 10

# Helper function for NCBI ingestion
async def _perform_ingestion(query: str, max_results: int = 5):
    """Fetch and ingest data from NCBI for a given query"""
    print(f"Searching NCBI for: {query}")
    ids = fetcher.search(query, max_results=max_results)
    if not ids:
        print("No NCBI results found")
        return 0
        
    print(f"Fetching details for {len(ids)} papers...")
    papers = fetcher.fetch_details(ids)
    
    points = []
    chunker = SemanticChunker(embedding_model="minishlab/potion-base-8M", threshold=0.5)
    
    for paper in papers:
        try:
            abstract_list = paper['MedlineCitation']['Article'].get('Abstract', {}).get('AbstractText', [])
            if not abstract_list:
                continue
            abstract = " ".join(abstract_list) if isinstance(abstract_list, list) else str(abstract_list)
            pmid = paper['MedlineCitation']['PMID']
            title = paper['MedlineCitation']['Article']['ArticleTitle']
            
            chunks = chunker(abstract)
            
            for i, chunk in enumerate(chunks):
                vector = embedding_manager.embed_text(chunk.text)
                delta_g = - (len(chunk.text) % 10)
                point_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{pmid}_{i}"))
                
                points.append(models.PointStruct(
                    id=point_id,
                    vector={"text": vector},
                    payload={
                        "text": chunk.text,
                        "title": title,
                       "source": f"PubMed:{pmid}",
                        "delta_g": delta_g,
                        "type": "text"
                    }
                ))
        except Exception as e:
            print(f"Error processing paper: {e}")
            continue
    
    if points:
        print(f"Upserting {len(points)} points...")
        qdrant.upsert(collection_name=COLLECTION_NAME, points=points)
    
    return len(points)

@app.post("/search")
async def search_bio_vectors(req: SearchRequest):
    """
    Real-time NCBI search with auto-ingestion
    """
    try:
        # AUTO-INGEST: Fetch fresh data from NCBI for text queries
        if req.type == "text":
            count = await _perform_ingestion(req.query, max_results=5)
            print(f"Auto-ingested {count} chunks for query: '{req.query}'")
        
        # Embed query based on type
        if req.type == "text":
            vector = embedding_manager.embed_text(req.query)
            target_vector_name = "text"
        elif req.type == "protein":
            vector = embedding_manager.embed_protein(req.query)
            target_vector_name = "protein"
        elif req.type == "molecule":
            vector = embedding_manager.embed_molecule(req.query)
            target_vector_name = "molecule"
        else:
            raise HTTPException(status_code=400, detail="Invalid query type")

        # Search Qdrant
        search_result = qdrant.query_points(
            collection_name=COLLECTION_NAME,
            query=vector,
            using=target_vector_name,
            limit=req.limit * 2,
            search_params=models.SearchParams(hnsw_ef=128, exact=False),
            with_payload=True,
            with_vectors=False
        ).points
        
        # Post-processing: Delta G Filter
        filtered = [
            hit for hit in search_result 
            if hit.payload.get('delta_g', 0) <= req.min_delta_g
        ]
        
        final_results = filtered[:req.limit]
        
        response = []
        for hit in final_results:
            response.append({
                "id": hit.id,
                "score": hit.score,
                "payload": hit.payload,
                "vector_type": target_vector_name
            })
            
        return {"results": response}

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ingest")
async def dynamic_ingest(req: IngestRequest):
    """
    Manual batch ingestion endpoint
    """
    try:
        count = await _perform_ingestion(req.query, max_results=req.max_results)
        return {"status": "Ingested", "count": count}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
