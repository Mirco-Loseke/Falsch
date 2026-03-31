import React from 'react';
import { s } from '../constants/styles';
import { IC } from '../constants/icons';
import { DonutChart } from './Charts';
import { FULL_WEEKDAYS, WEEKDAYS } from '../data/defaults';
import { fmtDate } from '../utils/helpers';

const Dashboard = ({ data, user, onLog, onView, streak, totalVol, thisWeek, todayNut, isMobile }) => {
  const last = [...data.workouts].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const today = new Date();
  const tn = FULL_WEEKDAYS[today.getDay() === 0 ? 6 : today.getDay() - 1];
  const todayPlan = data.plans.find(p => p.days.includes(tn));
  const calGoal = parseInt(user.calorieGoal) || 2500;
  const protGoal = parseInt(user.proteinGoal) || 150;
  const tnC = parseInt(todayNut.calories) || 0;
  const tnP = parseFloat(todayNut.protein) || 0;
  const tnCa = parseFloat(todayNut.carbs) || 0;
  const tnF = parseFloat(todayNut.fat) || 0;

  return (
    <div style={{ ...s.page, padding: isMobile ? "10px 10px 80px" : s.page.padding }}>
      <div style={{ ...s.hero, height: isMobile ? 220 : 300, borderRadius: isMobile ? 16 : 20 }}>
        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80" alt="gym" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.3) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, padding: isMobile ? 24 : 40, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <p style={{ color: "rgba(255,255,255,0.7)", margin: "0 0 8px", fontSize: isMobile ? 12 : 14 }}>{user.firstName ? `Bereit, ${user.firstName}? 🔥` : "Guten Tag 👋"}</p>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: isMobile ? 28 : 40, fontWeight: 800, margin: "0 0 14px", lineHeight: 1.1, color: "#fff" }}>Bereit zum<br />Trainieren?</h1>
          {todayPlan && <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", borderRadius: 20, padding: "6px 14px", fontSize: isMobile ? 11 : 13, color: "#fff", marginBottom: 18, width: "fit-content" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: todayPlan.color, display: "inline-block" }} /> Heute: {todayPlan.name}</div>}
          <button style={{ ...s.heroBtn, padding: isMobile ? "8px 16px" : s.heroBtn.padding, fontSize: isMobile ? 13 : 14 }} onClick={onLog}>{IC.plus} Training starten</button>
        </div>
      </div>
      <div style={{ ...s.statsRow, gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : s.statsRow.gridTemplateColumns }}>
        {[[data.workouts.length, "Trainings", IC.dumbbell, "#FF6B35"], [thisWeek.length, "Diese Woche", IC.fire, "#FFD166"], [`${streak}🔥`, "Streak", IC.trophy, "#00D9C0"], [`${Math.round((totalVol || 0) / 1000)}k kg`, "Volumen", IC.bolt, "#A78BFA"]].map(([v, l, ic, c], i) => (
          <div key={i} style={{ ...s.statCard, padding: isMobile ? 12 : 16 }} className="statCard">
            <div style={{ color: c, display: "flex", marginBottom: 8, transform: isMobile ? "scale(0.9)" : "none" }}>{ic}</div>
            <div style={{ ...s.statV, fontSize: isMobile ? 20 : 24 }}>{v}</div>
            <div style={{ ...s.statL, fontSize: isMobile ? 10 : 11 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18, marginBottom: 28 }}>
        <div style={s.card}>
          <h2 style={{ ...s.secTitle, marginBottom: 14 }}>Diese Woche</h2>
          <div style={s.weekGrid}>{WEEKDAYS.map((day, i) => { const full = FULL_WEEKDAYS[i]; const done = thisWeek.some(w => { const d = new Date(w.date); return (d.getDay() === 0 ? 6 : d.getDay() - 1) === i; }); const isToday = (today.getDay() === 0 ? 6 : today.getDay() - 1) === i; const hasPlan = data.plans.some(p => p.days.includes(full)); return (<div key={day} style={{ ...s.dayCell, ...(done ? s.dayCellDone : {}), ...(isToday ? s.dayCellToday : {}), padding: isMobile ? "8px 2px" : "10px 4px" }}><span style={{ fontSize: 9, fontWeight: 600, color: "#888" }}>{day}</span>{done && <span style={{ color: "#FF6B35", display: "flex", transform: "scale(0.8)" }}>{IC.check}</span>}{!done && hasPlan && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#333" }} />}</div>); })}</div>
        </div>
        <div style={s.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><h2 style={s.secTitle}>Ernährung heute</h2></div>
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", gap: isMobile ? 8 : 0, overflowX: isMobile ? "auto" : "visible", paddingBottom: isMobile ? 8 : 0 }}>
            <DonutChart value={tnC} max={calGoal} color="#FF6B35" size={isMobile ? 56 : 68} label={`${tnC} kcal`} />
            <DonutChart value={tnP} max={protGoal} color="#00D9C0" size={isMobile ? 56 : 68} label={`${Math.round(tnP)}g Prot`} />
            <DonutChart value={tnCa} max={Math.round(calGoal * 0.5 / 4)} color="#FFD166" size={isMobile ? 56 : 68} label={`${Math.round(tnCa)}g Carb`} />
            <DonutChart value={tnF} max={Math.round(calGoal * 0.3 / 9)} color="#A78BFA" size={isMobile ? 56 : 68} label={`${Math.round(tnF)}g Fett`} />
          </div>
        </div>
      </div>
      {last && (<div><h2 style={s.secTitle}>Letztes Training</h2><div style={s.recentCard} className="recentCard" onClick={() => onView("history")}><div style={{ flex: 1 }}><div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 5 }}>{last.name}</div><div style={{ display: "flex", gap: 4, color: "#666", fontSize: 12, alignItems: "center", flexWrap: "wrap" }}>{IC.clock} {last.duration} Min · {last.exercises.length} Übungen · {fmtDate(last.date)}</div>{last.note && <div style={{ marginTop: 8, color: "#aaa", fontSize: 12, fontStyle: "italic" }}>„{last.note}"</div>}</div><div style={{ fontSize: 20, color: "#444", marginLeft: 10 }}>→</div></div></div>)}
    </div>);
};

export default Dashboard;
