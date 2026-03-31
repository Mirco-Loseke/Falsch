import React, { useState, useEffect, useRef } from 'react';
import { playBeep } from '../utils/helpers';
import { s } from '../constants/styles';

const HiitTimer = ({ duration, onFinish, isMobile }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [active, setActive] = useState(false);
  const itv = useRef();

  useEffect(() => {
    if (active && timeLeft > 0) {
      itv.current = setInterval(() => {
        setTimeLeft(t => {
          const next = t - 1;
          if (next === 0) {
            playBeep(880, 0.8, 0.2);
            clearInterval(itv.current);
            setActive(false);
            if (onFinish) onFinish();
            return 0;
          }
          if (next <= 3) playBeep(660, 0.2);
          return next;
        });
      }, 1000);
    } else {
      clearInterval(itv.current);
    }
    return () => clearInterval(itv.current);
  }, [active]);

  const start = () => {
    if (!active) {
      if (timeLeft <= 0) setTimeLeft(duration);
      playBeep(440, 0.4);
      setActive(true);
    } else {
      setActive(false);
    }
  };

  return (
    <div style={{ background: "#111114", border: "1px solid #1E1E24", borderRadius: 16, padding: isMobile ? 12 : 20, display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 4 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 48, fontWeight: 800, color: "#FF6B35", letterSpacing: 1 }}>
          {timeLeft}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#444" }}>SEK</div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          style={{ flex: 2, padding: isMobile ? "12px" : "15px", background: active ? "#EF476F15" : "#06D6A015", border: `2px solid ${active ? "#EF476F" : "#06D6A0"}`, color: active ? "#EF476F" : "#06D6A0", fontWeight: 800, borderRadius: 8, cursor: "pointer" }}
          onClick={start}
        >
          {active ? "STOP" : timeLeft === 0 ? "RESTART" : "START HIIT"}
        </button>
        <button
          style={{ width: 54, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, background: "#1E1E24", border: "none", borderRadius: 8, cursor: "pointer" }}
          onClick={() => { setActive(false); setTimeLeft(duration); }}
        >
          🔄
        </button>
      </div>
    </div>
  );
};

export default HiitTimer;
