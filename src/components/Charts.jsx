import React, { useRef } from 'react';

let _chartId = 0;

export const LineChart = ({ points, color = "#FF6B35", height = 80 }) => {
  const id = useRef(`lc${++_chartId}`).current;
  if (!points || points.length < 2) return <div style={{ color: "#555", fontSize: 13, padding: "20px 0", textAlign: "center" }}>Noch nicht genug Daten</div>;
  const W = 500, H = height, pad = 12;
  const vals = points.map(v => isFinite(v) ? v : 0);
  const mn = Math.min(...vals), mx = Math.max(...vals), rng = mx - mn || 1;

  const yPad = rng * 0.2; // 20% headroom
  const effMin = mn - yPad;
  const effMax = mx + yPad;
  const effRng = effMax - effMin || 1;

  const xs = vals.map((_, i) => pad + (i / (vals.length - 1)) * (W - pad * 2));
  const ys = vals.map(v => H - pad - 6 - ((v - effMin) / effRng) * (H - pad * 2 - 6));
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const area = `${d} L${xs[xs.length - 1].toFixed(1)},${H} L${xs[0].toFixed(1)},${H} Z`;

  return (
    <div style={{ width: "100%", height: H, position: "relative", marginBottom: 10 }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${id})`} />
        <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {vals.map((v, i) => (
          <g key={i}>
            <circle cx={xs[i]} cy={ys[i]} r="3" fill={color} />
            <text x={xs[i]} y={ys[i] - 8} textAnchor="middle" style={{ fontSize: 8, fill: "#888", fontWeight: 700 }}>{v.toFixed(1)}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export const BarChart = ({ bars, color = "#FF6B35", height = 90 }) => {
  if (!bars || !bars.length) return null;
  const W = 500, H = height, pad = 4, gap = 6;
  const mx = Math.max(...bars.map(b => b.v), 1);
  const bw = (W - pad * 2 - gap * (bars.length - 1)) / bars.length;
  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} style={{ width: "100%", height: H + 20, display: "block" }}>
      {bars.map((b, i) => {
        const bh = b.v > 0 ? Math.max((b.v / mx) * (H - pad), 4) : 0;
        const x = pad + i * (bw + gap), y = H - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh} rx="4" fill={color} opacity="0.82" />
            <text x={x + bw / 2} y={H + 15} textAnchor="middle" fontSize="11" fill="#555">{b.l}</text>
          </g>
        );
      })}
    </svg>
  );
};

export const DonutChart = ({ value, max, color = "#FF6B35", size = 80, label = "" }) => {
  const r = 30, circ = 2 * Math.PI * r, pct = Math.min(value / Math.max(max, 1), 1), dash = pct * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={size} height={size} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#1E1E24" strokeWidth="8" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="8" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 40 40)" style={{ transition: "stroke-dasharray 0.5s" }} />
        <text x="40" y="44" textAnchor="middle" fontSize="12" fontWeight="800" fill="#F0EDE8" fontFamily="Syne,sans-serif">{Math.round(pct * 100)}%</text>
      </svg>
      {label && <div style={{ fontSize: 10, color: "#666", textAlign: "center", maxWidth: 70 }}>{label}</div>}
    </div>
  );
};
