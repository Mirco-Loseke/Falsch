import React, { useState } from 'react';
import { s } from '../constants/styles';
import { IC } from '../constants/icons';

const WeeklyReportModal = ({ report, onClose, isMobile }) => {
  return (
    <div style={s.overlay2} onClick={onClose}>
      <div style={{ ...s.modal, maxWidth: 500, background: "#111114" }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 44, color: "#FF6B35", marginBottom: 12 }}>🏆</div>
          <h2 style={{ ...s.modalTitle, marginBottom: 8 }}>Dein Wochenrückblick</h2>
          <p style={{ ...s.pageSub, fontSize: 13 }}>Tolle Leistung diese Woche!</p>
        </div>
        
        <div style={{ background: "#0D0D0F", border: "1px solid #1E1E24", borderRadius: 16, padding: 20, marginBottom: 24, lineHeight: 1.6, color: "#eee", fontSize: 14 }}>
          {report.split('\n').map((line, i) => <p key={i} style={{ marginBottom: 12 }}>{line}</p>)}
        </div>

        <button style={{ ...s.primaryBtn, width: "100%", justifyContent: "center", padding: 14 }} onClick={onClose}>Schließen</button>
      </div>
    </div>
  );
};

export default WeeklyReportModal;
