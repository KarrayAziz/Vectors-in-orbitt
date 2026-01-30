import os
import time
import socket
import hashlib
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct

# Read host/port from environment to work in Docker Compose
QDRANT_HOST = os.getenv("QDRANT_HOST", "qdrant")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", 6333))

COLLECTION = "Articles"
VECTOR_NAME = "text"  # must match your collection vector name
VECTOR_SIZE = 384      # must match embedding model


def wait_for_service(host: str, port: int, timeout: int = 30) -> bool:
    """Wait for a TCP service to be available."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with socket.create_connection((host, port), timeout=2):
                return True
        except OSError:
            time.sleep(0.5)
    return False


if not wait_for_service(QDRANT_HOST, QDRANT_PORT, timeout=30):
    print(f"[WARN] Qdrant not reachable at {QDRANT_HOST}:{QDRANT_PORT} during startup. Operations will retry and may fail until Qdrant is available.")

# Initialize Qdrant client (will connect to service name inside Docker)
client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)


def generate_point_id(pmid: int, chunk_text: str) -> int:
    """
    Generate a unique point ID based on PMID and chunk content.
    Uses MD5 hash to ensure same content always produces same ID.
    This enables true deduplication: identical chunks from same article
    will always have the same point ID.
    """
    content_hash = hashlib.md5(f"{pmid}:{chunk_text}".encode()).hexdigest()
    # Convert hex hash to integer, keeping it within reasonable bounds for Qdrant
    return int(content_hash, 16) % (2**31 - 1)


def get_ingested_pmids() -> set:
    """
    Get the set of PMIDs already in the database.
    Used for duplicate detection to avoid re-processing known articles.
    """
    try:
        # Scroll through all points to collect unique PMIDs
        points, _ = client.scroll(
            collection_name=COLLECTION,
            limit=10000  # Adjust if you have more points
        )
        pmids = set()
        for point in points:
            pmid = point.payload.get("pmid")
            if pmid:
                pmids.add(pmid)
        return pmids
    except Exception as e:
        print(f"[WARN] Failed to retrieve ingested PMIDs: {e}. Proceeding without duplicate detection.")
        return set()


def init_collection():
    """Create the collection if it does not exist."""
    try:
        if not client.collection_exists(COLLECTION):
            print(f"[INFO] Collection '{COLLECTION}' does not exist. Creating...")
            try:
                client.create_collection(
                    collection_name=COLLECTION,
                    vectors_config={
                        VECTOR_NAME: VectorParams(
                            size=VECTOR_SIZE,
                            distance=Distance.COSINE,
                            hnsw_config={
                                "m": 16,              # Number of connections each node has (16 is good default)
                                "ef_construct": 200,  # Size of dynamic list for construction (higher = better quality, slower)
                                "full_scan_threshold": 10000  # Allow fallback to full scan for small datasets
                            }
                        )
                    }
                )
                print(f"[INFO] Collection '{COLLECTION}' created successfully with HNSW indexing (m=16, ef_construct=200).")
            except Exception as create_err:
                # Collection might be in deletion state; wait and retry
                print(f"[WARN] Failed to create collection: {create_err}. Waiting 2 seconds and retrying...")
                time.sleep(2)
                try:
                    if not client.collection_exists(COLLECTION):
                        client.create_collection(
                            collection_name=COLLECTION,
                            vectors_config={
                                VECTOR_NAME: VectorParams(
                                    size=VECTOR_SIZE,
                                    distance=Distance.COSINE,
                                    hnsw_config={
                                        "m": 16,
                                        "ef_construct": 200,
                                        "full_scan_threshold": 10000
                                    }
                                )
                            }
                        )
                        print(f"[INFO] Collection '{COLLECTION}' created successfully on retry.")
                except Exception as retry_err:
                    print(f"[ERROR] Failed to create collection after retry: {retry_err}")
                    raise
        else:
            print(f"[INFO] Collection '{COLLECTION}' already exists.")
    except Exception as e:
        print(f"[ERROR] Failed to initialize collection: {e}")
        raise


def upsert_articles(chunks, embeddings):
    """
    Upsert chunks into Qdrant.
    chunks: list of (chunk_text, article) tuples
    embeddings: list of numpy arrays (vectors)
    Each point will use vector name 'text' and payload containing chunk + article data.
    Uses hash-based point IDs to ensure identical chunks always have the same ID,
    enabling true deduplication and safe re-ingestion.
    """
    points = []
    
    for i, (chunk_tuple, emb) in enumerate(zip(chunks, embeddings), start=1):
        chunk_text, article = chunk_tuple
        
        # Convert embedding to plain Python list
        vector_list = emb.tolist() if hasattr(emb, "tolist") else list(emb)

        # Use hash-based point ID for true deduplication
        point_id = generate_point_id(article['pmid'], chunk_text)
        
        points.append(
            PointStruct(
                id=point_id,
                vector={VECTOR_NAME: vector_list},  # must match collection
                payload={
                    "title": article.get("title"),
                    "abstract": article.get("abstract"),
                    "chunk_text": chunk_text,  # the actual chunk that was embedded
                    "url": article.get("url"),
                    "pmid": article.get("pmid")
                }
            )
        )

        if i % 50 == 0:
            print(f"[INFO] Prepared {i} chunks for upsert...")

    if points:
        try:
            client.upsert(
                collection_name=COLLECTION,
                points=points
            )
        except Exception as e:
            print(f"[ERROR] Failed to upsert points: {e}")
            raise
