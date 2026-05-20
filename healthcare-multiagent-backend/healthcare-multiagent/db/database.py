import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "healthcare.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def get_user_by_id(user_id: int):
    conn = get_connection()
    row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


def log_mood(user_id: int, mood: str):
    conn = get_connection()
    conn.execute(
        "INSERT INTO mood_logs (user_id, mood, timestamp) VALUES (?, ?, datetime('now'))",
        (user_id, mood),
    )
    conn.commit()
    conn.close()


def log_cgm(user_id: int, glucose: float):
    conn = get_connection()
    conn.execute(
        "INSERT INTO cgm_logs (user_id, glucose, timestamp) VALUES (?, ?, datetime('now'))",
        (user_id, glucose),
    )
    conn.commit()
    conn.close()


def log_food(user_id: int, meal: str, timestamp: str = None):
    conn = get_connection()
    conn.execute(
        "INSERT INTO food_logs (user_id, meal, timestamp) VALUES (?, ?, COALESCE(?, datetime('now')))",
        (user_id, meal, timestamp),
    )
    conn.commit()
    conn.close()


def get_recent_cgm(user_id: int, limit: int = 7):
    conn = get_connection()
    rows = conn.execute(
        "SELECT glucose, timestamp FROM cgm_logs WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?",
        (user_id, limit),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_recent_mood(user_id: int, limit: int = 7):
    conn = get_connection()
    rows = conn.execute(
        "SELECT mood, timestamp FROM mood_logs WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?",
        (user_id, limit),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_recent_food(user_id: int, limit: int = 10):
    conn = get_connection()
    rows = conn.execute(
        "SELECT meal, timestamp FROM food_logs WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?",
        (user_id, limit),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_all_users():
    conn = get_connection()
    rows = conn.execute("SELECT id, first_name, last_name, city FROM users").fetchall()
    conn.close()
    return [dict(r) for r in rows]
