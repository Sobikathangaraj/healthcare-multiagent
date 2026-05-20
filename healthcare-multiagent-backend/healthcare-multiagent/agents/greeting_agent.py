from db.database import get_user_by_id


def run_greeting_agent(user_id: int) -> dict:
    user = get_user_by_id(user_id)
    if not user:
        return {
            "success": False,
            "message": f"❌ User ID {user_id} not found. Please enter a valid ID between 1 and 100.",
        }
    return {
        "success": True,
        "message": (
            f"👋 Hello, {user['first_name']} {user['last_name']} from {user['city']}! "
            f"Welcome to your personal health assistant. How are you feeling today?"
        ),
        "user": {
            "id": user["id"],
            "name": f"{user['first_name']} {user['last_name']}",
            "city": user["city"],
            "dietary_preference": user["dietary_preference"],
            "medical_conditions": user["medical_conditions"],
            "physical_limitations": user["physical_limitations"],
        },
    }
