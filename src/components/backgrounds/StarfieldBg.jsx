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
      3000
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

    /* ── Nebula cloud texture ── */
    const createNebulaTexture = (baseR, baseG, baseB, size = 256) => {
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const cx = c.getContext("2d");
      const half = size / 2;

      // Multi-layered radial gradients for volumetric cloud feel
      for (let layer = 0; layer < 5; layer++) {
        const offsetX = (Math.random() - 0.5) * size * 0.3;
        const offsetY = (Math.random() - 0.5) * size * 0.3;
        const radius = half * (0.5 + Math.random() * 0.5);
        const g = cx.createRadialGradient(
          half + offsetX, half + offsetY, 0,
          half + offsetX, half + offsetY, radius
        );
        const alphaCore = 0.06 + Math.random() * 0.06;
        g.addColorStop(0, `rgba(${baseR},${baseG},${baseB},${alphaCore})`);
        g.addColorStop(0.3, `rgba(${baseR},${baseG},${baseB},${alphaCore * 0.6})`);
        g.addColorStop(0.7, `rgba(${baseR},${baseG},${baseB},${alphaCore * 0.2})`);
        g.addColorStop(1, `rgba(${baseR},${baseG},${baseB},0)`);
        cx.fillStyle = g;
        cx.fillRect(0, 0, size, size);
      }

      const tex = new THREE.CanvasTexture(c);
      disposables.textures.push(tex);
      return tex;
    };

    /* ── Create star layer with color tints ── */
    const createStars = (count, minSize, maxSize, spread, colorVariation = false) => {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      // Star color palette — realistic astronomical colors
      const starColors = [
        [1.0, 1.0, 1.0],       // White
        [0.7, 0.8, 1.0],       // Blue-white (hot stars)
        [0.6, 0.7, 1.0],       // Blue (O/B type)
        [1.0, 0.95, 0.8],      // Yellow-white (F type)
        [1.0, 0.85, 0.6],      // Yellow (G type, sun-like)
        [1.0, 0.7, 0.5],       // Orange (K type)
        [1.0, 0.5, 0.4],       // Red (M type)
        [0.8, 0.85, 1.0],      // Pale blue
      ];

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * spread;
        positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
        positions[i * 3 + 2] = (Math.random() - 0.5) * spread;

        if (colorVariation) {
          const c = starColors[Math.floor(Math.random() * starColors.length)];
          // Most stars white, some tinted
          const tintStrength = Math.random() < 0.3 ? 1.0 : 0.15;
          colors[i * 3] = THREE.MathUtils.lerp(1.0, c[0], tintStrength);
          colors[i * 3 + 1] = THREE.MathUtils.lerp(1.0, c[1], tintStrength);
          colors[i * 3 + 2] = THREE.MathUtils.lerp(1.0, c[2], tintStrength);
        } else {
          colors[i * 3] = 1.0;
          colors[i * 3 + 1] = 1.0;
          colors[i * 3 + 2] = 1.0;
        }
      }

      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.PointsMaterial({
        map: starTexture,
        size: maxSize,
        transparent: true,
        opacity: 1,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      });

      disposables.geometries.push(geo);
      disposables.materials.push(mat);
      return new THREE.Points(geo, mat);
    };

    /* ── Star layers with color variation ── */
    const bgStars = createStars(Math.floor(6000 * m), 0.3, 1.0, 1800, true);
    const midStars = createStars(Math.floor(2000 * m), 0.8, 1.8, 1200, true);
    const fgStars = createStars(Math.floor(500 * m), 1.5, 2.5, 800, true);
    scene.add(bgStars, midStars, fgStars);

    /* ── Galactic core glow — bright center of the galaxy ── */
    const coreGlowCanvas = document.createElement("canvas");
    coreGlowCanvas.width = 512;
    coreGlowCanvas.height = 512;
    const coreCtx = coreGlowCanvas.getContext("2d");

    // Layered glow: warm center → cool edges
    const coreG1 = coreCtx.createRadialGradient(256, 256, 0, 256, 256, 256);
    coreG1.addColorStop(0, "rgba(255, 230, 180, 0.12)");
    coreG1.addColorStop(0.15, "rgba(255, 200, 150, 0.08)");
    coreG1.addColorStop(0.35, "rgba(180, 140, 255, 0.04)");
    coreG1.addColorStop(0.6, "rgba(100, 80, 200, 0.02)");
    coreG1.addColorStop(1, "rgba(0, 0, 0, 0)");
    coreCtx.fillStyle = coreG1;
    coreCtx.fillRect(0, 0, 512, 512);

    // Secondary warm bloom
    const coreG2 = coreCtx.createRadialGradient(256, 256, 0, 256, 256, 180);
    coreG2.addColorStop(0, "rgba(255, 240, 200, 0.1)");
    coreG2.addColorStop(0.5, "rgba(255, 180, 120, 0.04)");
    coreG2.addColorStop(1, "rgba(0, 0, 0, 0)");
    coreCtx.fillStyle = coreG2;
    coreCtx.fillRect(0, 0, 512, 512);

    const coreTexture = new THREE.CanvasTexture(coreGlowCanvas);
    disposables.textures.push(coreTexture);
    const coreMat = new THREE.SpriteMaterial({
      map: coreTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 1,
    });
    const coreSprite = new THREE.Sprite(coreMat);
    coreSprite.scale.set(900, 500, 1);
    coreSprite.position.set(-100, 30, -400);
    disposables.materials.push(coreMat);
    scene.add(coreSprite);

    /* ── Nebula clouds — volumetric colored fog ── */
    const nebulaConfigs = isMobile
      ? [
          { r: 90, g: 60, b: 180, x: -300, y: 150, z: -500, sx: 700, sy: 450 },
          { r: 40, g: 80, b: 180, x: 250, y: -100, z: -600, sx: 600, sy: 400 },
        ]
      : [
          // Purple nebula — upper left
          { r: 90, g: 60, b: 180, x: -300, y: 200, z: -500, sx: 800, sy: 500 },
          // Deep blue nebula — right
          { r: 40, g: 80, b: 180, x: 350, y: -50, z: -600, sx: 700, sy: 500 },
          // Teal/cyan wisp — center bottom
          { r: 30, g: 140, b: 180, x: 50, y: -200, z: -450, sx: 600, sy: 350 },
          // Magenta/pink nebula — far left
          { r: 150, g: 40, b: 120, x: -450, y: -100, z: -700, sx: 550, sy: 400 },
          // Warm amber nebula — near core
          { r: 180, g: 120, b: 60, x: -80, y: 60, z: -500, sx: 500, sy: 300 },
        ];

    const nebulae = nebulaConfigs.map((cfg) => {
      const tex = createNebulaTexture(cfg.r, cfg.g, cfg.b);
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 1,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(cfg.sx, cfg.sy, 1);
      sprite.position.set(cfg.x, cfg.y, cfg.z);
      disposables.materials.push(mat);
      scene.add(sprite);
      return { sprite, baseX: cfg.x, baseY: cfg.y, speed: 0.1 + Math.random() * 0.15 };
    });


    /* ── Dense star cluster around galactic core ── */
    const createCoreStars = (count, spread) => {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        // Gaussian distribution — dense near center
        const r1 = Math.random() + Math.random() + Math.random();
        const r2 = Math.random() + Math.random() + Math.random();
        const gaussX = (r1 / 3 - 0.5) * spread;
        const gaussY = (r2 / 3 - 0.5) * spread * 0.5;

        positions[i * 3] = gaussX - 100;
        positions[i * 3 + 1] = gaussY + 30;
        positions[i * 3 + 2] = -400 + (Math.random() - 0.5) * 200;

        // Warm tint near core
        const warmth = Math.random();
        if (warmth < 0.4) {
          colors[i * 3] = 1.0;
          colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
          colors[i * 3 + 2] = 0.7 + Math.random() * 0.2;
        } else if (warmth < 0.7) {
          colors[i * 3] = 0.8 + Math.random() * 0.2;
          colors[i * 3 + 1] = 0.85 + Math.random() * 0.15;
          colors[i * 3 + 2] = 1.0;
        } else {
          colors[i * 3] = 1.0;
          colors[i * 3 + 1] = 1.0;
          colors[i * 3 + 2] = 1.0;
        }
      }

      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.PointsMaterial({
        map: starTexture,
        size: 1.2,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      });

      disposables.geometries.push(geo);
      disposables.materials.push(mat);
      return new THREE.Points(geo, mat);
    };

    const coreStars = createCoreStars(Math.floor(1500 * m), 600);
    scene.add(coreStars);

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
      coreStars.rotation.y = elapsed * 0.006;

      /* Twinkling */
      bgStars.material.opacity = 0.6 + Math.sin(elapsed * 0.3) * 0.1;
      midStars.material.opacity = 0.7 + Math.sin(elapsed * 0.5 + 1) * 0.15;
      fgStars.material.opacity = 0.8 + Math.sin(elapsed * 0.7 + 2) * 0.2;
      coreStars.material.opacity = 0.5 + Math.sin(elapsed * 0.2) * 0.1;

      /* Nebula gentle drift */
      nebulae.forEach((n, i) => {
        n.sprite.position.x = n.baseX + Math.sin(elapsed * n.speed + i * 2) * 15;
        n.sprite.position.y = n.baseY + Math.cos(elapsed * n.speed * 0.7 + i) * 10;
      });

      /* Core glow pulse */
      coreSprite.material.opacity = 0.85 + Math.sin(elapsed * 0.15) * 0.15;
      coreSprite.scale.x = 900 + Math.sin(elapsed * 0.1) * 20;
      coreSprite.scale.y = 500 + Math.cos(elapsed * 0.12) * 10;

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
