import React, { useState } from 'react';
import { s } from '../constants/styles';
import { IC } from '../constants/icons';
import { uid } from '../utils/helpers';

const RecipesPage = ({ notify, isMobile }) => {
  const [recipes, setRecipes] = useState(() => {
    const r = localStorage.getItem("ff_recipes");
    return r ? JSON.parse(r) : [
      { id: 1, name: "Protein Haferflocken", cals: 420, prot: 35, time: 10, img: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&q=80", cats: ["Frühstück", "Muskelaufbau"], desc: "Haferflocken mit Wasser oder Milch kochen, Proteinpulver einrühren und mit Beeren toppen." },
      { id: 2, name: "Hähnchen mit Reis", cals: 580, prot: 52, time: 25, img: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80", cats: ["Mittagessen", "High Protein"], desc: "Hähnchenbrust anbraten, Reis kochen, Brokkoli dünsten. Mit Sojasauce verfeinern." },
      { id: 3, name: "Griechischer Joghurt Bowle", cals: 310, prot: 24, time: 5, img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80", cats: ["Snack", "Low Carb"], desc: "Joghurt mit Nüssen, Samen und ein wenig Honig vermischen." }
    ];
  });
  const [modal, setModal] = useState(false);
  const [newR, setNewR] = useState({ name: "", cals: "", prot: "", time: "", desc: "", img: "" });

  const save = () => {
    if (!newR.name) return notify("Name fehlt", "error");
    const r = [...recipes, { ...newR, id: uid(), cats: ["Benutzerdefiniert"] }];
    setRecipes(r); localStorage.setItem("ff_recipes", JSON.stringify(r));
    setModal(false); notify("Rezept gespeichert!");
  };

  return (
    <div style={s.page}>
      <div style={s.pageHead}>
        <div><h1 style={s.pageTitle}>Rezepte & Meal Prep</h1><p style={s.pageSub}>Gesunde Ernährung leicht gemacht</p></div>
        <button style={s.primaryBtn} onClick={() => setModal(true)}>{IC.plus} Neues Rezept</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {recipes.map(r => (
          <div key={r.id} style={{ ...s.card, padding: 0, overflow: "hidden" }} className="statCard">
            <div style={{ height: 160, position: "relative" }}>
              <img src={r.img || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80"} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 12, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", color: "#fff", fontWeight: 700 }}>{r.name}</div>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>{r.cats.map(c => <span key={c} style={{ fontSize: 9, padding: "2px 8px", background: "#1A1A1F", borderRadius: 10, color: "#999", fontWeight: 700 }}>{c.toUpperCase()}</span>)}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                <div style={{ background: "#0D0D0F", padding: 8, borderRadius: 8, textAlign: "center" }}><div style={{ fontSize: 9, color: "#666" }}>Kcal</div><div style={{ fontSize: 13, fontWeight: 700 }}>{r.cals}</div></div>
                <div style={{ background: "#0D0D0F", padding: 8, borderRadius: 8, textAlign: "center" }}><div style={{ fontSize: 9, color: "#666" }}>Protein</div><div style={{ fontSize: 13, fontWeight: 700 }}>{r.prot}g</div></div>
                <div style={{ background: "#0D0D0F", padding: 8, borderRadius: 8, textAlign: "center" }}><div style={{ fontSize: 9, color: "#666" }}>Zeit</div><div style={{ fontSize: 13, fontWeight: 700 }}>{r.time}m</div></div>
              </div>
              <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{r.desc}</div>
              <button style={{ ...s.secBtn, width: "100%", marginTop: 16, fontSize: 13 }}>Rezept ansehen</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={s.overlay2} onClick={() => setModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitle}>Neues Rezept</h2>
            <div style={s.fg}><label style={s.lbl}>Name</label><input style={s.inp} value={newR.name} onChange={v => setNewR({ ...newR, name: v.target.value })} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={s.fg}><label style={s.lbl}>Kalorien</label><input style={s.inp} type="number" value={newR.cals} onChange={v => setNewR({ ...newR, cals: v.target.value })} /></div>
              <div style={s.fg}><label style={s.lbl}>Protein</label><input style={s.inp} type="number" value={newR.prot} onChange={v => setNewR({ ...newR, prot: v.target.value })} /></div>
            </div>
            <div style={s.fg}><label style={s.lbl}>Beschreibung / Zubereitung</label><textarea style={{ ...s.inp, minHeight: 100 }} value={newR.desc} onChange={v => setNewR({ ...newR, desc: v.target.value })} /></div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}><button style={{ ...s.secBtn, flex: 1 }} onClick={() => setModal(false)}>Abbrechen</button><button style={{ ...s.primaryBtn, flex: 1, justifyContent: "center" }} onClick={save}>Speichern</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipesPage;
