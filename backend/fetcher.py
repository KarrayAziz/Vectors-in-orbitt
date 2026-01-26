from Bio import Entrez
import os

class NCBIFetcher:
    def __init__(self, email=None):
        Entrez.email = email or os.getenv("ENTREZ_EMAIL", "your.email@example.com")
        self.db = "pubmed"

    def search(self, query: str, max_results: int = 20):
        try:
            handle = Entrez.esearch(db=self.db, term=query, retmax=max_results)
            record = Entrez.read(handle)
            handle.close()
            return record["IdList"]
        except Exception as e:
            print(f"Error searching NCBI: {e}")
            return []

    def fetch_details(self, id_list):
        if not id_list:
            return []
        try:
            ids = ",".join(id_list)
            handle = Entrez.efetch(db=self.db, id=ids, retmode="xml")
            papers = Entrez.read(handle)
            handle.close()
            
            # Log what we fetched for visibility
            print("\n--- NCBI Fetch Results ---")
            for i, p in enumerate(papers['PubmedArticle']):
                title = p['MedlineCitation']['Article']['ArticleTitle']
                print(f"[{i+1}] {title[:80]}..." if len(title) > 80 else f"[{i+1}] {title}")
            print("--------------------------\n")
            
            return papers['PubmedArticle']
        except Exception as e:
            print(f"Error fetching details: {e}")
            return []
