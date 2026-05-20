import React, { useState } from "react";

export default function MealPage({ user, onGenerate, loading }) {
  const [plan, setPlan]   = useState(null);
  const [meta, setMeta]   = useState(null);

  const handleGenerate = async () => {
    const res = await onGenerate();
    if (res) {
      setPlan(res.meal_plan);
      setMeta(res.based_on);
    }
  };

  if (!user) return <div className="alert alert-info">Please login from the Dashboard first.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="card">
        <div className="card-title"><span className="icon">◍</span> AI Meal Planner</div>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: 16, lineHeight: 1.7 }}>
          Generates a personalised 3-meal plan based on your dietary preference, medical conditions,
          and latest glucose reading.
        </p>

        {meta && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <span className="tag tag-teal">🍽 {meta.dietary_preference}</span>
            <span className="tag tag-amber">💉 Glucose: {meta.glucose} mg/dL</span>
            <span className="tag tag-teal">😊 Mood: {meta.mood}</span>
          </div>
        )}

        <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
          {loading ? <><span className="spinner" /> Generating…</> : "✦ Generate Meal Plan"}
        </button>
      </div>

      {plan && (
        <div className="card">
          <div className="card-title"><span className="icon">◈</span> Your Plan</div>
          {plan.split("\n").filter(l => l.trim()).map((line, i) => (
            <div key={i} className="meal-line">{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}
