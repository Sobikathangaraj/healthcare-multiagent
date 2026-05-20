import React, { useState, useRef, useEffect } from "react";

export default function ChatPanel({ messages, loading, onSend }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <span>◈</span> AI Assistant
        <span style={{ marginLeft: "auto", fontSize: "0.72rem", color: "var(--muted)" }}>
          Ask anything
        </span>
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="msg assistant">
            <span className="loading-dot">●</span>
            <span className="loading-dot" style={{ animationDelay: "0.2s" }}>●</span>
            <span className="loading-dot" style={{ animationDelay: "0.4s" }}>●</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <textarea
          className="chat-input"
          rows={2}
          placeholder="Ask a health question…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
        />
        <button className="btn btn-primary" onClick={send} disabled={loading || !input.trim()}>
          ↑
        </button>
      </div>
    </div>
  );
}
