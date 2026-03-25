import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import apps from "../data/apps";
import { useWindows } from "./WindowContext";

const BASE_SIZE = 36;
const MAX_ADDITION = 16; // extra px at peak magnification
const DISTANCE = 120; // px range of magnification effect

function DockIcon({ app, mouseX, dockLeft, index }) {
  const { windows, openApp, focusApp, minimizeApp } = useWindows();
  const ref = useRef(null);
  const IconComponent = app.IconComponent;
  const win = windows[app.id];
  const isOpen = win?.isOpen;
  const [tooltip, setTooltip] = useState(false);

  /* Distance-based magnification using motion values */
  const size = useMotionValue(BASE_SIZE);

  useEffect(() => {
    const unsubscribe = mouseX.on("change", (mx) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const iconCenter = rect.left + rect.width / 2;
      const dist = Math.abs(mx - iconCenter);
      const scale = Math.max(0, 1 - dist / DISTANCE);
      // Smooth cubic falloff for natural feel
      const smoothScale = scale * scale * (3 - 2 * scale);
      size.set(BASE_SIZE + MAX_ADDITION * smoothScale);
    });
    return unsubscribe;
  }, [mouseX, size]);

  const springSize = useSpring(size, { stiffness: 300, damping: 22 });
  const [currentSize, setCurrentSize] = useState(BASE_SIZE);

  useEffect(() => {
    const unsubSize = springSize.on("change", (v) => setCurrentSize(Math.round(v)));
    return unsubSize;
  }, [springSize]);

  const handleClick = () => {
    if (win?.isOpen && !win.isMinimized) {
      // If open and visible, minimize (toggle)
      minimizeApp(app.id);
    } else if (win?.isOpen && win.isMinimized) {
      // If minimized, restore
      focusApp(app.id);
      // Un-minimize by opening again
      openApp(app.id);
    } else {
      openApp(app.id);
    }
  };

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col items-center"
      style={{ width: springSize, height: springSize }}
      onMouseEnter={() => setTooltip(true)}
      onMouseLeave={() => setTooltip(false)}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            className="absolute -top-9 px-3 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap text-black/80 dark:text-white"
            style={{
              background: "var(--lg-menu)",
              backdropFilter: "var(--lg-blur)",
              WebkitBackdropFilter: "var(--lg-blur)",
              border: "0.5px solid var(--lg-menu-border)",
              boxShadow: "var(--lg-menu-shadow)",
            }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.1 }}
          >
            {app.title}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="w-full h-full flex items-center justify-center drop-shadow-lg hover:drop-shadow-xl transition-all"
        onClick={handleClick}
        whileTap={{ scale: 0.85 }}
      >
        <IconComponent size={currentSize} />
      </motion.button>

      {/* Open indicator dot */}
      {isOpen && (
        <motion.div
          className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-white/70"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
        />
      )}
    </motion.div>
  );
}

export default function Dock() {
  const dockRef = useRef(null);
  const mouseX = useMotionValue(-1000);
  const [dockLeft, setDockLeft] = useState(0);

  const sorted = [...apps].sort((a, b) => a.dockOrder - b.dockOrder);

  const onMouseMove = useCallback((e) => {
    mouseX.set(e.clientX);
  }, [mouseX]);

  const onMouseLeave = useCallback(() => {
    mouseX.set(-1000);
  }, [mouseX]);

  useEffect(() => {
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      setDockLeft(rect.left);
    }
  }, []);

  return (
    <motion.div
      className="absolute bottom-1 left-1/2 -translate-x-1/2 z-[9000]"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 22 }}
    >
      <div
        ref={dockRef}
        className="flex items-end gap-[6px] px-3 py-2 rounded-[22px]"
        style={{
          background: "var(--lg-dock)",
          backdropFilter: "var(--lg-blur)",
          WebkitBackdropFilter: "var(--lg-blur)",
          border: "0.5px solid var(--lg-dock-border)",
          boxShadow: "var(--lg-dock-shadow)",
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {sorted.map((app, i) => (
          <DockIcon
            key={app.id}
            app={app}
            mouseX={mouseX}
            dockLeft={dockLeft}
            index={i}
          />
        ))}
      </div>
    </motion.div>
  );
}
