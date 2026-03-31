import React from 'react';
import { s } from '../constants/styles';
import { IC } from '../constants/icons';
import { DonutChart } from './Charts';

const GoalsPage = ({ user, data, prs, isMobile }) => {
  const totW = data.workouts.length;
  const totVol = data.workouts.reduce((acc, w) => acc + w.exercises.reduce((eAcc, e) => eAcc + e.sets.reduce((sAcc, s) => sAcc + (s.reps * s.weight), 0), 0), 0);
  
  return (
    <div style={s.page}>
      <h1 style={s.pageTitle}>Ziele & Meilensteine</h1>
      <p style={{ ...s.pageSub, marginBottom: 28 }}>Dein Weg zum Fitness-Ziel</p>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20, marginBottom: 28 }}>
        <div style={s.card}>
          <h2 style={{ ...s.secTitle, marginBottom: 18 }}>Trainingsziel</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <DonutChart value={totW} max={100} color="#FF6B35" size={100} label="Workouts" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#FF6B35" }}>Etappe 1: 100 Workouts</div>
              <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>Bisher hast du {totW} Trainings absolviert. Nur noch {100 - totW} bis zum nächsten Meilenstein!</div>
            </div>
          </div>
        </div>
        <div style={s.card}>
          <h2 style={{ ...s.secTitle, marginBottom: 18 }}>Volumenziel</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <DonutChart value={totVol} max={1000000} color="#00D9C0" size={100} label="Volumen (t)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#00D9C0" }}>1 Million Kilogramm</div>
              <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>Du hast bereits {Math.round(totVol/1000)}t bewegt. Weiter so!</div>
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ ...s.secTitle, marginBottom: 18 }}>Deine Erfolge</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
        {[
          { icon: "🏆", title: "Erstes Training", on: totW >= 1 },
          { icon: "🔥", title: "5er Streak", on: false },
          { icon: "💪", title: "Kraftpaket", on: Object.keys(prs).length >= 5 },
          { icon: "🍱", title: "Ernährungs-Pro", on: false },
          { icon: "⚡", title: "HIIT Junkie", on: false },
          { icon: "🌟", title: "Stammgast", on: totW >= 20 }
        ].map(a => (
          <div key={a.title} style={{ ...s.card, padding: 16, textAlign: "center", opacity: a.on ? 1 : 0.3, filter: a.on ? "none" : "grayscale(1)" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{a.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 800 }}>{a.title}</div>
            {a.on && <div style={{ fontSize: 9, color: "#06D6A0", marginTop: 4, fontWeight: 700 }}>FREIGESCHALTET</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalsPage;
