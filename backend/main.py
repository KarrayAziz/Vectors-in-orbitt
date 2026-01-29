from fastapi import FastAPI
from ingest import update_database
from qdrant_client import QdrantClient

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

client = QdrantClient(host="localhost", port=6333)

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
            "abstract": r.payload["abstract"],
            "url": r.payload["url"],
            "score": r.score
        }
        for r in results
    ]