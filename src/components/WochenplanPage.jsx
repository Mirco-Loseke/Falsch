import React, { useState } from 'react';
import { s } from '../constants/styles';
import { IC } from '../constants/icons';
import { FULL_WEEKDAYS } from '../data/defaults';

const WochenplanPage = ({ data, weekPlans, setWeekPlans, notify, isMobile }) => {
  const [modal, setModal] = useState(false);
  const [selDay, setSelDay] = useState("");
  const [selTask, setSelTask] = useState("");

  const openAdd = (day) => { setSelDay(day); setSelTask(""); setModal(true); };

  const save = () => {
    if (!selTask) return;
    const next = { ...weekPlans, [selDay]: [...(weekPlans[selDay] || []), { id: Math.random().toString(36).substring(2, 9), text: selTask, done: false }] };
    setWeekPlans(next); setModal(false); notify("Aufgabe hinzugefügt!");
  };

  const toggle = (day, id) => {
    const next = { ...weekPlans, [day]: weekPlans[day].map(t => t.id === id ? { ...t, done: !t.done } : t) };
    setWeekPlans(next);
  };

  const remove = (day, id) => {
    const next = { ...weekPlans, [day]: weekPlans[day].filter(t => t.id !== id) };
    setWeekPlans(next);
  };

  return (
    <div style={s.page}>
      <h1 style={s.pageTitle}>Dein Wochenplan</h1>
      <p style={{ ...s.pageSub, marginBottom: 28 }}>Plane deine Woche für maximalen Erfolg</p>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {FULL_WEEKDAYS.map(d => (
          <div key={d} style={s.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#FF6B35", fontFamily: "'Syne', sans-serif" }}>{d}</div>
              <button style={s.iconBtnS} onClick={() => openAdd(d)}>{IC.plus}</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.plans.find(p => p.days.includes(d)) && <div style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: 8, padding: "8px 12px", fontSize: 12, fontWeight: 700, color: "#FF6B35" }}>🔥 Training: {data.plans.find(p => p.days.includes(d)).name}</div>}
              {weekPlans[d]?.map(t => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "#0D0D0F", border: "1px solid #1E1E24", borderRadius: 8, padding: "8px 12px", opacity: t.done ? 0.4 : 1 }}>
                  <div onClick={() => toggle(d, t.id)} style={{ width: 18, height: 18, borderRadius: 4, background: t.done ? "#06D6A0" : "#1A1A1F", border: "1px solid #2A2A30", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#000" }}>{t.done && IC.check}</div>
                  <div style={{ flex: 1, fontSize: 13, textDecoration: t.done ? "line-through" : "none" }}>{t.text}</div>
                  <button style={{ ...s.iconBtnS, color: "#EF476F" }} onClick={() => remove(d, t.id)}>{IC.trash}</button>
                </div>
              ))}
              {!weekPlans[d]?.length && !data.plans.find(p => p.days.includes(d)) && <div style={{ fontSize: 11, color: "#444", fontStyle: "italic", textAlign: "center", padding: "10px 0" }}>Keine Termine für diesen Tag...</div>}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={s.overlay2} onClick={() => setModal(false)}>
          <div style={{ ...s.modal, maxWidth: 360 }} onClick={ev => ev.stopPropagation()}>
            <h2 style={s.modalTitle}>{selDay}: Neue Aufgabe</h2>
            <div style={s.fg}><label style={s.lbl}>Was hast du vor?</label><input style={s.inp} value={selTask} onChange={v => setSelTask(v.target.value)} placeholder="z.B. Meal Prep, Laufen..." autoFocus /></div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}><button style={{ ...s.secBtn, flex: 1 }} onClick={() => setModal(false)}>Abbrechen</button><button style={{ ...s.primaryBtn, flex: 1, justifyContent: "center" }} onClick={save}>Hinzufügen</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WochenplanPage;
