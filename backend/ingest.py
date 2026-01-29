import json
from datetime import datetime
from pubmed import fetch_pubmed_articles
from embeddings import embed
from qdrant_db import init_collection, upsert_articles

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

    print("[INFO] Extracting abstracts for embedding...")
    abstracts = [a["abstract"] for a in articles]
    
    print("[INFO] Generating embeddings for abstracts (this may take some time)...")
    vectors = embed(abstracts)
    print(f"[INFO] Embeddings generated for {len(vectors)} articles.")

    print("[INFO] Upserting articles into Qdrant...")
    upsert_articles(articles, vectors)
    print(f"[INFO] Successfully upserted {len(articles)} articles into Qdrant.")

    today = datetime.today().strftime("%Y/%m/%d")
    save_last_date(today)

    print("[INFO] Ingestion process complete.")
    return {"status": f"{num_articles} articles added"}

#testing 

if __name__ == "__main__":
    result = update_database()
    print(result)
