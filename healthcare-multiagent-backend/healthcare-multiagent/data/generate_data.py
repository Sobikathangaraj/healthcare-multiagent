import sqlite3
import random
import os
from faker import Faker

fake = Faker("en_IN")

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "healthcare.db")

CITIES = ["Chennai", "Mumbai", "Hyderabad", "Bangalore", "Delhi", "Pune", "Coimbatore", "Kolkata", "Ahmedabad", "Jaipur"]
DIETARY = ["vegetarian", "non-vegetarian", "vegan"]
CONDITIONS = ["Type 2 Diabetes", "Hypertension", "Asthma", "Obesity", "High Cholesterol", "Hypothyroidism", "None"]
LIMITATIONS = ["None", "Mobility Issues", "Swallowing Difficulties", "Low Vision", "Hearing Impairment"]


def create_tables(conn):
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name  TEXT NOT NULL,
            city       TEXT NOT NULL,
            dietary_preference   TEXT NOT NULL,
            medical_conditions   TEXT NOT NULL,
            physical_limitations TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS mood_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id   INTEGER NOT NULL,
            mood      TEXT NOT NULL,
            timestamp TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS cgm_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id   INTEGER NOT NULL,
            glucose   REAL NOT NULL,
            timestamp TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS food_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id   INTEGER NOT NULL,
            meal      TEXT NOT NULL,
            timestamp TEXT NOT NULL
        );
    """)
    conn.commit()


def generate_users(conn):
    dietary_pool = DIETARY * 33 + DIETARY[:1]
    random.shuffle(dietary_pool)

    for i in range(100):
        dietary = dietary_pool[i]
        conditions = random.sample(CONDITIONS, k=random.randint(1, 3))
        if len(conditions) > 1 and "None" in conditions:
            conditions.remove("None")
        conn.execute(
            "INSERT INTO users (first_name, last_name, city, dietary_preference, medical_conditions, physical_limitations) VALUES (?,?,?,?,?,?)",
            (fake.first_name(), fake.last_name(), random.choice(CITIES), dietary, ", ".join(conditions), random.choice(LIMITATIONS)),
        )
    conn.commit()
    print("✅ 100 users inserted.")


def seed_sample_logs(conn):
    import datetime
    for user_id in range(1, 6):
        for day_offset in range(7):
            ts = (datetime.datetime.now() - datetime.timedelta(days=day_offset)).strftime("%Y-%m-%d %H:%M:%S")
            conn.execute("INSERT INTO cgm_logs (user_id, glucose, timestamp) VALUES (?,?,?)",
                         (user_id, round(random.uniform(85, 250), 1), ts))
            conn.execute("INSERT INTO mood_logs (user_id, mood, timestamp) VALUES (?,?,?)",
                         (user_id, random.choice(["happy","tired","calm","sad","excited","anxious","neutral"]), ts))
    conn.commit()
    print("✅ Sample logs seeded for users 1–5.")


if __name__ == "__main__":
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        print("🗑️ Old DB removed.")
    conn = sqlite3.connect(DB_PATH)
    create_tables(conn)
    generate_users(conn)
    seed_sample_logs(conn)
    conn.close()
    print("🎉 Database ready → healthcare.db")
