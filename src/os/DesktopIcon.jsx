import { motion } from "framer-motion";
import { useWindows } from "./WindowContext";

export default function DesktopIcon({ app, index }) {
  const { openApp } = useWindows();
  const Icon = app.IconComponent;

  return (
    <motion.button
      className="flex flex-col items-center gap-1 w-[76px] py-1.5 rounded-lg
                 hover:bg-white/10 transition-colors group"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 + index * 0.03, type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => openApp(app.id)}
      whileTap={{ scale: 0.92 }}
    >
      <div className="w-[52px] h-[52px] group-hover:brightness-110 transition-all drop-shadow-md group-hover:drop-shadow-lg">
        <Icon size={52} />
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
