from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

from agents.greeting_agent import run_greeting_agent
from agents.mood_agent import run_mood_agent
from agents.cgm_agent import run_cgm_agent
from agents.food_agent import run_food_agent
from agents.meal_planner_agent import run_meal_planner_agent
from agents.interrupt_agent import run_interrupt_agent
from db.database import get_all_users, get_recent_cgm, get_recent_mood, get_recent_food
# uvicorn main:app --reload --port 8080
app = FastAPI(
    title="Healthcare MultiAgent API",
    description="Personalized healthcare assistant with 6 AI agents",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Request Models ────────────────────────────────────────────────────────────

class MoodRequest(BaseModel):
    user_id: int = Field(..., gt=0, le=100, example=1)
    mood: str = Field(..., example="happy")

class CGMRequest(BaseModel):
    user_id: int = Field(..., gt=0, le=100, example=1)
    glucose: float = Field(..., ge=80, le=300, example=145.0)

class FoodRequest(BaseModel):
    user_id: int = Field(..., gt=0, le=100, example=1)
    meal: str = Field(..., min_length=2, example="Idli with sambar and coconut chutney")
    timestamp: Optional[str] = Field(None, example="2024-01-15 08:30:00")

class InterruptRequest(BaseModel):
    query: str = Field(..., min_length=2, example="What is hypertension?")
    current_flow: Optional[str] = Field("main", example="cgm")


# ─── Health Check ──────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def root():
    return {
        "status": "running",
        "message": "Healthcare MultiAgent API is live 🚀",
        "docs": "/docs",
    }

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}


# ─── Agent Routes ──────────────────────────────────────────────────────────────

@app.get("/greet/{user_id}", tags=["Agents"])
def greet(user_id: int):
    """Greeting Agent — validates user ID and returns a personalised greeting."""
    if user_id < 1 or user_id > 100:
        raise HTTPException(status_code=400, detail="user_id must be between 1 and 100")
    return run_greeting_agent(user_id)


@app.post("/mood", tags=["Agents"])
def log_mood(req: MoodRequest):
    """Mood Tracker Agent — logs mood and returns 7-day rolling average."""
    return run_mood_agent(req.user_id, req.mood)


@app.post("/cgm", tags=["Agents"])
def log_cgm(req: CGMRequest):
    """CGM Agent — logs glucose reading, validates range, and raises alerts."""
    return run_cgm_agent(req.user_id, req.glucose)


@app.post("/food", tags=["Agents"])
def log_food(req: FoodRequest):
    """Food Intake Agent — logs meal and returns LLM macro analysis."""
    return run_food_agent(req.user_id, req.meal, req.timestamp)


@app.get("/meal-plan/{user_id}", tags=["Agents"])
def meal_plan(user_id: int):
    """Meal Planner Agent — generates adaptive 3-meal plan based on user profile + latest CGM/mood."""
    if user_id < 1 or user_id > 100:
        raise HTTPException(status_code=400, detail="user_id must be between 1 and 100")
    return run_meal_planner_agent(user_id)


@app.post("/interrupt", tags=["Agents"])
def interrupt(req: InterruptRequest):
    """Interrupt Agent — answers any general question and routes user back to their flow."""
    return run_interrupt_agent(req.query, req.current_flow)


# ─── Data / Dashboard Routes ───────────────────────────────────────────────────

@app.get("/users", tags=["Data"])
def list_users():
    """Returns all 100 users (id, name, city) for frontend dropdown."""
    return {"users": get_all_users()}


@app.get("/history/cgm/{user_id}", tags=["Data"])
def cgm_history(user_id: int, limit: int = 7):
    """Returns recent CGM readings for chart rendering."""
    return {"user_id": user_id, "cgm_history": get_recent_cgm(user_id, limit)}


@app.get("/history/mood/{user_id}", tags=["Data"])
def mood_history(user_id: int, limit: int = 7):
    """Returns recent mood logs for chart rendering."""
    return {"user_id": user_id, "mood_history": get_recent_mood(user_id, limit)}


@app.get("/history/food/{user_id}", tags=["Data"])
def food_history(user_id: int, limit: int = 10):
    """Returns recent food logs."""
    return {"user_id": user_id, "food_history": get_recent_food(user_id, limit)}
