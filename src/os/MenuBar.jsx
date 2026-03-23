import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Search } from "lucide-react";
import { useWindows } from "./WindowContext";
import apps from "../data/apps";
import ThemeToggle from "../components/ui/ThemeToggle";

function useBattery() {
  const [battery, setBattery] = useState({ level: 1, charging: false, supported: false });
  useEffect(() => {
    let batt = null;
    const update = () => {
      if (batt) setBattery({ level: batt.level, charging: batt.charging, supported: true });
    };
    if (navigator.getBattery) {
      navigator.getBattery().then((b) => {
        batt = b;
        update();
        b.addEventListener("levelchange", update);
        b.addEventListener("chargingchange", update);
      });
    }
    return () => {
      if (batt) {
        batt.removeEventListener("levelchange", update);
        batt.removeEventListener("chargingchange", update);
      }
    };
  }, []);
  return battery;
}

function BatteryIcon({ level, charging }) {
  const pct = Math.round(level * 100);
  const fill = pct <= 20 ? "#EF4444" : pct <= 50 ? "#FBBF24" : "#34D399";
  return (
    <div className="flex items-center gap-1 opacity-70">
      <svg width="20" height="11" viewBox="0 0 20 11" fill="none">
        {/* Battery body */}
        <rect x="0.5" y="0.5" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
        {/* Battery tip */}
        <rect x="17" y="3" width="2.5" height="5" rx="1" fill="currentColor" opacity="0.4" />
        {/* Fill level */}
        <rect x="2" y="2" width={Math.max(0, 13 * level)} height="7" rx="1" fill={fill} />
        {/* Charging bolt */}
        {charging && (
          <path d="M9 1.5L6.5 5.5H9L8 9.5L11.5 5H9L9 1.5Z" fill="currentColor" />
        )}
      </svg>
      <span className="text-[10px] font-medium">{pct}%</span>
    </div>
  );
}

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const tmFmt = time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <span className="text-[13px] font-medium whitespace-nowrap">
      {fmt}&ensp;{tmFmt}
    </span>
  );
}

export default function MenuBar() {
  const { focusedWindow, openApp } = useWindows();
  const [appleMenu, setAppleMenu] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark((d) => !d);
  };

  const battery = useBattery();
  const activeApp = apps.find((a) => a.id === focusedWindow);

  return (
    <motion.div
      className="absolute top-0 left-0 right-0 h-7 flex items-center justify-between px-4 z-[9500] select-none"
      style={{
        background: isDark
          ? "rgba(20, 20, 20, 0.65)"
          : "rgba(240, 240, 240, 0.7)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        borderBottom: isDark
          ? "0.5px solid rgba(255,255,255,0.08)"
          : "0.5px solid rgba(0,0,0,0.1)",
        color: isDark ? "#e0e0e0" : "#1a1a1a",
      }}
      initial={{ y: -28 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Left */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <button
            className="text-[15px] font-bold opacity-80 hover:opacity-100 transition-opacity leading-none"
            style={{ fontFamily: "Syne, sans-serif" }}
            onClick={() => setAppleMenu(!appleMenu)}
          >
            KP
          </button>

          <AnimatePresence>
            {appleMenu && (
              <>
                <div className="absolute inset-0 z-[9998]" style={{ position: "fixed" }} onClick={() => setAppleMenu(false)} />
                <motion.div
                  className="absolute top-full left-0 mt-1 rounded-lg py-1 min-w-[200px] z-[9999]"
                  style={{
                    background: isDark ? "rgba(30,30,30,0.9)" : "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(40px)",
                    border: isDark ? "0.5px solid rgba(255,255,255,0.12)" : "0.5px solid rgba(0,0,0,0.12)",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                  }}
                  initial={{ opacity: 0, y: -4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.96 }}
                  transition={{ duration: 0.12 }}
                >
                  <MenuBarItem label="About This Mac" onClick={() => { openApp("about"); setAppleMenu(false); }} />
                  <div className="h-px mx-2 my-0.5" style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
                  <MenuBarItem label="System Settings…" onClick={() => { openApp("settings"); setAppleMenu(false); }} />
                  <MenuBarItem label="Open Terminal" onClick={() => { openApp("terminal"); setAppleMenu(false); }} />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <span className="text-[13px] font-semibold opacity-90">
          {activeApp?.title || "Finder"}
        </span>

        {activeApp && (
          <div className="hidden md:flex items-center gap-4 text-[13px] opacity-50">
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Window</span>
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div style={{ transform: "scale(1.4)", transformOrigin: "center" }}>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </div>
        <Wifi className="w-[15px] h-[15px] opacity-60" />
        <BatteryIcon level={battery.level} charging={battery.charging} />
        <Clock />
      </div>
    </motion.div>
  );
}

function MenuBarItem({ label, onClick }) {
  return (
    <button
      className="w-full text-left px-3 py-1 text-[13px]
                 hover:bg-[var(--color-primary)] hover:text-white rounded-[4px] mx-1
                 transition-colors"
      style={{ width: "calc(100% - 8px)" }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
