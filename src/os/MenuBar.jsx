import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Battery, Search } from "lucide-react";
import { useWindows } from "./WindowContext";
import apps from "../data/apps";
import ThemeToggle from "../components/ui/ThemeToggle";

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
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        <Wifi className="w-[15px] h-[15px] opacity-60" />
        <Battery className="w-[17px] h-[17px] opacity-60" />
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
