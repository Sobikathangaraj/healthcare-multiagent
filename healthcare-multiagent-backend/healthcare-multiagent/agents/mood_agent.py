from db.database import log_mood, get_recent_mood

VALID_MOODS = ["happy", "sad", "excited", "tired", "anxious", "calm", "angry", "neutral"]
MOOD_SCORES = {
    "happy": 5, "excited": 5, "calm": 4, "neutral": 3,
    "tired": 2, "sad": 1, "anxious": 2, "angry": 1,
}


def run_mood_agent(user_id: int, mood: str) -> dict:
    mood = mood.lower().strip()
    if mood not in VALID_MOODS:
        return {
            "success": False,
            "message": f"❌ '{mood}' is not a valid mood. Choose from: {', '.join(VALID_MOODS)}",
        }

    log_mood(user_id, mood)
    recent = get_recent_mood(user_id, limit=7)
    scores = [MOOD_SCORES.get(r["mood"], 3) for r in recent]
    avg = round(sum(scores) / len(scores), 2) if scores else 3.0

    emoji_map = {"happy": "😊", "excited": "🤩", "calm": "😌", "neutral": "😐",
                 "tired": "😴", "sad": "😢", "anxious": "😟", "angry": "😠"}

    return {
        "success": True,
        "message": f"{emoji_map.get(mood,'😐')} Mood '{mood}' logged! Your 7-day average mood score is {avg}/5.",
        "mood": mood,
        "average_score": avg,
        "history": recent,
    }
