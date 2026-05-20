from db.database import log_cgm, get_recent_cgm


def run_cgm_agent(user_id: int, glucose: float) -> dict:
    if glucose < 80 or glucose > 300:
        return {
            "success": False,
            "message": (
                f"⚠️ Glucose value {glucose} mg/dL is outside the valid range (80–300 mg/dL). "
                "Please recheck your reading."
            ),
        }

    log_cgm(user_id, glucose)

    alert = None
    if glucose < 100:
        alert = "🟡 Low glucose warning! Consider eating a small snack (e.g., a banana or juice)."
    elif 100 <= glucose <= 140:
        alert = "🟢 Glucose is in the normal range. Keep it up!"
    elif 141 <= glucose <= 180:
        alert = "🟠 Slightly elevated. Monitor closely and avoid sugary snacks."
    else:
        alert = "🔴 High glucose alert! Avoid sugary foods, stay hydrated, and consult your doctor."

    history = get_recent_cgm(user_id, limit=7)

    return {
        "success": True,
        "message": f"✅ Glucose reading {glucose} mg/dL logged. {alert}",
        "glucose": glucose,
        "alert": alert,
        "history": history,
    }
