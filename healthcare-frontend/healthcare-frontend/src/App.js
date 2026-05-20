import React from "react";
import { Toaster } from "react-hot-toast";
import "./index.css";

import { useAgent } from "./hooks/useAgent";
import Sidebar    from "./components/Sidebar";
import ChatPanel  from "./components/ChatPanel";
import Dashboard  from "./pages/Dashboard";
import MoodPage   from "./pages/MoodPage";
import CGMPage    from "./pages/CGMPage";
import FoodPage   from "./pages/FoodPage";
import MealPage   from "./pages/MealPage";

const PAGE = {
  dashboard: Dashboard,
  mood:      MoodPage,
  cgm:       CGMPage,
  food:      FoodPage,
  meal:      MealPage,
};

export default function App() {
  const agent = useAgent();
  const ActivePage = PAGE[agent.activeTab] || Dashboard;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111920",
            color: "#e8f0f5",
            border: "1px solid #1e2f3e",
            fontFamily: "var(--font-body)",
            fontSize: "0.84rem",
          },
        }}
      />

      <div className="app-shell">
        {/* Topbar */}
        <header className="topbar">
          <span className="topbar-logo">Health<span>Pulse</span></span>
          <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
            AI-Powered Healthcare Assistant
          </span>
          <div className="topbar-user">
            {agent.user ? (
              <div className="user-badge">
                Logged in as <strong>{agent.user.name}</strong> · ID {agent.user.id}
              </div>
            ) : (
              <div className="user-badge">Not logged in</div>
            )}
          </div>
        </header>

        {/* Sidebar */}
        <Sidebar
          activeTab={agent.activeTab}
          setActiveTab={agent.setActiveTab}
          user={agent.user}
        />

        {/* Main content */}
        <main className="main-content">
          <ActivePage
            user={agent.user}
            userId={agent.userId}
            setUserId={agent.setUserId}
            loading={agent.loading}
            cgmHistory={agent.cgmHistory}
            moodHistory={agent.moodHistory}
            onGreet={agent.handleGreet}
            onLog={
              agent.activeTab === "mood" ? agent.handleMood :
              agent.activeTab === "cgm"  ? agent.handleCGM  :
              agent.activeTab === "food" ? agent.handleFood : null
            }
            onGenerate={agent.handleMealPlan}
          />
        </main>

        {/* Chat panel */}
        <ChatPanel
          messages={agent.chatMessages}
          loading={agent.loading}
          onSend={agent.handleInterrupt}
        />
      </div>
    </>
  );
}
