export const playBeep = (freq, duration, vol = 0.1) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.01);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn("Beep failed", e);
  }
};

export const timeAgo = (ts) => {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "Gerade eben";
  if (m < 60) return `vor ${m} Min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `vor ${h} Std`;
  return `vor ${Math.floor(h / 24)} Tagen`;
};

export const fmtDate = (d) => new Date(d).toLocaleDateString("de-DE");

export const fmtShort = (d) => {
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
};

export const fmtTimer = (secs) => {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${h > 0 ? h + ":" : ""}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const getInitials = (u) => ((u.firstName?.[0] || "") + (u.lastName?.[0] || "")).toUpperCase() || "FF";

export const todayStr = () => new Date().toISOString().split("T")[0];

export const uid = () => Math.random().toString(36).substring(2, 9);
