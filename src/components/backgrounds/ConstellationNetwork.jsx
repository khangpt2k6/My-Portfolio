import { useEffect, useRef, useCallback } from "react";

/**
 * Interactive Particle Constellation Network
 * - Floating particles drift and connect with glowing lines when nearby
 * - Mouse cursor acts as an attractor node, pulling particles + drawing connections
 * - Adapts density/count based on container size
 * - Uses theme CSS variables for color
 */
const ConstellationNetwork = ({
  particleCount = 60,
  connectionDistance = 140,
  mouseConnectionDistance = 180,
  mouseAttractionStrength = 0.012,
  particleSpeed = 0.3,
  particleSize = { min: 1, max: 3 },
  opacity = 0.6,
  className = "",
}) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const particlesRef = useRef([]);
  const dimRef = useRef({ w: 0, h: 0 });

  const getThemeColor = useCallback(() => {
    const root = getComputedStyle(document.documentElement);
    const rgb = root.getPropertyValue("--color-primary-rgb").trim();
    if (rgb) return rgb.split(",").map((v) => parseInt(v.trim()));
    return [99, 102, 241]; // fallback indigo
  }, []);

  // Initialize particles for given dimensions
  const initParticles = useCallback(
    (w, h) => {
      // Scale particle count by area relative to a 1920x1080 baseline
      const area = w * h;
      const baseArea = 1920 * 1080;
      const scaledCount = Math.round(particleCount * Math.min(area / baseArea, 1.5));
      const count = Math.max(20, scaledCount);

      const particles = [];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 0.5 + 0.5) * particleSpeed;
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * (particleSize.max - particleSize.min) + particleSize.min,
          pulseOffset: Math.random() * Math.PI * 2,
          baseAlpha: Math.random() * 0.4 + 0.3,
        });
      }
      particlesRef.current = particles;
    },
    [particleCount, particleSpeed, particleSize]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Reinit particles if dimensions changed significantly
      const prev = dimRef.current;
      if (Math.abs(prev.w - w) > 50 || Math.abs(prev.h - h) > 50) {
        dimRef.current = { w, h };
        initParticles(w, h);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    // Mouse tracking
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    const onMouseLeave = () => {
      mouseRef.current = { ...mouseRef.current, active: false };
    };

    const parent = canvas.parentElement;
    parent.addEventListener("mousemove", onMouseMove);
    parent.addEventListener("mouseleave", onMouseLeave);

    // Animation loop
    let elapsed = 0;
    const animate = () => {
      const { w, h } = dimRef.current;
      if (!w || !h) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, w, h);
      elapsed += 0.016; // ~60fps tick

      const [r, g, b] = getThemeColor();
      const mouse = mouseRef.current;
      const particles = particlesRef.current;
      const connDist = connectionDistance;
      const mouseConnDist = mouseConnectionDistance;

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse repulsion — gently push particles away so they don't cluster
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseConnDist * 0.5 && dist > 1) {
            const force = mouseAttractionStrength * 0.5;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Velocity damping
        p.vx *= 0.998;
        p.vy *= 0.998;

        // Clamp speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = particleSpeed * 2;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges with buffer
        const buf = 20;
        if (p.x < -buf) p.x = w + buf;
        if (p.x > w + buf) p.x = -buf;
        if (p.y < -buf) p.y = h + buf;
        if (p.y > h + buf) p.y = -buf;
      }

      // Draw connections between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connDist) {
            const alpha = (1 - dist / connDist) * 0.25 * opacity;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Mouse proximity — brighten nearby particle-to-particle connections
      if (mouse.active) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist >= connDist) continue;

            // Check if midpoint is near cursor
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            const mdx = mouse.x - mx;
            const mdy = mouse.y - my;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

            if (mDist < mouseConnDist) {
              const boost = (1 - mDist / mouseConnDist) * 0.3 * opacity;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(${r},${g},${b},${boost})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const pulse = Math.sin(elapsed * 1.5 + p.pulseOffset) * 0.3 + 0.7;
        const alpha = p.baseAlpha * pulse * opacity;
        const drawSize = p.size * (0.8 + pulse * 0.4);

        // Outer glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, drawSize * 3);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      parent.removeEventListener("mousemove", onMouseMove);
      parent.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [
    connectionDistance,
    mouseConnectionDistance,
    mouseAttractionStrength,
    particleSpeed,
    opacity,
    getThemeColor,
    initParticles,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-[1] ${className}`}
    />
  );
};

export default ConstellationNetwork;
