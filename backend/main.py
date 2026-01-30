from fastapi import FastAPI
from ingest import update_database
from qdrant_client import QdrantClient
import os

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Read Qdrant host/port from environment so Docker Compose service name works
QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", 6333))

client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)


@app.get("/")
def root():
    return {"status": "ok", "message": "Bio-Vector backend running"}


@app.post("/update-db")
def update_db():
    return update_database()


@app.get("/search")
def semantic_search(query: str):
    from embeddings import embed

    vector = embed([query])[0]

    response = client.query_points(
        collection_name="Articles",
        query=vector.tolist(),
        using="text",
        limit=10
    )
    results = response.points

    return [
        {
            "pmid": r.payload["pmid"],
            "title": r.payload["title"],
            "abstract": r.payload.get("chunk_text", r.payload.get("abstract", "")),  # Return chunk_text if available
            "url": r.payload["url"],
            "score": r.score
        }
        for r in results
    ]