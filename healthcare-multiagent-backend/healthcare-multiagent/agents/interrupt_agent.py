import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

FLOW_LABELS = {
    "main": "Main Menu", "mood": "Mood Tracking",
    "cgm": "CGM Glucose Logging", "food": "Food Intake Logging",
    "meal_plan": "Meal Plan Generation", "greeting": "User Greeting",
}

def run_interrupt_agent(query: str, current_flow: str = "main") -> dict:
    if not query.strip():
        return {"success": False, "message": "❌ Query cannot be empty."}

    flow_label = FLOW_LABELS.get(current_flow, current_flow)

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=400,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a friendly healthcare assistant. "
                        "Answer clearly and briefly. "
                        "If the question needs a doctor, say so kindly."
                    )
                },
                {
                    "role": "user",
                    "content": (
                        f"The user is in the '{flow_label}' section and asked:\n\n"
                        f"{query}\n\n"
                        f"Answer helpfully. End with exactly:\n"
                        f"↩️ Returning you to: {flow_label}"
                    )
                }
            ]
        )
        answer = response.choices[0].message.content.strip()
    except Exception as e:
        answer = f"Sorry, couldn't process your question: {str(e)}"

    return {
        "success": True,
        "answer": answer,
        "return_to_flow": current_flow,
        "return_to_label": flow_label,
    }