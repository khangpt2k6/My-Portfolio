import { motion } from "framer-motion";
import { useWindows } from "./WindowContext";

export default function DesktopIcon({ app, index }) {
  const { openApp } = useWindows();
  const Icon = app.IconComponent;

  return (
    <motion.button
      className="flex flex-col items-center gap-0.5 w-[68px] py-1 rounded-lg
                 hover:bg-white/10 transition-colors group"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 + index * 0.03, type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => openApp(app.id)}
      whileTap={{ scale: 0.92 }}
    >
      <div className="w-[44px] h-[44px] group-hover:brightness-110 transition-all drop-shadow-md group-hover:drop-shadow-lg">
        <Icon size={44} />
      </div>
      <span
        className="text-[10px] font-medium text-center leading-tight
                   line-clamp-1 max-w-[64px]"
        style={{
          color: "var(--lg-icon-text)",
          textShadow: "var(--lg-icon-shadow)",
        }}
      >
        {app.title}
      </span>
    </motion.button>
  );
}
