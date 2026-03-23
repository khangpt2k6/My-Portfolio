import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Wifi, Battery, Signal } from "lucide-react";
import apps from "../data/apps";
import { useWindows } from "./WindowContext";

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

const DOCK_APPS = ["about", "projects", "terminal", "settings"];

function StatusBar() {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div className="flex items-center justify-between px-6 py-2 text-white text-xs font-medium">
      <span>{time}</span>
      <div className="flex items-center gap-1.5">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <Battery className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}

export default function MobileOS() {
  const [activeApp, setActiveApp] = useState(null);

  const openApp = useCallback((id) => setActiveApp(id), []);
  const closeApp = useCallback(() => setActiveApp(null), []);

  const AppComponent = activeApp ? appComponents[activeApp] : null;
  const activeAppData = activeApp ? apps.find((a) => a.id === activeApp) : null;

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      <StatusBar />

      {/* Home screen */}
      <div className="flex-1 px-6 pt-4 pb-4 overflow-auto">
        <div className="grid grid-cols-4 gap-y-6 gap-x-4 justify-items-center">
          {apps.map((app, i) => {
            const IconComp = app.IconComponent;
            return (
              <motion.button
                key={app.id}
                className="flex flex-col items-center gap-1.5"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => openApp(app.id)}
                whileTap={{ scale: 0.9 }}
              >
                <div className="w-14 h-14 drop-shadow-lg">
                  <IconComp size={56} />
                </div>
                <span className="text-[10px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]
                               line-clamp-1 max-w-[60px] text-center">
                  {app.title}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom dock */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-around py-2 px-4 rounded-2xl"
          style={{ background: "rgba(30,30,30,0.45)", backdropFilter: "blur(40px)" }}>
          {DOCK_APPS.map((id) => {
            const app = apps.find((a) => a.id === id);
            if (!app) return null;
            const IconComp = app.IconComponent;
            return (
              <button key={id} onClick={() => openApp(id)} className="p-2">
                <div className="w-12 h-12 drop-shadow-lg">
                  <IconComp size={48} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active app overlay */}
      <AnimatePresence>
        {activeApp && AppComponent && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: "var(--window-bg)" }}
            initial={{ scale: 0.9, opacity: 0, borderRadius: "20px" }}
            animate={{ scale: 1, opacity: 1, borderRadius: "0px" }}
            exit={{ scale: 0.9, opacity: 0, borderRadius: "20px" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          >
            {/* App header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)]"
              style={{ background: "var(--window-bg)" }}>
              <button onClick={closeApp} className="flex items-center gap-1 text-[var(--color-primary)]">
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <span className="flex-1 text-center text-sm font-semibold text-[var(--color-text)] pr-12">
                {activeAppData?.title}
              </span>
            </div>

            {/* App content */}
            <div className="flex-1 overflow-auto">
              <AppComponent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
