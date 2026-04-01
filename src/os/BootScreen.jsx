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

// Preload the model immediately when this module loads
useGLTF.preload(MODEL_URL);

/* ══════════════════════════════════════════════════════════════════════
   Preload Screen — macOS-style terminal with pip install animation
   ══════════════════════════════════════════════════════════════════════ */
function PreloadScreen({ onDone }) {
  const [lines, setLines] = useState([]);
  const [typingText, setTypingText] = useState("");
  const [termPhase, setTermPhase] = useState("typing"); // typing → running → done
  const [exiting, setExiting] = useState(false);
  const bodyRef = useRef(null);

  // Auto-scroll terminal body
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines, termPhase]);

  useEffect(() => {
    const ids = [];
    let d = 0;

    const cmd = "pip3 install khangos";

    // Phase 1: type the command character by character
    for (let i = 0; i <= cmd.length; i++) {
      const text = cmd.slice(0, i);
      ids.push(setTimeout(() => setTypingText(text), d));
      d += 30 + Math.random() * 25;
    }

    // Phase 2: "press enter" — move command into output
    d += 350;
    ids.push(setTimeout(() => {
      setTermPhase("running");
      setLines([{ text: cmd, isCmd: true }]);
    }, d));

    // Output lines — realistic pip output
    const outputLines = [
      "Collecting khangos",
      "  Downloading khangos-1.0.0-py3-none-any.whl (2.4 MB)",
      "     \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 2.4/2.4 MB 5.2 MB/s eta 0:00:00",
      "Collecting system-core>=1.2 (from khangos)",
      "  Downloading system_core-1.2.0-py3-none-any.whl (856 kB)",
      "Collecting macbook-renderer>=2.0 (from khangos)",
      "  Using cached macbook_renderer-2.1.0-py3-none-any.whl (1.2 MB)",
      "Collecting environment-hdr>=1.0 (from khangos)",
      "  Using cached environment_hdr-1.0.3-py3-none-any.whl (420 kB)",
      "Collecting khangos-ui>=1.0 (from khangos)",
      "  Downloading khangos_ui-1.0.0-py3-none-any.whl (512 kB)",
      "Installing collected packages: system-core, macbook-renderer,",
      "  environment-hdr, khangos-ui, khangos",
    ];

    for (const text of outputLines) {
      d += 80 + Math.random() * 60;
      ids.push(setTimeout(() => setLines((prev) => [...prev, { text }]), d));
    }

    // Success line (green)
    d += 200;
    ids.push(setTimeout(() => setLines((prev) => [...prev, {
      text: "Successfully installed khangos-1.0.0 system-core-1.2.0 macbook-renderer-2.1.0 environment-hdr-1.0.3 khangos-ui-1.0.0",
      success: true,
    }]), d));

    // Show a fresh prompt
    d += 400;
    ids.push(setTimeout(() => setTermPhase("done"), d));

    // Exit
    d += 600;
    ids.push(setTimeout(() => {
      setExiting(true);
      setTimeout(onDone, 500);
    }, d));

    return () => ids.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const promptStyle = { color: "#4ec9b0", fontWeight: 600 };
  const lineStyle = { whiteSpace: "pre-wrap", wordBreak: "break-all" };

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

      <div className="relative flex flex-col items-center px-4 w-full" style={{ maxWidth: 700 }}>
        {/* macOS Terminal Window */}
        <motion.div
          className="w-full rounded-xl overflow-hidden"
          style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.6), 0 0 40px rgba(var(--color-primary-rgb),0.08)" }}
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Title bar with traffic lights */}
          <div style={{ background: "#2d2d2d", padding: "12px 16px", display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
              <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
              <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
            </div>
            <span style={{ flex: 1, textAlign: "center", color: "#999", fontSize: 13, fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", userSelect: "none" }}>
              khang — pip3 — 80×24
            </span>
            <div style={{ width: 58 }} />
          </div>

          {/* Terminal body */}
          <div ref={bodyRef} style={{
            background: "#1a1a1a",
            padding: "16px 20px",
            minHeight: 300,
            maxHeight: 440,
            overflowY: "auto",
            fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
            fontSize: 14,
            lineHeight: 1.7,
            color: "#ccc",
          }}>
            {termPhase === "typing" && (
              <div style={lineStyle}>
                <span style={promptStyle}>khang@MacBook-Pro ~ % </span>
                <span>{typingText}</span>
                <motion.span
                  style={{ display: "inline-block", width: 7, height: 14, background: "#ccc", verticalAlign: "text-bottom", marginLeft: 1 }}
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
                />
              </div>
            )}
            {termPhase !== "typing" && lines.map((line, i) => (
              <div key={i} style={{ ...lineStyle, color: line.success ? "#4ec9b0" : "#ccc" }}>
                {line.isCmd && <span style={promptStyle}>khang@MacBook-Pro ~ % </span>}
                {line.text}
              </div>
            ))}
            {termPhase === "done" && (
              <div style={lineStyle}>
                <span style={promptStyle}>khang@MacBook-Pro ~ % </span>
                <motion.span
                  style={{ display: "inline-block", width: 7, height: 14, background: "#ccc", verticalAlign: "text-bottom", marginLeft: 1 }}
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   3D MacBook Model
   ══════════════════════════════════════════════════════════════════════ */
function MacBook({ phase, onReady }) {
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

    // Signal that the 3D model is fully set up
    if (onReady) onReady();
  }, [scene, wallpaper, onReady]);

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
  const [modelReady, setModelReady] = useState(false);
  const [timerDone, setTimerDone] = useState(false);

  const handleModelReady = useCallback(() => setModelReady(true), []);

  // When both model is ready AND terminal animation finished, proceed
  useEffect(() => {
    if (modelReady && timerDone && !preloaded) setPreloaded(true);
  }, [modelReady, timerDone, preloaded]);

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
          <MacBook phase={preloaded ? phase : "intro"} onReady={handleModelReady} />
          <CameraController phase={phase} />
          <ContactShadows position={[0, -0.82, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
          <Environment preset="city" background={false} />
        </Suspense>
      </Canvas>

      {/* Preload screen — sits on top, hides everything until model is ready */}
      <AnimatePresence>
        {!preloaded && (
          <PreloadScreen onDone={() => setTimerDone(true)} />
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

    </motion.div>
  );
}
