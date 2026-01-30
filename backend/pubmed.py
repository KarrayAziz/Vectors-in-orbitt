from Bio import Entrez
from datetime import datetime

Entrez.email = "your_email@example.com"

def fetch_pubmed_articles(from_date=None, max_results=200):
    query = "hasabstract[text]"
    if from_date:
        query += f" AND ({from_date}[PDAT] : 3000[PDAT])"

    handle = Entrez.esearch(
        db="pubmed",
        term=query,
        retmax=max_results,
        sort="pub+date"
    )
    search_results = Entrez.read(handle)
    pmids = search_results["IdList"]

    if not pmids:
        return []

    fetch_handle = Entrez.efetch(
        db="pubmed",
        id=",".join(pmids),
        rettype="abstract",
        retmode="xml"
    )
    records = Entrez.read(fetch_handle)

    articles = []

    for article in records["PubmedArticle"]:
        medline = article["MedlineCitation"]
        pmid = str(medline["PMID"])

        art = medline["Article"]
        title = art.get("ArticleTitle", "")

        abstract = ""
        if "Abstract" in art:
            abstract = " ".join(
                art["Abstract"]["AbstractText"]
            )

        url = f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/"

        articles.append({
            "pmid": pmid,
            "title": title,
            "abstract": abstract,
            "url": url
        })

    return articles
