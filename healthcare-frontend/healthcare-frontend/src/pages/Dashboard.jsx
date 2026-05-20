import React from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";

const MOOD_SCORE = {
  happy: 5, excited: 5, calm: 4, neutral: 3,
  tired: 2, sad: 1, anxious: 2, angry: 1,
};

const MOOD_COLOR = {
  happy: "#4caf82", excited: "#0fd4b4", calm: "#6ec6f5",
  neutral: "#6a8a9e", tired: "#f5a623", sad: "#e05c5c",
  anxious: "#f5a623", angry: "#e05c5c",
};

function glucoseColor(g) {
  if (g < 100) return "#f5a623";
  if (g <= 140) return "#4caf82";
  if (g <= 180) return "#f5a623";
  return "#e05c5c";
}

export default function Dashboard({ user, cgmHistory, moodHistory, onGreet, userId, setUserId, loading }) {
  if (!user) {
    return (
      <div className="welcome-screen">
        <div className="welcome-title">
          Your personal<br /><em>health pulse</em>
        </div>
        <p className="welcome-sub">
          Enter your patient ID to access your personalised health dashboard, AI meal plans, and real-time glucose tracking.
        </p>
        <div className="user-select-row">
          <input
            className="form-input"
            type="number"
            min={1} max={100}
            placeholder="Enter User ID (1–100)"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            onKeyDown={e => e.key === "Enter" && onGreet(userId)}
          />
          <button
            className="btn btn-primary"
            onClick={() => onGreet(userId)}
            disabled={loading || !userId}
          >
            {loading ? <span className="spinner" /> : "Go →"}
          </button>
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Try IDs 1 through 100</p>
      </div>
    );
  }

  const latestCGM  = cgmHistory.length ? cgmHistory[cgmHistory.length - 1].glucose : null;
  const latestMood = moodHistory.length ? moodHistory[moodHistory.length - 1].mood : null;

  const cgmData = cgmHistory.map((r, i) => ({
    name: `Day ${i + 1}`,
    glucose: r.glucose,
  }));

  const moodData = moodHistory.map((r, i) => ({
    name: `D${i + 1}`,
    score: MOOD_SCORE[r.mood] ?? 3,
    mood: r.mood,
    fill: MOOD_COLOR[r.mood] ?? "#6a8a9e",
  }));

  return (
    <>
      {/* Stat tiles */}
      <div className="grid-3">
        <div className={`stat-tile ${latestCGM > 180 ? "red" : latestCGM < 100 ? "amber" : "green"}`}>
          <div className="stat-label">Latest Glucose</div>
          <div className="stat-value">{latestCGM ?? "—"}</div>
          <div className="stat-sub">mg/dL</div>
        </div>
        <div className="stat-tile teal">
          <div className="stat-label">Current Mood</div>
          <div className="stat-value" style={{ fontSize: "1.4rem", paddingTop: 4 }}>
            {latestMood ?? "—"}
          </div>
          <div className="stat-sub">Latest session</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Dietary Type</div>
          <div className="stat-value" style={{ fontSize: "1.1rem", paddingTop: 6 }}>
            {user.dietary_preference}
          </div>
          <div className="stat-sub">{user.city}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2">
        <div className="card">
          <div className="card-title"><span className="icon">◈</span> Glucose — 7 Days</div>
          {cgmData.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: "0.83rem" }}>No CGM data yet. Log a reading.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={cgmData}>
                <CartesianGrid stroke="#1e2f3e" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: "#6a8a9e", fontSize: 11 }} />
                <YAxis domain={[60, 320]} tick={{ fill: "#6a8a9e", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "#111920", border: "1px solid #1e2f3e", borderRadius: 8 }}
                  labelStyle={{ color: "#e8f0f5" }}
                  itemStyle={{ color: "#0fd4b4" }}
                />
                <ReferenceLine y={180} stroke="#e05c5c" strokeDasharray="4 4" label={{ value: "High", fill: "#e05c5c", fontSize: 10 }} />
                <ReferenceLine y={100} stroke="#f5a623" strokeDasharray="4 4" label={{ value: "Low", fill: "#f5a623", fontSize: 10 }} />
                <Line type="monotone" dataKey="glucose" stroke="#0fd4b4" strokeWidth={2} dot={{ fill: "#0fd4b4", r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <div className="card-title"><span className="icon">◎</span> Mood Score — 7 Days</div>
          {moodData.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: "0.83rem" }}>No mood data yet. Log your mood.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={moodData}>
                <CartesianGrid stroke="#1e2f3e" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: "#6a8a9e", fontSize: 11 }} />
                <YAxis domain={[0, 5]} tick={{ fill: "#6a8a9e", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "#111920", border: "1px solid #1e2f3e", borderRadius: 8 }}
                  labelStyle={{ color: "#e8f0f5" }}
                  formatter={(v, _, props) => [props.payload.mood, "Mood"]}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {moodData.map((entry, i) => (
                    <rect key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Conditions */}
      <div className="card">
        <div className="card-title"><span className="icon">◉</span> Medical Profile</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {user.medical_conditions.split(", ").map(c => (
            <span key={c} className="tag tag-amber">{c}</span>
          ))}
          {user.physical_limitations !== "None" && (
            <span className="tag tag-red">{user.physical_limitations}</span>
          )}
        </div>
      </div>
    </>
  );
}
