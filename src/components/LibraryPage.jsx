import React, { useState } from 'react';
import { s } from '../constants/styles';
import { IC } from '../constants/icons';
import { EQUIPMENT_OPTIONS, uid } from '../data/defaults';

const LibraryPage = ({ library, setLibrary, notify, isMobile }) => {
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Brust");
  const [equipment, setEquipment] = useState("");
  const [notes, setNotes] = useState("");
  const [hiitEnabled, setHiitEnabled] = useState(false);
  const [hiitDuration, setHiitDuration] = useState(60);

  const openAdd = () => { setEdit(null); setName(""); setCategory("Brust"); setEquipment(""); setNotes(""); setHiitEnabled(false); setHiitDuration(60); setModal(true); };
  const openEdit = (e) => { setEdit(e); setName(e.name); setCategory(e.category); setEquipment(e.equipment || ""); setNotes(e.notes || ""); setHiitEnabled(e.hiitTimer?.enabled || false); setHiitDuration(e.hiitTimer?.duration || 60); setModal(true); };

  const save = () => {
    if (!name) return notify("Name ist Pflicht!", "error");
    const e = { id: edit?.id || uid(), name, category, equipment, notes, hiitTimer: { enabled: hiitEnabled, duration: hiitDuration } };
    if (edit) setLibrary(l => l.map(x => x.id === edit.id ? e : x));
    else setLibrary(l => [...l, e]);
    setModal(false); notify("Übung gespeichert!");
  };

  const del = (id) => { if (confirm("Diese Übung wirklich löschen?")) { setLibrary(l => l.filter(x => x.id !== id)); notify("Übung gelöscht", "info"); } };

  return (
    <div style={s.page}>
      <div style={s.pageHead}>
        <div><h1 style={s.pageTitle}>Übungs-Bibliothek</h1><p style={s.pageSub}>Verwalte deine Übungen und HIIT-Timer</p></div>
        <button style={s.primaryBtn} onClick={openAdd}>{IC.plus} Neue Übung</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {library.map(e => (
          <div key={e.id} style={s.planCard} className="statCard">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <h3 style={s.cardTitle}>{e.name}</h3>
              <div style={{ display: "flex", gap: 6 }}><button style={s.cardIconBtn} onClick={() => openEdit(e)}>{IC.edit}</button><button style={s.cardIconBtn} onClick={() => del(e.id)}>{IC.trash}</button></div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#FF6B35", marginBottom: 12, textTransform: "uppercase" }}>{e.category} {e.equipment && `· ${e.equipment}`}</div>
            {e.hiitTimer?.enabled && <div style={{ fontSize: 11, background: "#06D6A015", color: "#06D6A0", padding: "4px 8px", borderRadius: 6, display: "inline-block", fontWeight: 700 }}>⏱ HIIT: {e.hiitTimer.duration} sek</div>}
            <div style={{ fontSize: 13, color: "#666", marginTop: 12, fontStyle: "italic", lineHeight: 1.5 }}>{e.notes || "Keine Notizen"}</div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={s.overlay2} onClick={() => setModal(false)}>
          <div style={{ ...s.modal, maxWidth: 450 }} onClick={x => x.stopPropagation()}>
            <h2 style={s.modalTitle}>{edit ? "Übung bearbeiten" : "Neue Übung"}</h2>
            <div style={s.fg}><label style={s.lbl}>Name</label><input style={s.inp} value={name} onChange={x => setName(x.target.value)} placeholder="z.B. Bankdrücken" /></div>
            <div style={s.fg}><label style={s.lbl}>Kategorie</label><select style={s.inp} value={category} onChange={x => setCategory(x.target.value)}>{["Brust", "Rücken", "Beine", "Schultern", "Arme", "Bauch", "Cardio"].map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div style={s.fg}><label style={s.lbl}>Equipment</label><select style={s.inp} value={equipment} onChange={x => setEquipment(x.target.value)}><option value="">- Kein -</option>{EQUIPMENT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
            <div style={{ ...s.fg, background: "#1A1A1F", padding: 16, borderRadius: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>HIIT Timer aktivieren</div>
                <div onClick={() => setHiitEnabled(!hiitEnabled)} style={{ ...s.toggle, ...(hiitEnabled ? s.toggleOn : {}) }}><div style={{ ...s.thumb, ...(hiitEnabled ? s.thumbOn : {}) }} /></div>
              </div>
              {hiitEnabled && (
                <div style={{ ...s.fg, marginBottom: 0 }}>
                  <label style={s.lbl}>Pausendauer (Sekunden)</label>
                  <input style={s.inp} type="number" value={hiitDuration} onChange={x => setHiitDuration(x.target.value)} />
                </div>
              )}
            </div>
            <div style={s.fg}><label style={s.lbl}>Notizen / Ausführung</label><textarea style={{ ...s.inp, minHeight: 80 }} value={notes} onChange={x => setNotes(x.target.value)} /></div>
            <div style={{ display: "flex", gap: 10 }}><button style={{ ...s.secBtn, flex: 1 }} onClick={() => setModal(false)}>Abbrechen</button><button style={{ ...s.primaryBtn, flex: 1, justifyContent: "center" }} onClick={save}>Speichern</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
