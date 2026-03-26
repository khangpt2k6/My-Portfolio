import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Wifi, Battery, Signal } from "lucide-react";
import apps from "../data/apps";

/* ── App components map ── */
import AboutApp from "../apps/AboutApp";
import ProjectsApp from "../apps/ProjectsApp";
import ExperienceApp from "../apps/ExperienceApp";
import SkillsApp from "../apps/SkillsApp";
import ContactApp from "../apps/ContactApp";
import EducationApp from "../apps/EducationApp";
import TerminalApp from "../apps/TerminalApp";
import LabApp from "../apps/LabApp";
import MusicApp from "../apps/MusicApp";
import SettingsApp from "../apps/SettingsApp";
import ResumeApp from "../apps/ResumeApp";

const appComponents = {
  about: AboutApp,
  projects: ProjectsApp,
  experience: ExperienceApp,
  skills: SkillsApp,
  contact: ContactApp,
  education: EducationApp,
  terminal: TerminalApp,
  lab: LabApp,
  music: MusicApp,
  settings: SettingsApp,
  resume: ResumeApp,
};

/* Short labels for mobile */
const MOBILE_LABELS = {
  about: "About Me",
  projects: "Projects",
  experience: "Calendar",
  skills: "App Store",
  contact: "Mail",
  education: "Education",
  terminal: "Terminal",
  lab: "Lab",
  music: "Music",
  settings: "Settings",
  resume: "Resume",
  browser: "Safari",
};

const DOCK_APPS = ["about", "projects", "terminal", "settings"];

/* ── Status Bar ── */
function StatusBar() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex items-center justify-between px-7 pt-3 pb-1 z-10">
      <span className="text-white text-[15px] font-semibold tracking-tight">{time}</span>
      {/* Dynamic island pill */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-2 w-[90px] h-[24px] rounded-full"
        style={{ background: "#000" }}
      />
      <div className="flex items-center gap-[3px]">
        <Signal className="w-[15px] h-[15px] text-white" strokeWidth={2.5} />
        <Wifi className="w-[15px] h-[15px] text-white" strokeWidth={2.5} />
        <div className="flex items-center ml-0.5">
          <Battery className="w-[18px] h-[18px] text-white" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function MobileOS() {
  const [activeApp, setActiveApp] = useState(null);

  const openApp = useCallback((id) => setActiveApp(id), []);
  const closeApp = useCallback(() => setActiveApp(null), []);

  const AppComponent = activeApp ? appComponents[activeApp] : null;
  const activeAppData = activeApp ? apps.find((a) => a.id === activeApp) : null;

  /* Only show apps that have a component */
  const gridApps = apps.filter((a) => appComponents[a.id]);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      <StatusBar />

      {/* ── Home screen ── */}
      <div className="flex-1 flex flex-col min-h-0 pt-6 pb-2">
        {/* App grid */}
        <div className="flex-1 px-7 overflow-auto">
          <div className="grid grid-cols-4 gap-y-7 gap-x-5 justify-items-center">
            {gridApps.map((app, i) => {
              const IconComp = app.IconComponent;
              return (
                <motion.button
                  key={app.id}
                  className="flex flex-col items-center gap-[6px] active:scale-90 transition-transform"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.035, type: "spring", stiffness: 350, damping: 25 }}
                  onClick={() => openApp(app.id)}
                >
                  <div className="w-[60px] h-[60px] drop-shadow-lg rounded-[14px] overflow-hidden">
                    <IconComp size={60} />
                  </div>
                  <span
                    className="text-[11px] font-medium text-white/90 leading-tight text-center
                               max-w-[68px] truncate"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
                  >
                    {MOBILE_LABELS[app.id] || app.title}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Page dots + search */}
          <div className="flex flex-col items-center gap-3 mt-8 mb-4">
            <div className="flex items-center gap-[5px]">
              <div className="w-[6px] h-[6px] rounded-full bg-white" />
              <div className="w-[6px] h-[6px] rounded-full bg-white/30" />
              <div className="w-[6px] h-[6px] rounded-full bg-white/30" />
            </div>
            <div
              className="w-[120px] h-[28px] rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}
            >
              <span className="text-[12px] font-medium text-white/60">Search</span>
            </div>
          </div>
        </div>

        {/* ── Dock ── */}
        <div className="px-4 pb-1 pt-2 shrink-0">
          <div
            className="flex items-center justify-around py-2.5 px-5 rounded-[22px] mx-auto"
            style={{
              background: "rgba(50,50,60,0.55)",
              backdropFilter: "blur(50px)",
              WebkitBackdropFilter: "blur(50px)",
              border: "0.5px solid rgba(255,255,255,0.12)",
              maxWidth: 320,
            }}
          >
            {DOCK_APPS.map((id) => {
              const app = apps.find((a) => a.id === id);
              if (!app) return null;
              const IconComp = app.IconComponent;
              return (
                <motion.button
                  key={id}
                  onClick={() => openApp(id)}
                  className="p-1 active:scale-90 transition-transform"
                  whileTap={{ scale: 0.85 }}
                >
                  <div className="w-[50px] h-[50px] drop-shadow-lg rounded-[12px] overflow-hidden">
                    <IconComp size={50} />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Home indicator */}
          <div className="flex justify-center mt-2.5 pb-1">
            <div className="w-[120px] h-[4px] rounded-full bg-white/30" />
          </div>
        </div>
      </div>

      {/* ── Active app overlay ── */}
      <AnimatePresence>
        {activeApp && AppComponent && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: "var(--window-bg, #fff)" }}
            initial={{ y: "100%", borderRadius: "24px" }}
            animate={{ y: 0, borderRadius: "0px" }}
            exit={{ y: "100%", borderRadius: "24px" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            {/* App header bar */}
            <div
              className="flex items-center gap-2 px-4 py-3 shrink-0"
              style={{
                borderBottom: "0.5px solid var(--color-border, #e5e5ea)",
                background: "var(--window-bg, #fff)",
              }}
            >
              <button
                onClick={closeApp}
                className="flex items-center gap-0.5 text-[var(--color-primary)] active:opacity-50 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-[15px] font-normal">Back</span>
              </button>
              <span className="flex-1 text-center text-[15px] font-semibold text-[var(--color-text)] -ml-12">
                {activeAppData?.title}
              </span>
            </div>

            {/* App content */}
            <div className="flex-1 overflow-auto">
              <AppComponent />
            </div>

            {/* Bottom home indicator */}
            <div className="flex justify-center pb-2 pt-1 shrink-0" style={{ background: "var(--window-bg, #fff)" }}>
              <div className="w-[120px] h-[4px] rounded-full bg-[var(--color-text)]/20" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
