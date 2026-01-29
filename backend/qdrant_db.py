from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct

# Initialize Qdrant client
client = QdrantClient(host="localhost", port=6333)

COLLECTION = "Articles"
VECTOR_NAME = "text"  # must match your collection vector name
VECTOR_SIZE = 384      # must match embedding model

def init_collection():
    """Create the collection if it does not exist."""
    if not client.collection_exists(COLLECTION):
        print(f"[INFO] Collection '{COLLECTION}' does not exist. Creating...")
        client.create_collection(
            collection_name=COLLECTION,
            vectors_config={
                VECTOR_NAME: VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE)
            }
        )
        print(f"[INFO] Collection '{COLLECTION}' created successfully.")
    else:
        print(f"[INFO] Collection '{COLLECTION}' already exists.")

def upsert_articles(articles, embeddings):
    """
    Upsert articles into Qdrant.
    Each point will use vector name 'text' and payload containing article data.
    """
    points = []

    for i, (art, emb) in enumerate(zip(articles, embeddings), start=1):
        # Convert embedding to plain Python list
        vector_list = emb.tolist() if hasattr(emb, "tolist") else list(emb)

        points.append(
            PointStruct(
                id=int(art["pmid"]),
                vector={VECTOR_NAME: vector_list},  # must match collection
                payload={
                    "title": art.get("title"),
                    "abstract": art.get("abstract"),
                    "url": art.get("url"),
                    "pmid": art.get("pmid")
                }
            )
        )

        if i % 50 == 0:
            print(f"[INFO] Prepared {i} articles for upsert...")

    if points:
        client.upsert(
            collection_name=COLLECTION,
            points=points
        )
