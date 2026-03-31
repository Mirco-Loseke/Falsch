const API_URL = "https://fitforge-ai-worker.mirco-loseke.workers.dev/";

export const FitAssistantService = {
  async ask(query, context) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, context })
      });
      if (!res.ok) throw new Error("KI-Fehler: " + res.status);
      const data = await res.json();
      return data.response;
    } catch (e) {
      console.error("AI Assistant Error:", e);
      return "Entschuldigung, ich habe gerade Verbindungsschwierigkeiten. Bitte versuche es gleich noch einmal!";
    }
  },

  generateWeeklyReport(workouts, user) {
    if (!workouts.length) return "Noch nicht genug Daten für einen Bericht!";
    // Logic for report generation
    return "Dein wöchentlicher Fortschritt sieht super aus! Du hast dein Volumen gesteigert...";
  }
};
