import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Pen,
  Flame,
  Stars,
  Trash2,
  Download,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";
import AnimatedHeading from "./AnimatedHeading";

/* ── Brush modes ──────────────────────────────────────────────────────────── */
const MODES = [
  { id: "glow", label: "Glow", Icon: Sparkles },
  { id: "neon", label: "Neon", Icon: Pen },
  { id: "fire", label: "Fire", Icon: Flame },
  { id: "galaxy", label: "Galaxy", Icon: Stars },
];

const PALETTE = [
  "#6366F1", "#06B6D4", "#A855F7", "#34D399",
  "#FB7185", "#FBBF24", "#FFFFFF", "#FF6B6B",
];

/* ── Particle system ──────────────────────────────────────────────────────── */
class Particle {
  constructor(x, y, color, size, mode) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.mode = mode;
    this.alpha = 1;
    this.life = 1;

    if (mode === "glow") {
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5 - 0.8;
      this.decay = 0.006 + Math.random() * 0.004;
    } else if (mode === "neon") {
      this.vx = 0;
      this.vy = 0;
      this.decay = 0.0008;
    } else if (mode === "fire") {
      this.vx = (Math.random() - 0.5) * 2.5;
      this.vy = -Math.random() * 3 - 1;
      this.decay = 0.012 + Math.random() * 0.008;
      this.hue = 0;
    } else if (mode === "galaxy") {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.3;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.decay = 0.003 + Math.random() * 0.002;
      this.angle = angle;
    }
  }

  update() {
    this.life -= this.decay;
    this.alpha = Math.max(0, this.life);
    this.x += this.vx;
    this.y += this.vy;

    if (this.mode === "glow") {
      this.vy -= 0.015;
      this.size *= 0.997;
    } else if (this.mode === "fire") {
      this.vy -= 0.04;
      this.size *= 0.985;
      this.hue = Math.min(60, this.hue + 1.5);
    } else if (this.mode === "galaxy") {
      this.vx *= 0.995;
      this.vy *= 0.995;
      this.size *= 0.998;
    }
  }

  draw(ctx) {
    if (this.alpha <= 0 || this.size < 0.2) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;

    let color = this.color;
    if (this.mode === "fire") {
      const r = 255;
      const g = Math.floor(80 + this.hue * 2.5);
      const b = Math.floor(20 * this.life);
      color = `rgb(${r},${g},${b})`;
    }

    const blur = this.mode === "neon" ? 18 : this.mode === "glow" ? 15 : this.mode === "fire" ? 12 : 8;
    ctx.shadowBlur = blur;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0.3, this.size), 0, Math.PI * 2);
    ctx.fill();

    if (this.mode === "glow" || this.mode === "galaxy") {
      ctx.globalAlpha = this.alpha * 0.3;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

/* ── Component ────────────────────────────────────────────────────────────── */
const Playground = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef(null);

  const [mode, setMode] = useState("glow");
  const [color, setColor] = useState("#6366F1");
  const [brushSize, setBrushSize] = useState(4);
  const [particleCount, setParticleCount] = useState(0);

  /* ── Resize canvas ── */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = container.clientWidth * dpr;
    canvas.height = container.clientHeight * dpr;
    canvas.style.width = container.clientWidth + "px";
    canvas.style.height = container.clientHeight + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
  }, []);

  /* ── Animation loop ── */
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      // Fade-trail effect
      ctx.fillStyle = "rgba(10, 10, 20, 0.08)";
      ctx.fillRect(0, 0, w, h);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);
        if (particles[i].life <= 0 || particles[i].size < 0.2) {
          particles.splice(i, 1);
        }
      }

      setParticleCount(particles.length);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [resizeCanvas]);

  /* ── Spawn particles between two points ── */
  const spawnParticles = useCallback(
    (x, y, prevX, prevY) => {
      const dist = prevX !== null ? Math.hypot(x - prevX, y - prevY) : 0;
      const steps = Math.max(1, Math.floor(dist / 3));

      for (let s = 0; s < steps; s++) {
        const t = steps > 1 ? s / (steps - 1) : 1;
        const px = prevX !== null ? prevX + (x - prevX) * t : x;
        const py = prevY !== null ? prevY + (y - prevY) * t : y;

        const count = mode === "fire" ? 3 : mode === "galaxy" ? 2 : mode === "neon" ? 4 : 2;
        for (let i = 0; i < count; i++) {
          const jitter = mode === "neon" ? 0.5 : brushSize * 0.4;
          particlesRef.current.push(
            new Particle(
              px + (Math.random() - 0.5) * jitter,
              py + (Math.random() - 0.5) * jitter,
              color,
              brushSize * (0.6 + Math.random() * 0.8),
              mode
            )
          );
        }
      }

      // Cap particles for performance
      if (particlesRef.current.length > 8000) {
        particlesRef.current.splice(0, particlesRef.current.length - 8000);
      }
    },
    [mode, color, brushSize]
  );

  /* ── Pointer events ── */
  const getPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    isDrawingRef.current = true;
    const pos = getPos(e);
    lastPosRef.current = pos;
    spawnParticles(pos.x, pos.y, null, null);
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const pos = getPos(e);
    const prev = lastPosRef.current;
    spawnParticles(pos.x, pos.y, prev?.x ?? null, prev?.y ?? null);
    lastPosRef.current = pos;
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  /* ── Clear canvas ── */
  const clearCanvas = () => {
    particlesRef.current = [];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(10, 10, 20)";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  };

  /* ── Save as image ── */
  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "playground-art.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <section className="relative min-h-screen pt-24 pb-16 bg-[var(--color-bg)] dark:bg-transparent">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <AnimatedHeading>Playground</AnimatedHeading>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-[var(--color-text-muted)] mt-3 text-sm sm:text-base max-w-md mx-auto"
          >
            Draw, create, and play with particles. Click and drag to paint!
          </motion.p>
        </div>

        {/* Canvas area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
          style={{ height: "clamp(400px, 60vh, 700px)" }}
        >
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full bg-[#0a0a14] touch-none"
            style={{ cursor: "crosshair" }}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          />

          {/* ── Floating toolbar ── */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              {/* Mode buttons */}
              {MODES.map((m) => {
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                      active
                        ? "text-white"
                        : "text-white/50 hover:text-white/80"
                    }`}
                    title={m.label}
                  >
                    {active && (
                      <motion.div
                        layoutId="mode-pill"
                        className="absolute inset-0 rounded-xl"
                        style={{ backgroundColor: color, opacity: 0.25 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <m.Icon size={14} className="relative z-10" />
                    <span className="relative z-10 hidden sm:inline">{m.label}</span>
                  </button>
                );
              })}

              {/* Divider */}
              <div className="w-px h-6 bg-white/15 mx-1" />

              {/* Color palette */}
              <div className="flex items-center gap-1.5">
                {PALETTE.slice(0, 6).map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className="w-5 h-5 rounded-full transition-transform duration-150 hover:scale-125 flex-shrink-0"
                    style={{
                      backgroundColor: c,
                      boxShadow:
                        color === c
                          ? `0 0 0 2px #0a0a14, 0 0 0 3.5px ${c}`
                          : "none",
                    }}
                  />
                ))}
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-white/15 mx-1" />

              {/* Brush size */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setBrushSize((s) => Math.max(1, s - 1))}
                  className="p-1 rounded-lg text-white/50 hover:text-white/80 transition-colors"
                >
                  <Minus size={12} />
                </button>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  title={`Size: ${brushSize}`}
                >
                  <div
                    className="rounded-full"
                    style={{
                      width: Math.max(4, brushSize * 2),
                      height: Math.max(4, brushSize * 2),
                      backgroundColor: color,
                      boxShadow: `0 0 8px ${color}`,
                    }}
                  />
                </div>
                <button
                  onClick={() => setBrushSize((s) => Math.min(16, s + 1))}
                  className="p-1 rounded-lg text-white/50 hover:text-white/80 transition-colors"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-white/15 mx-1" />

              {/* Actions */}
              <button
                onClick={clearCanvas}
                className="p-1.5 rounded-lg text-white/50 hover:text-red-400 transition-colors"
                title="Clear canvas"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={saveImage}
                className="p-1.5 rounded-lg text-white/50 hover:text-emerald-400 transition-colors"
                title="Save as image"
              >
                <Download size={14} />
              </button>
            </div>
          </motion.div>

          {/* Particle counter */}
          <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-[10px] text-white/40 font-mono">
            {particleCount.toLocaleString()} particles
          </div>

          {/* Hint overlay - shows briefly */}
          <AnimatePresence>
            {particleCount === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${color}20`, border: `1px solid ${color}30` }}
                  >
                    <Sparkles size={24} style={{ color }} />
                  </motion.div>
                  <p className="text-white/30 text-sm font-medium">Click & drag to paint</p>
                  <p className="text-white/20 text-xs mt-1">Try different modes below</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {MODES.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.1 }}
              onClick={() => setMode(m.id)}
              className={`group p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                mode === m.id
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/30"
              }`}
            >
              <m.Icon
                size={20}
                className={`mb-2 transition-colors ${
                  mode === m.id ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"
                }`}
              />
              <p className="text-sm font-semibold text-[var(--color-text)]">{m.label}</p>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
                {m.id === "glow" && "Soft glowing particles that float upward"}
                {m.id === "neon" && "Bright neon trails that slowly fade"}
                {m.id === "fire" && "Fiery particles with heat color shift"}
                {m.id === "galaxy" && "Swirling cosmic particles in orbit"}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Playground;
