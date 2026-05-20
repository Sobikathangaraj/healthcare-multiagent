import os
from groq import Groq
from db.database import get_user_by_id, get_recent_cgm, get_recent_mood
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def run_meal_planner_agent(user_id: int) -> dict:
    user = get_user_by_id(user_id)
    if not user:
        return {"success": False, "message": "❌ User not found."}

    cgm_history  = get_recent_cgm(user_id, limit=3)
    mood_history = get_recent_mood(user_id, limit=3)

    latest_glucose = cgm_history[0]["glucose"]  if cgm_history  else "unknown"
    latest_mood    = mood_history[0]["mood"]     if mood_history else "unknown"

    if latest_glucose != "unknown":
        g = float(latest_glucose)
        if g > 180:
            glucose_context = f"Glucose is HIGH ({g} mg/dL) — prioritize low-glycemic foods."
        elif g < 100:
            glucose_context = f"Glucose is LOW ({g} mg/dL) — include complex carbs."
        else:
            glucose_context = f"Glucose is NORMAL ({g} mg/dL) — maintain balanced macros."
    else:
        glucose_context = "Glucose unknown — provide a balanced meal plan."

    prompt = f"""You are a certified clinical dietitian creating a personalized meal plan.

Patient Profile:
- Name: {user['first_name']} {user['last_name']}
- Dietary Preference: {user['dietary_preference']} ← STRICTLY follow this
- Medical Conditions: {user['medical_conditions']}
- Physical Limitations: {user['physical_limitations']}
- Current Mood: {latest_mood}
- Glucose Status: {glucose_context}

Generate the next 3 meals (Breakfast, Lunch, Dinner).
- Respect dietary preference strictly.
- Account for medical conditions.
- Keep meals practical and Indian cuisine friendly.

Use EXACTLY this format:
🍳 Breakfast: [meal name]
   → Carbs: Xg | Protein: Xg | Fat: Xg | ~X kcal

🍱 Lunch: [meal name]
   → Carbs: Xg | Protein: Xg | Fat: Xg | ~X kcal

🍛 Dinner: [meal name]
   → Carbs: Xg | Protein: Xg | Fat: Xg | ~X kcal

💡 Tip: [one personalized health tip]"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=600,
            messages=[{"role": "user", "content": prompt}]
        )
        plan = response.choices[0].message.content.strip()
    except Exception as e:
        plan = f"Meal plan generation failed: {str(e)}"

    return {
        "success": True,
        "meal_plan": plan,
        "based_on": {
            "glucose": latest_glucose,
            "mood": latest_mood,
            "dietary_preference": user["dietary_preference"],
            "medical_conditions": user["medical_conditions"],
        },
    }