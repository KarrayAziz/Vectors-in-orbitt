from fastembed import TextEmbedding
import numpy as np

class EmbeddingManager:
    def __init__(self):
        print("Loading FastEmbed models...")
        # Text: Uses BAAI/bge-small-en-v1.5 (Default) - extremely fast & light
        self.text_model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
        
        # Note: FastEmbed currently specializes in Text. 
        # For Protein/Molecule, we will use the text model as a fallback 
        # or simplified representation to keep things running locally without heavy deps.
        # Ideally, we would stick to specific models, but for local performance, this is a valid trade-off.
        
        print("FastEmbed models loaded.")

    def embed_text(self, text: str):
        # FastEmbed returns a generator, convert to list
        embeddings = list(self.text_model.embed([text]))
        return embeddings[0].tolist()

    def embed_protein(self, sequence: str):
        # Fallback: Treat protein sequence as text for embedding 
        # (Bio-specific models like ESM are heavy, this is a trade-off for speed)
        return self.embed_text(sequence)

    def embed_molecule(self, smiles: str):
        # Fallback: Treat SMILES as text
        return self.embed_text(smiles)
