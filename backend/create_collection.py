# create_collection.py
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance

COLLECTION_NAME = "Articles"
VECTOR_SIZE = 384  # must match your embedding model

client = QdrantClient(host="localhost", port=6333)

collections = [c.name for c in client.get_collections().collections]

if COLLECTION_NAME in collections:
    print(f"Collection '{COLLECTION_NAME}' already exists.")
else:
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config={
            "text": VectorParams(
                size=VECTOR_SIZE,
                distance=Distance.COSINE
            )
        }
    )
    print(f"Collection '{COLLECTION_NAME}' created.")
