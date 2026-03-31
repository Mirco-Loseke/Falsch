import React, { useState } from 'react';
import { s } from '../constants/styles';
import { IC } from '../constants/icons';
import { fmtDate } from '../utils/helpers';

const History = ({ data, setData, notify, isMobile }) => {
  const [sel, setSel] = useState(null);

  const del = (id) => {
    if (confirm("Diesem Workout wirklich löschen?")) {
      setData(d => ({ ...d, workouts: d.workouts.filter(w => w.id !== id) }));
      notify("Gelöscht", "info"); setSel(null);
    }
  };

  if (sel) {
    return (
      <div style={s.page}>
        <button style={s.backBtn} onClick={() => setSel(null)}>{IC.chevLeft} Zurück</button>
        <div style={s.wDetail} className="statCard">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h1 style={{ ...s.pageTitle, fontSize: 24 }}>{sel.name}</h1>
              <p style={s.pageSub}>{fmtDate(sel.date)} · {sel.duration} Min</p>
            </div>
            <button style={s.cardIconBtn} onClick={() => del(sel.id)}>{IC.trash}</button>
          </div>
          {sel.note && <div style={{ background: "#0D0D0F", border: "1px solid #1E1E24", borderRadius: 12, padding: 14, marginBottom: 20, color: "#aaa", fontStyle: "italic" }}>„{sel.note}"</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sel.exercises.map((ex, i) => (
              <div key={i} style={{ borderBottom: "1px solid #1A1A1F", paddingBottom: 12 }}>
                <div style={{ fontWeight: 700, marginBottom: 8, color: "#FF6B35" }}>{ex.name}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {ex.sets.map((s, si) => <div key={si} style={{ background: "#1A1A1F", borderRadius: 6, padding: "4px 10px", fontSize: 13 }}><span style={{ color: "#666" }}>S{si + 1}:</span> {s.weight}kg x {s.reps}</div>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <h1 style={s.pageTitle}>Trainingsverlauf</h1>
      <p style={{ ...s.pageSub, marginBottom: 24 }}>Alle deine vergangenen Sessions</p>
      <div style={{ display: "grid", gap: 12 }}>
        {data.workouts.map(w => (
          <div key={w.id} style={s.histCard} className="histCard" onClick={() => setSel(w)}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#1A1A1F", border: "1px solid #2A2A30", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF6B35" }}>{IC.dumbbell}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{w.name}</div>
              <div style={{ fontSize: 13, color: "#666" }}>{fmtDate(w.date)} · {w.duration} Min · {w.exercises.length} Übungen</div>
            </div>
            <div style={{ color: "#444" }}>{IC.chevRight}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
