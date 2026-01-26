import requests
import time

# Configuration
API_URL = "http://localhost:8000"

def test_pipeline():
    print("Testing Vector-Powered Discovery Engine Pipeline...")

    # 1. Test Ingestion
    print("\n[1] Testing Ingestion (Query: 'Insulin')...")
    ingest_payload = {"query": "Insulin", "max_results": 2}
    try:
        response = requests.post(f"{API_URL}/ingest", json=ingest_payload)
        if response.status_code == 200:
            print(f"✅ Ingestion Success: {response.json()}")
        else:
            print(f"❌ Ingestion Failed: {response.text}")
    except Exception as e:
        print(f"❌ Ingestion Error: {e}")
        return

    # Wait for indexing
    time.sleep(2)

    # 2. Test Text Search
    print("\n[2] Testing Text Search (Query: 'insulin')...")
    search_payload = {
        "query": "insulin",
        "type": "text",
        "limit": 5,
        "min_delta_g": 0.0
    }
    try:
        response = requests.post(f"{API_URL}/search", json=search_payload)
        if response.status_code == 200:
            results = response.json().get("results", [])
            print(f"✅ Search Success. Found {len(results)} results.")
            for res in results:
                print(f"   - {res['payload'].get('title', 'No Title')} (Score: {res['score']:.3f})")
        else:
            print(f"❌ Search Failed: {response.text}")
    except Exception as e:
        print(f"❌ Search Error: {e}")

    print("\nPipeline Test Verification Complete.")

if __name__ == "__main__":
    test_pipeline()
