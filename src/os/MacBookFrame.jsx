import { motion } from "framer-motion";

/**
 * Wraps the desktop in a realistic MacBook Pro frame.
 * The children render INSIDE the screen.
 */
export default function MacBookFrame({ children }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
      }}
    >
      {/* Ambient glow behind MacBook */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "80vw",
          height: "60vh",
          background: "radial-gradient(ellipse, rgba(var(--color-primary-rgb),0.08) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── MacBook Device ── */}
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ── Screen assembly ── */}
        <div
          className="relative rounded-[14px] overflow-hidden"
          style={{
            background: "#0a0a0a",
            padding: "10px 10px 6px 10px",
            boxShadow: `
              0 0 0 1px rgba(255,255,255,0.06),
              0 20px 80px rgba(0,0,0,0.6),
              0 0 120px rgba(var(--color-primary-rgb),0.04)
            `,
          }}
        >
          {/* Camera notch */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
            style={{
              width: 100,
              height: 10,
              background: "#0a0a0a",
              borderRadius: "0 0 10px 10px",
            }}
          >
            <div
              className="w-[5px] h-[5px] rounded-full"
              style={{ background: "#1a1a1a", boxShadow: "0 0 3px rgba(0,180,0,0.15)" }}
            />
          </div>

          {/* Screen viewport — the actual desktop renders here */}
          <div
            className="relative overflow-hidden rounded-[6px]"
            style={{
              width: "clamp(600px, 88vw, 1280px)",
              height: "clamp(375px, min(56vw, 82vh), 800px)",
            }}
          >
            {children}
          </div>
        </div>

        {/* ── Hinge ── */}
        <div
          style={{
            width: "clamp(620px, 90vw, 1310px)",
            height: 8,
            background: "linear-gradient(180deg, #3a3a3e 0%, #2a2a2e 50%, #222226 100%)",
            borderRadius: "0 0 2px 2px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
          }}
        />

        {/* ── Base (bottom chassis) ── */}
        <div
          className="relative"
          style={{
            width: "clamp(660px, 96vw, 1400px)",
            height: 12,
            background: "linear-gradient(180deg, #6e6e72 0%, #5a5a5e 40%, #4a4a4e 100%)",
            borderRadius: "0 0 10px 10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Front notch for opening */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0"
            style={{
              width: 60,
              height: 4,
              borderRadius: "0 0 4px 4px",
              background: "rgba(255,255,255,0.04)",
            }}
          />
        </div>
      </motion.div>

      {/* Reflection on surface below MacBook */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "60vw",
          height: "15vh",
          background: "radial-gradient(ellipse at top, rgba(var(--color-primary-rgb),0.03), transparent 70%)",
          filter: "blur(20px)",
        }}
      />
    </div>
  );
}
