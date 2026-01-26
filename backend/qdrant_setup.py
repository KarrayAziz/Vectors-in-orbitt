from qdrant_client import QdrantClient
from qdrant_client.http import models
import os

QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", 6333))
COLLECTION_NAME = "bio_orbit"

client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)

def setup_collection():
    # Check if collection exists
    collections = client.get_collections()
    exists = any(c.name == COLLECTION_NAME for c in collections.collections)
    
    if exists:
        print(f"Collection {COLLECTION_NAME} already exists.")
        return

    print(f"Creating collection: {COLLECTION_NAME}")
    
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config={
            "text": models.VectorParams(
                size=384,  # FastEmbed BGE-Small
                distance=models.Distance.COSINE
            ),
            "protein": models.VectorParams(
                size=384,  # Using Text Model as fallback
                distance=models.Distance.COSINE
            ),
            "molecule": models.VectorParams(
                size=384,  # Using Text Model as fallback
                distance=models.Distance.COSINE
            ),
        },
        # HNSW Tuning for High Precision Biological Clusters
        hnsw_config=models.HnswConfigDiff(
            m=32,               # Edges per node
            ef_construct=200,   # Candidates during build
            full_scan_threshold=10000
        ),
        # Optimize for speed
        optimizers_config=models.OptimizersConfigDiff(
            default_segment_number=2,
            memmap_threshold=20000
        )
    )
    
    # Create Payload Index for Delta G to enable fast filtering
    client.create_payload_index(
        collection_name=COLLECTION_NAME,
        field_name="delta_g",
        field_schema=models.PayloadSchemaType.FLOAT
    )

    print("Collection setup complete.")

if __name__ == "__main__":
    setup_collection()