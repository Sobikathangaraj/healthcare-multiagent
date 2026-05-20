import React, { useState } from "react";

export default function CGMPage({ user, onLog, loading, cgmHistory }) {
  const [glucose, setGlucose] = useState("");
  const [result, setResult]   = useState(null);

  const handleSubmit = async () => {
    const g = parseFloat(glucose);
    if (isNaN(g)) return;
    const res = await onLog(g);
    setResult(res);
    setGlucose("");
  };

  if (!user) return <div className="alert alert-info">Please login from the Dashboard first.</div>;

  function alertClass(g) {
    if (g < 100) return "alert-warn";
    if (g <= 140) return "alert-success";
    if (g <= 180) return "alert-warn";
    return "alert-error";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="card">
        <div className="card-title"><span className="icon">◈</span> Log Glucose Reading</div>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Glucose (mg/dL) — valid range 80–300</label>
            <input
              className="form-input"
              type="number"
              min={80} max={300} step={0.1}
              placeholder="e.g. 145"
              value={glucose}
              onChange={e => setGlucose(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !glucose}>
            {loading ? <span className="spinner" /> : "Log"}
          </button>
        </div>
      </div>

      {result && (
        <div className={`alert ${alertClass(result.glucose)}`}>{result.message}</div>
      )}

      {cgmHistory.length > 0 && (
        <div className="card">
          <div className="card-title"><span className="icon">◉</span> Recent Readings</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                <th style={{ textAlign: "left", padding: "6px 0" }}>#</th>
                <th style={{ textAlign: "left", padding: "6px 0" }}>Glucose</th>
                <th style={{ textAlign: "left", padding: "6px 0" }}>Status</th>
                <th style={{ textAlign: "left", padding: "6px 0" }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {[...cgmHistory].reverse().slice(0, 7).map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "8px 0", color: "var(--muted)" }}>{i + 1}</td>
                  <td style={{ padding: "8px 0", fontWeight: 600 }}>{r.glucose} mg/dL</td>
                  <td style={{ padding: "8px 0" }}>
                    <span className={`tag ${r.glucose > 180 ? "tag-red" : r.glucose < 100 ? "tag-amber" : "tag-teal"}`}>
                      {r.glucose > 180 ? "High" : r.glucose < 100 ? "Low" : "Normal"}
                    </span>
                  </td>
                  <td style={{ padding: "8px 0", color: "var(--muted)", fontSize: "0.78rem" }}>{r.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
