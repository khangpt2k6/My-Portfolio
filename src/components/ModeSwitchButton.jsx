import { motion } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";

function MiniDesktop() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="2" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 10h4v1.5H5z" fill="currentColor" opacity="0.5" />
      <path d="M4 11.5h6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function MiniBrowser() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="2" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <line x1="1" y1="5" x2="13" y2="5" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <circle cx="3" cy="3.5" r="0.7" fill="currentColor" opacity="0.5" />
      <circle cx="5" cy="3.5" r="0.7" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export default function ModeSwitchButton({ currentMode, onSwitch }) {
  const targetMode = currentMode === "desktop" ? "web" : "desktop";
  const label = targetMode === "desktop" ? "Desktop OS" : "Web View";

  return (
    <motion.button
      className="fixed bottom-5 left-5 z-[9998] flex items-center gap-2 px-3.5 py-2 rounded-full text-[11px] font-medium cursor-pointer select-none"
      style={{
        background: "linear-gradient(145deg, #1e1e30, #141426)",
        boxShadow: "4px 4px 12px rgba(0,0,0,0.5), -3px -3px 10px rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        color: "rgba(255,255,255,0.55)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.4 }}
      whileHover={{
        y: -2,
        color: "rgba(255,255,255,0.9)",
        boxShadow: "4px 4px 12px rgba(0,0,0,0.5), -3px -3px 10px rgba(255,255,255,0.03), 0 0 16px rgba(var(--color-primary-rgb),0.15)",
      }}
      whileTap={{
        boxShadow: "inset 3px 3px 8px rgba(0,0,0,0.4), inset -2px -2px 6px rgba(255,255,255,0.02)",
      }}
      onClick={onSwitch}
      title={`Switch to ${label}`}
    >
      <ArrowLeftRight className="w-3 h-3 opacity-60" />
      {targetMode === "desktop" ? <MiniDesktop /> : <MiniBrowser />}
      <span>{label}</span>
    </motion.button>
  );
}
