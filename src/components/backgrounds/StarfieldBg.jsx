import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Immersive 3D galaxy starfield background using Three.js.
 *
 * Features:
 *  - 4 star layers with depth-based sizing and twinkling
 *  - 2 nebula color layers (indigo-cyan + purple-pink) with additive blending
 *  - Frequent shooting stars with 30-point trails
 *  - Central cosmic glow sprite
 *  - Mouse parallax (translation + rotation)
 *  - Mobile performance scaling (0.35x particles)
 *  - prefers-reduced-motion support
 *  - Dark-mode-only via MutationObserver with CSS opacity transition
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
    if (!container || !isDark) return; // Skip entire WebGL pipeline in light mode

    /* Respect reduced-motion preference */
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isMobile = window.innerWidth < 768;
    const m = isMobile ? 0.35 : 1;

    /* ================================================================
       SETUP
       ================================================================ */
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

    /* Track all disposables so cleanup is thorough */
    const disposables = { geometries: [], materials: [], textures: [] };

    /* ================================================================
       HELPER: create a star particle layer (single color)
       ================================================================ */
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
      disposables.geometries.push(geo);
      disposables.materials.push(mat);
      return new THREE.Points(geo, mat);
    };

    /* ================================================================
       STAR LAYERS (4 layers for depth)
       ================================================================ */
    const farStars = createStarLayer(
      Math.floor(12000 * m), 0.8, 1.0, 1500
    );
    const midStars = createStarLayer(
      Math.floor(4000 * m), 1.8, 0.85, 1000, 0xaabbff
    );
    const nearStars = createStarLayer(
      Math.floor(1000 * m), 2.8, 0.7, 600, 0xccddff
    );
    const brightStars = createStarLayer(
      Math.floor(300 * m), 4.5, 0.95, 800
    );
    scene.add(farStars, midStars, nearStars, brightStars);

    /* ================================================================
       NEBULA LAYER 1 — indigo (#6366F1) to cyan (#06B6D4)
       ================================================================ */
    const createNebula = (count, size, opacity, spread, colorA, colorB) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const cA = new THREE.Color(colorA);
      const cB = new THREE.Color(colorB);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
        const t = Math.random();
        col[i * 3] = cA.r * (1 - t) + cB.r * t;
        col[i * 3 + 1] = cA.g * (1 - t) + cB.g * t;
        col[i * 3 + 2] = cA.b * (1 - t) + cB.b * t;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      const mat = new THREE.PointsMaterial({
        size,
        transparent: true,
        opacity,
        vertexColors: true,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      disposables.geometries.push(geo);
      disposables.materials.push(mat);
      return new THREE.Points(geo, mat);
    };

    const nebula1 = createNebula(
      Math.floor(500 * m), 35, 0.18, 700, "#6366F1", "#06B6D4"
    );
    const nebula2 = createNebula(
      Math.floor(300 * m), 40, 0.12, 600, "#9333EA", "#EC4899"
    );
    scene.add(nebula1, nebula2);

    /* ================================================================
       CENTRAL COSMIC GLOW (radial gradient sprite)
       ================================================================ */
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 256;
    glowCanvas.height = 256;
    const gctx = glowCanvas.getContext("2d");
    const grd = gctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, "rgba(99, 102, 241, 0.3)");
    grd.addColorStop(0.4, "rgba(99, 102, 241, 0.1)");
    grd.addColorStop(1, "rgba(99, 102, 241, 0)");
    gctx.fillStyle = grd;
    gctx.fillRect(0, 0, 256, 256);
    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const spriteMat = new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(600, 600, 1);
    scene.add(sprite);
    disposables.textures.push(glowTexture);
    disposables.materials.push(spriteMat);

    /* ================================================================
       SHOOTING STARS
       ================================================================ */
    const shootingStarCount = isMobile ? 3 : 8;
    const trailLength = 30;
    const shootingStars = [];

    for (let i = 0; i < shootingStarCount; i++) {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(trailLength * 3);
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
      });
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      disposables.geometries.push(geo);
      disposables.materials.push(mat);
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
        nextTrigger: Math.random() * 2.5 + 1.5,
        trailLength,
      });
    }

    const triggerShootingStar = (star) => {
      star.active = true;
      star.progress = 0;
      star.speed = 4 + Math.random() * 4;
      /* Start from random upper-hemisphere position */
      star.startX = (Math.random() - 0.5) * 800;
      star.startY = 150 + Math.random() * 300;
      star.startZ = (Math.random() - 0.5) * 400;
      /* Direction: mostly downward-left with slight randomization */
      const angle = Math.PI * 0.55 + Math.random() * 0.7;
      star.dirX = Math.cos(angle) * 10;
      star.dirY = -Math.sin(angle) * 10;
      star.dirZ = (Math.random() - 0.5) * 3;
      star.line.material.opacity = 0.9;
    };

    /* ================================================================
       MOUSE TRACKING
       ================================================================ */
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    /* ================================================================
       ANIMATION LOOP
       ================================================================ */
    let animationId;
    const clock = new THREE.Clock();
    let elapsed = 0;
    let paused = false;

    /* Pause when tab is hidden to save GPU cycles */
    const onVisibilityChange = () => {
      if (document.hidden) {
        paused = true;
        cancelAnimationFrame(animationId);
      } else {
        paused = false;
        clock.getDelta(); // flush stale delta
        animate();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const animate = () => {
      if (paused) return;
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      elapsed += delta;

      if (!prefersReduced) {
        /* ── Twinkling (opacity oscillation) ── */
        farStars.material.opacity = 0.85 + Math.sin(elapsed * 0.4) * 0.15;
        midStars.material.opacity = 0.7 + Math.sin(elapsed * 0.6 + 1.5) * 0.15;
        nearStars.material.opacity = 0.55 + Math.sin(elapsed * 0.8 + 3.0) * 0.15;
        brightStars.material.opacity = 0.7 + Math.sin(elapsed * 1.2 + 0.5) * 0.3;

        /* ── Layer rotations ── */
        farStars.rotation.y = elapsed * 0.02;
        farStars.rotation.x = elapsed * 0.008;
        midStars.rotation.y = elapsed * 0.025;
        midStars.rotation.x = -elapsed * 0.012;
        nearStars.rotation.y = elapsed * 0.03;
        nearStars.rotation.x = elapsed * 0.005;
        brightStars.rotation.y = elapsed * 0.018;

        nebula1.rotation.y = elapsed * 0.006;
        nebula1.rotation.z = elapsed * 0.003;
        nebula2.rotation.y = -elapsed * 0.005;
        nebula2.rotation.x = elapsed * 0.004;

        /* ── Shooting stars ── */
        shootingStars.forEach((star) => {
          if (!star.active) {
            star.nextTrigger -= delta;
            if (star.nextTrigger <= 0) {
              triggerShootingStar(star);
              star.nextTrigger = 1.5 + Math.random() * 2.5;
            }
            return;
          }

          star.progress += delta * star.speed;
          const positions = star.line.geometry.attributes.position.array;
          for (let j = 0; j < star.trailLength; j++) {
            const t = star.progress - j * 0.12;
            positions[j * 3] = star.startX + star.dirX * t;
            positions[j * 3 + 1] = star.startY + star.dirY * t;
            positions[j * 3 + 2] = star.startZ + star.dirZ * t;
          }
          star.line.geometry.attributes.position.needsUpdate = true;

          if (star.progress > 10) {
            star.line.material.opacity *= 0.88;
            if (star.line.material.opacity < 0.01) {
              star.active = false;
              star.line.material.opacity = 0;
            }
          }
        });
      }

      /* ── Mouse parallax (translation + rotation) ── */
      camera.position.x += (mouseX * 60 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 60 - camera.position.y) * 0.03;
      camera.rotation.y += (mouseX * 0.02 - camera.rotation.y) * 0.02;
      camera.rotation.x += (-mouseY * 0.02 - camera.rotation.x) * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    /* ================================================================
       RESIZE HANDLER
       ================================================================ */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    /* ================================================================
       CLEANUP
       ================================================================ */
    return () => {
      paused = true;
      cancelAnimationFrame(animationId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);

      /* Dispose all tracked resources */
      disposables.geometries.forEach((g) => g.dispose());
      disposables.materials.forEach((mat) => mat.dispose());
      disposables.textures.forEach((tex) => tex.dispose());

      /* Also traverse the scene for anything we may have missed */
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (obj.material.map) obj.material.map.dispose();
          obj.material.dispose();
        }
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
