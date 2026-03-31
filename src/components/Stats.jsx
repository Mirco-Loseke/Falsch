import React from 'react';
import { s } from '../constants/styles';
import { IC } from '../constants/icons';
import { LineChart, BarChart } from './Charts';
import { fmtDate } from '../utils/helpers';

const Stats = ({ data, prs }) => {
  const lastWorkouts = data.workouts.slice(0, 10).reverse();
  const volumePoints = lastWorkouts.map(w => w.exercises.reduce((acc, ex) => acc + ex.sets.reduce((sAcc, s) => sAcc + (s.reps * s.weight), 0), 0));
  const durationPoints = lastWorkouts.map(w => w.duration || 0);
  const muscleData = data.workouts.reduce((acc, w) => {
    w.exercises.forEach(e => (acc[e.name] = (acc[e.name] || 0) + e.sets.length));
    return acc;
  }, {});
  const mBars = Object.entries(muscleData).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([l, v]) => ({ l, v }));

  return (
    <div style={s.page}>
      <h1 style={s.pageTitle}>Statistiken & Analyse</h1>
      <p style={{ ...s.pageSub, marginBottom: 28 }}>Dein Fortschritt in Zahlen</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={s.card}>
          <h3 style={{ ...s.cardTitle, marginBottom: 16 }}>Volumensentwicklung</h3>
          <LineChart points={volumePoints} color="#FF6B35" />
          <p style={{ fontSize: 11, color: "#444", marginTop: 10 }}>Gesamtvolumen (kg) über die letzten 10 Trainings</p>
        </div>
        <div style={s.card}>
          <h3 style={{ ...s.cardTitle, marginBottom: 16 }}>Trainingsdauer</h3>
          <LineChart points={durationPoints} color="#00D9C0" />
          <p style={{ fontSize: 11, color: "#444", marginTop: 10 }}>Minuten pro Training (letzte 10 Sessions)</p>
        </div>
      </div>

      <div style={{ ...s.card, marginBottom: 20 }}>
        <h3 style={{ ...s.cardTitle, marginBottom: 16 }}>Meisttrainierte Übungen (Sätze)</h3>
        <BarChart bars={mBars} color="#FFD166" />
      </div>

      <div style={s.card}>
        <h3 style={{ ...s.cardTitle, marginBottom: 16 }}>Deine persönlichen Rekorde (PRs)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {Object.entries(prs).map(([key, pr]) => (
            <div key={key} style={{ background: "#0D0D0F", border: "1px solid #1E1E24", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 11, color: "#FF6B35", fontWeight: 800, textTransform: "uppercase", marginBottom: 4 }}>{pr.name}</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{pr.weight}<span style={{ fontSize: 12, color: "#666", marginLeft: 4 }}>kg</span></div>
              <div style={{ fontSize: 11, color: "#444", marginTop: 6 }}>{pr.reps} Reps am {fmtDate(pr.date)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
