import React, { useState } from 'react';
import { s } from '../constants/styles';
import { IC } from '../constants/icons';
import { getInitials } from '../utils/helpers';

const ProfilePage = ({ user, setUser, notify, isMobile }) => {
  const [fName, setFName] = useState(user.firstName || "");
  const [lName, setLName] = useState(user.lastName || "");
  const [goal, setGoal] = useState(user.goal || "Muskelaufbau");
  const [weight, setWeight] = useState(user.weight || "");
  const [height, setHeight] = useState(user.height || "");
  const [calGoal, setCalGoal] = useState(user.calorieGoal || 2500);
  const [protGoal, setProtGoal] = useState(user.proteinGoal || 150);

  const save = () => {
    const next = { ...user, firstName: fName, lastName: lName, goal, weight, height, calorieGoal: calGoal, proteinGoal: protGoal };
    setUser(next);
    notify("Profil aktualisiert!");
  };

  return (
    <div style={s.page}>
      <h1 style={s.pageTitle}>Profil & Einstellungen</h1>
      <p style={{ ...s.pageSub, marginBottom: 28 }}>Verwalte deine persönlichen Daten und Ziele</p>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "300px 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ ...s.card, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg,#FF6B35,#FF8C60)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif" }}>{getInitials(user)}</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{user.firstName || "Fitness"} {user.lastName || "Fan"}</div>
              <div style={{ color: "#666", fontSize: 13 }}>{user.email || "Deine Email"}</div>
            </div>
            <button style={{ ...s.secBtn, width: "100%", fontSize: 13 }}>Avatar ändern</button>
          </div>
          <div style={s.card}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Deine Ziele</div>
            <div style={s.fg}><label style={s.lbl}>Trainingsziel</label><select style={s.inp} value={goal} onChange={v => setGoal(v.target.value)}>{["Muskelaufbau", "Gewichtsverlust", "Ausdauer", "Allgemeine Fitness", "Maximal-Kraft"].map(o => <option key={o} value={o}>{o}</option>)}</select></div>
            <div style={s.fg}><label style={s.lbl}>Kalorienziel</label><input style={s.inp} type="number" value={calGoal} onChange={v => setCalGoal(v.target.value)} /></div>
            <div style={s.fg}><label style={s.lbl}>Proteinziel (g)</label><input style={s.inp} type="number" value={protGoal} onChange={v => setProtGoal(v.target.value)} /></div>
          </div>
        </div>

        <div style={s.card}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #1E1E24" }}>Persönliche Informationen</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={s.fg}><label style={s.lbl}>Vorname</label><input style={s.inp} value={fName} onChange={v => setFName(v.target.value)} /></div>
            <div style={s.fg}><label style={s.lbl}>Nachname</label><input style={s.inp} value={lName} onChange={v => setLName(v.target.value)} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div style={s.fg}><label style={s.lbl}>Gewicht (kg)</label><input style={s.inp} type="number" value={weight} onChange={v => setWeight(v.target.value)} /></div>
            <div style={s.fg}><label style={s.lbl}>Körpergröße (cm)</label><input style={s.inp} type="number" value={height} onChange={v => setHeight(v.target.value)} /></div>
          </div>
          <div style={{ paddingTop: 20, borderTop: "1px solid #1E1E24", display: "flex", justifyContent: "flex-end" }}>
            <button style={s.primaryBtn} onClick={save}>Speichern</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
