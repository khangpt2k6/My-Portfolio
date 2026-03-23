import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

/*
  3D MacBook Boot Sequence
  ────────────────────────
  1. Dark scene → MacBook appears from slight angle
  2. Lid opens with satisfying animation
  3. Screen glows, shows KP logo + progress
  4. Login screen on MacBook display
  5. Click → camera zooms INTO the screen → full viewport desktop
*/

export default function BootScreen({ onComplete }) {
  const [phase, setPhase] = useState("intro"); // intro → opening → booting → login → zoomIn → done
  const [progress, setProgress] = useState(0);
  const controls = useAnimation();
  const sceneRef = useRef(null);

  /* Skip if already booted this session */
  useEffect(() => {
    if (sessionStorage.getItem("os-booted")) {
      onComplete();
    }
  }, []);

  /* Phase sequencing */
  useEffect(() => {
    if (phase === "intro") {
      const t = setTimeout(() => setPhase("opening"), 600);
      return () => clearTimeout(t);
    }
    if (phase === "opening") {
      const t = setTimeout(() => setPhase("booting"), 1200);
      return () => clearTimeout(t);
    }
    if (phase === "booting") {
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => setPhase("login"), 400);
            return 100;
          }
          return p + 3;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleEnter = () => {
    setPhase("zoomIn");
    sessionStorage.setItem("os-booted", "1");
    setTimeout(onComplete, 1200);
  };

  const handleSkip = () => {
    if (phase === "login") {
      handleEnter();
    } else if (phase !== "zoomIn" && phase !== "done") {
      setPhase("login");
      setProgress(100);
    }
  };

  if (phase === "done") return null;

  /* Lid angle based on phase */
  const lidAngle =
    phase === "intro" ? -92 :
    phase === "opening" ? -8 :
    phase === "zoomIn" ? 0 : -8;

  /* Scene scale — zooms in during zoomIn phase */
  const sceneScale =
    phase === "zoomIn" ? 4.5 : 1;

  const sceneY =
    phase === "zoomIn" ? "-38%" :
    phase === "intro" ? "8%" : "0%";

  /* Screen brightness */
  const screenOn = phase !== "intro";

  return (
    <motion.div
      className="fixed inset-0 z-[9990] flex items-center justify-center overflow-hidden select-none"
      style={{ background: "#000", perspective: "1800px" }}
      onClick={handleSkip}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "zoomIn" ? 0 : 1 }}
      transition={{ duration: 1, delay: phase === "zoomIn" ? 0.8 : 0 }}
    >
      {/* Ambient light glow behind MacBook */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 600,
          height: 300,
          background: "radial-gradient(ellipse, rgba(var(--color-primary-rgb),0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          opacity: screenOn ? [0.3, 0.6, 0.3] : 0,
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── 3D MacBook Scene ── */}
      <motion.div
        ref={sceneRef}
        className="relative"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(12deg)",
        }}
        animate={{
          scale: sceneScale,
          y: sceneY,
        }}
        transition={{
          duration: phase === "zoomIn" ? 1.2 : 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {/* ── MacBook Base (bottom) ── */}
        <div
          className="relative mx-auto"
          style={{
            width: 540,
            height: 18,
            background: "linear-gradient(180deg, #8a8a8e 0%, #6e6e72 40%, #4a4a4e 100%)",
            borderRadius: "0 0 12px 12px",
            boxShadow: "0 4px 30px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05) inset",
          }}
        >
          {/* Trackpad indent */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0"
            style={{
              width: 80,
              height: 4,
              borderRadius: "0 0 6px 6px",
              background: "rgba(255,255,255,0.06)",
            }}
          />
          {/* Front lip notch */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-1"
            style={{
              width: 40,
              height: 4,
              borderRadius: "0 0 4px 4px",
              background: "#5a5a5e",
            }}
          />
        </div>

        {/* ── Keyboard Surface ── */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            width: 520,
            height: 340,
            bottom: 18,
            background: "linear-gradient(180deg, #2a2a2e 0%, #1a1a1e 100%)",
            borderRadius: "4px 4px 0 0",
            transformOrigin: "bottom center",
            transform: "rotateX(85deg)",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)",
          }}
        >
          {/* Keyboard grid suggestion */}
          <div className="absolute inset-4 grid grid-cols-14 grid-rows-5 gap-[3px] opacity-20">
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} className="rounded-sm bg-white/10" />
            ))}
          </div>
          {/* Trackpad */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg"
            style={{
              width: 160,
              height: 100,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
        </div>

        {/* ── Lid (hinged from bottom) ── */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            width: 540,
            bottom: 18,
            transformOrigin: "bottom center",
            transformStyle: "preserve-3d",
          }}
          animate={{ rotateX: lidAngle }}
          transition={{
            duration: phase === "opening" ? 1.5 : 0.8,
            ease: phase === "opening" ? [0.22, 1, 0.36, 1] : [0.16, 1, 0.3, 1],
          }}
        >
          {/* Lid back (outer shell) */}
          <div
            style={{
              width: 540,
              height: 360,
              background: "linear-gradient(180deg, #6e6e72 0%, #4a4a4e 50%, #3a3a3e 100%)",
              borderRadius: "12px 12px 0 0",
              position: "absolute",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              boxShadow: "0 -2px 20px rgba(0,0,0,0.3)",
            }}
          >
            {/* Apple-like logo on back */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="text-3xl font-black tracking-tight"
                style={{
                  fontFamily: "Syne, sans-serif",
                  color: "rgba(255,255,255,0.08)",
                  transform: "rotateY(180deg)",
                }}
              >
                KP
              </div>
            </div>
          </div>

          {/* Lid front (screen side) */}
          <div
            className="relative overflow-hidden"
            style={{
              width: 540,
              height: 360,
              background: "#0a0a0a",
              borderRadius: "12px 12px 0 0",
              backfaceVisibility: "hidden",
              border: "12px solid #1a1a1e",
              borderBottom: "16px solid #1a1a1e",
            }}
          >
            {/* Notch / Camera */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
              style={{
                width: 80,
                height: 12,
                background: "#1a1a1e",
                borderRadius: "0 0 8px 8px",
                marginTop: -1,
              }}
            >
              <div
                className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                style={{ background: "#2a2a2e", boxShadow: screenOn ? "0 0 4px rgba(0,200,0,0.3)" : "none" }}
              />
            </div>

            {/* ── Screen Content ── */}
            <motion.div
              className="w-full h-full flex flex-col items-center justify-center relative"
              style={{
                background: screenOn
                  ? "radial-gradient(ellipse at center, #111 0%, #080808 100%)"
                  : "#000",
              }}
              animate={{ opacity: screenOn ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Screen glow */}
              {screenOn && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse at 50% 30%, rgba(var(--color-primary-rgb),0.06), transparent 60%)",
                  }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}

              {/* Boot content on screen */}
              {(phase === "booting" || phase === "opening") && (
                <motion.div
                  className="flex flex-col items-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div
                    className="text-3xl font-black text-white/80 tracking-tight"
                    style={{ fontFamily: "Syne, sans-serif" }}
                  >
                    KP
                  </div>
                  {phase === "booting" && (
                    <div className="w-32 h-0.5 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-white/60"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {/* Login screen on MacBook display */}
              {(phase === "login" || phase === "zoomIn") && (
                <motion.div
                  className="flex flex-col items-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 shadow-lg">
                    <img
                      src="/profile.jpg"
                      alt="Khang Phan"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <h2 className="text-sm font-semibold text-white/90">Khang Phan</h2>
                  <p className="text-[10px] text-white/40">Computer Science @ USF</p>
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); handleEnter(); }}
                    className="mt-1 px-5 py-1.5 rounded-full text-[11px] font-medium
                               bg-white/10 border border-white/15 text-white/80
                               hover:bg-white/20 transition-all backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Click to Enter
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Skip hint */}
      {phase !== "zoomIn" && (
        <motion.p
          className="absolute bottom-8 text-[11px] text-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          Click anywhere to skip
        </motion.p>
      )}
    </motion.div>
  );
}
