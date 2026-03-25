import { useState, useEffect, useCallback, useRef, Suspense, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/*
  Boot Sequence
  ─────────────
  Phase 0 — "preload":  Fake download animation (covers real model loading)
  Phase 1 — "intro":    3D MacBook with lid closed
  Phase 2 — "opening":  Lid opens
  Phase 3 — "booting":  KP logo + progress bar on screen
  Phase 4 — "login":    Avatar + enter button
  Phase 5 — "loading":  OS spinner
  Phase 6 — "zoomIn":   Camera dives into screen → desktop
*/

const MODEL_URL = "/models/macbook/scene.gltf";

/* ══════════════════════════════════════════════════════════════════════
   Preload Screen — smooth fake progress, waits for real model too
   ══════════════════════════════════════════════════════════════════════ */
const PACKAGES = [
  { name: "system-core.framework", label: "System Core" },
  { name: "macbook-pro.gltf", label: "3D Model" },
  { name: "environment.hdr", label: "Lighting" },
  { name: "textures.pack", label: "Materials" },
  { name: "desktop-wallpaper.webp", label: "Desktop" },
  { name: "khangos-ui.bundle", label: "Interface" },
];

const MIN_LOAD_MS = 2400;

function PreloadScreen({ onDone }) {
  const [fakeProgress, setFakeProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const startTime = useRef(Date.now());

  // Simple fake progress: ramp to 100% over MIN_LOAD_MS, smooth easeOut
  useEffect(() => {
    let raf;
    const tick = () => {
      const elapsed = Date.now() - startTime.current;
      const t = Math.min(elapsed / MIN_LOAD_MS, 1);
      // easeOutQuart for smooth deceleration
      const eased = 1 - Math.pow(1 - t, 4);
      setFakeProgress(eased * 100);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Exit when done
  useEffect(() => {
    if (fakeProgress >= 99.9 && !exiting) {
      setExiting(true);
      setTimeout(onDone, 500);
    }
  }, [fakeProgress, exiting, onDone]);

  const activeIdx = Math.min(Math.floor(fakeProgress / (100 / PACKAGES.length)), PACKAGES.length - 1);
  const [dots, setDots] = useState("");
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? "" : d + ".")), 400);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "#030712" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }} />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(var(--color-primary-rgb),0.06) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative flex flex-col items-center gap-8 px-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-3xl font-black tracking-tight"
            style={{
              fontFamily: "Syne, sans-serif",
              background: "linear-gradient(135deg, rgba(var(--color-primary-rgb),0.9) 0%, #fff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
            KhangOS
          </div>
          <div className="text-[10px] text-center text-white/20 mt-1 font-medium tracking-widest uppercase">
            Portfolio System
          </div>
        </motion.div>

        {/* Package list */}
        <motion.div className="w-72 space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}>
          {PACKAGES.map((pkg, i) => {
            const threshold = ((i + 1) / PACKAGES.length) * 100;
            const done = fakeProgress >= threshold;
            const current = i === activeIdx && !done;
            return (
              <motion.div key={pkg.name}
                className="flex items-center gap-2.5 px-3 py-[6px] rounded-lg transition-colors duration-300"
                style={{
                  background: current ? "rgba(var(--color-primary-rgb),0.05)" : "transparent",
                  borderLeft: current ? "2px solid rgba(var(--color-primary-rgb),0.4)" : "2px solid transparent",
                }}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}>
                {/* Icon */}
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  {done ? (
                    <motion.svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 18 }}>
                      <circle cx="7" cy="7" r="6" fill="rgba(var(--color-primary-rgb),0.12)" stroke="rgba(var(--color-primary-rgb),0.35)" strokeWidth="0.5" />
                      <path d="M4 7L6 9L10 5" stroke="rgba(var(--color-primary-rgb),0.8)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </motion.svg>
                  ) : current ? (
                    <motion.div className="w-3 h-3 rounded-full"
                      style={{ border: "1.5px solid rgba(var(--color-primary-rgb),0.4)", borderTopColor: "transparent" }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                  ) : (
                    <div className="w-1 h-1 rounded-full bg-white/15" />
                  )}
                </div>
                {/* Name */}
                <span className="text-[11px] font-mono flex-1 truncate transition-colors duration-300" style={{
                  color: done ? "rgba(255,255,255,0.3)" : current ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.15)",
                }}>
                  {pkg.name}
                </span>
                {/* Status */}
                <span className="text-[9px] shrink-0 font-medium transition-colors duration-300" style={{
                  color: done ? "rgba(var(--color-primary-rgb),0.45)" : "rgba(255,255,255,0.1)",
                }}>
                  {done ? "Ready" : pkg.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Progress bar */}
        <motion.div className="w-72"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}>
          <div className="w-full h-[2px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div className="h-full rounded-full transition-[width] duration-100 ease-out"
              style={{
                width: `${Math.min(fakeProgress, 100)}%`,
                background: "linear-gradient(90deg, rgba(var(--color-primary-rgb),0.4), rgba(var(--color-primary-rgb),0.9))",
                boxShadow: "0 0 10px rgba(var(--color-primary-rgb),0.25)",
              }} />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] font-mono text-white/20">
              Initializing{dots}
            </span>
            <span className="text-[10px] font-mono tabular-nums text-white/25">
              {Math.round(Math.min(fakeProgress, 100))}%
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   3D MacBook Model
   ══════════════════════════════════════════════════════════════════════ */
function MacBook({ phase }) {
  const { scene } = useGLTF(MODEL_URL);
  const wallpaper = useLoader(THREE.TextureLoader, "/desktop_background/bV6xf3.webp");
  const pivotRef = useRef(null);
  const screenRef = useRef(null);
  const setupDone = useRef(false);

  useEffect(() => {
    if (setupDone.current) return;
    setupDone.current = true;

    wallpaper.flipY = false;
    wallpaper.colorSpace = THREE.SRGBColorSpace;
    scene.updateMatrixWorld(true);

    let lidNode = null;
    scene.traverse((node) => {
      if (node.name === "VCQqxpxkUlzqcJI_62") lidNode = node;
      if (node.isMesh && node.material?.name === "sfCQkHOWyrsLmor") {
        node.material = node.material.clone();
        node.material.emissiveMap = wallpaper;
        node.material.emissive = new THREE.Color("#ffffff");
        node.material.emissiveIntensity = 0;
        node.material.needsUpdate = true;
        screenRef.current = node;
      }
    });

    if (lidNode) {
      const lidBox = new THREE.Box3().setFromObject(lidNode);
      const hingeWorld = new THREE.Vector3(
        (lidBox.min.x + lidBox.max.x) / 2, lidBox.min.y, (lidBox.min.z + lidBox.max.z) / 2
      );
      const parent = lidNode.parent;
      const hingeLocal = parent.worldToLocal(hingeWorld.clone());
      const pivot = new THREE.Group();
      pivot.name = "lid_hinge_pivot";
      pivot.position.copy(hingeLocal);
      const lidPos = lidNode.position.clone();
      parent.remove(lidNode);
      lidNode.position.copy(lidPos.sub(hingeLocal));
      pivot.add(lidNode);
      parent.add(pivot);
      pivot.rotation.x = Math.PI * 0.47;
      pivotRef.current = pivot;
    }
  }, [scene, wallpaper]);

  useFrame((_, dt) => {
    if (pivotRef.current) {
      const target = phase === "intro" ? Math.PI * 0.47 : 0;
      const speed = phase === "opening" ? 1.2 : 3;
      pivotRef.current.rotation.x = THREE.MathUtils.lerp(pivotRef.current.rotation.x, target, dt * speed);
    }
    if (screenRef.current) {
      const targets = { intro: 0, opening: 0, booting: 1, login: 3, loading: 5, zoomIn: 8 };
      const t = targets[phase] ?? 0;
      screenRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        screenRef.current.material.emissiveIntensity, t, dt * 2
      );
    }
  });

  return <primitive object={scene} scale={0.08} position={[0, -0.8, 0]} />;
}

/* ── Camera ── */
function CameraController({ phase }) {
  const target = useMemo(() => new THREE.Vector3(0, 0.05, 1.8), []);
  useFrame(({ camera }, dt) => {
    if (phase === "zoomIn") camera.position.lerp(target, dt * 1.8);
  });
  return null;
}

/* ══════════════════════════════════════════════════════════════════════
   Main BootScreen
   ══════════════════════════════════════════════════════════════════════ */
export default function BootScreen({ onComplete }) {
  const [preloaded, setPreloaded] = useState(false);
  const [phase, setPhase] = useState("intro");
  const [progress, setProgress] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);

  // Skip boot if already booted this session
  useEffect(() => {
    if (sessionStorage.getItem("os-booted")) onComplete();
  }, []);

  // Phase sequencing — only starts after preload is done
  useEffect(() => {
    if (!preloaded) return;

    if (phase === "intro") {
      const t = setTimeout(() => setPhase("opening"), 1500);
      return () => clearTimeout(t);
    }
    if (phase === "opening") {
      const t = setTimeout(() => setPhase("booting"), 1500);
      return () => clearTimeout(t);
    }
    if (phase === "booting") {
      const id = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { clearInterval(id); setTimeout(() => setPhase("login"), 400); return 100; }
          return p + 3;
        });
      }, 30);
      return () => clearInterval(id);
    }
    if (phase === "loading") {
      setLoadProgress(0);
      const id = setInterval(() => {
        setLoadProgress((p) => {
          if (p >= 100) {
            clearInterval(id);
            setTimeout(() => { setPhase("zoomIn"); setTimeout(onComplete, 1200); }, 300);
            return 100;
          }
          return p + 2;
        });
      }, 25);
      return () => clearInterval(id);
    }
  }, [phase, onComplete, preloaded]);

  const handleEnter = useCallback(() => {
    sessionStorage.setItem("os-booted", "1");
    setPhase("loading");
  }, []);

  const handleSkip = useCallback(() => {
    if (!preloaded) return;
    if (phase === "login") handleEnter();
    else if (phase !== "loading" && phase !== "zoomIn") {
      setPhase("login");
      setProgress(100);
    }
  }, [phase, handleEnter, preloaded]);

  if (phase === "done") return null;

  const screenOn = phase !== "intro";
  const showBoot = phase === "booting" || phase === "opening";
  const showLogin = phase === "login";
  const showLoading = phase === "loading" || phase === "zoomIn";

  return (
    <motion.div
      className="fixed inset-0 z-[9990] select-none overflow-hidden"
      onClick={handleSkip}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "zoomIn" ? 0 : 1 }}
      transition={{ duration: 1, delay: phase === "zoomIn" ? 0.8 : 0 }}
    >
      {/* Three.js — starts loading immediately but hidden behind preload screen */}
      <Canvas
        camera={{ position: [0, 0.05, 4.2], fov: 32 }}
        dpr={[1, 2]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <color attach="background" args={["#030712"]} />
        <fog attach="fog" args={["#030712", 10, 25]} />
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 8, 3]} intensity={1.5} />
          <pointLight position={[-4, 2, 4]} intensity={0.4} color="#818CF8" />
          <spotLight position={[0, 5, 5]} angle={0.3} penumbra={0.8} intensity={0.6} color="#c4b5fd" />
          <MacBook phase={preloaded ? phase : "intro"} />
          <CameraController phase={phase} />
          <ContactShadows position={[0, -0.82, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
          <Environment preset="city" background={false} />
        </Suspense>
      </Canvas>

      {/* Preload screen — sits on top, hides everything until ready */}
      <AnimatePresence>
        {!preloaded && (
          <PreloadScreen onDone={() => setPreloaded(true)} />
        )}
      </AnimatePresence>

      {/* Screen content overlay — only after preload */}
      {preloaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ paddingBottom: "6%" }}>
          <motion.div
            animate={{
              opacity: phase === "zoomIn" ? 0 : screenOn ? 1 : 0,
              scale: phase === "zoomIn" ? 1.5 : 1,
              y: phase === "zoomIn" ? -30 : 0,
            }}
            transition={{ duration: phase === "zoomIn" ? 1 : 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {showBoot && (
              <motion.div className="flex flex-col items-center gap-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <motion.div className="text-3xl font-black text-white/80 tracking-tight"
                  style={{ fontFamily: "Syne, sans-serif" }}
                  animate={{ textShadow: ["0 0 20px rgba(var(--color-primary-rgb),0)", "0 0 20px rgba(var(--color-primary-rgb),0.4)", "0 0 20px rgba(var(--color-primary-rgb),0)"] }}
                  transition={{ duration: 2, repeat: Infinity }}>
                  KP
                </motion.div>
                {phase === "booting" && (
                  <div className="w-32 h-0.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full"
                      style={{ width: `${progress}%`, background: "linear-gradient(90deg, rgba(var(--color-primary-rgb),0.8), white)", transition: "width 30ms" }} />
                  </div>
                )}
              </motion.div>
            )}

            {showLogin && (
              <motion.div className="flex flex-col items-center gap-3 pointer-events-auto"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <motion.div className="w-16 h-16 rounded-full overflow-hidden"
                  style={{ border: "2px solid rgba(var(--color-primary-rgb),0.3)", boxShadow: "0 0 20px rgba(var(--color-primary-rgb),0.15)" }}
                  animate={{ boxShadow: ["0 0 20px rgba(var(--color-primary-rgb),0.15)", "0 0 30px rgba(var(--color-primary-rgb),0.3)", "0 0 20px rgba(var(--color-primary-rgb),0.15)"] }}
                  transition={{ duration: 2, repeat: Infinity }}>
                  <img src="/profile.jpg" alt="Khang Phan" className="w-full h-full object-cover object-top" />
                </motion.div>
                <h2 className="text-sm font-semibold text-white/90">Khang Phan</h2>
                <motion.button
                  onClick={(e) => { e.stopPropagation(); handleEnter(); }}
                  className="mt-1 px-5 py-1.5 rounded-full text-[11px] font-medium text-white/80 cursor-pointer backdrop-blur-sm"
                  style={{
                    background: "linear-gradient(135deg, rgba(var(--color-primary-rgb),0.3), rgba(var(--color-primary-rgb),0.1))",
                    border: "1px solid rgba(var(--color-primary-rgb),0.3)",
                    boxShadow: "0 0 15px rgba(var(--color-primary-rgb),0.1)",
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(var(--color-primary-rgb),0.25)" }}
                  whileTap={{ scale: 0.95 }}>
                  Click to Enter
                </motion.button>
              </motion.div>
            )}

            {showLoading && (
              <motion.div className="flex flex-col items-center gap-5"
                initial={{ opacity: 0 }} animate={{ opacity: phase === "zoomIn" ? 0 : 1 }} transition={{ duration: 0.4 }}>
                <motion.div className="w-12 h-12 rounded-full"
                  style={{ border: "2px solid rgba(255,255,255,0.1)", borderTop: "2px solid rgba(var(--color-primary-rgb),0.8)" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-40 h-[3px] rounded-full bg-white/10 overflow-hidden">
                    <motion.div className="h-full rounded-full"
                      style={{ width: `${loadProgress}%`, background: "linear-gradient(90deg, rgba(var(--color-primary-rgb),0.6), rgba(var(--color-primary-rgb),1))" }} />
                  </div>
                  <p className="text-[10px] text-white/30 font-medium">Loading KhangOS...</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}

      {preloaded && phase !== "loading" && phase !== "zoomIn" && (
        <motion.p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] text-white/20"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
          Click anywhere to skip
        </motion.p>
      )}
    </motion.div>
  );
}
