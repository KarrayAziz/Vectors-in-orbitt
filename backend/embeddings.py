from fastembed import TextEmbedding
from chonkie import SemanticChunker
import numpy as np

# --- 1. Initialize FastEmbed (For Search Vectors) ---
# This uses the BGE-Small model (Transformer) for high-quality search relevance.
# It runs on ONNX Runtime (CPU optimized).
model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
print("[INFO] Embedding model initialized with FastEmbed (BGE-Small)")

# --- 2. Initialize Chonkie (For Splitting Text) ---
# We pass the model name as a string. Chonkie handles the backend loading internally.
# "minishlab/potion-base-8M" uses the lightweight Model2Vec engine (Static Embeddings).
try:
    chunker = SemanticChunker(
        embedding_model="minishlab/potion-base-8M", 
        threshold=0.5, 
        chunk_size=512
    )
    print("[INFO] SemanticChunker initialized (Model: potion-base-8M)")
except Exception as e:
    # If the [model2vec] extra isn't installed, this might fail.
    print(f"[WARN] Could not initialize SemanticChunker: {e}. Will use fallback.")
    chunker = None


def chunk_text(text: str) -> list[str]:
    """
    Chunk text using chonkie SemanticChunker with minishlab/potion-base-8M model.
    Returns a list of text chunks.
    Falls back to simple sentence-based chunking if SemanticChunker fails.
    """
    if not text or len(text.strip()) < 50:
        return [text]
    
    # Try semantic chunking with Chonkie
    if chunker:
        try:
            chunks = chunker.chunk(text)
            # Extract text from chunk objects
            chunk_texts = [chunk.text for chunk in chunks]
            return chunk_texts if chunk_texts else [text]
        except Exception as e:
            print(f"[WARN] SemanticChunker failed: {e}. Using fallback sentence-based chunking.")
    
    # --- Fallback: Simple Sentence Splitting ---
    # This runs only if Chonkie fails or isn't initialized.
    sentences = [s.strip() for s in text.replace('\n', '. ').split('. ') if s.strip()]
    chunks = []
    current_chunk = ""
    chunk_size = 512
    
    for sentence in sentences:
        if current_chunk and len(current_chunk) + len(sentence) > chunk_size:
            chunks.append(current_chunk.strip())
            current_chunk = sentence
        else:
            if current_chunk:
                current_chunk += " " + sentence
            else:
                current_chunk = sentence
    
    if current_chunk.strip():
        chunks.append(current_chunk.strip())
    
    return chunks if chunks else [text]


def embed(texts):
    """Return a list of numpy arrays for the given texts."""
    # FastEmbed's API exposes `embed` which returns a generator of vectors
    embeddings = model.embed(texts)
    # Convert generator to list of numpy arrays immediately
    return [np.asarray(v) for v in embeddings]