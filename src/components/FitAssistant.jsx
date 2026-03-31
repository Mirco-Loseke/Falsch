import React, { useState, useRef, useEffect } from 'react';
import { s } from '../constants/styles';
import { IC } from '../constants/icons';
import { FitAssistantService } from '../services/ai';

const FitAssistant = ({ data, user, prs, onClose, isMobile }) => {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hallo! Ich bin dein FitForge Assistent. Wie kann ich dir heute bei deinem Training oder deiner Ernährung helfen?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const q = input; setInput(""); setLoading(true);
    setMessages(prev => [...prev, { role: "user", text: q }]);

    const context = {
      user: { name: user.firstName, goal: user.goal, weight: user.weight },
      recentWorkouts: data.workouts.slice(0, 3),
      prs: Object.values(prs)
    };

    const reply = await FitAssistantService.ask(q, context);
    setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    setLoading(false);
  };

  return (
    <div style={{ ...s.modal, maxWidth: isMobile ? "95%" : 450, height: isMobile ? "80vh" : "600px", display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }} className="dropIn">
      <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1E1E24", background: "#161618" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ color: "#FF6B35" }}>{IC.sparkles}</div>
          <div style={{ fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>FitAssistant AI</div>
        </div>
        <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer" }}>{IC.x}</button>
      </div>
      
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14, background: "#0D0D0F" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%", background: m.role === "user" ? "#FF6B35" : "#1A1A1F", border: m.role === "user" ? "none" : "1px solid #2A2A30", borderRadius: 14, padding: "10px 14px", color: m.role === "user" ? "#fff" : "#eee", fontSize: 13, lineHeight: 1.5, wordBreak: "break-word" }}>
            {m.text}
          </div>
        ))}
        {loading && <div style={{ alignSelf: "flex-start", padding: "10px 14px", background: "#1A1A1F", borderRadius: 14, fontSize: 12, color: "#666" }}>Schreibt...</div>}
      </div>

      <div style={{ padding: 16, background: "#161618", borderTop: "1px solid #1E1E24", display: "flex", gap: 10 }}>
        <input style={{ ...s.inp, border: "1px solid #2A2A30" }} value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === "Enter" && send()} placeholder="Frage mich nach Plänen, Tipps..." disabled={loading} />
        <button onClick={send} style={{ ...s.primaryBtn, width: 44, height: 44, padding: 0, justifyContent: "center" }} disabled={loading}>{loading ? "..." : "→"}</button>
      </div>
    </div>
  );
};

export default FitAssistant;
