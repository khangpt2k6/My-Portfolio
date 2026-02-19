import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Pen,
  Flame,
  Stars,
  Magnet,
  Zap,
  Trash2,
  Download,
  Minus,
  Plus,
  Maximize,
  Minimize,
  FlipHorizontal2,
} from "lucide-react";
import AnimatedHeading from "./AnimatedHeading";

/* ── Brush modes ──────────────────────────────────────────────────────────── */
const MODES = [
  { id: "glow", label: "Glow", Icon: Sparkles },
  { id: "neon", label: "Neon", Icon: Pen },
  { id: "fire", label: "Fire", Icon: Flame },
  { id: "galaxy", label: "Galaxy", Icon: Stars },
  { id: "attract", label: "Attract", Icon: Magnet },
  { id: "fireworks", label: "Burst", Icon: Zap },
];

const PALETTE = [
  "#6366F1", "#06B6D4", "#A855F7", "#34D399",
  "#FB7185", "#FBBF24", "#FFFFFF", "#FF6B6B",
];

/* ── Ambient constellation node ───────────────────────────────────────────── */
class AmbientNode {
  constructor(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.radius = Math.random() * 1.5 + 0.5;
    this.baseAlpha = Math.random() * 0.3 + 0.1;
    this.w = w;
    this.h = h;
  }

  update(mouseX, mouseY) {
    this.x += this.vx;
    this.y += this.vy;

    // Wrap around edges
    if (this.x < 0) this.x = this.w;
    if (this.x > this.w) this.x = 0;
    if (this.y < 0) this.y = this.h;
    if (this.y > this.h) this.y = 0;

    // Gentle mouse repulsion
    if (mouseX !== null && mouseY !== null) {
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120 && dist > 0) {
        const force = (120 - dist) / 120 * 0.3;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }
    }

    // Damping
    this.vx *= 0.99;
    this.vy *= 0.99;

    // Speed limit
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > 1.5) {
      this.vx = (this.vx / speed) * 1.5;
      this.vy = (this.vy / speed) * 1.5;
    }
  }
}

/* ── Drawing particle ─────────────────────────────────────────────────────── */
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
    } else if (mode === "attract") {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.decay = 0.004 + Math.random() * 0.003;
      this.targetX = x;
      this.targetY = y;
    } else if (mode === "fireworks") {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.decay = 0.008 + Math.random() * 0.006;
      this.gravity = 0.06;
      this.trail = [];
    }
  }

  update(mouseX, mouseY) {
    this.life -= this.decay;
    this.alpha = Math.max(0, this.life);

    if (this.mode === "attract" && mouseX !== null && mouseY !== null) {
      // Pull toward mouse
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 1) {
        this.vx += (dx / dist) * 0.15;
        this.vy += (dy / dist) * 0.15;
      }
      this.vx *= 0.97;
      this.vy *= 0.97;
    }

    if (this.mode === "fireworks") {
      this.vy += this.gravity;
      this.vx *= 0.98;
      this.vy *= 0.98;
      // Trail
      if (this.life > 0.3) {
        this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
        if (this.trail.length > 8) this.trail.shift();
      }
    }

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

    // Draw trail for fireworks
    if (this.mode === "fireworks" && this.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = this.size * 0.5;
      ctx.globalAlpha = this.alpha * 0.4;
      ctx.stroke();
      ctx.globalAlpha = this.alpha;
    }

    const blur = this.mode === "neon" ? 18 : this.mode === "attract" ? 12 : this.mode === "fireworks" ? 10 : this.mode === "glow" ? 15 : this.mode === "fire" ? 12 : 8;
    ctx.shadowBlur = blur;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0.3, this.size), 0, Math.PI * 2);
    ctx.fill();

    // Outer glow for certain modes
    if (this.mode === "glow" || this.mode === "galaxy" || this.mode === "attract") {
      ctx.globalAlpha = this.alpha * 0.2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

/* ── Component ────────────────────────────────────────────────────────────── */
const Playground = ({ embedded = false }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const ambientRef = useRef([]);
  const animFrameRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null });

  const [mode, setMode] = useState("glow");
  const [color, setColor] = useState("#6366F1");
  const [brushSize, setBrushSize] = useState(4);
  const [symmetry, setSymmetry] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [particleCount, setParticleCount] = useState(0);
  const [hasDrawn, setHasDrawn] = useState(false);

  const containerRef = useRef(null);

  /* ── Resize canvas + init ambient particles ── */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const w = container.clientWidth;
    const h = container.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    // Init or resize ambient nodes
    if (ambientRef.current.length === 0) {
      for (let i = 0; i < 60; i++) {
        ambientRef.current.push(new AmbientNode(w, h));
      }
    } else {
      ambientRef.current.forEach((n) => { n.w = w; n.h = h; });
    }
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
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Fade-trail
      ctx.fillStyle = "rgba(10, 10, 20, 0.06)";
      ctx.fillRect(0, 0, w, h);

      // Draw ambient constellation
      const nodes = ambientRef.current;
      const CONNECTION_DIST = 100;

      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update(mx, my);

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Draw connection to mouse
        if (mx !== null && my !== null) {
          const dx = nodes[i].x - mx;
          const dy = nodes[i].y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.2;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mx, my);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, nodes[i].radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${nodes[i].baseAlpha})`;
        ctx.fill();
      }

      // Update and draw particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update(mx, my);
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

  /* ── Spawn particles ── */
  const spawnParticles = useCallback(
    (x, y, prevX, prevY) => {
      const spawn = (px, py, pPrevX, pPrevY) => {
        const dist = pPrevX !== null ? Math.hypot(px - pPrevX, py - pPrevY) : 0;
        const steps = Math.max(1, Math.floor(dist / 3));

        for (let s = 0; s < steps; s++) {
          const t = steps > 1 ? s / (steps - 1) : 1;
          const ix = pPrevX !== null ? pPrevX + (px - pPrevX) * t : px;
          const iy = pPrevY !== null ? pPrevY + (py - pPrevY) * t : py;

          const count =
            mode === "fire" ? 3 :
            mode === "galaxy" ? 2 :
            mode === "neon" ? 4 :
            mode === "attract" ? 3 :
            mode === "fireworks" ? 0 : 2;

          for (let i = 0; i < count; i++) {
            const jitter = mode === "neon" ? 0.5 : brushSize * 0.4;
            particlesRef.current.push(
              new Particle(
                ix + (Math.random() - 0.5) * jitter,
                iy + (Math.random() - 0.5) * jitter,
                color,
                brushSize * (0.6 + Math.random() * 0.8),
                mode
              )
            );
          }
        }
      };

      // Fireworks: spawn burst on click, not drag
      if (mode === "fireworks") {
        const burstCount = 40 + Math.floor(brushSize * 5);
        for (let i = 0; i < burstCount; i++) {
          particlesRef.current.push(
            new Particle(x, y, color, brushSize * (0.3 + Math.random() * 0.7), "fireworks")
          );
        }
      } else {
        spawn(x, y, prevX, prevY);
      }

      // Symmetry mirror
      if (symmetry && mode !== "fireworks") {
        const canvas = canvasRef.current;
        if (canvas) {
          const mirrorX = canvas.clientWidth - x;
          const mirrorPrevX = prevX !== null ? canvas.clientWidth - prevX : null;
          spawn(mirrorX, y, mirrorPrevX, prevY);
        }
      }

      // Cap particles
      if (particlesRef.current.length > 10000) {
        particlesRef.current.splice(0, particlesRef.current.length - 10000);
      }
    },
    [mode, color, brushSize, symmetry]
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
    setHasDrawn(true);
    const pos = getPos(e);
    lastPosRef.current = pos;
    spawnParticles(pos.x, pos.y, null, null);
  };

  const handlePointerMove = (e) => {
    const pos = getPos(e);
    mouseRef.current = pos;
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const prev = lastPosRef.current;
    if (mode !== "fireworks") {
      spawnParticles(pos.x, pos.y, prev?.x ?? null, prev?.y ?? null);
    }
    lastPosRef.current = pos;
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  const handleMouseLeave = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
    mouseRef.current = { x: null, y: null };
  };

  /* ── Clear canvas ── */
  const clearCanvas = () => {
    particlesRef.current = [];
    setHasDrawn(false);
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

  /* ── Fullscreen toggle ── */
  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "c" || e.key === "C") clearCanvas();
      if (e.key === "s" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setSymmetry((s) => !s);
      }
      if (e.key === "f" || e.key === "F") toggleFullscreen();
      if (e.key === "[") setBrushSize((s) => Math.max(1, s - 1));
      if (e.key === "]") setBrushSize((s) => Math.min(16, s + 1));
      // Mode shortcuts: 1-6
      const num = parseInt(e.key);
      if (num >= 1 && num <= MODES.length) setMode(MODES[num - 1].id);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <section className={`relative ${embedded ? "" : `min-h-screen bg-[var(--color-bg)] dark:bg-transparent ${isFullscreen ? "" : "pt-24 pb-16"}`}`}>
      <div className={`relative mx-auto ${isFullscreen ? "max-w-none px-0" : embedded ? "" : "max-w-6xl px-4 sm:px-6"}`}>
        {/* Header — hidden in fullscreen & embedded */}
        {!isFullscreen && !embedded && (
          <div className="text-center mb-8">
            <AnimatedHeading>Playground</AnimatedHeading>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-[var(--color-text-muted)] mt-3 text-sm sm:text-base max-w-lg mx-auto"
            >
              An interactive particle canvas — draw, create, and experiment with physics.
            </motion.p>
          </div>
        )}

        {/* Canvas area */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`relative overflow-hidden ${
            isFullscreen
              ? "w-screen h-screen"
              : "rounded-2xl border border-[var(--color-border)] shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
          }`}
          style={isFullscreen ? {} : { height: "clamp(450px, 65vh, 750px)" }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full bg-[#0a0a14] touch-none"
            style={{ cursor: mode === "fireworks" ? "crosshair" : "none" }}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          />

          {/* Custom canvas cursor (non-fireworks) */}
          {mode !== "fireworks" && (
            <div
              className="absolute pointer-events-none z-30 rounded-full border transition-all duration-75"
              style={{
                width: brushSize * 4 + 4,
                height: brushSize * 4 + 4,
                borderColor: `${color}60`,
                boxShadow: `0 0 12px ${color}30`,
                left: mouseRef.current.x !== null ? mouseRef.current.x : -100,
                top: mouseRef.current.y !== null ? mouseRef.current.y : -100,
                transform: "translate(-50%, -50%)",
                display: mouseRef.current.x !== null ? "block" : "none",
              }}
            />
          )}

          {/* ── Floating toolbar ── */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 max-w-full px-2"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              {/* Mode buttons */}
              <div className="flex items-center gap-0.5">
                {MODES.map((m) => {
                  const active = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`relative flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 ${
                        active ? "text-white" : "text-white/40 hover:text-white/70"
                      }`}
                      title={`${m.label} (${MODES.indexOf(m) + 1})`}
                    >
                      {active && (
                        <motion.div
                          layoutId="mode-pill"
                          className="absolute inset-0 rounded-lg"
                          style={{ backgroundColor: color, opacity: 0.2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <m.Icon size={13} className="relative z-10" />
                      <span className="relative z-10 hidden md:inline">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="w-px h-5 bg-white/10" />

              {/* Colors */}
              <div className="flex items-center gap-1">
                {PALETTE.slice(0, 6).map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-transform duration-150 hover:scale-125 flex-shrink-0"
                    style={{
                      backgroundColor: c,
                      boxShadow: color === c ? `0 0 0 2px #0a0a14, 0 0 0 3px ${c}` : "none",
                    }}
                  />
                ))}
              </div>

              <div className="w-px h-5 bg-white/10" />

              {/* Brush size */}
              <div className="flex items-center gap-0.5">
                <button onClick={() => setBrushSize((s) => Math.max(1, s - 1))} className="p-1 text-white/40 hover:text-white/70 transition-colors" title="Smaller ([)">
                  <Minus size={11} />
                </button>
                <div className="w-5 h-5 flex items-center justify-center" title={`Size: ${brushSize}`}>
                  <div className="rounded-full" style={{ width: Math.max(3, brushSize * 1.5), height: Math.max(3, brushSize * 1.5), backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
                </div>
                <button onClick={() => setBrushSize((s) => Math.min(16, s + 1))} className="p-1 text-white/40 hover:text-white/70 transition-colors" title="Larger (])">
                  <Plus size={11} />
                </button>
              </div>

              <div className="w-px h-5 bg-white/10" />

              {/* Toggles & Actions */}
              <button
                onClick={() => setSymmetry((s) => !s)}
                className={`p-1.5 rounded-lg transition-colors ${symmetry ? "text-cyan-400 bg-cyan-400/10" : "text-white/40 hover:text-white/70"}`}
                title="Symmetry (S)"
              >
                <FlipHorizontal2 size={13} />
              </button>
              <button onClick={clearCanvas} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 transition-colors" title="Clear (C)">
                <Trash2 size={13} />
              </button>
              <button onClick={saveImage} className="p-1.5 rounded-lg text-white/40 hover:text-emerald-400 transition-colors" title="Save">
                <Download size={13} />
              </button>
              <button onClick={toggleFullscreen} className="p-1.5 rounded-lg text-white/40 hover:text-white/70 transition-colors" title="Fullscreen (F)">
                {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
              </button>
            </div>
          </motion.div>

          {/* Particle counter + shortcuts hint */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            <div className="px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-[10px] text-white/30 font-mono">
              {particleCount.toLocaleString()} particles
            </div>
          </div>

          {/* Keyboard shortcuts hint — top-left, fades after first draw */}
          <AnimatePresence>
            {!hasDrawn && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1 }}
                className="absolute top-3 left-3 z-10 px-3 py-2 rounded-lg bg-black/40 backdrop-blur-sm hidden sm:block"
              >
                <div className="space-y-1 text-[10px] text-white/25 font-mono">
                  <p><span className="text-white/40">1-6</span> modes</p>
                  <p><span className="text-white/40">[ ]</span> size</p>
                  <p><span className="text-white/40">S</span> symmetry</p>
                  <p><span className="text-white/40">C</span> clear</p>
                  <p><span className="text-white/40">F</span> fullscreen</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Center hint — before first draw */}
          <AnimatePresence>
            {!hasDrawn && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
                  >
                    <Sparkles size={24} style={{ color, opacity: 0.6 }} />
                  </motion.div>
                  <p className="text-white/25 text-sm font-medium">Click & drag to create</p>
                  <p className="text-white/15 text-xs mt-1">Move your cursor — the constellation reacts to you</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Playground;
