import React, { useState } from 'react';
import { s } from '../constants/styles';
import { IC } from '../constants/icons';
import { FULL_WEEKDAYS, uid } from '../data/defaults';

const Plans = ({ data, setData, notify, isMobile }) => {
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#FF6B35");
  const [days, setDays] = useState([]);
  const [exercises, setExercises] = useState([]);

  const openAdd = () => {
    setEdit(null); setName(""); setColor("#FF6B35"); setDays([]); setExercises([{ name: "", photo: null }]); setModal(true);
  };

  const openEdit = (p) => {
    setEdit(p); setName(p.name); setColor(p.color); setDays(p.days); setExercises(p.exercises.map(e => ({ ...e }))); setModal(true);
  };

  const save = () => {
    if (!name || !days.length) return notify("Name und Tage sind Pflicht!", "error");
    const p = { id: edit?.id || uid(), name, color, days, exercises: exercises.filter(e => e.name) };
    if (edit) setData(d => ({ ...d, plans: d.plans.map(pl => pl.id === edit.id ? p : pl) }));
    else setData(d => ({ ...d, plans: [...d.plans, p] }));
    setModal(false); notify("Plan gespeichert!");
  };

  const del = (id) => {
    if (confirm("Diesen Plan wirklich löschen?")) {
      setData(d => ({ ...d, plans: d.plans.filter(p => p.id !== id) }));
      notify("Plan gelöscht", "info");
    }
  };

  return (
    <div style={s.page}>
      <div style={s.pageHead}>
        <div><h1 style={s.pageTitle}>Trainingspläne</h1><p style={s.pageSub}>Organisiere dein Training</p></div>
        <button style={s.primaryBtn} onClick={openAdd}>{IC.plus} Neuer Plan</button>
      </div>
      <div style={s.plansGrid}>
        {data.plans.map(p => (
          <div key={p.id} style={{ ...s.planCard, borderColor: p.color }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={s.cardTitle}>{p.name}</h3>
              <div style={{ display: "flex", gap: 6 }}>
                <button style={s.cardIconBtn} onClick={() => openEdit(p)}>{IC.edit}</button>
                <button style={s.cardIconBtn} onClick={() => del(p.id)}>{IC.trash}</button>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#999", marginBottom: 16 }}>{p.exercises.length} Übungen</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 15 }}>
              {p.days.map(d => <span key={d} style={{ ...s.dayChip, background: `${p.color}15`, color: p.color }}>{d.substring(0, 2)}</span>)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {p.exercises.slice(0, 3).map((e, i) => <div key={i} style={{ fontSize: 11, color: "#666", display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 4, height: 4, borderRadius: "50%", background: p.color }} /> {e.name}</div>)}
              {p.exercises.length > 3 && <div style={{ fontSize: 10, color: "#444", fontStyle: "italic" }}>+ {p.exercises.length - 3} weitere...</div>}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={s.overlay2} onClick={() => setModal(false)}>
          <div style={{ ...s.modal, maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={s.modalTitle}>{edit ? "Plan bearbeiten" : "Neuer Plan"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "transparent", border: "none", color: "#666" }}>{IC.x}</button>
            </div>
            <div style={s.fg}><label style={s.lbl}>Name des Plans</label><input style={s.inp} value={name} onChange={e => setName(e.target.value)} placeholder="z.B. Push Day" /></div>
            <div style={s.fg}><label style={s.lbl}>Farbe</label><div style={{ display: "flex", gap: 8 }}>{["#FF6B35", "#00D9C0", "#FFD166", "#EF476F", "#118AB2", "#06D6A0"].map(c => <div key={c} onClick={() => setColor(c)} style={{ width: 30, height: 30, borderRadius: "50%", background: c, cursor: "pointer", border: color === c ? "3px solid #fff" : "none" }} />)}</div></div>
            <div style={s.fg}><label style={s.lbl}>Tage</label><div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{FULL_WEEKDAYS.map(d => { const on = days.includes(d); return <button key={d} onClick={() => setDays(on ? days.filter(x => x !== d) : [...days, d])} style={{ ...s.dayToggle, ...(on ? { background: "#FF6B3525", borderColor: "#FF6B35", color: "#FF6B35" } : {}) }}>{d}</button>; })}</div></div>
            <div style={{ ...s.fg, marginTop: 15 }}><label style={s.lbl}>Übungen</label>{exercises.map((ex, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input style={s.inp} value={ex.name} onChange={e => { const n = [...exercises]; n[i].name = e.target.value; setExercises(n); }} placeholder="Übungsname" />
                <button style={{ ...s.cardIconBtn, color: "#EF476F" }} onClick={() => setExercises(exercises.filter((_, idx) => idx !== i))}>{IC.trash}</button>
              </div>
            ))}
              <button style={{ ...s.secBtn, width: "100%", fontSize: 12, padding: "8px 12px", borderStyle: "dashed", marginTop: 8 }} onClick={() => setExercises([...exercises, { name: "", photo: null }])}>+ Übung hinzufügen</button>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 25 }}><button style={{ ...s.secBtn, flex: 1 }} onClick={() => setModal(false)}>Abbrechen</button><button style={{ ...s.primaryBtn, flex: 1, justifyContent: "center" }} onClick={save}>Speichern</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;
