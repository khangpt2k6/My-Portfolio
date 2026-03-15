import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const StarfieldBg = () => {
  const mountRef = useRef(null);
  const [isDark, setIsDark] = useState(
    typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const root = document.documentElement;
    const check = () => setIsDark(root.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !isDark) return;

    const isMobile = window.innerWidth < 768;
    const m = isMobile ? 0.4 : 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const disposables = { geometries: [], materials: [], textures: [] };

    /* ── Round star texture ── */
    const starCanvas = document.createElement("canvas");
    starCanvas.width = 32;
    starCanvas.height = 32;
    const ctx = starCanvas.getContext("2d");
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.3, "rgba(255,255,255,0.8)");
    gradient.addColorStop(0.7, "rgba(255,255,255,0.15)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    const starTexture = new THREE.CanvasTexture(starCanvas);
    disposables.textures.push(starTexture);

    /* ── Create star layer ── */
    const createStars = (count, minSize, maxSize, spread) => {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const twinkleOffsets = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * spread;
        positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
        positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
        sizes[i] = minSize + Math.random() * (maxSize - minSize);
        twinkleOffsets[i] = Math.random() * Math.PI * 2;
      }

      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      geo.setAttribute("aTwinkle", new THREE.BufferAttribute(twinkleOffsets, 1));

      const mat = new THREE.PointsMaterial({
        map: starTexture,
        size: maxSize,
        transparent: true,
        opacity: 1,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: 0xffffff,
      });

      disposables.geometries.push(geo);
      disposables.materials.push(mat);
      return new THREE.Points(geo, mat);
    };

    /* ── Star layers — small dots only ── */
    const bgStars = createStars(Math.floor(6000 * m), 0.3, 1.0, 1800);
    const midStars = createStars(Math.floor(2000 * m), 0.8, 1.8, 1200);
    const fgStars = createStars(Math.floor(500 * m), 1.5, 2.5, 800);
    scene.add(bgStars, midStars, fgStars);

    /* ── Shooting stars ── */
    const shootingStarCount = isMobile ? 2 : 5;
    const trailLength = 20;
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
        startX: 0, startY: 0, startZ: 0,
        dirX: 0, dirY: 0, dirZ: 0,
        nextTrigger: 2 + Math.random() * 4,
        trailLength,
      });
    }

    const triggerShootingStar = (star) => {
      star.active = true;
      star.progress = 0;
      star.speed = 5 + Math.random() * 5;
      star.startX = (Math.random() - 0.5) * 600;
      star.startY = 200 + Math.random() * 200;
      star.startZ = (Math.random() - 0.5) * 300;
      const angle = Math.PI * 0.6 + Math.random() * 0.5;
      star.dirX = Math.cos(angle) * 12;
      star.dirY = -Math.sin(angle) * 12;
      star.dirZ = (Math.random() - 0.5) * 2;
      star.line.material.opacity = 0.8;
    };

    /* ── Mouse parallax ── */
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    /* ── Animation ── */
    let animationId;
    const clock = new THREE.Clock();
    let elapsed = 0;
    let paused = false;

    const onVisibilityChange = () => {
      if (document.hidden) {
        paused = true;
        cancelAnimationFrame(animationId);
      } else {
        paused = false;
        clock.getDelta();
        animate();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const animate = () => {
      if (paused) return;
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      elapsed += delta;

      /* Slow drift rotation */
      bgStars.rotation.y = elapsed * 0.008;
      bgStars.rotation.x = elapsed * 0.003;
      midStars.rotation.y = elapsed * 0.012;
      midStars.rotation.x = -elapsed * 0.005;
      fgStars.rotation.y = elapsed * 0.018;
      fgStars.rotation.x = elapsed * 0.004;

      /* Twinkling */
      bgStars.material.opacity = 0.6 + Math.sin(elapsed * 0.3) * 0.1;
      midStars.material.opacity = 0.7 + Math.sin(elapsed * 0.5 + 1) * 0.15;
      fgStars.material.opacity = 0.8 + Math.sin(elapsed * 0.7 + 2) * 0.2;

      /* Shooting stars */
      shootingStars.forEach((star) => {
        if (!star.active) {
          star.nextTrigger -= delta;
          if (star.nextTrigger <= 0) {
            triggerShootingStar(star);
            star.nextTrigger = 3 + Math.random() * 5;
          }
          return;
        }
        star.progress += delta * star.speed;
        const positions = star.line.geometry.attributes.position.array;
        for (let j = 0; j < star.trailLength; j++) {
          const t = star.progress - j * 0.1;
          positions[j * 3] = star.startX + star.dirX * t;
          positions[j * 3 + 1] = star.startY + star.dirY * t;
          positions[j * 3 + 2] = star.startZ + star.dirZ * t;
        }
        star.line.geometry.attributes.position.needsUpdate = true;
        if (star.progress > 8) {
          star.line.material.opacity *= 0.9;
          if (star.line.material.opacity < 0.01) {
            star.active = false;
            star.line.material.opacity = 0;
          }
        }
      });

      /* Mouse parallax */
      camera.position.x += (mouseX * 30 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 30 - camera.position.y) * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      paused = true;
      cancelAnimationFrame(animationId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      disposables.geometries.forEach((g) => g.dispose());
      disposables.materials.forEach((mat) => mat.dispose());
      disposables.textures.forEach((tex) => tex.dispose());
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
      style={{ pointerEvents: "none", backgroundColor: "#000" }}
    />
  );
};

export default StarfieldBg;
