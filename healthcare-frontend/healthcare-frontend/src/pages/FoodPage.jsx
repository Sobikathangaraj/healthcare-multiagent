import React, { useState } from "react";

const QUICK = [
  "Idli with sambar", "Dosa with coconut chutney", "Poha",
  "Dal rice", "Chapati with sabzi", "Upma",
  "Curd rice", "Vegetable pulao", "Rajma rice",
];

export default function FoodPage({ user, onLog, loading }) {
  const [meal, setMeal]   = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!meal.trim()) return;
    const res = await onLog(meal);
    setResult(res);
    setMeal("");
  };

  if (!user) return <div className="alert alert-info">Please login from the Dashboard first.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="card">
        <div className="card-title"><span className="icon">◉</span> Log Food Intake</div>

        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Describe your meal</label>
          <textarea
            className="form-textarea"
            placeholder="e.g. 2 idlis with sambar and coconut chutney, glass of milk"
            value={meal}
            onChange={e => setMeal(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div className="form-label" style={{ marginBottom: 8 }}>Quick picks</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {QUICK.map(q => (
              <button
                key={q}
                className="btn btn-ghost"
                style={{ fontSize: "0.78rem", padding: "5px 11px" }}
                onClick={() => setMeal(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !meal.trim()}>
          {loading ? <span className="spinner" /> : "Log & Analyse"}
        </button>
      </div>

      {result && (
        <div className="card">
          <div className="card-title"><span className="icon">◍</span> Macro Analysis</div>
          <div className="alert alert-info" style={{ whiteSpace: "pre-line" }}>
            {result.analysis}
          </div>
        </div>
      )}
    </div>
  );
}
