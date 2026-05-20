import React, { useState } from "react";

const MOODS = [
  { label: "happy",   emoji: "😊" },
  { label: "excited", emoji: "🤩" },
  { label: "calm",    emoji: "😌" },
  { label: "neutral", emoji: "😐" },
  { label: "tired",   emoji: "😴" },
  { label: "sad",     emoji: "😢" },
  { label: "anxious", emoji: "😟" },
  { label: "angry",   emoji: "😠" },
];

export default function MoodPage({ user, onLog, loading }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!selected) return;
    const res = await onLog(selected);
    setResult(res);
  };

  if (!user) return <NoUser />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="card">
        <div className="card-title"><span className="icon">◎</span> How are you feeling?</div>
        <div className="mood-chips" style={{ marginBottom: 20 }}>
          {MOODS.map(m => (
            <div
              key={m.label}
              className={`mood-chip${selected === m.label ? " selected" : ""}`}
              onClick={() => setSelected(m.label)}
            >
              {m.emoji} {m.label}
            </div>
          ))}
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading || !selected}
        >
          {loading ? <span className="spinner" /> : "Log Mood"}
        </button>
      </div>

      {result && (
        <div className="alert alert-success">{result.message}</div>
      )}
    </div>
  );
}

function NoUser() {
  return <div className="alert alert-info">Please login from the Dashboard first.</div>;
}
