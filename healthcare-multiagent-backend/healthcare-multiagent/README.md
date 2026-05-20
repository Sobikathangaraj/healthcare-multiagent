# 🏥 Healthcare MultiAgent Backend

A FastAPI backend with 6 AI agents for personalized healthcare interactions.

---

## 📁 Project Structure

```
healthcare-multiagent/
├── data/
│   └── generate_data.py        # Creates SQLite DB with 100 synthetic users
├── agents/
│   ├── greeting_agent.py       # Validates user ID + personalised greeting
│   ├── mood_agent.py           # Logs mood + rolling average
│   ├── cgm_agent.py            # Logs glucose + alerts
│   ├── food_agent.py           # Logs meal + LLM macro analysis
│   ├── meal_planner_agent.py   # Generates adaptive 3-meal plan
│   └── interrupt_agent.py      # Answers any question mid-flow
├── db/
│   └── database.py             # SQLite helpers
├── main.py                     # FastAPI app + all routes
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## ⚙️ Local Setup (Without Docker)

### 1. Clone / unzip the project
```bash
cd healthcare-multiagent
```

### 2. Create virtual environment
```bash
pip install uv
uv venv
source .venv/bin/activate        # Mac/Linux
# .venv\Scripts\activate         # Windows
```

### 3. Install dependencies
```bash
uv pip install -r requirements.txt
```

### 4. Set up environment variables
```bash
cp .env.example .env
# Open .env and paste your Anthropic API key
```

### 5. Generate the database (run once)
```bash
python data/generate_data.py
```

### 6. Start the server
```bash
uvicorn main:app --reload --port 8000
```

### 7. Open Swagger UI
```
http://localhost:8000/docs
```

---

## 🐳 Docker Setup

### 1. Set up .env
```bash
cp .env.example .env
# Add your ANTHROPIC_API_KEY
```

### 2. Build and run
```bash
docker-compose up --build
```

### 3. Access API
```
http://localhost:8000/docs
```

---

## 🔌 API Endpoints

| Method | Endpoint | Agent | Description |
|--------|----------|-------|-------------|
| GET | `/greet/{user_id}` | Greeting Agent | Greet user by ID |
| POST | `/mood` | Mood Agent | Log mood |
| POST | `/cgm` | CGM Agent | Log glucose reading |
| POST | `/food` | Food Agent | Log meal + macro analysis |
| GET | `/meal-plan/{user_id}` | Meal Planner | Generate 3-meal plan |
| POST | `/interrupt` | Interrupt Agent | Answer any question |
| GET | `/users` | Data | List all 100 users |
| GET | `/history/cgm/{user_id}` | Data | CGM history for charts |
| GET | `/history/mood/{user_id}` | Data | Mood history for charts |
| GET | `/history/food/{user_id}` | Data | Food log history |

---

## 🧪 Sample Test Requests

```bash
# Greet user
curl http://localhost:8000/greet/1

# Log mood
curl -X POST http://localhost:8000/mood \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "mood": "happy"}'

# Log glucose
curl -X POST http://localhost:8000/cgm \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "glucose": 145}'

# Log food
curl -X POST http://localhost:8000/food \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "meal": "Idli with sambar and coconut chutney"}'

# Generate meal plan
curl http://localhost:8000/meal-plan/1

# Ask a general question (interrupt flow)
curl -X POST http://localhost:8000/interrupt \
  -H "Content-Type: application/json" \
  -d '{"query": "What is hypertension?", "current_flow": "cgm"}'
```
