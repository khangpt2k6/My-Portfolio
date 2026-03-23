import { motion } from "framer-motion";
import { useWindows } from "./WindowContext";

export default function DesktopIcon({ app, index }) {
  const { openApp } = useWindows();
  const Icon = app.icon;

  return (
    <motion.button
      className="flex flex-col items-center gap-1 w-[76px] py-1.5 rounded-lg
                 hover:bg-white/10 transition-colors group"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 + index * 0.03, type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => openApp(app.id)}
      onDoubleClick={() => openApp(app.id)}
      whileTap={{ scale: 0.92 }}
    >
      <div
        className="w-[52px] h-[52px] rounded-[12px] flex items-center justify-center
                   shadow-md group-hover:shadow-lg transition-shadow relative overflow-hidden"
        style={{
          background: `linear-gradient(145deg, ${app.color}ee, ${app.color}bb)`,
          boxShadow: `0 2px 6px ${app.color}30, 0 4px 12px rgba(0,0,0,0.2)`,
        }}
      >
        {/* Glossy overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 45%)",
            borderRadius: "inherit",
          }}
        />
        <Icon className="w-6 h-6 text-white relative z-10 drop-shadow-sm" strokeWidth={1.6} />
      </div>
      <span
        className="text-[11px] font-medium text-center leading-tight
                   line-clamp-2 max-w-[72px]"
        style={{
          color: "rgba(255,255,255,0.85)",
          textShadow: "0 1px 4px rgba(0,0,0,0.7)",
        }}
      >
        {app.title}
      </span>
    </motion.button>
  );
}
