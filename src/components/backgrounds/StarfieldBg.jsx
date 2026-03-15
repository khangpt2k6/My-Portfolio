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
    const m = isMobile ? 0.45 : 1;

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

    /* ── Star dot texture ── */
    const starCanvas = document.createElement("canvas");
    starCanvas.width = 64;
    starCanvas.height = 64;
    const sCtx = starCanvas.getContext("2d");
    const sGrad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    sGrad.addColorStop(0, "rgba(255,255,255,1)");
    sGrad.addColorStop(0.08, "rgba(255,255,255,0.85)");
    sGrad.addColorStop(0.25, "rgba(255,255,255,0.25)");
    sGrad.addColorStop(0.55, "rgba(255,255,255,0.04)");
    sGrad.addColorStop(1, "rgba(255,255,255,0)");
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 64, 64);
    const starTexture = new THREE.CanvasTexture(starCanvas);
    disposables.textures.push(starTexture);

    /* ── Bloom texture for bright stars ── */
    const createBloomTexture = (r, g, b, size = 128) => {
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const cx = c.getContext("2d");
      const half = size / 2;
      const g0 = cx.createRadialGradient(half, half, 0, half, half, half);
      g0.addColorStop(0, `rgba(255,255,255,0.85)`);
      g0.addColorStop(0.05, `rgba(${r},${g},${b},0.5)`);
      g0.addColorStop(0.18, `rgba(${r},${g},${b},0.15)`);
      g0.addColorStop(0.45, `rgba(${r},${g},${b},0.03)`);
      g0.addColorStop(1, `rgba(${r},${g},${b},0)`);
      cx.fillStyle = g0;
      cx.fillRect(0, 0, size, size);
      cx.globalCompositeOperation = "lighter";
      for (let a = 0; a < 4; a++) {
        cx.save();
        cx.translate(half, half);
        cx.rotate((a * Math.PI) / 4);
        const spike = cx.createLinearGradient(0, -half, 0, half);
        spike.addColorStop(0, `rgba(${r},${g},${b},0)`);
        spike.addColorStop(0.43, `rgba(${r},${g},${b},0.04)`);
        spike.addColorStop(0.5, `rgba(255,255,255,0.12)`);
        spike.addColorStop(0.57, `rgba(${r},${g},${b},0.04)`);
        spike.addColorStop(1, `rgba(${r},${g},${b},0)`);
        cx.fillStyle = spike;
        cx.fillRect(-1, -half, 2, size);
        cx.restore();
      }
      const tex = new THREE.CanvasTexture(c);
      disposables.textures.push(tex);
      return tex;
    };

    /* ── Nebula cloud texture ── */
    const createNebulaTexture = (baseR, baseG, baseB, size = 512, intensity = 1) => {
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const cx = c.getContext("2d");
      const half = size / 2;
      const layers = 8 + Math.floor(Math.random() * 4);
      for (let layer = 0; layer < layers; layer++) {
        const offsetX = (Math.random() - 0.5) * size * 0.6;
        const offsetY = (Math.random() - 0.5) * size * 0.6;
        const radius = half * (0.5 + Math.random() * 0.5);
        const g = cx.createRadialGradient(
          half + offsetX, half + offsetY, 0,
          half + offsetX, half + offsetY, radius
        );
        const a = (0.008 + Math.random() * 0.012) * intensity;
        const rV = Math.max(0, Math.min(255, baseR + (Math.random() - 0.5) * 20));
        const gV = Math.max(0, Math.min(255, baseG + (Math.random() - 0.5) * 12));
        const bV = Math.max(0, Math.min(255, baseB + (Math.random() - 0.5) * 18));
        g.addColorStop(0, `rgba(${rV},${gV},${bV},${a})`);
        g.addColorStop(0.3, `rgba(${rV},${gV},${bV},${a * 0.5})`);
        g.addColorStop(0.6, `rgba(${rV},${gV},${bV},${a * 0.15})`);
        g.addColorStop(1, `rgba(${rV},${gV},${bV},0)`);
        cx.fillStyle = g;
        cx.fillRect(0, 0, size, size);
      }
      const tex = new THREE.CanvasTexture(c);
      disposables.textures.push(tex);
      return tex;
    };

    /* ══════════════════════════════════════════════
       Sparkling star particles with per-star twinkle
       Different sizes, individual sparkle phases
       ══════════════════════════════════════════════ */
    const createSparkleStars = (count, minSize, maxSize, spread) => {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const twinklePhase = new Float32Array(count);
      const twinkleSpeed = new Float32Array(count);
      const baseBrightness = new Float32Array(count);
      // Velocity for drifting
      const velocities = new Float32Array(count * 3);

      const palette = [
        [1.0, 1.0, 1.0],
        [0.92, 0.9, 1.0],
        [0.85, 0.82, 1.0],
        [1.0, 0.95, 0.98],
        [0.95, 0.88, 1.0],
        [0.9, 0.95, 1.0],
      ];

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * spread;
        positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
        positions[i * 3 + 2] = (Math.random() - 0.5) * spread;

        // Varied sizes — mostly tiny, some medium, rare big
        const sizeRoll = Math.random();
        if (sizeRoll < 0.65) {
          sizes[i] = minSize + Math.random() * (maxSize - minSize) * 0.3;
        } else if (sizeRoll < 0.9) {
          sizes[i] = minSize + (maxSize - minSize) * (0.3 + Math.random() * 0.4);
        } else {
          sizes[i] = minSize + (maxSize - minSize) * (0.7 + Math.random() * 0.3);
        }

        // Individual twinkle timing
        twinklePhase[i] = Math.random() * Math.PI * 2;
        twinkleSpeed[i] = 0.5 + Math.random() * 2.5; // each star sparkles at different speed
        baseBrightness[i] = 0.3 + Math.random() * 0.7;

        // Slow drift velocity
        const driftSpeed = 0.02 + Math.random() * 0.08;
        const angle1 = Math.random() * Math.PI * 2;
        const angle2 = Math.random() * Math.PI * 2;
        velocities[i * 3] = Math.cos(angle1) * Math.cos(angle2) * driftSpeed;
        velocities[i * 3 + 1] = Math.sin(angle2) * driftSpeed;
        velocities[i * 3 + 2] = Math.sin(angle1) * Math.cos(angle2) * driftSpeed * 0.3;

        const c = palette[Math.floor(Math.random() * palette.length)];
        const t = Math.random() < 0.2 ? 0.5 : 0.05;
        colors[i * 3] = THREE.MathUtils.lerp(1.0, c[0], t);
        colors[i * 3 + 1] = THREE.MathUtils.lerp(1.0, c[1], t);
        colors[i * 3 + 2] = THREE.MathUtils.lerp(1.0, c[2], t);
      }

      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      // Custom shader for per-particle size & twinkling
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uTexture: { value: starTexture },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          varying float vSize;
          uniform float uTime;
          uniform float uPixelRatio;

          void main() {
            vColor = color;
            vSize = size;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          varying vec3 vColor;
          varying float vSize;

          void main() {
            vec4 texColor = texture2D(uTexture, gl_PointCoord);
            gl_FragColor = vec4(vColor, 1.0) * texColor;
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      disposables.geometries.push(geo);
      disposables.materials.push(mat);

      const points = new THREE.Points(geo, mat);
      return {
        points,
        positions,
        sizes,
        velocities,
        twinklePhase,
        twinkleSpeed,
        baseBrightness,
        baseSizes: new Float32Array(sizes),
        count,
        spread,
      };
    };

    // Multiple layers with different size ranges
    const starLayer1 = createSparkleStars(Math.floor(6000 * m), 0.3, 1.2, 2200);  // Tiny distant
    const starLayer2 = createSparkleStars(Math.floor(2500 * m), 0.8, 2.5, 1500);  // Medium
    const starLayer3 = createSparkleStars(Math.floor(600 * m), 1.5, 4.0, 1000);   // Close, larger
    const starLayer4 = createSparkleStars(Math.floor(150 * m), 2.5, 6.0, 800);    // Big bright ones

    const allStarLayers = [starLayer1, starLayer2, starLayer3, starLayer4];
    allStarLayers.forEach((l) => scene.add(l.points));

    /* ── Bloom stars ── */
    const bloomMagenta = createBloomTexture(190, 60, 160);
    const bloomViolet = createBloomTexture(140, 90, 210);
    const bloomTeal = createBloomTexture(80, 160, 200);
    const bloomWhite = createBloomTexture(190, 180, 230);
    const bloomTextures = [bloomMagenta, bloomViolet, bloomTeal, bloomWhite];
    const prominentStars = [];
    const prominentCount = isMobile ? 4 : 10;

    for (let i = 0; i < prominentCount; i++) {
      const tex = bloomTextures[i % bloomTextures.length];
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.2 + Math.random() * 0.25,
      });
      const sprite = new THREE.Sprite(mat);
      const scale = 12 + Math.random() * 30;
      sprite.scale.set(scale, scale, 1);
      sprite.position.set(
        (Math.random() - 0.5) * 1600,
        (Math.random() - 0.5) * 1000,
        -100 - Math.random() * 500
      );
      disposables.materials.push(mat);
      scene.add(sprite);
      prominentStars.push({
        sprite,
        baseOpacity: mat.opacity,
        pulseSpeed: 0.15 + Math.random() * 0.4,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    /* ── Nebula clouds ── */
    const nebulaConfigs = isMobile
      ? [
          { r: 40, g: 15, b: 70, x: -150, y: 100, z: -850, sx: 1200, sy: 900, i: 0.8 },
          { r: 12, g: 40, b: 55, x: 180, y: -80, z: -900, sx: 1000, sy: 800, i: 0.7 },
          { r: 18, g: 20, b: 60, x: 0, y: 0, z: -880, sx: 1400, sy: 1000, i: 0.6 },
        ]
      : [
          { r: 35, g: 12, b: 65, x: -450, y: 250, z: -900, sx: 1300, sy: 900, i: 0.8 },
          { r: 40, g: 15, b: 70, x: 300, y: -200, z: -880, sx: 1200, sy: 850, i: 0.7 },
          { r: 10, g: 35, b: 50, x: 450, y: 280, z: -920, sx: 1100, sy: 800, i: 0.7 },
          { r: 8, g: 30, b: 45, x: -400, y: -250, z: -910, sx: 1000, sy: 700, i: 0.6 },
          { r: 15, g: 18, b: 55, x: 0, y: 0, z: -850, sx: 1100, sy: 800, i: 0.8 },
          { r: 12, g: 15, b: 50, x: -200, y: -100, z: -870, sx: 1000, sy: 700, i: 0.6 },
          { r: 45, g: 10, b: 40, x: 200, y: 100, z: -840, sx: 800, sy: 550, i: 0.5 },
          { r: 18, g: 10, b: 40, x: 0, y: 0, z: -980, sx: 2400, sy: 1600, i: 0.4 },
        ];

    const nebulae = nebulaConfigs.map((cfg) => {
      const tex = createNebulaTexture(cfg.r, cfg.g, cfg.b, 512, cfg.i || 1);
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
      return { sprite, baseX: cfg.x, baseY: cfg.y, speed: 0.02 + Math.random() * 0.03 };
    });

    /* ── Shooting stars ── */
    const shootingStarCount = isMobile ? 2 : 4;
    const trailLength = 20;
    const shootingStars = [];

    for (let i = 0; i < shootingStarCount; i++) {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(trailLength * 3);
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.LineBasicMaterial({
        color: 0xbbaadd,
        transparent: true,
        opacity: 0,
      });
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      disposables.geometries.push(geo);
      disposables.materials.push(mat);
      shootingStars.push({
        line, active: false, progress: 0, speed: 0,
        startX: 0, startY: 0, startZ: 0,
        dirX: 0, dirY: 0, dirZ: 0,
        nextTrigger: 4 + Math.random() * 8,
        trailLength,
      });
    }

    const triggerShootingStar = (star) => {
      star.active = true;
      star.progress = 0;
      star.speed = 4 + Math.random() * 4;
      star.startX = (Math.random() - 0.5) * 700;
      star.startY = 250 + Math.random() * 200;
      star.startZ = (Math.random() - 0.5) * 300;
      const angle = Math.PI * 0.55 + Math.random() * 0.5;
      star.dirX = Math.cos(angle) * 12;
      star.dirY = -Math.sin(angle) * 12;
      star.dirZ = (Math.random() - 0.5) * 2;
      star.line.material.opacity = 0.5;
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

      /* ── Per-particle sparkle + drift ── */
      allStarLayers.forEach((layer, layerIdx) => {
        const posAttr = layer.points.geometry.attributes.position;
        const sizeAttr = layer.points.geometry.attributes.size;
        const halfSpread = layer.spread / 2;

        for (let i = 0; i < layer.count; i++) {
          // Drift movement
          posAttr.array[i * 3] += layer.velocities[i * 3] * delta;
          posAttr.array[i * 3 + 1] += layer.velocities[i * 3 + 1] * delta;
          posAttr.array[i * 3 + 2] += layer.velocities[i * 3 + 2] * delta;

          // Wrap around when leaving bounds
          for (let axis = 0; axis < 3; axis++) {
            if (posAttr.array[i * 3 + axis] > halfSpread) {
              posAttr.array[i * 3 + axis] = -halfSpread;
            } else if (posAttr.array[i * 3 + axis] < -halfSpread) {
              posAttr.array[i * 3 + axis] = halfSpread;
            }
          }

          // Per-star sparkle — size pulsation
          const sparkle = Math.sin(elapsed * layer.twinkleSpeed[i] + layer.twinklePhase[i]);
          const brightness = layer.baseBrightness[i] + sparkle * 0.3;
          sizeAttr.array[i] = layer.baseSizes[i] * Math.max(0.15, brightness);
        }

        posAttr.needsUpdate = true;
        sizeAttr.needsUpdate = true;

        // Pass time to shader
        layer.points.material.uniforms.uTime.value = elapsed;

        // Slow overall rotation per layer
        const rotSpeed = [0.003, 0.005, 0.008, 0.012][layerIdx] || 0.005;
        layer.points.rotation.y = elapsed * rotSpeed;
        layer.points.rotation.x = elapsed * rotSpeed * 0.4 * (layerIdx % 2 === 0 ? 1 : -1);
      });

      /* Prominent star pulse */
      prominentStars.forEach((ps) => {
        ps.sprite.material.opacity =
          ps.baseOpacity * (0.7 + 0.3 * Math.sin(elapsed * ps.pulseSpeed + ps.pulsePhase));
      });

      /* Nebula drift */
      nebulae.forEach((n, i) => {
        n.sprite.position.x = n.baseX + Math.sin(elapsed * n.speed + i * 1.3) * 5;
        n.sprite.position.y = n.baseY + Math.cos(elapsed * n.speed * 0.6 + i) * 3;
      });

      /* Shooting stars */
      shootingStars.forEach((star) => {
        if (!star.active) {
          star.nextTrigger -= delta;
          if (star.nextTrigger <= 0) {
            triggerShootingStar(star);
            star.nextTrigger = 5 + Math.random() * 12;
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
      camera.position.x += (mouseX * 18 - camera.position.x) * 0.01;
      camera.position.y += (-mouseY * 18 - camera.position.y) * 0.01;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      allStarLayers.forEach((l) => {
        l.points.material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
      });
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
      style={{ pointerEvents: "none", backgroundColor: "#050208" }}
    />
  );
};

export default StarfieldBg;
