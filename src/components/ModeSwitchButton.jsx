import { motion } from "framer-motion";
import { Monitor, Globe, ArrowLeftRight } from "lucide-react";

export default function ModeSwitchButton({ currentMode, onSwitch }) {
  const targetMode = currentMode === "desktop" ? "web" : "desktop";
  const Icon = targetMode === "desktop" ? Monitor : Globe;
  const label = targetMode === "desktop" ? "Desktop OS" : "Web View";

  return (
    <motion.button
      className="fixed bottom-5 left-5 z-[9998] flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium cursor-pointer select-none"
      style={{
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "rgba(255,255,255,0.7)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.4 }}
      whileHover={{
        scale: 1.05,
        background: "rgba(var(--color-primary-rgb),0.2)",
        borderColor: "rgba(var(--color-primary-rgb),0.4)",
        color: "rgba(255,255,255,0.9)",
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onSwitch}
      title={`Switch to ${label}`}
    >
      <ArrowLeftRight className="w-3.5 h-3.5" />
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </motion.button>
  );
}
