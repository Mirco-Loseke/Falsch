import React, { useState, useEffect, useRef } from 'react';
import { s } from './constants/styles';
import { IC } from './constants/icons';
import { defaultData, defaultUser, defaultPRs } from './data/defaults';
import { getInitials, fmtTimer } from './utils/helpers';
import { fbGet, fbSet } from './services/firebase';

// Modular Components
import Dashboard from './components/Dashboard';
import LogWorkout from './components/LogWorkout';
import Plans from './components/Plans';
import LibraryPage from './components/LibraryPage';
import History from './components/History';
import Stats from './components/Stats';
import Nutrition from './components/Nutrition';
import RecipesPage from './components/RecipesPage';
import ProfilePage from './components/ProfilePage';
import GoalsPage from './components/GoalsPage';
import WochenplanPage from './components/WochenplanPage';
import AuthScreen from './components/AuthScreen';
import FitAssistant from './components/FitAssistant';
import WeeklyReportModal from './components/WeeklyReportModal';

const App = () => {
  const [view, setView] = useState("dashboard");
  const [data, setData] = useState(() => {
    const r = localStorage.getItem("ff_data");
    return r ? JSON.parse(r) : defaultData;
  });
  const [user, setUser] = useState(() => {
    const r = localStorage.getItem("ff_user");
    return r ? JSON.parse(r) : defaultUser;
  });
  const [prs, setPrs] = useState(() => {
    const r = localStorage.getItem("ff_prs");
    return r ? JSON.parse(r) : defaultPRs;
  });
  const [nutrition, setNutrition] = useState(() => {
    const r = localStorage.getItem("ff_nutrition");
    return r ? JSON.parse(r) : {};
  });
  const [library, setLibrary] = useState(() => {
    const r = localStorage.getItem("ff_library");
    return r ? JSON.parse(r) : [];
  });
  const [weekPlans, setWeekPlans] = useState(() => {
    const r = localStorage.getItem("ff_week_plans");
    return r ? JSON.parse(r) : {};
  });
  const [favFoods, setFavFoods] = useState(() => {
    const r = localStorage.getItem("ff_fav_foods");
    return r ? JSON.parse(r) : [];
  });
  
  const [authUser, setAuthUser] = useState(() => {
    const r = localStorage.getItem("ff_auth_user");
    return r ? JSON.parse(r) : null;
  });
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [toast, setToast] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(() => {
    const r = localStorage.getItem("ff_active_workout");
    return r ? JSON.parse(r) : null;
  });
  
  const [aiOpen, setAiOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync state to local storage
  useEffect(() => localStorage.setItem("ff_data", JSON.stringify(data)), [data]);
  useEffect(() => localStorage.setItem("ff_user", JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem("ff_prs", JSON.stringify(prs)), [prs]);
  useEffect(() => localStorage.setItem("ff_nutrition", JSON.stringify(nutrition)), [nutrition]);
  useEffect(() => localStorage.setItem("ff_library", JSON.stringify(library)), [library]);
  useEffect(() => localStorage.setItem("ff_week_plans", JSON.stringify(weekPlans)), [weekPlans]);
  useEffect(() => localStorage.setItem("ff_fav_foods", JSON.stringify(favFoods)), [favFoods]);
  useEffect(() => localStorage.setItem("ff_auth_user", JSON.stringify(authUser)), [authUser]);
  useEffect(() => {
    if (activeWorkout) localStorage.setItem("ff_active_workout", JSON.stringify(activeWorkout));
    else localStorage.removeItem("ff_active_workout");
  }, [activeWorkout]);

  // Firebase Realtime (Mocked listener setup)
  useEffect(() => {
     if (authUser && !authUser.guest) {
        // Here we would attach window.firebaseOnSnapshot
        // For now, we rely on the fbGet/fbSet utils in firebase.js
     }
  }, [authUser]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const logout = () => {
    if (confirm("Abmelden?")) {
      setAuthUser(null);
      localStorage.removeItem("ff_auth_user");
    }
  };

  if (!authUser) {
    return <AuthScreen onGuest={() => setAuthUser({ guest: true, email: "Gast-Konto" })} notify={showToast} />;
  }

  const renderView = () => {
    const today = new Date();
    const todayNut = nutrition[today.toISOString().split("T")[0]] || { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    switch (view) {
      case "dashboard":
        return <Dashboard 
          data={data} 
          user={user} 
          onLog={() => { setActiveWorkout(null); setView("log"); }} 
          onView={setView} 
          streak={5} 
          totalVol={0} 
          thisWeek={[]} 
          todayNut={todayNut} 
          isMobile={isMobile} 
        />;
      case "log":
        return <LogWorkout 
          data={data} 
          setData={setData} 
          notify={showToast} 
          prs={prs} 
          onSavePR={(k, v) => setPrs({ ...prs, [k]: v })} 
          library={library} 
          activeWorkout={activeWorkout} 
          setActiveWorkout={setActiveWorkout} 
          setView={setView} 
          isMobile={isMobile} 
        />;
      case "history":
        return <History data={data} setData={setData} notify={showToast} isMobile={isMobile} />;
      case "plans":
        return <Plans data={data} setData={setData} notify={showToast} isMobile={isMobile} />;
      case "library":
        return <LibraryPage library={library} setLibrary={setLibrary} notify={showToast} isMobile={isMobile} />;
      case "stats":
        return <Stats data={data} prs={prs} />;
      case "nutrition":
        return <Nutrition nutrition={nutrition} setNutrition={setNutrition} user={user} favFoods={favFoods} setFavFoods={setFavFoods} notify={showToast} isMobile={isMobile} />;
      case "recipes":
        return <RecipesPage notify={showToast} isMobile={isMobile} />;
      case "profile":
        return <ProfilePage user={user} setUser={setUser} notify={showToast} isMobile={isMobile} />;
      case "progress":
        return <GoalsPage user={user} data={data} prs={prs} isMobile={isMobile} />;
      case "wochenplan":
        return <WochenplanPage data={data} weekPlans={weekPlans} setWeekPlans={setWeekPlans} notify={showToast} isMobile={isMobile} />;
      default:
        return <Dashboard data={data} user={user} onLog={() => setView("log")} onView={setView} streak={5} totalVol={0} thisWeek={[]} todayNut={todayNut} isMobile={isMobile} />;
    }
  };

  return (
    <div style={s.root}>
      {(!isMobile || sidebarOpen) && (
        <aside style={s.sidebar} className={isMobile ? "dropIn" : ""}>
          <div style={s.logo}>
            <div style={{ color: "#FF6B35" }}>{IC.fire}</div>
            <span style={s.logoTxt}>FitForge</span>
            {isMobile && <button onClick={() => setSidebarOpen(false)} style={{ background: "transparent", border: "none", color: "#666", marginLeft: "auto" }}>{IC.x}</button>}
          </div>
          <nav style={s.nav}>
            {[
              ["dashboard","Dashboard",IC.dashboard],
              ["log","Training loggen",IC.log],
              ["history","Verlauf",IC.history],
              ["plans","Trainingspläne",IC.plans],
              ["library","Übungen",IC.library],
              ["wochenplan","Wochenplan",IC.calendar],
              ["nutrition","Ernährung",IC.nutrition],
              ["recipes","Rezepte",IC.recipe],
              ["progress","Fortschritt",IC.progress],
              ["stats","Statistiken",IC.stats]
            ].map(([id,label,icon])=>(
              <button key={id} style={{...s.navItem,...(view===id?s.navOn:{})}} onClick={()=>{setView(id);if(isMobile)setSidebarOpen(false);}}>
                <span style={{display:"flex",flexShrink:0}}>{icon}</span><span>{label}</span>
              </button>
            ))}
          </nav>
          <div style={{ paddingTop: 20 }}>
             <button style={{ ...s.navItem, color: "#FF6B35" }} onClick={() => setAiOpen(true)}>{IC.sparkles} KI-Assistent</button>
             <button style={{ ...s.navItem, color: "#EF476F", marginTop: 20 }} onClick={logout}>{IC.x} Abmelden</button>
          </div>
        </aside>
      )}

      <main style={{ ...s.main, marginLeft: isMobile ? 0 : 236 }}>
        <div style={s.topBar}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {isMobile && <button className="iconBtn" style={s.iconCircle} onClick={() => setSidebarOpen(true)}>{IC.menu}</button>}
            <div style={s.topGreet}>{user.firstName ? `Hey, ${user.firstName}! 👋` : "Hey Athlet! 👋"}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={s.iconCircle} onClick={() => setAiOpen(true)} className="iconBtn">{IC.sparkles}</button>
            <button style={s.avatarBtn} onClick={() => setView('profile')}>
              <span style={s.initials}>{getInitials(user)}</span>
            </button>
          </div>
        </div>

        {toast && <div style={{ ...s.toast, ...(toast.type === "error" ? s.toastErr : {}) }} className="dropIn">{toast.msg}</div>}

        <div className="pageEnter" key={view}>
          {renderView()}
        </div>
      </main>

      {/* Floating Active Workout Timer */}
      {activeWorkout && view !== 'log' && (
        <div style={{
          position: "fixed", bottom: isMobile ? 80 : 22, right: 22, zIndex: 2000, background: "#1A1A1F", border: "1px solid #FF6B35",
          borderRadius: 18, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", backdropFilter: "blur(12px)", boxShadow: "0 10px 40px rgba(255,107,53,0.3)"
        }} className="dropIn" onClick={() => setView('log')}>
          <div style={{ color: "#FF6B35", fontWeight: 800 }}>{fmtTimer(activeWorkout.timer)}</div>
          <div style={{ fontSize: 11, color: "#fff" }}>Aktiv: {activeWorkout.name}</div>
        </div>
      )}

      {/* AI Assistant Modal */}
      {aiOpen && (
        <div style={s.overlay2} onClick={() => setAiOpen(false)}>
          <div onClick={e => e.stopPropagation()}>
            <FitAssistant data={data} user={user} prs={prs} onClose={() => setAiOpen(false)} isMobile={isMobile} />
          </div>
        </div>
      )}

      {/* Weekly Report Modal */}
      {reportData && <WeeklyReportModal report={reportData} onClose={() => setReportData(null)} isMobile={isMobile} />}
    </div>
  );
};

export default App;
