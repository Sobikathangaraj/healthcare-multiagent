# HealthPulse — Frontend

React + Recharts healthcare dashboard connecting to the FastAPI backend.

## Setup

```bash
cd healthcare-frontend
npm install
npm start
```

Open http://localhost:3000

## Pages

| Page | Route (tab) | Description |
|------|-------------|-------------|
| Dashboard | dashboard | CGM line chart + mood bar chart + stat tiles |
| Mood Tracker | mood | Log mood with one click |
| CGM Monitor | cgm | Log glucose + reading history table |
| Food Intake | food | Log meals + AI macro analysis |
| Meal Planner | meal | Generate adaptive 3-meal plan |
| Chat Panel | (always visible) | Ask anything via Interrupt Agent |

## Requirements
- Backend must be running on http://localhost:8000
- Node 18+
