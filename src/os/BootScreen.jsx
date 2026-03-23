import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

/*
  3D MacBook Boot Sequence
  ────────────────────────
  1. Dark scene → MacBook appears with dramatic 3D tilt
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
  const sceneScale = phase === "zoomIn" ? 4.5 : 1;

  const sceneY = phase === "zoomIn" ? "-38%" : "0%";

  /* Screen brightness */
  const screenOn = phase !== "intro";

  return (
    <motion.div
      className="fixed inset-0 z-[9990] flex items-center justify-center overflow-hidden select-none"
      style={{
        background: "radial-gradient(ellipse at 50% 60%, #111827 0%, #030712 60%, #000 100%)",
        perspective: "1800px",
      }}
      onClick={handleSkip}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "zoomIn" ? 0 : 1 }}
      transition={{ duration: 1, delay: phase === "zoomIn" ? 0.8 : 0 }}
    >
      {/* Star-like ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.05,
            }}
            animate={{ opacity: [0.05, 0.3, 0.05] }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Ambient light glow behind MacBook */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 800,
          height: 400,
          background: "radial-gradient(ellipse, rgba(var(--color-primary-rgb),0.12) 0%, rgba(var(--color-primary-rgb),0.04) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          opacity: screenOn ? [0.4, 0.8, 0.4] : 0,
          scale: screenOn ? [1, 1.05, 1] : 0.9,
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── 3D MacBook Scene ── */}
      <motion.div
        ref={sceneRef}
        className="relative flex flex-col items-center"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(14deg)",
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
        {/* ── Lid (hinged from bottom of screen) ── */}
        <motion.div
          style={{
            width: 540,
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
              background: "linear-gradient(180deg, #7a7a7e 0%, #5a5a5e 30%, #3a3a3e 100%)",
              borderRadius: "12px 12px 0 0",
              position: "absolute",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              boxShadow: "0 -2px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            {/* Apple-like logo on back */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-3xl font-black tracking-tight"
                style={{
                  fontFamily: "Syne, sans-serif",
                  color: "rgba(255,255,255,0.06)",
                  transform: "rotateY(180deg)",
                }}
                animate={{
                  color: screenOn
                    ? ["rgba(255,255,255,0.06)", "rgba(255,255,255,0.12)", "rgba(255,255,255,0.06)"]
                    : "rgba(255,255,255,0.06)",
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                KP
              </motion.div>
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
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                style={{ background: "#2a2a2e" }}
                animate={{
                  boxShadow: screenOn
                    ? "0 0 6px rgba(0,200,0,0.5)"
                    : "none",
                }}
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
                    background: "radial-gradient(ellipse at 50% 30%, rgba(var(--color-primary-rgb),0.08), transparent 60%)",
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
                  <motion.div
                    className="text-3xl font-black text-white/80 tracking-tight"
                    style={{ fontFamily: "Syne, sans-serif" }}
                    animate={{
                      textShadow: [
                        "0 0 20px rgba(var(--color-primary-rgb),0)",
                        "0 0 20px rgba(var(--color-primary-rgb),0.4)",
                        "0 0 20px rgba(var(--color-primary-rgb),0)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    KP
                  </motion.div>
                  {phase === "booting" && (
                    <div className="w-32 h-0.5 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          width: `${progress}%`,
                          background: "linear-gradient(90deg, rgba(var(--color-primary-rgb),0.8), white)",
                        }}
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
                  <motion.div
                    className="w-16 h-16 rounded-full overflow-hidden shadow-lg"
                    style={{
                      border: "2px solid rgba(var(--color-primary-rgb),0.3)",
                      boxShadow: "0 0 20px rgba(var(--color-primary-rgb),0.15)",
                    }}
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(var(--color-primary-rgb),0.15)",
                        "0 0 30px rgba(var(--color-primary-rgb),0.25)",
                        "0 0 20px rgba(var(--color-primary-rgb),0.15)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <img
                      src="/profile.jpg"
                      alt="Khang Phan"
                      className="w-full h-full object-cover object-top"
                    />
                  </motion.div>
                  <h2 className="text-sm font-semibold text-white/90">Khang Phan</h2>
                  <p className="text-[10px] text-white/40">Computer Science @ USF</p>
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); handleEnter(); }}
                    className="mt-1 px-5 py-1.5 rounded-full text-[11px] font-medium
                               text-white/80 transition-all backdrop-blur-sm cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, rgba(var(--color-primary-rgb),0.3), rgba(var(--color-primary-rgb),0.1))",
                      border: "1px solid rgba(var(--color-primary-rgb),0.3)",
                      boxShadow: "0 0 20px rgba(var(--color-primary-rgb),0.1)",
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 30px rgba(var(--color-primary-rgb),0.25)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Click to Enter
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* ── Hinge + Base assembly ── */}
        <div className="relative flex flex-col items-center">
          {/* Hinge */}
          <div
            style={{
              width: 540,
              height: 8,
              background: "linear-gradient(180deg, #3a3a3e 0%, #2a2a2e 50%, #222226 100%)",
              borderRadius: "0 0 2px 2px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          />

          {/* Keyboard Surface — absolutely positioned so it doesn't affect centering */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: 0,
              width: 520,
              height: 340,
              background: "linear-gradient(180deg, #2a2a2e 0%, #1a1a1e 100%)",
              borderRadius: "0 0 4px 4px",
              transformOrigin: "top center",
              transform: "rotateX(-85deg)",
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

          {/* Base (front edge) */}
          <div
            className="relative"
            style={{
              width: 560,
              height: 14,
              background: "linear-gradient(180deg, #8a8a8e 0%, #6e6e72 40%, #4a4a4e 100%)",
              borderRadius: "0 0 12px 12px",
              boxShadow: "0 6px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset",
            }}
          >
            {/* Front lip notch */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-0"
              style={{
                width: 60,
                height: 4,
                borderRadius: "0 0 6px 6px",
                background: "rgba(255,255,255,0.06)",
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Surface reflection below MacBook */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          bottom: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "50vw",
          height: "18vh",
          background: "radial-gradient(ellipse at top, rgba(var(--color-primary-rgb),0.04), transparent 70%)",
          filter: "blur(30px)",
        }}
        animate={{
          opacity: screenOn ? [0.3, 0.6, 0.3] : 0,
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

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
