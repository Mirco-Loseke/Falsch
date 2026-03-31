import React, { useState } from 'react';
import { s } from '../constants/styles';
import { IC } from '../constants/icons';
import { todayStr, uid } from '../utils/helpers';
import { DonutChart } from './Charts';

const Nutrition = ({ nutrition, setNutrition, user, favFoods, setFavFoods, notify, isMobile }) => {
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [cals, setCals] = useState("");
  const [prot, setProt] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [search, setSearch] = useState("");

  const today = todayStr();
  const dayData = nutrition[today] || { calories: 0, protein: 0, carbs: 0, fat: 0, entries: [] };
  const goalC = parseInt(user.calorieGoal) || 2500;
  const goalP = parseInt(user.proteinGoal) || 150;

  const add = (e) => {
    const next = { 
      calories: dayData.calories + (parseInt(e.calories) || 0),
      protein: dayData.protein + (parseFloat(e.protein) || 0),
      carbs: dayData.carbs + (parseFloat(e.carbs) || 0),
      fat: dayData.fat + (parseFloat(e.fat) || 0),
      entries: [...(dayData.entries || []), { ...e, id: uid(), time: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) }]
    };
    setNutrition(n => ({ ...n, [today]: next }));
    notify(`${e.name} hinzugefügt`);
  };

  const saveCustom = () => {
    if (!name || !cals) return notify("Name und Kalorien fehlen", "error");
    const e = { name, calories: parseInt(cals), protein: parseFloat(prot) || 0, carbs: parseFloat(carbs) || 0, fat: parseFloat(fat) || 0 };
    add(e); setModal(false); setName(""); setCals(""); setProt(""); setCarbs(""); setFat("");
  };

  const removeEntry = (id) => {
    const entry = dayData.entries.find(e => e.id === id);
    if (!entry) return;
    const next = {
      calories: Math.max(0, dayData.calories - (parseInt(entry.calories) || 0)),
      protein: Math.max(0, dayData.protein - (parseFloat(entry.protein) || 0)),
      carbs: Math.max(0, dayData.carbs - (parseFloat(entry.carbs) || 0)),
      fat: Math.max(0, dayData.fat - (parseFloat(entry.fat) || 0)),
      entries: dayData.entries.filter(e => e.id !== id)
    };
    setNutrition(n => ({ ...n, [today]: next }));
  };

  return (
    <div style={s.page}>
      <div style={s.pageHead}>
        <div><h1 style={s.pageTitle}>Ernährung & Kalorien</h1><p style={s.pageSub}>Verfolge deine Ernährung heute</p></div>
        <button style={s.primaryBtn} onClick={() => setModal(true)}>{IC.plus} Eintrag hinzufügen</button>
      </div>

      <div style={{ ...s.card, marginBottom: 24, padding: isMobile ? 12 : 20 }}>
        <h2 style={{ ...s.secTitle, marginBottom: 18 }}>Fortschritt heute</h2>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <DonutChart value={dayData.calories} max={goalC} color="#FF6B35" size={isMobile ? 70 : 100} label={`${dayData.calories} / ${goalC} kcal`} />
          <DonutChart value={dayData.protein} max={goalP} color="#00D9C0" size={isMobile ? 70 : 100} label={`${Math.floor(dayData.protein)} / ${goalP}g Prot`} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 140 }}>
            <div style={{ background: "#1A1A1F", borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ fontSize: 10, color: "#666", textTransform: "uppercase", fontWeight: 700 }}>Carbs</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{Math.floor(dayData.carbs)}g</div>
            </div>
            <div style={{ background: "#1A1A1F", borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ fontSize: 10, color: "#666", textTransform: "uppercase", fontWeight: 700 }}>Fett</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{Math.floor(dayData.fat)}g</div>
            </div>
          </div>
        </div>
      </div>

      <div style={s.card}>
        <h2 style={{ ...s.secTitle, marginBottom: 16 }}>Heutige Einträge</h2>
        {!dayData.entries?.length && <div style={{ color: "#444", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>Bisher keine Einträge für heute...</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {dayData.entries?.map(e => (
            <div key={e.id} style={{ display: "flex", alignItems: "center", background: "#0D0D0F", border: "1px solid #1E1E24", borderRadius: 12, padding: "10px 14px" }}>
              <div style={{ fontSize: 18, marginRight: 12 }}>🍱</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{e.name}</div>
                <div style={{ fontSize: 11, color: "#666" }}>{e.time} · {e.calories} kcal · {e.protein}g P</div>
              </div>
              <button style={s.cardIconBtn} onClick={() => removeEntry(e.id)}>{IC.trash}</button>
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <div style={s.overlay2} onClick={() => setModal(false)}>
          <div style={{ ...s.modal, maxWidth: 420 }} onClick={ev => ev.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
              <h2 style={s.modalTitle}>Essen tracken</h2>
              <button onClick={() => setModal(false)} style={{ background: "transparent", border: "none", color: "#666" }}>{IC.x}</button>
            </div>
            <div style={s.fg}><label style={s.lbl}>Suche / Name</label><input style={s.inp} value={name} onChange={v => setName(v.target.value)} placeholder="Hähnchen, Shake..." /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div style={s.fg}><label style={s.lbl}>kcal</label><input style={s.setInp} type="number" value={cals} onChange={v => setCals(v.target.value)} /></div>
              <div style={s.fg}><label style={s.lbl}>Protein (g)</label><input style={s.setInp} type="number" value={prot} onChange={v => setProt(v.target.value)} /></div>
              <div style={s.fg}><label style={s.lbl}>Carbs (g)</label><input style={s.setInp} type="number" value={carbs} onChange={v => setCarbs(v.target.value)} /></div>
              <div style={s.fg}><label style={s.lbl}>Fett (g)</label><input style={s.setInp} type="number" value={fat} onChange={v => setFat(v.target.value)} /></div>
            </div>
            <button style={{ ...s.primaryBtn, width: "100%", justifyContent: "center" }} onClick={saveCustom}>Eintragen</button>
            <div style={{ marginTop: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: "#666", marginBottom: 10, textTransform: "uppercase" }}>Favoriten</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {favFoods.map((f, i) => <div key={i} onClick={() => { add(f); setModal(false); }} style={{ background: "#1A1A1F", padding: "10px 14px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>{f.name} <span style={{ color: "#FF6B35", float: "right" }}>{f.calories} kcal</span></div>)}
                {!favFoods.length && <div style={{ fontSize: 11, color: "#444" }}>Speichere Lebensmittel als Favoriten für schnelleren Zugriff.</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nutrition;
