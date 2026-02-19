import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Animated 3D galaxy / starfield background using Three.js.
 * Renders a full-viewport canvas with multi-layered stars, colored nebula
 * particles, shooting stars, and mouse-responsive parallax.
 * Only visible in dark mode.
 */
const StarfieldBg = () => {
  const mountRef = useRef(null);
  const [isDark, setIsDark] = useState(
    typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
  );

  /* ── Theme watcher ── */
  useEffect(() => {
    const root = document.documentElement;
    const check = () => setIsDark(root.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  /* ── Three.js scene ── */
  useEffect(() => {
    const container = mountRef.current;
    if (!container || !isDark) return;

    /* Respect reduced-motion preference */
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isMobile = window.innerWidth < 768;

    /* --- Setup --- */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    /* --- Helper: create a star particle layer --- */
    const createStarLayer = (count, size, opacity, spread, color = 0xffffff) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color,
        size,
        transparent: true,
        opacity,
        sizeAttenuation: true,
        depthWrite: false,
      });
      return new THREE.Points(geo, mat);
    };

    /* Star layers (reduced on mobile) */
    const m = isMobile ? 0.4 : 1;
    const farStars = createStarLayer(Math.floor(6000 * m), 0.6, 0.9, 1200);
    const midStars = createStarLayer(Math.floor(2000 * m), 1.4, 0.7, 900, 0xaabbff);
    const nearStars = createStarLayer(Math.floor(600 * m), 2.2, 0.5, 600, 0xccddff);
    scene.add(farStars, midStars, nearStars);

    /* --- Nebula particles (indigo ↔ cyan colored) --- */
    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaCount = Math.floor(400 * m);
    const nebulaPos = new Float32Array(nebulaCount * 3);
    const nebulaCol = new Float32Array(nebulaCount * 3);
    for (let i = 0; i < nebulaCount; i++) {
      nebulaPos[i * 3] = (Math.random() - 0.5) * 800;
      nebulaPos[i * 3 + 1] = (Math.random() - 0.5) * 800;
      nebulaPos[i * 3 + 2] = (Math.random() - 0.5) * 800;
      const t = Math.random();
      /* Gradient from indigo (#6366F1) to cyan (#06B6D4) */
      nebulaCol[i * 3] = 0.39 * (1 - t) + 0.02 * t;
      nebulaCol[i * 3 + 1] = 0.4 * (1 - t) + 0.71 * t;
      nebulaCol[i * 3 + 2] = 0.95 * (1 - t) + 0.83 * t;
    }
    nebulaGeo.setAttribute("position", new THREE.BufferAttribute(nebulaPos, 3));
    nebulaGeo.setAttribute("color", new THREE.BufferAttribute(nebulaCol, 3));
    const nebulaMat = new THREE.PointsMaterial({
      size: 15,
      transparent: true,
      opacity: 0.12,
      vertexColors: true,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nebula = new THREE.Points(nebulaGeo, nebulaMat);
    scene.add(nebula);

    /* --- Shooting stars --- */
    const shootingStarCount = isMobile ? 3 : 6;
    const shootingStars = [];
    for (let i = 0; i < shootingStarCount; i++) {
      const geo = new THREE.BufferGeometry();
      const trailLength = 20;
      const positions = new Float32Array(trailLength * 3);
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
      });
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      shootingStars.push({
        line,
        active: false,
        progress: 0,
        speed: 0,
        startX: 0,
        startY: 0,
        startZ: 0,
        dirX: 0,
        dirY: 0,
        dirZ: 0,
        nextTrigger: Math.random() * 5 + 2,
        trailLength,
      });
    }

    const triggerShootingStar = (star) => {
      star.active = true;
      star.progress = 0;
      star.speed = 3 + Math.random() * 4;
      star.startX = (Math.random() - 0.5) * 800;
      star.startY = 200 + Math.random() * 200;
      star.startZ = (Math.random() - 0.5) * 400;
      const angle = Math.PI * 0.6 + Math.random() * 0.6;
      star.dirX = Math.cos(angle) * 8;
      star.dirY = -Math.sin(angle) * 8;
      star.dirZ = (Math.random() - 0.5) * 2;
      star.line.material.opacity = 0.8;
    };

    /* --- Mouse tracking --- */
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    /* --- Animation loop --- */
    let animationId;
    const clock = new THREE.Clock();
    let elapsed = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      elapsed += delta;

      if (!prefersReduced) {
        /* Slow rotation for depth parallax */
        farStars.rotation.y = elapsed * 0.01;
        farStars.rotation.x = elapsed * 0.005;
        midStars.rotation.y = elapsed * 0.015;
        midStars.rotation.x = -elapsed * 0.008;
        nearStars.rotation.y = elapsed * 0.02;
        nearStars.rotation.x = elapsed * 0.003;
        nebula.rotation.y = elapsed * 0.004;
        nebula.rotation.z = elapsed * 0.002;

        /* Shooting star animation */
        shootingStars.forEach((star) => {
          if (!star.active) {
            star.nextTrigger -= delta;
            if (star.nextTrigger <= 0) {
              triggerShootingStar(star);
              star.nextTrigger = Math.random() * 8 + 4;
            }
            return;
          }

          star.progress += delta * star.speed;
          const positions = star.line.geometry.attributes.position.array;
          for (let j = 0; j < star.trailLength; j++) {
            const t = star.progress - j * 0.15;
            positions[j * 3] = star.startX + star.dirX * t;
            positions[j * 3 + 1] = star.startY + star.dirY * t;
            positions[j * 3 + 2] = star.startZ + star.dirZ * t;
          }
          star.line.geometry.attributes.position.needsUpdate = true;

          if (star.progress > 12) {
            star.line.material.opacity *= 0.9;
            if (star.line.material.opacity < 0.01) {
              star.active = false;
              star.line.material.opacity = 0;
            }
          }
        });
      }

      /* Mouse parallax (always active for responsiveness) */
      camera.position.x += (mouseX * 50 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 50 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    /* --- Resize handler --- */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    /* --- Cleanup --- */
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isDark]);

  return (
    <div
      ref={mountRef}
      className={`fixed inset-0 -z-10 transition-opacity duration-700 ${
        isDark ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ pointerEvents: "none" }}
    />
  );
};

export default StarfieldBg;
