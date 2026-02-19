import { useRef, useEffect, useState } from "react";

/**
 * Immersive animated mesh gradient background for light mode.
 * Creates flowing aurora-like color bands that move organically.
 * Hidden in dark mode (StarfieldBg handles that).
 */
const AuroraBg = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [isLight, setIsLight] = useState(
    typeof document !== "undefined" &&
      !document.documentElement.classList.contains("dark")
  );

  /* ── Theme watcher ── */
  useEffect(() => {
    const root = document.documentElement;
    const check = () => setIsLight(!root.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  /* ── Canvas animation ── */
  useEffect(() => {
    if (!isLight) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Gradient blobs — each one is a floating color center
    const blobs = [
      { x: 0.2, y: 0.3, r: 0.45, color: [99, 102, 241], speed: 0.0003, phase: 0 },        // indigo
      { x: 0.7, y: 0.2, r: 0.4,  color: [6, 182, 212], speed: 0.00025, phase: 1.2 },       // cyan
      { x: 0.5, y: 0.7, r: 0.5,  color: [147, 51, 234], speed: 0.00035, phase: 2.4 },      // purple
      { x: 0.85, y: 0.6, r: 0.35, color: [236, 72, 153], speed: 0.0004, phase: 3.6 },      // pink
      { x: 0.15, y: 0.8, r: 0.38, color: [34, 211, 153], speed: 0.0003, phase: 4.8 },      // emerald
    ];

    let mouseX = 0.5;
    let mouseY = 0.5;

    const onMove = (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);

    let t = 0;
    const animate = () => {
      t += 1;
      const w = canvas.width;
      const h = canvas.height;

      // Clear with white
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);

      // Draw each blob
      blobs.forEach((blob) => {
        // Organic movement using sin/cos
        const bx = (blob.x + Math.sin(t * blob.speed + blob.phase) * 0.15 + (mouseX - 0.5) * 0.03) * w;
        const by = (blob.y + Math.cos(t * blob.speed * 0.8 + blob.phase) * 0.12 + (mouseY - 0.5) * 0.03) * h;
        const br = blob.r * Math.min(w, h) * (0.9 + Math.sin(t * blob.speed * 1.5 + blob.phase) * 0.1);

        const gradient = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        const [r, g, b] = blob.color;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.12)`);
        gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, 0.06)`);
        gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, 0.02)`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      });

      // Subtle noise overlay for texture
      ctx.globalAlpha = 0.015;
      for (let i = 0; i < 60; i++) {
        const nx = Math.random() * w;
        const ny = Math.random() * h;
        ctx.fillStyle = Math.random() > 0.5 ? "#000" : "#fff";
        ctx.fillRect(nx, ny, 1, 1);
      }
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isLight]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 transition-opacity duration-700 ${
        isLight ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ pointerEvents: "none" }}
    />
  );
};

export default AuroraBg;
