import { motion, AnimatePresence } from "framer-motion";

/**
 * Morphing Sun/Moon Theme Toggle
 * Matches the navbar pill button style (same height as Theme/Music buttons).
 */
const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <motion.button
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex items-center justify-center rounded-full bg-[var(--color-surface2)] border border-[var(--color-border)] backdrop-blur-xl cursor-pointer overflow-hidden"
      style={{ width: 32, height: 18, padding: 2 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* Background scene — sky/night gradient */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          background: isDark
            ? "linear-gradient(135deg, #0f172a, #1e293b)"
            : "linear-gradient(135deg, #bae6fd, #7dd3fc)",
        }}
        transition={{ duration: 0.5 }}
        style={{ opacity: 0.5 }}
      />

      {/* Stars (dark mode) */}
      <AnimatePresence>
        {isDark && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="absolute w-[2px] h-[2px] rounded-full bg-white/80"
              style={{ top: 3, left: 5 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="absolute w-[1.5px] h-[1.5px] rounded-full bg-white/60"
              style={{ top: 12, left: 8 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="absolute w-[1.5px] h-[1.5px] rounded-full bg-white/50"
              style={{ top: 5, left: 12 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Orb — slides between sun and moon */}
      <motion.div
        className="absolute flex items-center justify-center"
        animate={{
          left: isDark ? 16 : 2,
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 24,
          mass: 0.7,
        }}
        style={{
          width: 14,
          height: 14,
          top: 2,
          borderRadius: "50%",
        }}
      >
        <AnimatePresence mode="wait">
          {!isDark ? (
            <motion.div
              key="sun"
              initial={{ scale: 0.4, opacity: 0, rotate: -60 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.4, opacity: 0, rotate: 60 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                {/* Rays */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <motion.line
                    key={angle}
                    x1={12 + 7.5 * Math.cos((angle * Math.PI) / 180)}
                    y1={12 + 7.5 * Math.sin((angle * Math.PI) / 180)}
                    x2={12 + 10 * Math.cos((angle * Math.PI) / 180)}
                    y2={12 + 10 * Math.sin((angle * Math.PI) / 180)}
                    stroke="#FBBF24"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.08 + (angle / 360) * 0.15, duration: 0.25 }}
                  />
                ))}
                {/* Sun body */}
                <circle cx="12" cy="12" r="5" fill="url(#sunGrad)" />
                <defs>
                  <radialGradient id="sunGrad" cx="0.35" cy="0.35">
                    <stop offset="0%" stopColor="#FDE68A" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </radialGradient>
                </defs>
              </svg>
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ scale: 0.4, opacity: 0, rotate: 60 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.4, opacity: 0, rotate: -60 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path
                  d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                  fill="url(#moonGrad)"
                />
                {/* Craters */}
                <circle cx="12" cy="10" r="1.1" fill="rgba(148,163,184,0.35)" />
                <circle cx="15" cy="14" r="0.7" fill="rgba(148,163,184,0.25)" />
                <circle cx="10.5" cy="15" r="0.5" fill="rgba(148,163,184,0.2)" />
                <defs>
                  <radialGradient id="moonGrad" cx="0.3" cy="0.3">
                    <stop offset="0%" stopColor="#E2E8F0" />
                    <stop offset="100%" stopColor="#CBD5E1" />
                  </radialGradient>
                </defs>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
