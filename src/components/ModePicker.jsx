import { useState } from "react";
import { motion } from "framer-motion";

/* ── Floating particle ── */
function Particle({ delay, x, y, size }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: "rgba(var(--color-primary-rgb), 0.15)",
        filter: "blur(1px)",
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0, 0.8, 0],
        scale: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* ── macOS-style Desktop icon ── */
function DesktopSVG() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* Monitor body */}
      <rect x="6" y="6" width="36" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Screen content */}
      <rect x="9" y="9" width="30" height="18" rx="1" fill="currentColor" opacity="0.08" />
      {/* Menu bar */}
      <rect x="9" y="9" width="30" height="3" rx="0.5" fill="currentColor" opacity="0.15" />
      {/* Dock */}
      <rect x="14" y="24" width="20" height="2" rx="1" fill="currentColor" opacity="0.12" />
      {/* Stand */}
      <path d="M19 32h10v3H19z" fill="currentColor" opacity="0.3" />
      <path d="M15 35h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      {/* Window on screen */}
      <rect x="12" y="13" width="12" height="9" rx="1" fill="currentColor" opacity="0.12" />
      <rect x="12" y="13" width="12" height="2" rx="1" fill="currentColor" opacity="0.2" />
      {/* Traffic lights */}
      <circle cx="14" cy="14" r="0.7" fill="#FF5F57" />
      <circle cx="16.2" cy="14" r="0.7" fill="#FEBC2E" />
      <circle cx="18.4" cy="14" r="0.7" fill="#28C840" />
    </svg>
  );
}

/* ── Globe/Browser icon ── */
function BrowserSVG() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* Browser window */}
      <rect x="6" y="8" width="36" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Tab bar */}
      <rect x="6" y="8" width="36" height="7" rx="4" fill="currentColor" opacity="0.1" />
      <line x1="6" y1="15" x2="42" y2="15" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      {/* Traffic lights */}
      <circle cx="12" cy="11.5" r="1.5" fill="#FF5F57" />
      <circle cx="16.5" cy="11.5" r="1.5" fill="#FEBC2E" />
      <circle cx="21" cy="11.5" r="1.5" fill="#28C840" />
      {/* URL bar */}
      <rect x="26" y="10" width="13" height="3" rx="1.5" fill="currentColor" opacity="0.08" />
      {/* Content - globe */}
      <circle cx="24" cy="28" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      <ellipse cx="24" cy="28" rx="5" ry="9" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.2" />
      <line x1="15" y1="28" x2="33" y2="28" stroke="currentColor" strokeWidth="1.2" opacity="0.2" />
      <line x1="17" y1="23" x2="31" y2="23" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <line x1="17" y1="33" x2="31" y2="33" stroke="currentColor" strokeWidth="1" opacity="0.15" />
    </svg>
  );
}

/* ── Neumorphic Card ── */
function NeuCard({ icon, title, delay, onClick, index }) {
  const [pressed, setPressed] = useState(false);

  return (
    <motion.button
      className="group relative w-[260px] sm:w-[280px] rounded-[28px] text-left cursor-pointer overflow-hidden"
      style={{
        background: `
          linear-gradient(155deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 55%, rgba(0,0,0,0.2) 100%),
          linear-gradient(145deg, #171728, #111120)
        `,
        boxShadow: pressed
          ? "inset 6px 6px 16px rgba(0,0,0,0.5), inset -4px -4px 12px rgba(255,255,255,0.03)"
          : "8px 8px 24px rgba(0,0,0,0.6), -6px -6px 20px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: 0,
        transition: "box-shadow 0.2s ease",
      }}
      initial={{ opacity: 0, y: 50, rotateX: 15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        delay,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6 }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={onClick}
    >
      {/* Constant neon sweep */}
      <motion.div
        className="absolute -inset-14 pointer-events-none"
        style={{
          background:
            "linear-gradient(115deg, transparent 35%, rgba(var(--color-primary-rgb),0.14) 50%, transparent 65%)",
          filter: "blur(10px)",
        }}
        animate={{ x: ["-30%", "30%", "-30%"] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
      />

      {/* Top glow strip on hover */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[28px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb),0.5), transparent)" }}
        initial={{ opacity: 0, scaleX: 0 }}
        whileHover={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />

      <div className="p-7">
        {/* Icon container — neumorphic inset */}
        <motion.div
          className="relative w-[76px] h-[76px] rounded-[20px] flex items-center justify-center mb-5"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))",
            boxShadow: "inset 4px 4px 10px rgba(0,0,0,0.4), inset -3px -3px 8px rgba(255,255,255,0.04)",
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <motion.div
            className="absolute inset-0 rounded-[20px]"
            style={{ border: "1px solid rgba(var(--color-primary-rgb), 0.28)" }}
            animate={{ scale: [1, 1.16, 1], opacity: [0.45, 0.08, 0.45] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: index * 0.25 }}
          />
          <motion.div
            className="text-[var(--color-primary)]"
            animate={{
              filter: [
                "drop-shadow(0 0 4px rgba(var(--color-primary-rgb),0.2))",
                "drop-shadow(0 0 12px rgba(var(--color-primary-rgb),0.4))",
                "drop-shadow(0 0 4px rgba(var(--color-primary-rgb),0.2))",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
          >
            {icon}
          </motion.div>

          <div
            className="absolute -inset-[1px] rounded-[20px] pointer-events-none"
            style={{
              border: "1px solid rgba(var(--color-primary-rgb), 0.22)",
              boxShadow: "0 0 18px rgba(var(--color-primary-rgb), 0.14)",
            }}
          />
        </motion.div>

        {/* Text */}
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white/90 tracking-tight">{title}</h3>
          <span
            className="text-[10px] uppercase tracking-[0.16em]"
            style={{ color: "rgba(var(--color-secondary-rgb),0.85)" }}
          >
            Mode
          </span>
        </div>
        <p className="text-[12px] text-white/45">Interactive frontend experience</p>

        {/* CTA arrow */}
        <motion.div
          className="mt-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)] opacity-70 group-hover:opacity-100"
          initial={false}
          transition={{ duration: 0.2 }}
        >
          <span>Launch</span>
          <motion.svg
            width="14" height="14" viewBox="0 0 14 14" fill="none"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </motion.div>
      </div>

      {/* Radial glow on hover */}
      <div
        className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(var(--color-primary-rgb),0.1), transparent 72%)",
        }}
      />
    </motion.button>
  );
}

/* ── Main ModePicker ── */
export default function ModePicker({ onSelect }) {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 2.5,
  }));

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 22% 20%, rgba(var(--color-secondary-rgb),0.12) 0%, transparent 45%),
          radial-gradient(ellipse at 80% 78%, rgba(var(--color-primary-rgb),0.16) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 30%, #131324 0%, #0a0a16 62%, #060610 100%)
        `,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated particles */}
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      {/* Dual ambient glows */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: "50vw",
          height: "50vh",
          left: "10%",
          top: "20%",
          background: "radial-gradient(ellipse, rgba(var(--color-primary-rgb),0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: "40vw",
          height: "40vh",
          right: "10%",
          bottom: "15%",
          background: "radial-gradient(ellipse, rgba(var(--color-secondary-rgb),0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Content */}
      <div className="relative flex flex-col items-center gap-12 px-6" style={{ perspective: "1200px" }}>
        {/* Profile + Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Avatar with neumorphic ring */}
          <motion.div
            className="mx-auto mb-5 w-[82px] h-[82px] rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(145deg, #1e1e30, #141426)",
              boxShadow: "6px 6px 18px rgba(0,0,0,0.5), -4px -4px 14px rgba(255,255,255,0.04)",
            }}
            animate={{ boxShadow: [
              "6px 6px 18px rgba(0,0,0,0.5), -4px -4px 14px rgba(255,255,255,0.04)",
              "6px 6px 18px rgba(0,0,0,0.5), -4px -4px 14px rgba(255,255,255,0.04), 0 0 20px rgba(var(--color-primary-rgb),0.15)",
              "6px 6px 18px rgba(0,0,0,0.5), -4px -4px 14px rgba(255,255,255,0.04)",
            ]}}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src="/profile.jpg"
              alt="Khang Phan"
              className="w-[70px] h-[70px] rounded-full object-cover object-top"
              style={{
                boxShadow: "inset 0 0 10px rgba(0,0,0,0.3)",
              }}
            />
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{
              fontFamily: "Syne, sans-serif",
              background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Khang Phan
          </motion.h1>

          <motion.p
            className="text-sm mt-2.5 tracking-wide"
            style={{ color: "rgba(255,255,255,0.42)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            Pick your interface
          </motion.p>

          {/* Neumorphic divider line */}
          <motion.div
            className="mx-auto mt-5 rounded-full"
            style={{
              width: 60,
              height: 3,
              background: "linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb),0.3), transparent)",
              boxShadow: "0 1px 6px rgba(var(--color-primary-rgb),0.15)",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          />
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col sm:flex-row gap-6">
          <NeuCard
            icon={<DesktopSVG />}
            title="Desktop App"
            delay={0.4}
            index={0}
            onClick={() => onSelect("desktop")}
          />
          <NeuCard
            icon={<BrowserSVG />}
            title="Web Browser"
            delay={0.55}
            index={1}
            onClick={() => onSelect("web")}
          />
        </div>
      </div>
    </motion.div>
  );
}
