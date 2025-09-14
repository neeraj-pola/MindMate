# main.py
import os
import numpy as np
import pymysql
import logging
from functools import lru_cache
from dotenv import load_dotenv
from openai import OpenAI
from langchain_openai import OpenAIEmbeddings

load_dotenv()

# ---------- Setup ----------
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

logging.basicConfig(level=logging.INFO)


def get_db():
    """Always return a fresh DB connection."""
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
    return OpenAIEmbeddings(model="text-embedding-3-small", openai_api_key=OPENAI_API_KEY)


def search_tidb(query: str, top_k: int = 3, row_limit: int = 2000):
    """Return top_k chunk texts using cosine similarity in Python."""
    try:
        emb = get_embeddings()
        q_emb = emb.embed_query(query)
        q = np.array(q_emb, dtype=np.float32)

        conn = get_db()
        try:
            conn.ping(reconnect=True)
            with conn.cursor() as cursor:
                cursor.execute(
                    f"SELECT id, content, embedding FROM rag_chunks LIMIT {row_limit};"
                )
                rows = cursor.fetchall()
        finally:
            conn.close()

        scored = []
        for r_id, r_text, r_emb_bytes in rows:
            try:
                r = np.frombuffer(r_emb_bytes, dtype=np.float32)
                denom = (np.linalg.norm(q) * np.linalg.norm(r))
                score = float(np.dot(q, r) / denom) if denom else 0.0
                scored.append((score, r_text))
            except Exception as e:
                logging.error(f"Error decoding row {r_id}: {e}")

        scored.sort(key=lambda x: x[0], reverse=True)
        return [text for _, text in scored[:top_k]]

    except Exception as e:
        logging.error(f"❌ DB Search failed: {e}")
        return []


def ask_rag(user_question: str) -> str:
    """Use retrieved context + OpenAI to answer."""
    try:
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

    except Exception as e:
        logging.error(f"❌ OpenAI request failed: {e}")
        return "⚠️ Error running RAG pipeline."