# main.py
import os
import numpy as np
import pymysql
from functools import lru_cache
from dotenv import load_dotenv
from openai import OpenAI
from langchain_openai import OpenAIEmbeddings

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)


def get_db():
    """Always return a fresh DB connection (avoids idle disconnect issues)."""
    return pymysql.connect(
        host=os.getenv("TIDB_HOST"),
        port=int(os.getenv("TIDB_PORT")),
        user=os.getenv("TIDB_USER"),
        password=os.getenv("TIDB_PASSWORD"),
        database=os.getenv("TIDB_DATABASE"),
        ssl={"ssl": {}},
        autocommit=True,
    )


@lru_cache(maxsize=1)
def get_embeddings():
    """Cache embeddings object (heavy init)."""
    return OpenAIEmbeddings(model="text-embedding-3-small", openai_api_key=OPENAI_API_KEY)


def search_tidb(query: str, top_k: int = 3):
    """Return top_k chunk texts using cosine similarity in Python."""
    emb = get_embeddings()
    q_emb = emb.embed_query(query)
    q = np.array(q_emb, dtype=np.float32)

    conn = get_db()
    try:
        conn.ping(reconnect=True)  # ensure active
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, content, embedding FROM rag_chunks;")
            rows = cursor.fetchall()
    finally:
        conn.close()

    scored = []
    for r_id, r_text, r_emb_bytes in rows:
        r = np.frombuffer(r_emb_bytes, dtype=np.float32)
        denom = (np.linalg.norm(q) * np.linalg.norm(r))
        score = float(np.dot(q, r) / denom) if denom else 0.0
        scored.append((score, r_text))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [text for _, text in scored[:top_k]]


def ask_rag(user_question: str) -> str:
    """Use retrieved context + OpenAI to answer."""
    context = search_tidb(user_question, top_k=3)
    context_text = "\n\n".join(context) if context else "(no relevant context)"

    prompt = f"""You are a helpful mental-health assistant.
Use the provided context plus general knowledge. Keep answers supportive, practical, and concise.
If the user expresses crisis (self-harm), recommend contacting professional help or emergency services.

Context:
{context_text}

User question:
{user_question}

Answer:"""

    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )
    return resp.choices[0].message.content.strip()