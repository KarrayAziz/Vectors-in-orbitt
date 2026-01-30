import json
from datetime import datetime
from pubmed import fetch_pubmed_articles
from embeddings import embed, chunk_text
from qdrant_db import init_collection, upsert_articles, get_ingested_pmids

STATE_FILE = "state.json"

def get_last_date():
    try:
        with open(STATE_FILE) as f:
            last_date = json.load(f)["last_date"]
            print(f"[INFO] Last ingestion date found: {last_date}")
            return last_date
    except FileNotFoundError:
        print("[INFO] No previous state found. Performing initial ingestion.")
        return None

def save_last_date(date):
    with open(STATE_FILE, "w") as f:
        json.dump({"last_date": date}, f)
    print(f"[INFO] Updated state file with new ingestion date: {date}")

def update_database():
    print("[INFO] Initializing Qdrant collection...")
    init_collection()
    print("[INFO] Qdrant collection ready.")

    last_date = get_last_date()
    print(f"[INFO] Fetching articles from PubMed (from_date={last_date})...")
    articles = fetch_pubmed_articles(from_date=last_date)
    num_articles = len(articles)
    print(f"[INFO] Number of articles fetched: {num_articles}")

    if not articles:
        print("[INFO] No new articles found. Ingestion complete.")
        return {"status": "No new articles"}

    # Duplicate detection: filter out articles already in the database
    print("[INFO] Checking for duplicates...")
    ingested_pmids = get_ingested_pmids()
    print(f"[INFO] Found {len(ingested_pmids)} articles already in database.")
    
    new_articles = [a for a in articles if a.get("pmid") not in ingested_pmids]
    num_new = len(new_articles)
    num_duplicates = num_articles - num_new
    
    if num_duplicates > 0:
        print(f"[INFO] Skipping {num_duplicates} duplicate article(s). Processing {num_new} new article(s).")
    
    if not new_articles:
        print("[INFO] All fetched articles are duplicates. Ingestion complete.")
        return {"status": f"No new articles (all {num_articles} were duplicates)"}

    print("[INFO] Chunking abstracts and generating embeddings...")
    
    # Chunk each abstract and prepare vectors with associated article metadata
    all_chunks = []  # List of (chunk_text, article) tuples
    all_embeddings = []
    
    for article in new_articles:
        abstract = article.get("abstract", "")
        if not abstract.strip():
            continue
        
        # Chunk the abstract
        chunks = chunk_text(abstract)
        for chunk_text_item in chunks:
            all_chunks.append((chunk_text_item, article))
    
    if not all_chunks:
        print("[INFO] No valid chunks to embed. Ingestion complete.")
        return {"status": "No valid chunks"}
    
    print(f"[INFO] Total chunks created: {len(all_chunks)}")
    
    # Embed all chunks at once
    chunk_texts_only = [chunk[0] for chunk in all_chunks]
    print("[INFO] Generating embeddings for chunks (this may take some time)...")
    vectors = embed(chunk_texts_only)
    print(f"[INFO] Embeddings generated for {len(vectors)} chunks.")

    print("[INFO] Upserting chunks into Qdrant...")
    upsert_articles(all_chunks, vectors)
    print(f"[INFO] Successfully upserted {len(all_chunks)} chunks into Qdrant.")

    today = datetime.today().strftime("%Y/%m/%d")
    save_last_date(today)

    print("[INFO] Ingestion process complete.")
    return {"status": f"{len(all_chunks)} chunks from {num_new} new articles added (skipped {num_duplicates} duplicates)"}



#testing 

if __name__ == "__main__":
    result = update_database()
    print(result)
