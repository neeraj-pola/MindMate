from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# 👇 import ask_rag from main.py
from main import ask_rag  

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- MODELS -----------------
class AssessmentRequest(BaseModel):
    questionnaire: str
    responses: List[int]

class AssessmentResult(BaseModel):
    total_score: int
    severity: str
    interpretation: str

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str

# ----------------- LOGIC -----------------
def interpret_gad7(score: int):
    if score <= 4:
        return "Minimal Anxiety", "Little or no symptoms."
    elif score <= 9:
        return "Mild Anxiety", "Monitor; may not require treatment."
    elif score <= 14:
        return "Moderate Anxiety", "Further evaluation recommended."
    else:
        return "Severe Anxiety", "Active treatment likely warranted."

def interpret_phq9(score: int):
    if score <= 4:
        return "Minimal Depression", "Little or no depressive symptoms."
    elif score <= 9:
        return "Mild Depression", "Watchful waiting; may not need treatment."
    elif score <= 14:
        return "Moderate Depression", "Treatment plan may be considered."
    elif score <= 19:
        return "Moderately Severe Depression", "Active treatment warranted."
    else:
        return "Severe Depression", "Immediate and intensive treatment recommended."

# ----------------- ENDPOINTS -----------------
@app.post("/assess", response_model=AssessmentResult)
async def assess(data: AssessmentRequest):
    total_score = sum(data.responses)

    if data.questionnaire.upper() == "GAD-7":
        severity, interpretation = interpret_gad7(total_score)
    elif data.questionnaire.upper() == "PHQ-9":
        severity, interpretation = interpret_phq9(total_score)
    else:
        severity, interpretation = "Unknown", "Invalid questionnaire type."

    return {
        "total_score": total_score,
        "severity": severity,
        "interpretation": interpretation,
    }

@app.post("/rag", response_model=ChatResponse)
async def rag_chat(data: ChatRequest):
    try:
        # 👉 Connects to TiDB + LLM
        answer = ask_rag(data.question)
        return {"answer": answer}
    except Exception as e:
        print("RAG error:", e)
        return {"answer": "⚠️ Error running RAG pipeline."}

@app.get("/")
def root():
    return {"message": "Assessment + Chat API running. Use /assess and /rag"}
