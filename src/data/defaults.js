export const defaultData = {
  plans: [
    { id: 1, name: "Push Pull Legs", color: "#FF6B35", days: ["Montag", "Mittwoch", "Freitag"], exercises: [{ name: "Bankdrücken", photo: null }, { name: "Schulterdrücken", photo: null }, { name: "Kniebeugen", photo: null }, { name: "Kreuzheben", photo: null }] },
    { id: 2, name: "Upper / Lower", color: "#00D9C0", days: ["Dienstag", "Donnerstag"], exercises: [{ name: "Klimmzüge", photo: null }, { name: "Rudern", photo: null }, { name: "Beinpresse", photo: null }] }
  ],
  workouts: [
    { id: 1, date: "2025-03-10", planId: 1, name: "Push Day", duration: 65, exercises: [{ name: "Bankdrücken", sets: [{ reps: 8, weight: 80 }, { reps: 8, weight: 80 }, { reps: 6, weight: 85 }] }, { name: "Schulterdrücken", sets: [{ reps: 10, weight: 50 }, { reps: 10, weight: 50 }] }], photo: null, note: "Starke Session!" },
    { id: 2, date: "2025-03-12", planId: 1, name: "Pull Day", duration: 55, exercises: [{ name: "Klimmzüge", sets: [{ reps: 10, weight: 0 }, { reps: 9, weight: 0 }, { reps: 8, weight: 0 }] }], photo: null, note: "" },
    { id: 3, date: "2025-03-14", planId: 2, name: "Upper Body", duration: 72, exercises: [{ name: "Bankdrücken", sets: [{ reps: 8, weight: 82.5 }, { reps: 8, weight: 82.5 }, { reps: 7, weight: 82.5 }] }], photo: null, note: "" },
    { id: 4, date: "2025-03-08", planId: 1, name: "Leg Day", duration: 60, exercises: [{ name: "Kniebeugen", sets: [{ reps: 8, weight: 100 }, { reps: 8, weight: 100 }, { reps: 6, weight: 105 }] }], photo: null, note: "" },
    { id: 5, date: "2025-03-06", planId: 2, name: "Pull", duration: 50, exercises: [{ name: "Klimmzüge", sets: [{ reps: 12, weight: 0 }, { reps: 10, weight: 0 }] }, { name: "Rudern", sets: [{ reps: 10, weight: 60 }, { reps: 10, weight: 60 }] }], photo: null, note: "" }
  ],
  weightHistory: [],
  photos: [],
  measurements: []
};

export const defaultUser = {
  firstName: "",
  lastName: "",
  email: "",
  weight: "",
  height: "",
  goal: "Muskelaufbau",
  avatar: null,
  notificationsEnabled: true,
  reminderTime: "08:00",
  calorieGoal: 2500,
  proteinGoal: 150,
  workDays: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"],
  workStart: "08:00",
  workEnd: "17:00",
  break1Start: "09:30",
  break1End: "10:00",
  break2Start: "12:30",
  break2End: "13:15"
};

export const defaultPRs = {
  "bankdrücken": { name: "Bankdrücken", weight: 85, reps: 6, date: "2025-03-10" },
  "kniebeugen": { name: "Kniebeugen", weight: 105, reps: 6, date: "2025-03-08" }
};

export const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
export const FULL_WEEKDAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
export const EQUIPMENT_OPTIONS = ["Kurzhantel", "Langhantel", "Ergometer", "Walking Pad", "Laufband", "Stretching Band"];
export const MEAL_PRESETS = ["Frühstück", "Mittagessen", "Abendessen", "Snack", "Getränk", "Supplement"];
export const ENTRY_TYPES = {
  training: { label: "Training", icon: "💪", color: "#FF6B35", bg: "rgba(255,107,53,0.1)" },
  meal: { label: "Essen", icon: "🍱", color: "#00D9C0", bg: "rgba(0,217,192,0.1)" },
  rest: { label: "Pause", icon: "💤", color: "#A78BFA", bg: "rgba(167,139,250,0.1)" },
  other: { label: "Andere", icon: "📝", color: "#FFD166", bg: "rgba(255,209,102,0.1)" }
};
