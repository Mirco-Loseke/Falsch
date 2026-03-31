import React, { useState, useEffect, useRef } from 'react';
import { s } from '../constants/styles';
import { IC } from '../constants/icons';
import { playBeep, fmtTimer, todayStr, uid } from '../utils/helpers';
import HiitTimer from './HiitTimer';

const LogWorkout = ({ data, setData, notify, prs, onSavePR, library, activeWorkout, setActiveWorkout, setView, isMobile }) => {
  const [step, setStep] = useState(activeWorkout?.step || 1);
  const [planId, setPlanId] = useState(activeWorkout?.planId || "");
  const [name, setName] = useState(activeWorkout?.name || "");
  const [exercises, setExercises] = useState(activeWorkout?.exercises || []);
  const [timer, setTimer] = useState(activeWorkout?.timer || 0);
  const [running, setRunning] = useState(activeWorkout?.running || false);
  const [note, setNote] = useState(activeWorkout?.note || "");
  const [showHiit, setShowHiit] = useState(false);
  const [hiitDuration, setHiitDuration] = useState(60);

  const itv = useRef();

  useEffect(() => {
    if (activeWorkout) {
      setStep(activeWorkout.step);
      setPlanId(activeWorkout.planId);
      setName(activeWorkout.name);
      setExercises(activeWorkout.exercises);
      setTimer(activeWorkout.timer);
      setRunning(activeWorkout.running);
      setNote(activeWorkout.note);
    }
  }, [activeWorkout]);

  useEffect(() => {
    if (running && step === 2) {
      itv.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(itv.current);
    }
    return () => clearInterval(itv.current);
  }, [running, step]);

  const startEmpty = () => {
    setName("Freies Training");
    setExercises([]);
    setStep(2);
    setRunning(true);
    updateActive(2, "", "Freies Training", [], 0, true);
  };

  const selectPlan = (p) => {
    setPlanId(p.id);
    setName(p.name);
    const ex = p.exercises.map(e => {
      const libMatch = library.find(l => l.name === e.name);
      return {
        ...e,
        hiitTimer: libMatch?.hiitTimer || { enabled: false, duration: 60 },
        sets: [{ reps: "", weight: "" }]
      };
    });
    setExercises(ex);
    setStep(2);
    setRunning(true);
    updateActive(2, p.id, p.name, ex, 0, true);
  };

  const updateActive = (st, pid, nm, ex, tm, run, nt = "") => {
    const act = { step: st, planId: pid, name: nm, exercises: ex, timer: tm, running: run, note: nt, lastUpdate: Date.now() };
    setActiveWorkout(act);
  };

  const addEx = () => {
    const newEx = { name: "Neue Übung", sets: [{ reps: "", weight: "" }], hiitTimer: { enabled: false, duration: 60 } };
    const next = [...exercises, newEx];
    setExercises(next);
    updateActive(step, planId, name, next, timer, running, note);
  };

  const removeEx = (idx) => {
    const next = exercises.filter((_, i) => i !== idx);
    setExercises(next);
    updateActive(step, planId, name, next, timer, running, note);
  };

  const addSet = (eIdx) => {
    const next = [...exercises];
    const lastSet = next[eIdx].sets[next[eIdx].sets.length - 1];
    next[eIdx].sets.push({ reps: lastSet?.reps || "", weight: lastSet?.weight || "" });
    setExercises(next);
    updateActive(step, planId, name, next, timer, running, note);
  };

  const removeSet = (eIdx, sIdx) => {
    const next = [...exercises];
    next[eIdx].sets = next[eIdx].sets.filter((_, i) => i !== sIdx);
    setExercises(next);
    updateActive(step, planId, name, next, timer, running, note);
  };

  const updateSet = (eIdx, sIdx, field, val) => {
    const next = [...exercises];
    next[eIdx].sets[sIdx][field] = val;
    setExercises(next);
    updateActive(step, planId, name, next, timer, running, note);
  };

  const toggleSetDone = (eIdx, sIdx) => {
    const next = [...exercises];
    const set = next[eIdx].sets[sIdx];
    set.done = !set.done;
    setExercises(next);
    
    if (set.done) {
      playBeep(600, 0.1);
      const ex = next[eIdx];
      if (ex.hiitTimer?.enabled) {
        setHiitDuration(parseInt(ex.hiitTimer.duration) || 60);
        setShowHiit(true);
      }
    }
    updateActive(step, planId, name, next, timer, running, note);
  };

  const saveWorkout = () => {
    const validEx = exercises.filter(e => e.sets.some(s => s.reps && s.weight));
    if (!validEx.length) return notify("Bitte mindestens einen Satz eintragen", "error");
    
    const wo = {
      id: uid(),
      date: todayStr(),
      planId,
      name,
      duration: Math.floor(timer / 60),
      exercises: validEx.map(e => ({
        name: e.name,
        sets: e.sets.filter(s => s.reps && s.weight).map(s => ({ reps: parseInt(s.reps), weight: parseFloat(s.weight) }))
      })),
      note
    };

    setData(d => ({ ...d, workouts: [wo, ...d.workouts] }));
    
    // PR Check
    wo.exercises.forEach(e => {
      e.sets.forEach(s => {
        const key = e.name.toLowerCase();
        if (!prs[key] || s.weight > prs[key].weight) {
          onSavePR(key, { name: e.name, weight: s.weight, reps: s.reps, date: wo.date });
        }
      });
    });

    notify("Workout gespeichert! 💪");
    setActiveWorkout(null);
    setView("history");
  };

  if (step === 1) {
    return (
      <div style={s.page}>
        <h1 style={s.pageTitle}>Training starten</h1>
        <p style={{ ...s.pageSub, marginBottom: 24 }}>Wähle einen Plan oder starte frei</p>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          <div style={{ ...s.newPlanCard, height: "100%", minHeight: 140, borderColor: "#FF6B35", background: "rgba(255,107,53,0.05)" }} onClick={startEmpty}>
            <div style={{ fontSize: 32 }}>⚡</div>
            <div style={{ fontWeight: 800, color: "#FF6B35" }}>Freies Training</div>
            <div style={{ fontSize: 11, color: "#888" }}>Keine Vorgaben</div>
          </div>
          {data.plans.map(p => (
            <div key={p.id} style={{ ...s.planCard, borderColor: p.color, cursor: "pointer" }} onClick={() => selectPlan(p)}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <h3 style={s.cardTitle}>{p.name}</h3>
                <div style={{ fontSize: 18 }}>💪</div>
              </div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>{p.exercises.length} Übungen</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {p.days.map(d => <span key={d} style={{ ...s.dayChip, background: `${p.color}20`, color: p.color }}>{d.substring(0, 2)}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...s.page, padding: isMobile ? "10px 10px 80px" : s.page.padding }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ ...s.pageTitle, fontSize: isMobile ? 24 : 28 }}>{name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#FF6B35", fontFamily: "'Syne', sans-serif" }}>{fmtTimer(timer)}</span>
            <button onClick={() => setRunning(!running)} style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer", display: "flex" }}>
              {running ? <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={s.secBtn} onClick={() => { if (confirm("Training wirklich abbrechen?")) setActiveWorkout(null); }}>Abbrechen</button>
          <button style={s.primaryBtn} onClick={saveWorkout}>Beenden</button>
        </div>
      </div>

      {exercises.map((ex, eIdx) => (
        <div key={eIdx} style={{ ...s.card, marginBottom: 16, borderLeft: `4px solid #FF6B35` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <input
              style={{ ...s.inp, border: "none", background: "transparent", padding: 0, fontSize: 18, fontWeight: 800, fontFamily: "'Syne', sans-serif", width: "auto" }}
              value={ex.name}
              onChange={e => {
                const next = [...exercises];
                next[eIdx].name = e.target.value;
                setExercises(next);
              }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              {ex.hiitTimer?.enabled && (
                <button 
                  onClick={() => { setHiitDuration(parseInt(ex.hiitTimer.duration) || 60); setShowHiit(true); }}
                  style={{ background: "#FF6B3520", border: "none", color: "#FF6B35", padding: "6px 10px", borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
                >
                  ⏱ HIIT
                </button>
              )}
              <button style={s.cardIconBtn} onClick={() => removeEx(eIdx)}>{IC.trash}</button>
            </div>
          </div>

          <div style={{ ...s.setsH, gridTemplateColumns: "32px 1fr 1fr 44px" }}>
            <span>Set</span>
            <span>kg</span>
            <span>Reps</span>
            <span></span>
          </div>

          {ex.sets.map((set, sIdx) => (
            <div key={sIdx} style={{ ...s.setRow, gridTemplateColumns: "32px 1fr 1fr 44px", opacity: set.done ? 0.5 : 1, transition: "opacity 0.2s" }}>
              <div style={s.setN}>{sIdx + 1}</div>
              <input style={s.setInp} type="number" value={set.weight} onChange={e => updateSet(eIdx, sIdx, "weight", e.target.value)} placeholder="0" />
              <input style={s.setInp} type="number" value={set.reps} onChange={e => updateSet(eIdx, sIdx, "reps", e.target.value)} placeholder="0" />
              <button
                onClick={() => toggleSetDone(eIdx, sIdx)}
                style={{
                  width: 32, height: 32, borderRadius: 8, border: "none",
                  background: set.done ? "#06D6A0" : "#1A1A1F",
                  color: set.done ? "#000" : "#444",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {IC.check}
              </button>
            </div>
          ))}

          <button style={{ ...s.addSetBtn, width: "100%", marginTop: 10, padding: 8 }} onClick={() => addSet(eIdx)}>+ Satz hinzufügen</button>
        </div>
      ))}

      <button style={{ ...s.secBtn, width: "100%", marginBottom: 30, padding: 15, borderStyle: "dashed" }} onClick={addEx}>+ Übung hinzufügen</button>

      <div style={s.card}>
        <label style={s.lbl}>Notizen zum Training</label>
        <textarea style={{ ...s.inp, minHeight: 80, resize: "vertical" }} value={note} onChange={e => setNote(e.target.value)} placeholder="Wie lief das Training?" />
      </div>

      {showHiit && (
        <div style={s.overlay2} onClick={() => setShowHiit(false)}>
          <div style={{ ...s.modal, maxWidth: 360, background: "#0D0D0F" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ ...s.cardTitle, color: "#FF6B35" }}>HIIT Pause</h3>
              <button onClick={() => setShowHiit(false)} style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer" }}>{IC.x}</button>
            </div>
            <HiitTimer duration={hiitDuration} onFinish={() => setTimeout(() => setShowHiit(false), 2000)} isMobile={isMobile} />
            <button style={{ ...s.secBtn, width: "100%", marginTop: 16 }} onClick={() => setShowHiit(false)}>Überspringen</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogWorkout;
