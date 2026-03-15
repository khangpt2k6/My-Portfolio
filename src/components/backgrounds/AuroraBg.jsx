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
      initBokeh();
    };

    /* ── Mouse ── */
    let mouseX = 0.5, mouseY = 0.5;
    let targetMouseX = 0.5, targetMouseY = 0.5;
    const onMove = (e) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);

    /* ── Metaball-style mesh blobs ── */
    const blobs = [
      { cx: 0.15, cy: 0.2,  r: 0.4,  color: [120, 140, 255], phase: 0,    sx: 0.25,  sy: 0.18 },
      { cx: 0.75, cy: 0.15, r: 0.35, color: [80, 200, 240],  phase: 1.8,  sx: 0.22,  sy: 0.20 },
      { cx: 0.5,  cy: 0.6,  r: 0.45, color: [180, 120, 255], phase: 3.2,  sx: 0.20,  sy: 0.25 },
      { cx: 0.85, cy: 0.55, r: 0.3,  color: [255, 130, 200], phase: 4.8,  sx: 0.28,  sy: 0.15 },
      { cx: 0.2,  cy: 0.75, r: 0.35, color: [100, 220, 200], phase: 2.0,  sx: 0.18,  sy: 0.22 },
      { cx: 0.55, cy: 0.35, r: 0.28, color: [255, 180, 130], phase: 5.5,  sx: 0.24,  sy: 0.16 },
    ];

    /* ── Bokeh particles (soft glowing circles) ── */
    let bokeh = [];
    function initBokeh() {
      const count = Math.min(35, Math.floor((w * h) / 40000));
      bokeh = [];
      for (let i = 0; i < count; i++) {
        bokeh.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 15 + Math.random() * 60,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: -(0.1 + Math.random() * 0.3),
          hue: [220, 260, 300, 180, 330][Math.floor(Math.random() * 5)],
          opacity: 0.03 + Math.random() * 0.06,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.3 + Math.random() * 0.5,
        });
      }
    }

    /* ── Light rays ── */
    const rays = [];
    for (let i = 0; i < 5; i++) {
      rays.push({
        angle: -0.4 + i * 0.2,
        width: 60 + Math.random() * 100,
        opacity: 0.02 + Math.random() * 0.02,
        speed: 0.05 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2,
        x: 0.2 + Math.random() * 0.6,
      });
    }

    resize();
    window.addEventListener("resize", resize);

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
      animRef.current = requestAnimationFrame(animate);
      t += 0.01;

      /* Smooth mouse lerp */
      mouseX += (targetMouseX - mouseX) * 0.03;
      mouseY += (targetMouseY - mouseY) * 0.03;

      /* ── Base: warm white ── */
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, w, h);

      /* ── Mesh gradient blobs (multiply for rich color mixing) ── */
      ctx.globalCompositeOperation = "multiply";
      blobs.forEach((blob) => {
        const bx = (blob.cx + Math.sin(t * blob.sx + blob.phase) * 0.2 + (mouseX - 0.5) * 0.06) * w;
        const by = (blob.cy + Math.cos(t * blob.sy + blob.phase) * 0.15 + (mouseY - 0.5) * 0.06) * h;
        const br = blob.r * Math.min(w, h) * (0.8 + Math.sin(t * blob.sx * 0.6 + blob.phase) * 0.2);

        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        const [r, g, b] = blob.color;
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.18)`);
        grad.addColorStop(0.25, `rgba(${r}, ${g}, ${b}, 0.12)`);
        grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.06)`);
        grad.addColorStop(0.75, `rgba(${r}, ${g}, ${b}, 0.02)`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
      });

      /* ── Soft light rays from top ── */
      ctx.globalCompositeOperation = "screen";
      rays.forEach((ray) => {
        const rayOpacity = ray.opacity * (0.6 + Math.sin(t * ray.speed + ray.phase) * 0.4);
        const rx = (ray.x + Math.sin(t * 0.15 + ray.phase) * 0.1 + (mouseX - 0.5) * 0.03) * w;

        ctx.save();
        ctx.translate(rx, 0);
        ctx.rotate(ray.angle + Math.sin(t * 0.1 + ray.phase) * 0.03);

        const grad = ctx.createLinearGradient(0, 0, 0, h * 1.2);
        grad.addColorStop(0, `rgba(255, 255, 255, ${rayOpacity * 2})`);
        grad.addColorStop(0.3, `rgba(200, 210, 255, ${rayOpacity})`);
        grad.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(-ray.width / 2, 0);
        ctx.lineTo(ray.width / 2, 0);
        ctx.lineTo(ray.width * 1.5, h * 1.2);
        ctx.lineTo(-ray.width * 1.5, h * 1.2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      /* ── Bokeh (soft glowing circles) ── */
      ctx.globalCompositeOperation = "source-over";
      bokeh.forEach((b) => {
        b.x += b.speedX + Math.sin(t + b.phase) * 0.2;
        b.y += b.speedY;
        const pulse = b.r * (0.85 + Math.sin(t * b.pulseSpeed + b.phase) * 0.15);
        const flickerOp = b.opacity * (0.6 + Math.sin(t * 1.5 + b.phase) * 0.4);

        /* Wrap */
        if (b.y < -b.r * 2) { b.y = h + b.r * 2; b.x = Math.random() * w; }
        if (b.x < -b.r * 2) b.x = w + b.r * 2;
        if (b.x > w + b.r * 2) b.x = -b.r * 2;

        /* Outer glow ring */
        const grad = ctx.createRadialGradient(b.x, b.y, pulse * 0.2, b.x, b.y, pulse);
        grad.addColorStop(0, `hsla(${b.hue}, 70%, 80%, ${flickerOp * 1.5})`);
        grad.addColorStop(0.4, `hsla(${b.hue}, 60%, 85%, ${flickerOp * 0.8})`);
        grad.addColorStop(0.7, `hsla(${b.hue}, 50%, 90%, ${flickerOp * 0.3})`);
        grad.addColorStop(1, `hsla(${b.hue}, 40%, 95%, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, pulse, 0, Math.PI * 2);
        ctx.fill();

        /* Inner bright core */
        const coreGrad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, pulse * 0.25);
        coreGrad.addColorStop(0, `hsla(${b.hue}, 80%, 95%, ${flickerOp * 2})`);
        coreGrad.addColorStop(1, `hsla(${b.hue}, 60%, 90%, 0)`);
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, pulse * 0.25, 0, Math.PI * 2);
        ctx.fill();
      });

      /* ── Flowing aurora waves ── */
      ctx.globalCompositeOperation = "source-over";
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const hue = 220 + i * 30;
        ctx.strokeStyle = `hsla(${hue}, 60%, 75%, ${0.06 - i * 0.008})`;
        ctx.lineWidth = 1.5;
        const yBase = h * (0.25 + i * 0.18);
        for (let x = 0; x <= w; x += 3) {
          const y = yBase
            + Math.sin(x * 0.002 + t * (0.6 + i * 0.12) + i * 1.5) * 50
            + Math.sin(x * 0.005 + t * 0.4 + i * 0.8) * 25
            + Math.cos(x * 0.001 + t * 0.2) * 30;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      /* ── Tiny sparkle dots ── */
      ctx.globalCompositeOperation = "source-over";
      for (let i = 0; i < 8; i++) {
        const sparkleT = t * 0.5 + i * 1.2;
        const sx = (Math.sin(sparkleT * 0.7 + i) * 0.3 + 0.5) * w;
        const sy = (Math.cos(sparkleT * 0.5 + i * 0.8) * 0.3 + 0.5) * h;
        const sparkleOp = Math.max(0, Math.sin(sparkleT * 2) * 0.4);

        if (sparkleOp > 0.05) {
          /* Cross shape sparkle */
          ctx.strokeStyle = `rgba(150, 160, 255, ${sparkleOp})`;
          ctx.lineWidth = 1;
          const sLen = 4 + Math.sin(sparkleT * 3) * 2;

          ctx.beginPath();
          ctx.moveTo(sx - sLen, sy);
          ctx.lineTo(sx + sLen, sy);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(sx, sy - sLen);
          ctx.lineTo(sx, sy + sLen);
          ctx.stroke();

          /* Bright center dot */
          ctx.fillStyle = `rgba(200, 210, 255, ${sparkleOp * 1.5})`;
          ctx.beginPath();
          ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
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
