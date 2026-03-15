import { useRef, useEffect, useState } from "react";

const AuroraBg = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [isLight, setIsLight] = useState(
    typeof document !== "undefined" &&
      !document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const root = document.documentElement;
    const check = () => setIsLight(!root.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isLight) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let w, h;
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── Floating particles ── */
    const particleCount = Math.min(80, Math.floor(w * h / 15000));
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 1.5 + Math.random() * 3,
        speedY: -(0.15 + Math.random() * 0.4),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: 0.15 + Math.random() * 0.3,
        hue: 210 + Math.random() * 60, // blue to purple range
        drift: Math.random() * Math.PI * 2,
        driftSpeed: 0.003 + Math.random() * 0.005,
      });
    }

    /* ── Flowing wave blobs ── */
    const blobs = [
      { cx: 0.25, cy: 0.3, rx: 0.5, ry: 0.35, color: [99, 102, 241], phase: 0, speed: 0.4 },
      { cx: 0.75, cy: 0.25, rx: 0.45, ry: 0.3, color: [6, 182, 212], phase: 1.5, speed: 0.35 },
      { cx: 0.5, cy: 0.7, rx: 0.55, ry: 0.4, color: [147, 51, 234], phase: 3.0, speed: 0.45 },
      { cx: 0.8, cy: 0.65, rx: 0.4, ry: 0.3, color: [236, 72, 153], phase: 4.5, speed: 0.3 },
      { cx: 0.15, cy: 0.75, rx: 0.4, ry: 0.35, color: [34, 197, 94], phase: 2.2, speed: 0.38 },
    ];

    /* ── Glowing orbs (pulse) ── */
    const orbs = [
      { x: 0.3, y: 0.4, baseR: 60, color: [99, 102, 241], phase: 0, speed: 0.8 },
      { x: 0.7, y: 0.3, baseR: 50, color: [6, 182, 212], phase: 2, speed: 0.6 },
      { x: 0.5, y: 0.75, baseR: 55, color: [147, 51, 234], phase: 4, speed: 0.7 },
    ];

    let mouseX = 0.5, mouseY = 0.5;
    const onMove = (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);

    let paused = false;
    let t = 0;

    const onVisibilityChange = () => {
      if (document.hidden) {
        paused = true;
        cancelAnimationFrame(animRef.current);
      } else {
        paused = false;
        animRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const animate = () => {
      if (paused) return;
      t += 0.016;
      animRef.current = requestAnimationFrame(animate);

      /* Clear with white */
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, w, h);

      /* ── Draw flowing gradient blobs ── */
      ctx.globalCompositeOperation = "multiply";
      blobs.forEach((blob) => {
        const bx = (blob.cx + Math.sin(t * blob.speed + blob.phase) * 0.18 + (mouseX - 0.5) * 0.05) * w;
        const by = (blob.cy + Math.cos(t * blob.speed * 0.7 + blob.phase) * 0.14 + (mouseY - 0.5) * 0.05) * h;
        const brx = blob.rx * w * (0.85 + Math.sin(t * blob.speed * 0.5 + blob.phase) * 0.15);
        const bry = blob.ry * h * (0.85 + Math.cos(t * blob.speed * 0.6 + blob.phase + 1) * 0.15);

        ctx.save();
        ctx.translate(bx, by);
        ctx.scale(1, bry / brx);

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, brx);
        const [r, g, b] = blob.color;
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.12)`);
        grad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.07)`);
        grad.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.03)`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, brx, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      /* ── Pulsing glow orbs ── */
      ctx.globalCompositeOperation = "screen";
      orbs.forEach((orb) => {
        const ox = (orb.x + Math.sin(t * 0.3 + orb.phase) * 0.08 + (mouseX - 0.5) * 0.04) * w;
        const oy = (orb.y + Math.cos(t * 0.25 + orb.phase) * 0.06 + (mouseY - 0.5) * 0.04) * h;
        const pulse = orb.baseR + Math.sin(t * orb.speed + orb.phase) * 20;

        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, pulse);
        const [r, g, b] = orb.color;
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.15)`);
        grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.06)`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ox, oy, pulse, 0, Math.PI * 2);
        ctx.fill();
      });

      /* ── Floating particles ── */
      ctx.globalCompositeOperation = "source-over";
      particles.forEach((p) => {
        p.drift += p.driftSpeed;
        p.x += p.speedX + Math.sin(p.drift) * 0.3;
        p.y += p.speedY;

        /* Wrap around */
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const flickerOpacity = p.opacity * (0.7 + Math.sin(t * 2 + p.drift) * 0.3);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, ${flickerOpacity})`;
        ctx.fill();
      });

      /* ── Flowing wave lines ── */
      ctx.globalCompositeOperation = "source-over";
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.04 + i * 0.01})`;
        ctx.lineWidth = 1;
        const yBase = h * (0.3 + i * 0.2);
        for (let x = 0; x <= w; x += 4) {
          const y = yBase
            + Math.sin(x * 0.003 + t * (0.5 + i * 0.15) + i) * 40
            + Math.sin(x * 0.007 + t * 0.3 + i * 2) * 20;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      paused = true;
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
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
