import os
from groq import Groq
from db.database import log_food, get_recent_food
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def run_food_agent(user_id: int, meal: str, timestamp: str = None) -> dict:
    if not meal.strip():
        return {"success": False, "message": "❌ Meal description cannot be empty."}

    log_food(user_id, meal, timestamp)

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=300,
            messages=[{
                "role": "user",
                "content": (
                    f"Analyze this meal and give estimated macros:\n"
                    f"Meal: {meal}\n\n"
                    "Reply ONLY in this exact format (no extra text):\n"
                    "Carbs: Xg | Protein: Xg | Fat: Xg | Calories: X kcal\n"
                    "Health note: <one short sentence>"
                )
            }]
        )
        analysis = response.choices[0].message.content.strip()
    except Exception as e:
        analysis = f"Analysis unavailable: {str(e)}"

    recent = get_recent_food(user_id, limit=5)
    return {
        "success": True,
        "message": f"✅ Meal logged: '{meal}'",
        "analysis": analysis,
        "recent_meals": recent,
    }