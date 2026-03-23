import { motion } from "framer-motion";
import { Monitor, Globe } from "lucide-react";

export default function ModePicker({ onSelect }) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: "radial-gradient(ellipse at 50% 40%, #1a1a2e 0%, #0a0a14 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "60vw",
          height: "40vh",
          background: "radial-gradient(ellipse, rgba(var(--color-primary-rgb),0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative flex flex-col items-center gap-10 px-6">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <img
              src="/profile.jpg"
              alt="Khang Phan"
              className="w-14 h-14 rounded-full object-cover object-top border-2 border-white/10"
            />
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white/90 tracking-tight"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Khang Phan
          </h1>
          <p className="text-sm text-white/40 mt-2">Choose how you'd like to explore</p>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col sm:flex-row gap-5">
          <ModeCard
            icon={<Monitor className="w-8 h-8" />}
            title="Desktop OS"
            description="Interactive macOS-style experience"
            delay={0.35}
            onClick={() => onSelect("desktop")}
          />
          <ModeCard
            icon={<Globe className="w-8 h-8" />}
            title="Web Portfolio"
            description="Classic scrollable landing page"
            delay={0.45}
            onClick={() => onSelect("web")}
          />
        </div>
      </div>
    </motion.div>
  );
}

function ModeCard({ icon, title, description, delay, onClick }) {
  return (
    <motion.button
      className="group relative w-[220px] sm:w-[240px] p-6 rounded-2xl text-left transition-all cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        scale: 1.04,
        borderColor: "rgba(var(--color-primary-rgb),0.5)",
        background: "rgba(var(--color-primary-rgb),0.08)",
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
    >
      <div className="text-[var(--color-primary)] mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white/90 mb-1">{title}</h3>
      <p className="text-xs text-white/40 leading-relaxed">{description}</p>

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          boxShadow: "0 0 40px rgba(var(--color-primary-rgb),0.1), inset 0 0 40px rgba(var(--color-primary-rgb),0.03)",
        }}
      />
    </motion.button>
  );
}
