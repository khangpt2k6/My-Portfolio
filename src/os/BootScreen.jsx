import { useState, useEffect, useCallback, useRef, Suspense, useMemo } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/*
  3D MacBook Boot Sequence (GLTF Model)
  ──────────────────────────────────────
  1. Dark scene → real MacBook Pro model with lid closed
  2. Lid opens with smooth animation
  3. Screen glows, shows KP logo + progress
  4. Login screen overlay
  5. Click → camera zooms in → desktop
*/

const MODEL_URL = "/models/macbook/scene.gltf";
useGLTF.preload(MODEL_URL);

/* ── 3D MacBook Model ────────────────────────────────────────────────── */
function MacBook({ phase }) {
  const { scene } = useGLTF(MODEL_URL);
  const lid = useRef(null);
  const screen = useRef(null);
  const lidOpenX = useRef(null);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((node) => {
      if (node.name === "VCQqxpxkUlzqcJI_62") {
        lid.current = node;
        lidOpenX.current = node.rotation.x;
      }
      if (node.isMesh && node.material?.name === "sfCQkHOWyrsLmor") {
        node.material = node.material.clone();
        node.material.emissiveIntensity = 0;
        screen.current = node;
      }
    });
    return clone;
  }, [scene]);

  useFrame((_, dt) => {
    if (lid.current && lidOpenX.current != null) {
      const open = lidOpenX.current;
      const closed = open + Math.PI * 0.43;
      const target = phase === "intro" ? closed : open;
      const speed = phase === "opening" ? 1.2 : 3;
      lid.current.rotation.x = THREE.MathUtils.lerp(
        lid.current.rotation.x,
        target,
        dt * speed
      );
    }

    if (screen.current) {
      let target;
      switch (phase) {
        case "intro":
          target = 0;
          break;
        case "opening":
          target = 0.3;
          break;
        case "booting":
          target = 1;
          break;
        case "login":
          target = 3;
          break;
        case "zoomIn":
          target = 8;
          break;
        default:
          target = 0;
      }
      screen.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        screen.current.material.emissiveIntensity,
        target,
        dt * 2
      );
    }
  });

  return <primitive object={model} scale={0.08} position={[0, -0.8, 0]} />;
}

/* ── Camera zoom on enter ────────────────────────────────────────────── */
function CameraController({ phase }) {
  const target = useMemo(() => new THREE.Vector3(0, 0.2, 2), []);

  useFrame(({ camera }, dt) => {
    if (phase === "zoomIn") {
      camera.position.lerp(target, dt * 1.8);
    }
  });
  return null;
}

/* ── Loading fallback inside Canvas ──────────────────────────────────── */
function Loader() {
  return null;
}

/* ── Main BootScreen ─────────────────────────────────────────────────── */
export default function BootScreen({ onComplete }) {
  const [phase, setPhase] = useState("intro");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("os-booted")) onComplete();
  }, []);

  useEffect(() => {
    if (phase === "intro") {
      const t = setTimeout(() => setPhase("opening"), 800);
      return () => clearTimeout(t);
    }
    if (phase === "opening") {
      const t = setTimeout(() => setPhase("booting"), 1500);
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

  const handleEnter = useCallback(() => {
    setPhase("zoomIn");
    sessionStorage.setItem("os-booted", "1");
    setTimeout(onComplete, 1200);
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    if (phase === "login") handleEnter();
    else if (phase !== "zoomIn" && phase !== "done") {
      setPhase("login");
      setProgress(100);
    }
  }, [phase, handleEnter]);

  if (phase === "done") return null;

  const screenOn = phase !== "intro";
  const showBoot = phase === "booting" || phase === "opening";
  const showLogin = phase === "login" || phase === "zoomIn";

  return (
    <motion.div
      className="fixed inset-0 z-[9990] select-none overflow-hidden"
      onClick={handleSkip}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "zoomIn" ? 0 : 1 }}
      transition={{ duration: 1, delay: phase === "zoomIn" ? 0.8 : 0 }}
    >
      {/* ── Three.js Canvas ── */}
      <Canvas
        camera={{ position: [0, 0.3, 5], fov: 35 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <color attach="background" args={["#030712"]} />
        <fog attach="fog" args={["#030712", 10, 25]} />

        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 8, 3]} intensity={1.5} />
          <pointLight position={[-4, 2, 4]} intensity={0.4} color="#818CF8" />
          <spotLight
            position={[0, 5, 5]}
            angle={0.3}
            penumbra={0.8}
            intensity={0.6}
            color="#c4b5fd"
          />

          <MacBook phase={phase} />
          <CameraController phase={phase} />

          <ContactShadows
            position={[0, -0.82, 0]}
            opacity={0.4}
            scale={10}
            blur={2.5}
            far={4}
          />
          <Environment preset="city" background={false} />
        </Suspense>
      </Canvas>

      {/* ── Screen content overlay ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ paddingBottom: "6%" }}
      >
        <motion.div
          animate={{
            opacity: phase === "zoomIn" ? 0 : screenOn ? 1 : 0,
            scale: phase === "zoomIn" ? 1.5 : 1,
            y: phase === "zoomIn" ? -30 : 0,
          }}
          transition={{
            duration: phase === "zoomIn" ? 1 : 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Boot: KP logo + progress bar */}
          {showBoot && (
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
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
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      background:
                        "linear-gradient(90deg, rgba(var(--color-primary-rgb),0.8), white)",
                      transition: "width 30ms",
                    }}
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* Login: avatar + enter button */}
          {showLogin && (
            <motion.div
              className="flex flex-col items-center gap-3 pointer-events-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="w-16 h-16 rounded-full overflow-hidden"
                style={{
                  border: "2px solid rgba(var(--color-primary-rgb),0.3)",
                  boxShadow: "0 0 20px rgba(var(--color-primary-rgb),0.15)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(var(--color-primary-rgb),0.15)",
                    "0 0 30px rgba(var(--color-primary-rgb),0.3)",
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnter();
                }}
                className="mt-1 px-5 py-1.5 rounded-full text-[11px] font-medium
                           text-white/80 cursor-pointer backdrop-blur-sm"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(var(--color-primary-rgb),0.3), rgba(var(--color-primary-rgb),0.1))",
                  border: "1px solid rgba(var(--color-primary-rgb),0.3)",
                  boxShadow: "0 0 15px rgba(var(--color-primary-rgb),0.1)",
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(var(--color-primary-rgb),0.25)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Click to Enter
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ── Skip hint ── */}
      {phase !== "zoomIn" && (
        <motion.p
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] text-white/20"
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
