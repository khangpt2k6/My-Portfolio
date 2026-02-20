import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* ── Available cursor styles ──────────────────────────────────────────────── */
export const CURSOR_STYLES = [
  { id: "ring", label: "Ring" },
  { id: "spotlight", label: "Spotlight" },
  { id: "trail", label: "Trail" },
  { id: "neon", label: "Neon" },
  { id: "default", label: "Default" },
];

/* ── Trail Cursor (Canvas-based) ──────────────────────────────────────────── */
const TrailCursor = () => {
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let movePending = false;
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (movePending) return;
      movePending = true;
      requestAnimationFrame(() => {
        movePending = false;
        const { x, y } = mouseRef.current;
        pointsRef.current.push({
          x: x + (Math.random() - 0.5) * 4,
          y: y + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          life: 1,
          size: Math.random() * 4 + 2,
          hue: Math.random() * 60 + 230,
        });
        if (pointsRef.current.length > 150) {
          pointsRef.current.splice(0, pointsRef.current.length - 150);
        }
      });
    };
    window.addEventListener("mousemove", onMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pts = pointsRef.current;

      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        p.life -= 0.015;
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.01;
        p.size *= 0.995;

        if (p.life <= 0) {
          pts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.life * 0.7;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsla(${p.hue}, 80%, 65%, ${p.life})`;
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Center dot
      const m = mouseRef.current;
      ctx.save();
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(99, 102, 241, 0.8)";
      ctx.fillStyle = "rgba(99, 102, 241, 0.9)";
      ctx.beginPath();
      ctx.arc(m.x, m.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{ width: "100vw", height: "100vh" }}
      />
      <style>{`@media (pointer: fine) { * { cursor: none !important; } }`}</style>
    </>
  );
};

/* ── Main CustomCursor Component ──────────────────────────────────────────── */
const CustomCursor = () => {
  const [style, setStyle] = useState("ring");
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 });

  // Soft spring for spotlight
  const softX = useSpring(cursorX, { stiffness: 80, damping: 20 });
  const softY = useSpring(cursorY, { stiffness: 80, damping: 20 });

  /* ── Load preference ── */
  useEffect(() => {
    const saved = localStorage.getItem("cursor-style");
    if (saved && CURSOR_STYLES.some((s) => s.id === saved)) {
      setStyle(saved);
    }

    // Listen for changes from Navbar settings
    const interval = setInterval(() => {
      const val = localStorage.getItem("cursor-style");
      if (val && val !== style && CURSOR_STYLES.some((s) => s.id === val)) {
        setStyle(val);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [style]);

  /* ── Mouse tracking ── */
  useEffect(() => {
    const mq = window.matchMedia?.("(pointer: fine)");
    if (!mq?.matches) return;

    const onMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [cursorX, cursorY]);

  // Check for fine pointer
  const hasFinePointer =
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: fine)").matches;

  if (!hasFinePointer || style === "default") return null;

  /* ── Trail uses its own Canvas ── */
  if (style === "trail") return <TrailCursor />;

  /* ── Ring ── */
  if (style === "ring") {
    return (
      <>
        <motion.div
          className="fixed pointer-events-none z-[9999] w-8 h-8 rounded-full border-2 border-[var(--color-primary)] opacity-50"
          style={{ left: springX, top: springY, translateX: "-50%", translateY: "-50%" }}
        />
        <motion.div
          className="fixed pointer-events-none z-[9999] w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"
          style={{ left: cursorX, top: cursorY, translateX: "-50%", translateY: "-50%" }}
        />
        <style>{`@media (pointer: fine) { * { cursor: none !important; } }`}</style>
      </>
    );
  }

  /* ── Spotlight ── */
  if (style === "spotlight") {
    return (
      <>
        <motion.div
          className="fixed pointer-events-none z-[9998] rounded-full"
          style={{
            left: softX,
            top: softY,
            translateX: "-50%",
            translateY: "-50%",
            width: 280,
            height: 280,
            background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.03) 40%, transparent 70%)",
            mixBlendMode: "normal",
          }}
        />
        <motion.div
          className="fixed pointer-events-none z-[9999] w-2 h-2 rounded-full"
          style={{
            left: cursorX,
            top: cursorY,
            translateX: "-50%",
            translateY: "-50%",
            backgroundColor: "var(--color-primary)",
            boxShadow: "0 0 8px rgba(var(--color-primary-rgb), 0.5)",
          }}
        />
        <style>{`@media (pointer: fine) { * { cursor: none !important; } }`}</style>
      </>
    );
  }

  /* ── Neon ── */
  if (style === "neon") {
    return (
      <>
        <motion.div
          className="fixed pointer-events-none z-[9999] rounded-full"
          style={{
            left: springX,
            top: springY,
            translateX: "-50%",
            translateY: "-50%",
            width: 12,
            height: 12,
            backgroundColor: "var(--color-primary)",
            boxShadow: `0 0 10px rgb(var(--color-primary-rgb)),
                         0 0 25px rgba(var(--color-primary-rgb), 0.6),
                         0 0 50px rgba(var(--color-primary-rgb), 0.3),
                         0 0 80px rgba(var(--color-primary-rgb), 0.15)`,
          }}
        />
        {/* Outer glow ring */}
        <motion.div
          className="fixed pointer-events-none z-[9998] rounded-full"
          style={{
            left: softX,
            top: softY,
            translateX: "-50%",
            translateY: "-50%",
            width: 40,
            height: 40,
            border: "1px solid rgba(var(--color-primary-rgb), 0.2)",
            boxShadow: "0 0 15px rgba(var(--color-primary-rgb), 0.1)",
          }}
        />
        <style>{`@media (pointer: fine) { * { cursor: none !important; } }`}</style>
      </>
    );
  }

  return null;
};

export default CustomCursor;
