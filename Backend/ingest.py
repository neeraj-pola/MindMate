# ingest.py
import os
import numpy as np
import pymysql
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_openai import OpenAIEmbeddings

load_dotenv()

TEXTBOOK_DIR = "Data/Textbooks/"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# TiDB connection
connection = pymysql.connect(
    host=os.getenv("TIDB_HOST"),
    port=int(os.getenv("TIDB_PORT")),
    user=os.getenv("TIDB_USER"),
    password=os.getenv("TIDB_PASSWORD"),
    database=os.getenv("TIDB_DATABASE"),
    ssl={"ssl": {}},
    autocommit=True,
)

def ensure_table():
    with connection.cursor() as cursor:
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS rag_chunks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            content TEXT,
            embedding BLOB,
            source VARCHAR(255)
        );
        """)

def load_documents():
    docs = []
    for file in os.listdir(TEXTBOOK_DIR):
        filepath = os.path.join(TEXTBOOK_DIR, file)
        if file.lower().endswith(".pdf"):
            loader = PyPDFLoader(filepath)
        elif file.lower().endswith(".txt"):
            loader = TextLoader(filepath, encoding="utf-8")
        else:
            continue
        docs.extend(loader.load())
    return docs

def main():
    ensure_table()
    docs = load_documents()
    print(f"Collected {len(docs)} documents")

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents(docs)
    print(f"Split into {len(chunks)} chunks")

    embeddings = OpenAIEmbeddings(model="text-embedding-3-small", openai_api_key=OPENAI_API_KEY)

    inserted = 0
    with connection.cursor() as cursor:
        for i, chunk in enumerate(chunks):
            vec = embeddings.embed_query(chunk.page_content)
            vec_bytes = np.array(vec, dtype=np.float32).tobytes()
            src = os.path.basename(chunk.metadata.get("source", f"doc_{i}"))
            cursor.execute(
                "INSERT INTO rag_chunks (content, embedding, source) VALUES (%s, %s, %s)",
                (chunk.page_content, vec_bytes, src)
            )
            inserted += 1

    print(f"Inserted {inserted} chunks into TiDB ✅")

if __name__ == "__main__":
    main()
