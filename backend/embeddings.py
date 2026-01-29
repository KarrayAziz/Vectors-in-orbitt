from sentence_transformers import SentenceTransformer
import torch

# Detect device
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"[INFO] Embedding model device: {device.upper()}")

model = SentenceTransformer("all-MiniLM-L6-v2", device=device)

def embed(texts):
    return model.encode(texts, show_progress_bar=True)
