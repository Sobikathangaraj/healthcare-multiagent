import React from "react";

const NAV = [
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: "mood",      icon: "◎", label: "Mood Tracker" },
  { id: "cgm",       icon: "◈", label: "CGM Monitor" },
  { id: "food",      icon: "◉", label: "Food Intake" },
  { id: "meal",      icon: "◍", label: "Meal Planner" },
];

export default function Sidebar({ activeTab, setActiveTab, user }) {
  return (
    <aside className="sidebar">
      <div className="nav-section">Navigation</div>
      {NAV.map(item => (
        <div
          key={item.id}
          className={`nav-item${activeTab === item.id ? " active" : ""}`}
          onClick={() => setActiveTab(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          {item.label}
        </div>
      ))}

      {user && (
        <>
          <div className="divider" style={{ margin: "16px 0 8px" }} />
          <div className="nav-section">Patient</div>
          <div style={{ padding: "8px 12px", fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.7 }}>
            <div style={{ color: "var(--text)", fontWeight: 600, marginBottom: 4 }}>{user.name}</div>
            <div>📍 {user.city}</div>
            <div style={{ marginTop: 6 }}>
              <span className="tag tag-teal">{user.dietary_preference}</span>
            </div>
            <div style={{ marginTop: 6, fontSize: "0.75rem" }}>{user.medical_conditions}</div>
          </div>
        </>
      )}
    </aside>
  );
}
