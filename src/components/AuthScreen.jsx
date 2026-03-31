import React, { useState } from 'react';
import { s } from '../constants/styles';
import { IC } from '../constants/icons';

const AuthScreen = ({ onLogin, onGuest, notify }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [mode, setMode] = useState("login");

  return (
    <div style={{ ...s.root, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <div style={{ ...s.card, maxWidth: 380, width: "100%", padding: 32, textAlign: "center" }}>
        <div style={{ color: "#FF6B35", fontSize: 40, marginBottom: 12 }}>{IC.fire}</div>
        <h1 style={{ ...s.logoTxt, fontSize: 32, marginBottom: 8 }}>FitForge</h1>
        <p style={{ ...s.pageSub, marginBottom: 32 }}>Dein Premium Fitness Begleiter</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          <div style={s.fg}><label style={{ ...s.lbl, textAlign: "left" }}>Email</label><input style={s.inp} value={email} onChange={e => setEmail(e.target.value)} placeholder="name@email.com" /></div>
          <div style={s.fg}><label style={{ ...s.lbl, textAlign: "left" }}>Passwort</label><input style={s.inp} type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" /></div>
          <button style={{ ...s.primaryBtn, width: "100%", justifyContent: "center", padding: 14 }} onClick={() => notify("Firebase Auth wird initialisiert...", "info")}>{mode === "login" ? "Anmelden" : "Registrieren"}</button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#444", fontSize: 13 }}><span style={{ flex: 1, height: 1, background: "#1E1E24" }} /> ODER <span style={{ flex: 1, height: 1, background: "#1E1E24" }} /></div>
          <button style={{ ...s.secBtn, width: "100%", padding: 14 }} onClick={onGuest}>Als Gast fortfahren</button>
        </div>

        <div style={{ color: "#666", fontSize: 13, cursor: "pointer" }} onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "Noch kein Konto? Registrieren" : "Bereits ein Konto? Anmelden"}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
